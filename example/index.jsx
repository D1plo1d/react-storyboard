import React from "react"
import ReactDOM from "react-dom"
import {Storyboard, Panel} from "react-storyboard"
import Comment from "./comment.jsx"
import CommentForm from "./comment_form.jsx"
import loremIpsum from "./lorem-ipsum.jsx"

export default class ExampleStoryboard extends React.Component {
  render() {
    return (
      <Storyboard>
        <Panel name="Comment">
          <Comment
            username="Rob"
            title="React Storyboard is awsome!"
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

ReactDOM.render(<ExampleStoryboard/>, document.getElementById('content'))
