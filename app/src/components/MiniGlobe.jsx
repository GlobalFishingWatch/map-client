import React, { Component } from 'react';
import MiniGlobeStyles from 'styles/components/miniGlobe.scss';
import { geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const jsonData = require('assets/topoJson/world.json');

class MiniGlobe extends Component {

  constructor() {
    super();

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
                  d={geoPath().projection(this.projection())(d)}
                  className="countries"
                  fill="#33FF33"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
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
