import React from 'react';

function lerp(start, end, ratio) {
  return start + ratio*(end-start);
}

export default class HeadSlide extends React.Component {

  EXTRA_HEIGHT = 500

  static propTypes = {
    width: React.PropTypes.number,
    sideWidth: React.PropTypes.number,
    head: React.PropTypes.element.isRequired
  }
  static defaultProps = {
    width: 60,
    sideWidth: 20
  }

  updateSize = () => {
    console.log('updateSize')
    const { wrapper, head, content } = this.refs;
    content.style.paddingTop = head.offsetHeight + 'px';
    wrapper.style.height = content.offsetHeight + this.EXTRA_HEIGHT + 'px';
    this.updateScroll();
  }
  updateScroll = () => {
    const offset = Math.max(0, document.body.scrollTop - this.EXTRA_HEIGHT);
    const tweenRatio = Math.min(1, document.body.scrollTop/this.EXTRA_HEIGHT);
    const { width, sideWidth } = this.props;
    const endSpacing = (100 - width - sideWidth)/3;

    this.refs.head.style.marginLeft = lerp((100-width)/2, width+2*endSpacing, tweenRatio)+'vw';
    this.refs.head.style.width = lerp(width, sideWidth, tweenRatio)+'vw';
    this.refs.content.style.marginLeft = lerp((100-width)/2, endSpacing, tweenRatio)+'vw';
    this.refs.content.style.top = -offset+'px';
  }

  render() {
    const { width, head, children } = this.props;
    const margin = (100 - width)/2;
    return (
      <div ref="wrapper" style={{position:'relative', overflow: 'hidden' }}>
        <div ref="head" style={{position:'fixed', width:width+'vw', marginLeft: margin+'vw' }}>{head}</div>
        <div ref="content" style={{position:'fixed', width:width+'vw', marginLeft: margin+'vw' }}>{children}</div>
      </div>
    )
  }

  componentDidMount() {
    this.updateSize();
    //this.updateScroll();
    window.addEventListener('resize', this.updateSize);
    window.addEventListener('scroll', this.updateScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
    window.removeEventListener('scroll', this.updateScroll);
  }
}
