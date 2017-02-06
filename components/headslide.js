import React from 'react';
import createTweenr from 'tweenr';

const tweenr = createTweenr();

function lerp(start, end, ratio) {
  return start + ratio*(end-start);
}

function debounceRaf(fn) {
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
  _rightOffset = 0

  state = { right: this.props.right }

  constructor(props) {
    super(props);
  }

  get _extraHeight() {
    const { spacer } = this.refs;
    return spacer.offsetWidth > this.props.minWidth ? window.innerHeight/2 : 0;
  }

  get scrollTop() {
    return Math.max(0, document.body.scrollTop - this._extraHeight);
  }

  layout = () => {
    const { spacer, head, wrapper, left, right } = this.refs;
    left.style.paddingTop = head.offsetHeight + 'px';
    spacer.style.height = left.offsetHeight + this._extraHeight + 'px';

    const tweenRatio = this._extraHeight ? Math.min(1, document.body.scrollTop/this._extraHeight) : 0;

    const width = lerp(100, this.props.width, tweenRatio);
    const sideWidth = lerp(100, 100 - this.props.width, tweenRatio);

    head.style.left = (1.0 - this._panRatio)*lerp(0,width, tweenRatio) + '%';
    head.style.right = this._panRatio*lerp(0,width, tweenRatio) + '%';
    left.style.width = right.style.width = width + '%'
    wrapper.style.transform = `translate(${-width/100*this._panRatio*wrapper.offsetWidth}px, ${-this.scrollTop}px)`;

    this.refs.spacer.style.visibility = 'visible';
  }

  debounceLayout = debounceRaf(this.layout)

  render() {
    const { width, head, children, right } = this.props;
    const margin = (100 - width)/2;
    return (
      <div ref="spacer" style={{position:'relative', overflow: 'hidden', visibility:'hidden' }}>
        <div ref="head" style={{position:'fixed', overflow:'hidden', background:'red', zIndex:1 }}>{head}</div>
        <div ref="wrapper" style={{position:'fixed', background:'none', backfaceVisibility:'hidden', willChange: 'transform', width:'100%', height:'100%'}}>

          <div ref="left" style={{position:'absolute', overflow:'hidden', background:'green' }}>{children}</div>
          <div ref="right" style={{position:'absolute', left: '100%', overflow:'hidden', background:'blue' }}>{this.state.right}</div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.debounceLayout();
    //this.updateScroll();
    window.addEventListener('resize', this.debounceLayout);
    window.addEventListener('scroll', this.debounceLayout);
  }

  componentWillReceiveProps(nextProps) {

    if(!this.props.right && nextProps.right) {
      //this._rightOffset = this.scrollTop;
      this.refs.right.style.top = this.scrollTop + 'px';
      //document.body.scrollTop = this._extraHeight;
      this.setState({right:nextProps.right});
      this._panTween.cancel();
      this._panTween = tweenr.to(this, { _panRatio: 1, duration: 1 - this._panRatio })
        .on('update', this.layout)
      //  .on('complete', this.debounceLayout )
    }
    else if(!nextProps.right && this.props.right) {
      this._panTween.cancel();
      this._panTween = tweenr.to(this, { _panRatio: 0, duration: this._panRatio })
        .on('update', this.layout)
        .on('complete', () => {
          //console.log('complete!')
        })
    }
  }

  componentDidUpdate(prevProps) {
    let p = this.debounceLayout();
    if(prevProps.right && !this.props.right) {
      p.then(() => {
        //console.log('reset scrollTop', this._leftTop)
        //document.body.scrollTop = this._leftTop;
      })
    }

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceLayout);
    window.removeEventListener('scroll', this.debounceLayout);
  }
}
