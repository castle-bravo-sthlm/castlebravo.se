
import { dom } from './dom';
import { autorun, ReactiveVar} from './tracker';
import createHistory from "history/createBrowserHistory";
import delegate from 'delegate';
import content from './content';
import { Computer } from './computer';


window.onerror = e => {
  alert(e);
  window.onerror = undefined;
};

const history = createHistory();
history.listen(handleLocation);
window.onload = e => handleLocation(history.location);

const page = new ReactiveVar({});
const video = new ReactiveVar('case0.mp4')

function handleLocation({pathname}) {
  console.log('loc', pathname)
  page.set(content[pathname] || content['/']);
}

delegate(document.body, 'a', 'click', e => {
  const target = e.delegateTarget;

  if(target.host == location.host) {
    e.preventDefault();
    if(target.pathname == location.pathname)
      history.replace(target.getAttribute('href'));
    else
      history.push(target.getAttribute('href'));
  }
})

document.body.appendChild(<App />)

function App() {

  const initContent = (el) => {
    autorun(c => {
      const {video, html } = page.get() || {};
      this.refs.html.innerHTML = html;
      if(video) {
        if(this.refs.comp.src != video)
          this.refs.comp.loadVideo(video);
      } else {
        console.log('wtf')
        this.refs.comp.loadImage('logo.jpeg');
      }
    })
  }

  return (
    <div ref={initContent}>
      <div style="white-space:pre-wrap" ref="html"></div>
      <Computer ref="comp" />
    </div>
  )
}



function tween(fn, duration) {

}
