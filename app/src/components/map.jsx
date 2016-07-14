'use strict';

import React, {Component} from "react";
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import CanvasLayer from "./layers/canvasLayer";
import LayerPanel from "./layerPanel";
import map from "../../styles/index.scss";

let tmlnMinDate = 1420070400000; // 1/1/2015
let tmlnMaxDate = 1451606400000; // 1/1/2016
const mDay = 86400000;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlay: null,
      addedLayers: [],
      ite: tmlnMinDate
    };
  }

  onZoomChanged() {
    const ZOOM = this.refs.map.props.map.getZoom();
    if (ZOOM < 3) {
        this.refs.map.props.map.setZoom(3);
    }
    this.setState({zoom: ZOOM});
    this.state.overlay.resetData();
  }

  moveTimeline(e) {
    this.timelinerange = document.getElementById('timeline_handler');
    this.timelineStart(this.timelinerange.style.width = (e.clientX - 60) + 'px');
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
    // this.onDragEnd();
  }

  onIdle() {
    // if (this.props.vessel && !this.props.vessel.load && !this.state.overlay) {
    //   const canvasLayer = new CanvasLayer(0, null, this.refs.map.props.map);
    //   this.setState({overlay: canvasLayer});
    //
    // }
  }

  findSeriesPositions(series) {
    const tiles = this.state.overlay.data;
    let positions = [];

    for (var tile in tiles) {
      for (var timestamp in tiles[tile]) {
        for (var i = 0; i < tiles[tile][timestamp].latitude.length; i++) {
          if (tiles[tile][timestamp].series[i] == series) {
            positions.push({
              'lat': tiles[tile][timestamp].latitude[i],
              'lng': tiles[tile][timestamp].longitude[i]
            })
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

  onClick(e) {
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

  componentWillMount() {
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
      if (nPVLayers !== PVLayers) {
        for (let i = 0, length = nPVLayers.length; i < length; i++) {
          if (nPVLayers[i].visible && !addedLayers[nPVLayers[i].title]) {
            // add layer and not exist
            if (nPVLayers[i].title === 'VESSEL') {
              const canvasLayer = new CanvasLayer(0, null, this.refs.map.props.map);
              this.setState({overlay: canvasLayer});
              addedLayers[nPVLayers[i].title] = canvasLayer;
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
          this.setState({addedLayers: addedLayers});
        }.bind(this));
      } else {
        this.setState({addedLayers: addedLayers});
      }

    }
  }

  onMousemove(ev) {
    this.refs.map.props.map.setOptions({draggableCursor: 'default'});
  }

  toggleLayer(layer) {
    layer.visible = !layer.visible;
    this.props.updateLayer(layer);
  }

  login() {
    let url = "https://skytruth-pleuston.appspot.com/v1/authorize?response_type=token&client_id=asddafd&redirect_uri=" + window.location;
    window.location = url;
  }

  updateDates(ev) {
    if (!!!ev.target.value) return;
    if (ev.target.id == 'mindate') {
      tmlnMinDate = new Date(ev.target.value).getTime();
    } else if (ev.target.id == 'maxdate') {
      tmlnMaxDate = new Date(ev.target.value).getTime();
    }
    this.setState({ite: tmlnMinDate});
    this.state.overlay.hide();
    this.state.overlay.applyFilters({'timeline': [tmlnMinDate, tmlnMaxDate]});
  }

  render() {
    return <div>
      <div className={map.time_controls}>
        <button onClick={this.timelineStart.bind(this)} className={map.timeline}>
          {!this.state || !this.state.running ? "Play ►" : "Pause ||"}
        </button>
        <button onClick={this.timelineStop.bind(this)} className={map.timelineStop}>Stop</button>
      </div>
      {this.props.loggedUser && <span className={map.loggedUser}>{this.props.loggedUser.displayName}</span>}
      {!this.props.loggedUser && <button className={map.loginButton} onClick={this.login.bind(this)}>Login</button>}
      <div className={map.date_inputs}>
        <label for="mindate">
          Start date
          <input type="date" id="mindate" defaultValue="2015-01-01" onChange={this.updateDates.bind(this)}/>
        </label>
        <label for="maxdate">
          End date
          <input type="date" id="maxdate" defaultValue="2015-12-31" onChange={this.updateDates.bind(this)}/>
        </label>
      </div>
      <div className={map.range_container}>
        <span className={map.tooltip} id="timeline_tooltip" style={{left: this.state.widthRange}}>
          {new Date(this.state.ite).toISOString().slice(0,10)}
        </span>
        <span className={map.timeline_range} onClick={this.moveTimeline.bind(this)}>
          <span className={map.handle} id="timeline_handler" style={{width: this.state.widthRange}}></span>
        </span>
      </div>
      <LayerPanel layers={this.props.vessel.layers} onToggle={this.toggleLayer.bind(this)}/>
      <GoogleMapLoader
        containerElement={
          <div className={map.map} style={{height: "100%",}}/>
        }
        googleMapElement={
          <GoogleMap
            ref="map"
            defaultZoom={3}
            defaultCenter={{lat: 0, lng: 0}}
            defaultMapTypeId={google.maps.MapTypeId.SATELLITE}
            onIdle={this.onIdle.bind(this)}
            onClick={this.onClick.bind(this)}
            onMousemove={this.onMousemove.bind(this)}
            onZoomChanged={this.onZoomChanged.bind(this)}>
          </GoogleMap>
        }>
      </GoogleMapLoader>
    </div>

  }

}

export default Map;
