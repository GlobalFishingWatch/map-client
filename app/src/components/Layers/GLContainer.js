/* global PIXI */
import 'pixi.js';
import { hsvToRgb, hueToRgbString } from 'util/hsvToRgb';
import BaseOverlay from 'components/Layers/BaseOverlay';
import HeatmapLayer from 'components/Layers/HeatmapLayer';
import HeatmapSubLayer from 'components/Layers/HeatmapSubLayer';
import TracksLayer from 'components/Layers/TracksLayer';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HEATMAP_BLUR_FACTOR,
  VESSELS_HUES_INCREMENTS_NUM,
  VESSELS_HUES_INCREMENT,
  TIMELINE_MAX_STEPS,
  HEATMAP_TRACK_HIGHLIGHT_HUE,
  VESSELS_HEATMAP_DIMMING_ALPHA
} from 'constants';

const MAX_SPRITES_FACTOR = 0.002;

export default class GLContainer extends BaseOverlay {
  constructor(viewportWidth, viewportHeight, addedCallback) {
    super();
    this.layers = [];
    this.timeIndexDelta = 0;
    this.renderingEnabled = true;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    this.addedCallback = addedCallback;
    this._heatmapFadeinStepBound = this._heatmapFadeinStep.bind(this);

    this.currentInnerStartIndex = 0;
    this.currentInnerEndIndex = 0;

    this._frameBound = this._frame.bind(this);
    window.requestAnimationFrame(this._frameBound);

    this._build();
  }

  _build() {
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';

    this.renderer = new PIXI.WebGLRenderer(this.viewportWidth, this.viewportHeight, { transparent: true, antialias: true });

    this.canvas = this.renderer.view;
    this.canvas.style.position = 'absolute';

    this.container.appendChild(this.canvas);

    this.stage = new PIXI.Container();

    const baseTextureCanvas = this._getVesselTexture(VESSELS_BASE_RADIUS, VESSELS_HEATMAP_BLUR_FACTOR);
    this.baseTexture = PIXI.Texture.fromCanvas(baseTextureCanvas);

    this.heatmapStage = new PIXI.Container();
    this.stage.addChild(this.heatmapStage);

    this.heatmapHighlight = new HeatmapSubLayer(this.baseTexture, this._getNumSprites(), true);
    this.heatmapHighlight.setFilters('ALL', HEATMAP_TRACK_HIGHLIGHT_HUE);
    this.stage.addChild(this.heatmapHighlight.stage);

    this.tracksLayer = new TracksLayer();
    this.stage.addChild(this.tracksLayer.stage);


    // uncomment to debug spritesheet
    // this.container.appendChild(baseTextureCanvas);
  }

  // builds a texture spritesheet containing both the heatmap style (radial gradient)
  // and the circle style that is used at higher zoom levels, as well as a number of hues for each
  // in a 2D grid.
  // Then, only the texture frame (mesh UVs) is modified depending on the zoom level,
  // in order not to have to recreate sprites
  _getVesselTexture(radius, blurFactor) {
    const tplCanvas = document.createElement('canvas');
    const tplCtx = tplCanvas.getContext('2d');
    const diameter = radius * 2;
    tplCanvas.width = (diameter * 2) + 1; // tiny offset between 2 frames
    tplCanvas.height = (diameter * VESSELS_HUES_INCREMENTS_NUM) + VESSELS_HUES_INCREMENTS_NUM;

    for (let hueIncrement = 0; hueIncrement < VESSELS_HUES_INCREMENTS_NUM; hueIncrement++) {
      const y = (diameter * hueIncrement) + hueIncrement;
      const yCenter = y + radius;

      // heatmap style
      let x = radius;
      const gradient = tplCtx.createRadialGradient(x, yCenter, radius * blurFactor, x, yCenter, radius);
      const hue = hueIncrement * VESSELS_HUES_INCREMENT;
      const rgbString = hueToRgbString(hue);
      gradient.addColorStop(0, rgbString);

      const rgbOuter = hsvToRgb(Math.min(360, hue + 30), 80, 100);
      gradient.addColorStop(1, `rgba(${rgbOuter.r}, ${rgbOuter.g}, ${rgbOuter.b}, 0)`);

      tplCtx.fillStyle = gradient;
      tplCtx.fillRect(0, y, diameter, diameter);

      // circle style
      x += diameter + 1; // tiny offset between 2 frames
      tplCtx.beginPath();
      tplCtx.arc(x, yCenter, radius, 0, 2 * Math.PI, false);
      tplCtx.fillStyle = rgbString;
      tplCtx.fill();
    }

    return tplCanvas;
  }

