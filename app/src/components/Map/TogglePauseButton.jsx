import PropTypes from 'prop-types';
import React, { Component } from 'preact';

class TogglePauseButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    this.props.onToggle();
  }

  render() {
    return (
      <button onClick={this.onToggle}>
        {this.props.paused ? '►' : '❚❚'}
      </button>
    );
  }
}

TogglePauseButton.propTypes = {
  onToggle: PropTypes.func,
  paused: PropTypes.bool
};

export default TogglePauseButton;
