import React from "react"
import Drag from "./drag.jsx"
import math from "mathjs/dist/math.js"

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

  _scale() {
    return this.props.zoomScaling(this.props.zoomFactor)
  }

  _transform() {
    let translate = math.matrix([
      [1, 0, this.props.x],
      [0, 1, this.props.y],
      [0, 0, 1],
    ])
    let scale = math.matrix([
      [this._scale(), 0, 0],
      [0, this._scale(), 0],
      [0, 0, 1],
    ])
    let matrix = math.multiply(translate, scale)
    console.log(translate.toArray())
    return (
      `matrix(${
        translate.toArray().reduce((a, b) => a.concat(b)).slice(0, 6).join(",")
      })`
    )
      // `scale(${scale}) ` +
      // `translate(${this.props.x / scale}px, ${this.props.y / scale}px) `
    // `translate(50% 50%)`
  }

  render() {
    // let scale = this._scale()
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
          {/*The transforms get applied to the inner divs*/}
          <div

          >
            <div
              style={{
                width: "100%",
                height: "100%",
                // transformOrigin: (
                //   `calc(50% - ${this.props.x}px) ` +
                //   `calc(50% - ${this.props.y}px)`
                // ),
                // transformOrigin: "center center",
                transform: this._transform(),
              }}
            >
              {this.props.children}
            </div>
          </div>
        </div>
      </Drag>
    )
  }

}