  // GMaps overlay logic
  onAdd() {
    const panes = this.getPanes();
    // GLContainer always stays on top, using overlayImage pane instead of default overlayLayer
    // see https://developers.google.com/maps/documentation/javascript/customoverlays
    panes.overlayImage.appendChild(this.container);
    this.map = this.getMap();
    this.layerProjection = this.getProjection();
    this.mapProjection = this.map.getProjection();
    this.addedCallback(this.layerProjection);
  }

  onRemove() {}

  draw() {}

  _frame(timestamp) {
    if (this.renderingEnabled) {
      if (this.heatmapFadingIn === true && this.heatmapStage.alpha < 1) {
        this._heatmapFadeinStep(timestamp);
      }
      this._render();
    }
    window.requestAnimationFrame(this._frameBound);
  }

  _render() {
    this.renderer.render(this.stage);
  }

  enableRendering() {
    this.renderingEnabled = true;
  }

  disableRendering() {
    this.renderingEnabled = false;
  }

  show() {
    this.stage.visible = true;
  }

  hide() {
    this.stage.visible = false;
  }

  // Layer management
  addLayer(layerSettings) {
    const maxSprites = this._getNumSprites();
    const layer = new HeatmapLayer(layerSettings, this.baseTexture, maxSprites);
    this.heatmapStage.addChild(layer.stage);
    this.layers.push(layer);
    return layer;
  }

  removeLayer(layerId) {
    const removedLayerIndex = this.layers.findIndex(layer => layer.id === layerId);
    const removedLayer = this.layers[removedLayerIndex];
    this.heatmapStage.removeChild(removedLayer.stage);
    this.layers.splice(removedLayerIndex, 1);
  }

  _getOffsets() {
    const topLeft = this.layerProjection.fromContainerPixelToLatLng(new google.maps.Point(0, 0));
    const topLeftWorld = this.mapProjection.fromLatLngToPoint(topLeft);
    return {
      top: topLeftWorld.y,
      left: topLeftWorld.x,
      scale: 2 ** this.map.getZoom()
    };
  }

  reposition() {
    if (!this.container) return;

    const offset = super.getRepositionOffset(this.viewportWidth, this.viewportHeight);
    this.container.style.left = `${offset.x}px`;
    this.container.style.top = `${offset.y}px`;
  }

  updateHeatmap(data, timelineInnerExtentIndexes, highlightedVessels) {
    if (!this.mapProjection || !this.renderingEnabled) {
      return;
    }

    const startIndex = timelineInnerExtentIndexes[0];
    const endIndex = timelineInnerExtentIndexes[1];

    const newTimeIndexDelta = endIndex - startIndex;

    if (this.timeIndexDelta !== newTimeIndexDelta) {
      const delta = newTimeIndexDelta - this.timeIndexDelta;
      // because of the way dates are rounded, the range length can vary of one day even if the user didnt change range
      // in that case skip resizing sprites pool, avoiding doing this in the middle of on animation
      if (Math.abs(delta) !== 1) {
        this.timeIndexDelta = newTimeIndexDelta;
        // this.resizeSpritesPool();
      }
    }

    const currentOffsets = this._getOffsets();
    this.reposition();

    let immediateRender = false;

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const layerData = data[layer.id];
      if (layerData === undefined) {
        continue;
      }
      const tiles = layerData.tiles;
      if (!tiles.length) {
        immediateRender = true;
      }
      layer.render(tiles, startIndex, endIndex, currentOffsets);
    }

