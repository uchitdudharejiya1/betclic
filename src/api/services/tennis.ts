import {apiClient} from '../client/apiClient';
import type {ApiResponse} from '../../types/api/common';
import type {
  RawTennisEvent,
  RawTennisScore,
  RawTennisOdds,
  RawTennisEventOdds,
  RawTennisSport,
} from '../../types/api/tennis';

const c = () => apiClient('tennis');

// Cache configuration
const CACHE_DURATION = {
  SPORTS: 24 * 60 * 60 * 1000, // 24 hours
  EVENTS: 5 * 60 * 1000,       // 5 minutes
  SCORES: 30 * 1000,          // 30 seconds
} as const;

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class TennisCache {
  private cache = new Map<string, CacheEntry<any>>();
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.getTTL(key)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
  
  private getTTL(key: string): number {
    if (key.startsWith('sports:')) return CACHE_DURATION.SPORTS;
    if (key.startsWith('events:')) return CACHE_DURATION.EVENTS;
    if (key.startsWith('scores:')) return CACHE_DURATION.SCORES;
    return CACHE_DURATION.EVENTS;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const cache = new TennisCache();

// Request deduplication
class RequestDeduplicator {
  private pending = new Map<string, Promise<any>>();
  
  async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }
    
    const promise = fn();
    this.pending.set(key, promise);
    
    try {
      const result = await promise;
      return result;
    } finally {
      this.pending.delete(key);
    }
  }
}

const deduplicator = new RequestDeduplicator();

// Debug metrics
class TennisMetrics {
  private metrics = {
    totalTournaments: 0,
    tournamentsQueried: 0,
    scoreRequestsMade: 0,
    scoreRequestsSkipped: 0,
    apiCallsSaved: 0,
  };
  
  recordTournamentCount(count: number): void {
    this.metrics.totalTournaments = count;
  }
  
  recordTournamentQueried(): void {
    this.metrics.tournamentsQueried++;
  }
  
  recordScoreRequest(): void {
    this.metrics.scoreRequestsMade++;
  }
  
  recordScoreRequestSkipped(): void {
    this.metrics.scoreRequestsSkipped++;
  }
  
  recordApiCallsSaved(count: number): void {
    this.metrics.apiCallsSaved += count;
  }
  
  getReport(): string {
    return `Tennis API Metrics:\n` +
           `- Total tournaments: ${this.metrics.totalTournaments}\n` +
           `- Tournaments queried: ${this.metrics.tournamentsQueried}\n` +
           `- Score requests made: ${this.metrics.scoreRequestsMade}\n` +
           `- Score requests skipped: ${this.metrics.scoreRequestsSkipped}\n` +
           `- API calls saved: ${this.metrics.apiCallsSaved}`;
  }
  
  reset(): void {
    this.metrics = {
      totalTournaments: 0,
      tournamentsQueried: 0,
      scoreRequestsMade: 0,
      scoreRequestsSkipped: 0,
      apiCallsSaved: 0,
    };
  }
}

const metrics = new TennisMetrics();

// Helper function to check if a tennis score is valid
export const hasValidTennisScore = (event: RawTennisEvent | RawTennisScore): boolean => {
  return event.scores != null && 
         Array.isArray(event.scores) && 
         event.scores.length >= 2 &&
         event.scores.every(score => score.name != null && score.score != null);
};

// Helper function to extract home/away scores from array structure
export const extractTennisScores = (event: RawTennisEvent | RawTennisScore): {home: string, away: string} => {
  if (!hasValidTennisScore(event)) {
    return {home: '-', away: '-'};
  }
  
  const scores = event.scores!;
  // First score is typically home team, second is away team
  return {
    home: scores[0]?.score || '-',
    away: scores[1]?.score || '-'
  };
};

// Helper function to check if tournament has active matches
const hasActiveMatches = (events: RawTennisEvent[]): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return events.some(event => {
    const commenceTime = new Date(event.commence_time);
    // Include live matches, today's matches, and completed matches (within 7 days)
    return (commenceTime <= now && !event.completed) || 
           (commenceTime >= today && commenceTime < tomorrow) ||
           (event.completed && commenceTime >= weekAgo);
  });
};


