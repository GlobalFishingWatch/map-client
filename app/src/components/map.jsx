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
    let url = window.prompt('Url');
    this.props.addLayer(url);
  }

  timelineStart() {
    var data = this.props.vessel.data;
    var newData = new Array(365);
    var m2015 = 1420070400000;
    var mDay = 86400000;
    for (var i = 0; i < 365; i++) {
      newData[i] = {latitude: [], longitude: []}
    }

    for (var prop in data) {
      for (var i = 0; i < data[prop].datetime.length; i++) {
        var cTime = data[prop].datetime[i];
        cTime = ~~((cTime - m2015) / mDay);
        var refIndex = newData[cTime];
        if (!!!refIndex) break;
        refIndex.latitude.push(data[prop].latitude[i]);
        refIndex.longitude.push(data[prop].longitude[i]);
      }
    }
    this.animateMapData(newData);
  }

  animateMapData(data, ite) {
    var ite = ite || 0;
    if (ite == data.length) return;
    setTimeout(function () {
      this.state.overlay.regenerate();
      this.state.overlay.drawTile(data[ite]);
      this.animateMapData(data, ite + 1);
    }.bind(this), 50);
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
      if (nextProps.vessel.data !== this.props.vessel.data) {
        if (!nextProps.vessel.data) {
          // this.state.overlay.regenerate();
        } else {
          let keys = Object.keys(nextProps.vessel.data);
          for (let i = 0, length = keys.length; i < length; i++) {
            if (!this.props.vessel.data || !this.props.vessel.data[keys[i]]) {
              this.state.overlay.drawTile(nextProps.vessel.data[keys[i]]);
            }
          }
        }

      }
      if (nextProps.vessel.layers !== this.props.vessel.layers) {
        for (let i = 0, length = nextProps.vessel.layers.length; i < length; i++) {
          if (nextProps.vessel.layers[i] !== this.props.vessel.layers[i]) {
            cartodb.createLayer(this.refs.map.props.map, nextProps.vessel.layers[i])
              .addTo(this.refs.map.props.map, i + 1);
          }
        }
      }
    }
  }

  render() {

    return <div>
      <button onClick={this.addLayer.bind(this)} className={map.addButton}>Add layer</button>
      <button onClick={this.timelineStart.bind(this)} className={map.timeline}>PLAY</button>
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
								<GoogleMap ref="map" defaultZoom = {4} defaultCenter = {{lat: 0, lng: 0}}
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
