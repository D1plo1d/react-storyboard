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
const FONT_SIZE = 60
const BORDER_COLOR = "#666"
const ICON_COLOR = "#444"
const HEADER_PADDING = {x: 5, y: 10}
const headElement = document.getElementsByTagName("head")[0]
const styleElements = headElement.getElementsByTagName("style")

@connect(
  (state, ownProps) => {
    let defaults = {x: 0, y: 0, width: 1170, height: 600}
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
      let {id, x, y, width, height} = this.props
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

  _zoomToPanel = () => {
    this.context.storyboard.zoomTo({
      x: -this.props.x - this.props.width / 2,
      y: -this.props.y - this.props.height / 2,
      zoomFactor: -1,
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
        <div ref="header" onDoubleClick={this._zoomToPanel} style={{
          display: "flex",
          flexDirection: "row",
          background: "#444",
          color: "white",
          padding: `${HEADER_PADDING.x} ${HEADER_PADDING.y}`,
          userSelect: "none",
          cursor: "pointer",
          textOverflow: "ellipsis",
          width: this.props.width,
        }}>
          <div style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
            flexGrow: 1,
          }}>
            {this.props.id}
          </div>
          <div>
            ({this.props.width}x{this.props.height})
          </div>
        </div>
      </Drag>
    )
  }

  _renderConnectionPoint() {
    let topOffset = (
      CIRCLE_RADIUS + BORDER_WIDTH * 0.5 + 10 - HEADER_PADDING.y * 2
    )
    return (
      <div ref="connectionPoint" style={{
        position: "absolute",
        right: -CIRCLE_RADIUS,
        top: `calc(50% + 0.5em - ${topOffset}px)`,
        width: CIRCLE_RADIUS*2,
        height: CIRCLE_RADIUS*2,
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
          top: `calc(${this.props.y - HEADER_PADDING.y*2}px - 1em)`,
          zIndex: 2,
          fontFamily: "sans-serif",
          fontSize: `${FONT_SIZE}px`,
          fontWeight: "lighter",
          letterSpacing: "0.1em",
          "WebkitUserSelect": "none",
        }}
      >
        <div style={{
          border: `${BORDER_WIDTH}px solid ${BORDER_COLOR}`,
          background: "white",
          cursor: "pointer",
        }}>
          {this._renderHeader()}
          <Frame
            ref="content"
            style={{
              width: width,
              height: height,
              border: "none",
            }}
          >
            <style>
              {new Array(...styleElements).map((el) => el.innerText).join("\n")}
            </style>
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
