import React, { Component } from 'react';

// This component is used to replace the rhombus element around the website.
// Feel free to customize it and improve it if need.
class Rhombus extends Component {

  render() {
    return (
      <div
        className={`c-rhombus ${this.props.direction} ${this.props.color}`}
        onClick={this.props.onClick}
      >
        <span className={`rhombus ${this.props.color}`}></span>
        {this.props.children &&
          <span className={`text ${this.props.color}`}>
            {this.props.children}
          </span>}
      </div>
    );
  }
}

Rhombus.propTypes = {
  children: React.PropTypes.node,
  direction: React.PropTypes.string,
  color: React.PropTypes.string,
  onClick: React.PropTypes.func
};

export default Rhombus;
