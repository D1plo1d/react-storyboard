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
      initialized: state.initialized,
      connections: state.connections || {},
    }
  },
)
export default class Storyboard extends React.Component {
  displayName = "Storyboard"

  state = {
    x: 0,
    y: 0,
    zoomFactor: -5,
  }

  static childContextTypes = {
    storyboard: React.PropTypes.object,
  }

  getChildContext() {
    return {storyboard: {
      scale: this._scale(),
      zoomTo: ({x, y, zoomFactor}) => this.setState({x, y, zoomFactor}),
    }}
  }

  _onPanOrZoom = (nextState) => {
    if (nextState.zoomFactor > 0) nextState.zoomFactor = 0
    this.setState(nextState)
  }

  _scale() {
    return PanAndZoom.defaultProps.zoomScaling(this.state.zoomFactor)
  }

  render() {
    if (!this.props.initialized) return <div/>
    let scale = this._scale()
    return (
      <div
        ref="container"
        style={{
          width: "100%",
          height: "100%",
          userSelect: "none",
          overflow: "hidden",
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
            backgroundPositionX: `calc(50% + ${this.state.x * scale}px)`,
            backgroundPositionY: `calc(50% + ${this.state.y * scale}px)`,
            backgroundSize: `${400 * scale}px`,
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
