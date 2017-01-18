
import "./src/polyfill";
import "./style.less";
import { dom, Component, htmlToDom } from "./src/dom"
import xhr from "xhr";
import createHistory from "history/createBrowserHistory";
import delegate from "delegate";
import { Main } from "./src/main";
import { Case } from "./src/case";
import Logo from './icons/logo_white.svg';
import { calcScrollTop, scrollTo, findAncestor } from "./src/util";
import Hammer from 'hammerjs';


if(process.env.NODE_ENV === 'dev')
  window.onerror = e => alert(e);

const history = window.hist = createHistory();

// sshfs -o nonempty andreas.karlsson@hosting01:/datastore/SHARED_STORAGE/openshift-persistent-storage/10g.pv010 public/case

delegate(document.body, '*[href]', 'click', e => {
  const target = e.delegateTarget;

  var pattern = /^((http|https):\/\/)/;
  if(target.href && !pattern.test(target.href))
    return;

  if(target.download){
    return;
  }
  if(!target.host || target.host == location.host) {
    e.preventDefault();
    if(target.pathname == location.pathname)
      history.replace(target.getAttribute('href'));
    else
      history.push(target.getAttribute('href'));
  }
})

document.body.appendChild(<Logo id="logo" onclick={e => history.push('/')} />)
document.body.appendChild(<Menu />)
let root = <div />;
document.body.appendChild(root);

const scrollStack = [];
let prevLocation = {};
history.listen(handleLocation);
window.onload = _ => handleLocation(history.location);

function handleLocation(newLocation, action) {
  //console.log('newlocation', action, scrollStack)
  Array.from(document.querySelectorAll('.menu'), el => el.classList.remove('active','lightbox'));
  let scrollPos = 0;
  if(action == 'POP') {
    scrollPos = scrollStack.pop() || 0;
  }
  else if(action == 'PUSH'){
    scrollStack.push(document.scrollingElement.scrollTop);
  }
  return Promise.resolve()
    .then(_ => bodyOpacity(0))
    .then(handlePathname)
    .then(handleHash)
    .then(_ => bodyOpacity(1))
    .then(_ => prevLocation = newLocation)

  function handlePathname() {
    if(newLocation.pathname != prevLocation.pathname) {
      const [,,caseId] = newLocation.pathname.split(/[\/?#]/);
      return caseId ?
        loadJSON(`/case/${caseId}/case.json`).then(content => replaceRoot(<Case {...content} />)) :
        loadJSON(`/content.json`).then(content => replaceRoot(<Main {...content} />));
    }
  }

  function handleHash() {
    return scrollTo(newLocation.hash ? newLocation.hash.slice(1) : scrollPos, { duration: 0 })
  }

  function bodyOpacity(opacity = 0) {
    return document.body::promiseTransition({opacity})
  }

}


function promiseTransition(styles = {}) {
  const el = this;
  return new Promise(res => {
    // XXX should make sure any styles change or no transitionend event will fire...
    el.addEventListener('transitionend', handler, false);
    Object.assign(el.style, styles);
    function handler() {
      el.removeEventListener('transitionend', handler, false);
      res(el);
    }
  })
}

function Menu() {

  const toggle = _ => this.refs.root.classList.toggle('active');

  const close = e => {
    if(this.refs.root.classList.contains('lightbox')) {
      e.stopImmediatePropagation();
      moveFocus(0)
    }
  }

  const next = e => {
    if(this.refs.root.classList.contains('lightbox')) {
      e.stopImmediatePropagation();
      moveFocus(1);
    }
  }

  const prev = e => {
    if(this.refs.root.classList.contains('lightbox')) {
      e.stopImmediatePropagation();
      moveFocus(-1);
    }
  }

  return [
    <div ref="root" class="menu" onclick={toggle} >
      <div class="content">
        <div>
          <a href="/">HOME</a>
          <a href="/#work">WORK</a>
          <a href="/#about">ABOUT</a>
          <a href="/#contacts">CONTACT</a>
        </div>
      </div>

      <div class="btn t" onclick={prev}>
        <div class="s l"/><div class="s r"/>
      </div>
      <div class="btn m" onclick={close}>
        <div class="s l"/><div class="s r"/>
      </div>
      <div class="btn b" onclick={next}>
        <div class="s l"/><div class="s r"/>
      </div>
    </div>
  ]
}

function moveFocus(off = 0) {
  let chain = Promise.resolve();
  const focused = document.querySelector('.leafcell.focused');
  if(focused) {
    const current = focused.__comp__;
    if(current)
      chain = chain.then(() => current.deflate());
    if(off) {
      const cells = Array.from(document.querySelectorAll('.leafcell'), el => el.__comp__);
      const next = cells[cells.indexOf(current) + off];
      if(next)
        chain = Promise.resolve().then(() => next.inflate())
        //chain = chain.then(() => next.inflate())
    }
  }
  return chain;
}

const lightbox_enabled = !('ontouchstart' in window)

if(!lightbox_enabled) {
  const mc = new Hammer.Manager(document.body, { touchAction: 'auto' });
  mc.add(new Hammer.Swipe({
    direction: Hammer.DIRECTION_HORIZONTAL,
    enable(rec, e) {
      return e && e.target.matches('.leafcell.focused');
    }
  }));
  mc.add(new Hammer.Tap({
    enable(rec, e) {
      return e && e.target.matches('.activity, .activity *');
    }
  }))
  mc.on('swipeleft', e => {
    moveFocus(1)
  });
  mc.on('swiperight', e => {
    moveFocus(-1)
  });
  mc.on('tap', e => {
    e.preventDefault();
    e.target::findAncestor('.activity').classList.toggle('active');
  })
} else {
  // whenevner a gridblock inflates, show the menu...
  document.body.addEventListener('inflate', e => document.querySelector('.menu').classList.toggle('lightbox', true), false);
  document.body.addEventListener('deflate', e => document.querySelector('.menu').classList.toggle('lightbox', false), false);

  window.addEventListener('keydown', e => {
    switch(e.keyCode) {
      case 37:
      case 38:
        moveFocus(-1);
        break;
      case 39:
      case 40:
        moveFocus(1);
        break;
      case 27:
        moveFocus(0);
        break;
    }
  }, false)
}

let focused = null;
let focusScrollTop = -1;
document.body.addEventListener('inflate', e => {
  focused = e.target.__comp__;
  e.done.then(cell => {focusScrollTop = document.scrollingElement.scrollTop} )
}, false);
document.body.addEventListener('deflate', e => {
  focused = null;
  focusScrollTop = -1
}, false);
document.onscroll = debounceRaf(e => {
  if(focusScrollTop >= 0 && focused && Math.abs(focusScrollTop-document.scrollingElement.scrollTop)/window.innerHeight > 0.3) {
    focused.deflate();
  }
})

function debounceRaf(fn) {
  let frameId = 0;
  return () => {
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(fn);
  }
}

function replaceRoot(newRoot) {
  const oldRoot = root;
  document.body.replaceChild(newRoot, oldRoot);
  root = newRoot;
  return oldRoot;
}

function promiseAnimationFrame() {
  return new Promise(res => {
    requestAnimationFrame(res);
  })
}


function loadJSON(url) {
  return new Promise((res, rej) => {
    xhr.get(url, {json:true}, (err, {body}) => {
      //console.log('received', typeof body, body)
      if(typeof body == "string")
        body = JSON.parse(body);
      if(err)
        rej(err);
      else
        res(body);
    });
  })
}
