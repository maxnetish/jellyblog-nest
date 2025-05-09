import {
  BehaviorSubject, EMPTY,
  filter, finalize,
  fromEvent,
  map,
  merge, Observable,
  pairwise,
  pipe,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs';

/**
 * Returns observable:
 *
 * **movement$**: will emit changes (deltas) of position while drag mouse or move touch,
 * started in `dragSourceElement`. Emitting starts after {@link mousedown} or {@link touchstart} event
 * in `dragSourceElement` and continues until `documentRef` receive {@link mouseup} or {@link touchend} event.
 *
 * Each emit is `{mx: number; my: number}` where `mx, my` is delta of position by X and Y respectively.
 *
 * **dragState$**: will emit `true` when drag starts, `false` when drag ends
 */
export function observeDrag({documentRef, dragSourceElement, throttleTimeDuration = 100}: {
  documentRef: Document,
  dragSourceElement: HTMLElement,
  throttleTimeDuration?: number,
}) {
  const dragState$ = new BehaviorSubject(false);

  const movement$ = merge(
    // Wait for mousedown or touchstart...
    fromEvent<MouseEvent>(dragSourceElement, 'mousedown').pipe(
      tap((evt) => {
        evt.preventDefault();
      }),
    ),
    fromEvent<TouchEvent>(dragSourceElement, 'touchstart'),
  ).pipe(
    tap(() => {
      // Notify that drag starts
      dragState$.next(true);
    }),
    switchMap((evt) => {
      let observeMoveEvents$: Observable<MouseEvent | TouchEvent>;

      // Begin catch move events from mouse or touch according initial event.
      // Until mouseup | touchend. That is end of drag.
      switch (evt.type) {
        case 'touchstart': {
          observeMoveEvents$ = fromEvent<TouchEvent>(documentRef, 'touchmove').pipe(
            takeUntil(fromEvent(documentRef, 'touchend', {once: true})),
          );
          break;
        }
        case 'mousedown': {
          observeMoveEvents$ = fromEvent<MouseEvent>(documentRef, 'mousemove').pipe(
            takeUntil(fromEvent(documentRef, 'mouseup', {once: true})),
          );
          break;
        }
        default: {
          observeMoveEvents$ = EMPTY;
        }
      }

      return observeMoveEvents$.pipe(
        mapAndPairsOperator({throttleTimeDuration}),
        finalize(() => {
          // notify that drag ends
          dragState$.next(false);
        }),
      );
    }),
    // Emit only no-zero deltas
    filter((movePosition) => {
      return movePosition.mx !== 0 || movePosition.my !== 0;
    }),
  );

  return {
    dragState$,
    movement$,
  };
}

function mapAndPairsOperator({throttleTimeDuration}: {throttleTimeDuration: number}) {
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
      if ('targetTouches' in evt) {
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
