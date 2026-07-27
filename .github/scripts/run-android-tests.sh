#!/usr/bin/env bash
set -euo pipefail

TEST_SUITE="${1:-smoke}"

case "$TEST_SUITE" in
  smoke)
    NPM_SCRIPT="test:smoke"
    ;;
  regression)
    NPM_SCRIPT="test:regression"
    ;;
  *)
    echo "Unknown test suite: $TEST_SUITE (expected smoke or regression)" >&2
    exit 1
    ;;
esac

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$SCRIPT_DIR/wait-for-emulator.sh"

echo "==> Installing demo APK"
adb install -r "apps/Android-MyDemoAppRN.1.3.0.build-244.apk"

echo "==> Granting Appium helper permissions"
adb shell pm grant io.appium.settings android.permission.ACCESS_FINE_LOCATION || true
adb shell pm grant io.appium.settings android.permission.ACCESS_COARSE_LOCATION || true
adb shell settings put global hide_error_dialogs 1 || true

export APPIUM_HOME="${APPIUM_HOME:-$PWD}"
export ANDROID_UDID="${ANDROID_UDID:-emulator-5554}"
export CI=true

echo "==> Running WebdriverIO ${TEST_SUITE} suite (npm run ${NPM_SCRIPT})"
npm run "$NPM_SCRIPT"
