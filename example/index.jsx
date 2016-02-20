import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import {Storyboard, Panel} from "react-storyboard"
import Comment from "./comment.jsx"
import CommentForm from "./comment_form.jsx"
import loremIpsum from "./lorem-ipsum.jsx"
import "bootstrap/dist/css/bootstrap.css"

export default class ExampleStoryboard extends React.Component {
  displayName = "ExampleStoryboard"

  render() {
    return (
      <Storyboard>
        {/*
          Panel IDs can be any string. They are used to track the panel in the
          storyboard.yml and are displayed at the top of each panel.
        */}
        <Panel id="Comment:user">
          <Comment
            username="Rob"
            title="React Storyboard is awesome!"
            content={loremIpsum}
          />
        </Panel>

        <Panel id="Comment:annonomous">
          <Comment
            username={null}
            title="React Storyboard is awesome!"
            content={loremIpsum}
          />
        </Panel>

        <Panel id="CommentForm">
          <CommentForm/>
        </Panel>

      </Storyboard>
    )
  }

}

ReactDOM.render(<ExampleStoryboard/>, document.getElementById('content'))
