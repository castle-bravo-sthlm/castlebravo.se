import Head from 'next/head';
import React from 'react';

import { Video } from '../components/video';

export default () => (
  <div>
    <Head>
      <title>Castle Bravo</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Test />
  </div>
)

class Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      src: 'static/logo.jpeg'
    }
  }
  render() {
    const media = ['logo.jpeg','ConcreteAccuracy.mp4','Crosby.mp4','LdB.mp4','MineQuest.mp4'];
    return (
      <div>
        <ul>
          { media.map(src => <li key={src} onClick={e => this.setState({src:'/static/'+src})} >{src}</li>) }
        </ul>
        <Video ref="video" src={this.state.src} />
      </div>
    )
  }
}
