import createTweenr from "tweenr";

export const tweenr = createTweenr();

export function tween(opt, trg = this) {
  return new Promise(res => {
    tweenr.to(trg, opt)
      .on('complete', res)
      .on('cancelling', res)
  })
}

export function calcScrollTop(node = this) {
    let top = 0;
    while (node) {
       if (node.tagName) {
           top = top + node.offsetTop;
           node = node.offsetParent;
       } else {
           node = node.parentNode;
       }
    }
    return top;
}

export function scrollTo(idOrNumber, opt = { duration: 0.5, ease:'expoOut' }) {
  const scrollTop = typeof idOrNumber == 'string' ? document.getElementById(idOrNumber)::calcScrollTop() : Number(idOrNumber) || 0;
  return new Promise(res => {
    tweenr.to(document.scrollingElement, { ...opt, scrollTop }).on('complete', res)
  })
}

export function findAncestor(selector, el = this) {
  while(el && el.nodeType == 1) {
    if(el.matches(selector))
      return el;
    el = el.parentNode;
  }
}

export function encodeQuery(query) {
  return Array.from(Object.entries(query), ([key, value]) => encodeURIComponent(key)+'='+encodeURIComponent(value)).join('&');
}

const IMG_STEP = 128;

export function imaginaryImgSrc(src, { dim = 'width' } = {}) {
  const dpr = window.devicePixelRatio || 1;
  const imgOpt = { transform:'resize'}
  if(dim == 'width') {
    imgOpt['width'] = Math.ceil(window.innerWidth*dpr/IMG_STEP)*IMG_STEP;
  }
  else if(dim == 'height') {
    imgOpt['height'] = Math.ceil(window.innerHeight*dpr/IMG_STEP)*IMG_STEP;
  }
  return src + (~src.indexOf('?') ? '&' : '?') + encodeQuery(imgOpt);
}

export function randomHsla({ h = Math.random()*360, s = Math.random()*100, l = Math.random()*100, a = Math.random() }) {
  return `hsla(${h},${s}%,${l}%,${a})`;
}

export function loadImage(src) {
  return new Promise((res,rej) => {

    const im = new Image;
    im.onload = _ => {
      //setTimeout(_ => res(im), Math.random()*10000)
      res(im)
    }
    im.onerror = rej;
    im.src = src;
  })
}

function stdCompare(a,b) {
  if(a < b)
    return -1;
  if(a > b)
    return 1;
  return 0;
}
export function findMax(cmp = stdCompare , ar = this) {
  return ar.reduce((a,b) => cmp(a,b) < 0 ? b : a)
}
export function findMin(cmp = stdCompare , ar = this) {
  return ar.reduce((a,b) => cmp(a,b) >= 0 ? b : a)
}
