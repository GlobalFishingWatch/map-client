import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import { lngLatToWorld, pixelsToWorld } from 'viewport-mercator-project';
import { hsvToRgb, hueToRgbString, hueIncrementToHue, wrapHue } from 'utils/colors';
import { LAYER_TYPES } from 'constants';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HEATMAP_BLUR_FACTOR,
  VESSELS_HUES_INCREMENTS_NUM,
  TIMELINE_MAX_STEPS,
  ACTIVITY_HIGHLIGHT_HUE,
  VESSELS_HEATMAP_DIMMING_ALPHA,
  VESSELS_RADIAL_GRADIENT_STYLE_ZOOM_THRESHOLD,
  VESSEL_CLICK_TOLERANCE_PX
} from 'config';
import HeatmapLayer from './HeatmapLayer.jsx';
import TracksLayer from './TracksLayer.jsx';

const MAX_SPRITES_FACTOR = 0.002;

const shouldUseRadialGradientStyle = zoom => zoom < VESSELS_RADIAL_GRADIENT_STYLE_ZOOM_THRESHOLD;

const getNumSpritesPerStep = (viewportWidth, viewportHeight) => Math.round(viewportWidth * viewportHeight * MAX_SPRITES_FACTOR);

const getNumSprites = (viewportWidth, viewportHeight) => getNumSpritesPerStep(viewportWidth, viewportHeight) * TIMELINE_MAX_STEPS;

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

// TODO this should be in a reducer or container
// TODO remove vesselTracks in favor of tracks. vesselTracks are the tracks attached to the vesselInfo store,
// which will eventually migrate to their own tracks store (already implemented with encounters tracks)
const getTracks = (vesselTracks, tracks) => vesselTracks
  .filter(vessel => vessel.track && (vessel.visible || vessel.shownInInfoPanel))
  .map(vessel => ({
    data: vessel.track.data,
    selectedSeries: vessel.track.selectedSeries,
    color: vessel.color
  }))
  .concat(
    tracks
      .filter(track => track.show)
      .map(track => ({
        data: track.data,
        selectedSeries: track.series,
        color: track.color
      }))
  );

