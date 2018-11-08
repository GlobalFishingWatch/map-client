import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { geoOrthographic, geoPath } from 'd3-geo'; // eslint-disable-line
import { feature } from 'topojson-client';
import './miniGlobe.css';

const DEFAULT_SETTINGS = {
  viewBoxX: -75,
  viewBoxY: -75,
  viewBoxWidth: 200,
  viewBoxHeight: 200,
  svgWidth: 40,
  scale: 100,
  minZoom: 2.5,
  center: [0, 0],
  zoom: 3
};

const jsonData = require('assets/topoJson/ne_110m_land.json');

class MiniGlobe extends Component {

  constructor() {
    super();
    this.state = {
      projection: null
    };

    this.worldData = feature(jsonData, jsonData.objects.land).features;
  }

  componentDidMount() {
    this.setProjection();
  }

  componentDidUpdate(nextProps) {
    if (this.props.center[0] !== nextProps.center[0] || this.props.center[1] !== nextProps.center[1]) {
      this.recenter();
    }
  }

  setProjection() {
    const { center } = this.props;
    const [latitude, longitude] = center;
    const projection = geoOrthographic()
      .scale(DEFAULT_SETTINGS.scale)
      .clipAngle(90)
      .translate([DEFAULT_SETTINGS.svgWidth / 2, DEFAULT_SETTINGS.svgWidth / 2]);
    projection.rotate([-longitude, -latitude]);
    this.setState({ projection });
  }

  recenter() {
    if (this.state.projection) {
      const { center } = this.props;
      const [latitude, longitude] = center;
      const updatedProjection = this.state.projection;
      this.state.projection.rotate([-longitude, -latitude]);
      this.setState({ projection: updatedProjection });
    }
  }

  render() {
    const { zoom, bounds } = this.props;
    if (bounds === undefined) {
      return null;
    }

    const { north, south, west, east } = bounds;
    const viewportBoundsGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [west, north],
            [east, north],
            [east, south],
            [west, south],
            [west, north]
          ]
        ]
      }
    };


    const { svgWidth, viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = DEFAULT_SETTINGS;

    return (
      <div className="miniGlobe">
        <div className="miniGlobeSvgContainer" >
          <svg
            width={svgWidth}
            height={svgWidth}
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
            className="miniGlobeGlobeSvg"
          >
            <g>
              {
                this.worldData.map((d, i) => (
                  <path
                    key={`path-${i}`}
                    d={geoPath().projection(this.state.projection)(d)}
                  />
                ))
              }
              { zoom > DEFAULT_SETTINGS.minZoom &&
                <path
                  key="viewport"
                  d={geoPath().projection(this.state.projection)(viewportBoundsGeoJSON)}
                  className="miniGlobeViewport"
                />
              }
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

MiniGlobe.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
  bounds: PropTypes.shape({
    north: PropTypes.number,
    south: PropTypes.number,
    west: PropTypes.number,
    east: PropTypes.number
  })
};

MiniGlobe.defaultProps = {
  center: DEFAULT_SETTINGS.center,
  zoom: DEFAULT_SETTINGS.zoom
};

export default MiniGlobe;
