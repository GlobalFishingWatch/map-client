import React, { Component } from 'react';
import MiniGlobeStyles from 'styles/components/miniGlobe.scss';
import { geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const jsonData = require('assets/topoJson/ne_110m_land.json');

class MiniGlobe extends Component {

  constructor() {
    super();
    this.worldData = feature(jsonData, jsonData.objects.land).features;

    this.worldData = feature(jsonData, jsonData.objects.countries).features;
  }

  projection() {
    return geoOrthographic()
      .scale(100)
      .translate([800 / 2, 450 / 2]);
  }

  render() {
    return (
      <div id="miniGlobe" className={MiniGlobeStyles.miniGlobe} >
        <svg width={50} height={50} viewBox="0 0 400 400">
          <g className="countries">
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
      </div>
    );
  }
}

export default MiniGlobe;
