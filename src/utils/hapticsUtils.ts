/**
 * Check if the current device is running iOS (Safari / iPhone / iPad PWA)
 */
export function isIOSDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Check if navigator.vibrate is supported by the device
 */
export function isHapticsSupported(): boolean {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Trigger haptic vibration on mobile devices if supported
 * Note: iOS Safari / iPhone PWA does not support navigator.vibrate by WebKit specification.
 */
export function triggerHapticFeedback(pattern: number | number[] = [15, 30, 20]): boolean {
  try {
    if (isHapticsSupported()) {
      return navigator.vibrate(pattern);
    }
  } catch (e) {
    // Ignore unsupported devices
  }
  return false;
}
