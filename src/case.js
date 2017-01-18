
import { dom, Component, attr,  htmlToDom } from "./dom"
import { autorun, reactive, ReactiveVar } from "./tracker"
import { Grid, LeafCell } from "./grid"
import Play from "../icons/play.svg"
import Pause from "../icons/pause.svg"
import Logo from '../icons/logo_white.svg';
import Facebook from '../icons/facebook.svg';
import Google from '../icons/google.svg';
import Linkedin from '../icons/linkedin.svg';
import Twitter from '../icons/twitter.svg';
import ScrollDown from "../icons/scroll_down.svg"
import { imaginaryImgSrc, tweenr, randomHsla, loadImage, findMin } from "./util"
import makeVideoPlayableInline from 'iphone-inline-video';

export function Case({content, videos, ...intro}) {
  return (
    <div class="case">
      { content.map(({type, ...data}) => contentBlocks[type](data)) }
      <IntroBlock {...intro} />
      <Share {...intro} />
      <Footer {...intro} />
    </div>
  )
}

function IntroBlock({client, hero, title, summary, info}) {
    return (
      <section id="infoBlock">
        <div style="flex:1; align-self:flex-start;">
          <h1 style="white-space:nowrap; text-transform:uppercase">{client}</h1>
          <h2 style="white-space:nowrap">{title}</h2>
        </div>
        <ul>
          {
            info.map(({key,value}) => {
              return (
                <li style="line-height:1.4">
                  <b style="margin-right:0.1em">{key}:</b> {htmlToDom(value)}
                </li>)
              }
            )
          }
        </ul>
      </section>
    )
}

function Share({title}) {
  return (
    <section id="follow" class="block">
      <div class="content">
        <h2 style="margin-bottom:3em">SHARE</h2>
        <div>
          <a href={`https://linkedin.com/shareArticle?url=${location}&title=${title}`} title="Linkedin" target="_BLANK" style="display:inline-block; width: 6em;"><Linkedin style="width:2em; height:2em;"/></a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${location}`} title="Facebook" target="_BLANK" style="display:inline-block; width: 6em;"><Facebook style="width:2em; height:2em;"/></a>
          <a href={`https://plus.google.com/share?url=${location}`} title="Google" target="_BLANK" style="display:inline-block; width: 6em;"><Google style="width:2em; height:2em;"/></a>
          <a href={`https://twitter.com/intent/tweet?url=${location}`} title="Twitter" target="_BLANK" style="display:inline-block; width: 6em;"><Twitter style="width:2em; height:2em;"/></a>
        </div>
        <div style="margin-top:4em;">
          <a href="/#work" style="display:inline-block; padding:1em; background: #bcd6c1; color: #3f3f3f;">Back to work</a>
        </div>
      </div>
    </section>

  )
}

function Footer({title}) {
  return (
    <footer class="block" style="padding:2em 0 2em 0;">
      <div>
        <Logo style="width:1.5em; height:1.5em; margin-bottom:1em; shape-rendering:geometricPrecision;"/>
        <div style="font-size:0.7em; letter-spacing:0.05em">
          <a href="https://www.google.se/maps/place/Tomtebogatan+5,+113+39+Stockholm/@59.3412312,18.0341299,17z/data=!3m1!4b1!4m5!3m4!1s0x465f9d798a5136c5:0x35aa761c9e776987!8m2!3d59.3412285!4d18.0363239?hl=en" target="_blank" style="margin-right:0.5em">Tomtebogatan 5</a>
          |<span style="margin:0 0.4em">113 39</span><span style="letter-spacing:0.09em; margin-right:0.5em">STOCKHOLM</span>
          |<a href="tel:+46 8 52 20 50 00" style="margin:0 0.4em">+46 8 52 20 50 00</a>
          |<a href="mailto:hello@crosby.se" style="margin-left:0.4em">hello@crosby.se</a>
        </div>
      </div>
    </footer>
  )
}

function createLeaf({data, depth }) {
  data.depth = depth;
  return 'vid' in data ? new VideoCell(data) : new ImageCell(data);
}

const mouseRecentlyMoved = new ReactiveVar(false);
let moveTimeout = 0;
window.addEventListener('mousemove', e => {
  mouseRecentlyMoved.set(true);
  clearTimeout(moveTimeout);
  moveTimeout = setTimeout(() => {
    mouseRecentlyMoved.set(false);
  }, 2000)
}, false)

class VideoCell extends LeafCell {

  constructor(...args) {
    super(...args);
    this._paused = new ReactiveVar(false);
    this._mouseOverScrub = new ReactiveVar(false);
    this._position = new ReactiveVar(0);
  }

  @reactive
  get paused() {
    return this._paused.get() || !(this.focused || this.animating || this.props.cg && this.mouseOver) ;
  }

  @reactive
  get showScrub() {
    return !this.props.cg && this.focused && (mouseRecentlyMoved.get() || this._mouseOverScrub.get())
  }

  play() {
    this._paused.set(false);
  }

  pause() {
    this._paused.set(true);
  }

