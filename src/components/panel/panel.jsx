import React from "react"
// import clickDrag from "../../higher_order_components/click_drag.jsx"
import Drag from "../pan_and_zoom/drag.jsx"

let GRID_SIZE = 20

export default class Panel extends React.Component {

  state = {
    x: 0,
    y: 0,
    dragStart: {x: 0, y: 0},
    drag: Drag.defaultProps.data,
  }

  static contextTypes = {
    storyboard: React.PropTypes.object
  }

  _child() {
    React.Children.only(this.props.children)
  }

  _onDragChange = (drag) => {
    let nextState = {drag}
    if (drag.isDragging === true && this.state.drag.isDragging !== true) {
      nextState.dragStart = {x: this.state.x, y: this.state.y}
    }
    else {
      // TODO: scale drag and drop by zoom factor
      nextState.x = this.state.dragStart.x + drag.deltaX
      nextState.y = this.state.dragStart.y + drag.deltaY
      if (drag.isDragging === false && this.state.drag.isDragging === true) {
        nextState.x -= nextState.x % GRID_SIZE
        nextState.y -= nextState.y % GRID_SIZE
      }
    }
    this.setState(nextState)
  }

  render() {
    return (
      <div style={{
        width: 300,
        height: 300,
        position: "absolute",
        left: this.state.x,
        top: this.state.y,
        overflow: "hidden",
        border: "2px solid #555",
        background: "white",
      }}>
        {/*TODO: the header should be the only draggable area*/}
        <Drag
          scale={this.context.storyboard.scale}
          data={this.state.drag}
          onChange={this._onDragChange}
        >
          <div ref="header" style={{
            background: "#444",
            color: "white",
            padding: "5 5",
            fontFamily: "sans-serif",
            fontSize: "15px",
            fontWeight: "lighter",
            letterSpacing: "0.1em",
            userSelect: "none",
            "WebkitUserSelect": "none",
            cursor: "pointer",
          }}>
            {this.props.name}
          </div>
        </Drag>
        <div ref="content">
          {this.props.children}
        </div>
      </div>
    )
  }

}
