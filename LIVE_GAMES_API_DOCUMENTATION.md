# Live Games API Documentation

## Overview

This document explains how to fetch live games/matches/fights from API-Sports for different sports. Each sport has different API behavior and requirements.

---

## API Endpoints & Live Status Support

### ⚽ Football (v3 API)

**Endpoint:** `GET /fixtures`

**Live Support:** ✅ Dedicated `live` parameter

**Query Parameters:**
- `live=all` - Fetch all live fixtures

**Live Status Values:**
- `1H` - First Half
- `HT` - Halftime
- `2H` - Second Half
- `ET` - Extra Time
- `BT` - Break Time
- `P` - Penalty
- `INT` - Interrupted

**Example Request:**
```bash
curl --request GET \
  --url 'https://v3.football.api-sports.io/fixtures?live=all' \
  --header 'x-apisports-key: YOUR_API_KEY'
```

**Fallback (Date-based):**
```bash
curl --request GET \
  --url 'https://v3.football.api-sports.io/fixtures?date=2026-05-31' \
  --header 'x-apisports-key: YOUR_API_KEY'
```

---

### 🏀 Basketball (v1 API)

**Endpoint:** `GET /games`

**Live Support:** ❌ No dedicated `live` parameter

**Query Parameters:**
- `date=YYYY-MM-DD` - Fetch games by date (required)

**Live Status Values:**
- `Q1` - Quarter 1
- `Q2` - Quarter 2
- `Q3` - Quarter 3
- `Q4` - Quarter 4
- `HT` - Halftime
- `OT` - Overtime
- `BT` - Break Time

**Example Request:**
```bash
curl --request GET \
  --url 'https://v1.basketball.api-sports.io/games?date=2026-05-31' \
  --header 'x-apisports-key: YOUR_API_KEY'
```

**Implementation Strategy:**
1. Fetch today's games using `date` parameter
2. Filter response by live status values (Q1, Q2, Q3, Q4, HT, OT, BT)

---

### 🏒 Hockey (v1 API)

**Endpoint:** `GET /games`

**Live Support:** ❌ No dedicated `live` parameter

**Query Parameters:**
- `date=YYYY-MM-DD` - Fetch games by date (required)

**Live Status Values:**
- `P1` - Period 1
- `P2` - Period 2
- `P3` - Period 3
- `OT` - Overtime
- `PT` - Penalty Time
- `BT` - Break Time

**Example Request:**
```bash
curl --request GET \
  --url 'https://v1.hockey.api-sports.io/games?date=2026-05-31' \
  --header 'x-apisports-key: YOUR_API_KEY'
```

**Implementation Strategy:**
1. Fetch today's games using `date` parameter
2. Filter response by live status values (P1, P2, P3, OT, PT, BT)

---

### 🏐 Volleyball (v1 API)

**Endpoint:** `GET /games`

**Live Support:** ❌ No dedicated `live` parameter

**Query Parameters:**
- `date=YYYY-MM-DD` - Fetch games by date (required)

**Live Status Values:**
- `S1` - Set 1
- `S2` - Set 2
- `S3` - Set 3
- `S4` - Set 4
- `S5` - Set 5

**Example Request:**
```bash
curl --request GET \
  --url 'https://v1.volleyball.api-sports.io/games?date=2026-05-31' \
  --header 'x-apisports-key: YOUR_API_KEY'
```

**Implementation Strategy:**
1. Fetch today's games using `date` parameter
2. Filter response by live status values (S1, S2, S3, S4, S5)

---

### ⚾ Baseball (v1 API)

**Endpoint:** `GET /games`

**Live Support:** ❌ No dedicated `live` parameter

**Query Parameters:**
- `date=YYYY-MM-DD` - Fetch games by date (required)

**Live Status Values:**
- `IN1` - Inning 1
- `IN2` - Inning 2
- `IN3` - Inning 3
- `IN4` - Inning 4
- `IN5` - Inning 5
- `IN6` - Inning 6
- `IN7` - Inning 7
- `IN8` - Inning 8
- `IN9` - Inning 9

**Example Request:**
```bash
curl --request GET \
  --url 'https://v1.baseball.api-sports.io/games?date=2026-05-31' \
  --header 'x-apisports-key: YOUR_API_KEY'
```

**Implementation Strategy:**
1. Fetch today's games using `date` parameter
2. Filter response by live status values (IN1-IN9)

---

### 🥊 MMA (v1 API)

**Endpoint:** `GET /fights`

**Live Support:** ❌ No dedicated `live` parameter

**Query Parameters:**
- `date=YYYY-MM-DD` - Fetch fights by date (required)

**Live Status Values:**
- `IN` - In Progress
- `PF` - Pre-Fight
- `LIVE` - Live
- `EOR` - End of Round
- `WO` - Walkout

