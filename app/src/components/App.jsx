'use strict';

import React, {Component} from 'react';
import PelagosClient  from '../lib/pelagosClient';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import {connect} from 'react-redux';
import {default as ScriptjsLoader} from "react-google-maps/lib/async/ScriptjsLoader";


var url = "https://storage.googleapis.com/skytruth-pelagos-production/pelagos/data/tiles/benthos-pipeline/gfw-vessel-scoring-602-tileset-2014-2016_2016-05-17/cluster_tiles/2015-01-01T00:00:00.000Z,2016-01-01T00:00:00.000Z;-90,-45,-45,-22.5";
class App extends Component {

  onClick(){
      console.log(this.refs.map);
  }
  onZoomChanged(){
      console.log(this.refs.map.getZoom());
  }

  render() {
    let promise = new PelagosClient().obtainTile(url);
    promise.then(function(data){
      console.log('Todo ocorrecto', data);
    }, function(err){
      console.error('Error', err);
    });
    return (
      <ScriptjsLoader
        hostname={"maps.googleapis.com"}
        pathname={"/maps/api/js"}
        query={{v: `3.${ Math.ceil(Math.random() * 22) }`, libraries: "geometry,drawing,places"}}
        loadingElement={
          <div>
            Loading
          </div>
        }
        containerElement={
          <div style={{height: '500px'}}/>
        }
        googleMapElement={
          <GoogleMap
            ref="map"
            defaultZoom={0}
            defaultCenter={{lat: -25.363882, lng: 131.044922}}
            onClick={this.onClick.bind(this)}
            onZoomChanged={this.onZoomChanged.bind(this)}
          >
            
          </GoogleMap>
        }
      />
    );
  }

}

let mapStateToProps = function(state){
  return {};
};

export default connect(mapStateToProps, mapStateToProps)(App);
