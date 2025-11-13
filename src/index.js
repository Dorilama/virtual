import {
  Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect,
  observeWindowOffset,
  observeWindowRect,
  windowScroll,
} from "@tanstack/virtual-core";

export * from "@tanstack/virtual-core";

/**
 *
 * @type {import(".").GetState}
 */
function getState(virtualizer) {
  return {
    getTotalSize: virtualizer.getTotalSize(),
    getVirtualIndexes: virtualizer.getVirtualIndexes(),
    getVirtualItems: virtualizer.getVirtualItems(),
    isScrolling: virtualizer.isScrolling,
    options: virtualizer.options,
    scrollDirection: virtualizer.scrollDirection,
    scrollElement: virtualizer.scrollElement,
    scrollOffset: virtualizer.scrollOffset,
    scrollRect: virtualizer.scrollRect,
  };
}

/**
 *
 * @type {import(".").UseVirtualizerBase}
 */
function useVirtualizerBase(fns, options) {
  const virtualizer = new Virtualizer(fns.toValue(options));
  const state = fns.signal(getState(virtualizer));

  const cleanup = virtualizer._didMount();
  const scrollElement = fns.computed(
    () => fns.toValue(options).getScrollElement(),
    [options]
  );

  const stopElementEffect = fns.effect(() => {
    if (fns.toValue(scrollElement)) {
      virtualizer._willUpdate();
    }
  }, [scrollElement]);

  const stopOptionsEffect = fns.effect(() => {
    const opt = fns.toValue(options);
    virtualizer.setOptions({
      ...opt,
      onChange: (instance, sync) => {
        fns.setValue(state, getState(instance));
        opt.onChange?.(instance, sync);
      },
    });

    virtualizer._willUpdate();
    fns.setValue(state, getState(virtualizer));
  }, [options]);

  return {
    virtualizer,
    state,
    cleanup() {
      cleanup();
      stopElementEffect();
      stopOptionsEffect();
    },
  };
}

/**
 *
 * @type {import(".").UseVirtualizer}
 */
export function useVirtualizer(fns, options) {
  const opt = fns.computed(() => {
    const o = fns.toValue(options);
    return {
      observeElementRect: observeElementRect,
      observeElementOffset: observeElementOffset,
      scrollToFn: elementScroll,
      ...o,
    };
  }, [options]);
  return useVirtualizerBase(fns, opt);
}
