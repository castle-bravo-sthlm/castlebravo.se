import Head from 'next/head';
import { Video } from '../../components/video';
import Case from '../../components/case';
import Footer from '../../components/footer';
import Share from '../../components/share';
import {Component} from 'react';

export default class AtlasCopcoProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: '/static/boomers2.mp4'
    };
  }
  productClick(e) {
    e.preventDefault();
    if(e.target.pathname)
      this.setState({video: e.target.pathname})

  }
  render() {
    return (
      <Case>
        <Head>
          <title>Castle Bravo - MineQuest</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <section>
          <h2>Atlas Copco Products</h2>
            <p>
              Together with Graviz we made a group of sites for Atlas Copco’s range
              of mining machinery.
            </p>
            <p>
              <a onClick={(e) => {this.productClick(e)}} href="/static/batteryscooptram.mp4">Scooptram ST7</a><br/>
              <a onClick={(e) => {this.productClick(e)}} href="/static/boomers2.mp4">Boomer S2</a><br/>
              <a onClick={(e) => {this.productClick(e)}} href="/static/meycome5.mp4">Meyco ME5</a><br/>
              <a onClick={(e) => {this.productClick(e)}} href="/static/simba.mp4">Simba S7</a><br/>
              <a onClick={(e) => {this.productClick(e)}} href="/static/poweredbyautomation.mp4">Powered by Automation</a>
            </p>
            <p>
              The goal was to make it easy for the interested to get
              in contact with the mining division and to educate the target group in
              a more accessible manner than the traditional pdf (though a pdf was also
              available for the more conservative via a download form).
            </p>
            <p>
              We created a stringent devops strategy to make sure development and
              deployment was as efficient and easy as possible and combined with a
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

        <Share pathname={this.props.url.pathname} title="MineQuest"/>

      </Case>
    )
  }
}
