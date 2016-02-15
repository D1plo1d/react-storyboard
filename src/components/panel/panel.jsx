import React from "react"
import {connect} from "react-redux"
// import clickDrag from "../../higher_order_components/click_drag.jsx"
import Drag from "../pan_and_zoom/drag.jsx"

let GRID_SIZE = 20

@connect(
  (state, ownProps) => {
    let {x, y} = state.panels[ownProps.id] || {x: 0, y: 0}
    return {x, y}
  },
  (dispatch) => {
    return {
      onMove: (action) => dispatch(Object.assign(action, {type: "MOVE_PANEL"})),
    }
  }
)
export default class Panel extends React.Component {
  displayName = "Panel"

  static contextTypes = {
    storyboard: React.PropTypes.object,
  }

  _child() {
    React.Children.only(this.props.children)
  }

  _onDragChange = (drag) => {
    this.props.onMove({
      id: this.props.id,
      x: drag.x - drag.x % GRID_SIZE,
      y: drag.y - drag.y % GRID_SIZE,
    })
  }

  render() {
    return (
      <div style={{
        width: 300,
        height: 300,
        position: "absolute",
        left: this.props.x,
        top: this.props.y,
        overflow: "hidden",
        border: "2px solid #555",
        background: "white",
        "WebkitUserSelect": "none",
      }}>
        {/*TODO: the header should be the only draggable area*/}
        <Drag
          x={this.props.x}
          y={this.props.y}
          scale={this.context.storyboard.scale}
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
            cursor: "pointer",
          }}>
            {this.props.id}
          </div>
        </Drag>
        <div ref="content">
          {this.props.children}
        </div>
      </div>
    )
  }

}
