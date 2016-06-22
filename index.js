
import h from 'hyperscript'

const logo = h('h1', {style:'position:fixed;margin:0;font-size:13vw;white-space:nowrap;font-weight:normal;top:50%;left:50%;transform:translate(-50%,-50%);'},'CASTLE BRAVO');
document.body.appendChild(logo);

requestAnimationFrame(cycleColor);

function cycleColor(t) {
  requestAnimationFrame(cycleColor);
  let hue = Math.round(t/50) % 100;
  if(hue > 50)
    hue = 100 - hue;
  logo.style.textShadow = `0 0 5px hsl(${hue}, 100%, 50%)`;
}
