
export default {
  "/": {
    html: text`
    We are castlebravo.
    -<a href="/cases">cases</a>
    `
  },
  "/cases": {
    html: text`
    Here are some of our cases:
    -<a href="/cases/crosby">crosby.se</a>
    -<a href="/cases/ldb">ldb</a>
    `
  },
  "/cases/crosby": {
    video: '/videos/Crosby.mp4',
    html: text`
    Crosby

    ladida`
  },
  "/cases/ldb": {
    video: '/videos/LdB.mp4',
    html: text`
    Ldb

    ladida`
  }

}

function text(strings, ...args) {
  let str = ''
  while(strings.length) {
    str += strings.shift()
    if(args.length)
      str += args.shift();
  }
  //str = str.replace(/^\s+/,'')
  let lines = str.split('\n');
  let minSpace = lines.reduce((minSpace, line) => Math.min(minSpace, space(line) || Number.POSITIVE_INFINITY), Number.POSITIVE_INFINITY);
  return lines.map(line => line.slice(minSpace)).join('\n')
  return str;
}

function space(str) {
  const m = /^ *\S/.exec(str);
  return m ? m[0].length - 1 : 0;
}
