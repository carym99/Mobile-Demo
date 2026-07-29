#!/usr/bin/env bash
# Waits until the Android emulator is fully booted and the package manager is ready.
set -euo pipefail

echo "==> Waiting for Android emulator device"
adb wait-for-device

echo "==> Waiting for boot completion"
boot_completed=""
attempt=0
max_boot_attempts=60

while [[ "$boot_completed" != "1" && $attempt -lt $max_boot_attempts ]]; do
  boot_completed="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')"
  attempt=$((attempt + 1))
  sleep 2
done

if [[ "$boot_completed" != "1" ]]; then
  echo "Emulator sys.boot_completed did not reach 1 within ${max_boot_attempts} attempts" >&2
  exit 1
fi

echo "==> Waiting for package manager"
pm_ready=false
attempt=0
max_pm_attempts=30

while [[ "$pm_ready" != "true" && $attempt -lt $max_pm_attempts ]]; do
  if adb shell pm path android >/dev/null 2>&1; then
    pm_ready=true
    break
  fi
  attempt=$((attempt + 1))
  sleep 2
done

if [[ "$pm_ready" != "true" ]]; then
  echo "Package manager did not become ready within ${max_pm_attempts} attempts" >&2
  exit 1
fi

echo "==> Emulator ready"
adb devices -l
