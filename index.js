
import { dom } from './dom';
import { autorun, ReactiveVar} from './tracker';
import createRegl from 'regl';
import glsl from 'glslify';
import createHistory from "history/createBrowserHistory";
import delegate from 'delegate';
import content from './content';


window.onerror = e => {
  alert(e);
  window.onerror = undefined;
};

const history = createHistory();
history.listen(handleLocation);
window.onload = e => handleLocation(history.location);

const page = new ReactiveVar({});
const video = new ReactiveVar('case0.mp4')

function handleLocation({pathname}) {
  console.log('loc', pathname)
  page.set(content[pathname] || content['/']);
}

delegate(document.body, 'a', 'click', e => {
  const target = e.delegateTarget;

  var pattern = /^((http|https):\/\/)/;
  if(target.href && !pattern.test(target.href))
    return;

  if(!target.host || target.host == location.host) {
    e.preventDefault();
    if(target.pathname == location.pathname)
      history.replace(target.getAttribute('href'));
    else
      history.push(target.getAttribute('href'));
  }
})

document.body.appendChild(<App />)

function App() {

  const initContent = (el) => {
    autorun(c => {
      const {video, html } = page.get() || {};
      console.log('setting content', html, video)
      this.refs.html.innerHTML = html;
      if(video)
        this.refs.video.src = video;
    })
  }

  return (
    <div ref={initContent}>
      <pre ref="html"></pre>
      <Computer ref="video" />
    </div>
  )
}

function Cases() {

  const loadCase = (src) => {
    video.set(src);
  }

  return (
    <ul>
      <li onclick={e => loadCase('case0.mp4')} style="cursor:pointer">case0</li>
      <li onclick={e => loadCase('case1.mp4')} style="cursor:pointer">case1</li>
    </ul>
  )
}

function Computer({src}) {

  // const video = [
  //   <video src="case0.mp4" loop />,
  //   <video src="case1.mp4" loop />
  // ]
  let ctrl;

  function initCanvas(canvas) {

    function updateSize() {
      console.log(
        canvas.width = canvas.offsetWidth,
        canvas.height = canvas.offsetHeight
      )
    }
    setTimeout(updateSize, 1000);

    ctrl = startRegl(canvas, src );
  }

  const node = (
    <div style="display:inline-block;position:absolute;right:0;top:50%;transform:translateY(-40%)">
      <img src="dator.png" style="position:relative;z-index:1;height:150vh" />
      <canvas ref={initCanvas} style="position:absolute;top:24.5%;left:40%;width:36%;height:33%"></canvas>
    </div>
  )
  Object.defineProperty(node, 'src', {
    get() {
      return src;
    },
    set(value) {
      src = value;
      ctrl.nextVideo(src);
    }
  })
  return node;
}

function loadVideo(src) {
  return new Promise((res, rej) => {
    const video = <video src={src} oncanplay={e => res(video)} crossorigin="anonymous" autoplay muted playsinline onerror={e => rej(video.error)} />;
  })
}

function startRegl(canvas, videoSrc) {
  const regl = createRegl(canvas);
  const drawVideo = regl({
    frag: glsl`
    precision mediump float;
    uniform sampler2D texture0;
    uniform sampler2D texture1;
    uniform float time;
    uniform float mixr;

    varying vec2 uv;

    #pragma glslify: glitch = require('./video_glitch', time=time)
    #pragma glslify: crt_bulge = require('./crt_bulge')
    #pragma glslify: grid = require('./grid')

    float rip(float x) {
      return .5/(x-.5+step(0.,x));
    }

    float bulge(vec2 uv) {
      vec2 p = 2.*uv - 1.;
      return 2. - 1.5*sqrt((1.-p.x*p.x)*(1.-p.y*p.y));
    }

    void main () {
      vec2 uv2 = crt_bulge(uv);
      vec4 color;
      uv2.x += .55*rip(20.*(uv.y-mixr*2.+.5));
      float strength = .3 + smoothstep(.0, .3, mixr);
      if(uv2.y > mixr) {
        color = glitch(texture0, uv2, strength);
      } else {
        color = glitch(texture1, uv2, strength);
      }
      // color.xyz = vec3(grid(uv2, vec2(.1,.1)));
      gl_FragColor = pow(color, vec4(bulge(uv)));
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    void main () {
      uv = vec2(1.0-position.x,position.y);
      gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
    }`,

    attributes: {
      position: [
        -2, 0,
        0, -2,
        2, 2]
    },

    uniforms: {
      texture0: regl.prop('texture0'),
      texture1: regl.prop('texture1'),

      mixr: regl.prop('mixr'),

      time: regl.context('time')
    },

    count: 3
  });
  let mixr = 0, prevTime = 0, video0, video1;
  let texture0 = regl.texture({min:'linear', mag:'linear'});
  let texture1 = regl.texture({min:'linear', mag:'linear'});
  const ctrl = regl.frame(({time}) => {
    if(video0)
      texture0.subimage(video0);
    if(video1) {
      texture1.subimage(video1);
      mixr += time - prevTime;
      if(mixr >= 1) {
        mixr = 0;
        video0 = video1;
        [texture0, texture1] = [ texture1, texture0 ];
        video1 = null;
      }
    }
    drawVideo({ texture0 , texture1, mixr })
    prevTime = time;
  });

  ctrl.nextVideo = (src) => {
    loadVideo(src).then(video => {
      video.loop = true;
      video.play();
      texture1({width:video.videoWidth, height:video.videoHeight})
      video1 = video;
    })
  }
  if(videoSrc)
    loadVideo(videoSrc).then(video => {
      video.loop = true;
      video.play();
      texture0({width:video.videoWidth, height:video.videoHeight})
      video0 = video;
    })
  return ctrl;
}

function tween(fn, duration) {

}
