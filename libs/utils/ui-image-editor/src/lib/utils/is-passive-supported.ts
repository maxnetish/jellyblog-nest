// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
export function isPassiveSupported(windowRef?: Window | null) {
  if (!windowRef?.addEventListener) {
    return false;
  }

  let passiveSupported = false;
  try {
    const options = Object.defineProperty({}, 'passive', {
      get: function () {
        passiveSupported = true;
      },
    });

    const handler = () => undefined;
    windowRef.addEventListener('test', handler, options);
    windowRef.removeEventListener('test', handler, options);
  } catch (err) {
    passiveSupported = false;
  }
  return passiveSupported;
}
