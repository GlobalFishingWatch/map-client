/* eslint react/sort-comp:0 */
/* eslint-disable max-len  */

import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';
import { MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } from 'constants';
import ControlPanel from 'containers/Map/ControlPanel';
import Header from 'containers/Header';
import mapCss from 'styles/components/c-map.scss';
import Timebar from 'containers/Map/Timebar';
import Modal from 'components/Shared/Modal';
import Share from 'containers/Map/Share';
import LayerInfo from 'containers/Map/LayerInfo';
import ReportPanel from 'containers/Map/ReportPanel';
import MapLayers from 'containers/Layers/MapLayers';
import LayerLibrary from 'containers/LayerLibrary';

import SupportForm from 'containers/Map/SupportForm';
import NoLogin from 'containers/Map/NoLogin';
import MapFooter from 'components/Map/MapFooter';

import iconStyles from 'styles/icons.scss';

import ShareIcon from 'babel!svg-react!assets/icons/share-icon.svg?name=ShareIcon';
import ZoomInIcon from 'babel!svg-react!assets/icons/zoom-in.svg?name=ZoomInIcon';
import ZoomOutIcon from 'babel!svg-react!assets/icons/zoom-out.svg?name=ZoomOutIcon';


const strictBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-85, -180), new google.maps.LatLng(85, 180));

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lastCenter: null
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onZoomChanged = this.onZoomChanged.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onMapIdle = this.onMapIdle.bind(this);
    this.changeZoomLevel = this.changeZoomLevel.bind(this);
    this.onWindowResizeBound = this.onWindowResize.bind(this);
  }

  /**
   * Zoom change handler
   * Enforces min and max zoom levels
   * Resets vessel layer data on change
   */
  onZoomChanged() {
    if (!this.map) return;

    this.props.setZoom(this.map.getZoom());

    // We also need to update the center of the map as it can be changed
    // when double clicking or scrolling on the map
    const center = this.map.getCenter();
    this.props.setCenter([center.lat(), center.lng()]);
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
    if (!nextProps.token || !this.map) {
      return;
    }

    this.updateBasemap(nextProps);

    if (this.props.center[0] !== nextProps.center[0] || this.props.center[1] !== nextProps.center[1]) {
      this.map.setCenter({ lat: nextProps.center[0], lng: nextProps.center[1] });
    }

    if (this.props.zoom !== nextProps.zoom) {
      this.map.setZoom(nextProps.zoom);
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

  onMouseMove() {
    if (!this.map) {
      return;
    }
    this.map.setOptions({ draggableCursor: 'default' });
  }

  onDragEnd() {
    if (!this.map) {
      return;
    }
    const center = this.map.getCenter();

    if (strictBounds.contains(center)) {
      this.props.setCenter([center.lat(), center.lng()]);
      return;
    }
    this.map.panTo(this.state.lastCenter);
    this.props.setCenter([this.state.lastCenter.lat(), this.state.lastCenter.lng()]);
  }

  /**
   * Handles map idle event (once loading is done)
   * Used here to do the initial load of the layers
   */
  onMapIdle() {
    if (!this.map) {
      this.map = this.refs.map.props.map;
      this.props.getLayerLibrary();

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
    _.templateSettings.interpolate = /{([\s\S]+?)}/g;

    basemaps.filter((b) => b.type === 'Basemap').forEach((basemap) => {
      const urlTemplate = _.template(basemap.url);
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

    this.map.setZoom(newZoomLevel);
  }

  render() {
    return (<div className="full-height-container">
      <Modal
        opened={!this.props.token && REQUIRE_MAP_LOGIN}
        closeable={false}
        close={() => {}}
      >
        <NoLogin />
      </Modal>
      <Modal opened={this.props.shareModal.open} closeable close={this.props.closeShareModal}>
        <Share />
      </Modal>
      <Modal
        opened={this.props.layerModal.open}
        closeable
        close={this.props.closeLayerInfoModal}
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
        opened={this.props.layerLibraryModal}
        closeable
        close={this.props.closeLayerLibraryModal}
      >
        <LayerLibrary />
      </Modal>
      <Header />
      <div className={mapCss['map-container']} ref="mapContainer">
        <div className={mapCss['zoom-controls']}>
          <span className={mapCss.control} id="share_map" onClick={this.props.openShareModal}>
            <ShareIcon className={classnames(iconStyles.icon, iconStyles['icon-share'])} />
          </span>
          <span className={mapCss.control} id="zoom_up" onClick={this.changeZoomLevel}>
            <ZoomInIcon className={classnames(iconStyles.icon, iconStyles['icon-zoom-in'])} />
          </span>
          <span className={mapCss.control} id="zoom_down" onClick={this.changeZoomLevel}>
            <ZoomOutIcon className={classnames(iconStyles.icon, iconStyles['icon-zoom-out'])} />
          </span>
        </div>
        <ControlPanel />
        <div className={mapCss['attributions-container']}>
          <span className={mapCss['mobile-map-attributions']}>
            <a
              className={mapCss.link}
              href="https://carto.com/"
              target="_blank"
            >
              CartoDB
            </a>
            {' '} Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics, EEZs:{' '}
            <a
              className={mapCss.link}
              href="http://marineregions.org/"
              target="_blank"
            >
              marineregions.org
            </a>, MPAs:{' '}
            <a
              className={mapCss.link}
              href="http://mpatlas.org/"
              target="_blank"
            >
              mpatlas.org
            </a>
          </span>
        </div>
        <GoogleMapLoader
          containerElement={
            <div className={mapCss.map} style={{ height: '100%' }} />
          }
          googleMapElement={
            <GoogleMap
              ref="map"
              defaultZoom={this.props.zoom}
              defaultCenter={{ lat: this.props.center[0], lng: this.props.center[1] }}
              defaultZoomControl={false}
              defaultOptions={{
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false,
                minZoom: MIN_ZOOM_LEVEL,
                maxZoom: MAX_ZOOM_LEVEL
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
      <ReportPanel />
      <div className={mapCss['timebar-container']}>
        <Timebar />
      </div>
      <MapFooter
        onOpenSupportModal={this.props.openSupportModal}
      />
    </div>);
  }
}

Map.propTypes = {
  activeBasemap: React.PropTypes.string,
  basemaps: React.PropTypes.array,
  token: React.PropTypes.string,
  tilesetUrl: React.PropTypes.string,
  setZoom: React.PropTypes.func,
  getLayerLibrary: React.PropTypes.func,
  getWorkspace: React.PropTypes.func,
  setCurrentVessel: React.PropTypes.func,
  toggleLayerVisibility: React.PropTypes.func,
  setCenter: React.PropTypes.func,
  center: React.PropTypes.array,
  zoom: React.PropTypes.number,
  /**
   * State of the share modal: { open, workspaceId }
   */
  shareModal: React.PropTypes.object,
  /**
   * Open the share modal
   */
  openShareModal: React.PropTypes.func,
  /**
   * Close the share modal
   */
  supportModal: React.PropTypes.object,
  closeShareModal: React.PropTypes.func,
  layerModal: React.PropTypes.object,
  closeLayerInfoModal: React.PropTypes.func,
  trackBounds: React.PropTypes.object,
  closeSupportModal: React.PropTypes.func,
  openSupportModal: React.PropTypes.func,
  layerLibraryModal: React.PropTypes.bool,
  closeLayerLibraryModal: React.PropTypes.func
};

export default Map;
