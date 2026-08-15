/**
 * Trigger haptic vibration on mobile devices if supported
 */
export function triggerHapticFeedback(pattern: number | number[] = 15) {
  try {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Ignore unsupported devices
  }
}
