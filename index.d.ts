type UmhiNode = string | number | null | undefined | boolean;
type ChildNode = UmhiNode | VNode;

type Props<T extends HTMLElement = HTMLElement> = Partial<Omit<T, "style" | "dataset" | "classList">> & {
  [propName: string]: unknown;
  style?: Partial<CSSStyleDeclaration> | string;
  dataset?: Record<string, string | number | boolean>;
  txt?: string
}

type VNode = {
  _cmp?: number;
  tag: string;
  props?: Props;
  children?: ChildNode[];
}

/** Creates a virtual DOM node. Can be used to create HTML Element vnodes. **/
export function m(tag: keyof HTMLElementTagNameMap, props: Props, ...tail: ChildNode[]): VNode;
export function m(tag: string, props: Props, ...tail: ChildNode[]): VNode;
export function m(tag: keyof HTMLElementTagNameMap, ...tail: ChildNode[]): VNode;
export function m(tag: string, ...tail: ChildNode[]): VNode;

/** Rerenders all currently mounted applications. **/
export function redraw(): void;

/** Mounts a factory function on a given DOM Node. Returns redraw handler. **/
export function mount(node: Node, root: () => VNode): () => void;