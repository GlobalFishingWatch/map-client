import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MiniGlobeStyles from 'styles/components/miniGlobe.scss';
import { geoOrthographic, geoPath } from 'd3-geo'; // eslint-disable-line
import { feature } from 'topojson-client';
import { MINI_GLOBE_SETTINGS } from 'config';

const jsonData = require('assets/topoJson/ne_110m_land.json');

class MiniGlobe extends Component {

  constructor() {
    super();
    this.worldData = feature(jsonData, jsonData.objects.land).features;
    this.state = {
      projection: null
    };
  }

  componentDidMount() {
    this.setProjection();
  }

  componentDidUpdate(nextProps) {
    if (this.props.center !== nextProps.center) {
      this.recenter();
    }
  }

  setProjection() {
    const center = this.props.center;
    const projection = geoOrthographic()
      .scale(MINI_GLOBE_SETTINGS.scale)
      .clipAngle(90)
      .translate([MINI_GLOBE_SETTINGS.svgWidth / 2, MINI_GLOBE_SETTINGS.svgWidth / 2]);
    projection.rotate([-center.lng, -center.lat]);
    this.setState({ projection });
  }

  recenter() {
    if (this.state.projection) {
      const center = this.props.center;
      const updatedProjection = this.state.projection;
      this.state.projection.rotate([-center.lng, -center.lat]);
      this.setState({ projection: updatedProjection });
    }
  }


  render() {
    const { svgWidth, viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight } = MINI_GLOBE_SETTINGS;
    return (
      <div id="miniGlobe" className={MiniGlobeStyles.miniGlobe} >
        <div className={MiniGlobeStyles.zoneMarker} />
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
                  className="land"
                />
              ))
            }
          </g>
        </svg>
        <div className={MiniGlobeStyles.zone}>
          <span>
            Zone
          </span>
        </div>
      </div>
    );
  }
}

MiniGlobe.propTypes = {
  center: PropTypes.object.isRequired
};

export default MiniGlobe;
