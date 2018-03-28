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
    if (event.currentTarget.id === 'zoom_in') {
      this.props.incrementZoom();
    } else {
      this.props.decrementZoom();
    }
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
          {this.props.mouseLatLong.lat.toFixed(4)}, {this.props.mouseLatLong.long.toFixed(4)}
        </div >
        <ZoomControls
          canShareWorkspaces={canShareWorkspaces}
          openShareModal={this.props.openShareModal}
          canZoomIn={this.props.canZoomIn}
          canZoomOut={this.props.canZoomOut}
          changeZoomLevel={this.changeZoomLevel}
        />
      </div>
    );
  }
}


LeftControlPanel.propTypes = {
  isEmbedded: PropTypes.bool.isRequired,
  canZoomIn: PropTypes.bool.isRequired,
  canZoomOut: PropTypes.bool.isRequired,
  mouseLatLong: PropTypes.object,
  openShareModal: PropTypes.func.isRequired,
  incrementZoom: PropTypes.func.isRequired,
  decrementZoom: PropTypes.func.isRequired,
  userPermissions: PropTypes.array,
};

export default LeftControlPanel;
