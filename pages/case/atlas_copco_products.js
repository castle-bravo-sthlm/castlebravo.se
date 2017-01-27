import Head from 'next/head';
import { Video } from '../../components/video';
import Case from '../../components/case';
import Footer from '../../components/footer';
import Share from '../../components/share';

export default ({url}) => (
  <Case>
    <Head>
      <title>Castle Bravo - MineQuest</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <section id="video">
      <div>
        <Video src="/static/LdB.mp4" className="player"/>
      </div>
    </section>

    <section>
      <h2>Atlas Copco Products</h2>
        <p>
          Together with Graviz we made a group of sites for Atlas Copco’s range
          of mining machinery.
        </p>
        <p>
          <a href="">Scooptram ST7</a><br/>
          <a href="">Boomer S2</a><br/>
          <a href="">Meyco ME5</a><br/>
          <a href="">Simba S7</a><br/>
          <a href="">Powered by Automation</a>
        </p>
        <p>
          The goal was to for the interested to easily get
          in contact with the mining division and to educate the target group in
          a more accessible manner than the traditional pdf (though a pdf was also
          available for the more conservative via a download form).
        </p>
        <p>
          We created a stringent devops strategy to make sure development and
          deployment was as  efficient and easy as possible and combined with a
          modular approach to writing code made the creation and rollout of each
          new site a piece of cake.
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
    
  </Case>
)
