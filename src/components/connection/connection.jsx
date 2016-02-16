import React from "react"
import {connect} from "react-redux"
import Drag from "../pan_and_zoom/drag.jsx"

let GRID_SIZE = 20

@connect(
  (state, ownProps) => {
    let panels = ownProps.panelIDs.map((id) => state.panels[id])
    let snappablePanels = state.panels
    return {panels, snappablePanels}
  },
  (dispatch) => {
    return {
      finishWizard: (action) => dispatch(Object.assign(action, {
        type: "ADD_CONNECTION"
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
    creationWizardPoints: [{x: 0, y:0}, {x: 0, y: 0}]
  }

  componentDidMount() {
    this.refs.drag0.simulateMouseDown()
  }

  _onDragChange = (pointIndex, drag) => {
    if (this._initialized()) return
    let p = this.state.creationWizardPoints
    p[index] = {
      x: drag.x,
      y: drag.y,
    }
    this.setState({creationWizardPoints: p})
    if (!drag.isDragging) this._onDrop(pointIndex)
  }

  _onDrop(pointIndex) {
    if (pointIndex === 0) {
      this.refs.drag1.simulateMouseDown()
    }
    else {
      let points = this.state.creationWizardPoints
      this.props.finishWizard({
        id: this.props.id,
        panelIDs: points.map((point) => this._snappablePanelFor(point).id)
      })
    }
  }

  _snappablePanelFor({x, y}) {
    // TODO!
  }

  _initialized() {
    return this.props.panels[0] != null
  }

  _endPoints() {
    if (this._initialized()) {
      this.props.panels
    } else {
      this.state.creationWizardPoints
    }
  }

  _lengthOnAxis(axis) {
    let p = this._endPoints()
    return Math.max(p[0][axis], p[1][axis]) + 100
  }

  _path() {
    let midpoint = (p[0].x + p[1].x) / 2
    return (
      `M${p[0].x} ${p[0].y} ` +
      `L${midpoint} ${p[0].y} ` +
      `L${midpoint} ${p[1].y} ` +
      `M${p[1].x} ${p[2].y} `
    )
  }

  render() {
    let p = this._endPoints()
    return (
      <svg style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: this._lengthOnAxis("x"),
        height: this._lengthOnAxis("y"),
        "WebkitUserSelect": "none",
      }}>
        {this._endPoints().map(({x, y}, index) =>
          <Drag
            ref={`drag${index}`}
            x={x}
            y={y}
            scale={this.context.storyboard.scale}
            onChange={this._onDragChange.bind(this, index)}
          >
            <circle cx={x} cy={y} r="2" fill="black"/>
          </Drag>
        }
        <path
          d={this._path()}
          stroke="black"
          strokeWidth={2}
        />
      </svg>
    )
  }

}
