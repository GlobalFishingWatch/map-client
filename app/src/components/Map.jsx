/* eslint react/sort-comp:0 */
import React, { Component } from 'react';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';
import { MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } from '../constants';
// import CanvasLayer from './Layers/CanvasLayer';
import VesselsLayer from './Layers/VesselsLayer';
import createTrackLayer from './Layers/TrackLayer';
import ControlPanel from '../containers/Map/ControlPanel';
import Header from '../containers/Header';
import mapCss from '../../styles/components/c-map.scss';
import Timebar from '../containers/Map/Timebar';
import Modal from './Shared/Modal';
import Share from '../containers/Map/Share';
import NoLogin from '../containers/Map/NoLogin';
import VesselInfoPanel from '../containers/Map/VesselInfoPanel';
import FooterMini from '../components/Shared/FooterMini';
import extentChanged from '../util/extentChanged';

const strictBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-85, -180), new google.maps.LatLng(85, 180));

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlay: null, // TODO deprecate this
      addedLayers: {},
      lastCenter: null,
      running: 'stop',
      currentBasemap: null
    };

    this.updateFilters = this.updateFilters.bind(this);
    this.onClickMap = this.onClickMap.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onZoomChanged = this.onZoomChanged.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onMapIdle = this.onMapIdle.bind(this);
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

    this.updateTrackLayer();
  }

  /**
   * Detects and handles map clicks
   * Detects collisions with current vessel data
   * Draws tracks and loads vessel details
   *
   * @param event
   */
  onClickMap(event) {
    const vessels = this.vesselsLayer.selectVesselsAt(event.pixel.x, event.pixel.y);
    // just get the 1st one for now
    this.props.setCurrentVessel(vessels[0]);
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
    if (!nextProps.token) {
      return;
    }

    if (!nextProps.map) {
      return;
    }

    this.updateBasemap(nextProps);
    this.updateLayersState(nextProps);
    this.updateFiltersState(nextProps);
    this.updateTrackLayer(nextProps);
    this.updateVesselTransparency(nextProps);
    this.updateVesselColor(nextProps);

    if (this.props.map.center[0] !== nextProps.map.center[0] || this.props.map.center[1] !== nextProps.map.center[1]) {
      this.map.setCenter({ lat: nextProps.map.center[0], lng: nextProps.map.center[1] });
    }

    if (this.props.map.zoom !== nextProps.map.zoom) {
      this.map.setZoom(nextProps.map.zoom);
    }
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

    const newInnerExtent = nextProps.filters.timelineInnerExtent;
    if (extentChanged(newInnerExtent, this.props.filters.timelineInnerExtent)) {
      this.vesselsLayer.renderTimeRange(newInnerExtent[0].getTime(), newInnerExtent[1].getTime());
    }

    if (
      this.props.filters.startDate !== nextProps.filters.startDate
      || this.props.filters.endDate !== nextProps.filters.endDate
      || this.props.filters.flag !== nextProps.filters.flag
    ) {
      // TODO
      // this.state.overlay.updateFilters(nextProps.filters);
      this.vesselsLayer.updateFilters(nextProps.filters);
      this.vesselsLayer.renderTimeRange(newInnerExtent[0].getTime(), newInnerExtent[1].getTime());
      this.updateTrackLayer();
    }
  }

  updateTrackLayer(props = null) {
    const workProps = props || this.props;

    if (!this.isTrackLayerReady() || !workProps || !workProps.vesselTrack) {
      return;
    }
    this.state.trackLayer.recalculatePosition();

    this.state.trackLayer.drawTile(
      workProps.vesselTrack.seriesGroupData,
      workProps.vesselTrack.selectedSeries,
      workProps.filters,
      workProps.map.vesselTrackDisplayMode
    );
  }

  updateBasemap(nextProps) {
    const currentBasemapTitle = this.props.map.active_basemap;
    const newBasemapTitle = nextProps.map.active_basemap;
    const basemaps = this.props.map.basemaps;

    if (currentBasemapTitle === newBasemapTitle) return;

    const promises = [];

    for (let i = 0, j = basemaps.length; i < j; i++) {
      if (basemaps[i].title !== newBasemapTitle) continue;

      const newBasemap = basemaps[i];

      promises.push(this.setBasemap(newBasemap, 1));
    }

    Promise.all(promises);
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
        this.props.token,
        this.props.filters,
        box.width,
        box.height
      );
    }

    // Create track layer
    const Overlay = createTrackLayer(google);
    const trackLayer = new Overlay(
      this.refs.map.props.map,
      this.refs.mapContainer.offsetWidth,
      this.refs.mapContainer.offsetHeight
    );
    this.setState({ /* overlay:  canvasLayer, */ trackLayer });

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
    this.updateTrackLayer();
  }

  /**
   * Handles map idle event (once loading is done)
   * Used here to do the initial load of the layers
   */
  onMapIdle() {
    if (!this.map) {
      this.map = this.refs.map.props.map;
      this.props.getWorkspace();
    }
  }

  isTrackLayerReady() {
    return this.state.trackLayer && this.props.vesselTrack;
  }

  /**
   * Triggered when the user updates the vessel data pickers
   * Has special handling for startDate/endDate
   *
   * @param target Name of the filter
   * @param value New value of the filter
   */
  updateFilters(target, value) {
    const filters = Object.assign({}, this.props.filters);

    filters[target] = value;

    this.props.updateFilters(filters);
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

    if (!this.state.overlay) {
      return;
    }

    // TODO
    // this.state.overlay.setVesselTransparency(nextProps.map.vesselTransparency);

    // TODO?
    // if (this.state.running !== 'play') {
    //   this.state.overlay.refresh();
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

    if (!this.state.overlay) {
      return;
    }

    this.state.overlay.setVesselColor(nextProps.map.vesselColor);

    if (this.state.running !== 'play') {
      this.state.overlay.refresh();
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
    this.updateTrackLayer();
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
      <Header />
      <div className={mapCss['map-container']} ref="mapContainer">
        <div className={mapCss['zoom-controls']}>
          <span className={mapCss.control} id="share_map" onClick={this.props.openShareModal}>S</span>
          <span className={mapCss.control} id="zoom_up" onClick={this.changeZoomLevel}>+</span>
          <span className={mapCss.control} id="zoom_down" onClick={this.changeZoomLevel}>-</span>
        </div>
        <ControlPanel />
        <VesselInfoPanel />
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
  filters: React.PropTypes.object,
  token: React.PropTypes.string,
  setZoom: React.PropTypes.func,
  getWorkspace: React.PropTypes.func,
  setCurrentVessel: React.PropTypes.func,
  updateFilters: React.PropTypes.func,
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
  vesselTrackDisplayMode: React.PropTypes.string
};

export default Map;
