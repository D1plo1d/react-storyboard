import React from "react"

export default class KeyboardListener extends React.Component {
  displayName = "KeyboardListener"

  static propTypes = {
    onKeyPress: React.PropTypes.func.isRequired,
    onKeyUp: React.PropTypes.func.isRequired,
    onKeyDown: React.PropTypes.func.isRequired,
  }

  static defaultProps = {
    onKeyPress: () => {},
    onKeyUp: () => {},
    onKeyDown: () => {},
  }

  componentWillMount() {
    document.addEventListener("keypress", this._onKeyPress)
    document.addEventListener("keyup", this._onKeyUp)
    document.addEventListener("keydown", this._onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this._onKeyPress)
    document.removeEventListener("keyup", this._onKeyUp)
    document.removeEventListener("keydown", this._onKeyDown)
  }

  _onKeyPress = (e) => {
    this.props.onKeyPress(e)
  }

  _onKeyUp = (e) => {
    this.props.onKeyUp(e)
  }

  _onKeyDown = (e) => {
    this.props.onKeyDown(e)
  }

  render() {
    return React.Children.only(this.props.children)
  }

}
