import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import { BaseControl } from 'react-map-gl';
import { lngLatToWorld } from 'viewport-mercator-project';
import { hsvToRgb,
  hueToRgbString,
  hueIncrementToHue,
  wrapHue,
  VESSELS_HUES_INCREMENTS_NUM
} from '@globalfishingwatch/map-colors';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HEATMAP_BLUR_FACTOR,
  ACTIVITY_HIGHLIGHT_HUE,
  VESSELS_HEATMAP_DIMMING_ALPHA,
  VESSELS_RADIAL_GRADIENT_STYLE_ZOOM_THRESHOLD,
  VESSEL_CLICK_TOLERANCE_PX
} from '../config';
import HeatmapLayer from '../heatmap/HeatmapLayer';
import TracksLayer from '../tracks/TracksLayer';

const shouldUseRadialGradientStyle = zoom => zoom < VESSELS_RADIAL_GRADIENT_STYLE_ZOOM_THRESHOLD;

// builds a texture spritesheet containing
// - the heatmap style (radial gradient)
// - the circle style that is used at higher zoom levels
// - the 'bullseye' style used for encounters
// as well as a number of hues for each in a 2D grid.
// Then, only the texture frame (mesh UVs) is modified depending on the zoom level,
// in order not to have to recreate sprites
const getVesselTexture = (radius, blurFactor) => {
  const tplCanvas = document.createElement('canvas');
  const tplCtx = tplCanvas.getContext('2d');
  const diameter = radius * 2;
  const NUM_STYLES = 3;
  tplCanvas.width = (diameter * NUM_STYLES) + (NUM_STYLES - 1); // + (NUM_STYLES - 1): tiny offset between 2 frames
  tplCanvas.height = (diameter * VESSELS_HUES_INCREMENTS_NUM) + VESSELS_HUES_INCREMENTS_NUM;

  for (let hueIncrement = 0; hueIncrement < VESSELS_HUES_INCREMENTS_NUM; hueIncrement++) {
    const y = (diameter * hueIncrement) + hueIncrement;
    const yCenter = y + radius;

    // heatmap style
    let x = radius;
    const gradient = tplCtx.createRadialGradient(x, yCenter, radius * blurFactor, x, yCenter, radius);
    const hue = hueIncrementToHue(hueIncrement);
    const rgbString = hueToRgbString(hue);
    gradient.addColorStop(0, rgbString);

    const rgbOuter = hsvToRgb(wrapHue(hue + 30), 80, 100);
    gradient.addColorStop(1, `rgba(${rgbOuter.r}, ${rgbOuter.g}, ${rgbOuter.b}, 0)`);

    tplCtx.fillStyle = gradient;
    tplCtx.fillRect(0, y, diameter, diameter);

    // circle style
    x += diameter + 1; // tiny offset between 2 frames
    tplCtx.beginPath();
    tplCtx.arc(x, yCenter, radius, 0, 2 * Math.PI, false);
    tplCtx.fillStyle = rgbString;
    tplCtx.fill();

    // bullseye style
    x += diameter + 1;
    tplCtx.beginPath();
    tplCtx.arc(x, yCenter, radius * 0.4, 0, 2 * Math.PI, false);
    tplCtx.fillStyle = rgbString;
    tplCtx.fill();
    tplCtx.beginPath();
    tplCtx.arc(x, yCenter, radius * 0.95, 0, 2 * Math.PI, false);
    tplCtx.lineWidth = 1;
    tplCtx.strokeStyle = rgbString;
    tplCtx.stroke();
  }

  return tplCanvas;
};

class ActivityLayers extends BaseControl {
  componentDidMount() {
    this._build();
  }

  componentWillReceiveProps(nextProps) {
    this.props.exportNativeViewport(this._context.viewport);

    if (nextProps.viewport.width !== this.props.viewport.width || nextProps.viewport.height !== this.props.viewport.height) {
      console.log(nextProps.viewport.height)
      this._updateViewportSize(nextProps.viewport.width, nextProps.viewport.height);
    }
  }

