import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import MapStyles from 'styles/components/map.scss';
import iconStyles from 'styles/icons.scss';
import { MIN_ZOOM_LEVEL } from 'constants';
import ShareIcon from 'babel!svg-react!assets/icons/share-icon.svg?name=ShareIcon';
import ZoomInIcon from 'babel!svg-react!assets/icons/zoom-in.svg?name=ZoomInIcon';
import ZoomOutIcon from 'babel!svg-react!assets/icons/zoom-out.svg?name=ZoomOutIcon';

function ZoomControls({ canShareWorkspaces, openShareModal, zoom, maxZoom, changeZoomLevel }) {
  return (
    <div className={MapStyles.zoomControls}>
      {canShareWorkspaces &&
      <span className={MapStyles.control} id="share_map" onClick={openShareModal} >
        <ShareIcon className={classnames(iconStyles.icon, iconStyles['icon-share'])} />
      </span>}
      <span
        className={classnames(MapStyles.control, { [MapStyles._disabled]: zoom >= maxZoom })}
        id="zoom_up"
        onClick={changeZoomLevel}
      >
        <ZoomInIcon className={classnames(iconStyles.icon, iconStyles['icon-zoom-in'])} />
      </span>
      <span
        className={classnames(MapStyles.control, { [MapStyles._disabled]: zoom <= MIN_ZOOM_LEVEL })}
        id="zoom_down"
        onClick={changeZoomLevel}
      >
        <ZoomOutIcon className={classnames(iconStyles.icon, iconStyles['icon-zoom-out'])} />
      </span>
    </div>
  );
}

ZoomControls.propTypes = {
  canShareWorkspaces: PropTypes.bool.isRequired,
  openShareModal: PropTypes.bool.isRequired,
  maxZoom: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  changeZoomLevel: PropTypes.func.isRequired
};

export default ZoomControls;
