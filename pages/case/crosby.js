import Head from 'next/head';
import { Video } from '../../components/video';
import Case from '../../components/case';
import Footer from '../../components/footer';
import Share from '../../components/share';

export default ({url}) => (
  <Case>
    <Head>
      <title>Castle Bravo - Crosby Stockholm</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <section id="video">
      <div>
        <Video src="/static/LdB.mp4" className="player"/>
      </div>
    </section>

    <section>
      <h2>crosby.se</h2>
        <p>
        Relying heavily on images and videos to present case studies Crosby Stockholm
        wanted a way to convey the information in an accessible way but still have it visually attractive.<br/><br/>

        Using a custom grid to layout images and videos, we made it possible to
        create exactly the layout the creatives wanted. Being able to have complex
        nested layouts made it possible to push the importance of a specific asset or to
        combine assets to tell a story.
        </p>
    </section>

    <section>
      <p>
        Client: <a href="https://crosby.se/" target="_blank">Crosby Stockholm</a> <br />
        Design: <a href="http://themakers.se/" target="_blank">The Makers</a>
      </p>
    </section>

    <Share pathname={url.pathname} title="crosby.se"/>

  </Case>
)
