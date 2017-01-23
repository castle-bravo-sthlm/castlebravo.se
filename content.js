
export default {
  "/": {
    html: text`
    We are an innovation and creative technology bureau.

    With backgrounds in computer science, mathematics, complex software development, advertising and communication we know the backbone, the main ingredients of today’s society, ones and zeros. Internet is our business and passion and we do everything we can to contribute to it’s evolution.

    We’ll help you be unique within the digital sphere by performing R&D, Prototyping of a product or idea or by making a finalized product as part of your offer.

    WITH <a href="/case/tbwa">TBWA</a> STOCKHOLM WE DID A BROWSER POSTCARD EDITOR

    FOR <a href="/case/atlas_copco">ATLAS COPCO</a> WE MADE MULTIPLE PRODUCT PAGES

    TOGETHER WITH <a href="/case/graviz">GRAVIZ</a> WE CREATED A DUAL SCREEN GAME

    WE MADE THIS <a href="/case/quiz">QUIZ</a> TO UNITE ATLAS COPCO

    WE HELPED <a href="/case/crosby">CROSBY</a> STHLM SHARE THEIR WORK WITH A NEW SITE
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
  "/case/tbwa": {
    video: '/videos/LdB.mp4',
    html: text`
    An interactive campaign site for desktop and mobile created for LdB and Cederroth where participants could design a postcard from their fantasy tropical island, invite friends to vote for it and in the end (maybe) win a trip or some other nice prize.
    The challenge was to get a realistic look and feel with minimal loading time and to do that we used WebGL Canvas and advanced shader techniques to ray trace the sand and place objects on the beach realtime.
    `
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
  str = str.trim().replace(/\n/g,'<br>');
  return str;
}
