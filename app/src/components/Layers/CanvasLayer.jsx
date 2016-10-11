/* eslint no-underscore-dangle:0 no-param-reassign: 0 */
import PIXI from 'pixi.js';
import { TIMELINE_STEP, VESSEL_MIN_RADIUS, VESSEL_MAX_RADIUS } from '../../constants';
import _ from 'lodash';
import CanvasLayerData from './CanvasLayerData';

class CanvasLayer {
  constructor(position, map, token, filters, vesselTransparency, vesselColor, visible) {
    this.map = map;
    this.playbackData = [];
    this.position = position;
    this.tileSize = new google.maps.Size(256, 256);
    this.options = _.extend({}, this.defaults, this.options || {});
    this.visible = false;
    this.token = token;
    this.setVesselTransparency(vesselTransparency);
    this.setVesselColor(vesselColor);

    this.outerStartDate = filters.startDate;
    this.outerStartDateOffset = CanvasLayerData.getTimeAtPrecision(this.outerStartDate);
    this.outerEndDate = filters.endDate;
    this.innerStartDate = filters.timelineInnerExtent[0]; // deprecated
    this.innerEndDate = filters.timelineInnerExtent[1]; // deprecated
    this.currentInnerStartIndex = CanvasLayerData.getOffsetedTimeAtPrecision(
        this.innerStartDate.getTime(),
        this.outerStartDateOffset
    );
    this.currentInnerEndIndex = CanvasLayerData.getOffsetedTimeAtPrecision(
        this.innerEndDate.getTime(),
        this.outerStartDateOffset
    );

    this._setFlag(filters);

    this.mainVesselTexture = PIXI.Texture.fromCanvas(this.getVesselTemplate(VESSEL_MAX_RADIUS, 0.3));

    if (visible) {
      this.show();
    }
  }

  getVesselTemplate(radius, blurFactor) {
    const tplCanvas = document.createElement('canvas');
    const tplCtx = tplCanvas.getContext('2d');
    const x = radius;
    const y = radius;
    tplCanvas.width = tplCanvas.height = radius * 2;

    if (blurFactor === 1) {
      tplCtx.beginPath();
      tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
      tplCtx.fillStyle = 'rgba(255, 255, 237, 0.5)';
      tplCtx.fill();
    } else {
 //      'rgb(48, 149, 255)',
 // +      'rgb(136, 251, 255)',
 // +      'rgb(255, 248, 150)',
 // +      'rgb(255, 220, 45)'
      const gradient = tplCtx.createRadialGradient(x, y, radius * blurFactor, x, y, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.1, 'rgba(136, 251, 255,1)');
      gradient.addColorStop(0.2, 'rgba(255, 248, 150,1)');
      gradient.addColorStop(1, 'rgba(48, 149, 255, 0)');
      tplCtx.fillStyle = gradient;
      tplCtx.fillRect(0, 0, 2 * radius, 2 * radius);
    }
    return tplCanvas;
  }

  setVesselColor(vesselColor) {
    this.vesselColor = {
      r: parseInt(vesselColor.slice(1, 3), 16),
      g: parseInt(vesselColor.slice(3, 5), 16),
      b: parseInt(vesselColor.slice(5, 7), 16)
    };
    this._computeVesselColor();
  }

  setVesselTransparency(vesselTransparency) {
    this.vesselTransparency = vesselTransparency;
    this._computeVesselColor();
  }

  _computeVesselColor() {
    if (!this.vesselColor || !this.vesselTransparency) return;
    // for now does not allows for varying levels of opacity
    // by doing this we can batch drawing commands (fill called only once) - see drawVesselPoint
    // and we don't have to do string interpolation for each point
    // TODO check if varying levels of opacity are really needed.
    // If so, sort values into 3-4 distinguishable opacity values into arrays
    const finalOpacity = (100 - this.vesselTransparency) / 100;
    this.precomputedVesselColor = `rgba(${this.vesselColor.r}\
,${this.vesselColor.g},${this.vesselColor.b},${finalOpacity})`;
  }

  _setFlag(filters) {
    if (!!filters) {
      if (filters.flag !== '') {
        this.flag = parseInt(filters.flag, 10);
      } else {
        this.flag = null;
      }
    }
  }

  /**
   * Hides the layer
   */
  hide() {
    if (!this.visible) {
      return;
    }
    this.visible = false;
    this.map.overlayMapTypes.removeAt(this.position);
  }

  /**
   * Shows the layer
   */
  show() {
    if (this.visible) {
      return;
    }
    this.visible = true;
    this.map.overlayMapTypes.insertAt(this.position, this);
  }

  /**
   * Forces a redraw of the layer
   */
  refresh() {
    if (this.visible) {
      if (this.map.overlayMapTypes.getAt(this.position)) {
        this.map.overlayMapTypes.removeAt(this.position);
      }
      this.map.overlayMapTypes.insertAt(this.position, this);
    }
  }

  isVisible() {
    return this.visible;
  }

