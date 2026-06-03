# API-Sports Live Games Flow Diagram

## 🔄 Request Flow Comparison

### ⚽ Football (v3 API) - Server-Side Filtering

```
┌─────────────────┐
│   Your App      │
└────────┬────────┘
         │
         │ basketballService.liveFixtures()
         ▼
┌─────────────────────────────────────────┐
│  GET /fixtures?live=all                 │
│  https://v3.football.api-sports.io      │
└────────┬────────────────────────────────┘
         │
         │ API filters live fixtures
         ▼
┌─────────────────────────────────────────┐
│  Response: {                            │
│    results: 50,                         │
│    response: [                          │
│      {status: {short: '1H'}, ...},      │
│      {status: {short: '2H'}, ...},      │
│      ...                                │
│    ]                                    │
│  }                                      │
└────────┬────────────────────────────────┘
         │
         │ ✅ Only live fixtures returned
         ▼
┌─────────────────┐
│   Your App      │
│   (50 live)     │
└─────────────────┘
```

---

### 🏀 Basketball/Hockey/Volleyball/MMA (v1 APIs) - Client-Side Filtering

```
┌─────────────────┐
│   Your App      │
└────────┬────────┘
         │
         │ basketballService.liveGames()
         ▼
┌─────────────────────────────────────────┐
│  Step 1: Get Today's Date               │
│  getTodayDate() → "2026-05-31"          │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Step 2: Fetch All Today's Games        │
│  GET /games?date=2026-05-31             │
│  https://v1.basketball.api-sports.io    │
└────────┬────────────────────────────────┘
         │
         │ API returns ALL games (live + scheduled + finished)
         ▼
┌─────────────────────────────────────────┐
│  Response: {                            │
│    results: 150,                        │
│    response: [                          │
│      {status: {short: 'Q2'}, ...},  ✅  │
│      {status: {short: 'FT'}, ...},  ❌  │
│      {status: {short: 'Q4'}, ...},  ✅  │
│      {status: {short: 'NS'}, ...},  ❌  │
│      ...                                │
│    ]                                    │
│  }                                      │
└────────┬────────────────────────────────┘
         │
         │ 150 total games
         ▼
┌─────────────────────────────────────────┐
│  Step 3: Client-Side Filtering          │
│  transformToLiveResponse()              │
│                                         │
│  Filter by live status:                 │
│  ['Q1', 'Q2', 'Q3', 'Q4', 'HT', 'OT']   │
└────────┬────────────────────────────────┘
         │
         │ Filter applied
         ▼
┌─────────────────────────────────────────┐
│  Filtered Response: {                   │
│    results: 5,                          │
│    response: [                          │
│      {status: {short: 'Q2'}, ...},  ✅  │
│      {status: {short: 'Q4'}, ...},  ✅  │
│      {status: {short: 'HT'}, ...},  ✅  │
│      ...                                │
│    ]                                    │
│  }                                      │
└────────┬────────────────────────────────┘
         │
         │ ✅ Only 5 live games returned
         ▼
┌─────────────────┐
│   Your App      │
│   (5 live)      │
└─────────────────┘
```

---

## 🔍 Status Filtering Logic

### Before (Broken)
```
┌──────────────────────┐
│  v1 API Request      │
│  {live: 'all'}       │  ❌ Parameter not supported
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Error Response      │
│  {live: 'The Live    │
│   field do not       │
│   exist.'}           │
└──────────────────────┘
```

### After (Fixed)
```
┌──────────────────────┐
│  v1 API Request      │
│  {date: '2026-05-31'}│  ✅ Correct parameter
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Success Response    │
│  All games for date  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Client Filter       │
│  isLiveStatus()      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Live Games Only     │
└──────────────────────┘
```

---

## 🎯 Live Status Decision Tree

```
                    ┌─────────────┐
                    │  Game Data  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Check Sport  │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   Basketball          Football           Hockey
        │                  │                  │
        ▼                  ▼                  ▼
  ┌──────────┐      ┌──────────┐      ┌──────────┐
  │ Status:  │      │ Status:  │      │ Status:  │
  │ Q1-Q4    │      │ 1H, 2H   │      │ P1-P3    │
  │ HT, OT   │      │ HT, ET   │      │ OT, PT   │
  └────┬─────┘      └────┬─────┘      └────┬─────┘
       │                 │                  │
       ▼                 ▼                  ▼
  ┌─────────┐       ┌─────────┐       ┌─────────┐
  │ Is Live │       │ Is Live │       │ Is Live │
  │   ✅    │       │   ✅    │       │   ✅    │
  └─────────┘       └─────────┘       └─────────┘
```

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  matchRepository.live('basketball')                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│  basketballService.liveGames()                           │
│  ├─ getTodayDate()                                       │
│  ├─ apiClient.get('/games', {date})                      │
│  └─ transformToLiveResponse(response, 'basketball')      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Helper Layer                          │
│  /utils/liveGamesHelper.ts                               │
│  ├─ getTodayDate() → "2026-05-31"                        │
│  ├─ filterLiveGames(games, 'basketball')                 │
│  └─ transformToLiveResponse(response, 'basketball')      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Constants Layer                       │
│  /constants/liveStatus.ts                                │
│  ├─ LIVE_STATUS.BASKETBALL = ['Q1', 'Q2', ...]           │
│  └─ isLiveStatus.basketball(status)                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Request Lifecycle

```
1. User Action
   └─> App requests live games

2. Service Layer
   ├─> Determine sport type
   ├─> Get current date (for v1 APIs)
   └─> Make API request

3. API Response
   ├─> Football: Returns filtered data
   └─> v1 APIs: Returns all data

4. Client Processing (v1 only)
   ├─> Filter by live status codes
   ├─> Update results count
   └─> Return filtered response

5. UI Update
   └─> Display live games only
```

---

## 🎨 Visual Summary

```
┌─────────────────────────────────────────────────────────┐
│                   API-Sports v3 (Football)               │
│  ┌──────────┐         ┌──────────┐                      │
│  │ Request  │ ──────> │ Response │                      │
│  │ live=all │         │ (live)   │                      │
│  └──────────┘         └──────────┘                      │
│                                                          │
│  ✅ Server filters                                       │
│  ✅ Direct support                                       │
│  ✅ Efficient                                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              API-Sports v1 (Basketball, etc.)            │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │ Request  │ -> │ Response │ -> │  Filter  │          │
│  │ date=... │    │  (all)   │    │ (client) │          │
│  └──────────┘    └──────────┘    └──────────┘          │
│                                         │               │
│                                         ▼               │
│                                   ┌──────────┐          │
│                                   │ Response │          │
│                                   │ (live)   │          │
│                                   └──────────┘          │
│                                                          │
│  ✅ Client filters                                       │
│  ✅ Date-based                                           │
│  ✅ Flexible                                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Performance Comparison

### Football (v3)
```
Request:  1 API call
Filter:   Server-side
Data:     Only live games
Speed:    ⚡⚡⚡ Fast
```

### v1 APIs
```
Request:  1 API call
Filter:   Client-side
Data:     All games → filtered
Speed:    ⚡⚡ Fast (minimal overhead)
```

**Note:** Client-side filtering adds negligible overhead since we're just checking status strings.
