import VesselsLayerOverlay from 'components/Layers/VesselsLayerOverlay';
import VesselsLayerTiled from 'components/Layers/VesselsLayerTiled';
import VesselsTileData from 'components/Layers/VesselsTileData';
import { VESSEL_CLICK_TOLERANCE_PX } from 'constants';
import _ from 'lodash';
import * as d3 from 'd3';

export default class VesselsLayer {

  constructor(map, tilesetUrl, token, filters, viewportWidth, viewportHeight, debug = false) {
    this.map = map;

    const innerStartDate = filters.timelineInnerExtent[0];
    const innerEndDate = filters.timelineInnerExtent[1];
    this.overallStartDateOffset = VesselsTileData.getTimeAtPrecision(filters.timelineOverallExtent[0]);

    this.currentInnerStartIndex = VesselsTileData.getOffsetedTimeAtPrecision(
        innerStartDate.getTime(),
        this.overallStartDateOffset
    );
    this.currentInnerEndIndex = VesselsTileData.getOffsetedTimeAtPrecision(
        innerEndDate.getTime(),
        this.overallStartDateOffset
    );

    this.overlay = new VesselsLayerOverlay(
      map,
      filters,
      viewportWidth,
      viewportHeight,
      debug
    );
    this.tiled = new VesselsLayerTiled(
      this.map,
      tilesetUrl,
      token,
      filters,
      this.overallStartDateOffset,
      debug
    );
    this.tiled.tileCreatedCallback = this._onTileCreated.bind(this);
    this.tiled.tileReleasedCallback = this._onTileReleased.bind(this);
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

  show() {
    this.overlay.show();
    this.tiled.show();
  }

  hide() {
    this.overlay.hide();
    this.tiled.hide();
  }

  reposition() {
    this.overlay.repositionCanvas();
  }

  render() {
    this.overlay.render(this.tiled.tiles, this.currentInnerStartIndex, this.currentInnerEndIndex);
    // this.tiled.render(this.currentInnerStartIndex, this.currentInnerEndIndex);
  }

  renderTimeRange(start, end) {
    const startIndex = VesselsTileData.getOffsetedTimeAtPrecision(start, this.overallStartDateOffset);
    const endIndex = VesselsTileData.getOffsetedTimeAtPrecision(end, this.overallStartDateOffset);

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

  getHistogram(propName = 'weight') {
    let data = this.tiled.tiles
      .filter(tile => tile.ready)
      .map(tile => tile.data
        .map(frame => frame[propName]));
    data = _.flattenDeep(data)
    console.log(data.length)
    if (data.length) {
      const bins = d3.histogram().thresholds(d3.thresholdScott)(data);
      const x = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)]).range([0, 50]);
      console.table(bins.filter(bin => bin.length).map(bin => {
        const binMin = d3.min(bin).toLocaleString({ maximumFractionDigits: 2 });
        const binMax = d3.max(bin).toLocaleString({ maximumFractionDigits: 2 });
        return {
          range: [binMin, binMax].join('﹣'),
          bars: Array(Math.round(x(bin.length))).join('█'),
          num: bin.length
        };
      }));
    }
  }

}
