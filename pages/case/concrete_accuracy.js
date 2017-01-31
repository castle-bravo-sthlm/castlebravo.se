import Head from 'next/head';
import { Video } from '../../components/video';
import Case from '../../components/case';
import Footer from '../../components/footer';
import Share from '../../components/share';

export default ({url}) => (
  <Case>
    <Head>
      <title>Castle Bravo - Concrete Accuracy</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <section id="video">
      <div>
        <Video width="768" height="512" src="/static/concreteaccuracy.mp4" className="player"/>
      </div>
    </section>

    <section>
      <h1>Concrete Accuracy</h1>
      <div className="cols">
        <p>
          To promote the Meyco ME5 at trade shows around the globe,
          Atlas Copco wanted something special. So together with Graviz we made this little game,
          complete with a stressful version of Edward Griegs “In the Hall of the Mountain King” and
          a prop looking like the nozzle of the Meyco ME5.
        </p>
        <p>
          The trade show version used a Nintendo Wii remote to move the crosshair and a
          version of the game was installed on a traveling computer. This setup later
          evolved into a dual screen web experience where a user's phone got act as the nozzle,
          so every internet wielding citizen (with a modern phone and browser) now has the possibility to play.
        </p>
      </div>
      <p>Written completely with what the browser has to offer including WebGL, WebAudio and some true javascript craftsmanship.</p>
    </section>

    <section>
      <p>
        Client: <a href="http://atlascopco.se/" target="_blank">Atlas Copco</a> <br />
        Agency: <a href="http://www.graviz.se/" target="_blank">Graviz</a><br />
        Creative: Oskar Skott & Ida Jagerfelt<br />
        Sound design: <a href="http://www.soundsbyjohan.com/" target="_blank">Sounds by Johan</a><br />
        3D: <a href="http://www.claraterne.com/" target="_blank">Clara Terne</a>
      </p>
    </section>

    <Share pathname={url.pathname} title="MineQuest"/>

  </Case>
)
