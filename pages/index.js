import Head from 'next/head';
import React from 'react';
import Link from 'next/prefetch'

import { Video } from '../components/video';
import HeadSlide from '../components/headslide';


// videos are 768*512

export default () => (
  <HeadSlide width={60} minWidth={550} head={(
    <section style={{position:'relative', width: 'calc(40vw - 2em)', minWidth:'calc(0.4 * 550px)', maxWidth:'600px', margin:'2em auto 0 auto' }}>
        <div style={{position:'relative', paddingTop:100/1.5+'%', backgroundColor:'#162931' }}>
          <Video style={{position:'absolute', top:'-15px', left:'-15px', width:'100%',height:'100%'}} width="768" height="512"/>
        </div>
    </section>
  )}>
    <div className="root">
      <Head>
        <title>Castle Bravo</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <section id="intro">
        <h1>Innovation and creative technology bureau.</h1>
        <div className="cols">
          <p>
            With background in computer science, mathematics, complex software development,
            advertising and communication we know the backbone, the main ingredients of today’s society, ones and zeros.
          </p>
          <p>
            Internet is our business, our passion and we do everything we can to contribute to it’s evolution.
            We’ll help you be unique within the digital sphere by performing R&D, Prototyping of a product,
            idea or by making a finalized product as part of your offer.
          </p>
        </div>
      </section>

      <section id="work">
        <p className="cases">
          WITH <a href="http://">TBWA</a> STOCKHOLM WE DID <Link href="/case/ldb"><a>A BROWSER POSTCARD EDITOR</a></Link> AND
          FOR <a href="http://">ATLAS COPCO</a> WE MADE <Link href="/case/atlas_copco_products"><a>MULTIPLE PRODUCT PAGES</a></Link>.
          TOGETHER WITH <a href="http://">GRAVIZ</a> WE CREATED A <Link href="/case/concrete_accuracy"><a>DUAL SCREEN GAME</a></Link>
          &nbsp;AND WE MADE THIS <Link href="/case/minequest"><a>QUIZ</a></Link> TO UNITE <a href="http://">ATLAS COPCO</a>.
          WE HELPED <a href="http://">CROSBY STHLM</a> SHARE THEIR WORK WITH A <Link href="/case/crosby"><a>NEW SITE</a></Link>
          &nbsp;AND WE PRESENTED <Link href="/case/ideas_move_mountains"><a>SIX STORIES</a></Link> FOR <a href="http://">ATLAS COPCO’S</a> IDEAS MOVE MOUNTAINS
        </p>

        <p className="friends">
          And we enjoy our friends at and being part of <a href="http://masonbower.com/">Mason Bower Group</a>.
          &nbsp;<a href="http://www.number10.se/">Number10</a>, <a href="http://www.graviz.se/">Graviz</a>, <a href="http://www.crosby.se/">Crosby</a>, <a href="http://debroome.com/">deBroome</a>, <a href="http://www.omnilux.se/">Omnilux</a>
        </p>
      </section>

      <section id="vision">
        <h2>Vision</h2>
        <div className="cols">
        <p>
          Creating digital awareness today has become more and more like using building blocks.
          In the toolbox there’s lots of different pieces to choose from.
          Mixing and combining different parts will permit a fast pace in creating new services and solutions.
        </p>

        <p>
          We see the importance in getting something small out fast, to start evaluating.
          Early releases, evaluation, redevelop and updating will give a better outcome.
          You can call it an agile or lean development way of working but of course, in the end,
          it’s about making the project more time and budget efficient.
        </p>
        </div>
      </section>

      <section id="process">
        <h2>Process</h2>
        <div className="cols">
        <p>
          We work in small iterations. An iteration will produce something useful to evaluate so
          we can keep the best direction. The evaluation will tell if a project is to be considered
          done or if it should take a whole other direction.
        </p>

        <p>
          An iteration is probably a week, an hour or a day is often too short to be able
          to fit something useful within so a week is more likely to present a result worthy evaluation.
          Therefore we quote on what’s possible within a iteration and take in consideration
          a team with the ultimate skill set for the task.
        </p>
        </div>
      </section>

      <section id="services">
        <h2>Taking care of the whole picture</h2>
        <p>
          We have a firm belief in DevOps and we use practises such as continuous delivery
          integrated with version control so we preferably like to be in charge of hosting and deployment.
          This gives us the possibility to fine tune and ensure high availability of what we have produced
          and also has the upside that updates and fixes can be released fast and without disruption.
        </p>
        <p>
          We have our own hardware located in Stockholm but are also able to host projects all over the
          world using various cloud providers (Amazon Web Services, Google Cloud Platform, etc ) depending on
          the need for speed and availability.
        </p>

        <p>
          We are developers and we trust the power of the browser. We create web-applications.
          We preferably send data through wire rather than in HTML. We prefer to work in Javascript.
        </p>

        <p>
          We’ll create games, tracking solutions, services, websites, installations. We’ll perform R&D,
          to help you see possibilities. We can be your innovative partner and sound board in technicalities.
          We’ll develop a proof of concept, call it a prototype if you want. Use it to make sure an
          idea  will fly or to show potential investors or clients. We’ll finalize the development
          to a finished product or service. Full stack development.
        </p>

      </section>

      <section id="people">
        <h2>WHO</h2>
        <p>
          Andreas Karlsson - Technical Director<br />
          Creative web developer with over 20 Years experience of complex software
          and advanced web application development.
          Enjoy finding technical solutions to transform ideas into experiences and
          services for web and mobile platforms.
          Driven by a burning passion and curiosity for both computer science and math,
          constantly learning and experimenting with new ideas in side projects to improve
          current skills and daily workflow.
        </p>

        <p>
          André Lillvede - Fullstack Developer<br />
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
          Johan Lövblad<br />
          Executive producer<br />
          + 46 (0) 8 522 050 40<br />
          johan.lovblad@castlebravo.se<br />
          <br />

          Andreas Karlsson<br />
          Technical director<br />
          +46 (0) 8 522 50 56<br />
          johan.lovblad@castlebravo.se<br /><br />

          André Lillvede<br />
          Fullstack developer<br />
          +46 (0) 8 522 50 67<br />
          johan.lovblad@castlebravo.se<br /><br />

          General questions:<br />
          hello@castlebravo.se<br />
          <br />

          Visit us at:<br />
          Tomtebogatan 5 SE-113 39 Stockholm<br />
          <br />
          Follow us:<br />
          <a href="https://www.facebook.com/castlebravosthlm/">Facebook</a>, <a href="https://www.linkedin.com/company/castle-bravo">Linkedin</a>, <a href="https://twitter.com/CB_STHLM">Twitter</a>, <a href="https://www.instagram.com/castlebravosthlm/">Instagram</a>, <a href="https://github.com/castle-bravo-sthlm">Github</a>
        </p>
      </section>

      <footer>
         <div className="logo"><img src="/static/logo.svg" /></div>
         Tomtebogatan 5 | 113 39 STOCKHOLM | +46 8 52 20 50 00 | <a href="mailto:hello@castlebravo.se">hello@castlebravo.se</a>
       </footer>

      <style jsx>{`
        div.root {
          display: flex;
          color: white;
          flex-direction: column;
          max-width:800px;
          margin: 0 auto;
          padding:1em;
        }
        ul {
          list-style: none;
          margin:0;
          padding:0;
          font-family: Avenir Next LT W01 Bold;
        }
        li:not(:last-child) {
          margin-bottom: 1em;
        }
        section {
          //width: 100%;
          margin-bottom: 2em;
        }

        section > .cols {
          position:relative;
          width: 100%;
          display: flex;

        }

        section > .cols > p {
          width:50%;
          padding-left: 1em;
          margin: 0;
        }

        section > .cols > p:first-child {
          padding-right: 1em;
          padding-left: 0;
        }

        section#work > p {
         font-family: Avenir Next LT W01 Bold;
        }

        section#work > .cases {

          font-size: 1.5em;
          line-height: 1.2em;
          word-break:break-all;

        }

        section#work a[href^="/"] {
          color: yellow;
          text-decoration:underline;
          font-family:Baskerville W01 Italic;
        }

        section#work a[href^="http"] {
          color: #cd7081;
        }

        section#work a:hover {
          color: #666;
        }

        footer {
          font-size: 0.6em;
          text-align: center;
          margin-top: 4em;
          margin-bottom: 0.5em;
          color: white;
        }

        footer .logo img {
          width: 6em;
        }

        @media (max-width: 720px) {
          section > .cols {
            flex-direction: column;
          }

          section > .cols > p {
            width:100%;
            padding-left: 0em;
            padding-right: 0em;
          }

          section > .cols > p:last-child {
            margin-top: 1em;
          }
        }
      `}</style>

    </div>
  </HeadSlide>
)
