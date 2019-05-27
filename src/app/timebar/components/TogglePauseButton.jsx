import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import iconStyles from 'styles/icons.module.scss'
import { ReactComponent as PlayIcon } from 'assets/icons/play.svg'
import { ReactComponent as PauseIcon } from 'assets/icons/pause.svg'

class TogglePauseButton extends Component {
  render() {
    return (
      <button onClick={this.props.onToggle}>
        {this.props.paused && (
          <PlayIcon className={classnames(iconStyles.icon, iconStyles.playIcon)} />
        )}
        {!this.props.paused && (
          <PauseIcon className={classnames(iconStyles.icon, iconStyles.pauseIcon)} />
        )}
      </button>
    )
  }
}

TogglePauseButton.propTypes = {
  onToggle: PropTypes.func,
  paused: PropTypes.bool,
}

export default TogglePauseButton
