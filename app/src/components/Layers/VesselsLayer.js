import VesselsLayerOverlay from './VesselsLayerOverlay';
import VesselsLayerTiled from './VesselsLayerTiled';
import VesselsTileData from './VesselsTileData';
import { VESSEL_CLICK_TOLERANCE_PX } from '../../constants';


export default class VesselsLayer {

  constructor(map, token, filters, viewportWidth, viewportHeight, debug = false) {
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

    this.overlay = new VesselsLayerOverlay(map, viewportWidth, viewportHeight, debug);
    this.tiled = new VesselsLayerTiled(
      this.map,
      token,
      filters,
      this.outerStartDateOffset,
      debug
    );
    this.tiled.tileCreatedCallback = this._onTileCreated.bind(this);
    this.tiled.tileReleasedCallback = this._onTileReleased.bind(this);

    this.centerListener = google.maps.event.addListener(this.map, 'center_changed', this._onCenterChanged.bind(this));
  }

  updateFlag(flag) {
    this.overlay.setFlag(flag);
    this.tiled.setFlag(flag);
    this.render();
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

  show() {
    this.overlay.show();
    this.tiled.show();
  }

  hide() {
    this.overlay.hide();
    this.tiled.hide();
  }

  render() {
    this.overlay.render(this.tiled.tiles, this.currentInnerStartIndex, this.currentInnerEndIndex);
    // this.tiled.render(this.currentInnerStartIndex, this.currentInnerEndIndex);
  }

  renderTimeRange(start, end) {
    const startIndex = VesselsTileData.getOffsetedTimeAtPrecision(start, this.outerStartDateOffset);
    const endIndex = VesselsTileData.getOffsetedTimeAtPrecision(end, this.outerStartDateOffset);

    if (this.currentInnerStartIndex === startIndex && this.currentInnerEndIndex === endIndex) {
      return;
    }

    // console.log('???', startIndex, endIndex)

    this.currentInnerStartIndex = startIndex;
    this.currentInnerEndIndex = endIndex;

    // // console.log(startIndex)
    // this.render(startIndex, endIndex);
    this.render();
  }

  updateViewportSize(width, height) {
    this.overlay.updateViewportSize(width, height);
  }

  selectVesselsAt(x, y) {
    const tile = this.tiled.getTileAt(x, y);
    if (tile === null || tile.data === null) return [];

    const offsetedX = x - tile.box.left;
    const offsetedY = y - tile.box.top;

    const vessels = [];

    for (let f = this.currentInnerStartIndex; f < this.currentInnerEndIndex; f++) {
      const frame = tile.data[f];
      if (frame === undefined) continue;
      for (let i = 0; i < frame.x.length; i++) {
        const vx = frame.x[i];
        const vy = frame.y[i];
        if (vx >= offsetedX - VESSEL_CLICK_TOLERANCE_PX && vx <= offsetedX + VESSEL_CLICK_TOLERANCE_PX &&
            vy >= offsetedY - VESSEL_CLICK_TOLERANCE_PX && vy <= offsetedY + VESSEL_CLICK_TOLERANCE_PX) {
          vessels.push({
            value: frame.value[i],
            category: frame.category[i],
            series: frame.series[i],
            seriesgroup: frame.seriesgroup[i]
          });
        }
      }
    }
    return vessels;
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
