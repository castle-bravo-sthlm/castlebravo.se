import Head from 'next/head';
import React from 'react';
import Link from 'next/prefetch'

import HeadSlide from '../components/headslide';

import Ldb from './case/ldb';
import AtlasProducts from './case/atlas_copco_products';
import ConcreteAccuracy from './case/concrete_accuracy';
import Crosby from './case/crosby';
import IdeasMoveMountains from './case/ideas_move_mountains';
import MineQuest from './case/minequest';


// videos are 768*512

export default ({url}) => {
  const cases = [Ldb, AtlasProducts, ConcreteAccuracy, MineQuest, Crosby, IdeasMoveMountains];

  function showCase(e, id){
    e.preventDefault();
    url.push('/?case='+id);
  }

  function getCaseComponent(){
    if(url.query.case){
      if(parseInt(url.query.case) >= cases.length)
        return (<div>NO CASE! (╯°□°）╯︵ ┻━┻</div>)

      return React.createElement(cases[parseInt(url.query.case)], { url })
    }else {
      return null
    }
  }

  return (
    <HeadSlide width={60} minWidth={550} case={getCaseComponent()}>
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
              Prototyping your idea or by making a finalized product as part of your offer.
            </p>
          </div>
        </section>

        <section id="work">
          <p className="cases">
            WITH TBWA STOCKHOLM WE DID <a href="#" onClick={e => {showCase(e, 0)}}>A BROWSER POSTCARD EDITOR</a> AND
            FOR ATLAS COPCO WE MADE <a href="#" onClick={e => {showCase(e, 1)}}>MULTIPLE PRODUCT PAGES</a>.
            TOGETHER WITH GRAVIZ WE CREATED A <a href="#" onClick={e => {showCase(e, 2)}}>DUAL SCREEN GAME</a>
            &nbsp;AND WE MADE THIS <a href="#" onClick={e => {showCase(e, 3)}}>QUIZ</a> TO UNITE ATLAS COPCO.
            WE HELPED CROSBY STHLM SHARE THEIR WORK WITH A <a href="#" onClick={e => {showCase(e, 4)}}>NEW SITE</a>
            &nbsp;AND WE PRESENTED <a href="#" onClick={e => {showCase(e, 5)}}>SIX STORIES</a> FOR ATLAS COPCO’S IDEAS MOVE MOUNTAINS
          </p>

          <p>
            And we enjoy our friends at and being part of Mason Bower Group.
            Number10, Graviz, Crosby, Mason Bower, deBroome, Omnilux
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
            + 46 (0) 8 522 050 40<br />
            johan.lovblad@castlebravo.se<br /><br />

            General questions:<br />
            hello@castlebravo.se
            <br /><br />

            Visit us at:<br />
            Tomtebogatan 5 SE-113 39 Stockholm<br />

          </p>
        </section>

        <style jsx>{`
          div.root {
            display: flex;
            color: white;
            flex-direction: column;
            max-width:800px;
            margin: 0 auto;
            padding:1em;
          }
          section {
            //width: 100%;
            margin-bottom: 2em;
            font-family: Baskerville W01 Regular_705699;
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

          section#work > .cases a {
            color: yellow;
            font-family:Baskerville W01 Italic;
          }

          section#work > .cases a:hover {
            color: #666;
            font-family:Baskerville W01 Italic;
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
}
