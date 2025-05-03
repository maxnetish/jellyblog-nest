import { filter, fromEvent, map, merge, pairwise, pipe, switchMap, takeUntil, tap, throttleTime } from 'rxjs';

/**
 * Returns observable that will emit changes (deltas) of position while drag mouse or move touch,
 * started in `dragSourceElement`. Emitting starts after {@link mousedown} or {@link touchstart} event
 * in `dragSourceElement` and continues until `documentRef` receive {@link mouseup} or {@link touchend} event.
 *
 * Each emit is `{mx: number; my: number}` where `mx, my` is delta of position by X and Y respectively.
 */
export function observeDragPosition({documentRef, dragSourceElement, throttleTimeDuration = 100}: {
  documentRef: Document,
  dragSourceElement: HTMLElement,
  throttleTimeDuration?: number,
}) {
  return merge(
    // Wait for mousedown or touchstart...
    fromEvent<MouseEvent>(dragSourceElement, 'mousedown').pipe(
      tap((evt) => {
        evt.preventDefault();
      }),
    ),
    fromEvent<TouchEvent>(dragSourceElement, 'touchstart'),
  ).pipe(
    switchMap((evt) => {
      // And after that begin catch move events in document.
      // Until mouseup | touchend. That is end of drag.
      if (evt instanceof TouchEvent) {
        return fromEvent<TouchEvent>(documentRef, 'touchmove').pipe(
          takeUntil(fromEvent(documentRef, 'touchend', {once: true})),
          mapAndPairsOperator(throttleTimeDuration),
        );
      }
      return fromEvent<MouseEvent>(documentRef, 'mousemove').pipe(
        takeUntil(fromEvent(documentRef, 'mouseup', {once: true})),
        mapAndPairsOperator(throttleTimeDuration),
      );
    }),
    // Emit only no-zero deltas
    filter((movePosition) => {
      return movePosition.mx !== 0 || movePosition.my !== 0;
    }),
  );
}

function mapAndPairsOperator(throttleTimeDuration: number) {
  return pipe(
    tap((evt: MouseEvent | TouchEvent) => {
      // I don't know why prevent default, but
      // react-avatar-editor prevent, so follow.
      // "stop scrolling on iOS Safari"
      evt.preventDefault();
    }),
    throttleTime(throttleTimeDuration, undefined, {leading: false, trailing: true}),
    // Normalize emits. We need only coordintates
    map((evt) => {
      if (evt instanceof TouchEvent) {
        return {
          x: evt.targetTouches[0]?.pageX || 0,
          y: evt.targetTouches[0]?.pageX || 0,
        };
      }
      return {
        x: evt.clientX,
        y: evt.clientY,
      };
    }),
    // Group emits by pairs: [previous, current]
    pairwise(),
    // Emit only delta between current and previous coordinates
    map(([previousEvt, currentEvt]) => {
      return {
        mx: previousEvt.x - currentEvt.x,
        my: previousEvt.y - currentEvt.y,
      };
    }),
  );
}
