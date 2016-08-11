import React, { Component } from 'react';

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
  onToggle: React.PropTypes.func,
  paused: React.PropTypes.bool
};

export default TogglePauseButton;
