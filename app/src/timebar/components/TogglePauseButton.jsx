import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import iconStyles from 'styles/icons.scss';
import PlayIcon from '-!babel-loader!svg-react-loader!assets/icons/play.svg?name=FacebookIcon';

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
      <button onClick={this.props.onToggle}>
        {this.props.paused &&
        <PlayIcon className={classnames(iconStyles.icon, iconStyles.playIcon)} />
        }
        {!this.props.paused &&
        '❚❚'
        }
      </button>
    );
  }
}

TogglePauseButton.propTypes = {
  onToggle: PropTypes.func,
  paused: PropTypes.bool
};

export default TogglePauseButton;
