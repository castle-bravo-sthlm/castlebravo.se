
export default {
  "/": {
    html: text`
    We are an innovation and creative technology bureau.

    Internet is our business and passion.  We do everything we can to contribute to it’s evolution.
    We come from a various background, computer scientists and mathematics from the Royal Swedish Institute of technology. Background within from both advertising and complex software development. We know most of the programming languages, but prefer javascript and open source libraries.

    Internet is rapidly growing. Now days it’s integrated in our daily lives and It’s easier for each common person to control their digital life without knowledge in programming.
    A lots of services has being automated and more or less it's like building lego, mixing components to get an end result. Knowledge in collecting data to see what people like makes it easier to talk to the audience.

    But as we see it automising and simplifying the web comes with a price. The web turns more and more boring. Soon everyhthing might look the same.
    This is what we want to challenge.
    We’ll help you be unique within the digital sphere, by this you probably gain lots of profit and stardom.
    -<a href="/cases">cases</a>
    `
  },
  "/cases": {
    html: text`
    Here are some of our cases:
    -<a href="/cases/crosby">crosby.se</a>
    -<a href="/cases/ldb">ldb</a>
    -<a href="/cases/concreteaccuracy">concrete accuracy</a>
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
    Description
    Web-application, interactive campaign site for desktop and mobile.
    Participants could design a postcard from their fantasy tropical island.

    Challenge
    Get a realistic look and feel with minimal weight and loading time.

    Solution
    Employed WebGL and advanced shader techniques to ray  trace the sand in the beach, realtime. `
  },
  "/cases/concreteaccuracy": {
    video: '/videos/ConcreteAccuracy.mp4',
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
