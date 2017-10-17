import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Loader from 'mapPanels/leftControlPanel/containers/Loader';
import ZoomControls from 'mapPanels/leftControlPanel/components/ZoomControls';
import mapStyles from 'styles/components/map.scss';


class LeftControlPanel extends Component {
  constructor(props) {
    super(props);

    this.changeZoomLevel = this.changeZoomLevel.bind(this);
  }

  changeZoomLevel(event) {
    const newZoomLevel = (event.currentTarget.id === 'zoom_up')
      ? this.props.zoom + 1
      : this.props.zoom - 1;
    this.props.setZoom(newZoomLevel);
  }

  render() {
    const { isEmbedded } = this.props;
    const canShareWorkspaces = !isEmbedded &&
      (this.props.userPermissions !== null && this.props.userPermissions.indexOf('shareWorkspace') !== -1);

    return (
      <div>
        <div className={classnames(mapStyles.mapLoader, { [mapStyles._isEmbedded]: isEmbedded })} >
          <Loader tiny />
        </div >
        <div className={mapStyles.latlon} >
          {this.props.mouseLatLong.lat}, {this.props.mouseLatLong.long}
        </div >
        <ZoomControls
          canShareWorkspaces={canShareWorkspaces}
          openShareModal={this.props.openShareModal}
          zoom={this.props.zoom}
          maxZoom={this.props.maxZoom}
          changeZoomLevel={this.changeZoomLevel}
        />
      </div>
    );
  }
}


LeftControlPanel.propTypes = {
  isEmbedded: PropTypes.bool.isRequired,
  maxZoom: PropTypes.number.isRequired,
  mouseLatLong: PropTypes.object,
  openShareModal: PropTypes.func.isRequired,
  setZoom: PropTypes.func.isRequired,
  userPermissions: PropTypes.array,
  zoom: PropTypes.number.isRequired
};

export default LeftControlPanel;
