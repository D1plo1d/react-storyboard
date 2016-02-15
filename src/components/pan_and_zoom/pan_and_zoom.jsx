import React from "react"
import Drag from "./drag.jsx"

export default class PanAndZoom extends React.Component {
  displayName = "PanAndZoom"

  static defaultProps = {
    x: 0,
    y: 0,
    zoomFactor: 0,
    zoomScaling: (zoomFactor) => Math.pow(1.5, zoomFactor),
  }

  state = {
    dragStart: {x: 0, y: 0},
    drag: Drag.defaultProps.data,
  }

  _onMousewheel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let delta = Math.max(-1, Math.min(1, e.deltaY))
    if (delta === 0) return
    this.setState((_, previousProps) => {
      this.props.onChange({zoomFactor: previousProps.zoomFactor + delta*0.1})
      return {}
    })
  }

  _onDragChange = ({x, y}) => {
    this.props.onChange({x, y})
  }

  _transform() {
    return (
      `translate(${this.props.x}px, ${this.props.y}px) ` +
      `scale(${this.props.zoomScaling(this.props.zoomFactor)})`
    )
  }

  render() {
    return (
      <Drag
        x={this.props.x}
        y={this.props.y}
        data={this.state.drag}
        onChange={this._onDragChange}
      >
        {/*The Dragging is done on the outer div which is full width + height*/}
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
          onWheel={this._onMousewheel}
        >
          {/*The transforms get applied to the inner div*/}
          <div
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center center",
              transform: this._transform(),
            }}
          >
            {this.props.children}
          </div>
        </div>
      </Drag>
    )
  }

}
