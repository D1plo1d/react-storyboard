import React from 'react'
import ReactDOM from 'react-dom'

export default class Drag extends React.Component {
  displayName = "Drag"

  static propTypes = {
    touch: React.PropTypes.bool.isRequired,
    scale: React.PropTypes.number.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    touch: true,
    scale: 1,
    onDrop: () => {},
  }

  state = {
    simulatedMouseDown: false,
    isDragging: false,
    isMoving: false,
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
  }

  componentDidMount() {
    this._toggleListeners("on", this._domNode(), this._localMouseEvents())
  }

  componentWillUnmount() {
    this._toggleListeners("off", this._domNode(), this._localMouseEvents())
    this._toggleListeners("off", document, this._globalMouseEvents())
  }

  componentWillUpdate(_, nextState) {
    if (nextState.isDragging !== this.state.isDragging) {
      let shouldListen = nextState.isDragging || nextState.simulateMouseDown
      let onOrOff = shouldListen ? "on" : "off"
      this._toggleListeners(onOrOff, document, this._globalMouseEvents())
    }
  }

  simulateMouseDown = () => {
    this.setState({simulatedMouseDown: true}, () => {
      this._toggleListeners("on", document, this._globalMouseEvents())
    })
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
    let events = {
      mousedown: this._stopImmediatePropagation,
      mouseup: this._onMouseUp,
      mousemove: this._onMouseMove,
    }
    let touchEvents = {
      touchstart: this._stopImmediatePropagation,
      touchend: this._onMouseUp,
      touchmove: this._onMouseMove,
    }
    if (this.props.touch) events = Object.assign(events, touchEvents)
    return events
  }

  _toggleListeners(onOrOff, domElement, events) {
    let add = onOrOff === "on"
    let fnName = add ? "addEventListener" : "removeEventListener"
    for(let k in events) domElement[fnName](k, events[k])
  }

  _onChange(nextState) {
    this.setState(nextState, () => this.props.onChange(this.state))
  }

  _startDrag(e) {
    let pt = (e.changedTouches && e.changedTouches[0]) || e
    let {x, y} = {x: pt.clientX, y: pt.clientY}
    this._onChange({
      isDragging: true,
      isMoving: false,
      x: this.props.x,
      y: this.props.y,
      unscaledX: x,
      unscaledY: y,
      deltaX: 0,
      deltaY: 0,
    })
  }

  _stopImmediatePropagation(e) {
    e.stopImmediatePropagation()
  }

  _onMouseDown = (e) => {
    if (this.state.isDragging || this.state.simulatedMouseDown) {
      e.stopImmediatePropagation()
      return
    }
    // only left mouse button
    if(!this.props.touch || e.button === 0) {
      this._startDrag(e)
      e.stopImmediatePropagation()
    }
  }

  _onMouseUp = (e) => {
    if(!this.state.isDragging) return
    let stateChanges = {
      simulatedMouseDown: false,
      isDragging: false,
      isMoving: false,
    }
    let nextState = Object.assign({}, this.state, stateChanges)
    let allowed = true
    let preventDrop = () => allowed = false
    try {
      this.props.onDrop(nextState, {preventDrop})
    }
    finally {
      if (!allowed) return
      this._onChange(stateChanges)
      if (e != null) e.stopImmediatePropagation()
    }
  }

  _onMouseMove = (e) => {
    e.stopImmediatePropagation()
    if (!this.state.isDragging) {
      if (this.state.simulatedMouseDown) {
        this._startDrag(e)
      }
      return
    }
    let pt = (e.changedTouches && e.changedTouches[0]) || e
    let scale = this.props.scale
    let previousState = this.state
    let x = pt.clientX
    let y = pt.clientY
    let scaledMovement = {
      x: (x - previousState.unscaledX) / scale,
      y: (y - previousState.unscaledY) / scale,
    }
    this._onChange({
      isMoving: true,
      deltaX: scaledMovement.x + previousState.deltaX,
      deltaY: scaledMovement.y + previousState.deltaY,
      x: scaledMovement.x + previousState.x,
      y: scaledMovement.y + previousState.y,
      unscaledX: x,
      unscaledY: y,
    })
  }

  render() {
    return React.Children.only(this.props.children)
  }

}
