
export default {
  "/": {
    html: text`
    We are castlebravo.
    -<a href="/cases">cases</a>
    `
  },
  "/cases": {
    video: 'case0.mp4',
    html: `
    Here is some of our cases:
    -<a href="/cases/crosby">crosby.se</a>
    `
  }
}

function text(strings, ...args) {
  let str = ''
  while(strings.length) {
    str += strings.shift()
    if(args.length)
      str += args.shift();
  }
  str = str.replace(/\n +/g, '\n')
  return str;
}
