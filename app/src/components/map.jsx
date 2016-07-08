'use strict';

import React, {Component} from 'react';
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import createOverlayLayer from './layers/vesselOneLayer';
import CanvasLayer from './layers/canvasLayer';
import map from '../../styles/index.scss';

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate)
        func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow)
      func.apply(context, args);
  };
};

class Map extends Component {


  onZoomChanged() {
    this.setState({zoom:this.refs.map.props.map.getZoom()});
  }



  addLayer() {
    this.props.addLayer();
  }
  moveTimeline(e) {
    this.timelinerange   = document.getElementById('timeline_handler');
    this.timelineStart(this.timelinerange.style.width = (e.clientX-60) + 'px');
  }

  timelineStart(width) {
    this.timelinetooltip = document.getElementById('timeline_tooltip');
    this.timelinerange = document.getElementById('timeline_handler');
    let data = this.props.vessel.data;
    let newData = new Array(365);
    const m2015 = 1420070400000;
    const mDay = 86400000;
    this.setState({running: !!!this.state.running});
    for (let i = 0; i < 365; i++) {
      newData[i] = {latitude: [], longitude: [], weight: []};
    }

    for (let prop in data) {
      let prop = data[prop];
      for (let i = 0; i < prop.datetime.length; i++) {
        let rI = newData[~~((prop.datetime[i] - m2015) / mDay)];
        rI.latitude.push(prop.latitude[i]);
        rI.longitude.push(prop.longitude[i]);
        rI.weight.push(prop.weight[i]);
      }
    }
    if (width) {
      width = ~~this.timelinerange.style.width.replace('px','');
      width = (width * 365) / this.timelinerange.parentNode.offsetWidth;
    }
    this.timelinetooltip.style.left = this.timelinerange.offsetWidth + 'px';
    const result = new Date(m2015);
    result.setDate(result.getDate() + width);
    this.timelinetooltip.innerHTML = result;
    requestAnimationFrame(function() {
      this.animateMapData(newData, ~~width || 0);
    }.bind(this));
  }

  animateMapData(data, ite) {
    if (!this.state.running) return;
    ite = ite || 0;
    if (ite == data.length) {
      this.setState({running: !!!this.state.running});
      this.onDragEnd();
      this.timelinerange.style.width = 0;
      this.timelinetooltip.style.left = this.timelinerange.offsetWidth + 'px';
      return ;
    }
    this.timelinerange.style.width = ite/365 * 100 + '%';
    const result = new Date(1420070400000);
    result.setDate(result.getDate() + ite);
    this.timelinetooltip.style.left = this.timelinerange.offsetWidth + 'px';
    this.timelinetooltip.innerHTML = result;
    this.state.overlay.regenerate();
    this.state.overlay.drawTile(data[ite],(this.state.zoom > 6 ? 3 : 2));
    let animationID = requestAnimationFrame(function() {
        this.animateMapData(data,ite+1);
    }.bind(this));
    this.setState({'animationID' : animationID});
  }

  timelineStop() {
    cancelAnimationFrame(this.state.animationID);
    this.timelinerange.style.width = '0';
    this.setState({running: !!!this.state.running});
    this.onDragEnd();
  }

  onIdle() {
    if (this.props.vessel && !this.props.vessel.load) {
      // this.props.initVesselLayer();
      // const Overlay = createOverlayLayer(google);
      // const overlay = new Overlay(this.refs.map.props.map);
      // this.setState({overlay: overlay});
      // this.props.loadVesselLayer(this.refs.map.props.map);
      const canvasLayer = new CanvasLayer(0, null, this.refs.map.props.map);


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
        <span className={map.tooltip} id="timeline_tooltip">
        2015-01-01
        </span>
        <span className={map.timeline_range} onClick={this.moveTimeline.bind(this)}>
          <span className={map.handle} id="timeline_handler"></span>
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
								<GoogleMap ref="map" defaultZoom = {0} defaultCenter = {{lat: 0, lng: 0}} defaultMapTypeId = {google.maps.MapTypeId.SATELLITE}

					      onIdle = {
					        this.onIdle.bind(this)
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
