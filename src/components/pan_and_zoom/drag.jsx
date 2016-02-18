import React from 'react'
import {Portal} from 'react-overlays'
import KeyboardListener from './keyboard_listener.jsx'

export default class Drag extends React.Component {
  displayName = "Drag"

  static propTypes = {
    touch: React.PropTypes.bool.isRequired,
    scale: React.PropTypes.number.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    onKeyUp: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onKeyPress: React.PropTypes.func,
    onWheel: React.PropTypes.func,
  }

  static defaultProps = {
    touch: true,
    scale: 1,
    onDrop: () => {},
    Container: "div",
  }

  state = {
    isMouseDown: false,
    simulatedMouseDown: false,
    isDragging: false,
    isMoving: false,
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isDragging && nextProps.scale !== this.props.scale) {
      this._moveOrScale({
        nextUnscaledX: this.state.unscaledX,
        nextUnscaledY: this.state.unscaledY,
        nextProps,
      })
    }
  }

  simulateMouseDown = () => {
    this.setState({isMouseDown: true, simulatedMouseDown: true})
  }

  cancelDrag() {
    this.setState({
      isMouseDown: false,
      simulatedMouseDown: false,
      isDragging: false,
      isMoving: false,
    })
  }

  _containerEventListeners() {
    let events = {
      onMouseDown: this._onMouseDown,
      onMouseUp: this._onMouseUp,
      onMouseMove: this._onMouseMove,
    }
    let touchEvents = {
      onTouchStart: this._onMouseDown,
      onTouchEnd: this._onMouseUp,
      onTouchMove: this._onMouseMove,
    }
    if (this.props.touch) events = Object.assign(events, touchEvents)
    return events
  }

  _overlayEventListeners() {
    let events = {
      onMouseDown: this._stopPropagation,
      onMouseUp: this._onMouseUp,
      onMouseMove: this._onMouseMove,
      onWheel: this.props.onWheel,
    }
    let touchEvents = {
      onTouchStart: this._stopPropagation,
      onTouchEnd: this._onMouseUp,
      onTouchMove: this._onMouseMove,
    }
    if (this.props.touch) events = Object.assign(events, touchEvents)
    return events
  }

  _onChange(nextState) {
    if (JSON.stringify(nextState) === JSON.stringify(this.state)) return
    this.setState(nextState, () => this.props.onChange(this.state))
  }

  _startDrag(e) {
    let pt = (e.changedTouches && e.changedTouches[0]) || e
    let {x, y} = {x: pt.clientX, y: pt.clientY}
    this._onChange({
      simulatedMouseDown: false,
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

  _stopPropagation(e) {
    e.stopPropagation()
  }

  _onMouseDown = (e) => {
    // only left mouse button
    if(!this.props.touch || e.button === 0) this.setState({isMouseDown: true})
  }

  _onMouseUp = (e) => {
    if (!this.state.isDragging) return this.cancelDrag()
    let stateChanges = {
      simulatedMouseDown: false,
      isMouseDown: false,
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
      if (e != null) e.stopPropagation()
    }
  }

  _onMouseMove = (e) => {
    if (!this.state.isDragging) {
      if (this.state.isMouseDown) this._startDrag(e)
      return
    }
    let pt = (e.changedTouches && e.changedTouches[0]) || e
    let nextUnscaledX = pt.clientX
    let nextUnscaledY = pt.clientY
    this._moveOrScale({nextUnscaledX, nextUnscaledY, nextProps: this.props})
  }

  _moveOrScale({nextUnscaledX, nextUnscaledY, nextProps}) {
    let state = this.state
    // Without next props the dragged panel moves down and to the right when scaling in
    // nextProps = this.props
    let scaledMovement = {
      x: nextUnscaledX / nextProps.scale - state.unscaledX / this.props.scale,
      y: nextUnscaledY / nextProps.scale - state.unscaledY / this.props.scale,
    }
    let nextState = {
      isMoving: true,
      deltaX: state.deltaX + scaledMovement.x,
      deltaY: state.deltaY + scaledMovement.y,
      x: state.x + scaledMovement.x,
      y: state.y + scaledMovement.y,
      unscaledX: nextUnscaledX,
      unscaledY: nextUnscaledY,
    }
    this._onChange(nextState)
  }

  _renderPortal() {
    if (!this.state.isDragging && !this.state.simulatedMouseDown) return
    return (
      <Portal container={document.body}>
        <KeyboardListener
          onKeyUp={this.props.onKeyUp}
          onKeyDown={this.props.onKeyDown}
          onKeyPress={this.props.onKeyPress}
        >
          <div
            style = {{
              position: "fixed",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
            {...this._overlayEventListeners()}
          />
        </KeyboardListener>
      </Portal>
    )
  }

  render() {
    let {Container} = this.props
    return (
      <Container {...this._containerEventListeners()}>
        {this.props.children}
        {this._renderPortal()}
      </Container>
    )
  }

}
