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

  static propTypes = {
    width: React.PropTypes.number,
    minWidth: React.PropTypes.number,
    head: React.PropTypes.element.isRequired
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
    const { wrapper, head, left, right } = this.refs;
    left.style.paddingTop = right.style.paddingTop = head.offsetHeight + 'px';
    wrapper.style.height = (this.props.right ? right : left).offsetHeight + this._extraHeight + 'px';
    this.updateScroll();
  })
  updateScroll = debounceRaf(() => {
    const offset = Math.max(0, document.body.scrollTop - this._extraHeight);
    const tweenRatio = this._extraHeight ? Math.min(1, document.body.scrollTop/this._extraHeight) : 0;
    //console.log(width, sideWidth, endSpacing, width+sideWidth+3*endSpacing)

    const { head, left, right} = this.refs;

    const width = lerp(100, this.props.width, tweenRatio);
    const sideWidth = lerp(100, 100-this.props.width, tweenRatio);

    head.style.width = sideWidth + '%';
    left.style.width = right.style.width = width + '%'

    console.log(this.props.right ? 'right' : 'left')
    if(this.props.right) {
      head.style.left = '0%';
      left.style.left = -width + '%';
      right.style.left = 100-width + '%';

      right.style.top = -offset+'px';
    } else {
      head.style.left = 100 - sideWidth + '%';

      left.style.left = '0%';
      right.style.left = '100%';

      left.style.top = -offset+'px';
    }
    this.refs.wrapper.style.visibility = 'visible';
  })

  render() {
    const { width, head, children, right } = this.props;
    const margin = (100 - width)/2;
    return (
      <div ref="wrapper" style={{position:'relative', overflow: 'hidden', visibility:'hidden' }}>
        <div ref="head" style={{position:'fixed', overflow:'hidden', transition:'left 1s', background:'red', zIndex:1 }}>{head}</div>
        <div ref="left" style={{position:'fixed', overflow:'hidden', transition:'left 1s', background:'green' }}>{children}</div>
        <div ref="right" style={{position:'fixed', overflow:'hidden', transition:'left 1s', background:'blue' }}>{right}</div>
      </div>
    )
  }

  componentDidMount() {
    this.updateSize();
    //this.updateScroll();
    window.addEventListener('resize', this.updateSize);
    window.addEventListener('scroll', this.updateSize);
  }

  componentDidUpdate() {
    this.updateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
    window.removeEventListener('scroll', this.updateSize);
  }
}
