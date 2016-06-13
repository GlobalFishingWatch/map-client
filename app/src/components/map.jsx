'use strict';

import React, {Component} from 'react';
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import createOverlayLayer from './layers/vesselONeLayer';
import map from '../../styles/index.scss';

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
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

  onIdle() {
    if (this.props.vessel && !this.props.vessel.load) {
      this.props.initVesselLayer();
      var Overlay = createOverlayLayer(google);
      var overlay = new Overlay(this.refs.map.props.map);
      this.setState({overlay: overlay});
      this.props.loadVesselLayer(this.refs.map.props.map);
			var map = this.refs.map.props.map;

      // cartodb.createLayer(map, 'http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json')
			// .addTo(map, 1);
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
			if(nextProps.vessel.layers !== this.props.vessel.layers){
				for(let i = 0, length = nextProps.vessel.layers.length; i < length; i++){
					if(nextProps.vessel.layers[i] !== this.props.vessel.layers[i]){
						cartodb.createLayer(this.refs.map.props.map, nextProps.vessel.layers[i])
						.addTo(this.refs.map.props.map, i +1);
					}
				}
			}
    }
  }

  render() {

		return <div>
			<button onClick={this.addLayer.bind(this)} className={map.addButton}>Add layer</button>
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
