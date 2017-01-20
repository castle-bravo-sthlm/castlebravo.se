import { dom } from './dom';
import { autorun, ReactiveVar} from './tracker';
import createRegl from 'regl';
import glsl from 'glslify';

export function Computer({src}) {


  const node = (
    <div style="display:inline-block;position:absolute;right:0;top:50%;transform:translateY(-40%)">
      <img src="dator.png" style="position:relative;z-index:1;height:150vh" />
      <canvas ref="canvas" style="position:absolute;top:24.5%;left:40%;width:36%;height:33%"></canvas>
    </div>
  )

  Object.assign(node, startRegl(this.refs.canvas));

  // Object.defineProperty(node, 'src', {
  //   get() {
  //     return src;
  //   },
  //   set(value) {
  //     src = value;
  //     ctrl.loadVideo(src);
  //   }
  // })
  return node;
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

  let mixr = 0, prevTime = 0, swapping = false, updTex0, updTex1;
  let texture0 = regl.texture({min:'linear', mag:'linear'});
  let texture1 = regl.texture({min:'linear', mag:'linear'});

  texture0.update = texture1.update = noop;

  const ctrl = regl.frame(({time}) => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    texture0.update();

    if(swapping) {
      texture1.update();
      mixr += time - prevTime;
      if(mixr >= 1) {
        swapping = false;
        mixr = 0;
        [texture0, texture1] = [ texture1, texture0 ];
      }
    }
    drawVideo({ texture0 , texture1, mixr })
    prevTime = time;
  });

  ctrl.loadVideo = function(src) {
    loadVideo(src).then(video => {
      video.loop = true;
      video.play();

      texture1(video)
      texture1.update = function() { this.subimage(video) };
      swapping = true;
      this.src = src;
    })
  }

  ctrl.loadImage = function(src) {
    console.log('loadimage', src)
    loadImage(src).then(img => {
      texture1(img);
      texture1.update = noop;
      swapping = true;
      this.src = src;
    })
  }

  return ctrl;
}

function noop() {

}
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = <img src={src} onload={e => res(img)} onerror={e => rej(img.error)} />;
  })
}

function loadVideo(src) {
  return new Promise((res, rej) => {
    const video = <video src={src} oncanplay={e => res(video)} crossorigin="anonymous" autoplay muted playsinline onerror={e => rej(video.error)} />;
  })
}
