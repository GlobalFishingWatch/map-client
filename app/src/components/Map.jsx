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
  }

  /**
   * Zoom change handler
   * Enforces min and max zoom levels
   * Resets vessel layer data on change
   */
  onZoomChanged() {
    if (!this.map) return;

    let zoom = this.map.getZoom();

    if (zoom < MIN_ZOOM_LEVEL) {
      zoom = MIN_ZOOM_LEVEL;
      this.map.setZoom(MIN_ZOOM_LEVEL);
    }

    if (zoom > MAX_ZOOM_LEVEL) {
      zoom = MAX_ZOOM_LEVEL;
      this.map.setZoom(MAX_ZOOM_LEVEL);
    }

    this.props.setZoom(zoom);

    // We also need to update the center of the map as it can be changed
    // when double clicking or scrolling on the map
    const center = this.map.getCenter();
    this.props.setCenter([center.lat(), center.lng()]);
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
    if (!nextProps.token || !nextProps.map || !this.map) {
      return;
    }

    this.updateBasemap(nextProps);

    if (this.props.map.center[0] !== nextProps.map.center[0] || this.props.map.center[1] !== nextProps.map.center[1]) {
      this.map.setCenter({ lat: nextProps.map.center[0], lng: nextProps.map.center[1] });
    }

    if (this.props.map.zoom !== nextProps.map.zoom) {
      this.map.setZoom(nextProps.map.zoom);
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
      this.props.getWorkspace();
      this.defineBasemaps(this.props.basemaps);

      // pass map down to MapLayers
      this.setState({
        map: this.map,
        mapContainer: this.refs.mapContainer
      });
    }
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
              defaultZoom={this.props.map.zoom}
              defaultCenter={{ lat: this.props.map.center[0], lng: this.props.map.center[1] }}
              defaultZoomControl={false}
              defaultOptions={{
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false
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
      <MapLayers map={this.state.map} mapContainer={this.state.mapContainer} />
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
  getWorkspace: React.PropTypes.func,
  setCurrentVessel: React.PropTypes.func,
  toggleLayerVisibility: React.PropTypes.func,
  setCenter: React.PropTypes.func,
  map: React.PropTypes.object,
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
  openSupportModal: React.PropTypes.func
};

export default Map;
