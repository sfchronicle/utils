const React = require("react")
const PropTypes = require("prop-types")

class Topper2 extends React.Component {
  render() { 
    return (
      <div>
          <p>{this.props.text}</p>
      </div>
    )
  }
}

Topper2.propTypes = {
  text: PropTypes.string
}

module.exports = { Topper2 }