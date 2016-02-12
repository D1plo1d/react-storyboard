import React from "react"

module.exports = (props) => (
  <div style={{
    padding: 10,
    border: "1px solid #ccc",
  }}>
    <h1>{props.title} - {props.username}</h1>
    <h2>{props.content}</h2>
  </div>
)