  /**
   * Updates the filters info
   * Clears playback data and redraws the layer
   *
   * @param filters
   */
  updateFilters(filters) {
    this.outerStartDate = filters.startDate;
    this.outerEndDate = filters.endDate;
    this._setFlag(filters);
    this.resetPlaybackData();
    this.refresh();
  }

  /**
   * Creates a canvas element
   *
   * @param coord
   * @param zoom
   * @param ownerDocument
   * @returns {*}
   * @private
   */
  _getCanvas(ownerDocument) {
    // create canvas and reset style
    const canvas = ownerDocument.createElement('canvas');
    canvas.style.border = 'none';
    canvas.style.margin = '0';
    canvas.style.padding = '0';

    // prepare canvas and context sizes
    const ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
  }

  _getPixi() {
    PIXI.utils._saidHello = true;
    const renderer = new PIXI.WebGLRenderer(256, 256, { transparent: true });
    const stageCanvas = renderer.view;
    const stage = new PIXI.ParticleContainer(20000);
    stage.blendMode = PIXI.BLEND_MODES.SCREEN;

    return {
      stageCanvas,
      renderer,
      stage
    };
  }

  /**
   * Loads the first matching vessel for the given lat/long pair
   * TODO: return and handle multiple vessels on the same coordinates
   *
   * @param lat
   * @param long
   */
  getVesselAtLocation(lat, long) {
    const filters = this.filters;
    const tiles = this.playbackData;

    const tileIds = Object.keys(tiles);
    for (let tileIdIndex = 0; tileIdIndex < tileIds.length; tileIdIndex++) {
      const tile = tiles[tileIds[tileIdIndex]];

      for (
        let currentTimestamp = filters.startDate;
        currentTimestamp <= filters.endDate;
        currentTimestamp += TIMELINE_STEP
      ) {
        if (!tile.hasOwnProperty(currentTimestamp)) {
          continue;
        }
        for (let i = 0; i < tile[currentTimestamp].latitude.length; i++) {
          if (~~tile[currentTimestamp].latitude[i] === lat && ~~tile[currentTimestamp].longitude[i] === long) {
            return {
              latitude: tile[currentTimestamp].latitude[i],
              longitude: tile[currentTimestamp].longitude[i],
              weight: tile[currentTimestamp].weight[i],
              timestamp: currentTimestamp,
              x: tile[currentTimestamp].x[i],
              y: tile[currentTimestamp].y[i],
              series: tile[currentTimestamp].series[i],
              seriesgroup: tile[currentTimestamp].seriesgroup[i]
            };
          }
        }
      }
    }
    return null;
  }

  /**
   * Creates and loads data for each tile
   *
   * @param coord
   * @param zoom
   * @param ownerDocument
   * @returns {*}
   */

  getTile(coord, zoom, ownerDocument) {
    const { stageCanvas, renderer, stage } = this._getPixi(ownerDocument);

    const sprites = [];
    for (let i = 0; i < 5000; i++) {
      const vessel = new PIXI.Sprite(this.mainVesselTexture);
      vessel.anchor.x = vessel.anchor.y = 0.5;
      vessel.blendMode = PIXI.BLEND_MODES.SCREEN;
      // vessel.filters=  [new PIXI.filters.BlurFilter(10,10)]
      sprites.push(vessel);
      stage.addChild(vessel);
    }

    const canvasPlaybackData = {
      stageCanvas,
      renderer,
      stage,
      tilePlaybackData: null,
      sprites
    };
    stageCanvas.index = this.playbackData.length;
    this.playbackData.push(canvasPlaybackData);

    // this._showDebugInfo(ctx, 'L', Math.random());

    const tileCoordinates = CanvasLayerData.getTileCoordinates(coord, zoom);
    const pelagosPromises = CanvasLayerData.getTilePelagosPromises(tileCoordinates,
      this.outerStartDate,
      this.outerEndDate,
      this.token
    );

    Promise.all(pelagosPromises).then((rawTileData) => {
      if (!rawTileData || rawTileData.length === 0) {
        // this._showDebugInfo(ctx, 'E');
        return;
      }
      const cleanVectorArrays = CanvasLayerData.getCleanVectorArrays(rawTileData);
      if (cleanVectorArrays.length !== rawTileData.length) {
        // this._showDebugInfo(ctx, 'PE');
      }

      // this._showDebugInfo(ctx, 'OK');
      const groupedData = CanvasLayerData.groupData(cleanVectorArrays);
      const vectorArray = this.addTilePixelCoordinates(tileCoordinates, groupedData);
      const tilePlaybackData = CanvasLayerData.getTilePlaybackData(
        vectorArray,
        this.outerStartDate,
        this.outerEndDate,
        this.outerStartDateOffset,
        this.flag
      );
      canvasPlaybackData.tilePlaybackData = tilePlaybackData;

      this._drawTimeRangeCanvasAtIndexes(
        this.currentInnerStartIndex,
        this.currentInnerEndIndex,
        canvasPlaybackData
      );
    });

    return stageCanvas;
  }

