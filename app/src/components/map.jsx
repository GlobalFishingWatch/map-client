'use strict';

import React, {Component} from "react";
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import Draggable from "react-draggable";
import CanvasLayer from "./layers/canvasLayer";
import LayerPanel from "./layerPanel";
import FiltersPanel from "./filtersPanel";
import VesselPanel from "./vesselPanel";
import Header from "../containers/header";
import map from "../../styles/index.scss";

let tmlnMinDate = 1420070400000; // 01/01/2015
let tmlnMaxDate = 1451516400000; // 31/12/2015
const maxZoomLevel = 2;
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
      ite: tmlnMinDate,
      lastCenter: null,
      filters: {
        startDate: tmlnMinDate,
        endDate: tmlnMaxDate,
        flag: ''
      }
    };
  }

  onZoomChanged() {
    const ZOOM = this.refs.map.props.map.getZoom();
    if (ZOOM < maxZoomLevel) {
      this.refs.map.props.map.setZoom(maxZoomLevel);
    }
    this.setState({zoom: ZOOM});
    this.state.overlay.resetData();
  }

  moveTimeline(e) {
    this.timelinerange = document.getElementById('timeline_handler');
    this.timelineStart(this.timelinerange.style.width = (e.clientX - 60) + 'px');
  }

  handlerMoved(tick, ev) {
    let target = null;
    const TIMELINESCOPE = document.getElementById('timeline_handler').parentElement;
    const ABSMAXMOMENT = new Date(tmlnMaxDate).getTime() - new Date(tmlnMinDate).getTime();
    let PERCENTAGE = null;
    if (tick === 1) {
      target = document.getElementById('dateHandlerLeft');
    } else {
      target = document.getElementById('dateHandlerRight');
    }
    PERCENTAGE = ((target.getBoundingClientRect().left - TIMELINESCOPE.getBoundingClientRect().left) * 100) / TIMELINESCOPE.offsetWidth;

    if (target.id === 'dateHandlerLeft') {
      tmlnMinDate = (PERCENTAGE * ABSMAXMOMENT) / 100 + new Date(tmlnMinDate).getTime();

      // UPDATE VISIBLE TIMESTAMP
      TIMELINESCOPE.childNodes[0].style.left = (target.getBoundingClientRect().left - target.parentElement.getBoundingClientRect().left - 15) + 'px';
      TIMELINESCOPE.childNodes[0].style.width = (document.getElementById('dateHandlerRight').getBoundingClientRect().left - target.getBoundingClientRect().left) + 'px';
    } else if (target.id === 'dateHandlerRight') {
      tmlnMaxDate = (PERCENTAGE * ABSMAXMOMENT) / 100 + new Date(tmlnMinDate).getTime();
      // UPDATE VISIBLE TIMESTAP
      TIMELINESCOPE.childNodes[0].style.width = (target.getBoundingClientRect().left - document.getElementById('dateHandlerLeft').getBoundingClientRect().left) + 'px';
    }
    // UPDATE DATES
    this.setState({ite: tmlnMinDate});
    this.state.overlay.hide();
    this.state.overlay.applyFilters({'timeline': [tmlnMinDate, tmlnMaxDate]});
    document.getElementById('mindate').value = new Date(tmlnMinDate).toISOString().slice(0, 10);
    document.getElementById('maxdate').value = new Date(tmlnMaxDate).toISOString().slice(0, 10);
  }

  timelineStart() {
    this.timelinerange = document.getElementById('timeline_handler');
    let data = this.props.vessel.data;

    this.setState({
      running: !!!this.state.running
    });
    requestAnimationFrame(function () {
      this.animateMapData(this.state.ite || tmlnMinDate, mDay);
    }.bind(this));
  }

  animateMapData(ite) {
    if (!this.state.running) return;
    if (this.state.trajectory) {
      this.state.trajectory.setMap(null)
    }

    ite = ite || 0;
    if (ite > tmlnMaxDate) {
      this.setState({
        running: !!!this.state.running,
      });
      this.timelineStop();
      return;
    }
    let width = ((ite - tmlnMinDate) / mDay) / ((tmlnMaxDate - tmlnMinDate) / mDay) * 100;
    this.setState({
      widthRange: width + '%',
      ite: ite
    });
    this.state.overlay.drawFrame(ite, (this.state.zoom > 6
      ? 3
      : 2));
    let animationID = requestAnimationFrame(function () {
      this.animateMapData(ite + mDay);
    }.bind(this));
    this.setState({'animationID': animationID});
  }

  timelineStop() {
    cancelAnimationFrame(this.state.animationID);
    this.state.overlay.regenerate();
    this.setState({running: null, ite: tmlnMinDate, widthRange: 0});
  }

  onIdle() {
  }

  handleData(data) {
    data = JSON.parse(data.target.response);
    document.getElementById('vesselPanelCallsign').innerHTML = data.callsign;
    document.getElementById('vesselPanelFlag').innerHTML = data.flag;
    document.getElementById('vesselPanelImo').innerHTML = data.imo;
    document.getElementById('vesselPanelMmsi').innerHTML = data.mmsi;
    document.getElementById('vesselPanelName').innerHTML = data.vesselname;
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
    this.request.onload = this.handleData.bind(this);
    this.request.onerror = this.handleData.bind(this);
    this.request.send(null);
  }

  onClickMap(e) {
    const LAT = Math.round(e.latLng.lat() * 1) / 1;
    const LNG = Math.round(e.latLng.lng() * 1) / 1;
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
    // this.props.initVesselLayer();
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

  onMousemove(ev) {
    this.refs.map.props.map.setOptions({draggableCursor: 'default'});
  }

  onDragStart(ev) {
    if (this.state.lastCenter === null) this.lastValidCenter = this.refs.map.props.map.getCenter();
  }

  onDragEnd(ev) {
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

  updateDates(target, value) {
    let filters = this.state.filters;
    filters[target] = new Date(value).getTime();
    this.setState({filters: filters});
    if (target === 'startDate') {
      this.setState({ite: new Date(value).getTime()});
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

  login() {
    let url = "https://skytruth-pleuston.appspot.com/v1/authorize?response_type=token&client_id=asddafd&redirect_uri=" + window.location;
    window.location = url;
  }

  shareMap(ev) {
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
            <button onClick={this.timelineStart.bind(this)} className={map.timeline}>
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
              {new Date(this.state.ite).toISOString().slice(0, 10)}
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
              defaultMapTypeId={google.maps.MapTypeId.SATELLITE}
              onIdle={this.onIdle.bind(this)}
              onClick={this.onClickMap.bind(this)}
              onMousemove={this.onMousemove.bind(this)}
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
