/* eslint no-param-reassign: 0 */
import VesselsTileData from './VesselsTileData';

class CanvasLayer {
  constructor(map, token, filters, outerStartDateOffset) {
    this.map = map;
    this.tileSize = new google.maps.Size(256, 256);
    this.token = token;

    this.tiles = [];

    this.outerStartDate = filters.startDate;
    this.outerEndDate = filters.endDate;
    this.outerStartDateOffset = outerStartDateOffset;

    this._setFlag(filters);

    this.map.overlayMapTypes.insertAt(0, this);
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

  _getCanvas(ownerDocument) {
    // create canvas and reset style
    const canvas = ownerDocument.createElement('canvas');
    canvas.style.border = '1px solid red';
    canvas.style.margin = '0';
    canvas.style.padding = '0';

    // prepare canvas and context sizes
    const ctx = canvas.getContext('2d');
    ctx.width = canvas.width = this.tileSize.width;
    ctx.height = canvas.height = this.tileSize.height;

    canvas.ctx = ctx;
    return canvas;
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
    canvas.index = this.tiles.length;
    this._showDebugInfo(canvas, 'S');

    this.tiles.push(canvas);
    // console.log(coord);

    // const scale = 1 << this.map.getZoom();
    // console.log(scale)
    // const world = new google.maps.Point(coord.x * 256 / scale, coord.y * 256 / scale);

    // const pixel = new google.maps.Point(world.x * scale, world.y * scale);

    // const unprojected = this.map.getProjection().fromPointToLatLng(world);
    // console.log(unprojected.lat())
    // console.log(unprojected.lng())


    const tileCoordinates = VesselsTileData.getTileCoordinates(coord, zoom);
    const pelagosPromises = VesselsTileData.getTilePelagosPromises(tileCoordinates,
      this.outerStartDate,
      this.outerEndDate,
      this.token
    );

    Promise.all(pelagosPromises).then((rawTileData) => {
      if (!rawTileData || rawTileData.length === 0) {
        this._showDebugInfo(canvas, 'E');
        this.releaseTile(canvas);
        return;
      }
      const cleanVectorArrays = VesselsTileData.getCleanVectorArrays(rawTileData);
      if (cleanVectorArrays.length !== rawTileData.length) {
        this._showDebugInfo(canvas, 'PE');
      }

      // this._showDebugInfo(canvas, 'OK');
      const groupedData = VesselsTileData.groupData(cleanVectorArrays);
      const vectorArray = this._addTilePixelCoordinates(tileCoordinates, groupedData);
      const data = VesselsTileData.getTilePlaybackData(
        vectorArray,
        this.outerStartDate,
        this.outerEndDate,
        this.outerStartDateOffset,
        this.flag
      );
      canvas.data = data;

      this.tileCreatedCallback();
    });

    return canvas;
  }

  releaseTile(canvas) {
    const index = this.tiles.indexOf(canvas);
    if (index === -1) {
      console.warn('unknown tile relased');
      return;
    }
    console.log('released tile #', index);
    this.tiles.splice(index, 1);
    this.tileReleasedCallback();
  }

  _showDebugInfo(canvas, text) {
    const ctx = canvas.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 250, 20);
    ctx.font = '10px Verdana bold';
    ctx.fillStyle = 'black';
    ctx.fillText(text + ' ' + canvas.index, 5, 10);
  }

  render(startIndex, endIndex) {
    return
    this.tiles.forEach(tile => {
      this._dumpTileVessels(startIndex, endIndex, tile.ctx, tile.data);
    });
  }

  _dumpTileVessels(startIndex, endIndex, ctx, data) {
    if (!data) {
      return;
    }
    ctx.clearRect(0, 0, 256, 256);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 0, 255, 1)';

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex ++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      for (let index = 0, len = frame.x.length; index < len; index++) {
        const x = frame.x[index];
        const y = frame.y[index];
        const value = 5 * frame.value[index];
        ctx.moveTo(x, y);
        ctx.arc(x, y, value, 0, 2 * Math.PI, false);
      }
    }
    ctx.stroke();
  }


  /**
   * Add projected lat/long values transformed as x/y coordinates
   */
  _addTilePixelCoordinates(tileCoordinates, vectorArray) {
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
}

export default CanvasLayer;
