import React from 'react';

function lerp(start, end, ratio) {
  return start + ratio*(end-start);
}

function debounceRaf(fn) {
  let rafId = 0;
  return function() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(fn);
  }
}

export default class HeadSlide extends React.Component {

  get EXTRA_HEIGHT() {
    return Math.max(0, window.innerWidth - 600);
  }

  static propTypes = {
    width: React.PropTypes.number,
    sideWidth: React.PropTypes.number,
    head: React.PropTypes.element.isRequired
  }
  static defaultProps = {
    width: 60,
    sideWidth: 20
  }

  get width() {
    return lerp(90, 60, (window.innerWidth-300)/1080);
  }

  get sideWidth() {
    return lerp(10, 30, (window.innerWidth-300)/1080);;
  }

  updateSize = debounceRaf(() => {
    console.log('updateSize')
    const { wrapper, head, content } = this.refs;
    content.style.paddingTop = head.offsetHeight + 'px';
    wrapper.style.height = content.offsetHeight + this.EXTRA_HEIGHT + 'px';
    this.updateScroll();
  })
  updateScroll = debounceRaf(() => {
    const offset = Math.max(0, document.body.scrollTop - this.EXTRA_HEIGHT);
    const tweenRatio = this.EXTRA_HEIGHT ? Math.min(1, document.body.scrollTop/this.EXTRA_HEIGHT) : 0;
    const { width, sideWidth } = this;
    const endSpacing = (100 - width - sideWidth)/3;
    //console.log(width, sideWidth, endSpacing, width+sideWidth+3*endSpacing)

    this.refs.head.style.marginLeft = lerp((100-width)/2, width+2*endSpacing, tweenRatio)+'vw';
    this.refs.head.style.width = lerp(width, sideWidth, tweenRatio)+'vw';
    this.refs.content.style.marginLeft = lerp((100-width)/2, endSpacing, tweenRatio)+'vw';
    this.refs.content.style.width = width+'vw';
    this.refs.content.style.top = -offset+'px';
  })

  render() {
    const { width, head, children } = this.props;
    const margin = (100 - width)/2;
    return (
      <div ref="wrapper" style={{position:'relative', overflow: 'hidden' }}>
        <div ref="head" style={{position:'fixed', width:width+'vw', marginLeft: margin+'vw', zIndex:1 }}>{head}</div>
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
