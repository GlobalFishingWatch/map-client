'use strict';

import React, {Component} from 'react';
import {GoogleMapLoader, GoogleMap} from "react-google-maps";
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";
import createOverlayLayer from './layers/vesselONeLayer';
import map from '../../styles/index.scss';

class Map extends Component {

  onClick() {
    console.log(this.refs.map);

  }
  onZoomChanged() {
    // this.refs.map.props.map.overlayMapTypes.removeAt(0);
    // this.refs.map.props.map.overlayMapTypes.insertAt(0, new VesselLayer(this.refs.map));
    console.log(this.refs.map.getZoom());
    this.state.overlay.regenerate();
  }

  onIdle() {
    if (this.props.vessel && !this.props.vessel.load) {

      this.props.initVesselLayer();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.vessel && nextProps.vessel != this.props.vessel) {
      if (nextProps.vessel.visible) {
        var bounds = new google.maps.LatLngBounds(new google.maps.LatLng(62.281819, -150.287132), new google.maps.LatLng(62.400471, -150.005608));

        // The photograph is courtesy of the U.S. Geological Survey.
        var srcImage = 'https://developers.google.com/maps/documentation/' +
        'javascript/examples/full/images/talkeetna.png';

        var Overlay = createOverlayLayer(google);
        var overlay = new Overlay(this.refs.map.props.map);
        this.setState({overlay: overlay});
        // this.refs.map.props.map.overlayMapTypes.insertAt(0, new VesselLayer(this.refs.map));
        // this.refs.map.props.map.data.loadGeoJson('http://localhost:8080/geojson.json');
        // this.refs.map.props.map.data.setStyle({fillColor: 'green', strokeWeight: 3});
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
      onZoomChanged = {
        this.onZoomChanged.bind(this)
      } > </GoogleMap>}/>
    );
  }

}

export default Map;
