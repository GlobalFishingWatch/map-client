'use strict';

import React, {Component} from "react";
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import {TIMELINE_MIN_DATE, TIMELINE_STEP} from "../constants";
import Draggable from "react-draggable";
import CanvasLayer from "./layers/canvas_layer";
import LayerPanel from "./map/layer_panel";
import FiltersPanel from "./map/filters_panel";
import VesselPanel from "./map/vessel_panel";
import ControlPanel from "./map/control_panel";
import Header from "../containers/header";
import map from "../../styles/index.scss";

const minZoomLevel = 2;
const maxZoomLevel = 12;
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
      vesselLayerDensity: 1,
      currentVesselInfo: {}
    };
  }

  onZoomChanged() {
    const zoom = this.refs.map.props.map.getZoom();
    if (zoom < minZoomLevel) {
      this.refs.map.props.map.setZoom(minZoomLevel);
    }
    if (zoom > maxZoomLevel) {
      this.refs.map.props.map.setZoom(maxZoomLevel);
    }
    this.setState({zoom: zoom});
    this.state.overlay.resetData();
  }

  moveTimeline(event) {
    this.timelinerange = document.getElementById('timeline_handler');
    this.playbackStart(this.timelinerange.style.width = (event.clientX - 60) + 'px');
  }

  handlerMoved(tick, event) {
    let target = null;
    let startDate = this.state.filters.startDate;
    let endDate = this.state.filters.endDate;

    const timelineScope = document.getElementById('timeline_handler').parentElement;
    const absMaxMoment = new Date(endDate).getTime() - new Date(startDate).getTime();
    if (tick === 1) {
      target = document.getElementById('dateHandlerLeft');
    } else {
      target = document.getElementById('dateHandlerRight');
    }
    let percentage = ((target.getBoundingClientRect().left - timelineScope.getBoundingClientRect().left) * 100) / timelineScope.offsetWidth;

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
      this.animateMapData(this.state.currentTimestamp || this.state.filters.startDate, mDay);
    }.bind(this));
  }

  animateMapData(drawInitialTimestamp) {
    if (!this.state.running) return;
    if (!this.state.overlay) return;
    if (this.state.trajectory) {
      this.state.trajectory.setMap(null)
    }

    drawInitialTimestamp = drawInitialTimestamp || 0;
    let drawFinalTimestamp = drawInitialTimestamp + (TIMELINE_STEP * this.state.playbackLength);
    let startDate = this.props.filters.startDate;
    let endDate = this.props.filters.endDate;

    if (drawFinalTimestamp > endDate) {
      this.setState({
        running: !!!this.state.running,
      });
      this.playbackStop();
      return;
    }
    let width = (drawInitialTimestamp - startDate) / (endDate - startDate) * 100;
    this.setState({
      widthRange: width + '%',
      currentTimestamp: drawInitialTimestamp
    });

    this.state.overlay.drawTimeRange(drawInitialTimestamp, drawFinalTimestamp);
    let animationID = requestAnimationFrame(function () {
      this.animateMapData(drawInitialTimestamp + mDay);
    }.bind(this));
    this.setState({'animationID': animationID});
  }

  playbackStop() {
    let filters = this.props.filters;
    cancelAnimationFrame(this.state.animationID);
    this.state.overlay.updateFilters(filters);
    this.state.overlay.drawTimeRange(filters.startDate, filters.endDate);
    this.setState({running: null, currentTimestamp: filters.startDate, widthRange: 0});
  }

  onIdle() {
  }

  handleLoadedVesselInfo(data) {
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

  findSeriesPositions(vesselInfo) {
    const tiles = this.state.overlay.playbackData;
    let series = vesselInfo.series
    let positions = [];

    this.getVesselDetails(vesselInfo);

    for (var tile in tiles) {
      for (var timestamp in tiles[tile]) {
        for (var i = 0; i < tiles[tile][timestamp].latitude.length; i++) {
          if (tiles[tile][timestamp].series[i] == series) {
            positions.push({
              'lat': tiles[tile][timestamp].latitude[i],
              'lng': tiles[tile][timestamp].longitude[i]
            });

          }
        }
      }
    }
    if (this.state.trajectory) {
      this.state.trajectory.setMap(null)
    }
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

  loadVesselDetails(seriesGroup) {
    if (typeof XMLHttpRequest != 'undefined') {
      this.request = new XMLHttpRequest();
    } else {
      throw 'XMLHttpRequest is disabled';
    }
    this.request.open('GET', 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/sub/seriesgroup=' + seriesGroup + '/info', true);
    this.request.setRequestHeader("Authorization", `Bearer ${this.props.token}`);
    this.request.responseType = "application/json";
    this.request.onload = this.handleLoadedVesselInfo.bind(this);
    this.request.onerror = this.handleLoadedVesselInfo.bind(this);
    this.request.send(null);
  }

  getVesselDetails(vesselInfo) {
    let currentVesselInfo = {
      series: vesselInfo.series,
      seriesGroup: vesselInfo.seriesgroup,
      latitude: vesselInfo.latitude,
      longitude: vesselInfo.longitude,
      weight: vesselInfo.weight
    };

    this.setState({currentVesselInfo: currentVesselInfo})
    this.loadVesselDetails(vesselInfo.seriesgroup)
  }

  onClickMap(event) {
    let clickLat = ~~event.latLng.lat();
    let clickLong = ~~event.latLng.lng();

    let vesselInfo = this.state.overlay.getVesselAtLocation(clickLat, clickLong);
    if (vesselInfo) {
      this.findSeriesPositions(vesselInfo);
    } else {
      this.state.trajectory.setMap(null);
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

    let currentLayers = this.props.map.layers;
    let newLayers = nextProps.map.layers;
    const addedLayers = this.state.addedLayers;
    const map = this.refs.map.props.map
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
            promises.push(this.addCartoLayer(map, newLayer, addedLayers));
          }
        } else {
          this.toggleLayerVisibility(newLayer, addedLayers);
        }
      }
    }

    Promise.all(promises).then(function () {
      if (callAddVesselLayer) {
        callAddVesselLayer();
      }
      this.setState({addedLayers: addedLayers});
    }.bind(this));

    if (this.state.overlay) {
      this.state.overlay.refresh();
    }
  }

  addVesselLayer(layer, filters) {
    const canvasLayer = new CanvasLayer(layer.zIndex, this.refs.map.props.map, this.props.token, filters, this.state.vesselLayerDensity, layer.visible);
    this.setState({overlay: canvasLayer});
    this.state.addedLayers[layer.title] = canvasLayer;
  }

  addCartoLayer(map, newLayer, addedLayers) {
    let promise = new Promise(function (resolve, reject) {
      cartodb.createLayer(map, newLayer.source.args.url).addTo(map, newLayer.zIndex).done(function (layer, cartoLayer) {
        addedLayers[layer.title] = cartoLayer;
        resolve();
      }.bind(this, newLayer));
    }.bind(this));
    return promise;
  }

  toggleLayerVisibility(newLayer, addedLayers) {
    if (newLayer.visible) {
      if (addedLayers[newLayer.title].isVisible()) {
        return;
      }
      if (newLayer.type === 'ClusterAnimation') {
        this.state.overlay.show();
      } else {
        addedLayers[newLayer.title].show();
      }
    } else {
      if (!addedLayers[newLayer.title].isVisible()) {
        return;
      }
      if (newLayer.type === 'ClusterAnimation') {
        this.state.overlay.hide();
      } else {
        addedLayers[newLayer.title].hide();
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
   * Triggered when the user updates the start or end dates of the slider/datepickers
   *
   * @param target startDate/endDate
   * @param value
   */
  updateFilters(target, value) {
    let filters = this.props.filters;
    let newDateValue = new Date(value).getTime();
    let currentTimestamp = this.state.currentTimestamp

    if (target === 'startDate') {
      if (newDateValue >= filters['endDate']) {
        return;
      }
      value = new Date(value).getTime();
      if (currentTimestamp < value) {
        this.setState({currentTimestamp: newDateValue});
      }
    }
    if (target === 'endDate' && newDateValue <= filters['startDate']) {
      if (newDateValue >= filters['endDate']) {
        return;
      }
      value = new Date(value).getTime();
      if (currentTimestamp > newDateValue) {
        this.setState({currentTimestamp: newDateValue});
      }
    }

    filters[target] = value;
    this.props.updateFilters(filters);
  }

  updatePlaybackRange(range) {
    this.setState({playbackLength: range});
  }

  updateVesselLayerDensity(vesselLayerDensity) {
    this.setState({vesselLayerDensity: vesselLayerDensity});
    this.state.overlay.vesselLayerDensity = vesselLayerDensity;

    if (!this.state.running) {
      this.state.overlay.refresh();
    }
  }

  shareMap(event) {
    alert('TODO: share map');
  }

  changeZoomLevel(ev) {
    this.refs.map.props.map.setZoom((ev.target.id === 'zoom_up') ? this.refs.map.props.map.getZoom() + 1 : this.refs.map.props.map.getZoom() - 1);
  }

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
              <span className={map.handler_grab} id="dateHandlerLeft"><i></i></span>
            </Draggable>
            <span className={map.tooltip} id="timeline_tooltip" style={{left: this.state.widthRange}}>
              {new Date(this.state.currentTimestamp).toISOString().slice(0, 10)}
            </span>

            <Draggable
              axis="x"
              zIndex={100}
              onStop={this.handlerMoved.bind(this, 2)}>
              <span className={[map.handler_grab, map.right].join(' ')} id="dateHandlerRight"
                    style={{left: this.state.widthRange}}><i></i></span>
            </Draggable>
            <span className={map.timeline_range}>
              <span className={map.handle} id="timeline_handler" style={{width: this.state.widthRange}}></span>
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
              onIdle={this.onIdle.bind(this)}
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
