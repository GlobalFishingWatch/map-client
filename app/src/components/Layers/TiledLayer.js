export default class TiledLayer {
  constructor(createTile, releaseTile) {
    this.createTile = createTile;
    this.releaseTile = releaseTile;
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
    canvas.uid = this.currentUid;
    this.createTile(this.currentUid, tileCoordinates);
    return canvas;
  }

  releaseTile(canvas) {
    // const index = this.tiles.indexOf(canvas);
    // if (index === -1) {
    //   console.warn('unknown tile released', index);
    //   return;
    // }
    // console.warn('released tile #', index);
    // this.tiles.splice(index, 1);
    this.releaseTile(canvas.uid);
  }
}
