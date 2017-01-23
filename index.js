
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

const page = new ReactiveVar({});
const video = new ReactiveVar('case0.mp4')

const history = createHistory();
history.listen(handleLocation);
handleLocation(history.location)

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
    let charInt = 0;
    let i = 0;
    autorun(c => {
      const {video, html } = page.get() || {};
      this.refs.html.innerHTML = html;

      if(video) {
        if(this.refs.comp.src != video)
          this.refs.comp.loadVideo(video);
        //this.refs.comp.large = true;
      } else {
        this.refs.comp.loadImage('logo.jpeg');
        //this.refs.comp.large = false;
      }
    });

    window.addEventListener('scroll', e => {
      this.refs.space.style.height = `calc(43vh + ${document.body.scrollTop}px)`;
    })
  }

  return (
    <div ref={initContent}>
      <div ref="space" style="float:right; background:none; width:85vh; height:43vh" ></div>
      <div style="float:right; background:none; width:119vh; height:30vh;clear:right" ></div>
      <div style="float:right; background:none; width:95vh; height:calc(27vh - 2em);clear:right" ></div>
      <div style="margin:2em;" ref="html"></div>
      <Computer ref="comp" />
    </div>
  )
}



function tween(fn, duration) {

}