  _build() {
    const { width, height } = this.props.viewport;

    this.pixi = new PIXI.Application({
      width,
      height,
      transparent: true,
      antialias: true
    });

    this.renderer = this.pixi.renderer;
    this.canvas = this.pixi.view;
    this.canvas.style.position = 'absolute';

    this.container.appendChild(this.canvas);

    this.stage = this.pixi.stage;

    const baseTextureCanvas = getVesselTexture(VESSELS_BASE_RADIUS, VESSELS_HEATMAP_BLUR_FACTOR);
    this.baseTexture = PIXI.Texture.fromCanvas(baseTextureCanvas);

    this.heatmapStage = new PIXI.Container();
    this.stage.addChild(this.heatmapStage);

    this.pixi.ticker.add(this._onTick);
  }

  _updateViewportSize(viewportWidth, viewportHeight) {
    this.renderer.resize(viewportWidth, viewportHeight);
  }

  toggleHeatmapDimming(dim) {
    if (this.heatmapStage === undefined) {
      return;
    }
    if (dim === true) {
      this.heatmapFadingIn = false;
    }
    this.heatmapStage.alpha = (dim === true) ? VESSELS_HEATMAP_DIMMING_ALPHA : 1;
  }

  onTouchStart = (event) => {
    if (!event.touches.length) {
      return;
    }
    this.queryHeatmapVessels(event.touches[0].clientX, event.touches[0].clientY);
  }

  onMouseMove = (event) => {
    this.queryHeatmapVessels(event.clientX, event.clientY);
  }

  queryHeatmapVessels(x, y) {
    const { viewport } = this._context;
    const [longitude, latitude] = viewport.unproject([x, y]);

    let wrappedLongitude = longitude;
    if (wrappedLongitude > 180) {
      wrappedLongitude -= 360;
    } else if (wrappedLongitude < -180) {
      wrappedLongitude += 360;
    }

    const [worldX, worldY] = lngLatToWorld([wrappedLongitude, latitude], 1);

    const toleranceRadiusInWorldUnits = VESSEL_CLICK_TOLERANCE_PX / viewport.scale;

    this.props.queryHeatmapVessels({
      longitude: wrappedLongitude,
      latitude,
      worldX,
      worldY,
      toleranceRadiusInWorldUnits
    });
  }

  _onTick = () => {
    if (this.heatmapFadingIn === true && this.heatmapStage.alpha < 1) {
      this._heatmapFadeinStep();
    }
  }

  _startHeatmapFadein() {
    this.heatmapFadingIn = true;
    this.heatmapFadeinStartTimestamp = undefined;
  }

  _heatmapFadeinStep() {
    if (this.heatmapFadeinStartTimestamp === undefined) {
      this.heatmapFadeinStartTimestamp = Date.now();
    }
    const timeElapsed = (Date.now() - this.heatmapFadeinStartTimestamp) / 1000;
    let alpha = this.heatmapStage.alpha + ((1 - this.heatmapStage.alpha) * timeElapsed);
    if (alpha >= 1) {
      alpha = 1;
      this.heatmapFadingIn = false;
    }
    this.heatmapStage.alpha = alpha;
  }

