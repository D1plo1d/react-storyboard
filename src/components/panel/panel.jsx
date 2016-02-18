import React from "react"
import {connect} from "react-redux"
import Drag from "../pan_and_zoom/drag.jsx"
import linkIcon from "./link_icon.svg"
import Frame from 'react-frame-component'
import ResizeHandle from './_resize_handle.jsx'

const GRID_SIZE = 20
const CIRCLE_RADIUS = 60
const ICON_RADIUS = 50
const BORDER_WIDTH = 5
const BORDER_COLOR = "#666"
const ICON_COLOR = "#444"

@connect(
  (state, ownProps) => {
    let defaults = {x: 0, y: 0, width: 1920, height: 1080}
    let panel = state.panels[ownProps.id]

    let {x, y, width, height} = panel || defaults
    return {x, y, width, height, initialized: panel != null}
  },
  (dispatch, ownProps) => {
    return {
      onChange: (action) => dispatch(Object.assign(action, {
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

  componentWillMount() {
    // Create the panel in the store if it doesn't already exist
    if (this.props.initialized === false) {
      let {x, y, width, height} = this.props
      this.props.onChange({id, x, y, width, height})
    }
  }

  _child() {
    React.Children.only(this.props.children)
  }

  _onDragChange = (drag) => {
    this.props.onChange({
      id: this.props.id,
      x: drag.x - drag.x % GRID_SIZE,
      y: drag.y - drag.y % GRID_SIZE,
      width: this.props.width,
      height: this.props.height,
    })
  }

  _onResize = ({width, height}) => {
    this.props.onChange({
      id: this.props.id,
      x: this.props.x,
      y: this.props.y,
      width,
      height,
    })
  }

  _renderHeader() {
    return (
      <Drag
        ref="drag"
        x={this.props.x || 0}
        y={this.props.y || 0}
        scale={this.context.storyboard.scale}
        onChange={this._onDragChange}
        onWheel={() => this.refs.drag.cancelDrag()}
      >
        <div ref="header" style={{
          background: "#444",
          color: "white",
          padding: "5 5",
          fontFamily: "sans-serif",
          fontSize: `40px`,
          fontWeight: "lighter",
          letterSpacing: "0.1em",
          userSelect: "none",
          cursor: "pointer",
        }}>
          {this.props.id}
          <div style={{
            float: "right",
            background: "#444",
          }}>
            ({this.props.width}x{this.props.height})
          </div>
        </div>
      </Drag>
    )
  }

  _renderConnectionPoint() {
    let width = this.props.width
    let height = this.props.height
    return (
      <div ref="connectionPoint" style={{
        position: "absolute",
        left: width - CIRCLE_RADIUS + BORDER_WIDTH * 1.5,
        top: height / 2 - CIRCLE_RADIUS + BORDER_WIDTH,
      }}
      >
        <svg>
          <circle
            cx={CIRCLE_RADIUS}
            cy={CIRCLE_RADIUS}
            r={CIRCLE_RADIUS - BORDER_WIDTH}
            onClick={this.props.onAddConnection}
            style = {{
              fill: "white",
              stroke: BORDER_COLOR,
              strokeWidth: BORDER_WIDTH,
              cursor: "pointer",
            }}
          />
        </svg>
        <div
          onClick={this.props.onAddConnection}
          style={{
            background: ICON_COLOR,
            WebkitMask: `url(${linkIcon}) center / contain no-repeat`,
            zIndex: 2,
            width: ICON_RADIUS * 2,
            height: ICON_RADIUS * 2,
            position: "absolute",
            left: CIRCLE_RADIUS - ICON_RADIUS - 1,
            top: CIRCLE_RADIUS - ICON_RADIUS + 1,
            cursor: "pointer",
          }}
        />
      </div>
    )
  }

  render() {
    let width = this.props.width
    let height = this.props.height
    return (
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: this.props.x,
          top: this.props.y,
          zIndex: 2,
          "WebkitUserSelect": "none",
        }}
      >
        <div style={{
          width: width,
          height: height,
          display: "flex",
          flexDirection: "column",
          border: `${BORDER_WIDTH}px solid ${BORDER_COLOR}`,
          background: "white",
          cursor: "pointer",
        }}>
          {this._renderHeader()}
          <Frame ref="content" style={{
            flexGrow: 1,
          }}>
            {this.props.children}
          </Frame>
        </div>
        {this._renderConnectionPoint()}
        <ResizeHandle
          width={this.props.width}
          height={this.props.height}
          scale={this.context.storyboard.scale}
          onResize={this._onResize}
        />
      </div>
    )
  }

}
