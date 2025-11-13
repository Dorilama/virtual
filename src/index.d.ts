import { HKT, Kind, MaybeSignal, SignalFunctions } from "@dorilama/byos";
import { VirtualizerOptions, Virtualizer } from "@tanstack/virtual-core";

export { MaybeSignal, SignalFunctions } from "@dorilama/byos";

export type StateProps = [
  "getTotalSize",
  "getVirtualIndexes",
  "getVirtualItems",
  "isScrolling",
  "options",
  "scrollDirection",
  "scrollOffset",
  "scrollRect"
];

export type State<
  TScrollElement extends Element | Window,
  TItemElement extends Element
> = {
  [Key in StateProps[number]]: Virtualizer<
    TScrollElement,
    TItemElement
  >[Key] extends (...args: any[]) => any
    ? ReturnType<Virtualizer<TScrollElement, TItemElement>[Key]>
    : Virtualizer<TScrollElement, TItemElement>[Key];
} & {
  scrollElement: Virtualizer<TScrollElement, TItemElement>["scrollElement"];
};

export type GetState = <
  TScrollElement extends Element | Window,
  TItemElement extends Element
>(
  virtualizer: Virtualizer<TScrollElement, TItemElement>
) => State<TScrollElement, TItemElement>;

export type UseVirtualizerBase = <
  SignalHKT extends HKT,
  ComputedHKT extends HKT,
  TScrollElement extends Element | Window,
  TItemElement extends Element
>(
  signalFunctions: SignalFunctions<SignalHKT, ComputedHKT>,
  options: MaybeSignal<
    SignalHKT,
    ComputedHKT,
    VirtualizerOptions<TScrollElement, TItemElement>
  >
) => {
  virtualizer: Virtualizer<TScrollElement, TItemElement>;
  state: Kind<SignalHKT, State<TScrollElement, TItemElement>>;
  cleanup: () => void;
};
