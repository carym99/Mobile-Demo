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

echo "==> Resolving Android device UDID"
DETECTED_UDID="$(adb devices | awk '/\temulator/{print $1; exit}')"
if [[ -z "$DETECTED_UDID" ]]; then
  DETECTED_UDID="$(adb devices | awk '/\tdevice$/{print $1; exit}')"
fi

if [[ -z "$DETECTED_UDID" ]]; then
  echo "No Android device/emulator found via adb" >&2
  adb devices -l >&2 || true
  exit 1
fi

echo "==> Using ANDROID_UDID=${DETECTED_UDID}"

echo "==> Installing demo APK"
adb install -r "apps/Android-MyDemoAppRN.1.3.0.build-244.apk"

echo "==> Granting Appium helper permissions"
adb shell pm grant io.appium.settings android.permission.ACCESS_FINE_LOCATION || true
adb shell pm grant io.appium.settings android.permission.ACCESS_COARSE_LOCATION || true
adb shell settings put global hide_error_dialogs 1 || true
adb shell settings put global animator_duration_scale 0 || true
adb shell settings put global transition_animation_scale 0 || true
adb shell settings put global window_animation_scale 0 || true

export APPIUM_HOME="${APPIUM_HOME:-$PWD}"
export ANDROID_UDID="$DETECTED_UDID"
export CI=true
export APP_LAUNCH_TIMEOUT="${APP_LAUNCH_TIMEOUT:-120000}"
export CI_SPEC_RETRIES="${CI_SPEC_RETRIES:-0}"

echo "==> Running WebdriverIO ${TEST_SUITE} suite (npm run ${NPM_SCRIPT})"
npm run "$NPM_SCRIPT"
