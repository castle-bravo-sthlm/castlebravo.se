
import "./style.less";
import h from 'hyperscript'

//const logo = h('h1', {style:'position:fixed;margin:0;font-size:13vw;white-space:nowrap;font-weight:normal;top:50%;left:50%;transform:translate(-50%,-50%);'},'CASTLE BRAVO');
document.body.appendChild(h('video#video', {loop:true, autoplay:true}, ['mp4','ogv','webm'].map(type => h('source', { src:`video/castlebravo.${type}`, type:`video/${type}`}))));
document.body.appendChild(h('div#content',
  h('img', {src: 'logo.svg'}),
  h('p', 'A creative tech bureau, within the advertising and marketing area.'),
  h('p', 'We know technology and programming. We can help you realise an experience for your audience, solutions to streamline business, or prototypes to evolve an idea.'),
  h('footer','Tomtebogatan 5 – 113 39  Stockholm, Sweden')
))
//requestAnimationFrame(cycleColor);

function cycleColor(t) {
  requestAnimationFrame(cycleColor);
  let hue = Math.round(t/50) % 100;
  if(hue > 50)
    hue = 100 - hue;
  logo.style.textShadow = `0 0 5px hsl(${hue}, 100%, 50%)`;
}
