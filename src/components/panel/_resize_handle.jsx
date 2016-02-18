import React from "react" // eslint-disable-line no-unused-vars
import Drag from "../pan_and_zoom/drag.jsx"

const BORDER_COLOR = "#666"

/* eslint-disable react/display-name */
export default ({width, height, scale, onResize}) => {
  let size = 60
  return (
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
          borderWidth: `0 0 ${size} ${size}`,
          borderColor: `transparent transparent ${BORDER_COLOR} transparent`,
          zIndex: 10,
          cursor: "pointer",
        }}
      />
    </Drag>
  )
}
