import React from 'react';
import MapGL from 'react-map-gl';
import mapStyles from 'styles/components/map.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import ActivityLayers from 'activityLayers/containers/ActivityLayers.js';

// import {experimental} from 'react-map-gl';
//
// class MapControls extends experimental.MapControls {
//   constructor() {
//     super();
//     this.events = ['mousemove'];
//   }
//
//   // Override the default handler in MapControls
//   handleEvent(event) {
//     if (event.type === 'mousemove') {
//       console.log('hi', event);
//     }
//     return super.handleEvent(event);
//   }
//   // _onPan(event) {
//   //   console.log('pan')
//   //   return this.isFunctionKeyPressed(event) || event.rightButton ?
//   //     //  Default implementation in MapControls
//   //     //  this._onPanRotate(event) : this._onPanMove(event);
//   //     this._onPanMove(event) : this._onPanRotate(event);
//   // }
// }

// const controls = new MapControls();


class Map extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    const mapContainerStyle = window.getComputedStyle(this._mapContainerRef);
    const width = parseInt(mapContainerStyle.width, 10);
    const height = parseInt(mapContainerStyle.height, 10);
    this.props.setViewport({
      ...this.props.viewport,
      width,
      height
    });
  }

  onViewportChange = (viewport) => {
    this.props.setViewport(viewport);
  }

  onHover = (event) => {
    this.props.setMouseLatLong(event.lngLat[1], event.lngLat[0]);
  }

  render() {
    const { viewport, maxZoom, minZoom, transitionEnd } = this.props;
    return (
      <div
        id="map"
        className={mapStyles.map}
        style={{ height: '100%' }}
        ref={(ref) => { this._mapContainerRef = ref; }}
      >
        <MapGL
          onTransitionEnd={transitionEnd}
          // mapControls={controls}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onHover={this.onHover}
          mapStyle="mapbox://styles/enriquetuya/cj6dnii820sxe2rlpl7y238fb"
          {...viewport}
          maxZoom={maxZoom}
          minZoom={minZoom}
          onViewportChange={this.onViewportChange}
        >
          <ActivityLayers />
        </MapGL>
      </div>
    );
  }
}

Map.propTypes = {
  viewport: PropTypes.object,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  setViewport: PropTypes.func,
  setMouseLatLong: PropTypes.func,
  transitionEnd: PropTypes.func
};

export default Map;
