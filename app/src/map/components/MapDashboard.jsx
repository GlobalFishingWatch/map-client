import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Popup } from 'react-map-gl';
import PopupStyles from 'styles/components/map/popup.scss';
import StaticLayerPopup from 'map/containers/StaticLayerPopup';
import ControlPanel from 'mapPanels/rightControlPanel/containers/ControlPanel';
import Timebar from 'timebar/containers/Timebar';
import ReportPanel from 'report/containers/ReportPanel';
import MapFooter from 'siteNav/components/MapFooter';
import LeftControlPanel from 'mapPanels/leftControlPanel/containers/LeftControlPanel';
import Map from 'map/containers/Map';
import MapPanelsStyles from 'styles/components/map-panels.scss';
import MapDashboardStyles from 'map/components/mapDashboard.scss';

class MapDashboard extends Component {
  renderHoverPopup() {
    const { hoverPopup } = this.props;
    if (hoverPopup === null) return null;
    return (<Popup
      latitude={hoverPopup.latitude}
      longitude={hoverPopup.longitude}
      closeButton={false}
      anchor="bottom"
      offsetTop={-10}
      tipSize={4}
    >
      <div className={classnames(PopupStyles.popup, PopupStyles._compact)}>
        {hoverPopup.layerTitle}: {hoverPopup.featureTitle}
      </div>
    </Popup>);
  }
  render() {
    const popupComponent = <StaticLayerPopup forceRender={Math.random()} />;
    const hoverPopupComponent = this.renderHoverPopup();
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
          MapDashboardStyles.mapContainer,
          { [MapDashboardStyles._noFooter]: fullScreenMap }
        )}
        ref={(mapContainerRef) => {
          this.mapContainerRef = mapContainerRef;
        }}
      >
        <Map popupComponent={popupComponent} hoverPopupComponent={hoverPopupComponent} />
        {AS_MODULE === false &&
          <LeftControlPanel />
        }
      </div>
      {AS_MODULE === false &&
        <div className={classnames(MapDashboardStyles.timebarContainer, { [MapDashboardStyles._noFooter]: fullScreenMap })} >
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
  hoverPopup: PropTypes.object,
  onExternalLink: PropTypes.func,
  openSupportFormModal: PropTypes.func,
  onToggleMapPanelsExpanded: PropTypes.func
};

export default MapDashboard;
