/* eslint no-param-reassign: 0 */
import CanvasLayerData from './CanvasLayerData';

class CanvasLayer {
  constructor(position, map, visible) {
    this.map = map;
    this.position = position;
    this.tileSize = new google.maps.Size(256, 256);
    this.visible = false;
    // this.token = token;

    this.canvases = [];

    if (visible) {
      this.show();
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
    // console.log(coord);

    const scale = 1 << this.map.getZoom();
    // console.log(scale)
    const world = new google.maps.Point(coord.x * 256 / scale, coord.y * 256 / scale);

    const pixel = new google.maps.Point(world.x * scale, world.y * scale);

    const unprojected = this.map.getProjection().fromPointToLatLng(world);
    // console.log(unprojected.lat())
    // console.log(unprojected.lng())


    // canvas.index = this.canvases.length;
    this.canvases.push(canvas);

    this.tileCreatedCallback();

    return canvas;
  }

  releaseTile(canvas) {
    const index = this.canvases.indexOf(canvas);
    if (index === -1) {
      console.warn('unknown tile relased');
      return;
    }
    this.canvases.splice(index, 1);
    this.tileReleasedCallback();
  }


}

export default CanvasLayer;
