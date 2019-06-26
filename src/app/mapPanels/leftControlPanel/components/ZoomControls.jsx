import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classnames from 'classnames'
import ZoomControlsStyles from 'app/mapPanels/leftControlPanel/components/zoomControls.module.scss'
import iconStyles from 'styles/icons.module.scss'
import Icon from 'app/components/Shared/Icon'
import { ReactComponent as ZoomInIcon } from 'assets/icons/zoom-in.svg'
import { ReactComponent as ZoomOutIcon } from 'assets/icons/zoom-out.svg'

class ZoomControls extends PureComponent {
  render() {
    const {
      canShareWorkspaces,
      openShareModal,
      canZoomIn,
      canZoomOut,
      changeZoomLevel,
    } = this.props
    return (
      <div className={ZoomControlsStyles.zoomControls}>
        <span
          className={classnames(ZoomControlsStyles.control, {
            [ZoomControlsStyles._disabled]: canZoomIn === false,
          })}
          id="zoom_in"
          onClick={changeZoomLevel}
        >
          <ZoomInIcon className={classnames(iconStyles.icon, iconStyles.iconZoomIn)} />
        </span>
        <span
          className={classnames(ZoomControlsStyles.control, {
            [ZoomControlsStyles._disabled]: canZoomOut === false,
          })}
          id="zoom_out"
          onClick={changeZoomLevel}
        >
          <ZoomOutIcon className={classnames(iconStyles.icon, iconStyles.iconZoomOut)} />
        </span>
        {canShareWorkspaces && (
          <span className={ZoomControlsStyles.control} id="share_map" onClick={openShareModal}>
            <Icon icon="share" activated />
          </span>
        )}
      </div>
    )
  }
}

ZoomControls.propTypes = {
  canShareWorkspaces: PropTypes.bool.isRequired,
  openShareModal: PropTypes.func.isRequired,
  changeZoomLevel: PropTypes.func.isRequired,
  canZoomIn: PropTypes.bool.isRequired,
  canZoomOut: PropTypes.bool.isRequired,
}

export default ZoomControls
