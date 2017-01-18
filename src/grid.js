
import {dom, Component, attr, cssCombine} from "./dom";
import { ReactiveVar, autorun, reactive, unreactive, nonreactive } from "./tracker";
import { calcScrollTop, tweenr, scrollTo, findAncestor, tween } from "./util";

const duration = 0.5;

class Cell extends Component {

  @attr
  depth = 0;
  @attr
  data

  _ratio = new ReactiveVar(0);
  _weight = new ReactiveVar(0);
  _anim = tweenr.to()


  constructor({ratio = 0, weight = 1, ...rest}) {
    super({ratio,weight, ...rest})
    this._ratio.set(ratio);
    this._weight.set(weight);
  }


  @attr({onchange(value) { this.node.style.width = value*100+'%'; this.node.style.fontSize = value*this.height+'em'; }})
  width = 0;

  @attr({onchange(value) { this.node.style.height = value*100+'%'; this.node.style.fontSize = value*this.width+'em'; }})
  height = 0;

  get ratio() {
    return this._ratio.get();
  }

  set ratio(value) {
    this._ratio.set(value);
  }

  get weight() {
    return this._weight.get();
  }

  set weight(value) {
    this._weight.set(value);
  }

  get grid() {
    let el = this.node;
    while(el) {
      if(el.__comp__ instanceof Grid)
        return el.__comp__;
      el = el.parentNode;
    }
  }

  get children() {
    return Array.from(this.node.children, n => n.__comp__);
  }

  show() {
    return new Promise(res => {
      this._anim.cancel();
      this._anim = tweenr.to(this, {weight:1, duration}).on('complete', res).on('cancelling', res);
    })
  }

  hide() {
    return new Promise(res => {
      this._anim.cancel();
      this._anim = tweenr.to(this, {weight:0, duration}).on('complete', res).on('cancelling', res);
    })
  }

  calcRatio() {
    return this.ratio;
  }

  onrendered() {
    autorun(_ => {
      this.node.style.opacity = this.weight;
    })
  }
}

class Seq extends Cell {

  @attr
  leafType = LeafCell

  _layoutComp = null;

  onrendered() {
    super.onrendered();
    this._layoutComp = autorun(_ => {
      this.layout();
    })
    this.insertCells(0, ...this.data);
    this.node.addEventListener('inflate', e => {
      if(this.depth > 0) {
        const anims = e._animations || [];
        for(const child of Array.from(this.node.children)) {
          if(!child.contains(e.target))
            anims.push(child.__comp__.hide());
        }
      }
    }, true)
    this.node.addEventListener('deflate', e => {
      if(this.depth > 0) {
        const anims = e._animations || [];
        for(const child of Array.from(this.node.children)) {
          if(!child.contains(e.target))
            anims.push(child.__comp__.show());
        }
      }
    }, true)
  }

  insertCells(index, ...items) {
    const cells = items.map(item => item instanceof Cell ? item : this.createChild(item));
    let refNode = this.node.children[index] || null;
    for(const cell of cells) {
      cell.width = 0;
      cell.height = 0;
      this.node.insertBefore(cell.node, refNode)
    }
    this._layoutComp.invalidate();
  }

  render() {
    return <div style="display:inline-block;line-height:0;vertical-align:top" depth={this.depth} />
  }
}

class Col extends Seq {

  createChild(data) {
    const props = { data, depth: this.depth+1 };
    return Array.isArray(data) ? new Row({ leafType: this.leafType, ...props}) : new this.leafType(props);
  }

  layout() {
    let height = 0;

    for(const cell of this.children) {
      if(cell.ratio != 0)
        height += cell.weight*(1/cell.ratio);
    }
    this._ratio.set(1/height);
    for(const cell of this.children) {
      cell.width = 1;
      cell.height = cell.weight/cell.ratio/height;
    }
  }

  calcRatio() {
    return 1/this.children.map(c => 1/c.calcRatio()).reduce((a,b) => a+b);
  }
}

class Row extends Seq {

  createChild(data) {
    const props = { data, depth: this.depth+1 };
    return Array.isArray(data) ? new Col({ leafType: this.leafType, ...props}) : new this.leafType(props);
  }

  layout() {
    let width = 0;
    for(const cell of this.children) {
      if(Number.isFinite(cell.ratio))
        width += cell.weight*cell.ratio;
    }
    this._ratio.set(width);
    for(const cell of this.children) {
      cell.width = cell.weight*cell.ratio/width;
      cell.height = 1;
    }
  }

  calcRatio() {
    return this.children.map(c => c.calcRatio()).reduce((a,b) => a+b);
  }

}

export class LeafCell extends Cell {

  @reactive
  animating = false

  @reactive
  _focused = false;

  @reactive
  mouseOver = false;

  constructor({weight = 0, ...props}) {
    super({weight, ...props});
  }

