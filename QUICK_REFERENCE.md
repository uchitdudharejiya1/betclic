# API-Sports Live Games - Quick Reference

## 🎯 The Problem

```
❌ Error: {live: 'The Live field do not exist.'}
```

**Why?** v1 APIs (Basketball, Hockey, Volleyball, MMA) don't support `live` parameter.

---

## ✅ The Solution

| Sport | API | Parameter | Filter |
|-------|-----|-----------|--------|
| Football | v3 | `live=all` | ❌ Not needed |
| Basketball | v1 | `date=YYYY-MM-DD` | ✅ Client-side |
| Hockey | v1 | `date=YYYY-MM-DD` | ✅ Client-side |
| Volleyball | v1 | `date=YYYY-MM-DD` | ✅ Client-side |
| MMA | v1 | `date=YYYY-MM-DD` | ✅ Client-side |

---

## 📋 Live Status Codes

```typescript
FOOTBALL:    ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'INT']
BASKETBALL:  ['Q1', 'Q2', 'Q3', 'Q4', 'HT', 'OT', 'BT']
HOCKEY:      ['P1', 'P2', 'P3', 'OT', 'PT', 'BT']
VOLLEYBALL:  ['S1', 'S2', 'S3', 'S4', 'S5']
BASEBALL:    ['IN1', 'IN2', 'IN3', 'IN4', 'IN5', 'IN6', 'IN7', 'IN8', 'IN9']
MMA:         ['IN', 'PF', 'LIVE', 'EOR', 'WO']
```

---

## 🔧 Implementation Pattern

### Football (v3) - Direct
```typescript
GET /fixtures?live=all
// Returns only live fixtures
```

### v1 APIs - Date + Filter
```typescript
// 1. Fetch today's games
GET /games?date=2026-05-31

// 2. Filter by status
games.filter(g => isLiveStatus.basketball(g.status.short))
```

---

## 💻 Code Examples

### Fetch Live Games
```typescript
// All sports use same API
const liveGames = await basketballService.liveGames();
const liveFights = await mmaService.liveFights();
const liveFixtures = await footballService.liveFixtures();
```

### Check Live Status
```typescript
import {isLiveStatus} from './constants/liveStatus';

if (isLiveStatus.basketball('Q2')) {
  // Game is live
}
```

---

## 📁 Files Modified

```
✅ /src/constants/liveStatus.ts          (NEW)
✅ /src/utils/liveGamesHelper.ts         (NEW)
✅ /src/api/services/basketball.ts       (UPDATED)
✅ /src/api/services/hockey.ts           (UPDATED)
✅ /src/api/services/volleyball.ts       (UPDATED)
✅ /src/api/services/mma.ts              (UPDATED)
✅ /src/api/services/football.ts         (NO CHANGE)
```

---

## ⚡ Quick Test

```bash
# Run app
npm start

# Check logs - should see:
✅ [api:res] 200 https://v1.basketball.api-sports.io/games
✅ [api:res:data] {results: X, response: [...]}

# No more errors:
❌ [api:err] {live: 'The Live field do not exist.'}
```

---

## 🎓 Key Takeaways

1. **Football v3** = Only API with `live` parameter
2. **All v1 APIs** = Use `date` + client-side filtering
3. **Status codes** = Different for each sport
4. **Helper functions** = Centralized in `/utils/liveGamesHelper.ts`
5. **Type-safe** = TypeScript guards prevent errors

---

## 📚 Full Documentation

- **Complete Guide:** `LIVE_GAMES_API_DOCUMENTATION.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`
