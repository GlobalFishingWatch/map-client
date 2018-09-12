import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import IconStyles from 'src/components/Shared/Icon.scss';
import Remove from '-!babel-loader!svg-react-loader!assets/icons/remove.svg';
import Info from '-!babel-loader!svg-react-loader!assets/icons/info.svg';
import Pencil from '-!babel-loader!svg-react-loader!assets/icons/pencil.svg';
import Paint from '-!babel-loader!svg-react-loader!assets/icons/paint.svg';
import Labels from '-!babel-loader!svg-react-loader!assets/icons/labels.svg';
import Graticules from '-!babel-loader!svg-react-loader!assets/icons/graticules.svg';
import Bathymetry from '-!babel-loader!svg-react-loader!assets/icons/bathymetry.svg';
import Vessels from '-!babel-loader!svg-react-loader!assets/icons/vessel.svg';
import Reports from '-!babel-loader!svg-react-loader!assets/icons/report-menu.svg';
import Layers from '-!babel-loader!svg-react-loader!assets/icons/layers-menu.svg';
import Filters from '-!babel-loader!svg-react-loader!assets/icons/filters-menu.svg';
import Report from '-!babel-loader!svg-react-loader!assets/icons/report.svg';
import Target from '-!babel-loader!svg-react-loader!assets/icons/target.svg';
import Pin from '-!babel-loader!svg-react-loader!assets/icons/pin.svg';
import Unpin from '-!babel-loader!svg-react-loader!assets/icons/unpin.svg';
import Share from '-!babel-loader!svg-react-loader!assets/icons/share.svg';

class Icon extends Component {
  render() {
    const { icon, activated } = this.props;
    const classNames = classnames(IconStyles.icon, { [IconStyles._activated]: activated });
    let iconElement;
    switch (icon) {
      case 'remove': iconElement = <Remove className={classNames} />; break;
      case 'info': iconElement = <Info className={classNames} />; break;
      case 'pencil': iconElement = <Pencil className={classNames} />; break;
      case 'paint': iconElement = <Paint className={classNames} />; break;
      case 'labels': iconElement = <Labels className={classNames} />; break;
      case 'graticules': iconElement = <Graticules className={classNames} />; break;
      case 'bathymetry': iconElement = <Bathymetry className={classNames} />; break;
      case 'vessels': iconElement = <Vessels className={classNames} />; break;
      case 'reports': iconElement = <Reports className={classNames} />; break;
      case 'layers': iconElement = <Layers className={classNames} />; break;
      case 'filters': iconElement = <Filters className={classNames} />; break;
      case 'report': iconElement = <Report className={classnames(classNames, IconStyles.report)} />; break;
      case 'target': iconElement = <Target className={classNames} />; break;
      case 'pin': iconElement = <Pin className={classnames(classNames, IconStyles.pin)} />; break;
      case 'unpin': iconElement = <Unpin className={classNames} />; break;
      case 'share': iconElement = <Share className={classnames(classNames, IconStyles.share)} />; break;
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
