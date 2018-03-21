import React from 'react';
import MapGL from 'react-map-gl';
import mapStyles from 'styles/components/map.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';

class Map extends React.Component {
  onViewportChange = (viewport) => {
    this.props.setViewport(viewport);
  }

  render() {
    const { viewport } = this.props;
    console.log(viewport)
    return (
      <div
        id="map"
        className={mapStyles.map}
        style={{ height: '100%' }}
      >
        <MapGL
          ref={(ref) => { this._ref = ref; }}
          mapStyle="mapbox://styles/enriquetuya/cj6dnii820sxe2rlpl7y238fb"
          {...viewport}
          onViewportChange={this.onViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </div>
    );
  }
}

Map.propTypes = {
  viewport: PropTypes.object,
  setViewport: PropTypes.func
};

export default Map;
