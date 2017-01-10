export default class TiledLayer {
  constructor(getTileCallback, releaseTileCallback) {
    this.getTileCallback = getTileCallback;
    this.releaseTileCallback = releaseTileCallback;
    this.tileSize = new google.maps.Size(256, 256);
    this.currentUid = 0;
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

  _getTileCoordinates(coord, zoom) {
    const tileRange = 1 << zoom;

    const y = coord.y;

    // too close to the poles, GTFO
    if (y < 0 || y >= tileRange) {
      return null;
    }

    // modulo: cycle through values of tileRange so x is never outside of [-tileRange, tileRange]
    let x = coord.x % tileRange;

    // cycle through values of tileRange when crossing the antimeridian from east to west
    if (x < 0) {
      x += tileRange;
    }

    return { x, y, zoom };
  }

  getTile(coord, zoom, ownerDocument) {
    const tileCoordinates = this._getTileCoordinates(coord, zoom);
    const canvas = this._getCanvas(ownerDocument);

    // case where queried coors are not showable (beyond poles):
    // just send back the DOM but don't try to fetch any data
    if (tileCoordinates === null) {
      return canvas;
    }

    canvas.uid = this.currentUid;
    this.getTileCallback(this.currentUid, tileCoordinates, canvas);
    this.currentUid++;
    return canvas;
  }

  releaseTile(canvas) {
    this.releaseTileCallback(canvas.uid);
  }
}
