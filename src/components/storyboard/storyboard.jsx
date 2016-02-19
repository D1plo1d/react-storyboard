import React from "react"
import {Provider, connect} from "react-redux"
import PanAndZoom from "../pan_and_zoom/pan_and_zoom.jsx"
import Connection from "../connection/connection.jsx"
import backgroundImage from "./graphy_@2X.png"
import store from "../../reducers/storyboard.js"
import {Motion, spring} from "react-motion"

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

  _scale(zoomFactor = this.state.zoomFactor) {
    return PanAndZoom.defaultProps.zoomScaling(zoomFactor)
  }

  render() {
    if (!this.props.initialized) return <div/>
    return (
      <Motion style={{
        x: spring(this.state.x, {stiffness: 150}),
        y: spring(this.state.y, {stiffness: 150}),
        zoomFactor: spring(this.state.zoomFactor, {stiffness: 250}),
      }}>
        {({x, y, zoomFactor}) => {
          let scale = this._scale(zoomFactor)
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
                  backgroundPositionX: `calc(50% + ${x * scale}px)`,
                  backgroundPositionY: `calc(50% + ${y * scale}px)`,
                  backgroundSize: `${400 * scale}px`,
                  zIndex: -1,
                }}
              />
              <PanAndZoom
                onChange={this._onPanOrZoom}
                x={x}
                y={y}
                zoomFactor={zoomFactor}
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
        }}
      </Motion>
    )
  }

}
