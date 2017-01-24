import createRegl from 'regl';
import glsl from 'glslify';
import React from 'react';
import mime from 'browserify-mime';

export class Video extends React.Component {

  componentDidMount() {
    //console.log('initCanvas')
    const canvas = this.refs.canvas;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    this._ctrl = startRegl(canvas);
    if(this.props.src)
      console.log('src', this.props.src);

    this._ctrl.loadImage('/static/logo.jpeg');
  }

  render() {
    const {src, ...rest } = this.props;

    //console.log('render!');

    return <canvas ref="canvas" {...rest} />;
  }

  componentDidUpdate() {
    //console.log('after update');
    const canvas = this.refs.canvas;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this._ctrl.load(this.props.src);
  }

  componentWillUnmount() {
    this._ctrl.cancel();
  }

}



function startRegl(canvas) {
  const regl = createRegl(canvas);
  const drawVideo = regl({
    frag: glsl`
    precision mediump float;
    uniform sampler2D texture0;
    uniform sampler2D texture1;
    uniform float time;
    uniform float mixr;
    uniform float noise;

    varying vec2 uv;

    #pragma glslify: glitch = require('./video_glitch', time=time)
    #pragma glslify: crt_bulge = require('./crt_bulge')

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
      //float noise = .3 + smoothstep(.0, .3, mixr);
      if(uv2.y > mixr) {
        color = glitch(texture0, uv2, noise);
      } else {
        color = glitch(texture1, uv2, noise);
      }
      // color.xyz = vec3(grid(uv2, vec2(.1,.1)));
      gl_FragColor = pow(color, vec4(bulge(uv)));
    }`,

    vert:`
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

      noise: regl.prop('noise'),

      time: regl.context('time')
    },

    count: 3
  });

  let mixr = 0, prevTime = 0, swapping = false, noise = 0.3;
  let texture0 = regl.texture({min:'linear', mag:'linear'});
  let texture1 = regl.texture({min:'linear', mag:'linear'});

  texture0.update = texture1.update = noop;

  document.onscroll = e => noise += 0.5;

  const ctrl = regl.frame(({time}) => {

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

    noise = Math.max(0.2, noise*0.95);
    drawVideo({ texture0, texture1, mixr, noise })
    prevTime = time;
  });

  ctrl.load = function(src) {
    const [type] = mime.lookup(src).split('/');
    switch (type) {
      case 'image':
        return this.loadImage(src);
      case 'video':
        return this.loadVideo(src);
    }
    throw new Error(`Unknown type "${type}" for ${src}`);
  }

  ctrl.loadVideo = function(src) {
    loadVideo(src).then(video => {
      video.loop = true;
      video.play();

      texture1(video)
      texture1.update = function() { this.subimage(video) };
      swapping = true;
      noise += 2;
      this.src = src;
    })
  }

  ctrl.loadImage = function(src) {
    loadImage(src).then(img => {
      texture1(img);
      texture1.update = noop;
      swapping = true;
      noise += 2;
      this.src = src;
    })
  }

  return ctrl;
}

function noop() {}

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = document.createElement('img');
    img.onload = e => res(img);
    img.onerror = e => rej(e);
    img.src = src;
  })
}

function loadVideo(src) {
  return new Promise((res, rej) => {
    const video = document.createElement('video');
    video.oncanplay = e => res(video);
    video.onerror = e => rej(video.error);
    video.crossorigin = 'anonymous';
    video.autoplay = true;
    video.muted = true;
    video.playsinline = true;
    video.src = src;
  })
}
