import VesselsLayerOverlay from './VesselsLayerOverlay';
import VesselsLayerTiled from './VesselsLayerTiled';

export default class VesselsLayer {

  constructor(map) {
    this.map = map;

    this.overlay = new VesselsLayerOverlay(map);
    this.tiled = new VesselsLayerTiled(
      0/* position */,
      this.map,
      true /* layerSettings.visible */
    );

    this.tiled.tileCreatedCallback = this._onTileCreated.bind(this);
    this.tiled.tileReleasedCallback = this._onTileReleased.bind(this);

    this.centerListener = google.maps.event.addListener(this.map, 'center_changed', this._onCenterChanged.bind(this));
  }

  _onTileCreated() {
    // console.log(data)
    this.render();
  }

  _onTileReleased() {
    this.render();
  }

  _onCenterChanged() {
    this.overlay.repositionCanvas();
    this.overlay.render(this.tiled.canvases);
  }

  render() {
    // use this.currentInnerStartIndex...

    this.overlay.render(this.tiled.canvases);
  }

  // drawTimeRange(start, end) {
    // const startIndex = CanvasLayerData.getOffsetedTimeAtPrecision(start, this.outerStartDateOffset);
    // const endIndex = CanvasLayerData.getOffsetedTimeAtPrecision(end, this.outerStartDateOffset);
    // if (this.currentInnerStartIndex === startIndex && this.currentInnerEndIndex === endIndex) {
    //   // TODO: check only startIndex to avoid bypassing when current is 10-20 and next is 10-21 (rounding issue)
    //   // and force drawing when innerDelta changed
    //   return -1;
    // }
    // this.currentInnerStartIndex = startIndex;
    // this.currentInnerEndIndex = endIndex;
  // }

}
