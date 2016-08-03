import React, { Component } from 'react';
import { GoogleMapLoader, GoogleMap } from 'react-google-maps';
import { TIMELINE_MIN_DATE, TIMELINE_STEP, MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL } from '../constants';
import Draggable from 'react-draggable';
import CanvasLayer from './layers/canvas_layer';
import createTrackLayer from './layers/track_layer';
import LayerPanel from './map/layer_panel';
import VesselPanel from './map/vessel_panel';
import Header from '../containers/header';
import map from '../../styles/index.scss';
import Timeline from '../containers/timeline';
import Modal from './shared/Modal';
import Share from '../containers/map/Share';
import extentChanged from '../util/extentChanged';

const strictBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-85, -180), new google.maps.LatLng(85, 180));

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlay: null,
      addedLayers: [],
      currentTimestamp: TIMELINE_MIN_DATE,
      lastCenter: null,
      playbackRange: 1,
      vesselLayerTransparency: 1,
      currentVesselInfo: {},
      leftHandlerPosition: 0,
      rightHandlerPosition: 0,
      timeBarWidth: 0,
      running: 'stop',
      shareModalOpened: false
    };

    this.playbackStop = this.playbackStop.bind(this);
    this.playbackStart = this.playbackStart.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.updatePlaybackRange = this.updatePlaybackRange.bind(this);
    this.updateVesselLayerDensity = this.updateVesselLayerDensity.bind(this);
    this.onClickMap = this.onClickMap.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onZoomChanged = this.onZoomChanged.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onMapIdle = this.onMapIdle.bind(this);
    this.shareMap = this.shareMap.bind(this);
    this.changeZoomLevel = this.changeZoomLevel.bind(this);
    this.toggleLayerVisibility = this.props.toggleLayerVisibility.bind(this);
  }

  /**
   * Zoom change handler
   * Enforces min and max zoom levels
   * Resets vessel layer data on change
   */
  onZoomChanged() {
    if (!this.map) {
      return;
    }
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
    this.state.overlay.resetPlaybackData();
  }

  /**
   * Handles drag+drop of the time slider handles
   * TODO: review
   *
   * @param tick
   */
  handlerMoved(tick) {
    let target = null;
    let startDate = this.props.filters.startDate;
    let endDate = this.props.filters.endDate;

    const timelineScope = document.getElementById('timeline_handler').parentElement;
    const absMaxMoment = new Date(endDate).getTime() - new Date(startDate).getTime();
    if (tick === 1) {
      target = document.getElementById('dateHandlerLeft');
    } else {
      target = document.getElementById('dateHandlerRight');
    }
    const percentage = ((target.getBoundingClientRect().left - timelineScope.getBoundingClientRect().left) * 100) / timelineScope.offsetWidth;

    if (target.id === 'dateHandlerLeft') {
      startDate = (percentage * absMaxMoment) / 100 + new Date(startDate).getTime();

      // UPDATE VISIBLE TIMESTAMP
      timelineScope.childNodes[0].style.left = (target.getBoundingClientRect().left - target.parentElement.getBoundingClientRect().left - 15) + 'px';
      timelineScope.childNodes[0].style.width = (document.getElementById('dateHandlerRight').getBoundingClientRect().left - target.getBoundingClientRect().left) + 'px';
    } else if (target.id === 'dateHandlerRight') {
      endDate = (percentage * absMaxMoment) / 100 + new Date(startDate).getTime();
      // UPDATE VISIBLE TIMESTAMP
      timelineScope.childNodes[0].style.width = (target.getBoundingClientRect().left - document.getElementById('dateHandlerLeft').getBoundingClientRect().left) + 'px';
    }
    // UPDATE DATES
    this.setState({ currentTimestamp: startDate });
    this.state.overlay.updateFilters(this.props.filters);
    document.getElementById('mindate').value = new Date(startDate).toISOString().slice(0, 10);
    document.getElementById('maxdate').value = new Date(endDate).toISOString().slice(0, 10);
  }

  /**
   * Executed when the user presses the "Play" button
   */
  playbackStart() {
    if (this.state.running === 'play') {
      this.setState({ running: 'pause' });
    } else {
      this.setState({ running: 'play' });
    }

    requestAnimationFrame(function () {
      this.drawVesselFrame(this.state.currentTimestamp || this.props.filters.startDate);
    }.bind(this));
  }

  /**
   * Draws a single frame during playback mode
   * Each frame may represent multiple days of data
   * Recursively calls itself to animate the following frames
   *
   * Handles time slider animation
   * Calculates initial and final vessel timestamp, and calls vessel layer rendering.
   *
   * @param initialTimestamp Initial timestamp to be drawn
   * @param playbackRange
   */
  drawVesselFrame(initialTimestamp, playbackRange) {
    if (this.state.running === 'stop') {
      return;
    }
    if (!this.state.overlay) {
      return;
    }

    initialTimestamp = initialTimestamp || 0;

    playbackRange = playbackRange || this.state.playbackRange;
    const finalTimestamp = initialTimestamp + (TIMELINE_STEP * playbackRange);
    const endDate = this.props.filters.endDate;

    if (finalTimestamp > endDate) {
      this.setState({ running: 'stop' });
      this.playbackStop();
      return;
    }

    this.updatePlaybackBar(this.props.filters.startDate, this.props.filters.endDate, initialTimestamp, playbackRange);
    this.state.overlay.drawTimeRange(initialTimestamp, finalTimestamp);

    // paint track layer
    if (this.state.trackLayer) {
      this.state.trackLayer.drawTile(
        this.props.map.track.seriesGroupData,
        this.props.map.track.selectedSeries,
        this.props.filters,
        this.state.currentTimestamp || this.props.filters.startDate
      );
    }

    const animationID = requestAnimationFrame((() => {
      if (this.state.running === 'play') {
        this.drawVesselFrame(initialTimestamp + TIMELINE_STEP);
      }
    }).bind(this));
    this.setState({ animationID, currentTimestamp: initialTimestamp });
  }

  /**
   * Handles playback stop
   * Called when playback ends or user interrupts it using the "Stop" button
   */
  playbackStop() {
    const filters = this.props.filters;
    cancelAnimationFrame(this.state.animationID);

    this.state.overlay.updateFilters(filters);
    this.state.overlay.drawTimeRange(filters.startDate, filters.endDate);

    this.setState({ running: 'stop', currentTimestamp: filters.startDate });

    this.updatePlaybackBar(filters.startDate, filters.endDate, filters.startDate, this.state.playbackRange);

    if (this.state.trackLayer) {
      this.state.trackLayer.drawTile(this.props.map.track.seriesGroupData, this.props.map.track.selectedSeries, this.props.filters);
    }
  }

  /**
   * Called once additional vessel details are loaded
   * TODO: should probably be moved elsewhere
   *
   * @param data Data returned by the API
   */
  handleAdditionalVesselDetails(data) {
    const currentVesselInfo = this.state.currentVesselInfo;

    data = JSON.parse(data.target.response);
    currentVesselInfo.callsign = data.callsign;
    currentVesselInfo.flag = data.flag;
    currentVesselInfo.imo = data.imo;
    currentVesselInfo.mmsi = data.mmsi;
    currentVesselInfo.name = data.vesselname;

    this.setState({ currentVesselInfo });
  }

  /**
   * Given a series group ID, loads additional info for that vessel
   * Used to display additional data on the vessel details panel
   * TODO: should probably be moved elsewhere
   *
   * @param seriesGroup
   */
  loadAdditionalVesselDetails(seriesGroup) {
    if (typeof XMLHttpRequest !== 'undefined') {
      this.request = new XMLHttpRequest();
    } else {
      throw new Error('XMLHttpRequest is disabled');
    }
    this.request.open(
      'GET',
      `https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/sub/seriesgroup=${seriesGroup}/info`,
      true
    );
    this.request.setRequestHeader('Authorization', `Bearer ${this.props.token}`);
    this.request.responseType = 'application/json';
    this.request.onload = this.handleAdditionalVesselDetails.bind(this);
    this.request.send(null);
  }

  /**
   * Displays the currently selected vessel details on the corresponding panel
   * Triggers additional vessel details loading.
   *
   * @param vesselInfo
   */
  showVesselDetails(vesselInfo) {
    const currentVesselInfo = {
      series: vesselInfo.series,
      seriesGroup: vesselInfo.seriesgroup,
      latitude: vesselInfo.latitude,
      longitude: vesselInfo.longitude,
      weight: vesselInfo.weight,
      timestamp: vesselInfo.timestamp
    };

    this.setState({ currentVesselInfo });
    this.loadAdditionalVesselDetails(vesselInfo.seriesgroup);
  }

  /**
   * Detects and handles map clicks
   * Detects collisions with current vessel data
   * Draws tracks and loads vessel details
   *
   * @param event
   */
  onClickMap(event) {
    const clickLat = ~~event.latLng.lat();
    const clickLong = ~~event.latLng.lng();

    const vesselInfo = this.state.overlay.getVesselAtLocation(clickLat, clickLong);

    if (this.state.trajectory) {
      this.state.trajectory.setMap(null);
    }
    this.props.getSeriesGroup(vesselInfo.seriesgroup, vesselInfo.series, this.props.filters);

    if (vesselInfo) {
      this.showVesselDetails(vesselInfo);
      this.props.getSeriesGroup(vesselInfo.seriesgroup, vesselInfo.series, this.props.filters);
    } else if (this.state.trajectory) {
      this.setState({ currentVesselInfo: {} });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.map) {
      return;
    }

    const newInnerExtent = nextProps.filters.timelineInnerExtent;
    if (extentChanged(newInnerExtent, this.props.filters.timelineInnerExtent)) {
      this.state.overlay.drawTimeRange(newInnerExtent[0].getTime(), newInnerExtent[1].getTime());
    } else {
      this.updateLayersState(nextProps);
      this.updateFiltersState(nextProps);
      this.updateTrackLayer(nextProps);
    }
  }

  updateTrackLayer(nextProps) {
    if (this.props.map.track !== nextProps.map.track) {
      let trackLayer = this.state.trackLayer;
      if (!trackLayer) {
        const Overlay = createTrackLayer(google);
        trackLayer = new Overlay(
          this.refs.map.props.map,
          this.refs.mapContainer.offsetWidth,
          this.refs.mapContainer.offsetHeight
        );
        this.setState({ trackLayer });
      }
      trackLayer.regenerate();
      trackLayer.drawTile(nextProps.map.track.seriesGroupData, nextProps.map.track.selectedSeries, nextProps.filters);
    }
  }

  /**
   * Handles and propagates filters changes
   *
   * @param nextProps
   */
  updateFiltersState(nextProps) {
    let currentTimestamp = this.state.currentTimestamp;

    if (nextProps.filters.startDate > this.state.currentTimestamp) {
      currentTimestamp = nextProps.filters.startDate;
    }
    if (nextProps.filters.endDate < this.state.currentTimestamp) {
      currentTimestamp = nextProps.filters.endDate;
    }

    if (currentTimestamp !== this.state.currentTimestamp) {
      this.setState({ currentTimestamp });
    }

    this.updatePlaybackBar(
      nextProps.filters.startDate,
      nextProps.filters.endDate,
      currentTimestamp,
      this.state.playbackRange
    );

    if (this.state.overlay && this.props.filters !== nextProps.filters) {
      this.state.overlay.updateFilters(nextProps.filters);
      if (this.state.trackLayer) {
        this.state.trackLayer.regenerate();
        this.state.trackLayer.drawTile(
          this.props.map.track.seriesGroupData,
          this.props.map.track.selectedSeries,
          nextProps.filters
        );
      }
    }
  }

  /**
   * Handles and propagates layers changes
   * @param nextProps
   */
  updateLayersState(nextProps) {
    const currentLayers = this.props.map.layers;
    const newLayers = nextProps.map.layers;
    const addedLayers = this.state.addedLayers;
    const promises = [];

    let callAddVesselLayer = null;
    if (newLayers !== currentLayers) {
      for (let index = 0, length = newLayers.length; index < length; index++) {
        const newLayer = newLayers[index];
        if (!addedLayers[newLayer.title]) {
          if (!newLayer.visible) {
            continue;
          }
          if (newLayer.type === 'ClusterAnimation') {
            callAddVesselLayer = this.addVesselLayer.bind(this, newLayer, nextProps.filters);
          } else {
            promises.push(this.addCartoLayer(newLayer));
          }
        } else {
          this.toggleLayerVisibility(newLayer);
        }
      }
    }

    Promise.all(promises).then((() => {
      if (callAddVesselLayer) {
        callAddVesselLayer();
      }
      this.setState({ addedLayers });
    }).bind(this));
  }

  /**
   * Creates vessel track layer
   *
   * @param layerSettings
   */
  addVesselLayer(layerSettings) {
    console.log('addVesselLayer')
    const canvasLayer = new CanvasLayer(layerSettings.zIndex, this.map, this.props.token, this.props.filters, this.state.vesselLayerTransparency, layerSettings.visible);
    this.setState({ overlay: canvasLayer });
    this.state.addedLayers[layerSettings.title] = canvasLayer;
  }

  /**
   * Creates a Carto-based layer
   *
   * @returns {Promise}
   * @param layerSettings
   */
  addCartoLayer(layerSettings) {
    const addedLayers = this.state.addedLayers;

    const promise = new Promise(((resolve) => {
      cartodb.createLayer(map, layerSettings.source.args.url)
        .addTo(map, layerSettings.zIndex)
        .done(((layer, cartoLayer) => {
          addedLayers[layer.title] = cartoLayer;
          resolve();
        }).bind(this, layerSettings));
    }).bind(this));
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
      if (layers[layerSettings.title].isVisible()) {
        return;
      }
      if (layerSettings.type === 'ClusterAnimation') {
        this.state.overlay.show();
      } else {
        layers[layerSettings.title].show();
      }
    } else {
      if (!layers[layerSettings.title].isVisible()) {
        return;
      }
      if (layerSettings.type === 'ClusterAnimation') {
        this.state.overlay.hide();
      } else {
        layers[layerSettings.title].hide();
      }
    }
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
    if (this.state.lastCenter === null) {
      this.lastValidCenter = this.map.getCenter();
    }
  }

  onDragEnd() {
    if (!this.map) {
      return;
    }
    if (this.state.trackLayer) {
      this.state.trackLayer.recalculatePosition();

      this.state.trackLayer.drawTile(
        this.props.map.track.seriesGroupData,
        this.props.map.track.selectedSeries,
        this.props.filters
      );
    }
    const center = this.map.getCenter();

    if (strictBounds.contains(center)) {
      this.state.lastCenter = center;
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
    }
  }

  /**
   * Triggered when the user updates the vessel data pickers
   * Has special handling for startDate/endDate
   *
   * @param target Name of the filter
   * @param value New value of the filter
   */
  updateFilters(target, value) {
    const filters = this.props.filters;
    let filterValue = value;

    if (target === 'startDate') {
      filterValue = new Date(filterValue).getTime();
      if (filterValue >= filters.endDate) {
        return;
      }
      if (this.state.currentTimestamp < filterValue) {
        this.setState({ currentTimestamp: filterValue });
      }
    } else if (target === 'endDate') {
      filterValue = new Date(filterValue).getTime();
      if (filterValue <= filters.startDate) {
        return;
      }
      if (this.state.currentTimestamp > filterValue) {
        this.setState({ currentTimestamp: filterValue });
      }
    }

    filters[target] = filterValue;

    this.props.updateFilters(filters);
    if (this.state.trackLayer) {
      this.props.getSeriesGroup(this.props.map.track.seriesgroup, this.props.map.track.selectedSeries, filters);
    }
  }

  /**
   * Handles changes to the playback range
   *
   * @param playbackRange
   */
  updatePlaybackRange(playbackRange) {
    this.setState({ playbackRange });

    if (this.state.running === 'pause') {
      this.drawVesselFrame(this.state.currentTimestamp, playbackRange);
    }

    this.updatePlaybackBar(this.props.filters.startDate, this.props.filters.endDate, this.state.currentTimestamp, playbackRange);
  }

  updatePlaybackBar(startDate, endDate, initialTimestamp, playbackRange) {
    const finalTimestamp = initialTimestamp + (TIMELINE_STEP * playbackRange);

    const leftHandlerPosition = (initialTimestamp - startDate) / (endDate - startDate) * 100;
    const timeBarWidth = ((TIMELINE_STEP * playbackRange)) / (endDate - startDate) * 100;
    const rightHandlerPosition = (finalTimestamp - startDate) / (endDate - startDate) * 100;

    this.setState({
      leftHandlerPosition: `${leftHandlerPosition}%`,
      rightHandlerPosition: `${rightHandlerPosition}%`,
      timeBarWidth: `${timeBarWidth}%`
    });
  }

  /**
   * Handles changes
   *
   * @param vesselLayerTransparency
   */
  updateVesselLayerDensity(vesselLayerTransparency) {
    this.setState({ vesselLayerTransparency });
    this.state.overlay.vesselLayerTransparency = vesselLayerTransparency;

    if (this.state.running !== 'play') {
      this.state.overlay.refresh();
    }
  }

  /**
   * Open the modal to share the map
   */
  shareMap() {
    this.setState({ shareModalOpened: true });
  }

  /**
   * Callback called when the share modal is closed
   */
  onShareModalClose() {
    this.setState({ shareModalOpened: false });
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
    if (this.state.trackLayer) {
      this.state.trackLayer.regenerate();
      this.state.trackLayer.drawTile(
        this.props.map.track.seriesGroupData,
        this.props.map.track.selectedSeries,
        this.props.filters
      );
    }
  }

  /**
   * Big scary map rendering method
   * TODO: see if we can split this up into multiple React components or, if not, split up into multiple render methods
   *
   * @returns {XML}
   */
  render() {
    return (<div>
      <Modal opened={this.state.shareModalOpened} close={() => this.onShareModalClose()}>
        <Share />
      </Modal>
      <Header />
      <div className={map.map_container} ref="mapContainer">

        <div className={map.zoom_controls}>
          <span id="share_map" onClick={this.shareMap}>S</span>
          <span id="zoom_up" onClick={this.changeZoomLevel}>+</span>
          <span id="zoom_down" onClick={this.changeZoomLevel}>-</span>
        </div>
        <div className={map.timeline2_container}>
          <Timeline />
        </div>
        <div className={map.timeline_container}>
          <div className={map.time_controls}>
            <button onClick={this.playbackStart} className={map.timeline}>
              {this.state.running !== 'play'
                ? 'Play ►'
                : 'Pause ||'}
            </button>
            <button onClick={this.playbackStop} className={map.timelineStop}>Stop</button>
          </div>
          <div className={map.date_inputs}>
            <label htmlFor="mindate">
              Start date
              <input
                type="date"
                id="mindate"
                value={new Date(this.props.filters.startDate).toISOString().slice(0, 10)}
                onChange={(e) => this.updateFilters('startDate', e.currentTarget.value)}
              />
            </label>
            <label htmlFor="maxdate">
              End date
              <input
                type="date"
                id="maxdate"
                value={new Date(this.props.filters.endDate).toISOString().slice(0, 10)}
                onChange={(e) => this.updateFilters('endDate', e.currentTarget.value)}
              />
            </label>
          </div>

          <div className={map.range_container}>
            <Draggable axis="x" zIndex={100} onStop={this.handlerMoved.bind(this, 1)}>
              <span
                className={map.handler_grab}
                id="dateHandlerLeft"
                style={{
                  left: this.state.leftHandlerPosition
                }}
              >
                <i />
              </span>
            </Draggable>
            <span
              className={map.tooltip}
              id="timeline_tooltip"
              style={{ left: this.state.rightHandlerPosition }}
            >
            {new Date(this.state.currentTimestamp).toISOString().slice(0, 10)}
            </span>

            <Draggable
              axis="x"
              zIndex={100}
              onStop={this.handlerMoved.bind(this, 2)}
            >
              <span
                className={[map.handler_grab, map.right].join(' ')}
                id="dateHandlerRight"
                style={{ left: this.state.rightHandlerPosition }}
              >
                <i />
              </span>
            </Draggable>
            <span className={map.timeline_range}>
              <span
                className={map.handle}
                id="timeline_handler"
                style={{
                  left: this.state.leftHandlerPosition,
                  width: this.state.timeBarWidth
                }}
              />
            </span>
          </div>
        </div>
        <LayerPanel
          layers={this.props.map.layers}
          onLayerToggle={this.toggleLayerVisibility}
          onFilterChange={this.updateFilters}
          onTimeStepChange={this.updatePlaybackRange}
          onDrawDensityChange={this.updateVesselLayerDensity}
          startDate={this.props.filters.startDate} endDate={this.props.filters.endDate}
        />
        <VesselPanel vesselInfo={this.state.currentVesselInfo} />
        <GoogleMapLoader
          containerElement={
            <div className={map.map} style={{ height: '100%' }} />
          }
          googleMapElement={
            <GoogleMap
              ref="map"
              zoom={this.props.map.zoom}
              defaultZoomControl={false}
              center={{ lat: this.props.map.center[0], lng: this.props.map.center[1] }}
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
    </div>);
  }
}

Map.propTypes = {
  filters: React.PropTypes.object,
  token: React.PropTypes.string,
  setZoom: React.PropTypes.func,
  getWorkspace: React.PropTypes.func,
  getSeriesGroup: React.PropTypes.func,
  updateFilters: React.PropTypes.func,
  toggleLayerVisibility: React.PropTypes.func,
  setCenter: React.PropTypes.func,
  map: React.PropTypes.object
};

export default Map;
