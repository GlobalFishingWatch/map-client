import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import { worldToPixels, lngLatToWorld } from 'viewport-mercator-project';
import { hsvToRgb, hueToRgbString, hueIncrementToHue, wrapHue } from 'utils/colors';
import { LAYER_TYPES } from 'constants';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HEATMAP_BLUR_FACTOR,
  VESSELS_HUES_INCREMENTS_NUM,
  TIMELINE_MAX_STEPS,
  HEATMAP_TRACK_HIGHLIGHT_HUE,
  VESSELS_HEATMAP_DIMMING_ALPHA,
  VESSELS_RADIAL_GRADIENT_STYLE_ZOOM_THRESHOLD
} from 'config';
import HeatmapLayer from './HeatmapLayer.jsx';

const MAX_SPRITES_FACTOR = 0.002;

const shouldUseRadialGradientStyle = zoom => zoom < VESSELS_RADIAL_GRADIENT_STYLE_ZOOM_THRESHOLD;

class ActivityLayers extends React.Component {
  componentDidMount() {
    this._build();
    this._redraw();
  }

  componentDidUpdate() {
    this._redraw();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.viewport.width !== this.context.viewport.width || nextContext.viewport.height !== this.context.viewport.height) {
      this._updateViewportSize(nextContext.viewport.width, nextContext.viewport.height);
    }

    // console.log(nextProps.heatmapLayers);
    // console.log(nextProps.layers);

  }

  _build() {
    const { viewport } = this.context;

    this.pixi = new PIXI.Application({
      width: viewport.width,
      height: viewport.width,
      transparent: true,
      antialias: true
    });

    // this.pixi.ticker.add(this._onTickBound);

    this.renderer = this.pixi.renderer;
    this.canvas = this.pixi.view;
    this.canvas.style.position = 'absolute';

    this.container.appendChild(this.canvas);

    this.stage = this.pixi.stage;

    const baseTextureCanvas = this._getVesselTexture(VESSELS_BASE_RADIUS, VESSELS_HEATMAP_BLUR_FACTOR);
    this.baseTexture = PIXI.Texture.fromCanvas(baseTextureCanvas);

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(4, 0xffd900, 1);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(470, 90, 60);
    graphics.endFill();
    this.graphics = graphics;

    this.stage.addChild(graphics);
  }

  // builds a texture spritesheet containing
  // - the heatmap style (radial gradient)
  // - the circle style that is used at higher zoom levels
  // - the 'bullseye' style used for encounters
  // as well as a number of hues for each in a 2D grid.
  // Then, only the texture frame (mesh UVs) is modified depending on the zoom level,
  // in order not to have to recreate sprites
  _getVesselTexture(radius, blurFactor) {
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
  }

  _redraw() {
    const { viewport } = this.context;

    const PARIS = [2.373046875, 48.80686346108517];
    // console.log(PARIS)
    // console.log(viewport.scale)
    const parisWorld = lngLatToWorld(PARIS, 1);
    // console.log(parisWorld)
    // console.log(worldToLngLat(parisWorld, 1 ))

    const scale = viewport.scale;
    const parisPx = worldToPixels([parisWorld[0] * scale, parisWorld[1] * scale], viewport.pixelProjectionMatrix);

    this.graphics.lineStyle(4, 0xffd900, 1);
    this.graphics.beginFill(0xFFFF0B, 0.5);
    this.graphics.drawCircle(parisPx[0], parisPx[1], 10);
    this.graphics.endFill();

  }

  _updateViewportSize(viewportWidth, viewportHeight) {
    this.renderer.resize(viewportWidth, viewportHeight);
    this.maxSprites = this._getNumSprites(viewportWidth, viewportHeight);
  }

  _getNumSpritesPerStep(viewportWidth, viewportHeight) {
    return Math.round(viewportWidth * viewportHeight * MAX_SPRITES_FACTOR);
  }

  _getNumSprites(viewportWidth, viewportHeight) {
    return this._getNumSpritesPerStep(viewportWidth, viewportHeight) * TIMELINE_MAX_STEPS;
  }

  render() {
    const layers = this.props.layers.filter(layer => layer.type === LAYER_TYPES.Heatmap && layer.added === true);
    const { zoom, layerFilters, heatmapLayers, timelineInnerExtentIndexes } = this.props;
    const startIndex = timelineInnerExtentIndexes[0];
    const endIndex = timelineInnerExtentIndexes[1];
    const useRadialGradientStyle = shouldUseRadialGradientStyle(zoom);

    return (<div
      ref={(ref) => { this.container = ref; }}
      style={{ position: 'absolute' }}
    >
      {layers.map(layer => (
        <HeatmapLayer
          key={layer.id}
          layer={layer}
          data={heatmapLayers[layer.id]}
          filters={layerFilters[layer.id]}
          startIndex={startIndex}
          endIndex={endIndex}
          maxSprites={this.maxSprites}
          baseTexture={this.baseTexture}
          rootStage={this.stage}
          useRadialGradientStyle={useRadialGradientStyle}
          customRenderingStyle={{}}
        />)
      )}
    </div>);
  }
}

ActivityLayers.propTypes = {
  zoom: PropTypes.number,
  layers: PropTypes.array,
  heatmapLayers: PropTypes.object,
  timelineInnerExtentIndexes: PropTypes.array,
  layerFilters: PropTypes.object
};

ActivityLayers.contextTypes = {
  viewport: PropTypes.object
};

export default ActivityLayers;
