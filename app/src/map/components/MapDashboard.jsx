import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ControlPanel from 'mapPanels/rightControlPanel/containers/ControlPanel';
import Timebar from 'timebar/containers/Timebar';
import MiniGlobe from 'mapPanels/leftControlPanel/components/MiniGlobe';
import MobileLeftExpand from 'mapPanels/leftControlPanel/components/MobileLeftExpand';
import ReportPanel from 'report/containers/ReportPanel';
import MapFooter from 'siteNav/components/MapFooter';
import LeftControlPanel from 'mapPanels/leftControlPanel/containers/LeftControlPanel';
import Attributions from 'siteNav/components/Attributions';
import mapPanelsStyles from 'styles/components/map-panels.scss';
import mapStyles from 'styles/components/map.scss';

class MapDashboard extends Component {
  render() {
    const { isEmbedded, activeSubmenu, openSupportFormModal, onExternalLink } = this.props;
    return (<div className="fullHeightContainer" >
      {!isEmbedded &&
      <div
        className={classnames(
          mapPanelsStyles.mapPanels,
          {
            [mapPanelsStyles._noFooter]: !COMPLETE_MAP_RENDER
          }
        )}
      >
        <ControlPanel isEmbedded={isEmbedded} />
        <ReportPanel />
      </div >
      }
      <div
        className={classnames(
          mapStyles.mapContainer,
          { [mapStyles._noFooter]: !COMPLETE_MAP_RENDER }
        )}
        ref={(mapContainerRef) => {
          this.mapContainerRef = mapContainerRef;
        }}
      >
        <div
          id="map"
          className={mapStyles.map}
          style={{ height: '100%' }}
        />

        {/*{isDrawing && <DrawingManager />}*/}
        {/*<Areas />*/}
        <LeftControlPanel />
        {!activeSubmenu && <Attributions isEmbedded={isEmbedded} />}
      </div>
      <MobileLeftExpand isEmbedded={this.props.isEmbedded}>
        <MiniGlobe
          center={{ lat: this.props.latitude, lng: this.props.longitude }}
          zoom={this.props.zoom}
          viewportWidth={1000}
          viewportHeight={600}
          isEmbedded={this.props.isEmbedded}
        />
      </MobileLeftExpand>
      <div className={classnames(mapStyles.timebarContainer, { [mapStyles._noFooter]: !COMPLETE_MAP_RENDER })} >
        <Timebar />
      </div >
      {COMPLETE_MAP_RENDER &&
      <MapFooter
        onOpenSupportFormModal={openSupportFormModal}
        isEmbedded={isEmbedded}
        onExternalLink={onExternalLink}
      />
      }
    </div >);
  }
}

MapDashboard.propTypes = {
  isEmbedded: PropTypes.bool,
  zoom: PropTypes.number,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  onExternalLink: PropTypes.func,
  openSupportFormModal: PropTypes.func,
  activeSubmenu: PropTypes.string
};

export default MapDashboard;
