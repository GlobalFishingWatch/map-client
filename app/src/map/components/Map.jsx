import React from 'react';
import MapGL, { Popup } from 'react-map-gl';
import mapStyles from 'styles/components/map.scss';
import PopupStyles from 'styles/components/map/popup.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import ActivityLayers from 'activityLayers/containers/ActivityLayers';
import StaticLayerPopup from 'map/containers/StaticLayerPopup';

// import {experimental} from 'react-map-gl';
//
// class MapControls extends experimental.MapControls {
//   constructor() {
//     super();
//     this.events = ['panstart', 'panend', 'click'];
//   }
//
//   // Override the default handler in MapControls
//   handleEvent(event) {
//     console.log(event.type);
//     console.log(event);
//     console.log(event.features);
//     // if (event.type === 'mousemove') {
//     //   console.log('hi', event);
//     // }
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
//
// const controls = new MapControls();


class Map extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();

    // sadly mapbox gl's options.logoPosition is not exposed by react-map-gl, so we have to move around some DOM
    const logo = this._mapContainerRef.querySelector('.mapboxgl-ctrl-logo');
    this._mapContainerRef.querySelector('.mapboxgl-ctrl-bottom-right').appendChild(logo);
    this._mapContainerRef.querySelector('.mapboxgl-ctrl-bottom-left').innerHTML = '';
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
    this.props.mapHover(event.lngLat[1], event.lngLat[0], event.features);
  }

  onClick = (event) => {
    this.props.mapClick(event.lngLat[1], event.lngLat[0], event.features);
  }

  render() {
    const { viewport, maxZoom, minZoom, transitionEnd, mapStyle, popup, hoverPopup } = this.props;
    return (
      <div
        id="map"
        className={mapStyles.map}
        style={{ height: '100%' }}
        ref={(ref) => { this._mapContainerRef = ref; }}
      >
        <MapGL
          onTransitionEnd={transitionEnd}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onHover={this.onHover}
          onClick={this.onClick}
          mapStyle={mapStyle}
          {...viewport}
          maxZoom={maxZoom}
          minZoom={minZoom}
          onViewportChange={this.onViewportChange}
        >
          <ActivityLayers />
          {popup !== null &&
            <StaticLayerPopup forceRender={Math.random()} />
          }
          {hoverPopup !== null &&
            <Popup
              latitude={hoverPopup.latitude}
              longitude={hoverPopup.longitude}
              closeButton={false}
              anchor="bottom"
              offsetTop={-40}
              tipSize={4}
            >
              <div className={PopupStyles.customInfowindow}>
                {hoverPopup.layerTitle}: {hoverPopup.featureTitle}
              </div>
            </Popup>
          }
        </MapGL>
      </div>
    );
  }
}

Map.propTypes = {
  viewport: PropTypes.object,
  mapStyle: PropTypes.object,
  popup: PropTypes.object,
  hoverPopup: PropTypes.object,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  setViewport: PropTypes.func,
  mapHover: PropTypes.func,
  mapClick: PropTypes.func,
  transitionEnd: PropTypes.func,
  setAttribution: PropTypes.func
};

export default Map;
