#!/usr/bin/env bash
set -euo pipefail

echo "==> Waiting for Android emulator to boot"
adb wait-for-device

boot_completed=""
attempt=0
max_attempts=60

while [[ "$boot_completed" != "1" && $attempt -lt $max_attempts ]]; do
  boot_completed="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')"
  attempt=$((attempt + 1))
  sleep 2
done

if [[ "$boot_completed" != "1" ]]; then
  echo "Emulator did not finish booting within the expected time" >&2
  exit 1
fi

echo "==> Emulator ready"
adb devices

echo "==> Installing demo APK"
adb install -r "apps/Android-MyDemoAppRN.1.3.0.build-244.apk"

echo "==> Granting Appium helper permissions"
adb shell pm grant io.appium.settings android.permission.ACCESS_FINE_LOCATION || true
adb shell pm grant io.appium.settings android.permission.ACCESS_COARSE_LOCATION || true
adb shell settings put global hide_error_dialogs 1 || true

export APPIUM_HOME="${APPIUM_HOME:-$PWD}"
export ANDROID_UDID="${ANDROID_UDID:-emulator-5554}"
export CI=true

echo "==> Running WebdriverIO test suite"
npm test
