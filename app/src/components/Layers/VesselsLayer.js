import VesselsLayerOverlay from './VesselsLayerOverlay';
import VesselsLayerTiled from './VesselsLayerTiled';
import VesselsTileData from './VesselsTileData';


export default class VesselsLayer {

  constructor(map, token, filters) {
    this.map = map;

    const innerStartDate = filters.timelineInnerExtent[0];
    const innerEndDate = filters.timelineInnerExtent[1];
    this.outerStartDateOffset = VesselsTileData.getTimeAtPrecision(filters.startDate);

    this.currentInnerStartIndex = VesselsTileData.getOffsetedTimeAtPrecision(
        innerStartDate.getTime(),
        this.outerStartDateOffset
    );
    this.currentInnerEndIndex = VesselsTileData.getOffsetedTimeAtPrecision(
        innerEndDate.getTime(),
        this.outerStartDateOffset
    );

    this.overlay = new VesselsLayerOverlay(map);
    this.tiled = new VesselsLayerTiled(
      this.map,
      token,
      filters,
      this.outerStartDateOffset
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
    this.overlay.render(this.tiled.tiles, this.currentInnerStartIndex, this.currentInnerEndIndex);
  }

  render() {
    // use this.currentInnerStartIndex...
    this.overlay.render(this.tiled.tiles, this.currentInnerStartIndex, this.currentInnerEndIndex);
    this.tiled.render(this.currentInnerStartIndex, this.currentInnerEndIndex);
  }

  renderTimeRange(start, end) {
    const startIndex = VesselsTileData.getOffsetedTimeAtPrecision(start, this.outerStartDateOffset);
    const endIndex = VesselsTileData.getOffsetedTimeAtPrecision(end, this.outerStartDateOffset);

    if (this.currentInnerStartIndex === startIndex && this.currentInnerEndIndex === endIndex) {
      // TODO: check only startIndex to avoid bypassing when current is 10-20 and next is 10-21 (rounding issue)
      // and force drawing when innerDelta changed
      // return -1;
    }

    // console.log('???', startIndex, endIndex)

    this.currentInnerStartIndex = startIndex;
    this.currentInnerEndIndex = endIndex;

    // // console.log(startIndex)
    // this.render(startIndex, endIndex);
    this.render();

    return startIndex;
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
