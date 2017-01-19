
import { dom } from './dom';
import createRegl from 'regl';
import glsl from 'glslify';

document.body.appendChild(<App />)

function App() {

  const loadCase = (src) => {
    this.refs.comp.src = src;
  }

  return (
    <div>
      <ul>
        <li onclick={e => loadCase('case0.mp4')} style="cursor:pointer">case0</li>
        <li onclick={e => loadCase('case1.mp4')} style="cursor:pointer">case1</li>
      </ul>
      <Computer ref="comp" src="case0.mp4" />
    </div>
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
    const video = <video src={src} oncanplay={e => res(video)} onerror={rej} />;
  })
}

function spy(value) {
  console.log(value);
  return value;
}

function startRegl(canvas, videoSrc) {
  const regl = createRegl(canvas);
  const drawVideo = regl({
    frag: spy(glsl`
    precision mediump float;
    uniform sampler2D texture0;
    uniform sampler2D texture1;
    uniform float time;
    uniform float mixr;

    varying vec2 uv;

    #pragma glslify: glitch = require(./video_glitch)

    void main () {
      vec2 pos = 2.0*uv-1.0;
      pos *= pow(length(pos), .2);
      vec2 d = 0.5*pos + 0.5;
      vec4 color;
      if(d.y > mixr) {
        color = glitch(texture0, d, time, mixr + 0.3);
      } else {
        color = glitch(texture1, d, time, mixr + 0.3);
      }
      //vec4 color1 = texture2D(texture1, d + off);
      //gl_FragColor = d.y > mixr ? color0 : color1;
      gl_FragColor = color;
    }`),

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
  const texture0 = regl.texture({shape:[768,512], min:'linear', mag:'linear'});
  const texture1 = regl.texture({shape:[768,512], min:'linear', mag:'linear'});
  const ctrl = regl.frame(({time}) => {
    if(video0)
      texture0.subimage(video0);
    if(video1) {
      texture1.subimage(video1);
      mixr += time - prevTime;
      if(mixr >= 1) {
        mixr = 0;
        video0 = video1;
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
      video1 = video;
    })
  }
  if(videoSrc)
    loadVideo(videoSrc).then(video => {
      video.loop = true;
      video.play();
      video0 = video;
    })
  return ctrl;
}

function tween(fn, duration) {

}
