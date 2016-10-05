/* eslint no-underscore-dangle:0 no-param-reassign: 0 */
import { TIMELINE_STEP } from '../../constants';
import _ from 'lodash';
import CanvasLayerData from './CanvasLayerData';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import StackBlur from 'stackblur-canvas';

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

    // get circle/brush canvases that will be copied into the final canvases
    this.vesselTemplates = [];
    for (let i = 1; i < 20; i++) {
      this.vesselTemplates[i] = this.getVesselTemplate(i, 1);
    }

    this.vesselTemplate = this.getVesselTemplate(4, 1);

    const colors = [
      '#3095FF',
      '#89FBFF',
      '#FFF896',
      '#FFDC2C'
      // '#FFA21D'
    ];
    const domain = colors.map((c, i) => i * (10 / colors.length));
    const gradientScale = d3ScaleLinear()
      .domain(domain)
      .range(colors);

    this.gradient = new Uint8ClampedArray(10 * 3);
    for (let i = 0; i < 10; i++) {
      const channels = gradientScale(i).match(/\d+/g);
      this.gradient[i * 3] = channels[0];
      this.gradient[i * 3 + 1] = channels[1];
      this.gradient[i * 3 + 2] = channels[2];
    }

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
      tplCtx.fillStyle = 'rgba(255,0,0,.5)';
      tplCtx.fill();
    } else {
      // return a radial gradient
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
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.position = 'absolute';

    // prepare canvas and context sizes
    const ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
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
    const canvas = this._getCanvas(ownerDocument);
    const trailCanvas = this._getCanvas(ownerDocument);
    const div = ownerDocument.createElement('div');
    div.appendChild(trailCanvas);
    div.appendChild(canvas);
    div.style.width = '256px';
    div.style.height = '256px';

    const canvasPlaybackData = {
      canvas,
      trailCanvas,
      tilePlaybackData: null
    };
    div.index = this.playbackData.length;
    this.playbackData.push(canvasPlaybackData);

    const tileCoordinates = CanvasLayerData.getTileCoordinates(coord, zoom);
    const pelagosPromises = CanvasLayerData.getTilePelagosPromises(tileCoordinates,
      this.outerStartDate,
      this.outerEndDate,
      this.token
    );

    Promise.all(pelagosPromises).then((rawTileData) => {
      if (!rawTileData || rawTileData.length === 0) {
        return;
      }
      const cleanVectorArrays = CanvasLayerData.getCleanVectorArrays(rawTileData);

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

    return div;
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
    const dirty = {
      x: 0,
      y: 0,
      width: 256,
      height: 256
    };
    const rect = canvasPlaybackData.canvas.getBoundingClientRect();

    if (rect.left < 0) dirty.x = Math.abs(rect.left);
    if (rect.top < 0) dirty.y = Math.abs(rect.top);
    if (rect.right > window.innerWidth) dirty.width = 256 - (rect.right - window.innerWidth);
    if (rect.bottom > window.innerHeight) dirty.height = 256 - (rect.bottom - window.innerHeight);

    const pixelMode = true;
    if (pixelMode) {
      // const values = CanvasLayerData.serializeFrames(canvasPlaybackData.tilePlaybackData, startIndex, endIndex);
      // console.log(values)
      this.drawPixelFrames(canvasPlaybackData.canvas.ctx, canvasPlaybackData.tilePlaybackData, startIndex, endIndex, dirty);
      this.drawPixelFramesTrail(canvasPlaybackData.trailCanvas.ctx, canvasPlaybackData.tilePlaybackData, startIndex, dirty);
    } else {
      // this.drawCircleFrames();
    }
  }

  drawPixelFramesTrail(ctx, tilePlaybackData, startIndex, dirty) {
    let imageData = ctx.createImageData(256, 256);
    const pixels = imageData.data;

    for (let trailFrame = 10; trailFrame >= 0; trailFrame--) {
      const frameIndex = startIndex - (10 - trailFrame);
      if (frameIndex < 0) break;

      const frame = tilePlaybackData[frameIndex];
      if (!frame) continue;

      const alpha = 80 + trailFrame * 10;

      for (let index = 0, len = frame.x.length; index < len; index++) {
        const offset = frame.offset4bytes[index];

        pixels[offset] = 68;
        pixels[offset + 1] = 159;
        pixels[offset + 2] = 255;
        pixels[offset + 3] = alpha;
        // right px
        pixels[offset + 4] = 68;
        pixels[offset + 5] = 159;
        pixels[offset + 6] = 255;
        pixels[offset + 7] = alpha;
        // bottom px
        pixels[offset + 1024] = 68;
        pixels[offset + 1025] = 159;
        pixels[offset + 1026] = 255;
        pixels[offset + 1027] = alpha;
        // right bottom px
        pixels[offset + 1028] = 68;
        pixels[offset + 1029] = 159;
        pixels[offset + 1030] = 255;
        pixels[offset + 1031] = alpha;
      }
    }
    // imageData = StackBlur.imageDataRGBA(imageData, 0, 0, 256, 256, 2);
    ctx.putImageData(imageData, 0, 0, dirty.x, dirty.y, dirty.width, dirty.height);
  }

  drawPixelFrames(ctx, tilePlaybackData, startIndex, endIndex, dirty) {
    const imageData = ctx.createImageData(256, 256);
    const pixels = imageData.data;

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex ++) {
      const frame = tilePlaybackData[timeIndex];
      if (!frame) continue;

      for (let index = 0, len = frame.x.length; index < len; index++) {
        const offset = frame.offset4bytes[index];
        const alphaOffset = offset + 3;

        let alphaValue = pixels[alphaOffset];
        if (alphaValue === 0) {
          pixels[alphaOffset] = alphaValue = 246;
        }
        const pixelValue = -(246 - alphaValue);

        pixels[offset] = this.gradient[pixelValue * 3];
        pixels[offset + 1] = this.gradient[pixelValue * 3 + 1];
        pixels[offset + 2] = this.gradient[pixelValue * 3 + 2];

        pixels[alphaOffset] = alphaValue + frame.value[index];
      }
    }

    ctx.putImageData(imageData, 0, 0, dirty.x, dirty.y, dirty.width, dirty.height);
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
