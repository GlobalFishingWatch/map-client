import React, { Component } from 'react';
import iconBlueBox from 'assets/icons/arrow_box.svg';
import iconWhiteBox from 'assets/icons/arrow_box_white.svg';

// This component is used to replace the rhombus element around the website.
// Feel free to customize it and improve it if need.
class Rhombus extends Component {

  render() {
    return (
      <img src={this.props.color === 'blue' ? iconBlueBox : iconWhiteBox} alt="icon"></img>
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
