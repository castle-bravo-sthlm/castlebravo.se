import React from 'react';
import Video from './video';

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

  static propTypes = {
    width: React.PropTypes.number,
    minWidth: React.PropTypes.number,
    case: React.PropTypes.element
  }
  static defaultProps = {
    width: 60,
    minWidth: 550
  }

  get _extraHeight() {
    const { wrapper } = this.refs;
    return wrapper.offsetWidth > this.props.minWidth ? window.innerHeight/2 : 0;
  }

  updateSize = debounceRaf(() => {
    const { wrapper, head, content } = this.refs;
    content.style.paddingTop = head.offsetHeight + 'px';
    wrapper.style.height = content.offsetHeight + this._extraHeight + 'px';
    this.updateScroll();
  })
  updateScroll = debounceRaf(() => {
    const offset = Math.max(0, document.body.scrollTop - this._extraHeight);
    const tweenRatio = this._extraHeight ? Math.min(1, document.body.scrollTop/this._extraHeight) : 0;
    const { width, sideWidth } = this.props;
    //console.log(width, sideWidth, endSpacing, width+sideWidth+3*endSpacing)

    this.refs.head.style.marginLeft = lerp(0, width, tweenRatio)+'%';
    this.refs.head.style.width = lerp(100, 100-width, tweenRatio)+'%';
    //this.refs.content.style.marginLeft = lerp((100-width)/2, endSpacing, tweenRatio)+'%';
    this.refs.content.style.width = lerp(100, width, tweenRatio)+'%';
    this.refs.content.style.top = -offset+'px';
  })

  render() {
    const { width, head, children } = this.props;
    const margin = (100 - width)/2;
    return (
      <div ref="wrapper" style={{position:'relative', overflow: 'hidden' }}>
        <div ref="head" style={{position:'fixed', zIndex:1, transition:'left 1s' }}>
          <section style={{position:'relative', width: 'calc(40vw - 2em)', minWidth:'calc(0.4 * 550px)', maxWidth:'600px', margin:'2em auto 0 auto' }}>
              <div style={{position:'relative', paddingTop:100/1.5+'%', backgroundColor:'#162931' }}>
                <Video style={{position:'absolute', top:'-15px', left:'-15px', width:'100%',height:'100%'}} width="768" height="512"/>
              </div>
          </section>
        </div>
        <div ref="content" style={{position:'fixed', transition:'left 1s' }}>{children}</div>
        <div ref="case" style={{position:'fixed', left:(this.props.case ? 0 : 100)+'vw', transition:'left 1s', color:'white' }}>{this.props.case}</div>
      </div>
    )
  }

  componentDidMount() {
    this.updateSize();
    //this.updateScroll();
    window.addEventListener('resize', this.updateSize);
    window.addEventListener('scroll', this.updateSize);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
    window.removeEventListener('scroll', this.updateSize);
  }
}
