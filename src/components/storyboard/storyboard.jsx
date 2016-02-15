import React from "react"
import connect from "react-redux"
import PanAndZoom from "../pan_and_zoom/pan_and_zoom.jsx"
import backgroundImage from "./graphy_@2X.png"
import store from "../../reducers/storyboard.js"

@((Component) => (props) =>
  <Provider store={store}>
    <Component {...props}/>
  </Provider>
)
@connect(
  (state, ownProps) => {
    return {
      connections: state.connections,
    }
  },
)
export default class Storyboard extends React.Component {

  state = {
    x: 0,
    y: 0,
    zoomFactor: 0,
    drag: PanAndZoom.defaultProps.drag
  }

  static childContextTypes = {
    storyboard: React.PropTypes.object
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
        </PanAndZoom>
      </div>
    )
  }

}
