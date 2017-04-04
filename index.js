
import "./style.less";
import h from 'hyperscript'

const logo = h('h1', {style:'position:fixed;margin:0;font-size:13vw;white-space:nowrap;font-weight:normal;top:50%;left:50%;transform:translate(-50%,-50%);'},'CASTLE BRAVO');
document.body.appendChild(h('video#video', {loop:true, autoplay:true}, ['mp4','ogv','webm'].map(type => h('source', { src:`video/castlebravo.${type}`, type:`video/${type}`}))));
document.body.appendChild(h('div#content',
  h('img#logo', {src: 'logo.svg'}),
  h('h1', 'A CREATIVE TECH BUREAU'),
  h('p', 'Believe in the core, fast release and scale up.'),
  h('p', 'Use technology to bend reality.'),
  h('footer',
    h('p',
      h('a', 'hello@castlebravo.se', {href:'mailto:hello@castlebravo.se'})
    ),
    h('p',
      h('a', '+46 08 522 050 40', {href:'tel:+46 08 522 050 40'} )
    ),
    h('p', 'Tomtebogatan 5 – 113 39  Stockholm, Sweden'),
    h('p',
      h('a', h('i.icon-instagram'), {href:'https://www.instagram.com/castlebravosthlm/', target:'_BLANK'}),
      h('a', h('i.icon-linkedin-rect'), {href:'https://www.linkedin.com/company/castle-bravo/', target:'_BLANK'}),
      h('a', h('i.icon-facebook-rect'), {href:'https://www.facebook.com/castlebravosthlm', target:'_BLANK'}),
      h('a', h('i.icon-github'), {href:'https://github.com/castle-bravo-sthlm', target:'_BLANK'}),
      h('a', h('i.icon-twitter-bird'), {href:'https://twitter.com/CB_STHLM', target:'_BLANK'})
    ),
  )
))
//requestAnimationFrame(cycleColor);

function cycleColor(t) {
  requestAnimationFrame(cycleColor);
  let hue = Math.round(t/50) % 100;
  if(hue > 50)
    hue = 100 - hue;
  logo.style.textShadow = `0 0 5px hsl(${hue}, 100%, 50%)`;
}