    if (immediateRender) {
      this._render();
    }

    if (highlightedVessels !== undefined) {
      this.updateHeatmapHighlighted(data, timelineInnerExtentIndexes, highlightedVessels);
    }
  }

  updateHeatmapHighlighted(data, timelineInnerExtentIndexes, { layerId, currentFlags, highlightableCluster, isEmpty, seriesUids }) {
    if (isEmpty === true) {
      this.heatmapHighlight.stage.visible = false;
      this._startHeatmapFadein();
      return;
    }
    this.toggleHeatmapDimming(true);

    if (highlightableCluster !== true) {
      return;
    }

    const startIndex = timelineInnerExtentIndexes[0];
    const endIndex = timelineInnerExtentIndexes[1];
    const layerData = data[layerId];
    this.heatmapHighlight.setSeriesUids(seriesUids);
    this.heatmapHighlight.setFlags(currentFlags);
    this.heatmapHighlight.render(layerData.tiles, startIndex, endIndex, this._getOffsets());
    this.heatmapHighlight.stage.visible = true;
  }

  updateTracks(tracks, drawParams) {
    if (!this.mapProjection) {
      console.warn('trying to add tracks on a layer not yet added');
      return;
    }
    if (tracks === undefined || !tracks.length) {
      return;
    }

    this.hasTracks = true;
    this.tracksLayer.update(tracks, drawParams, this._getOffsets());
  }

  clearTracks() {
    this.hasTracks = false;
    this.tracksLayer.clear();
  }

  setStyle(useHeatmapStyle) {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].setRenderingStyle(useHeatmapStyle);
    }
    this.heatmapHighlight.setRenderingStyle(useHeatmapStyle);
  }

  setFlags(flags, useHeatmapStyle) {
    if (!Object.keys(flags).length) {
      return;
    }
    this.layers.forEach((layer) => {
      const layerFlags = flags[layer.id];
      layer.setSubLayers(layerFlags, useHeatmapStyle);
    });
    this.heatmapHighlight.setRenderingStyle(useHeatmapStyle);
  }

  _startHeatmapFadein() {
    if (this.hasTracks === true) {
      return;
    }
    this.heatmapFadingIn = true;
    this.heatmapFadeinStartTimestamp = undefined;
  }

  _heatmapFadeinStep(timestamp) {
    if (this.heatmapFadeinStartTimestamp === undefined) {
      this.heatmapFadeinStartTimestamp = timestamp;
    }
    const timeElapsed = (timestamp - this.heatmapFadeinStartTimestamp) / 1000;
    let alpha = this.heatmapStage.alpha + ((1 - this.heatmapStage.alpha) * timeElapsed);
    if (alpha >= 1) {
      alpha = 1;
      this.heatmapFadingIn = false;
    }
    this.heatmapStage.alpha = alpha;
  }

  toggleHeatmapDimming(dim) {
    if (dim === true) {
      this.heatmapFadingIn = false;
    }
    this.heatmapStage.alpha = (dim === true) ? VESSELS_HEATMAP_DIMMING_ALPHA : 1;
  }

  updateViewportSize(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    // this.resizeSpritesPool();
    this.renderer.resize(this.viewportWidth, this.viewportHeight);
    this.canvas.style.width = `${this.viewportWidth}px`;
    this.canvas.style.height = `${this.viewportHeight}px`;
  }
  //
  // resizeSpritesPool() {
  //   return;
  //   const spritesPerStep = this._getSpritesPerStep();
  //   const finalPoolSize = this.timeIndexDelta * spritesPerStep;
  //
  //   for (let i = 0; i < this.layers.length; i++) {
  //     this.layers[i].resizeSpritesPool(finalPoolSize);
  //   }
  // }
  //
  _getNumSpritesPerStep() {
    return Math.round(this.viewportWidth * this.viewportHeight * MAX_SPRITES_FACTOR);
  }

  _getNumSprites() {
    return this._getNumSpritesPerStep() * TIMELINE_MAX_STEPS;
  }

}
