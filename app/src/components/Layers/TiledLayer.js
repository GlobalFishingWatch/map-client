export default class TiledLayer {
  constructor(getTileCallback, releaseTileCallback, map) {
    this.map = map;
    this.getTileCallback = getTileCallback;
    this.releaseTileCallback = releaseTileCallback;
    this.tileSize = new google.maps.Size(256, 256);
    this.tiles = [];
    this.currentUid = 0;
  }

  _getCanvas(ownerDocument) {
    // create canvas and reset style
    const canvas = ownerDocument.createElement('div');
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.style.width = '256px';
    canvas.style.height = '256px';

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

    canvas.map = this.map;

    canvas.uid = this.currentUid;
    this.getTileCallback(this.currentUid, tileCoordinates, canvas, this.map);
    this.tiles.push(canvas);
    this.currentUid++;
    return canvas;
  }

  releaseTile(canvas) {
    const tileIndex = this.tiles.indexOf(canvas);
    this.tiles.splice(tileIndex, 1);
    this.releaseTileCallback(canvas.uid);
  }

  getTileQueryAt(x, y) {
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const tileBox = tile.getBoundingClientRect();
      if (y > tileBox.top && y < tileBox.top + 256 && x > tileBox.left && x < tileBox.left + 256) {
        tile.box = tileBox;
        return {
          uid: tile.uid,
          localX: x - tileBox.left,
          localY: y - tileBox.top
        };
      }
    }
    return null;
  }
}
