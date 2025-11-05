# Solartec Mobile (Android)

A simple React Native (Expo) app to record solar installation details.

Features:
- Client name, phone, address
- Installed kW
- Dynamic panel serial numbers (starts with 6, add more with +)
- Inverter company, kW, serial number
- Installation date picker

## Prerequisites
- Node.js 18+
- Android device with Expo Go app installed (from Play Store) or Android emulator

## Install
```bash
cd mobile
npm install
```

## Run (Android)
```bash
npm run android
```
- If you have a physical device, scan the QR in terminal with Expo Go.
- If you have Android Studio emulator running, it should boot automatically.

## Build APK (optional - EAS)
For a shareable APK/AAB you can use Expo EAS:
```bash
npm install -g eas-cli
cd mobile
npx eas login
npx eas build -p android --profile preview   # produces an .apk you can sideload
# For Play Store bundle:
npx eas build -p android --profile release   # produces an .aab
```

## Notes
- Data is logged to console for now. We can wire up a backend (Firebase/REST) next.


