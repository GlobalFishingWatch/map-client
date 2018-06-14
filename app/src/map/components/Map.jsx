import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import MapGL, { Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapGLConfig from 'react-map-gl/src/config';
import mapStyles from 'styles/components/map.scss';
import PopupStyles from 'styles/components/map/popup.scss';
import ActivityLayers from 'activityLayers/containers/ActivityLayers';
import StaticLayerPopup from 'map/containers/StaticLayerPopup';

class Map extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
    // there is a problem with the container width computation (only with "fat scrollbar" browser/os configs),
    // seems like the panels with scrollbars are taken into account or smth
    window.setTimeout(() => this._resize(), 10000);
    // sadly mapbox gl's options.logoPosition is not exposed by react-map-gl, so we have to move around some DOM
    const logo = this._mapContainerRef.querySelector('.mapboxgl-ctrl-logo');
    this._mapContainerRef.querySelector('.mapboxgl-ctrl-bottom-right').appendChild(logo);
    this._mapContainerRef.querySelector('.mapboxgl-ctrl-bottom-left').innerHTML = '';
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    if (this._mapContainerRef === undefined) {
      console.warn('Cant set viewport on a map that hasnt finished intanciating yet');
      return;
    }
    const mapContainerStyle = window.getComputedStyle(this._mapContainerRef);
    const width = parseInt(mapContainerStyle.width, 10);
    const height = parseInt(mapContainerStyle.height, 10) + 1;
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
    if (event.target !== undefined && event.target.classList.contains('js-preventMapInteraction')) {
      return;
    }
    this.props.mapHover(event.lngLat[1], event.lngLat[0], event.features);
  }

  onClick = (event) => {
    if (event.target !== undefined) {
      if (event.target.classList.contains('js-close')) {
        this.props.clearPopup();
      }
      if (event.target.classList.contains('js-preventMapInteraction')) {
        return;
      }
    }

    this.props.mapClick(event.lngLat[1], event.lngLat[0], event.features);
  }

  render() {
    const { viewport, maxZoom, minZoom, transitionEnd, mapStyle, popup, hoverPopup, cursor } = this.props;
    return (
      <div
        id="map"
        className={mapStyles.map}
        ref={(ref) => { this._mapContainerRef = ref; }}
      >
        <MapGL
          onTransitionEnd={transitionEnd}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onHover={this.onHover}
          onClick={this.onClick}
          getCursor={({ isDragging }) => {
            if (cursor === null) {
              return (isDragging) ? MapGLConfig.CURSOR.GRABBING : MapGLConfig.CURSOR.GRAB;
            }
            return cursor;
          }}
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
              offsetTop={-10}
              tipSize={4}
            >
              <div className={classnames(PopupStyles.popup, PopupStyles._compact)}>
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
  clearPopup: PropTypes.func,
  transitionEnd: PropTypes.func,
  cursor: PropTypes.string
};

export default Map;
