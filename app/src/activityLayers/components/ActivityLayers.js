/* global PIXI */
import 'pixi.js';
import { hsvToRgb, hueToRgbString, hueIncrementToHue, wrapHue } from 'utils/colors';
import HeatmapLayer from './HeatmapLayer';
import TracksLayer from './TracksLayer';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HEATMAP_BLUR_FACTOR,
  VESSELS_HUES_INCREMENTS_NUM,
  TIMELINE_MAX_STEPS,
  HEATMAP_TRACK_HIGHLIGHT_HUE,
  VESSELS_HEATMAP_DIMMING_ALPHA
} from 'config';
import { LAYER_TYPES, BRUSH_RENDERING_STYLE } from 'constants';
import convert from 'globalfishingwatch-convert';

const MAX_SPRITES_FACTOR = 0.002;

export default class GLContainer extends BaseOverlay {
  constructor(viewportWidth, viewportHeight, useHeatmapStyle, addedCallback) {
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

    this._onTickBound = this._onTick.bind(this);

    this._build(useHeatmapStyle);
  }

  _build(useHeatmapStyle) {
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';

    this.pixi = new PIXI.Application({ width: this.viewportWidth, height: this.viewportHeight, transparent: true, antialias: true });

    this.pixi.ticker.add(this._onTickBound);

    this.renderer = this.pixi.renderer;
    this.canvas = this.pixi.view;
    this.canvas.style.position = 'absolute';

    this.container.appendChild(this.canvas);

    this.stage = this.pixi.stage;

    const baseTextureCanvas = this._getVesselTexture(VESSELS_BASE_RADIUS, VESSELS_HEATMAP_BLUR_FACTOR);
    this.baseTexture = PIXI.Texture.fromCanvas(baseTextureCanvas);

    this.heatmapStage = new PIXI.Container();
    this.stage.addChild(this.heatmapStage);

    this.heatmapHighlight = new HeatmapLayer(
      { id: '__HIGHLIGHT__', visible: true, opacity: 1, hue: HEATMAP_TRACK_HIGHLIGHT_HUE },
      this.baseTexture,
      this._getNumSprites(),
      useHeatmapStyle,
      { defaultOpacity: 1, defaultSize: 1 }
    );
    this.stage.addChild(this.heatmapHighlight.stage);

    this.tracksLayer = new TracksLayer();
    this.stage.addChild(this.tracksLayer.stage);


    // uncomment to debug spritesheet
    // this.container.appendChild(baseTextureCanvas);
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

  _onTick() {
    if (this.renderingEnabled && this.layerProjection) {
      if (this.heatmapFadingIn === true && this.heatmapStage.alpha < 1) {
        this._heatmapFadeinStep();
      }
      this._render();
    }
  }

  _render() {
    this.reposition();
    this.currentOffsets = this._getOffsets();
  }

  enableRendering() {
    this.currentOffsets = this._getOffsets();
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
  addLayer(layerSettings, useHeatmapStyle) {
    const maxSprites = this._getNumSprites();
    const layer = new HeatmapLayer(layerSettings, this.baseTexture, maxSprites, useHeatmapStyle);
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
    const topLeftWorld = convert.latLonToWorldCoordinates(topLeft.lat(), topLeft.lng());
    return {
      top: topLeftWorld.worldY,
      left: topLeftWorld.worldX,
      scale: 2 ** this.map.getZoom()
    };
  }

  reposition() {
    if (!this.container) return;

    const offset = super.getRepositionOffset(this.viewportWidth, this.viewportHeight);
    console.log(offset)
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

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const layerData = data[layer.id];
      if (layerData === undefined) {
        continue;
      }
      const tiles = layerData.tiles;
      layer.render(tiles, startIndex, endIndex, this.currentOffsets);
    }

    if (highlightedVessels !== undefined) {
      this.updateHeatmapHighlighted(data, timelineInnerExtentIndexes, highlightedVessels);
    }
  }

  updateHeatmapHighlighted(data, timelineInnerExtentIndexes, { layerId, highlightableCluster, isEmpty, foundVessels }) {
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
    const foundVesselsFilters = foundVessels.map(vessel => ({
      hue: HEATMAP_TRACK_HIGHLIGHT_HUE,
      filterValues: {
        series: [vessel.series]
      }
    }));

    // no need to reapply filters from filter groups, as the found vessels have already been prefiltered (see selectVesselsAt)
    // thus we only need to apply a series/seriesgroup filter
    this.heatmapHighlight.setFilters(foundVesselsFilters);

    // toggle encounters style/normal style
    this.heatmapHighlight.setBrushRenderingStyle((layerData.subtype === LAYER_TYPES.Encounters)
      ? BRUSH_RENDERING_STYLE.BULLSEYE
      : BRUSH_RENDERING_STYLE.NORMAL);

    this.heatmapHighlight.render(layerData.tiles, startIndex, endIndex, this.currentOffsets);
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
    this.tracksLayer.update(tracks, drawParams, this.currentOffsets, this._render.bind(this));
  }

  clearTracks() {
    this.hasTracks = false;
    this.tracksLayer.clear();
  }

  setStyle(useRadialGradientStyle) {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].setBrushZoomRenderingStyle(useRadialGradientStyle);
    }
    this.heatmapHighlight.setBrushZoomRenderingStyle(useRadialGradientStyle);
  }

  /**
   * Sets filters for each Heatmap layer
   * @param {array} layerFilters - All filters ordered by heatmap layer
   */
  setFilters(layerFilters) {
    this.layers.forEach((heatmapLayer) => {
      const filters = layerFilters[heatmapLayer.id];
      heatmapLayer.setFilters(filters);
    });
  }

  _startHeatmapFadein() {
    if (this.hasTracks === true) {
      return;
    }
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
