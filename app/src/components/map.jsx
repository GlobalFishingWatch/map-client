'use strict';

import React, {Component} from "react";
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import {TIMELINE_MIN_DATE, TIMELINE_STEP, MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL} from "../constants";
import Draggable from "react-draggable";
import CanvasLayer from "./layers/canvas_layer";
import LayerPanel from "./map/layer_panel";
import FiltersPanel from "./map/filters_panel";
import VesselPanel from "./map/vessel_panel";
import ControlPanel from "./map/control_panel";
import Header from "../containers/header";
import map from "../../styles/index.scss";

const mDay = 86400000;
const strictBounds = new google.maps.LatLngBounds(
  new google.maps.LatLng(-85, -180),
  new google.maps.LatLng(85, 180)
);

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlay: null,
      addedLayers: [],
      currentTimestamp: TIMELINE_MIN_DATE,
      lastCenter: null,
      playbackLength: 1,
      vesselLayerTransparency: 1,
      currentVesselInfo: {},

      leftHandlerPosition: 0,
      rightHandlerPosition: 0,
      timeBarWidth: 0,
    };
  }

  /**
   * Zoom change handler
   * Enforces min and max zoom levels
   * Resets vessel layer data on change
   */
  onZoomChanged() {
    const zoom = this.refs.map.props.map.getZoom();
    if (zoom < MIN_ZOOM_LEVEL) {
      this.refs.map.props.map.setZoom(MIN_ZOOM_LEVEL);
    }
    if (zoom > MAX_ZOOM_LEVEL) {
      this.refs.map.props.map.setZoom(MAX_ZOOM_LEVEL);
    }
    this.setState({zoom: zoom});
    this.state.overlay.resetPlaybackData();
  }

  /**
   * TODO: review
   *
   * @param event
   */
  moveTimeline(event) {
    this.timelinerange = document.getElementById('timeline_handler');
    this.playbackStart(this.timelinerange.style.width = (event.clientX - 60) + 'px');
  }

  /**
   * Handles drag+drop of the time slider handles
   * TODO: review
   *
   * @param tick
   * @param event
   */
  handlerMoved(tick, event) {
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
    this.setState({currentTimestamp: startDate});
    this.state.overlay.updateFilters(this.props.filters);
    document.getElementById('mindate').value = new Date(startDate).toISOString().slice(0, 10);
    document.getElementById('maxdate').value = new Date(endDate).toISOString().slice(0, 10);
  }

  /**
   * Executed when the user presses the "Play" button
   */
  playbackStart() {
    this.timelinerange = document.getElementById('timeline_handler');

    this.setState({
      running: !!!this.state.running
    });
    requestAnimationFrame(function () {
      this.drawVesselFrame(this.state.currentTimestamp || this.props.filters.startDate, mDay);
    }.bind(this));
  }

  /**
   * Draws a single frame during playback mode
   * Each frame may represent multiple days of data
   * Recursively calls itself to animate the following frams
   *
   * Handles time slider animation
   * Calculates initial and final vessel timestamp, and calls vessel layer rendering.
   *
   * @param initialTimestamp Initial timestamp to be drawn
   */
  drawVesselFrame(initialTimestamp) {
    if (!this.state.running) return;
    if (!this.state.overlay) return;

    initialTimestamp = initialTimestamp || 0;
    const finalTimestamp = initialTimestamp + (TIMELINE_STEP * this.state.playbackLength);
    const startDate = this.props.filters.startDate;
    const endDate = this.props.filters.endDate;

    if (finalTimestamp > endDate) {
      this.setState({
        running: !!!this.state.running,
      });
      this.playbackStop();
      return;
    }
    const leftHandlerPosition = (initialTimestamp - startDate) / (endDate - startDate) * 100;
    const timeBarWidth = ((TIMELINE_STEP * this.state.playbackLength)) / (endDate - startDate) * 100;
    const rightHandlerPosition = (finalTimestamp - startDate) / (endDate - startDate) * 100;

    this.setState({
      leftHandlerPosition: leftHandlerPosition + '%',
      rightHandlerPosition: rightHandlerPosition + '%',
      timeBarWidth: timeBarWidth + '%',
      currentTimestamp: initialTimestamp
    });

    this.state.overlay.drawTimeRange(initialTimestamp, finalTimestamp);
    const animationID = requestAnimationFrame(function () {
      this.drawVesselFrame(initialTimestamp + mDay);
    }.bind(this));
    this.setState({'animationID': animationID});
  }

  /**
   * Handles playback stop
   * Called when playback ends or user interrupts it using the "Stop" button
   */
  playbackStop() {
    const filters = this.props.filters;
    cancelAnimationFrame(this.state.animationID);

    const timeBarWidth = ((TIMELINE_STEP * this.state.playbackLength)) / (filters.endDate - filters.startDate) * 100;

    this.state.overlay.updateFilters(filters);
    this.state.overlay.drawTimeRange(filters.startDate, filters.endDate);
    this.setState({
      running: null,
      currentTimestamp: filters.startDate,
      leftHandlerPosition: '0%',
      rightHandlerPosition: timeBarWidth + '%',
      timeBarWidth: timeBarWidth + '%',
    });
  }

  /**
   * Called once additional vessel details are loaded
   * TODO: should probably be moved elsewhere
   *
   * @param data Data returned by the API
   */
  handleAdditionalVesselDetails(data) {
    let currentVesselInfo = this.state.currentVesselInfo;

    data = JSON.parse(data.target.response);
    currentVesselInfo.callsign = data.callsign;
    currentVesselInfo.flag = data.flag;
    currentVesselInfo.imo = data.imo;
    currentVesselInfo.mmsi = data.mmsi;
    currentVesselInfo.name = data.vesselname;

    this.setState({
      currentVesselInfo: currentVesselInfo
    })
  }

  /**
   * Draws a line that connects by timestamp order all paths of the following vessel
   * Triggers the rendering of the vessel info panel
   * TODO: this needs to be reimplemented using data from the series group API
   *
   * @param vesselInfo
   */
  drawSeriesPath(vesselInfo) {
    const positions = this.state.overlay.getAllPositionsBySeries(vesselInfo.series);

    this.setState({
      trajectory: new google.maps.Polyline({
        path: positions,
        geodesic: false,
        strokeColor: '#1181fb',
        strokeOpacity: 1.0,
        strokeWeight: 2
      })
    })
    this.state.trajectory.setMap(this.refs.map.props.map);
  }

  /**
   * Given a series group ID, loads additional info for that vessel
   * Used to display additional data on the vessel details panel
   * TODO: should probably be moved elsewhere
   *
   * @param seriesGroup
   */
  loadAdditionalVesselDetails(seriesGroup) {
    if (typeof XMLHttpRequest != 'undefined') {
      this.request = new XMLHttpRequest();
    } else {
      throw 'XMLHttpRequest is disabled';
    }
    this.request.open('GET', 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/sub/seriesgroup=' + seriesGroup + '/info', true);
    this.request.setRequestHeader("Authorization", `Bearer ${this.props.token}`);
    this.request.responseType = "application/json";
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

    this.setState({currentVesselInfo: currentVesselInfo})
    this.loadAdditionalVesselDetails(vesselInfo.seriesgroup)
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

    if (vesselInfo) {
      this.showVesselDetails(vesselInfo);
      this.drawSeriesPath(vesselInfo);
    } else if (this.state.trajectory) {
      this.setState({currentVesselInfo: {}})
    }
  }

  componentDidMount() {
    this.props.getLayers();
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.map) {
      return;
    }
    this.updateLayersState(nextProps);
    this.updateFiltersState(nextProps);
  }

  /**
   * Handles and propagates filters changes
   *
   * @param nextProps
   */
  updateFiltersState(nextProps) {
    if (this.state.overlay) {
      this.state.overlay.updateFilters(nextProps.filters);
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
    let promises = [];

    let callAddVesselLayer = null;
    if (newLayers !== currentLayers) {
      for (let index = 0, length = newLayers.length; index < length; index++) {
        let newLayer = newLayers[index];
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

    Promise.all(promises).then(function () {
      if (callAddVesselLayer) {
        callAddVesselLayer();
      }
      this.setState({addedLayers: addedLayers});
    }.bind(this));
  }

  /**
   * Creates vessel track layer
   *
   * @param layerSettings
   */
  addVesselLayer(layerSettings) {
    const canvasLayer = new CanvasLayer(layerSettings.zIndex, this.refs.map.props.map, this.props.token, this.props.filters, this.state.vesselLayerTransparency, layerSettings.visible);
    this.setState({overlay: canvasLayer});
    this.state.addedLayers[layerSettings.title] = canvasLayer;
  }

  /**
   * Creates a Carto-based layer
   *
   * @param map
   * @returns {Promise}
   */
  addCartoLayer(layerSettings) {
    const map = this.refs.map.props.map
    const addedLayers = this.state.addedLayers;

    let promise = new Promise(function (resolve, reject) {
      cartodb.createLayer(map, layerSettings.source.args.url).addTo(map, layerSettings.zIndex).done(function (layer, cartoLayer) {
        addedLayers[layer.title] = cartoLayer;
        resolve();
      }.bind(this, layerSettings));
    }.bind(this));
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

  onMouseMove(event) {
    this.refs.map.props.map.setOptions({draggableCursor: 'default'});
  }

  onDragStart(event) {
    if (this.state.lastCenter === null) this.lastValidCenter = this.refs.map.props.map.getCenter();
  }

  onDragEnd(event) {
    if (strictBounds.contains(this.refs.map.props.map.getCenter())) {
      this.state.lastCenter = this.refs.map.props.map.getCenter();
      return;
    }
    this.refs.map.props.map.panTo(this.state.lastCenter);
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

    if (target === 'startDate') {
      value = new Date(value).getTime();
      if (value >= filters.endDate) {
        return;
      }
      if (this.state.currentTimestamp < value) {
        this.setState({currentTimestamp: value});
      }
    } else if (target === 'endDate') {
      value = new Date(value).getTime();
      if (value <= filters['startDate']) {
        return;
      }
      if (this.state.currentTimestamp > value) {
        this.setState({currentTimestamp: value});
      }
    }

    filters[target] = value;

    this.props.updateFilters(filters);
  }

  /**
   * Handles changes to the playback range
   *
   * @param range
   */
  updatePlaybackRange(range) {
    const filters = this.props.filters;
    const timeBarWidth = ((TIMELINE_STEP * range)) / (filters.endDate - filters.startDate) * 100;

    this.setState({playbackLength: range, timeBarWidth: timeBarWidth + '%', rightHandlerPosition: timeBarWidth + '%'});
  }

  /**
   * Handles changes
   *
   * @param vesselLayerTransparency
   */
  updateVesselLayerDensity(vesselLayerTransparency) {
    this.setState({vesselLayerTransparency: vesselLayerTransparency});
    this.state.overlay.vesselLayerTransparency = vesselLayerTransparency;

    if (!this.state.running) {
      this.state.overlay.refresh();
    }
  }

  shareMap(event) {
    alert('TODO: share map');
  }

  /**
   * Handles clicks on the +/- buttons that manipulate the map zoom
   *
   * @param event
   */
  changeZoomLevel(event) {
    const map = this.refs.map.props.map;
    const newZoomLevel = (event.target.id === 'zoom_up') ? map.getZoom() + 1 : map.getZoom() - 1

    map.setZoom(newZoomLevel);
  }

  /**
   * Big scary map rendering method
   * TODO: see if we can split this up into multiple React components or, if not, split up into multiple render methods
   *
   * @returns {XML}
   */
  render() {
    return <div>
      <header className={map.c_header}>
        <Header></Header>
      </header>
      <div className={map.map_container}>
        <div className={map.zoom_controls}>
          <span id="share_map" onClick={this.shareMap.bind(this)}>S</span>
          <span id="zoom_up" onClick={this.changeZoomLevel.bind(this)}>+</span>
          <span id="zoom_down" onClick={this.changeZoomLevel.bind(this)}>-</span>
        </div>
        <div className={map.timeline_container}>
          <div className={map.time_controls}>
            <button onClick={this.playbackStart.bind(this)} className={map.timeline}>
              {!this.state || !this.state.running ? "Play ►" : "Pause ||"}
            </button>
            <button onClick={this.playbackStop.bind(this)} className={map.playbackStop}>Stop</button>
          </div>
          <div className={map.date_inputs}>
            <label for="mindate">
              Start date
              <input type="date" id="mindate" value={new Date(this.props.filters.startDate).toISOString().slice(0, 10)}
                     onChange={(e) => this.updateFilters('startDate', e.currentTarget.value)}/>
            </label>
            <label for="maxdate">
              End date
              <input type="date" id="maxdate" value={new Date(this.props.filters.endDate).toISOString().slice(0, 10)}
                     onChange={(e) => this.updateFilters('endDate', e.currentTarget.value)}/>
            </label>
          </div>
          <div className={map.range_container}>
            <Draggable
              axis="x"
              zIndex={100}
              onStop={this.handlerMoved.bind(this, 1)}>
              <span className={map.handler_grab} id="dateHandlerLeft"
                    style={{left: this.state.leftHandlerPosition}}><i></i></span>
            </Draggable>
            <span className={map.tooltip} id="timeline_tooltip" style={{left: this.state.rightHandlerPosition}}>
              {new Date(this.state.currentTimestamp).toISOString().slice(0, 10)}
            </span>

            <Draggable
              axis="x"
              zIndex={100}
              onStop={this.handlerMoved.bind(this, 2)}>
              <span className={[map.handler_grab, map.right].join(' ')} id="dateHandlerRight"
                    style={{left: this.state.rightHandlerPosition}}><i></i></span>
            </Draggable>
            <span className={map.timeline_range}>
              <span className={map.handle} id="timeline_handler"
                    style={{left: this.state.leftHandlerPosition, width: this.state.timeBarWidth}}></span>
            </span>
          </div>
        </div>
        <LayerPanel layers={this.props.map.layers} onToggle={this.props.toggleLayerVisibility.bind(this)}/>
        <FiltersPanel onChange={this.updateFilters.bind(this)}/>
        <ControlPanel onTimeStepChange={this.updatePlaybackRange.bind(this)}
                      onDrawDensityChange={this.updateVesselLayerDensity.bind(this)}
                      startDate={this.props.filters.startDate} endDate={this.props.filters.endDate}/>
        <VesselPanel vesselInfo={this.state.currentVesselInfo}/>
        <GoogleMapLoader
          containerElement={
            <div className={map.map} style={{height: "100%",}}/>
          }
          googleMapElement={
            <GoogleMap
              ref="map"
              defaultZoom={3}
              defaultZoomControl={false}
              defaultCenter={{lat: 0, lng: 0}}
              defaultOptions={{
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: false
              }}
              defaultMapTypeId={google.maps.MapTypeId.SATELLITE}
              onClick={this.onClickMap.bind(this)}
              onMousemove={this.onMouseMove.bind(this)}
              onZoomChanged={this.onZoomChanged.bind(this)}
              onDragstart={this.onDragStart.bind(this)}
              onDragend={this.onDragEnd.bind(this)}>
            </GoogleMap>
          }>
        </GoogleMapLoader>
      </div>
    </div>
  }

}

export default Map;
