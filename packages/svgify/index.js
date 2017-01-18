"use strict"
const path = require('path')
const SVGO    = require('svgo');
const through = require('through2');

const SVG_REGEX  = /\.svg$/i;

const svgo = new SVGO({
    plugins: [
        {convertStyleToAttrs: true},
        {removeAttrs: {attrs: 'style'}},
        {removeViewBox: false},
        {removeUselessStrokeAndFill: false}
    ]
});

const tmpl = {
  string(svg) {
    return `module.exports = ${JSON.stringify(svg)};`
  },
  element(svg) {
    return `
    module.exports = function(attr) {
      var el = document.createElement('div');
      el.innerHTML = ${JSON.stringify(svg)};
      el = el.childNodes[0];
      Object.keys(attr || {}).forEach(function(key) {
        var value = attr[key];
        if(key == 'className')
          key = 'class';
        if(typeof value == 'function' || typeof value == 'object')
          el[key] = value;
        else
          el.setAttribute(key, value);
      })
      return el;
    }`
  }
}

module.exports = (filename, options) => {
  if(!SVG_REGEX.test(filename))
    return through();


  let buffer = ''
  function data(buf, enc, next) {
    buffer += buf.toString();
    next();
  }
  function finish(next) {
    svgo.optimize(buffer, svg => {
      this.push(tmpl.element(svg.data))
      next();
    })
  }
  return through(data, finish);
}