**Example Request:**
```bash
curl --request GET \
  --url 'https://v1.mma.api-sports.io/fights?date=2026-05-31' \
  --header 'x-apisports-key: YOUR_API_KEY'
```

**Implementation Strategy:**
1. Fetch today's fights using `date` parameter
2. Filter response by live status values (IN, PF, LIVE, EOR, WO)

---

## Implementation Summary

### API Behavior by Sport

| Sport | API Version | Endpoint | Live Parameter | Date Parameter | Filter Required |
|-------|-------------|----------|----------------|----------------|-----------------|
| Football | v3 | `/fixtures` | ✅ `live=all` | ✅ `date=YYYY-MM-DD` | ❌ |
| Basketball | v1 | `/games` | ❌ | ✅ `date=YYYY-MM-DD` | ✅ |
| Hockey | v1 | `/games` | ❌ | ✅ `date=YYYY-MM-DD` | ✅ |
| Volleyball | v1 | `/games` | ❌ | ✅ `date=YYYY-MM-DD` | ✅ |
| Baseball | v1 | `/games` | ❌ | ✅ `date=YYYY-MM-DD` | ✅ |
| MMA | v1 | `/fights` | ❌ | ✅ `date=YYYY-MM-DD` | ✅ |

### Key Differences

1. **Football (v3)**: Only sport with dedicated `live=all` parameter
2. **All v1 APIs**: Require date-based fetching + client-side filtering by status

---

## TypeScript Implementation

### Service Layer Pattern

```typescript
// For Football (v3) - Direct live parameter
export const footballService = {
  liveFixtures: (signal?: AbortSignal) =>
    apiClient('football')
      .get<ApiResponse<RawFootballFixture[]>>('/fixtures', {
        params: {live: 'all'},
        signal,
      })
      .then(r => r.data),
};

// For v1 APIs - Date + Filter pattern
export const basketballService = {
  liveGames: async (signal?: AbortSignal) => {
    const response = await apiClient('basketball')
      .get<ApiResponse<RawBasketballGame[]>>('/games', {
        params: {date: getTodayDate()},
        signal,
      })
      .then(r => r.data);
    
    return {
      ...response,
      response: (response.response ?? []).filter(game => 
        isLiveStatus.basketball(game.status.short)
      ),
      results: (response.response ?? []).filter(game => 
        isLiveStatus.basketball(game.status.short)
      ).length,
    };
  },
};
```

---

## Error Handling

### Common Errors

1. **`{live: 'The Live field do not exist.'}`**
   - **Cause**: Using `live` parameter on v1 APIs
   - **Solution**: Use `date` parameter instead

2. **Empty Response**
   - **Cause**: No games/fights scheduled for the date
   - **Solution**: Handle empty arrays gracefully

3. **Rate Limiting**
   - **Cause**: Too many requests
   - **Solution**: Implement request throttling

---

## Files Modified

1. **`/src/constants/liveStatus.ts`** - Live status constants and type guards
2. **`/src/utils/liveGamesHelper.ts`** - Reusable helper functions
3. **`/src/api/services/basketball.ts`** - Updated to use date filtering
4. **`/src/api/services/hockey.ts`** - Updated to use date filtering
5. **`/src/api/services/volleyball.ts`** - Updated to use date filtering
6. **`/src/api/services/mma.ts`** - Updated to use date filtering
7. **`/src/api/services/football.ts`** - Already using `live=all` (no changes needed)

---

## Testing

### Test Live Status Detection

```typescript
import {isLiveStatus} from './constants/liveStatus';

// Basketball
console.log(isLiveStatus.basketball('Q1')); // true
console.log(isLiveStatus.basketball('FT')); // false

// Football
console.log(isLiveStatus.football('1H')); // true
console.log(isLiveStatus.football('NS')); // false
```

### Test API Calls

```typescript
// Football - Direct live parameter
const footballLive = await footballService.liveFixtures();

// Basketball - Date + Filter
const basketballLive = await basketballService.liveGames();
```

---

## Production Considerations

1. **Caching**: Cache responses for 30-60 seconds to reduce API calls
2. **Error Handling**: Always handle empty responses and API errors
3. **Fallback**: If live endpoint fails, fallback to date-based approach
4. **Polling**: For live updates, poll every 30-60 seconds
5. **Rate Limits**: Respect API rate limits (varies by subscription)

---

## References

- API-Sports Documentation: https://api-sports.io/documentation
- Football API: https://api-sports.io/documentation/football/v3
- Basketball API: https://api-sports.io/documentation/basketball/v1
- Hockey API: https://api-sports.io/documentation/hockey/v1
- Volleyball API: https://api-sports.io/documentation/volleyball/v1
- MMA API: https://api-sports.io/documentation/mma/v1
- Baseball API: https://api-sports.io/documentation/baseball/v1
