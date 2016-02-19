Like XCode Storyboards but for React and with more awesome.

## Installation

1. `npm install react-storyboard`

## Example Usage

### Client Side
```jsx
import React from "react"
import ReactDOM from "react-dom"
import {Storyboard, Panel} from "react-storyboard"

export default class ExampleStoryboard extends React.Component {
  render() {
    return (
      <Storyboard>
        <Panel name="Comment">
          <Comment
            username="Rob"
            title="React Storyboard is awesome!"
            content={loremIpsum}
          />
        </Panel>

        <Panel name="CommentForm">
          <CommentForm/>
        </Panel>

      </Storyboard>
    )
  }
}
```

### nodeJS
react-storyboard requires a nodeJS server-side component to persist panel positions to the config file (by default configs are stored in `./config/storyboard.yml`).

To set up the server side component add this line to your webpack.config.js or wherever you run your development nodeJS code:

```js
require("react-storyboard/src/server.js")
```
