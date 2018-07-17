import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import IconStyles from 'src/components/Shared/Icon.scss';
import Remove from '-!babel-loader!svg-react-loader!assets/icons/remove.svg';
import Info from '-!babel-loader!svg-react-loader!assets/icons/info.svg';
import Pencil from '-!babel-loader!svg-react-loader!assets/icons/pencil.svg';
import Paint from '-!babel-loader!svg-react-loader!assets/icons/paint.svg';

class Icon extends Component {
  render() {
    const { icon, activated } = this.props;
    const classNames = classnames(IconStyles.icon, { [IconStyles._activated]: activated });
    let iconElement;
    switch (icon) {
      case 'remove':
        iconElement = <Remove className={classNames} />;
        break;
      case 'info':
        iconElement = <Info className={classNames} />;
        break;
      case 'pencil':
        iconElement = <Pencil className={classNames} />;
        break;
      case 'paint':
        iconElement = <Paint className={classNames} />;
        break;
      default:
        console.warn('that icon does not exist', icon);
        iconElement = null;
    }

    return iconElement;
  }
}

Icon.propTypes = {
  icon: PropTypes.string,
  activated: PropTypes.bool
};

export default Icon;
