import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ControlPanel from 'mapPanels/rightControlPanel/containers/ControlPanel';
import Timebar from 'timebar/containers/Timebar';
import ReportPanel from 'report/containers/ReportPanel';
import MapFooter from 'siteNav/components/MapFooter';
import LeftControlPanel from 'mapPanels/leftControlPanel/containers/LeftControlPanel';
import Map from 'map/containers/Map';
import MapPanelsStyles from 'styles/components/map-panels.scss';
import mapStyles from 'styles/components/map.scss';

class MapDashboard extends Component {
  constructor() {
    super();
    this.state = {
      expanded: true
    };
  }
  onMapPanelsToggleExpand = () => {
    this.setState({
      expanded: !this.state.expanded
    });
  }
  render() {
    const { isEmbedded, openSupportFormModal, onExternalLink } = this.props;
    return (<div className="fullHeightContainer" >
      {!isEmbedded &&
      <div
        className={classnames(
          MapPanelsStyles.mapPanels,
          {
            [MapPanelsStyles._noFooter]: !COMPLETE_MAP_RENDER,
            [MapPanelsStyles._expanded]: this.state.expanded
          }
        )}
      >
        <div className={MapPanelsStyles.expandButton} onClick={this.onMapPanelsToggleExpand} />
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
        <Map />
        <LeftControlPanel />
      </div>
      <div className={classnames(mapStyles.timebarContainer, { [mapStyles._noFooter]: !COMPLETE_MAP_RENDER })} >
        <Timebar />
      </div >
      {COMPLETE_MAP_RENDER &&
      <MapFooter
        onOpenSupportFormModal={openSupportFormModal}
        isEmbedded={isEmbedded}
        onExternalLink={onExternalLink}
        attributions={this.props.attributions}
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
  attributions: PropTypes.array,
  onExternalLink: PropTypes.func,
  openSupportFormModal: PropTypes.func
};

export default MapDashboard;
