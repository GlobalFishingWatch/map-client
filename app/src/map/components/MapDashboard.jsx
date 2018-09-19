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
  render() {
    const { isEmbedded, openSupportFormModal, onExternalLink, onToggleMapPanelsExpanded, mapPanelsExpanded } = this.props;
    const fullScreenMap = COMPLETE_MAP_RENDER === false || AS_MODULE === true;
    return (<div className="fullHeightContainer" >
      {(!isEmbedded && AS_MODULE === false) &&
      <div
        className={classnames(
          MapPanelsStyles.mapPanels,
          {
            [MapPanelsStyles._noFooter]: fullScreenMap,
            [MapPanelsStyles._expanded]: mapPanelsExpanded
          }
        )}
      >
        <div className={MapPanelsStyles.expandButton} onClick={onToggleMapPanelsExpanded} />
        <ControlPanel isEmbedded={isEmbedded} />
        <ReportPanel />
      </div>
      }
      <div
        className={classnames(
          mapStyles.mapContainer,
          { [mapStyles._noFooter]: fullScreenMap }
        )}
        ref={(mapContainerRef) => {
          this.mapContainerRef = mapContainerRef;
        }}
      >
        <Map />
        {AS_MODULE === false &&
          <LeftControlPanel />
        }
      </div>
      {AS_MODULE === false &&
        <div className={classnames(mapStyles.timebarContainer, { [mapStyles._noFooter]: fullScreenMap })} >
          <Timebar />
        </div>
      }
      {fullScreenMap === false &&
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
  mapPanelsExpanded: PropTypes.bool,
  onExternalLink: PropTypes.func,
  openSupportFormModal: PropTypes.func,
  onToggleMapPanelsExpanded: PropTypes.func
};

export default MapDashboard;
