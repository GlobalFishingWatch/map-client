/* eslint react/sort-comp:0 */
/* eslint-disable max-len  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import delay from 'lodash/delay';
import template from 'lodash/template';
import templateSettings from 'lodash/templateSettings';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';
import { MIN_ZOOM_LEVEL } from 'constants';
import ControlPanel from 'containers/Map/ControlPanel';
import Header from 'containers/Header';
import mapCss from 'styles/components/c-map.scss';
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
import MapFooter from 'components/Map/MapFooter';
import iconStyles from 'styles/icons.scss';
import mapPanelsStyles from 'styles/components/c-map-panels.scss';
import ShareIcon from 'babel!svg-react!assets/icons/share-icon.svg?name=ShareIcon';
import ZoomInIcon from 'babel!svg-react!assets/icons/zoom-in.svg?name=ZoomInIcon';
import ZoomOutIcon from 'babel!svg-react!assets/icons/zoom-out.svg?name=ZoomOutIcon';
import Loader from 'containers/Map/Loader';

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
    this.onMapIdle = this.onMapIdle.bind(this);
    this.changeZoomLevel = this.changeZoomLevel.bind(this);
    this.onWindowResizeBound = this.onWindowResize.bind(this);
    this.onMapContainerClickBound = this.onMapContainerClick.bind(this);
  }

  /**
   * Zoom change handler
   */
  onZoomChanged() {
    if (!this.map) return;
    if (this.map.getZoom() !== this.props.zoom) {
      this.props.setZoom(this.map.getZoom());
    }
    const center = this.map.getCenter();
    this.props.setCenter([center.lat(), center.lng()], this._getCenterWorld(center));
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResizeBound);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResizeBound);
  }

  onWindowResize() {
    this.setState(this.getViewportSize());
  }

  componentWillReceiveProps(nextProps) {
    if (!this.map) {
      return;
    }
    this.updateBasemap(nextProps);

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
    if (!this.map) {
      return;
    }
    this.map.setOptions({ draggableCursor: 'default' });
    this.setState({
      latlon: `${point.latLng.lat().toFixed(4)}, ${point.latLng.lng().toFixed(4)}`
    });
  }

  onDragEnd() {
    if (!this.map) {
      return;
    }
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
  onMapIdle() {
    if (!this.map) {
      this.map = this.refs.map.props.map; // eslint-disable-line react/no-string-refs
      this.props.initMap(this.map);
      this.props.loadInitialState();
      this.defineBasemaps(this.props.basemaps);
      // pass map and viewport dimensions down to MapLayers
      const stateUpdate = this.getViewportSize();
      stateUpdate.map = this.map;
      this.setState(stateUpdate);
    }
  }

  getViewportSize() {
    const rect = this.refs.mapContainer.getBoundingClientRect();
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

    return (<div className="full-height-container">
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
            mapPanelsStyles['map-panels'],
            {
              [mapPanelsStyles['-no-footer']]: !COMPLETE_MAP_RENDER
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
          mapCss['map-container'],
          { [mapCss['-no-footer']]: !COMPLETE_MAP_RENDER },
          { '-map-pointer': this.props.showMapCursorPointer },
          { '-map-zoom': this.props.showMapCursorZoom }
        )}
        ref="mapContainer"
      >
        <div className={mapCss['map-loader']}>
          <Loader tiny />
        </div>
        <div className={mapCss.latlon}>
          {this.state.latlon}
        </div>
        <div className={mapCss['zoom-controls']}>
          {canShareWorkspaces &&
          <span className={mapCss.control} id="share_map" onClick={this.props.openShareModal} >
            <ShareIcon className={classnames(iconStyles.icon, iconStyles['icon-share'])} />
          </span>}
          <span
            className={classnames(mapCss.control, { [`${mapCss['-disabled']}`]: this.props.zoom >= this.props.maxZoom })}
            id="zoom_up"
            onClick={this.changeZoomLevel}
          >
            <ZoomInIcon className={classnames(iconStyles.icon, iconStyles['icon-zoom-in'])} />
          </span>
          <span
            className={classnames(mapCss.control, { [`${mapCss['-disabled']}`]: this.props.zoom <= MIN_ZOOM_LEVEL })}
            id="zoom_down"
            onClick={this.changeZoomLevel}
          >
            <ZoomOutIcon className={classnames(iconStyles.icon, iconStyles['icon-zoom-out'])} />
          </span>
        </div>
        <div
          className={classnames(mapCss['attributions-container'], {
            [mapCss['-embed']]: this.props.isEmbedded
          })}
        >
          <span className={mapCss['mobile-map-attributions']}>

            <a
              className={mapCss.link}
              href="https://carto.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CartoDB
            </a>
            {' '} Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics, EEZs:{' '}
            <a
              className={mapCss.link}
              href="http://marineregions.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              marineregions.org
            </a>, MPAs:{' '}
            <a
              className={mapCss.link}
              href="http://mpatlas.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              mpatlas.org
            </a>
          </span>
        </div>
        <GoogleMapLoader
          containerElement={
            <div
              className={mapCss.map}
              style={{ height: '100%' }}
              onClick={this.onMapContainerClickBound}
            />
            }
          googleMapElement={
            <GoogleMap
              ref="map"
              defaultZoom={this.props.zoom}
              defaultCenter={{ lat: this.props.centerLat, lng: this.props.centerLong }}
              defaultZoomControl={false}
              defaultOptions={{
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false
              }}
              options={{
                maxZoom: this.props.maxZoom,
                minZoom: MIN_ZOOM_LEVEL
              }}
              defaultMapTypeId={google.maps.MapTypeId.SATELLITE}
              onMousemove={this.onMouseMove}
              onZoomChanged={this.onZoomChanged}
              onDragend={this.onDragEnd}
              onIdle={this.onMapIdle}
            />
          }
        />
      </div>
      <MapLayers
        map={this.state.map}
        viewportWidth={this.state.viewportWidth}
        viewportHeight={this.state.viewportHeight}
      />
      <div className={classnames(mapCss['timebar-container'], { [mapCss['-no-footer']]: !COMPLETE_MAP_RENDER })}>
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
