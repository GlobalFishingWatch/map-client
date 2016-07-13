'use strict';

import React, {Component} from 'react';
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import createOverlayLayer from './layers/vesselOneLayer';
import CanvasLayer from './layers/canvasLayer';
import map from '../../styles/index.scss';

const min2015 = 1420070400000; // 1/1/2015
const max2015 = 1451606400000; // 1/1/2015
const mDay = 86400000;

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overlay: null,
      ite: min2015
    };
  }
  onZoomChanged() {
    this.setState({zoom:this.refs.map.props.map.getZoom()});
    this.state.overlay.resetData();
  }

  addLayer() {
    this.props.addLayer();
  }
  moveTimeline(e) {
    this.timelinerange   = document.getElementById('timeline_handler');
    this.timelineStart(this.timelinerange.style.width = (e.clientX-60) + 'px');
  }

  timelineStart() {
    this.timelinetooltip = document.getElementById('timeline_tooltip');
    this.timelinerange = document.getElementById('timeline_handler');
    let data = this.props.vessel.data;

    this.setState({running: !!!this.state.running});
    requestAnimationFrame(function() {
      this.animateMapData(this.state.ite || min2015 , mDay);
    }.bind(this));
  }

  animateMapData(ite) {
    if (!this.state.running) return;
    if (this.state.trajectory) {
      this.state.trajectory.setMap(null)
    }
    ite = ite || 0;
    if (ite > max2015) {
      this.setState({running: !!!this.state.running, ite: null, widthRange: 0});
      return ;
    }
    let width = ((ite - min2015) / mDay)/ ((max2015 - min2015) / mDay) * 100;
    this.setState({widthRange: width +'%', ite: ite});
    // this.state.overlay.regenerate();
    this.state.overlay.drawFrame(ite, (this.state.zoom > 6 ? 3 : 2));
    let animationID = requestAnimationFrame(function() {
        this.animateMapData(ite+mDay);
    }.bind(this));
    this.setState({'animationID' : animationID});
  }

  timelineStop() {
    cancelAnimationFrame(this.state.animationID);
    this.state.overlay.regenerate();
    this.setState({running: null, ite: null, widthRange: 0});
    // this.onDragEnd();
  }

  onIdle() {
    if (this.props.vessel && !this.props.vessel.load && !this.state.overlay) {
      const canvasLayer = new CanvasLayer(0, null, this.refs.map.props.map);
      this.setState({overlay: canvasLayer});

    }
  }
  findSeriesPositions(series) {
    const tiles = this.state.overlay.data;
    let positions = [];

    for (var tile in tiles) {
      for (var timestamp in tiles[tile]) {
        for (var i = 0; i < tiles[tile][timestamp].latitude.length; i++){
          if (tiles[tile][timestamp].series[i] == series) {
            positions.push({'lat' : tiles[tile][timestamp].latitude[i], 'lng' : tiles[tile][timestamp].longitude[i]})
          }
        }
      }
    }
    if (this.state.trajectory) {
      this.state.trajectory.setMap(null)
    }
    this.setState({trajectory : new google.maps.Polyline({
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
    const LAT   = Math.round(e.latLng.lat() * 1) / 1;
    const LNG   = Math.round(e.latLng.lng() * 1) / 1;
    const tiles = this.state.overlay.data;
    for (var tile in tiles) {
      for (var timestamp in tiles[tile]) {
        for (var i = 0; i < tiles[tile][timestamp].latitude.length; i++){
          if (Math.round(tiles[tile][timestamp].latitude[i]  * 1) / 1 == LAT && 
              Math.round(tiles[tile][timestamp].longitude[i] * 1) / 1 == LNG ) {
            this.findSeriesPositions(tiles[tile][timestamp].series[i]);
            return;
          }
        }
      }
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.vessel && nextProps.vessel != this.props.vessel) {
      let nProps    = nextProps.vessel;
      let tProps    = this.props.vessel;
      let PVData    = tProps.data;
      let nPVData   = nProps.data;
      let PVLayers  = tProps.layers;
      let nPVLayers = nProps.layers;
      if (nPVData !== PVData && !!nPVData) {
        let keys = Object.keys(nPVData);
        for (let i = 0, length = keys.length; i < length; i++) {
          if (!PVData || !PVData[keys[i]]) {
            this.state.overlay.drawTile(nPVData[keys[i]]);
          }
        }
      }
      if (nPVLayers !== PVLayers) {
        for (let i = 0, length = nPVLayers.length; i < length; i++) {
          if (nPVLayers[i] !== PVLayers[i]) {
            cartodb.createLayer(this.refs.map.props.map, nPVLayers[i])
              .addTo(this.refs.map.props.map, i + 1);
          }
        }
      }
    }
  }

  login(){
    let url = "https://skytruth-pleuston.appspot.com/v1/authorize?response_type=token&client_id=asddafd&redirect_uri=" + window.location;
    window.location = url;
  }

  render() {
    return <div>
      <button onClick={this.addLayer.bind(this)} className={map.addButton}>Show layers</button>
      <button onClick={this.timelineStart.bind(this)} className={map.timeline}>{!this.state || !this.state.running ? "Play ►" : "Pause ||"}</button>
      <button onClick={this.timelineStop.bind(this)} className={map.timelineStop}>Stop</button>
      {
        this.props.loggedUser && <span className={map.loggedUser}>{this.props.loggedUser.displayName}</span>
      }
      {!this.props.loggedUser && <button className={map.loginButton} onClick={this.login.bind(this)}>Login</button>}
      <div className={map.range_container}>
        <span className={map.tooltip} id="timeline_tooltip" style={{left: this.state.widthRange}}>
          {new Date(this.state.ite).toString()}
        </span>
        <span className={map.timeline_range} onClick={this.moveTimeline.bind(this)}>
          <span className={map.handle} id="timeline_handler" style={{width:this.state.widthRange}}></span>
        </span>
      </div>
      <GoogleMapLoader
        containerElement={
						    <div className = {
					        map.map
					      } style={{
						        height: "100%",
						      }}
						    />
						  }
        googleMapElement={

								<GoogleMap ref="map" defaultZoom = {3} defaultCenter = {{lat: 0, lng: 0}} defaultMapTypeId = {google.maps.MapTypeId.SATELLITE}
					      onIdle = {
					        this.onIdle.bind(this)
					      }
                onClick = {
                  this.onClick.bind(this)
                }
					      onZoomChanged = {
					        this.onZoomChanged.bind(this)
					      }> </GoogleMap>
						  }
      ></GoogleMapLoader>
    </div>


  }

}

export default Map;
