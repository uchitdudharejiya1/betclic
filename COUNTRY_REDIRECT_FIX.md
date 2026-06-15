# Country-Specific URL Redirect Fix

## Problem
The app was not opening country-specific betting URLs correctly. All redirect links were defaulting to Côte d'Ivoire (CI) regardless of the user's actual country because:

1. **No country persistence** - Country was detected fresh each time using device locale
2. **No manual selection** - Users couldn't override the auto-detected country
3. **Unreliable detection** - Device locale detection (`RNLocalize.getCountry()`) doesn't always match user's actual location

## Solution Implemented

### 1. Created Country Context (`src/context/CountryContext.tsx`)
- Stores selected country in AsyncStorage
- Auto-detects country on first app open
- Allows manual country selection
- Persists user's choice across app sessions

### 2. Created useCountry Hook (`src/hooks/useCountry.ts`)
- Simple hook to access country context
- Returns `currentCountry` and `changeCountry` function

### 3. Updated All Components
Modified all components that call redirect functions to pass `currentCountry`:

**Components:**
- `MatchCard.tsx` - Match betting buttons
- `CalendarComponent.tsx` - Calendar match links
- `ScheduledMatchRow.tsx` - Scheduled match watch buttons
- `ExpandedMatchRow.tsx` - Expanded match rows
- `ExpandedMatchRowWithWatch.tsx` - Expanded match rows with watch button
- `SportRow.tsx` - Sport category links
- `Tabbar.tsx` - "See All" button in tab bar

**Screens:**
- `MatchDetails.tsx` - Match details watch button
- `Programme.tsx` - Programme "See All" button
- `Sports.tsx` - Sports "See All Matches" button

### 4. Added Country Selector Component (`src/components/CountrySelector.tsx`)
- UI component for manual country selection
- Shows country flags and names
- Can be added to settings screen

### 5. Integrated into App Providers (`src/providers/AppProviders.tsx`)
- Added `CountryProvider` to app provider tree
- Wraps the entire app to make country context available everywhere

## How It Works Now

1. **First App Open:**
   - Detects country from device locale
   - Saves to AsyncStorage
   - Uses detected country for all redirects

2. **Subsequent Opens:**
   - Loads saved country from AsyncStorage
   - Uses saved country for all redirects

3. **Manual Selection:**
   - User can change country via `CountrySelector` component
   - New selection is saved and used immediately
   - Persists across app restarts

## Country URLs

### Côte d'Ivoire (CI)
- Match: `https://betclic.onelink.me/oTcP/10zx84uj`
- See All Matches: `https://betclic.onelink.me/oTcP/2c0vftjs`
- See More: `https://betclic.onelink.me/oTcP/k6mnkp5v`

### Cameroun (CM)
- Match: `https://betclic.onelink.me/p26b/qz9vg3do`
- See All Matches: `https://betclic.onelink.me/p26b/gziltbqw`
- See More: `https://betclic.onelink.me/p26b/atz9jph4`

### Poland (PL)
- Match: `https://go.onelink.me/ZeBi/pifnfe95`
- See All Matches: `https://go.onelink.me/ZeBi/34a85wej`
- See More: `https://go.onelink.me/ZeBi/nmajzfuc`

## Testing

To test the fix:

1. **Check console logs** - Look for country detection messages:
   ```
   🌍 Country detected on first open: PL (device: PL)
   🌍 Country loaded from storage: CM
   🌍 Country changed to: CI
   ```

2. **Test redirect URLs** - Click any betting button and verify:
   - Console shows correct country code
   - Opens correct country-specific URL

3. **Test persistence** - Change country, close app, reopen:
   - Should remember selected country

## Adding Country Selector to Settings

To add the country selector to your settings screen:

```tsx
import {CountrySelector} from '../components/CountrySelector';

// In your settings screen:
<CountrySelector />
```

## Files Modified
- ✅ Created: `src/context/CountryContext.tsx`
- ✅ Created: `src/hooks/useCountry.ts`
- ✅ Created: `src/components/CountrySelector.tsx`
- ✅ Updated: `src/providers/AppProviders.tsx`
- ✅ Updated: 11 component/screen files to use country context

## Files Deprecated
- ❌ `src/utils/urlRedirection.ts` - No longer used, can be deleted
