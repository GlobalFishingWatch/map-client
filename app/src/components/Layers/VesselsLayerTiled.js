/* eslint no-param-reassign: 0 */
import VesselsTileData from './VesselsTileData';

class VesselsLayerTiled {
  constructor(map, tilesetUrl, token, filters, overallStartDateOffset, debug = false) {
    this.map = map;
    this.tileSize = new google.maps.Size(256, 256);
    this.token = token;
    this.tilesetUrl = tilesetUrl;

    this.tiles = [];

    this.timelineOverallStartDate = filters.timelineOverallExtent[0];
    this.timelineOverallEndDate = filters.timelineOverallExtent[1];
    this.overallStartDateOffset = overallStartDateOffset;

    this.debug = debug;

    if (!!filters) {
      this.setFlag(filters.flag);
    }

    this.map.overlayMapTypes.insertAt(0, this);
  }

  show() {
    this.map.overlayMapTypes.insertAt(0, this);
  }

  hide() {
    this.map.overlayMapTypes.removeAt(0);
  }

  setFlag(flag) {
    if (flag !== '') {
      this.flag = parseInt(flag, 10);
    } else {
      this.flag = null;
    }
  }

  _getCanvas(ownerDocument) {
    // create canvas and reset style
    const canvas = ownerDocument.createElement('canvas');
    if (this.debug) canvas.style.border = '1px solid red';
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
    canvas.ready = false;
    canvas.error = false;
    canvas.index = this.tiles.length;
    canvas.tileCoordinates = VesselsTileData.getTileCoordinates(coord, zoom);

    // case where queried coors are not showable (beyond poles):
    // just send back the DOM but don't try to fetch any data
    if (canvas.tileCoordinates === null) {
      return canvas;
    }

    this.tiles.push(canvas);

    const pelagosPromises = VesselsTileData.getTilePelagosPromises(
      this.tilesetUrl,
      canvas.tileCoordinates,
      this.timelineOverallStartDate,
      this.timelineOverallEndDate,
      this.token
    );
    if (this.debug) this._showDebugInfo(canvas, 'S');

    Promise.all(pelagosPromises).then((rawTileData) => {
      if (!rawTileData || rawTileData.length === 0) {
        if (this.debug) this._showDebugInfo(canvas, 'E');
        console.warn('empty dataset');
        this.releaseTile(canvas);
      }

      const cleanVectorArrays = VesselsTileData.getCleanVectorArrays(rawTileData);
      if (cleanVectorArrays.length !== rawTileData.length) {
        console.warn('partially empty dataset');

        canvas.error = true;

        if (this.debug) this._showDebugInfo(canvas, 'PE');
      }

      // this._showDebugInfo(canvas, 'OK');
      const groupedData = VesselsTileData.groupData(cleanVectorArrays);
      const vectorArray = this._addTilePixelCoordinates(canvas.tileCoordinates, groupedData);
      const data = VesselsTileData.getTilePlaybackData(
        vectorArray,
        this.timelineOverallStartDate,
        this.timelineOverallEndDate,
        this.overallStartDateOffset
      );
      canvas.data = data;
      canvas.ready = true;

      this.tileCreatedCallback();
    }, error => {
      console.warn(error.message);
    });

    return canvas;
  }

  releaseTile(canvas) {
    const index = this.tiles.indexOf(canvas);
    if (index === -1) {
      console.warn('unknown tile released', canvas);
      return;
    }
    console.warn('released tile #', index);
    this.tiles.splice(index, 1);
    this.tileReleasedCallback();
  }

  _showDebugInfo(canvas, text) {
    const coords = canvas.tileCoordinates;
    const ctx = canvas.ctx;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 250, 20);
    ctx.font = '10px Verdana bold';
    ctx.fillStyle = 'black';
    ctx.fillText(`${text} ${canvas.index} ${coords.zoom}/${coords.x}/${coords.y}`, 5, 10);
  }

  render(startIndex, endIndex) {
    return this.tiles.forEach(tile => {
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
        if (this.flag && this.flag !== frame.category[index]) {
          continue;
        }
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
   * Add projected lat/long values transformed as tile-relative x/y coordinates
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

  getTileAt(x, y) {
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const tileBox = tile.getBoundingClientRect();
      if (y > tileBox.top && y < tileBox.top + 256 && x > tileBox.left && x < tileBox.left + 256) {
        tile.box = tileBox;
        return tile;
      }
    }
    return null;
  }
}

export default VesselsLayerTiled;
