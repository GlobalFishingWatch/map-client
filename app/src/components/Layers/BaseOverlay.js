export default class BaseOverlay extends google.maps.OverlayView {
  getRepositionOffset(viewportWidth, viewportHeight) {
    // topLeft can't be calculated from map.getBounds(), because bounds are
    // clamped to -180 and 180 when completely zoomed out. Instead, calculate
    // left as an offset from the center, which is an unwrapped LatLng.
    const center = this.getMap().getCenter();

    // Canvas position relative to draggable map's container depends on
    // overlayView's projection, not the map's. Have to use the center of the
    // map for this, not the top left, for the same reason as above.
    const projection = this.getProjection();
    const divCenter = projection.fromLatLngToDivPixel(center);
    const offsetX = -Math.round((viewportWidth / 2) - divCenter.x);
    const offsetY = -Math.round((viewportHeight / 2) - divCenter.y);
    return {
      x: offsetX,
      y: offsetY
    };
  }
}