class ActivityLayers extends React.Component {
  componentDidMount() {
    this._build();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.viewport.width !== this.context.viewport.width || nextContext.viewport.height !== this.context.viewport.height) {
      this._updateViewportSize(nextContext.viewport.width, nextContext.viewport.height);
    }
  }

  _build() {
    const { viewport } = this.context;

    this.pixi = new PIXI.Application({
      width: viewport.width,
      height: viewport.height,
      transparent: true,
      antialias: true
    });

    // this.pixi.ticker.add(this._onTickBound);

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
    this.maxSprites = getNumSprites(viewportWidth, viewportHeight);
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

  onMouseMove = (event) => {
    const { viewport } = this.context;
    const [longitude, latitude] = viewport.unproject([event.clientX, event.clientY]);
    const [worldX, worldY] = lngLatToWorld([longitude, latitude], 1);

    const toleranceRadiusInWorldUnits = VESSEL_CLICK_TOLERANCE_PX / viewport.scale;

    this.props.queryHeatmapVessels({
      longitude,
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
    if (
      highlightedVessels !== undefined
      && highlightedVessels.layerId !== undefined
      && highlightedVessels.foundVessels !== undefined
      && highlightedVessels.isEmpty !== true
    ) {
      return {
        highlightData: heatmapLayers[highlightedVessels.layerId],
        highlightFilters: highlightedVessels.foundVessels.map(vessel => ({
          hue,
          filterValues: {
            series: [vessel.series]
          }
        }))
      };
    } else if (highlightedClickedVessel !== null) {
      return {
        highlightData: heatmapLayers[highlightedClickedVessel.layerId],
        highlightFilters: [{
          hue,
          filterValues: {
            series: [highlightedClickedVessel.seriesgroup]
          }
        }]
      };
    }
    return {
      highlightData: null,
      highlightFilters: []
    };
  }

  render() {
    const layers = this.props.layers.filter(layer => layer.type === LAYER_TYPES.Heatmap && layer.added === true);
    const {
      zoom,
      layerFilters,
      heatmapLayers,
      timelineInnerExtentIndexes,
      timelineOverExtentIndexes,
      highlightedVessels,
      highlightedClickedVessel,
      vesselTracks,
      tracks
    } = this.props;
    const { viewport } = this.context;
    const startIndex = timelineInnerExtentIndexes[0];
    const endIndex = timelineInnerExtentIndexes[1];
    const useRadialGradientStyle = shouldUseRadialGradientStyle(zoom);

    const nextTracks = getTracks(vesselTracks, tracks);
    if (highlightedVessels.isEmpty !== true) {
      this.toggleHeatmapDimming(true);
    }
    if (highlightedVessels.isEmpty === true && nextTracks.length === 0) {
      this._startHeatmapFadein();
    }

    const { highlightData, highlightFilters } = this._getHighlightData(highlightedVessels, highlightedClickedVessel, heatmapLayers);

    // compute left and right offsets to deal with antimeridian issue
    const viewportTopLeftWorld = pixelsToWorld([0, 0], viewport.pixelUnprojectionMatrix);
    const viewportTopRightWorld = pixelsToWorld([viewport.width, 0], viewport.pixelUnprojectionMatrix);
    const viewportLeft = viewportTopLeftWorld[0] / viewport.scale;
    const viewportRight = viewportTopRightWorld[0] / viewport.scale;

    return (<div
      ref={(ref) => { this.container = ref; }}
      style={{ position: 'absolute' }}
      onMouseMove={this.onMouseMove}
    >
      {layers.map(layer => (
        <HeatmapLayer
          key={layer.id}
          layer={layer}
          data={heatmapLayers[layer.id]}
          filters={layerFilters[layer.id] || []}
          viewport={viewport}
          startIndex={startIndex}
          endIndex={endIndex}
          maxSprites={this.maxSprites}
          baseTexture={this.baseTexture}
          rootStage={this.heatmapStage}
          useRadialGradientStyle={useRadialGradientStyle}
          customRenderingStyle={{}}
          viewportLeft={viewportLeft}
          viewportRight={viewportRight}
        />)
      )}
      {this.stage !== undefined &&
        <HeatmapLayer
          key="highlighted"
          layer={{ id: '__HIGHLIGHT__', visible: true, opacity: 1, hue: ACTIVITY_HIGHLIGHT_HUE }}
          data={highlightData}
          filters={highlightFilters}
          viewport={viewport}
          startIndex={startIndex}
          endIndex={endIndex}
          maxSprites={this.maxSprites}
          baseTexture={this.baseTexture}
          rootStage={this.heatmapStage}
          useRadialGradientStyle={useRadialGradientStyle}
          customRenderingStyle={{ defaultOpacity: 1, defaultSize: 1 }}
          viewportLeft={viewportLeft}
          viewportRight={viewportRight}
        />
      }
      {this.stage !== undefined &&
        <TracksLayer
          tracks={nextTracks}
          viewport={viewport}
          zoom={zoom}
          startIndex={startIndex}
          endIndex={endIndex}
          timelineOverExtentIndexes={timelineOverExtentIndexes}
          rootStage={this.stage}
          viewportLeft={viewportLeft}
          viewportRight={viewportRight}
        />
      }
    </div>);
  }
}

ActivityLayers.propTypes = {
  zoom: PropTypes.number,
  layers: PropTypes.array,
  heatmapLayers: PropTypes.object,
  timelineInnerExtentIndexes: PropTypes.array,
  timelineOverExtentIndexes: PropTypes.array,
  layerFilters: PropTypes.object,
  highlightedVessels: PropTypes.object,
  highlightedClickedVessel: PropTypes.object,
  vesselTracks: PropTypes.array,
  tracks: PropTypes.array,
  queryHeatmapVessels: PropTypes.func
};

ActivityLayers.contextTypes = {
  viewport: PropTypes.object
};

export default ActivityLayers;
