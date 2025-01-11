export function isTouchDevice(windowRef?: Window | null) {
  return (
    typeof windowRef !== 'undefined' &&
    typeof windowRef?.navigator !== 'undefined' &&
    ('ontouchstart' in windowRef || windowRef.navigator.maxTouchPoints > 0)
  );
}
