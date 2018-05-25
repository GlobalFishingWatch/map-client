import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import MapStyles from 'styles/components/map.scss';
import iconStyles from 'styles/icons.scss';
import ShareIcon from '-!babel-loader!svg-react-loader!assets/icons/share.svg?name=ShareIcon';
import ZoomInIcon from '-!babel-loader!svg-react-loader!assets/icons/zoom-in.svg?name=ZoomInIcon';
import ZoomOutIcon from '-!babel-loader!svg-react-loader!assets/icons/zoom-out.svg?name=ZoomOutIcon';

function ZoomControls({ canShareWorkspaces, openShareModal, canZoomIn, canZoomOut, changeZoomLevel }) {
  return (
    <div className={MapStyles.zoomControls}>
      <span
        className={classnames(MapStyles.control, { [MapStyles._disabled]: canZoomIn === false })}
        id="zoom_in"
        onClick={changeZoomLevel}
      >
        <ZoomInIcon className={classnames(iconStyles.icon, iconStyles.iconZoomIn)} />
      </span>
      <span
        className={classnames(MapStyles.control, { [MapStyles._disabled]: canZoomOut === false })}
        id="zoom_out"
        onClick={changeZoomLevel}
      >
        <ZoomOutIcon className={classnames(iconStyles.icon, iconStyles.iconZoomOut)} />
      </span>
      {canShareWorkspaces &&
      <span className={MapStyles.control} id="share_map" onClick={openShareModal} >
        <ShareIcon className={classnames(iconStyles.icon, iconStyles['icon-share'])} />
      </span>}
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
