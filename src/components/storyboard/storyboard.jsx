import React from "react"
import {Provider, connect} from "react-redux"
import PanAndZoom from "../pan_and_zoom/pan_and_zoom.jsx"
import Connection from "../connection/connection.jsx"
import backgroundImage from "./graphy_@2X.png"
import store from "../../reducers/storyboard.js"

@((Component) => (ownProps) => // eslint-disable-line react/display-name
  <Provider store={store}>
    <Component {...ownProps}/>
  </Provider>
)
@connect(
  (state) => {
    return {
      connections: state.connections || {},
    }
  },
)
export default class Storyboard extends React.Component {
  displayName = "Storyboard"

  state = {
    x: 0,
    y: 0,
    // zoomFactor: -2.5,
    zoomFactor: 0,
  }

  static childContextTypes = {
    storyboard: React.PropTypes.object,
  }

  getChildContext() {
    return {storyboard: {scale: this._scale()}}
  }

  _onPanOrZoom = (nextState) => {
    if (nextState.zoomFactor > 0) nextState.zoomFactor = 0
    this.setState(nextState)
  }

  _scale() {
    return PanAndZoom.defaultProps.zoomScaling(this.state.zoomFactor)
  }

  render() {
    let scale = this._scale()
    return (
      <div
        ref="container"
        style={{
          width: "100%",
          height: "100%",
          userSelect: "none",
        }}
        onWheel={this._onMousewheel}
      >
        <div
          ref="background-image"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            // marginTop: this.state.y * scale,
            // marginLeft: this.state.x * scale,
            backgroundRepeat: "repeat",
            backgroundImage: `url(${backgroundImage})`,
            // backgroundPosition: `${-scale}% ${-scale}%`,
            backgroundPositionX: `calc(50% + ${this.state.x}px)`,
            backgroundPositionY: `calc(50% + ${this.state.y}px)`,
            backgroundSize: `${40 * scale}px`,
            zIndex: -1,
          }}
        />
        <PanAndZoom
          onChange={this._onPanOrZoom}
          x={this.state.x}
          y={this.state.y}
          zoomFactor={this.state.zoomFactor}
        >
          {this.props.children}
          {
            Object.keys(this.props.connections).map((id) =>
              <Connection id={id} key={`connection-${id}`}/>
            )
          }
        </PanAndZoom>
      </div>
    )
  }

}
