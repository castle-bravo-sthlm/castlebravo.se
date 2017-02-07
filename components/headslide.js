import React from 'react';
import createTweenr from 'tweenr';

const isServer = typeof window == 'undefined';
const tweenr = createTweenr();

function lerp(start, end, ratio) {
  return start + clamp(ratio)*(end-start);
}

function clamp(value, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(value, hi));
}

function debounceRaf(fn) {
  if(isServer)
    return () => {};
  let rafId = 0;
  let [nextCall, resolveNextCall] = createPromise();
  return function() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(onFrame);
    return nextCall;
  }
  function onFrame() {
    resolveNextCall(fn());
    rafId = 0;
    [nextCall, resolveNextCall] = createPromise();
  }
}

function createPromise() {
  let promise, resolve, reject;
  promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  })
  return [promise, resolve, reject];
}

// let layoutsPerFrame = 0;
// function frame() {
//   if(layoutsPerFrame)
//     console.log(layoutsPerFrame);
//   layoutsPerFrame = 0;
//   requestAnimationFrame(frame);
// }
// if(!isServer)
//   frame();

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

  _panRatio = this.props.right ? 1 : 0
  _panTween = tweenr.to()
  _leftScroll = 0
  _rightScroll = 0

  state = { right: this.props.right }

  constructor(props) {
    super(props);
  }

  get _extraHeight() {
    const { spacer } = this.refs;
    return spacer.offsetWidth > this.props.minWidth ? window.innerHeight/2 : 0;
  }

  get leftScroll() {
    if(this._panRatio == 0) {
      this._leftScroll = Math.max(0, document.body.scrollTop - this._extraHeight);
    }
    return this._leftScroll;
  }

  get rightScroll() {
    if(this._panRatio == 1) {
      this._rightScroll = document.body.scrollTop;
    }
    return this._rightScroll;
  }

  layout = () => {
    //layoutsPerFrame++
    const { spacer, head, left, right } = this.refs;
    //left.style.paddingTop = head.offsetHeight + 'px';
    //spacer.style.height = left.offsetHeight + this._extraHeight + 'px';

    // const tweenRatio = lerp(this._extraHeight ? Math.min(1, document.body.scrollTop/this._extraHeight) : 0, 1, this._panRatio);
    //
    // const width = lerp(100, this.props.width, tweenRatio);
    //
    // head.style.transform = `translateY(${0.5*window.innerHeight*clamp(tweenRatio*2-1)}px) translateY(${-50*clamp(tweenRatio*2-1)}%)`;
    // head.style.left = (1.0 - this._panRatio)*lerp(0,width, 2*tweenRatio) + '%';
    // head.style.right = this._panRatio*lerp(0,width, tweenRatio) + '%';
    // left.style.width = right.style.width = width + '%'
    //wrapper.style.transform = `translate(${-width/100*this._panRatio*wrapper.offsetWidth}px, ${-this.scrollTop}px)`;

    // left.style.transform = right.style.transform = `translateX(${-width/100*this._panRatio*spacer.offsetWidth}px)`;
    // left.style.transform += ` translateY(${-this.leftScroll}px)`
    // right.style.transform += ` translateY(${-this.rightScroll}px)`
    //
    // let h = lerp(left.offsetHeight + this._extraHeight, right.offsetHeight, this._panRatio);
    // spacer.style.height = h +'px';
    // if(Math.abs(this._panRatio - 0.5) != 0.5) {
    //   document.body.scrollTop = (h - window.innerHeight)/2;
    //
    // }
    // if(this._panRatio == 0) {
    // }
    // else if(this._panRatio == 1) {
    // }
    // else {
    //   document.body.scrollTop = lerp(this.leftScroll, this.rightScroll, this._panRatio);
    // }

  }

  debounceLayout = this.layout

  render() {
    const { width, head, children, right } = this.props;
    const margin = (100 - width)/2;
    return (
      <div ref="spacer" style={{position:'relative', overflow: 'hidden', visibility:'hidden' }}>
        <div ref="head" style={{position:'fixed', overflow:'hidden', background:'none', zIndex:1 }}>{head}</div>
        <div ref="left" style={{position:'fixed', overflow:'hidden', background:'none' }}>{children}</div>
        <div ref="right" style={{position:'fixed', left: '100%', overflow:'hidden', background:'none' }}>{this.state.right}</div>
      </div>
    )
  }

  componentDidMount() {
    this.layout();
    this.refs.spacer.style.height = this.refs.left.offsetHeight + this._extraHeight + 'px';
    this.refs.spacer.style.visibility = 'visible';

    //this.updateScroll();
    window.addEventListener('resize', this.debounceLayout);
    window.addEventListener('scroll', this.debounceLayout);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.right)
      this.setState({right:nextProps.right});

  }

  componentDidUpdate(prevProps) {
    const nextProps = this.props;
    if(!prevProps.right && nextProps.right) {
      const { spacer, left, right} = this.refs;
      //right.style.top = this.scrollTop + Math.max(0, (window.innerHeight-right.offsetHeight)/2) + 'px';
      //right.style.top = this.scrollTop + 'px';
      //this._leftScrollTop = document.body.scrollTop;
      this._panTween.cancel();
      this._panTween = tweenr.to(this, { _panRatio: 1, duration: 1 - this._panRatio })
        .on('update', this.layout)
      //  .on('complete', this.debounceLayout )
    }
    else if(!nextProps.right && prevProps.right) {

      this._panTween.cancel();
      this._panTween = tweenr.to(this, { _panRatio: 0, duration: this._panRatio })
        .on('update', this.layout)
        .on('complete', () => {
          //console.log('complete!')
        })
    }
    this.layout();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceLayout);
    window.removeEventListener('scroll', this.debounceLayout);
  }
}
