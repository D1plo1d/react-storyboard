import React from "react"
import {connect} from "react-redux"
import Drag from "../pan_and_zoom/drag.jsx"

const SNAPPING_DISTANCE = 30

@connect(
  (state, ownProps) => {
    let connection = state.connections[ownProps.id]
    let panels = connection.panelIDs.map((id) => state.panels[id])
    let snappablePanels = state.panels
    return {panels, snappablePanels}
  },
  (dispatch) => {
    return {
      updateConnection: (action) => dispatch(Object.assign(action, {
        type: "UPDATE_CONNECTION",
      })),
    }
  }
)
export default class Connection extends React.Component {
  displayName = "Panel"

  static contextTypes = {
    storyboard: React.PropTypes.object,
  }

  state = {
    creationWizardPoints: [],
  }

  componentDidMount() {
    let panelCount = this.props.panels.length
    if (panelCount < 2) {
      this.refs[`drag${panelCount}`].simulateMouseDown()
    }
  }

  _onDragChange = (pointIndex, drag) => {
    if (this._wizardIsFinished()) return
    let p = new Array(this.state.creationWizardPoints)
    let panel = this._snappablePanelFor(drag)
    if (panel == null) {
      p[pointIndex] = {
        x: drag.x,
        y: drag.y,
      }
    }
    else {
      p[pointIndex] = {
        x: panel.x + panel.width,
        y: panel.y + panel.height/2,
      }
    }
    this.setState({creationWizardPoints: p})
  }

  _onDrop(pointIndex, drag, {preventDrop}) {
    let points = this.state.creationWizardPoints
    let panel = this._snappablePanelFor(points[pointIndex])
    // prevent dropping unless there is a snappable panel
    if (panel == null) preventDrop()
    if (pointIndex === 0) {
      this.refs.drag1.simulateMouseDown()
    }
    else {
      let panels = this.props.panels.slice(0)
      panels[pointIndex] = panel
      this.props.updateConnection({
        id: this.props.id,
        panelIDs: panels.map(({id}) => id),
      })
    }
  }

  _snappablePanelFor({x, y}) {
    return Object.values(this.props.snappablePanels).find((panel) => {
      if (this.props.panels.includes(panel)) return false
      let dist = Math.sqrt(
        Math.pow(panel.x + panel.width - x, 2) +
        Math.pow(panel.y + panel.height / 2 - y, 2)
      )
      return dist < SNAPPING_DISTANCE * this.context.storyboard.scale
    })
  }

  _initialized() {
    return this._endPoints().filter((p) => p.placeholder !== true).length === 2
  }

  _wizardIsFinished() {
    return this.props.panels[1] != null
  }

  _endPoints() {
    let {panels} = this.props
    let placeholder = panels[0] || panels[1] || {x: 0, y:0}
    placeholder = Object.assign({}, placeholder, {
      placeholder: true,
    })
    if(placeholder.width != null) {
      placeholder.x += placeholder.width
      placeholder.y += placeholder.height / 2
    }
    return [0, 1].map((index) => {
      let panel = panels[index]
      if (panel == null) {
        return this.state.creationWizardPoints[index] || placeholder
      }
      else {
        return {x: panel.x + panel.width, y: panel.y + panel.height / 2}
      }
    })
  }

  _offsetOnAxis(axis) {
    let p = this._endPoints()
    return Math.min(p[0][axis], p[1][axis]) - 100
  }

  _maxPointOnAxis(axis) {
    let p = this._endPoints()
    return Math.max(p[0][axis], p[1][axis])
  }

  _path() {
    if (!this._initialized()) return ""
    let p = this._endPoints()
    let midpoint = (p[0].x + p[1].x) / 2
    let xOffset = this._offsetOnAxis("x")
    let yOffset = this._offsetOnAxis("y")
    return (
      `M${p[0].x - xOffset} ${p[0].y - yOffset} ` +
      `L${midpoint - xOffset} ${p[0].y - yOffset} ` +
      `L${midpoint - xOffset} ${p[1].y - yOffset} ` +
      `L${p[1].x - xOffset} ${p[1].y - yOffset}`
    )
  }

  render() {
    // console.log("SCALE", this.context.storyboard.scale)
    return (
      <svg style={{
        position: "absolute",
        // Offset by the panel border width
        left: this._offsetOnAxis("x") + 2,
        // Offset by the panel border width
        top: this._offsetOnAxis("y") + 2,
        width: -this._offsetOnAxis("x") + this._maxPointOnAxis("x") + 100,
        height: -this._offsetOnAxis("y") + this._maxPointOnAxis("y") + 100,
        "WebkitUserSelect": "none",
      }}>
        {this._endPoints().map(({x, y}, index) =>
          <Drag
            ref={`drag${index}`}
            key={`drag${index}`}
            x={x}
            y={y}
            scale={this.context.storyboard.scale}
            onChange={this._onDragChange.bind(this, index)}
            onDrop={this._onDrop.bind(this, index)}
          >
            <circle
              cx={x - this._offsetOnAxis("x")}
              cy={y - this._offsetOnAxis("y")}
              r="20"
              style={{
                fill:"black",
                display: (this._initialized()) ? "block" : "none",
              }}
            />
          </Drag>
        )}
        <path
          d={this._path()}
          style={{
            fill: "transparent",
            stroke: "black",
            strokeWidth: 2,
          }}
        />
      </svg>
    )
  }

}
