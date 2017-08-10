/* eslint react/sort-comp:0 */
/* eslint-disable max-len  */
import React, { Component } from 'preact';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import delay from 'lodash/delay';
import template from 'lodash/template';
import templateSettings from 'lodash/templateSettings';
import { MIN_ZOOM_LEVEL } from 'constants';

import ControlPanel from 'containers/Map/ControlPanel';
import Header from 'containers/Header';
import Timebar from 'containers/Map/Timebar';
import Modal from 'components/Shared/Modal';
import Share from 'containers/Map/Share';
import LayerInfo from 'containers/Map/LayerInfo';
import ReportPanel from 'containers/Map/ReportPanel';
import MapLayers from 'containers/Layers/MapLayers';
import LayerLibrary from 'containers/Map/LayerManagementModal';
import SearchModal from 'containers/Map/SearchModal';
import SupportForm from 'containers/Map/SupportForm';
import RecentVesselsModal from 'containers/Map/RecentVesselsModal';
import WelcomeModal from 'containers/Map/WelcomeModal';
import PromptLayerRemoval from 'containers/Map/PromptLayerRemoval';
import NoLogin from 'containers/Map/NoLogin';
import DrawingManager from 'containers/Map/DrawingManager';
import Areas from 'containers/Map/Areas';
import MapFooter from 'components/Map/MapFooter';

import mapStyles from 'styles/components/map.scss';
import mapPanelsStyles from 'styles/components/map-panels.scss';

