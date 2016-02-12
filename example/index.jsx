import React from "react"
import ReactDOM from "react-dom"
import {Storyboard, Panel} from "react-storyboard"

let loremIpsum = (
  "Lorem ipsum dolor sit amet, ut dicam maiorum quo. Facete detraxit " +
  "phaedrum ei mei, quo dico munere aeterno eu, ludus quodsi molestie nec an. " +
  "Te est splendide democritum, nam ei insolens pertinacia, ut sit option "+
  "utroque accusata. Duis oblique singulis mea ea. Sea te alii suas causae."
)

let Comment = (props) => (
  <div style={{padding: 10, border: "1px solid #ccc"}}>
    <h1>{props.title} - {props.username}</h1>
    <h2>{props.content}</h2>
  </div>
)

let CommentForm = (props) => (
  <div>
    <h1>Add a Comment</h1>
    <textarea/>
  </div>
)

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
