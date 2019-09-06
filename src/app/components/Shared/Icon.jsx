import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import IconStyles from 'app/components/Shared/Icon.module.scss'
import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg'
import { ReactComponent as Remove } from 'assets/icons/remove.svg'
import { ReactComponent as Info } from 'assets/icons/info.svg'
import { ReactComponent as Pencil } from 'assets/icons/pencil.svg'
import { ReactComponent as Paint } from 'assets/icons/paint.svg'
import { ReactComponent as Labels } from 'assets/icons/labels.svg'
import { ReactComponent as Graticules } from 'assets/icons/graticules.svg'
import { ReactComponent as Bathymetry } from 'assets/icons/bathymetry.svg'
import { ReactComponent as Vessels } from 'assets/icons/vessel.svg'
import { ReactComponent as Reports } from 'assets/icons/report-menu.svg'
import { ReactComponent as Layers } from 'assets/icons/layers-menu.svg'
import { ReactComponent as Filters } from 'assets/icons/filters-menu.svg'
import { ReactComponent as Report } from 'assets/icons/report.svg'
import { ReactComponent as Target } from 'assets/icons/target.svg'
import { ReactComponent as Pin } from 'assets/icons/pin.svg'
import { ReactComponent as Unpin } from 'assets/icons/unpin.svg'
import { ReactComponent as Share } from 'assets/icons/share.svg'
import { ReactComponent as Close } from 'assets/icons/close.svg'
import { ReactComponent as Ruler } from 'assets/icons/ruler.svg'
import { ReactComponent as Graph } from 'assets/icons/graph.svg'

class Icon extends Component {
  render() {
    const { icon, activated } = this.props
    const classNames = classnames(IconStyles.icon, {
      [IconStyles._activated]: activated,
    })
    let iconElement
    switch (icon) {
      case 'alert':
        iconElement = <AlertIcon className={classNames} />
        break
      case 'remove':
        iconElement = <Remove className={classNames} />
        break
      case 'info':
        iconElement = <Info className={classNames} />
        break
      case 'pencil':
        iconElement = <Pencil className={classNames} />
        break
      case 'paint':
        iconElement = <Paint className={classNames} />
        break
      case 'labels':
        iconElement = <Labels className={classNames} />
        break
      case 'graticules':
        iconElement = <Graticules className={classNames} />
        break
      case 'bathymetry':
        iconElement = <Bathymetry className={classNames} />
        break
      case 'vessels':
        iconElement = <Vessels className={classNames} />
        break
      case 'reports':
        iconElement = <Reports className={classNames} />
        break
      case 'layers':
        iconElement = <Layers className={classNames} />
        break
      case 'filters':
        iconElement = <Filters className={classNames} />
        break
      case 'report':
        iconElement = <Report className={classnames(classNames, IconStyles.report)} />
        break
      case 'target':
        iconElement = <Target className={classNames} />
        break
      case 'pin':
        iconElement = <Pin className={classnames(classNames, IconStyles.pin)} />
        break
      case 'unpin':
        iconElement = <Unpin className={classNames} />
        break
      case 'share':
        iconElement = <Share className={classnames(classNames, IconStyles.share)} />
        break
      case 'close':
        iconElement = <Close className={classnames(classNames, IconStyles.close)} />
        break
      case 'ruler':
        iconElement = <Ruler className={classnames(classNames, IconStyles.ruler)} />
        break
      case 'graph':
        iconElement = <Graph className={classNames} />
        break
      default:
        console.warn('that icon does not exist', icon)
        iconElement = null
    }

    return iconElement
  }
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  activated: PropTypes.bool,
}

Icon.defaultProps = {
  activated: false,
}

export default Icon