export const tennisService = {
  sports: async (signal?: AbortSignal) => {
    const cacheKey = 'sports:all';
    const cached = cache.get<RawTennisSport[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    return deduplicator.deduplicate(cacheKey, async () => {
      const response = await c()
        .get<RawTennisSport[]>('/sports', {
          signal,
          params: {
            all: true,
          },
        })
        .then(r => r.data);
      
      const filtered = response.filter((sport: any) => 
        sport.key.includes('tennis') || 
        sport.title.toLowerCase().includes('tennis')
      );
      
      cache.set(cacheKey, filtered);
      metrics.recordTournamentCount(filtered.length);
      return filtered;
    });
  },

  events: async (signal?: AbortSignal) => {
    const cacheKey = 'events:all';
    const cached = cache.get<RawTennisEvent[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    return deduplicator.deduplicate(cacheKey, async () => {
      const tennisSports = await tennisService.sports(signal);
      
      const eventPromises = tennisSports.map(async (sport: any) => {
        try {
          const response = await c()
            .get<RawTennisEvent[]>(`/sports/${sport.key}/events`, {
              signal,
            })
            .then(r => r.data);
          return response;
        } catch (error) {
          return [];
        }
      });
      
      const eventResults = await Promise.all(eventPromises);
      const allEvents = eventResults.flat();
      
      cache.set(cacheKey, allEvents);
      return allEvents;
    });
  },

  liveEvents: async (signal?: AbortSignal) => {
    try {
      const events = await tennisService.events(signal);
      const now = new Date();
      return events.filter(event => {
        const commenceTime = new Date(event.commence_time);
        return commenceTime <= now && !event.completed;
      });
    } catch (error) {
      throw error;
    }
  },

  scores: async (signal?: AbortSignal) => {
    try {
      const allEvents = await tennisService.events(signal);
      const tennisSports = await tennisService.sports(signal);
      
      // Group events by sport key
      const eventsBySport = new Map<string, RawTennisEvent[]>();
      allEvents.forEach(event => {
        if (!eventsBySport.has(event.sport_key)) {
          eventsBySport.set(event.sport_key, []);
        }
        eventsBySport.get(event.sport_key)!.push(event);
      });
      
      // Only fetch scores for tournaments with active matches
      const activeTournaments: string[] = [];
      tennisSports.forEach(sport => {
        const sportEvents = eventsBySport.get(sport.key) || [];
        if (hasActiveMatches(sportEvents)) {
          activeTournaments.push(sport.key);
          metrics.recordTournamentQueried();
        } else {
          metrics.recordScoreRequestSkipped();
        }
      });
      
      // Calculate API calls saved
      const skippedCalls = tennisSports.length - activeTournaments.length;
      metrics.recordApiCallsSaved(skippedCalls);
      
      const scorePromises = activeTournaments.map(async (sportKey: string) => {
        try {
          metrics.recordScoreRequest();
          const cacheKey = `scores:${sportKey}`;
          const cached = cache.get<RawTennisScore[]>(cacheKey);
          
          if (cached) {
            return cached;
          }
          
          const response = await c()
            .get<RawTennisScore[]>(`/sports/${sportKey}/scores`, {
              signal,
            })
            .then(r => r.data);
          
          cache.set(cacheKey, response);
          return response;
        } catch (error) {
          return [];
        }
      });
      
      const scoreResults = await Promise.all(scorePromises);
      return scoreResults.flat();
    } catch (error) {
      throw error;
    }
  },

  odds: async (signal?: AbortSignal) => {
    try {
      const tennisSports = await tennisService.sports(signal);
      
      const oddsPromises = tennisSports.map(async (sport: any) => {
        try {
          const response = await c()
            .get<RawTennisOdds[]>(`/sports/${sport.key}/odds`, {
              signal,
              params: {
                regions: 'us,uk,eu',
                markets: 'h2h',
                oddsFormat: 'decimal',
              },
            })
            .then(r => r.data);
          return response;
        } catch (error) {
          return [];
        }
      });
      
      const oddsResults = await Promise.all(oddsPromises);
      return oddsResults.flat();
    } catch (error) {
      throw error;
    }
  },

  oddsForEvent: async (eventId: string, sportKey: string, signal?: AbortSignal) => {
    const response = await c()
      .get<RawTennisEventOdds[]>(
        `/sports/${sportKey}/events/${eventId}/odds`,
        {
          signal,
          params: {
            regions: 'us,uk,eu',
            markets: 'h2h',
            oddsFormat: 'decimal',
          },
        }
      )
      .then(r => r.data);
    return response;
  },
  
  eventsByDate: async (date: string, signal?: AbortSignal) => {
    try {
      const allEvents = await tennisService.events(signal);
      const targetDate = new Date(date);
      
      // For tennis, include events from 7 days ago up to 7 days ahead
      // This ensures completed matches are shown like volleyball
      const startDate = new Date(targetDate);
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 7);
      
      return allEvents.filter(event => {
        const eventDate = new Date(event.commence_time);
        return eventDate >= startDate && eventDate < endDate;
      });
    } catch (error) {
      throw error;
    }
  },

  // Debug and utility methods
  getMetrics: () => metrics.getReport(),
  resetMetrics: () => metrics.reset(),
  clearCache: () => cache.clear(),
};
