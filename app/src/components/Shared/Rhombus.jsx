import PropTypes from 'prop-types';
import React, { Component } from 'react';
import iconBlueBox from 'assets/icons/arrow_box.svg';
import iconWhiteBox from 'assets/icons/arrow_box_white.svg';

// This component is used to replace the rhombus element around the website.
// Feel free to customize it and improve it if need.
class Rhombus extends Component {

  render() {
    return (
      <img src={this.props.color === 'blue' ? iconBlueBox : iconWhiteBox} alt="icon" />
    );
  }
}

Rhombus.propTypes = {
  children: PropTypes.node,
  direction: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func
};

export default Rhombus;
