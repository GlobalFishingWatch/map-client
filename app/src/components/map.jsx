'use strict';

import React, {Component} from 'react';
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import createOverlayLayer from './layers/vesselONeLayer';
import map from '../../styles/index.scss';

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

class Map extends Component {

  onClick() {
    console.log(this.refs.map);

  }
  onZoomChanged() {
      this.state.overlay.regenerate();
    this.props.loadVesselLayer(this.refs.map.props.map);
  }

  onBoundsChanged(){
    debounce(function(){
      this.props.move(this.refs.map.props.map);
    }.bind(this), 2000)();


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
      if(nextProps.vessel.data !== this.props.vessel.data ){
        if(!nextProps.vessel.data){
          // this.state.overlay.regenerate();
        } else {
          let keys = Object.keys(nextProps.vessel.data);
          for (let i=0, length = keys.length; i < length; i++){
            if(!this.props.vessel.data || !this.props.vessel.data[keys[i]]){
              this.state.overlay.drawTile(nextProps.vessel.data[keys[i]]);
            }
          }
        }

      }
    }
  }

  render() {

    return (
      <ScriptjsLoader hostname={"maps.googleapis.com"} pathname={"/maps/api/js"} query={{
        v: `3.${Math.ceil(Math.random() * 22)}`,
        libraries: "geometry,drawing,places"
      }} loadingElement={< div > Loading < /div>} containerElement={< div className = {
        map.map
      } />} googleMapElement={< GoogleMap ref = "map" defaultZoom = {
        2
      }
      defaultCenter = {{lat: 0, lng: 0}}onClick = {
        this.onClick.bind(this)
      }
      onIdle = {
        this.onIdle.bind(this)
      }
      onBoundsChanged = {
        this.onBoundsChanged.bind(this)
      }
      onZoomChanged = {
        this.onZoomChanged.bind(this)
      } > </GoogleMap>}/>
    );
  }

}

export default Map;
