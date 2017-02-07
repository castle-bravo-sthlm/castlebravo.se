import Head from 'next/head';
import { Video } from '../../components/video';

import Footer from '../../components/footer';
import Share from '../../components/share';

export default ({url}) => (
  <div className="case">
    <Head>
      <title>Castle Bravo - Ideas Move Mountains</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <section id="video">
      <div>
        <Video width="768" height="512" src="/static/imm.mp4" className="player"/>
      </div>
    </section>

    <section>
      <h2>Ideas Move Mountains</h2>
      <div className="cols">
        <p>
          We got the task to develop a site to show the new concept “Ideas Move Mountains”
          made by Graviz. Our take on this was to present six stories to show the
          Atlas Copco way of working using SVG that animated on scroll.
        </p>
        <p>
          One of the challenges was to keep a modern touch to it, but with the restriction
          that it had to be viewable by Atlas Copco employees on Atlas Copco’s IT infrastructure
          (IE9 support was a must have) as it was to be released internally.
        </p>
      </div>
    </section>

    <section>
      <p>
        Client: <a href="http://atlascopco.se/" target="_blank">Atlas Copco</a> <br />
        Agency: <a href="http://www.graviz.se/" target="_blank">Graviz</a><br />
        Creative: Kalle Berglind
      </p>
    </section>

    <Share pathname={url.pathname} title="Ideas Move Mountains"/>

  </div>
)
