let NIL = void 0,
  REDRAWS = [],
  CMP_KEY = '__m',
  isArray = Array.isArray,
  isStr = x => typeof x === 'string',
  isFn = x => typeof x === 'function',
  isObj = x => x !== null && typeof x === 'object',
  noop = _ => {},
  isRenderable = x => x === null || typeof x === 'string' || typeof x === 'number' || x[CMP_KEY] || isArray(x),
  createNode = v => v[CMP_KEY] ? document.createElement(v.tag) : document.createTextNode(v),
  addChildren = (x, children, i) => {
    if (isArray(x)) for (i = 0; i < x.length; i++) addChildren(x[i], children);
    else if (x != null && x !== false) children.push(x)
  };

let update = (node, v, redraw) => {
  redraw = redraw || noop;

  if (!v[CMP_KEY])
    return node.data === v + '' || (node.data = v);

  for (let i in v.props) {
    let newProp = v.props[i];
    if (i in node) {
      if (i[0] === 'o' && i[1] === 'n' && isFn(newProp)) {
        let res, fn = newProp;
        node[i] = ev =>
          (res = fn(ev)) instanceof Promise
            ? res.finally(_ => (redraw(), res = NIL))
            : (redraw(), res = NIL);
      } else
        node[i] = newProp;
    } else if (!isFn(newProp) && node.getAttribute(i) != newProp) {
      if (newProp == null || newProp === false) node.removeAttribute(i);
      else node.setAttribute(i, newProp);
    }
  }

  for (let i = 0, props = [...node.getAttributeNames(), ...Object.keys(node)]; i < tmp.length; i++)
    if (!(props[i] in v.props))
      (i in node)
        ? (node[tmp[i]] = NIL)
        : (node.removeAttribute(props[i]))
}

export function render(parent, cmp, redraw) {
  let i, tmp,
    olds = parent.childNodes || [],
    children = cmp.children || [],
    news = isArray(children) ? children : [children];

  for (i = 0, tmp = Array(Math.max(0, olds.length - news.length)); i < tmp.length; i++)
    parent.removeChild(parent.lastChild);

  for (i = 0; i < news.length; i++) {
    let node, vnode = news[i];
    node = olds[i] || createNode(vnode);
    if (!olds[i]) parent.appendChild(node);

    if ((node.tagName || '') !== (vnode.tag || '').toUpperCase()) {
      node = createNode(vnode);
      parent.replaceChild(node, olds[i]);
    }

    update(node, vnode, redraw);
    render(node, vnode, redraw);
  }
}

export function mount(el, cmp) {
  let redraw;

  REDRAWS.push(
    redraw = _ => requestAnimationFrame(
      _ => render(el, { children: cmp() }, redraw)
    )
  );

  return redraw() && redraw;
}

export const redraw = _ =>
  REDRAWS.map(r => r());

export function m(tag, ...tail) {
  let k, tmp, classes,
    props = {},
    children = [];

  if (tail.length && !isRenderable(tail[0]))
    [props, ...tail] = tail;

  if (isStr(tag)) {
    [tag, ...classes] = tag.split('.');
    classes = classes.join(' ');

    if (isObj(tmp = props.class)) {
      for (k in tmp) {
        if (tmp[k]) {
          if (classes) classes += ' ';
          classes += k;
        }
      }
    }

    if (isStr(tmp)) classes += !classes ? tmp : tmp ? ' ' + tmp : '';
    if (classes) props.class = classes;
  }

  addChildren(tail, children); // will recurse through tail and push valid childs to `children`
  return {[CMP_KEY]: 1, tag, props: { ...props }, children};
}
