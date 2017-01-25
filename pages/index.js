import Head from 'next/head';
import React from 'react';
import Link from 'next/prefetch'

import { Video } from '../components/video';

class ScrollPage extends React.Component {

  EXTRA_HEIGHT = 500

  updateSize = () => {
    console.log('updateSize')
    const { wrapper, head, content } = this.refs;
    content.style.paddingTop = head.offsetHeight + 'px';
    wrapper.style.height = content.offsetHeight + this.EXTRA_HEIGHT + 'px';
    this.updateScroll();
  }
  updateScroll = () => {
    const offset = Math.max(0, document.body.scrollTop - this.EXTRA_HEIGHT);
    const tweenRatio = Math.min(1, document.body.scrollTop/this.EXTRA_HEIGHT);

    this.refs.head.style.marginLeft = 20+tweenRatio*50+'vw';
    this.refs.head.style.width = 60-tweenRatio*30+'vw';
    this.refs.content.style.marginLeft = 5+(1 - tweenRatio)*15+'vw';
    this.refs.content.style.top = -offset+'px';
  }

  render() {
    return (
      <div ref="wrapper" style={{position:'relative', overflow: 'hidden' }}>
        <div ref="head" style={{position:'fixed', width:'60vw', marginLeft: '20vw' }}>
          <section>
            <Video />
          </section>
        </div>
        <div ref="content" style={{position:'fixed', width:'60vw', marginLeft: '20vw' }}>{this.props.children}</div>
      </div>
    )
  }

  componentDidMount() {
    this.updateSize();
    //this.updateScroll();
    window.addEventListener('resize', this.updateSize);
    window.addEventListener('scroll', this.updateScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
    window.removeEventListener('scroll', this.updateScroll);
  }
}


export default () => (
  <ScrollPage>
    <div className="root">
      <Head>
        <title>Castle Bravo</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <section id="intro">
        <h2>We are an innovation and creative technology bureau.</h2>
        <div className="cols">
          <p>
            With backgrounds in computer science, mathematics,
            complex software development, advertising and communication we know the backbone,
            the main ingredients of today’s society, ones and zeros.
          </p>
          <p>
            Internet is our business and passion and we do everything we can to contribute to it’s evolution.
            We’ll help you be unique within the digital sphere by performing R&D,
            Prototyping of a product or idea or by making a finalized product as part of your offer.
          </p>
        </div>
      </section>

      <section id="work">
        <p className="cases">
          WITH TBWA STOCKHOLM WE DID <Link href="/case/ldb"><a>A BROWSER POSTCARD EDITOR</a></Link> AND
          FOR ATLAS COPCO WE MADE <Link href="/case/atlas_copco_products"><a>MULTIPLE PRODUCT PAGES</a></Link>.
          &nbsp;TOGETHER WITH GRAVIZ WE CREATED A <Link href="/case/concrete_accuracy"><a>DUAL SCREEN GAME</a></Link>
          &nbsp;AND WE MADE THIS <Link href="/case/minequest"><a>QUIZ</a></Link> TO UNITE ATLAS COPCO.
          WE HELPED CROSBY STHLM SHARE THEIR WORK WITH A <Link href="/case/crosby"><a>NEW SITE</a></Link>
          &nbsp;AND WE PRESENTED <Link href="/case/ideas_move_mountains"><a>SIX STORIES</a></Link> FOR ATLAS COPCO’S IDEAS MOVE MOUNTAINS
        </p>

        <p>
          And we enjoy our friends at and being part of Mason Bower Group.
          Number10, Graviz, Crosby, Mason Bower, deBroome, Omnilux
        </p>
      </section>

      <section id="people">
        <h2>WHO</h2>
        <p>
          Andreas Karlsson - Technical Director & Digital Wizkid<br />
          Creative web developer with over 20 Years experience of complex software
          and advanced web application development.
          Enjoy finding technical solutions to transform ideas into experiences and
          services for web and mobile platforms.
          Driven by a sting passion and curiosity for both computer science and math,
          constantly learning and experimenting with new ideas in side projects to improve
          my current skills and daily workflow.
        </p>

        <p>
          André Lillvede - Fullstack Developer / System Architect & Devops Guru<br />
          Software generalist that likes to build and run things of different kinds,
          websites, tools or homemade beer brewing systems are all game.
          André has extensive experience of working on different positions in all
          kinds of projects, big and small, large systems and small campaign sites and
          have an insatiable curiosity regarding new technologies.
        </p>

        <p>
          Johan Lövblad - Executive producer<br />
          6 years experience from the creative tech industry. Hyper Island alumni,
          with background in both advertising agencies and digital production
          houses as a producer. Worked with global brands and award winning projects.
          Enjoy smart processes, clever and beautiful use of technology.
        </p>
      </section>

      <section id="contact">
        <h2>CONTACT</h2>
        <p>
          New business:<br />
          + 46 (0) 8 522 050 40<br />
          johan.lovblad@castlebravo.se<br /><br />

          General questions:<br />
          hello@castlebravo.se
          <br /><br />

          Visit us at:<br />
          Tomtebogatan 5 SE-113 39 Stockholm<br />

        </p>
      </section>

      <footer>
        Follow us:
        FACEBOOK | LINKEDIN |  TWITTER | INSTAGRAM | GITHUB
      </footer>

      <style jsx>{`
        div.root {
          display: flex;
          color: white;
          flex-direction: column;
          align-items: center;
        }
        section {
          //width: 100%;
          margin-bottom: 2em;
          font-family: Baskerville W01 Regular_705699;
          font-size: 1.2em;
        }

        .cols {
          position:relative;
          width: 100%;
          display: flex;

        }

        .cols > p {
          width:50%;
          padding-left: 1em;
          margin: 0;
        }

        .cols > p:first-child {
          padding-right: 1em;
          padding-left: 0;
        }

        #work p {
         font-family: Avenir Next LT W01 Bold;
        }

        .cases {
          text-align: justify;
          font-size: 1.5em;
        }

        .cases a {
          color: yellow;
          font-family:Baskerville W01 Italic;
        }

        section h1, section h2 {
          margin: 0.5em 0;
          font-size: 1.5em;
          font-family: Avenir Next LT W01 Bold;
        }

        @media (max-width: 720px) {
          .cols {
            flex-direction: column;
          }

          .cols > p {
            width:100%;
            padding-left: 0em;
            padding-right: 0em;
          }

          .cols > p:last-child {
            margin-top: 0;
          }
        }
      `}</style>

    </div>
  </ScrollPage>
)
