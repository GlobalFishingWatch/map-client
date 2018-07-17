import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Icon from 'src/components/Shared/Icon';
import IconButtonStyles from 'src/components/Shared/IconButton.scss';

class IconButton extends Component {
  render() {
    const { icon, activated } = this.props;
    return (<button className={classnames(IconButtonStyles.iconButton, { [IconButtonStyles._activated]: activated })}>
      <Icon icon={icon} activated={activated} />
    </button>);
  }
}

IconButton.propTypes = {
  icon: PropTypes.string,
  activated: PropTypes.bool
};

export default IconButton;
