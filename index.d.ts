type UmhiNode = string | number | null | undefined;
type ChildNode = UmhiNode | VNode;

interface Props {
  [propName: string]: unknown;
}

interface VNode {
  _cmp?: number;
  tag: string | Component | StatefulComponent;
  props?: Props;
  children?: ChildNode[];
}

/** Creates a virtual DOM node. Can be used to create HTML Element vnodes. **/
export function m(tag: string, ...tail: (Props | UmhiNode)[]): VNode;

/** Rerenders all currently mounted applications. **/
export function redraw(): void;

/** Mounts a factory function on a given DOM Node. Returns redraw handler. **/
export function mount(node: Node, root: () => VNode): () => void;