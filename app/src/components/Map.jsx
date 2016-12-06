/* eslint react/sort-comp:0 */
/* eslint-disable max-len  */

import React, { Component } from 'react';
import _ from 'lodash';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';
import { MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } from '../constants';
import VesselsLayer from './Layers/VesselsLayer';
import createTrackLayer from './Layers/TrackLayer';
import ControlPanel from '../containers/Map/ControlPanel';
import Header from '../containers/Header';
import mapCss from '../../styles/components/c-map.scss';
import Timebar from '../containers/Map/Timebar';
import Modal from './Shared/Modal';
import Share from '../containers/Map/Share';
import LayerInfo from 'containers/Map/LayerInfo';
import NoLogin from '../containers/Map/NoLogin';
import FooterMini from '../components/Shared/FooterMini';
import extentChanged from '../util/extentChanged';


const strictBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-85, -180), new google.maps.LatLng(85, 180));

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addedLayers: {},
      lastCenter: null,
      running: 'stop',
      currentBasemap: null
    };

    this.onClickMap = this.onClickMap.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onZoomChanged = this.onZoomChanged.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onMapIdle = this.onMapIdle.bind(this);
    this.onCenterChanged = this.onCenterChanged.bind(this);
    this.changeZoomLevel = this.changeZoomLevel.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
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

    this.setState({ zoom });
    this.props.setZoom(zoom);

    // We also need to update the center of the map as it can be changed
    // when double clicking or scrolling on the map
    const center = this.map.getCenter();
    this.props.setCenter([center.lat(), center.lng()]);
  }

  /**
   * Detects and handles map clicks
   * Detects collisions with current vessel data
   * Draws tracks and loads vessel details
   *
   * @param event
   */
  onClickMap(event) {
    if (!this.vesselsLayer) {
      return;
    }
    const vessels = this.vesselsLayer.selectVesselsAt(event.pixel.x, event.pixel.y);
    // just get the 1st one for now
    this.props.setCurrentVessel(vessels[0], event.latLng);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize() {
    if (!this.vesselsLayer) {
      return;
    }
    const box = this.refs.mapContainer.getBoundingClientRect();
    this.vesselsLayer.updateViewportSize(box.width, box.height);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps)
    // console.log(this.props.vesselTrack.selectedSeries, nextProps.vesselTrack.selectedSeries)
    if (!nextProps.token) {
      return;
    }

    if (!nextProps.map) {
      return;
    }

    this.updateBasemap(nextProps);
    this.updateLayersState(nextProps);
    this.updateFiltersState(nextProps);

    if (this.props.map.center[0] !== nextProps.map.center[0] || this.props.map.center[1] !== nextProps.map.center[1]) {
      this.map.setCenter({ lat: nextProps.map.center[0], lng: nextProps.map.center[1] });
    }

    if (this.props.map.zoom !== nextProps.map.zoom) {
      this.map.setZoom(nextProps.map.zoom);
    }

    if (!nextProps.filters.timelineOuterExtent || !nextProps.filters.timelineInnerExtent) {
      return;
    }

    const innerExtentChanged = extentChanged(this.props.filters.timelineInnerExtent, nextProps.filters.timelineInnerExtent);
    const startTimestamp = nextProps.filters.timelineInnerExtent[0].getTime();
    const endTimestamp = nextProps.filters.timelineInnerExtent[1].getTime();

    if (!nextProps.vesselTrack) {
      this.trackLayer.clear();
    } else {
      // update tracks layer when:
      // - user selected a new vessel (seriesgroup or selectedSeries changed)
      // - zoom level changed (needs fetching of a new tileset)
      // - playing state changed
      // - user hovers on timeline to highlight a portion of the track, only if selectedSeries is set (redrawing is too slow when all series are shown)
      // - selected inner extent changed
      if (!this.props.vesselTrack ||
          this.props.vesselTrack.seriesgroup !== nextProps.vesselTrack.seriesgroup ||
          this.props.vesselTrack.selectedSeries !== nextProps.vesselTrack.selectedSeries ||
          this.props.map.zoom !== nextProps.map.zoom ||
          this.props.filters.timelinePaused !== nextProps.filters.timelinePaused ||
          (nextProps.vesselTrack.selectedSeries && extentChanged(this.props.filters.timelineOverExtent, nextProps.filters.timelineOverExtent)) ||
          innerExtentChanged) {
        this.updateTrackLayer(nextProps, startTimestamp, endTimestamp, nextProps.filters.timelinePaused);
      }
    }

    if (this.vesselsLayer) {
      // update vessels layer when:
      // - user selected a new flag
      // - selected inner extent changed
      // Vessels layer will update automatically on zoom and center changes, as the overlay will fetch tiles, then rendered by the vessel layer
      if (this.props.filters.flag !== nextProps.filters.flag ||
        innerExtentChanged) {
        this.vesselsLayer.renderTimeRange(startTimestamp, endTimestamp);
      }
    }

    if (nextProps.trackBounds) {
      if (!this.props.trackBounds || !nextProps.trackBounds.equals(this.props.trackBounds)) {
        this.map.fitBounds(nextProps.trackBounds);
      }
    }

    this.updateVesselTransparency(nextProps);
    this.updateVesselColor(nextProps);


  }

  /**
   * Handles and propagates filters changes
   *
   * @param nextProps
   */
  updateFiltersState(nextProps) {
    if (!this.vesselsLayer) {
      return;
    }
    if (
      this.props.filters.flag !== nextProps.filters.flag
    ) {
      this.vesselsLayer.updateFlag(nextProps.filters.flag);
    }
  }

  updateTrackLayer(props, startTimestamp, endTimestamp, timelinePaused) {
    if (!this.trackLayer || !props || !props.vesselTrack || !props.vesselTrack.seriesGroupData) {
      return;
    }
    this.trackLayer.reposition();

    const data = props.vesselTrack.seriesGroupData;

    let overStartTimestamp;
    let overEndTimestamp;
    if (props.filters.timelineOverExtent) {
      overStartTimestamp = props.filters.timelineOverExtent[0].getTime();
      overEndTimestamp = props.filters.timelineOverExtent[1].getTime();
    }

    this.trackLayer.drawTile(
      data,
      props.vesselTrack.selectedSeries,
      {
        startTimestamp,
        endTimestamp,
        timelinePaused,
        overStartTimestamp,
        overEndTimestamp
      }
    );
  }

  rerenderTrackLayer() {
    this.updateTrackLayer(
      this.props,
      this.props.filters.timelineInnerExtent[0].getTime(),
      this.props.filters.timelineInnerExtent[1].getTime(),
      this.props.filters.timelinePaused
    );
  }

  updateBasemap(nextProps) {
    this.map.setMapTypeId(nextProps.map.active_basemap);
  }

  /**
   * Handles and propagates layers changes
   * @param nextProps
   */
  updateLayersState(nextProps) {
    const currentLayers = this.props.map.layers;
    const newLayers = nextProps.map.layers;
    const addedLayers = this.state.addedLayers;

    const updatedLayers = newLayers.map(
      (l, i) => {
        if (currentLayers[i] === undefined) return l;
        if (l.title !== currentLayers[i].title) return l;
        if (l.visible !== currentLayers[i].visible) return l;
        if (l.opacity !== currentLayers[i].opacity) return l;
        return false;
      }
    );

    const promises = [];
    let callAddVesselLayer = null;

    for (let i = 0, j = updatedLayers.length; i < j; i++) {
      if (!updatedLayers[i]) continue;

      const newLayer = updatedLayers[i];
      const oldLayer = currentLayers[i];

      if (addedLayers[newLayer.title] && newLayer.visible && oldLayer.opacity !== newLayer.opacity) {
        this.setLayerOpacity(newLayer);
        continue;
      }

      // If the layer is already on the map and its visibility changed, we update it
      if (addedLayers[newLayer.title] && oldLayer.visible !== newLayer.visible) {
        this.toggleLayerVisibility(newLayer);
        continue;
      }

      // If the layer is not yet on the map and is invisible, we skip it
      if (!newLayer.visible) continue;

      if (addedLayers[newLayer.title] !== undefined) return;

      switch (newLayer.type) {
        case 'ClusterAnimation':
          callAddVesselLayer = this.addVesselLayer.bind(this, newLayer, i + 2);
          break;
        default:
          promises.push(this.addCartoLayer(newLayer, i + 2));
      }
    }

    Promise.all(promises).then((() => {
      if (callAddVesselLayer) callAddVesselLayer();
      this.setState({ addedLayers });
    }));
  }

  /**
   * Creates vessel track layer
   *
   * @param layerSettings
   * @param position
   */
  addVesselLayer(layerSettings) {
    // const canvasLayer = new CanvasLayer(
    //   position,
    //   this.map,
    //   this.props.token,
    //   this.props.filters,
    //   this.props.map.vesselTransparency,
    //   this.props.map.vesselColor,
    //   layerSettings.visible);

    const box = this.refs.mapContainer.getBoundingClientRect();

    if (!this.vesselsLayer) {
      this.vesselsLayer = new VesselsLayer(
        this.map,
        this.props.map.tilesetUrl,
        this.props.token,
        this.props.filters,
        box.width,
        box.height
      );
    }

    // Create track layer
    const TrackLayer = createTrackLayer(google);
    this.trackLayer = new TrackLayer(
      this.refs.map.props.map,
      this.refs.mapContainer.offsetWidth,
      this.refs.mapContainer.offsetHeight
    );

    this.state.addedLayers[layerSettings.title] = this.vesselsLayer;
  }

  /**
   * Creates a Carto-based layer
   *
   * @returns {Promise}
   * @param layerSettings
   * @param index
   */
  addCartoLayer(layerSettings, index) {
    const addedLayers = this.state.addedLayers;

    const promise = new Promise(((resolve) => {
      cartodb.createLayer(this.map, layerSettings.source.args.url)
        .addTo(this.map, index)
        .done(((layer, cartoLayer) => {
          cartoLayer.setOpacity(layerSettings.opacity);
          addedLayers[layer.title] = cartoLayer;
          resolve();
        }).bind(this, layerSettings));
    }));


    return promise;
  }

  /**
   * Creates a Carto-based layer
   *
   * @returns {Promise}
   * @param layerSettings
   * @param index
   */
  setBasemap(basemap, index) {
    const promise = new Promise(((resolve) => {
      if (basemap.url) {
        cartodb.createLayer(this.map, basemap.url)
          .addTo(this.map, index)
          .done(((layer, cartoLayer) => {
            this.state.currentBasemap = cartoLayer;
            resolve();
          }).bind(this, basemap));
      } else {
        this.state.currentBasemap.hide();
      }
    }));

    return promise;
  }

  /**
   * Toggles a layer's visibility
   *
   * @param layerSettings
   */
  toggleLayerVisibility(layerSettings) {
    const layers = this.state.addedLayers;

    if (layerSettings.visible) {
      if (layerSettings.type === 'ClusterAnimation') {
        this.vesselsLayer.show();
        return;
      }

      if (layers[layerSettings.title].isVisible()) return;

      layers[layerSettings.title].show();
    } else {
      if (layerSettings.type === 'ClusterAnimation') {
        this.vesselsLayer.hide();
        return;
      }

      if (!layers[layerSettings.title].isVisible()) return;

      layers[layerSettings.title].hide();
    }
  }

  /**
   * Updates a layer's opacity
   *
   * @param layerSettings
   */
  setLayerOpacity(layerSettings) {
    const layers = this.state.addedLayers;

    if (!Object.keys(layers).length) return;

    if (layerSettings.type === 'ClusterAnimation') return;

    layers[layerSettings.title].setOpacity(layerSettings.opacity);
  }

  onMouseMove() {
    if (!this.map) {
      return;
    }
    this.map.setOptions({ draggableCursor: 'default' });
  }

  onDragStart() {
    if (!this.map) {
      return;
    }
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
    }

    if (this.vesselsLayer) {
      this.vesselsLayer.reposition();
      this.vesselsLayer.render();
    }
    if (this.trackLayer) {
      this.rerenderTrackLayer();
    }
  }

  onCenterChanged() {
    if (this.vesselsLayer) {
      this.vesselsLayer.reposition();
      this.vesselsLayer.render();
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
   * Handles vessel transparency changes
   *
   * @param nextProps
   */
  updateVesselTransparency(nextProps) {
    if (this.props.map.vesselTransparency === nextProps.map.vesselTransparency) {
      return;
    }

    if (!this.vesselsLayer) {
      return;
    }

    // TODO
    // this.vesselsLayer.setVesselTransparency(nextProps.map.vesselTransparency);

    // if (this.state.running !== 'play') {
    //   this.vesselsLayer.refresh();
    // }
  }

  /**
   * TODO
   * Handles vessel color changes
   *
   * @param nextProps
   */
  updateVesselColor(nextProps) {
    if (this.props.map.vesselColor === nextProps.map.vesselColor) {
      return;
    }

    if (!this.vesselsLayer) {
      return;
    }

    // TODO
    this.vesselsLayer.setVesselColor(nextProps.map.vesselColor);

    if (this.state.running !== 'play') {
      this.vesselsLayer.refresh();
    }
  }

  /**
   * Handles clicks on the +/- buttons that manipulate the map zoom
   *
   * @param event
   */
  changeZoomLevel(event) {
    const newZoomLevel = (event.target.id === 'zoom_up')
      ? this.map.getZoom() + 1
      : this.map.getZoom() - 1;

    this.map.setZoom(newZoomLevel);
  }

  /**
   * Big scary map rendering method
   * TODO: see if we can split this up into multiple React components or, if not, split up into multiple render methods
   *
   * @returns {XML}
   */
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
      <Header />
      <div className={mapCss['map-container']} ref="mapContainer">
        <div className={mapCss['zoom-controls']}>
          <span className={mapCss.control} id="share_map" onClick={this.props.openShareModal}>S</span>
          <span className={mapCss.control} id="zoom_up" onClick={this.changeZoomLevel}>+</span>
          <span className={mapCss.control} id="zoom_down" onClick={this.changeZoomLevel}>-</span>
        </div>
        <ControlPanel />
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
              onClick={this.onClickMap}
              onMousemove={this.onMouseMove}
              onZoomChanged={this.onZoomChanged}
              onDragstart={this.onDragStart}
              onDragend={this.onDragEnd}
              onIdle={this.onMapIdle}
              onCenterChanged={this.onCenterChanged}
            />
          }
        />
      </div>
      <div className={mapCss['timebar-container']}>
        <Timebar />
      </div>
      <FooterMini />
    </div>);
  }
}

Map.propTypes = {
  basemaps: React.PropTypes.array,
  filters: React.PropTypes.object,
  token: React.PropTypes.string,
  tilesetUrl: React.PropTypes.string,
  setZoom: React.PropTypes.func,
  getWorkspace: React.PropTypes.func,
  setCurrentVessel: React.PropTypes.func,
  toggleLayerVisibility: React.PropTypes.func,
  setCenter: React.PropTypes.func,
  map: React.PropTypes.object,
  vesselTrack: React.PropTypes.object,
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
  closeShareModal: React.PropTypes.func,
  layerModal: React.PropTypes.object,
  closeLayerInfoModal: React.PropTypes.func,
  trackBounds: React.PropTypes.object,
  vesselTrackDisplayMode: React.PropTypes.string
};

export default Map;
