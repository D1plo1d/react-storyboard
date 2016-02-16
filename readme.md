Like XCode Storyboards but for React and with more awesome.

## Installation

1. `npm install react-storyboard`

## Example Useage

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
