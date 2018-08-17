import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { geoOrthographic, geoPath } from 'd3-geo'; // eslint-disable-line
import { feature } from 'topojson-client';
import { MINI_GLOBE_SETTINGS } from 'config';
import MiniGlobeStyles from './miniGlobe.scss';

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
    if (this.props.latitude !== nextProps.latitude || this.props.longitude !== nextProps.longitude) {
      this.recenter();
    }
  }

  setProjection() {
    const { latitude, longitude } = this.props;
    const projection = geoOrthographic()
      .scale(MINI_GLOBE_SETTINGS.scale)
      .clipAngle(90)
      .translate([MINI_GLOBE_SETTINGS.svgWidth / 2, MINI_GLOBE_SETTINGS.svgWidth / 2]);
    projection.rotate([-longitude, -latitude]);
    this.setState({ projection });
  }

  recenter() {
    if (this.state.projection) {
      const { latitude, longitude } = this.props;
      const updatedProjection = this.state.projection;
      this.state.projection.rotate([-longitude, -latitude]);
      this.setState({ projection: updatedProjection });
    }
  }

  render() {
    const { zoom, viewportBoundsGeoJSON } = this.props;
    const { svgWidth, viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = MINI_GLOBE_SETTINGS;

    return (
      <div className={MiniGlobeStyles.miniGlobe}>
        <div className={MiniGlobeStyles.svgContainer} >
          <svg
            width={svgWidth}
            height={svgWidth}
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
            className={MiniGlobeStyles.globeSvg}
          >
            <g className="geometries">
              {
                this.worldData.map((d, i) => (
                  <path
                    key={`path-${i}`}
                    d={geoPath().projection(this.state.projection)(d)}
                  />
                ))
              }
              { zoom > MINI_GLOBE_SETTINGS.minZoom &&
                <path
                  key="viewport"
                  d={geoPath().projection(this.state.projection)(viewportBoundsGeoJSON)}
                  className={MiniGlobeStyles.viewport}
                />
              }
            </g>
          </svg>
        </div>
        {/* <div className={MiniGlobeStyles.zone}>
          <span>
            Zone
          </span>
        </div> */}
      </div>
    );
  }
}

MiniGlobe.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  viewportBoundsGeoJSON: PropTypes.object
};

export default MiniGlobe;
