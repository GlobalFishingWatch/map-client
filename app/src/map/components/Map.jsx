import React from 'react';
import MapGL from 'react-map-gl';
import mapStyles from 'styles/components/map.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import ActivityLayers from 'activityLayers/containers/ActivityLayers.js';

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

  render() {
    const { viewport } = this.props;
    return (
      <div
        id="map"
        className={mapStyles.map}
        style={{ height: '100%' }}
        ref={(ref) => { this._mapContainerRef = ref; }}
      >
        <MapGL
          mapStyle="mapbox://styles/enriquetuya/cj6dnii820sxe2rlpl7y238fb"
          {...viewport}
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
  setViewport: PropTypes.func
};

export default Map;
