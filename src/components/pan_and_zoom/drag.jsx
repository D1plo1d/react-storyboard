import React from 'react'
import ReactDOM from 'react-dom'

export default class Drag extends React.Component {

  static defaultProps = {
    touch: true,
    scale: 1,
    data: {
      isDragging: false,
      isMoving: false,
      dragStartX: 0,
      dragStartY: 0,
      x: 0,
      y: 0,
      deltaX: 0,
      deltaY: 0,
    },
  }

  componentDidMount() {
    this._toggleListeners("on", document, this._globalMouseEvents())
    this._toggleListeners("on", this._domNode(), this._localMouseEvents())
  }

  componentWillUnmount() {
    this._toggleListeners("off", document, this._globalMouseEvents())
    this._toggleListeners("off", this._domNode(), this._localMouseEvents())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.isDragging !== this.props.data.isDragging) {
      let onOrOff = nextProps.data.isDragging ? "on" : "off"
      this._toggleListeners(onOrOff, document, this._mouseMoveEvents())
    }
  }


  _domNode() {
    return ReactDOM.findDOMNode(this)
  }

  _localMouseEvents() {
    let events = {mousedown: this._onMouseDown}
    if (this.props.touch) events.touchstart = this._onMouseDown
    return events
  }

  _globalMouseEvents() {
    let events = {mouseup: this._onMouseUp}
    if (this.props.touch) events.touchend = this._onMouseUp
    return events
  }

  _mouseMoveEvents() {
    let events = {mousemove: this._onMouseMove}
    if (this.props.touch) events.touchmove = this._onMouseMove
    return events
  }

  _toggleListeners(onOrOff, domElement, events) {
    let add = onOrOff === "on"
    let fnName = add ? "addEventListener" : "removeEventListener"
    for(let k in events) domElement[fnName](k, events[k])
  }

  _onChange(nextProps) {
    this.props.onChange(Object.assign({}, this.props.data, nextProps))
  }

  _startDrag(x, y) {
    let scale = this.context.scale
    this._onChange({
      isDragging: true,
      isMoving: false,
      x: x * scale,
      y: y * scale,
      unscaledX: x,
      unscaledY: y,
      deltaX: 0,
      deltaY: 0,
    })
  }

  _onMouseDown = (e) => {
    // only left mouse button
    if(this.props.touch || e.button === 0) {
      var pt = (e.changedTouches && e.changedTouches[0]) || e

      this._startDrag(pt.clientX, pt.clientY)

      e.stopImmediatePropagation()
    }
  }

  _onMouseUp = (e) => {
    if(this.props.data.isDragging || this.props.simulatedMouseDown) {
      this._onChange({
        simulatedMouseDown: false,
        isDragging: false,
        isMoving: false,
      })

      if (e != null) e.stopImmediatePropagation()
    }
  }

  _onMouseMove = (e) => {
    if(this.props.data.isDragging || this.props.simulatedMouseDown) {
      var pt = (e.changedTouches && e.changedTouches[0]) || e
      let scale = this.props.scale
      let previousData = this.props.data
      if (this.props.simulatedMouseDown && !this.props.data.isDragging) {
        this._onMouseDown(e)
      }
      else {
        let x = pt.clientX
        let y = pt.clientY
        this._onChange({
          isMoving: true,
          deltaX: (x - previousData.unscaledX) / scale + previousData.deltaX,
          deltaY: (y - previousData.unscaledY) / scale + previousData.deltaY,
          x: x / scale,
          y: y / scale,
          unscaledX: x,
          unscaledY: y,
        })
      }

      e.stopImmediatePropagation()
    }
  }

  render() {
    return React.Children.only(this.props.children)
  }

}
