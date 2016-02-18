import React from "react" // eslint-disable-line no-unused-vars
import Drag from "../pan_and_zoom/drag.jsx"

const BORDER_COLOR = "#666"
const SIZE = "30px"

/* eslint-disable react/display-name */
export default ({width, height, scale, onResize}) => (
  <Drag
    x={width}
    y={height}
    scale={scale}
    onChange={({x, y}) => onResize({width: x - x % 10, height: y - y % 10})}
  >
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderWidth: `0 0 ${SIZE} ${SIZE}`,
        borderColor: `transparent transparent ${BORDER_COLOR} transparent`,
        zIndex: 10,
      }}
    />
  </Drag>
)