  releaseTile(canvas) {
    // console.log('release tile', canvas.index);
    if (canvas.index === undefined) {
      console.warn('unknown tile relased');
      return;
    }
    this.playbackData.splice(canvas.index, 1);
  }

  /**
   * Draws all data in between the given start and end times
   * @param start start timstamp (ms)
   * @param end   end timestamp (ms)
   */
  drawTimeRange(start, end) {
    const startIndex = CanvasLayerData.getOffsetedTimeAtPrecision(start, this.outerStartDateOffset);
    const endIndex = CanvasLayerData.getOffsetedTimeAtPrecision(end, this.outerStartDateOffset);

    if (this.currentInnerStartIndex === startIndex && this.currentInnerEndIndex === endIndex) {
      // TODO: check only startIndex to avoid bypassing when current is 10-20 and next is 10-21 (rounding issue)
      // and force drawing when innerDelta changed
      return -1;
    }

    this.currentInnerStartIndex = startIndex;
    this.currentInnerEndIndex = endIndex;

    // console.log(startIndex)
    this._drawTimeRangeAtIndexes(startIndex, endIndex);

    return startIndex;
  }

  /**
   * Draws all data in between the given start and end times
   * @param startIndex frame index (at precision set in constants.PLAYBACK_PRECISION) to draw
   * @param endIndex
   */
  _drawTimeRangeAtIndexes(startIndex, endIndex) {
    this.playbackData.forEach((canvasPlaybackData) => {
      this._drawTimeRangeCanvasAtIndexes(startIndex, endIndex, canvasPlaybackData);
    });
  }

  _drawTimeRangeCanvasAtIndexes(startIndex, endIndex, canvasPlaybackData) {
    if (!canvasPlaybackData.tilePlaybackData) {
      return;
    }

    const tilePlaybackData = canvasPlaybackData.tilePlaybackData;
    const spritesPool = canvasPlaybackData.sprites;
    const spritesPoolLength = spritesPool.length;
    let numSprites = 0;

    let allValues = 0;

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex ++) {
      const playbackData = tilePlaybackData[timeIndex];

      if (!playbackData) continue;

      for (let i = 0, len = playbackData.x.length; i < len; i++) {
        let sprite = spritesPool[numSprites];
        const value = playbackData.value[i];
        allValues += value;

        if (sprite === undefined) {
          // TODO : should we have a cleanup mechanism as well?
          this._addSprites(1000, canvasPlaybackData.stage, spritesPool);
          sprite = spritesPool[numSprites];
        }

        sprite.visible = true;
        sprite.position.x = playbackData.x[i];
        sprite.position.y = playbackData.y[i];
        sprite.scale.x = sprite.scale.y = value;

        numSprites++;
      }
    }

    // hide unused sprites
    for (let i = numSprites; i < spritesPoolLength; i++) {
      spritesPool[i].visible = false;
    }
    // console.log(numSprites, numSpriteMissed, numSpriteOver)
    // console.log(spritesPoolLength)
    // console.log(allValues/numSprites)

    canvasPlaybackData.renderer.render(canvasPlaybackData.stage);
  }

  _addSprites(num, stage, sprites) {
    for (let i = 0; i < num; i++) {
      const vessel = new PIXI.Sprite(this.mainVesselTexture);
      vessel.anchor.x = vessel.anchor.y = 0.5;
      sprites.push(vessel);
      stage.addChild(vessel);
    }
  }


  _showDebugInfo(/* ctx, ...text */) {
    // ctx.fillStyle = 'white';
    // ctx.fillRect(0,0, 250, 20);
    // ctx.font = '10px Verdana bold';
    // ctx.fillStyle = 'black';
    // if (!ctx.debug) {
    //   ctx.debug = text;
    // }
    // else {
    //   ctx.debug += ' ' + text;
    // }
    // ctx.fillText(text, 5, 10);
  }

  /**
   * Add projected lat/long values transformed as x/y coordinates
   */
  addTilePixelCoordinates(tileCoordinates, vectorArray) {
    const data = vectorArray;
    const scale = 1 << tileCoordinates.zoom;
    const tileBaseX = tileCoordinates.x * 256;
    const tileBaseY = tileCoordinates.y * 256;
    const zoomDiff = tileCoordinates.zoom + 8 - Math.min(tileCoordinates.zoom + 8, 16);

    data.x = new Int32Array(data.latitude.length);
    data.y = new Int32Array(data.latitude.length);

    for (let index = 0, length = data.latitude.length; index < length; index++) {
      const lat = data.latitude[index];
      const lng = data.longitude[index];
      let x = (lng + 180) / 360 * 256;
      let y = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 0)) * 256; // eslint-disable-line
      x *= scale;
      y *= scale;

      data.x[index] = ~~((x - tileBaseX) << zoomDiff);
      data.y[index] = ~~((y - tileBaseY) << zoomDiff);
    }
    return data;
  }

  static getTimestampIndex(timestamp) {
    return timestamp - (timestamp % TIMELINE_STEP);
  }

}

export default CanvasLayer;
