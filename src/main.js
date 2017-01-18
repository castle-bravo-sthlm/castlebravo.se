
import { dom, Component, htmlToDom} from "./dom"
import { autorun } from "./tracker"
import { Grid, LeafCell } from "./grid"
import { imaginaryImgSrc, loadImage, scrollTo } from "./util"
import Logo from '../icons/logo_white.svg';
import Linkedin from '../icons/linkedin.svg';
import Instagram from '../icons/instagram.svg';
import ScrollDownArrow from '../icons/scroll_down.svg';
import Transform from 'tween-css-transform';
import makeVideoPlayableInline from 'iphone-inline-video';
import * as style from '../styledefs.js';

export function Main({cases, contacts}) {

  return (
    <div class="main">
      <Intro id="intro"/>
      <section id="work" class="casegrid block">
        <div class="center">
          <h1 class="glitch" data-text="DONE">DONE</h1>
        </div>
        <Grid data={cases} leafType={CaseLink} />
      </section>

      <section id="about" class="block">
        <div class="content">
          <h2 style="margin-bottom:2em">ABOUT</h2>
          <p>
            We are passionate about visual communication.<br/>
            We believe in integrated disciplines for a modern agile production.<br/>
            We deliver film, photo, digital, print, 3D and postproduction.<br/>
          </p>
        </div>
      </section>

      <section id="contacts" class="block">
        <div class="content">
          <h2 style="margin-bottom:4em">CONTACT</h2>
          <div class="list">
            {contacts.map((contact,index) => <Contact count={contacts.length} index={index} { ...contact } /> )}
          </div>
        </div>
      </section>

      <section id="follow" class="block">
        <div class="content">
          <h2 style="margin-bottom:3em">FOLLOW</h2>
          <div>
            <a href="https://www.linkedin.com/company/crosby" title="Linkedin" target="_BLANK" style="display:inline-block; width: 7em;"><Linkedin style="width:2em; height:2em;"/></a>
            <a href="https://www.instagram.com/crosbysthlm/" title="Instagram" target="_BLANK" style="display:inline-block; width: 7em;"><Instagram style="width:2em; height:2em;"/></a>
          </div>
        </div>
      </section>

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
    </div>
  )
}

function Intro({activities, id}) {
  setTimeout(_ => {
    makeVideoPlayableInline(this.refs.video, false);
  })
  return (
    <section id={id} class="intro" style="text-align:center">
      <div class="video" style="position:relative;height:100vh;width:100%;overflow:hidden">
        <video ref="video" muted playsinline autoplay loop style="display:block;width:100%;height:100%;object-fit:cover">
          <source src="case/intro.mp4" type="video/mp4" />
          {/* <source src="case/intro.webm" type="video/webm" /> */}
        </video>
        <div class="introText">
          <h1><span style="letter-spacing:0.03em">We are</span> Castle Bravo</h1>
          <p>An integrated production company with a unique combination of skills. You are either a creative agency or a visionary brand. Together we produce powerful visual content.</p>
          <p>Collaborate, Create &amp; Execute.</p>
        </div>
        <ScrollDown />

      </div>
    </section>
  );
}


function ScrollDown() {
  return (
    <div class="downArrow" onclick={e => {scrollTo('work')}}>
      <ScrollDownArrow/>
    </div>
  )
}

function Contact({name, title, email, tel}) {
  return (
    <div class="contact">
      <h3>{htmlToDom(name)}</h3>
      <p>{title}<br/>
        <a href={`mailto:${email}`}>{email}</a><br/>
        <a href={`tel:${tel}`}>{tel}</a><br/>
      </p>
    </div>
  )
}

class CaseLink extends LeafCell {

  get src() {
    return imaginaryImgSrc(`/case/${this.data.id}/${this.data.img || this.data.hero}`)
  }

  renderContent() {
    console.log(this.data)
    loadImage(this.src).then(img => {
      this.ratio = img.naturalWidth/img.naturalHeight;
      this.show();
    })
    const initImageEl = el => {
      autorun(_ => {
        const caselink = this.refs.caselink;

        el.style.filter = this.mouseOver ? 'invert(100%)' : 'invert(0%)';

        switch (this.data.thumbShape) {
          case "triangle":
            el.style['clip-path'] = 'polygon(50% 0%, 0 100%, 100% 100%)';
            break;
          case "circle":
            el.style['clip-path'] = 'circle(35% at 50% 50%)';
            break;
          case "rhombus":
            el.style['clip-path'] = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
            break;
          default:
            break;
        }
        if(caselink)
          caselink.style.color = this.mouseOver ? style.green : 'inherit';
      })
    }
    return [
      <div ref={initImageEl} href={`/case/${this.data.id}/`} style={`position:relative;width:100%;height:100%;background:url(${this.src}) center/cover no-repeat;transition:transform 0.3s;`}></div>,
      <div ref="caselink" class="caselink" style="transition:color 0.3s">
        <h2>{this.data.client}</h2>
        <h3>{this.data.title}</h3>
      </div>
    ]
  }

  toggleFocus() {
    // don't focus casegrid cells..
  }

}