  renderContent({vid, src, cg }) {
    const {innerHeight:wh, innerWidth:ww} = window;

    const vidLink = vid.map(({src, width, height, poster}) => ({
        fit: Math.abs(Math.min(wh/width, wh/height)-1),
        ratio: width/height,
        src,
        poster
      }))::findMin((a,b)=>a.fit-b.fit);
    const imgSrc = src ? imaginaryImgSrc('images/'+src) : vidLink.poster;

    const initBg = bg => {
      autorun(_ => {
        bg.style.transform = this.mouseOver ? 'scale(1.01)' : 'scale(1.05)'
      })
    }

    const initVid = video => {
      this.refs.video = video;
      makeVideoPlayableInline(video);

      video.volume = 0;
      if(!cg) {
        video.style.opacity = 0;

      }
      video.onplay = e => {
        video.style.opacity = 1;
      };

      const updatePosition = () => {
        this._position.set(video.currentTime/video.duration*0.95);
      }
      let updateInt = 0;

      autorun(_ => {
        const focused = this.focused;
        tweenr.to(video, { volume: focused ? 1 : 0, duration: 0.5 })
        clearInterval(updateInt);
        if(focused)
          updateInt = setInterval(updatePosition, 1000/30)
      })
      autorun(_ => {
        if(video.paused != this.paused)
          if(this.paused)
            video.pause();
          else
            video.play();
      })

    }

    const initScrubBar = scrub_bar => {
      this.refs.scrub_bar = scrub_bar;
      autorun(() => {
        const paused = this.paused;
        this.refs.togglePlay.style.opacity = !paused ? 0 : 1;
        this.refs.togglePause.style.opacity = paused ? 0 : 1;
        this.refs.togglePlay.style.pointerEvents = paused ? 'all' : 'none';
        this.refs.togglePause.style.pointerEvents = !paused ? 'all' : 'none';
      })

      autorun(() => {
        scrub_bar.style.opacity = this.showScrub ? 1 : 0;
      })

      autorun(() => {
        this.refs.scrub.style.left = this._position.get()*100+'%';
      })
    }

    const initPlayBtn = btn => {
      autorun(_ => {
        btn.style.opacity = this.props.cg && !this.paused || this.focused ? 0 : 1;
      })
    }

    const seekEvent = e => {
      e.stopImmediatePropagation();
      e.preventDefault();
      const { left, width } = this.refs.scrub_bar.getBoundingClientRect();
      const video = this.refs.video;
      video.currentTime = (e.pageX-left) / width * video.duration;
    }

    const startScrub = e => {
      const scrub = this.refs.scrub;
      window.addEventListener('mousemove', seekEvent, false);
      window::once('mouseup', e => {
        window.removeEventListener('mousemove', seekEvent, false);
      })
    }

    loadImage(imgSrc).then(img => {
      this.ratio = vidLink.ratio;
      this.show();
    })

    const videoOpt = { }
    if(cg) {
      videoOpt.playsinline = true;
      videoOpt.muted = true;
      videoOpt.loop = true;
    }
    return [
      <div ref={initBg} style={`position:absolute;width:100%;height:100%;background:url(${imgSrc}) center/contain no-repeat;transition:transform 0.3s`}>
        <video class="IIV" ref={initVid} {...videoOpt} style="position:absolute;width:100%;height:100%;transition:opacity 0.5s" src={vidLink.src} ></video>
        <div ref={initScrubBar} style={`position:absolute;bottom:3em;width:50%;left:25%;height:1em;background:rgba(0,0,0,0.4);opacity:0;transition:opacity 0.5s;font-size:1rem`}
          onclick={ seekEvent }
          onmouseenter={ e => this._mouseOverScrub.set(true) }
          onmouseleave={ e => this._mouseOverScrub.set(false) }>
          <Play ref="togglePlay" onclick={e => { e.stopImmediatePropagation(); this.play(); } } class="playicon" style="position:absolute;height:2em;width:2em;left:-2em;" />
          <Pause ref="togglePause" onclick={e => { e.stopImmediatePropagation(); this.pause(); } } class="playicon" style="position:absolute;height:2em;width:2em;left:-2em;" />
          <div ref="scrub" onmousedown={ startScrub } style="position:absolute;width:5%;height:100%;background:black"></div>
        </div>
      </div>,
      <Play ref={initPlayBtn} class="playicon" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transition:opacity 0.5s" />
    ]
  }
}

class ImageCell extends LeafCell {

    renderContent(data) {
      const src = imaginaryImgSrc('images/'+data.src)

      loadImage(src).then(img => {
        this.ratio = img.naturalWidth/img.naturalHeight;
        this.show();
      }).catch(e => {
        this.node.parentNode.removeChild(this.node);
      })

      const init = el => {
        autorun(_ => {
          el.style.transform = this.mouseOver ? 'scale(1.01)' : 'scale(1.05)'
        })
      }
      return <div ref={init} style={`position:absolute;width:100%;height:100%;background:url(${src}) center/contain no-repeat;transition:transform 0.3s`}></div>
    }

}

const contentBlocks = {
  imageblock({title, images}) {
    return <section class="imageblock">{ title ? <h1>{title}</h1> : null}<Grid data={images} leafType={createLeaf} /></section>;
  },
  textblock({title, text}) {
    return <section class="textblock">{ title ? <h1>{title}</h1> : null}<p>{htmlToDom(text)}</p></section>
  }
}

function once(type, callb, target = this) {
  target.addEventListener(type, handler, false);
  function handler(e) {
    target.removeEventListener(type, handler, false);
    callb(e);
  }
}

function parseUrl(url) {
  const a = document.createElement('a')
  a.href = url;
  const query = {};
  a.search.substring(1).split('&').filter(x => x).map(kv => {
    const [key, value] = kv.split('=')
    query[key] = value;
  })
  return {
    protocol:a.protocol,
    host:a.host,
    hostname:a.hostname,
    port:a.port,
    pathname:a.pathname,
    hash:a.hash,
    search:a.search,
    origin:a.origin,
    query
  }
}