  // FIXME move to container?
  _getHighlightData(highlightedVessels, highlightedClickedVessel, heatmapLayers) {
    const hue = ACTIVITY_HIGHLIGHT_HUE;
    let highlightLayerData = {
      id: '__HIGHLIGHT__',
      visible: true,
      opacity: 1,
      hue: ACTIVITY_HIGHLIGHT_HUE
    };
    let highlightFilters = [];

    if (
      highlightedVessels !== undefined
      && highlightedVessels.layer !== undefined
      && highlightedVessels.foundVessels !== undefined
      && highlightedVessels.isEmpty !== true
    ) {
      const sourceLayer = heatmapLayers.find(l => l.id === highlightedVessels.layer.id);
      highlightLayerData = { highlightLayerData, ...sourceLayer };
      highlightFilters = highlightedVessels.foundVessels.map(vessel => ({
        hue,
        filterValues: {
          series: [vessel.series]
        }
      }));

    } else if (highlightedClickedVessel !== null) {
      const sourceLayer = heatmapLayers.find(l => l.id === highlightedClickedVessel.layer.id);
      highlightLayerData = { highlightLayerData, ...sourceLayer };
      highlightFilters = [{
        hue,
        filterValues: {
          series: [highlightedClickedVessel.seriesgroup]
        }
      }];
    }
    return {
      highlightLayerData,
      highlightFilters
    };
  }
  _render() {
    const {
      zoom,
      heatmapLayers,
      temporalExtentIndexes,
      highlightTemporalExtentIndexes,
      highlightedVessels,
      highlightedClickedVessel,
      tracks,
      leftWorldScaled,
      rightWorldScaled
    } = this.props;
    const { viewport } = this._context;


    const startIndex = temporalExtentIndexes[0];
    const endIndex = temporalExtentIndexes[1];
    const useRadialGradientStyle = shouldUseRadialGradientStyle(zoom);

    if (highlightedVessels.isEmpty !== true) {
      this.toggleHeatmapDimming(true);
    }
    if (highlightedVessels.isEmpty === true && tracks.length === 0) {
      this._startHeatmapFadein();
    }
    if (this.renderer) {
      const err = this.renderer.gl.getError();
      if (err !== 0) console.log(err);
    }

    const { highlightLayerData, highlightFilters } = this._getHighlightData(highlightedVessels, highlightedClickedVessel, heatmapLayers);

    return (<div
      ref={(ref) => { this.container = ref; }}
      style={{ position: 'absolute' }}
      onMouseMove={this.onMouseMove}
      onTouchStart={this.onTouchStart}
    >
      {heatmapLayers.map(layer => (
        <HeatmapLayer
          key={layer.id}
          layer={layer}
          filters={layer.filters || []}
          viewport={viewport}
          startIndex={startIndex}
          endIndex={endIndex}
          baseTexture={this.baseTexture}
          rootStage={this.heatmapStage}
          useRadialGradientStyle={useRadialGradientStyle}
          customRenderingStyle={{}}
          viewportLeft={leftWorldScaled}
          viewportRight={rightWorldScaled}
        />)
      )}
      {this.stage !== undefined &&
        <HeatmapLayer
          key="highlighted"
          layer={highlightLayerData}
          filters={highlightFilters}
          viewport={viewport}
          startIndex={startIndex}
          endIndex={endIndex}
          baseTexture={this.baseTexture}
          rootStage={this.heatmapStage}
          useRadialGradientStyle={useRadialGradientStyle}
          customRenderingStyle={{ defaultOpacity: 1, defaultSize: 1 }}
          viewportLeft={leftWorldScaled}
          viewportRight={rightWorldScaled}
        />
      }
      {this.stage !== undefined &&
        <TracksLayer
          tracks={tracks}
          viewport={viewport}
          zoom={zoom}
          startIndex={startIndex}
          endIndex={endIndex}
          highlightTemporalExtentIndexes={highlightTemporalExtentIndexes}
          rootStage={this.stage}
        />
      }
    </div>);
  }
}

ActivityLayers.propTypes = {
  zoom: PropTypes.number,
  heatmapLayers: PropTypes.array,
  temporalExtentIndexes: PropTypes.array,
  highlightTemporalExtentIndexes: PropTypes.array,
  highlightedVessels: PropTypes.object,
  highlightedClickedVessel: PropTypes.object,
  tracks: PropTypes.array,
  queryHeatmapVessels: PropTypes.func,
  exportNativeViewport: PropTypes.func,
  leftWorldScaled: PropTypes.number,
  rightWorldScaled: PropTypes.number
};

ActivityLayers.contextTypes = {
  viewport: PropTypes.object
};

export default ActivityLayers;
