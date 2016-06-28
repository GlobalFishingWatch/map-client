'use strict';

import React, {Component} from 'react';
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import createOverlayLayer from './layers/vesselONeLayer';
import map from '../../styles/index.scss';

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate)
        func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow)
      func.apply(context, args);
  };
};

class Map extends Component {


  onZoomChanged() {
    this.state.overlay.regenerate();
    this.props.loadVesselLayer(this.refs.map.props.map);
    this.setState({zoom:this.refs.map.props.map.getZoom()});
  }

  onDragStart() {
    this.props.showLoading();
  }

  onDragEnd() {
    this.state.overlay.recalculatePosition();
    this.props.resetCache();
    this.props.move(this.refs.map.props.map);
  }

  addLayer() {
    this.props.addLayer();
  }

  timelineStart() {
    var data = this.props.vessel.data;
    var newData = new Array(365);
    var m2015 = 1420070400000;
    var mDay = 86400000;
    this.setState({running: !!!this.state.running});
    for (var i = 0; i < 365; i++) {
      newData[i] = {latitude: [], longitude: [], weight: []};
    }

    for (var prop in data) {
      var prop = data[prop];
      for (var i = 0; i < prop.datetime.length; i++) {
        var rI = newData[~~((prop.datetime[i] - m2015) / mDay)];
        rI.latitude.push(prop.latitude[i]);
        rI.longitude.push(prop.longitude[i]);
        rI.weight.push(prop.weight[i]);
      }
    }
    requestAnimationFrame(function() {
      this.animateMapData(newData);
    }.bind(this));
  }

  animateMapData(data, ite) {
    if (!this.state.running) return;
    var ite = ite || 0;
    if (ite == data.length) {
      this.setState({running: !!!this.state.running});
      this.onDragEnd();
      return ;
    }
    this.state.overlay.regenerate();
    this.state.overlay.drawTile(data[ite],(this.state.zoom > 6 ? 3 : 2));
    var animationID = requestAnimationFrame(function() {
        this.animateMapData(data,ite+1);
    }.bind(this));
    this.setState({'animationID' : animationID});
  }

  timelineStop() {
    cancelAnimationFrame(this.state.animationID);
    this.setState({running: !!!this.state.running});
    this.onDragEnd();
  }

  onIdle() {
    if (this.props.vessel && !this.props.vessel.load) {
      this.props.initVesselLayer();
      var Overlay = createOverlayLayer(google);
      var overlay = new Overlay(this.refs.map.props.map);
      this.setState({overlay: overlay});
      this.props.loadVesselLayer(this.refs.map.props.map);
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

  render() {

    return <div>
      <button onClick={this.addLayer.bind(this)} className={map.addButton}>Show layers</button>
      <button onClick={this.timelineStart.bind(this)} className={map.timeline}>{!this.state || !this.state.running ? "Play ►" : "Pause ||"}</button>
      <button onClick={this.timelineStop.bind(this)} className={map.timelineStop}>Stop</button>
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
					      onDragend = {
					        this.onDragEnd.bind(this)
					      }
					      onDragstart = {
					        this.onDragStart.bind(this)
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
