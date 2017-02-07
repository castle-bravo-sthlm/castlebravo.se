import Head from 'next/head';
import { Video } from '../../components/video';

import Footer from '../../components/footer';
import Share from '../../components/share';

export default ({url}) => (
  <div className="case">
    <Head>
      <title>Castle Bravo - MineQuest</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <section id="video">
      <div>
        <Video width="768" height="512" src="/static/minequest.mp4" className="player"/>
      </div>
    </section>

    <section>
      <h2>MineQuest</h2>
        <p>
        To get an united feeling for Atlas Copco’s employees across over 90 countries
        we created a location based quiz with questions about mining and tunneling.<br/><br/>
        A cross platform experience created in Meteor JS using canvas and SVG animations.
        </p>
    </section>

    <section>
      <p>
        Client: <a href="http://atlascopco.se/" target="_blank">Atlas Copco</a> <br />
        Agency: <a href="http://www.graviz.se/" target="_blank">Graviz</a><br />
        Creative: Kalle Berglind<br />
        Design: <a href="http://themakers.se/" target="_blank">The Makers</a>
      </p>
    </section>

    <Share pathname={url.pathname} title="MineQuest"/>

  </div>
)