  _onmousedown(e) {
    if(e.target == this.node) {
      e.preventDefault();
      this.toggleFocus();
    }
  }

  get focused() {
    return this._focused;
  }

  set focused(value) {
    if(value)
      this.inflate();
    else
      this.deflate();
  }

  toggleFocus() {
    nonreactive(() => {
      this.focused = !this.focused;
    })
  }

  @unreactive
  inflate() {
    if(this._focused)
      return;
    this._focused = true;
    this._inflateRatio = Math.max(window.innerWidth/window.innerHeight, this.ratio);
    this._deflateRatio = this.ratio;

    const animations = [this::tween({ratio: this._inflateRatio, duration})];

    const e = new CustomEvent('inflate', { bubbles: true });
    e._animations = animations;
    this.node.dispatchEvent(e);

    this.node.style.backgroundSize = 'contain';
    this.animating = true;
    return Promise.all(e._animations).then(_=>{
      this.animating = false;
      return this;
    })
  }

  @unreactive
  deflate() {
    if(!this._focused)
      return;
    this._focused = false;

    const animations = [this::tween({ratio:this._deflateRatio, duration})];
    const e = new CustomEvent('deflate', { bubbles: true });
    e._animations = animations;

    this.node.dispatchEvent(e);

    this.animating = true;
    return Promise.all(e._animations).then(_=>{
      this.animating = false;
      return this;
    })
  }

  render(props) {
    return (
      <div class="leafcell"
        onclick={e => this.toggleFocus() }
        onmouseenter={e => this.mouseOver = true }
        onmouseleave={e => this.mouseOver = false }
        depth={this.depth}
        style={`position:relative;display:inline-block;line-height:normal;vertical-align:top;border:0 solid transparent;cursor:pointer`}
        >
      <a title="Download original" id="source" onclick={(e)=>{e.stopPropagation()}} href={`images/${this.data}`} target="_blank" download={this.data}></a>
      { this.renderContent(props) }
      </div>
    )
  }

  renderContent({content}) {
    return content;
  }

  onrendered() {
    super.onrendered();
    autorun(_ => {
      this.node.classList.toggle('focused', this.focused)
    })
    autorun(_ => {
      this.node.classList.toggle('animating', this.animating);
    })
    autorun(_ => {
      this.node.style.borderWidth = 0.15*this.weight + 'rem';
    })
  }
}

export class Grid extends Component {

  @attr
  data = []

  @attr
  leafType = LeafCell

  get leafcells() {
    return Array.from(this.refs.root.node.querySelectorAll('.leafcell'));
  }

  focusNext() {
    return this.moveFocus(1);
  }

  focusPrev() {
    return this.moveFocus(-1);
  }

  moveFocus(step = 0) {
    const cells = this.leafcells;
    let i = cells.findIndex(cell => cell.__comp__.focused);
    if(~i)
      cells[i].__comp__.focused = false;
    if(step != 0) {
      i += step;
      if(i >= 0 && i < cells.length)
        return cells[i].__comp__.focused = true;
    }
    return false;
  }

  render({style}) {
    return (
      <div ref="grid" style="position:relative; font-size:1rem; overflow:hidden">
        <div ref="spacer" />
        <div style="position:absolute;top:-0.15rem;right:-0.15rem;bottom:-0.15rem;left:-0.15rem">
          <Col ref="root" data={this.data} leafType={this.leafType} />
        </div>
      </div>
    )
  }

  onrendered() {
    Object.assign(this.refs.root.node.style, { width:'100%', height:'100%' })

    // dont let inital loading of images affect scroll-position
    let userInitiated = false;
    // LOL, scrollTop is rounded to integer, so when working with small increments we flip the rounding direction to not build up error
    let flip = 1;
    autorun(_ => {
      const height = this.refs.grid.offsetHeight;
      this.refs.spacer.style.paddingTop = 100/this.refs.root.ratio+'%';

      if(userInitiated) {
        let diff = this.refs.grid.offsetHeight - height;
        if(diff % 2) {
          diff += flip;
          flip = -flip;
        }
        document.scrollingElement.scrollTop += diff/2;
      }
      //console.log(sum);
    })

    let _focused = null;
    this.refs.root.node.addEventListener('deflate', e => {
      userInitiated = true;
      _focused = null;
    }, true)
    this.refs.root.node.addEventListener('inflate', e => {
      userInitiated = true;
      const cellEl = e.target;
      if(_focused)
        _focused.focused = false;
      _focused = cellEl.__comp__;

      e.done = new Promise(res => {

        tweenr.to({ alpha:0 }, { alpha:1, duration })
        .on('update', ({target}) => {
          const {top, bottom} = cellEl::findAncestor('[depth="1"]').getBoundingClientRect();
          const off = (top+bottom-window.innerHeight)/2;
          let step = Math.round(off*target.alpha);
          document.scrollingElement.scrollTop += step;
        })
        .on('complete', res);
      })

    }, true)
  }
}
