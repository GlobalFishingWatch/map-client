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

  getBounds() {
    return (this._mapGlRef === null) ? null : [
      this._mapGlRef.getChildContext().viewport.unproject([0, 0]),
      this._mapGlRef.getChildContext().viewport.unproject([this.props.viewport.width, this.props.viewport.height])
    ];
  }

  _resize = () => {
    const mapContainerStyle = window.getComputedStyle(this._mapContainerRef);
    const width = parseInt(mapContainerStyle.width, 10);
    const height = parseInt(mapContainerStyle.height, 10);
    this.props.setViewport({
      ...this.props.viewport,
      width,
      height
    }, this.getBounds());
  }

  onViewportChange = (viewport) => {
    this.props.setViewport(viewport, this.getBounds());
  }

  onHover = (event) => {
    this.props.setMouseLatLong(event.lngLat[1], event.lngLat[0]);
  }

  render() {
    const { viewport, maxZoom, minZoom } = this.props;
    return (
      <div
        id="map"
        className={mapStyles.map}
        style={{ height: '100%' }}
        ref={(ref) => { this._mapContainerRef = ref; }}
      >
        <MapGL
          ref={(ref) => { this._mapGlRef = ref; }}
          // mapControls={controls}
          onHover={this.onHover}
          mapStyle="mapbox://styles/enriquetuya/cj6dnii820sxe2rlpl7y238fb"
          {...viewport}
          maxZoom={maxZoom}
          minZoom={minZoom}
          onViewportChange={this.onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
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
  setMouseLatLong: PropTypes.func
};

export default Map;
