import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import ExpandableIconButtonStyles from 'app/components/Shared/ExpandableIconButton.module.scss'

class IconButton extends Component {
  render() {
    const { activated, children } = this.props
    return (
      <div
        className={classnames(ExpandableIconButtonStyles.expandableIconButton, {
          [ExpandableIconButtonStyles._activated]: activated,
        })}
      >
        {children}
      </div>
    )
  }
}

IconButton.propTypes = {
  children: PropTypes.node,
  activated: PropTypes.bool,
}

export default IconButton
