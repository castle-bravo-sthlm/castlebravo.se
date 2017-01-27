import Head from 'next/head';
import { Video } from '../../components/video';
import Case from '../../components/case';
import Footer from '../../components/footer';
import Share from '../../components/share';

export default ({url}) => (
  <Case>
    <Head>
      <title>Castle Bravo - Greetings from paradise</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <section id="video">
      <div>
        <Video src="/static/LdB.mp4" className="player"/>
      </div>
    </section>

    <section>
      <h2>Greetings from paradise</h2>
      <div className="cols">
        <p>
          An interactive campaign site for desktop and mobile created for LdB and Cederroth
          where participants could design a postcard from their fantasy tropical island, invite
          friends to vote for it and in the end (maybe) win a trip or some other nice prize.
        </p>
        <p>
          The challenge was to get a realistic look and feel with minimal loading time
          and to do that we used WebGL Canvas and advanced shader techniques to ray trace
          the sand and place objects on the beach realtime. <br /><br />
        </p>
      </div>
    </section>

    <section>
      <p>
        Client: <a href="http://ldb.se/" target="_blank">LdB</a> <br />
        Agency: <a href="http://www.tbwa.se/" target="_blank">TBWA</a><br />
        Creative: Carl Dalin
      </p>
    </section>

    <Share pathname={url.pathname} title="Greetings from paradise"/>
  </Case>
)