import Loader from 'containers/Map/Loader';
import Attributions from 'components/Map/Attributions';
import ZoomControls from 'components/Map/ZoomControls';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastCenter: null,
      latlon: ''
    };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onZoomChanged = this.onZoomChanged.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.changeZoomLevel = this.changeZoomLevel.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onMapContainerClick = this.onMapContainerClick.bind(this);
  }

  /**
   * Zoom change handler
   */
  onZoomChanged() {
    if (this.map.getZoom() !== this.props.zoom) {
      this.props.setZoom(this.map.getZoom());
    }
    const center = this.map.getCenter();
    this.props.setCenter([center.lat(), center.lng()], this._getCenterWorld(center));
  }

  componentDidMount() {
    const mapDefaultOptions = {
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      zoom: this.props.zoom,
      center: { lat: this.props.centerLat, lng: this.props.centerLong },
      mapTypeId: google.maps.MapTypeId.HYBRID,
      maxZoom: this.props.maxZoom,
      minZoom: MIN_ZOOM_LEVEL
    };
    // Create the map and initialize on the first idle event
    this.map = new google.maps.Map(document.getElementById('map'), mapDefaultOptions);
    // do not use a bound function here as @#$%^ GMaps does not know how to unsubscribe from events attached to them
    google.maps.event.addListenerOnce(this.map, 'idle', () => { this.onMapInit(); });
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    const vpSize = this.getViewportSize();
    if (vpSize) {
      this.setState(vpSize);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.map) {
      return;
    }
    this.updateBasemap(nextProps);
    if (this.props.maxZoom !== nextProps.maxZoom) {
      this.map.set('maxZoom', nextProps.maxZoom);
    }
    if (this.props.zoom !== nextProps.zoom) {
      // do not update the map zoom if it is already matching state
      // (it means the map has been zoomed internally, ie mousewheel)
      if (this.map.getZoom() !== nextProps.zoom) {
        // the delay guarantees that tiles updates coming from the state are flushed to MapLayer's GLContainer
        // before starting the zoom animation
        // the goal is to avoid having the heatmap 'frozen' while zooming
        delay(() => {
          this.map.setZoom(nextProps.zoom);

          // update the center with zoom - useful when zooming to a cluster
          if (nextProps.centerLat || nextProps.centerLong) {
            this.map.setCenter({ lat: nextProps.centerLat, lng: nextProps.centerLong });
          }
        }, 51);
      }
    } else if ((nextProps.centerLat || nextProps.centerLong) && (this.props.centerLat !== nextProps.centerLat || this.props.centerLong !== nextProps.centerLong)) {
      this.map.setCenter({ lat: nextProps.centerLat, lng: nextProps.centerLong });
    }

    if (nextProps.trackBounds) {
      if (!this.props.trackBounds || !nextProps.trackBounds.equals(this.props.trackBounds)) {
        this.map.fitBounds(nextProps.trackBounds);
      }
    }
  }

  updateBasemap(nextProps) {
    if (!nextProps.activeBasemap || nextProps.activeBasemap === this.props.activeBasemap) return;
    this.map.setMapTypeId(nextProps.activeBasemap);
  }

  onMouseMove(point) {
    this.map.setOptions({ draggableCursor: 'default' });
    this.setState({
      latlon: `${point.latLng.lat().toFixed(4)}, ${point.latLng.lng().toFixed(4)}`
    });
  }

  onDragEnd() {
    const center = this.map.getCenter();
    let wrappedLongitude = center.lng();
    if (wrappedLongitude > 180 || wrappedLongitude < -180) {
      wrappedLongitude -= Math.floor((wrappedLongitude + 180) / 360) * 360;
    }

    this.props.setCenter([Math.max(Math.min(center.lat(), 85), -85), wrappedLongitude], this._getCenterWorld(center));
  }

  _getCenterWorld(center) {
    return this.map.getProjection().fromLatLngToPoint(center);
  }

  /**
   * Handles map idle event (once loading is done)
   * Used here to do the initial load of the layers
   */
  onMapInit() {
    if (!this.mapContainerRef) {
      console.warn('GMaps fired init but React container is not ready');
      return;
    }
    google.maps.event.addListener(this.map, 'dragend', this.onDragEnd);
    google.maps.event.addListener(this.map, 'zoom_changed', this.onZoomChanged);
    google.maps.event.addListener(this.map, 'mousemove', this.onMouseMove);
    this.props.initMap(this.map);
    this.props.loadInitialState();
    this.defineBasemaps(this.props.basemaps);
    // pass map and viewport dimensions down to MapLayers
    const stateUpdate = this.getViewportSize();
    stateUpdate.map = this.map;
    this.setState(stateUpdate);
  }

  getViewportSize() {
    if (!this.mapContainerRef) {
      console.warn('map container is not ready');
      return null;
    }
    const rect = this.mapContainerRef.getBoundingClientRect();
    return {
      viewportWidth: rect.width,
      viewportHeight: rect.height
    };
  }

  defineBasemaps(basemaps) {
    templateSettings.interpolate = /{([\s\S]+?)}/g;
    basemaps.filter(b => b.type === 'Basemap').forEach((basemap) => {
      const urlTemplate = template(basemap.url);
      this.map.mapTypes.set(basemap.title, new google.maps.ImageMapType({
        getTileUrl: (coord, zoom) => urlTemplate({ x: coord.x, y: coord.y, z: zoom }),
        tileSize: new google.maps.Size(256, 256),
        name: basemap.title,
        maxZoom: 18
      }));
    });
  }

  /**
   * Handles clicks on the +/- buttons that manipulate the map zoom
   *
   * @param event
   */
  changeZoomLevel(event) {
    const newZoomLevel = (event.currentTarget.id === 'zoom_up')
      ? this.map.getZoom() + 1
      : this.map.getZoom() - 1;
    this.props.setZoom(newZoomLevel);
  }

  onMapContainerClick(event) {
    if (event.target.className.match('js-polygon-report') === null) {
      this.props.clearReportPolygon();
    }
  }

  render() {
    const canShareWorkspaces = !this.props.isEmbedded && (this.props.userPermissions !== null && this.props.userPermissions.indexOf('shareWorkspace') !== -1);

    return (<div className="fullHeightContainer">
      <Header isEmbedded={this.props.isEmbedded} canShareWorkspaces={canShareWorkspaces} />
      {!this.props.isEmbedded &&
      <div>
        <Modal
          opened={(!this.props.token && REQUIRE_MAP_LOGIN) || (this.props.userPermissions !== null && this.props.userPermissions.indexOf('seeMap') === -1)}
          closeable={false}
          close={() => {
          }}
        >
          <NoLogin />
        </Modal>
        <Modal
          opened={this.props.layerModal.open}
          closeable
          close={this.props.closeLayerInfoModal}
          zIndex={1003}
        >
          <LayerInfo />
        </Modal>
        <Modal
          opened={this.props.supportModal.open}
          closeable
          close={this.props.closeSupportModal}
        >
          <SupportForm />
        </Modal>
        <Modal
          opened={this.props.layerManagementModal}
          closeable
          close={this.props.closeLayerManagementModal}
        >
          <LayerLibrary />
        </Modal>
        <Modal
          opened={this.props.searchModalOpen}
          closeable
          close={this.props.closeSearchModal}
        >
          <SearchModal />
        </Modal>
        <Modal
          opened={this.props.recentVesselModalOpen}
          closeable
          close={this.props.closeRecentVesselModal}
        >
          <RecentVesselsModal />
        </Modal>
        <Modal
          opened={this.props.welcomeModalOpen}
          closeable
          close={this.props.closeWelcomeModal}
        >
          <WelcomeModal />
        </Modal>
        <Modal
          opened={this.props.layerIdPromptedForRemoval !== false}
          isSmall
          close={this.props.closeLayerRemovalModal}
        >
          <PromptLayerRemoval />
        </Modal>
        <div
          className={classnames(
            mapPanelsStyles.mapPanels,
            {
              [mapPanelsStyles._noFooter]: !COMPLETE_MAP_RENDER
            }
          )}
        >
          <ControlPanel isEmbedded={this.props.isEmbedded} />
          <ReportPanel />
        </div>
      </div>
      }
      {canShareWorkspaces &&
      <Modal opened={this.props.shareModalOpenState} closeable close={this.props.closeShareModal}>
        <Share />
      </Modal>
      }
      <div
        className={classnames(
          mapStyles.mapContainer,
          { [mapStyles._noFooter]: !COMPLETE_MAP_RENDER },
          { _mapPointer: this.props.showMapCursorPointer },
          { _mapZoom: this.props.showMapCursorZoom }
        )}
        ref={(mapContainerRef) => { this.mapContainerRef = mapContainerRef; }}
      >
        <div
          id="map"
          className={mapStyles.map}
          style={{ height: '100%' }}
          onClick={this.onMapContainerClick}
        />

        {this.props.drawing && <DrawingManager />}
        <Areas />
        <div className={mapStyles.mapLoader}>
          <Loader tiny />
        </div>
        <div className={mapStyles.latlon}>
          {this.state.latlon}
        </div>
        <ZoomControls
          canShareWorkspaces={canShareWorkspaces}
          openShareModal={this.props.openShareModal}
          zoom={this.props.zoom}
          maxZoom={this.props.maxZoom}
          changeZoomLevel={this.changeZoomLevel}
        />
        <Attributions isEmbedded={this.props.isEmbedded} />
      </div>
      <MapLayers
        map={this.state.map}
        viewportWidth={this.state.viewportWidth}
        viewportHeight={this.state.viewportHeight}
      />
      <div className={classnames(mapStyles.timebarContainer, { [mapStyles._noFooter]: !COMPLETE_MAP_RENDER })}>
        <Timebar />
      </div>
      {COMPLETE_MAP_RENDER &&
      <MapFooter
        onOpenSupportModal={this.props.openSupportModal}
        isEmbedded={this.props.isEmbedded}
        onExternalLink={this.props.onExternalLink}
      />
      }
    </div>);
  }
}
Map.propTypes = {
  areas: PropTypes.array.isRequired,
  drawing: PropTypes.bool.isRequired,
  initMap: PropTypes.func,
  activeBasemap: PropTypes.string,
  basemaps: PropTypes.array,
  token: PropTypes.string,
  tilesetUrl: PropTypes.string,
  setZoom: PropTypes.func,
  loadInitialState: PropTypes.func,
  setCenter: PropTypes.func,
  loading: PropTypes.bool,
  centerLat: PropTypes.number,
  centerLong: PropTypes.number,
  zoom: PropTypes.number,
  maxZoom: PropTypes.number,
  /**
   * If share modal is open or closed
   */
  shareModalOpenState: PropTypes.bool,
  /**
   * Open the share modal
   */
  openShareModal: PropTypes.func,
  /**
   * Close the share modal
   */
  supportModal: PropTypes.object,
  closeShareModal: PropTypes.func,
  layerModal: PropTypes.object,
  closeLayerInfoModal: PropTypes.func,
  trackBounds: PropTypes.object,
  closeSupportModal: PropTypes.func,
  openSupportModal: PropTypes.func,
  layerManagementModal: PropTypes.bool,
  closeLayerManagementModal: PropTypes.func,
  userPermissions: PropTypes.array,
  clearReportPolygon: PropTypes.func,
  searchModalOpen: PropTypes.bool,
  closeSearchModal: PropTypes.func,
  recentVesselModalOpen: PropTypes.bool,
  closeRecentVesselModal: PropTypes.func,
  welcomeModalOpen: PropTypes.bool,
  closeWelcomeModal: PropTypes.func,
  closeLayerRemovalModal: PropTypes.func,
  layerIdPromptedForRemoval: PropTypes.any,
  isEmbedded: PropTypes.bool,
  onExternalLink: PropTypes.func,
  showMapCursorPointer: PropTypes.bool,
  showMapCursorZoom: PropTypes.bool
};
export default Map;
