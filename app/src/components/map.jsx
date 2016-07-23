'use strict';

import React, {Component} from "react";
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import {TIMELINE_MIN_DATE, TIMELINE_MAX_DATE} from "../constants";
import Draggable from "react-draggable";
import CanvasLayer from "./layers/canvasLayer";
import LayerPanel from "./layerPanel";
import FiltersPanel from "./filtersPanel";
import VesselPanel from "./vesselPanel";
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
      filters: {
        startDate: TIMELINE_MIN_DATE,
        endDate: TIMELINE_MAX_DATE,
        flag: ''
      }
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
    this.state.overlay.hide();
    this.state.overlay.applyFilters({'timeline': [startDate, endDate]});
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
      this.animateMapData(this.state.currentTimestamp || this.stats.filters.startDate, mDay);
    }.bind(this));
  }

  animateMapData(currentTimestamp) {
    if (!this.state.running) return;
    if (!this.state.overlay) return;
    if (this.state.trajectory) {
      this.state.trajectory.setMap(null)
    }

    currentTimestamp = currentTimestamp || 0;
    let startDate = this.state.filters.startDate;
    let endDate = this.state.filters.endDate;

    if (currentTimestamp > endDate) {
      this.setState({
        running: !!!this.state.running,
      });
      this.timelineStop();
      return;
    }
    let width = (currentTimestamp - startDate) / (endDate - startDate) * 100;
    this.setState({
      widthRange: width + '%',
      currentTimestamp: currentTimestamp
    });

    let zoom = this.state.zoom > 6 ? 3 : 2;
    this.state.overlay.drawFrame(currentTimestamp, zoom, this.state.filters);
    let animationID = requestAnimationFrame(function () {
      this.animateMapData(currentTimestamp + mDay);
    }.bind(this));
    this.setState({'animationID': animationID});
  }

  timelineStop() {
    cancelAnimationFrame(this.state.animationID);
    this.state.overlay.applyFilters({
      'timeline': [new Date(this.state.filters.startDate).getTime(), new Date(this.state.filters.endDate).getTime()],
      'flag': this.state.filters.flag
    });
    this.state.overlay.regenerate();
    this.setState({running: null, currentTimestamp: this.state.filters.startDate, widthRange: 0});
  }

  onIdle() {
  }

  handleVesselInfo(data) {
    data = JSON.parse(data.target.response);
    document.getElementById('vesselPanelCallsign').innerHTML = data.callsign;
    document.getElementById('vesselPanelFlag').innerHTML = data.flag;
    document.getElementById('vesselPanelImo').innerHTML = data.imo;
    document.getElementById('vesselPanelMmsi').innerHTML = data.mmsi;
    document.getElementById('vesselPanelName').innerHTML = data.vesselname;
    document.getElementById('vesselPanelMarineTraffic').innerHTML = '<a href="http://www.marinetraffic.com/en/ais/details/ships/mmsi:' + data.mmsi + '" target="_blank">here</a>';
  }

  findSeriesPositions(series) {
    const tiles = this.state.overlay.data;
    let positions = [];
    let detailsDrawn = false;

    for (var tile in tiles) {
      for (var timestamp in tiles[tile]) {
        for (var i = 0; i < tiles[tile][timestamp].latitude.length; i++) {
          if (tiles[tile][timestamp].series[i] == series) {
            positions.push({
              'lat': tiles[tile][timestamp].latitude[i],
              'lng': tiles[tile][timestamp].longitude[i]
            });
            if (!detailsDrawn) {
              detailsDrawn = true;
              this.getVesselDetails(tiles, tile, timestamp, i);
            }
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

  getVesselDetails(tiles, tile, timestamp, i) {
    document.getElementById('vesselBox').style.display = 'block';
    document.getElementById('vesselPanelSeries').innerHTML = tiles[tile][timestamp].series[i];
    document.getElementById('vesselPanelSeriesgroup').innerHTML = tiles[tile][timestamp].seriesgroup[i];
    document.getElementById('vesselPanelLat').innerHTML = tiles[tile][timestamp].latitude[i];
    document.getElementById('vesselPanelLong').innerHTML = tiles[tile][timestamp].longitude[i];
    document.getElementById('vesselPanelWeight').innerHTML = tiles[tile][timestamp].weight[i];
    if (typeof XMLHttpRequest != 'undefined') {
      this.request = new XMLHttpRequest();
    } else {
      throw 'XMLHttpRequest is disabled';
    }
    this.request.open('GET', 'https://skytruth-pleuston.appspot.com/v1/tilesets/tms-format-2015-2016-v1/sub/seriesgroup=' + tiles[tile][timestamp].seriesgroup[i] + '/info', true);
    this.request.setRequestHeader("Authorization", `Bearer ${this.props.token}`);
    this.request.responseType = "application/json";
    this.request.onload = this.handleVesselInfo.bind(this);
    this.request.onerror = this.handleVesselInfo.bind(this);
    this.request.send(null);
  }

  onClickMap(event) {
    const LAT = Math.round(event.latLng.lat() * 1) / 1;
    const LNG = Math.round(event.latLng.lng() * 1) / 1;
    const tiles = this.state.overlay.data;
    for (var tile in tiles) {
      for (var timestamp in tiles[tile]) {
        for (var i = 0; i < tiles[tile][timestamp].latitude.length; i++) {
          if (Math.round(tiles[tile][timestamp].latitude[i] * 1) / 1 == LAT && Math.round(tiles[tile][timestamp].longitude[i] * 1) / 1 == LNG) {
            this.findSeriesPositions(tiles[tile][timestamp].series[i]);
            return;
          }
        }
      }
    }
  }

  componentDidMount() {
    this.props.getLayers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.vessel && nextProps.vessel != this.props.vessel) {
      let nProps = nextProps.vessel;
      let tProps = this.props.vessel;
      let PVLayers = tProps.layers;
      let nPVLayers = nProps.layers;
      const addedLayers = this.state.addedLayers;
      let promises = [];

      const addVessel = function (title, pos) {
        const canvasLayer = new CanvasLayer(pos, null, this.refs.map.props.map, this.props.token, {'timeline': [new Date(this.state.filters.startDate).getTime(), new Date(this.state.filters.endDate).getTime()]});
        this.setState({overlay: canvasLayer});
        addedLayers[title] = canvasLayer;
      }
      let callAddVessel = null;
      if (nPVLayers !== PVLayers) {
        for (let i = 0, length = nPVLayers.length; i < length; i++) {
          if (nPVLayers[i].visible && !addedLayers[nPVLayers[i].title]) {
            // add layer and not exist
            if (nPVLayers[i].title === 'VESSEL') {
              callAddVessel = addVessel.bind(this, nPVLayers[i].title, i);
            } else {
              let promise = new Promise(function (resolve, reject) {
                cartodb.createLayer(this.refs.map.props.map, nPVLayers[i].source.args.url)
                  .addTo(this.refs.map.props.map, i).done(function (layer, cartoLayer) {
                  addedLayers[layer.title] = cartoLayer;
                  resolve();
                }.bind(this, nPVLayers[i]));
              }.bind(this));
              promises.push(promise);
            }

          } else if (nPVLayers[i].visible && addedLayers[nPVLayers[i].title] && !addedLayers[nPVLayers[i].title].isVisible()) {
            // visible and already exist
            if (nPVLayers[i].title === 'VESSEL') {
              this.state.overlay.show();
            } else {
              addedLayers[nPVLayers[i].title].show();
            }
          } else if (!nPVLayers[i].visible && addedLayers[nPVLayers[i].title] && addedLayers[nPVLayers[i].title].isVisible()) {
            //hide layer
            if (nPVLayers[i].title === 'VESSEL') {
              this.state.overlay.hide();
            } else {
              addedLayers[nPVLayers[i].title].hide();
            }
          }
        }
      }
      if (promises && promises.length > 0) {
        Promise.all(promises).then(function () {
          if (callAddVessel) {
            callAddVessel();
          }
          this.setState({addedLayers: addedLayers});
        }.bind(this));
      } else {
        this.setState({addedLayers: addedLayers});
      }

    }
  }

  isVisibleVessel(layers) {
    if (layers) {
      for (let i = 0, length = layers.length; i < length; i++) {
        if (layers[i].title === 'VESSEL') {
          return layers[i].visible;
        }
      }
    }
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.overlay && this.isVisibleVessel(nextProps.vessel.layers)) {
      nextState.overlay.applyFilters({
        'timeline': [new Date(nextState.filters.startDate).getTime(), new Date(nextState.filters.endDate).getTime()],
        'flag': this.state.filters.flag
      });
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

  toggleLayer(layer) {
    layer.visible = !layer.visible;
    this.props.updateLayer(layer);
  }

  /**
   * Triggered when the user updates the start or end dates of the slider/datepickers
   *
   * @param target startDate/endDate
   * @param value
   */
  updateDates(target, value) {
    let filters = this.state.filters;
    let newDateValue = new Date(value).getTime();
    let currentTimestamp = this.state.currentTimestamp

    if (target === 'startDate' && newDateValue >= filters['endDate']) {
      return;
    }
    if (target === 'endDate' && newDateValue <= filters['startDate']) {
      return;
    }

    filters[target] = newDateValue
    this.setState({filters: filters});

    if (target === 'startDate' && currentTimestamp < newDateValue) {
      this.setState({currentTimestamp: newDateValue});
    }
    if (target === 'endDate' && currentTimestamp > newDateValue) {
      this.setState({currentTimestamp: newDateValue});
    }
    this.state.overlay.hide();
  }

  displayVesselsByCountry(iso) {
    // if (iso.length > 2){
    // switch to type INT
    let filters = this.state.filters;
    filters['flag'] = iso;
    this.setState({filters: filters});
    this.state.overlay.hide();
    // }
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
            <button onClick={this.timelineStop.bind(this)} className={map.timelineStop}>Stop</button>
          </div>
          <div className={map.date_inputs}>
            <label for="mindate">
              Start date
              <input type="date" id="mindate" value={new Date(this.state.filters.startDate).toISOString().slice(0, 10)}
                     onChange={(e) => this.updateDates('startDate', e.currentTarget.value)}/>
            </label>
            <label for="maxdate">
              End date
              <input type="date" id="maxdate" value={new Date(this.state.filters.endDate).toISOString().slice(0, 10)}
                     onChange={(e) => this.updateDates('endDate', e.currentTarget.value)}/>
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
        <LayerPanel layers={this.props.vessel.layers} onToggle={this.toggleLayer.bind(this)}/>
        <FiltersPanel onChange={this.displayVesselsByCountry.bind(this)}/>
        <VesselPanel onChange={this.displayVesselsByCountry.bind(this)}/>
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
              defaultMapTypeId={google.maps.MapTypeId.SATELLcurrentTimestamp}
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
