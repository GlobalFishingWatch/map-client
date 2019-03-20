import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import ZoomControlsStyles from 'mapPanels/leftControlPanel/components/zoomControls.scss';
import iconStyles from 'styles/icons.scss';
import LanguageSelector from 'src/components/Shared/LanguageSelector';
import Icon from 'src/components/Shared/Icon';
import ZoomInIcon from '-!babel-loader!svg-react-loader!assets/icons/zoom-in.svg?name=ZoomInIcon';
import ZoomOutIcon from '-!babel-loader!svg-react-loader!assets/icons/zoom-out.svg?name=ZoomOutIcon';

function ZoomControls({ canShareWorkspaces, openShareModal, canZoomIn, canZoomOut, changeZoomLevel }) {
  return (
    <div className={ZoomControlsStyles.zoomControls}>
      <span
        className={classnames(ZoomControlsStyles.control, { [ZoomControlsStyles._disabled]: canZoomIn === false })}
        id="zoom_in"
        onClick={changeZoomLevel}
      >
        <ZoomInIcon className={classnames(iconStyles.icon, iconStyles.iconZoomIn)} />
      </span>
      <span
        className={classnames(ZoomControlsStyles.control, { [ZoomControlsStyles._disabled]: canZoomOut === false })}
        id="zoom_out"
        onClick={changeZoomLevel}
      >
        <ZoomOutIcon className={classnames(iconStyles.icon, iconStyles.iconZoomOut)} />
      </span>
      {canShareWorkspaces &&
      <span className={ZoomControlsStyles.control} id="share_map" onClick={openShareModal} >
        <Icon icon="share" activated />
      </span>}
      <LanguageSelector />
    </div>
  );
}

ZoomControls.propTypes = {
  canShareWorkspaces: PropTypes.bool.isRequired,
  openShareModal: PropTypes.func.isRequired,
  changeZoomLevel: PropTypes.func.isRequired,
  canZoomIn: PropTypes.bool.isRequired,
  canZoomOut: PropTypes.bool.isRequired
};

export default ZoomControls;
