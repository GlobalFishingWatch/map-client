import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from 'leftControlPanel/containers/Loader';
import ZoomControls from 'leftControlPanel/components/ZoomControls';
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
    const canShareWorkspaces = !this.props.isEmbedded &&
      (this.props.userPermissions !== null && this.props.userPermissions.indexOf('shareWorkspace') !== -1);

    return (
      <div>
        <div className={mapStyles.mapLoader} >
          <Loader tiny />
        </div >
        <div className={mapStyles.latlon} >
          {this.props.mouseLatLong.lat}, {this.props.mouseLatLong.lat}
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
  mouseLatLong: PropTypes.array.isRequired,
  openShareModal: PropTypes.func.isRequired,
  setZoom: PropTypes.func.isRequired,
  userPermissions: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired
};

export default LeftControlPanel;
