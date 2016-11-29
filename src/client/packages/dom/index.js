const attrMap = Symbol('attrMap');

function _attributes(type) {
  if(!type)
    return {};
  let attrsDesc = Object.getOwnPropertyDescriptor(type, attrMap);
  if(!attrsDesc) {
    const superAttributes = _attributes(Object.getPrototypeOf(type));
    Object.defineProperty(type, attrMap, attrsDesc = { value: Object.create(superAttributes)});
  }
  return attrsDesc.value;
}


export class Component {

  constructor(props = {}) {
    this.refs = Object.create(null);
    this.props = props;
    const attributes = _attributes(this.constructor);
    for(const attrKey in attributes) {
      const attrDesc = attributes[attrKey];
      if(!(attrKey in props) && attrDesc.default)
        props[attrKey] = attrDesc.default.call(this);
    }
    this._nodes = null;
    this.oninit();
  }

  oninit() { }

  _render() {
    if(this._nodes !== null)
      throw new Error('Component already rendered');
    const prevRefHolder = _refHolder;
    try {
      _refHolder = this.refs;
      let content = this.render(this.props);
      if(content == null)
        content = [];
      this._nodes = Array.isArray(content) ? content.map(materialize) : [content];
      this._nodes.map(node => {
        if(!('__comp__' in node))
          node['__comp__'] = this;
      });
    }
    finally {
      _refHolder = prevRefHolder;
    }
    this.onrendered();
  }

  render() {}

  onrendered() {}

  get node() {
    if(this._nodes === null)
      this._render();
    if(this._nodes.length == 1)
      return this._nodes[0];

    let df = document.createDocumentFragment();
    for(const node of this._nodes)
      df.appendChild(node);
    return df;
  }

  get parent() {
    let node = this.node.parentElement;
    while(node) {
      if(node.__comp__)
        return node.__comp__;
      node = node.parentElement;
    }
    return null;
  }

  static isSubtype(constructor) {
    return this.prototype.isPrototypeOf(constructor.prototype);
  }
}
Component[attrMap] = {};//Object.create(null);

export function attr(...args) {
  let opt;
  if(args.length == 3) {
    opt = {};
    return decorator(...args);
  }
  opt = args[0] || {};
  return decorator;

  function decorator(target, prop, desc) {
    opt.default = desc.initializer;
    _attributes(target.constructor)[prop] = opt;
    return {
      enumerable: true,
      get() {
        return this.props[prop];
      },
      set(value) {
        if(this.props[prop] !== value) {
          if(opt.onchange)
            opt.onchange.call(this, value, prop);
          this.props[prop] = value;
        }
      }
    };
  }
}

let _createElement = tag => document.createElement(tag);
let _refHolder = null;

/**
 * Return a node or documentFragment (or Component instance???!)
 * @param  {[type]} tag         [description]
 * @param  {[type]} attrs       =             null [description]
 * @param  {[type]} ...children [description]
 * @return {[type]}             [description]
 */
export function dom(tag, attrsOrNull, ...children) {
  const { ref, ...attrs } = attrsOrNull || {};

  let content;
  if(typeof tag == 'string') {
    if(typeof ref == 'string')
      attrs.ref = ref;
    content = materializeTag(tag, { ...attrs }, ...children);
  }
  else if(typeof tag != 'function')
    throw new TypeError('Expected string or function');
  else if(Component.isSubtype(tag))
    content = materializeComp(tag, attrs, ...children);
  else
    content = materializeFunc(tag, attrs, ...children);

  switch(typeof ref) {
    case 'string':
      if(ref in _refHolder)
        if(Array.isArray(_refHolder[ref]))
          _refHolder[ref].push(content);
        else
          _refHolder[ref] = [_refHolder[ref], content];
      else
        _refHolder[ref] = content;
      break;
    case 'function':
      ref.call(_refHolder, content);
      break;
  }

  return content;
}

export function cssToObject(css) {
  if(typeof css == 'string') {
    const ob = {};
    for(const pair of css.split(';')) {
      const [key, value] = pair.trim().split(/\s*:\s*/);
      ob[key] = value;
    }
    return ob;
  }
  return css;
}

export function cssCombine(...csss) {
  return Object.assign({}, ...csss.map(cssToObject));
}

export const attributeHandlers = {

  style(node, value) {
    if(typeof value == 'string')
      node.style.cssText = value;
    else
      Object.assign(node.style, value);
  }

};

export function setAttributes(node, ...attrs) {
  for(const attr of attrs) {
    for(const key of Object.keys(attr)) {
      const value = attr[key];
      if(key in attributeHandlers)
        attributeHandlers[key](node, value);
      else if(typeof value == 'function' || typeof value == 'object')
        node[key] = value;
      else
        node.setAttribute(key, value);
    }
  }
}

function materializeTag(tag, attrs = null, ...children) {
  const node = _createElement(tag);

  if(attrs) {
    setAttributes(node, attrs);
  }

  node.appendChild(materialize(children));
  return node;
}

function materializeFunc(renderFn, attrs, ...children) {
  const refs = Object.create(null);
  const prevRefs = _refHolder;
  try {
    _refHolder = refs;
    return materialize(renderFn.call({refs}, Object.assign({ content: children }, attrs)));
  }
  finally {
    _refHolder = prevRefs;
  }
}

function materializeComp(cnstr, attrs, ...children) {
  const comp = new cnstr(Object.assign({ content: children }, attrs));
  comp._render();
  return comp;
}

function materialize(content) {
  if(typeof content == 'undefined' || content === null)
    return document.createDocumentFragment();
  if(typeof content == 'string')
    return document.createTextNode(content);
  if(Array.isArray(content))
    return content.map(materialize).reduce((df, node) => { df.appendChild(materialize(node)); return df; }, document.createDocumentFragment());
  if(content instanceof Node)
    return content;
  if(content instanceof Component)
    return content.node;

  throw new TypeError(`Expected string, Node or Component. Got ${content}`);
}


export function withNS(ns, fn, ...args) {
  const prev = _createElement;
  _createElement = tag => document.createElementNS(ns, tag);
  try {
    return fn.apply(this, args);
  }
  finally {
    _createElement = prev;
  }
}

// import Hyper from 'hypher';
// import english from 'hyphenation.en-us';
//
// const hypher = new Hyper(english);

export function htmlToDom(html) {
  const el = document.createElement('div');
  el.innerHTML = html;

  // eachTextNode(el, tn => tn.textContent = hypher.hyphenateText(tn.textContent));

  const nodes = Array.from(el.childNodes);
  if(nodes.length == 1)
    return nodes[0];
  const df = document.createDocumentFragment();
  for(const node of nodes)
    df.appendChild(node);
  return df;
}
