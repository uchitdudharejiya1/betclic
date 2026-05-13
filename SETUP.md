# Betclic — Setup on a new machine

After unzipping, run these commands from the project root.

## Prerequisites

- **Node.js**: version 22.11.0 or newer (`node --version`)
- **JDK**: 17 (for Android builds)
- **Xcode + CocoaPods** (for iOS, macOS only)
- **Android Studio** with SDK installed (for Android)

## 1. Install JS dependencies

```sh
npm install
```

## 2. iOS (macOS only)

```sh
cd ios && pod install && cd ..
```

If `pod install` complains about node, create `ios/.xcode.env.local`:

```sh
echo "export NODE_BINARY=\$(command -v node)" > ios/.xcode.env.local
```

Then:

```sh
npx react-native run-ios
```

## 3. Android

Create `android/local.properties` pointing to your Android SDK:

```sh
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties   # macOS
# or for Linux:
# echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
# or for Windows (PowerShell):
# "sdk.dir=$env:LOCALAPPDATA\\Android\\Sdk" | Out-File -Encoding ascii android\local.properties
```

Make sure an emulator is running or a device is plugged in (`adb devices`), then:

```sh
npx react-native run-android
```

## Troubleshooting

- **"@babel/runtime/helpers/interopRequireDefault could not be found"** — `node_modules` is missing or partial. Run `rm -rf node_modules && npm install`.
- **Metro stuck or showing stale code** — `npx react-native start --reset-cache`.
- **Android Gradle errors after copying the project** — delete `android/build`, `android/app/build`, `android/.gradle` and retry.
- **iOS build complains about a node path** — `ios/.xcode.env.local` is hardcoded to a previous user's Node binary; fix as in step 2.
- **AsyncStorage Maven error on Android** — make sure `package.json` has `@react-native-async-storage/async-storage@^2.2.0` (NOT v3.x).

## What's in this project

React Native 0.85.2 app porting a Betclic Ivory Coast sportsbook mockup. Three tabs (Sports / En direct / Programme) plus a "Voir tout" CTA, calendar bottom sheet, dark/light theme toggle (default dark), French + English i18n via i18next.

Key source folders:

- `src/screens/` — tab screens and inline sport detail
- `src/components/` — Pill, MatchCard, StatusChip, BottomSheet, Header, Tabbar, etc.
- `src/constants/` — hardcoded match data (replace with API later)
- `src/Translation/` — `fr.json` (default), `en.json`
- `src/context/ThemeContext.tsx` — dark/light theme + AsyncStorage persistence
- `src/assets/colors/` — palette
