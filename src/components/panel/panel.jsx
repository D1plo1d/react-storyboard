import React from "react"
import {connect} from "react-redux"
import Drag from "../pan_and_zoom/drag.jsx"
import linkIcon from "./link_icon.svg"

const GRID_SIZE = 20
const CIRCLE_RADIUS = 40
const ICON_RADIUS = 30
const BORDER_WIDTH = 2
const BORDER_COLOR = "#666"
const ICON_COLOR = "#444"

@connect(
  (state, ownProps) => {
    let {x, y} = state.panels[ownProps.id] || {x: 0, y: 0}
    return {x, y}
  },
  (dispatch, ownProps) => {
    return {
      onMove: (action) => dispatch(Object.assign(action, {
        type: "MOVE_PANEL",
      })),
      onAddConnection: () => dispatch({
        type: "ADD_CONNECTION",
        panelIDs: [ownProps.id],
      }),
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
    let width = 300
    let height = 300
    return (
      <div style={{
        position: "absolute",
        left: this.props.x,
        top: this.props.y,
        "WebkitUserSelect": "none",
      }}>
        <div style={{
          width: width,
          height: height,
          display: "flex",
          flexDirection: "column",
          border: `${BORDER_WIDTH}px solid ${BORDER_COLOR}`,
          background: "white",
        }}>
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
          <div ref="content" style={{
            flexGrow: 1,
            overflow: "hidden",
          }}>
            {this.props.children}
          </div>
        </div>
        <div ref="connectionPoint" style={{
          position: "absolute",
          left: width - CIRCLE_RADIUS / 2 + BORDER_WIDTH * 1.5,
          top: height / 2 - CIRCLE_RADIUS / 2 + BORDER_WIDTH,
        }}
        >
          <svg>
            <circle
              cx={CIRCLE_RADIUS/2}
              cy={CIRCLE_RADIUS/2}
              r={CIRCLE_RADIUS/2 - BORDER_WIDTH}
              onClick={this.props.onAddConnection}
              style = {{
                pointer: "cursor",
                fill: "white",
                stroke: BORDER_COLOR,
                strokeWidth: BORDER_WIDTH,
              }}
            />
          </svg>
          <div src={linkIcon} style={{
            background: ICON_COLOR,
            WebkitMask: `url(${linkIcon}) center / contain no-repeat`,
            zIndex: 2,
            width: ICON_RADIUS,
            height: ICON_RADIUS,
            position: "absolute",
            left: (CIRCLE_RADIUS - ICON_RADIUS) / 2 - 1,
            top: (CIRCLE_RADIUS - ICON_RADIUS) / 2 + 1,
          }}/>
        </div>
      </div>
    )
  }

}
