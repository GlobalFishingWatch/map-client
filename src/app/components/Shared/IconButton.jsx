import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import Icon from 'app/components/Shared/Icon'
import IconButtonStyles from 'app/components/Shared/IconButton.module.scss'

class IconButton extends Component {
  render() {
    const { icon, activated, disabled, label, title } = this.props
    return (
      <div className={IconButtonStyles.iconButton}>
        <button
          title={title}
          className={classnames(IconButtonStyles.button, {
            [IconButtonStyles._activated]: activated,
            [IconButtonStyles._disabled]: disabled,
          })}
        >
          <Icon icon={icon} activated={activated} />
        </button>
        {label !== undefined && <span className={IconButtonStyles.label}>{label}</span>}
      </div>
    )
  }
}

IconButton.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string,
  activated: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default IconButton
