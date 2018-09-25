import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Icon from 'src/components/Shared/Icon';
import IconButtonStyles from 'src/components/Shared/IconButton.scss';

class IconButton extends Component {
  render() {
    const { icon, activated, disabled, label } = this.props;
    return (<div>
      <button
        className={classnames(IconButtonStyles.iconButton, {
          [IconButtonStyles._activated]: activated,
          [IconButtonStyles._disabled]: disabled
        })}
      >
        <Icon icon={icon} activated={activated} />
      </button>
      {label !== undefined && <span className={IconButtonStyles.label}>
        {label}
      </span>}
    </div>);
  }
}

IconButton.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  activated: PropTypes.bool,
  disabled: PropTypes.bool
};

export default IconButton;
