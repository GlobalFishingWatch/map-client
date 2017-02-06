/* global PIXI */
import 'pixi.js';
import {
  TRACK_SEGMENT_TYPES
} from 'constants';
import { hueToRgbHexString } from 'util/hsvToRgb';

export default class TracksLayerGL {
  constructor() {
    this.stage = new PIXI.Graphics();
  }

  setMap(map) {
    this.map = map;
    this.projection = this.map.getProjection();
  }

  clear() {
    this.stage.clear();
  }

  drawTracks(tracks, drawParams) {
    const projectionData = {
      top: this.projection.fromLatLngToPoint(this.map.getBounds().getNorthEast()).y,
      left: this.projection.fromLatLngToPoint(this.map.getBounds().getSouthWest()).x,
      scale: 2 ** this.map.getZoom()
    };

    this.clear();

    tracks.forEach((track) => {
      this._drawTrack(track.data, track.selectedSeries, track.hue, drawParams, projectionData);
    });
  }

  /**
   * Draw a single track (line + points)
   *
   * @param data
   * @param series
   * @param drawParams
   * @param projectionData An object containing the world top and left and the scale factor (dependent on zoom).
   * This is used to convert world coordinates to pixels
   */
  _drawTrack(data, queriedSeries, hue, drawParams, projectionData) {
    const color = hueToRgbHexString(hue);

    let prevDrawStyle;
    let prevSeries;
    let currentSeries;
    let prevX;
    let prevY;

    const circlePoints = {
      inner: {
        x: [],
        y: []
      },
      over: {
        x: [],
        y: []
      }
    };

    for (let i = 0, length = data.worldX.length; i < length; i++) {
      prevSeries = currentSeries;
      currentSeries = data.series[i];
      if (queriedSeries && queriedSeries !== currentSeries) {
        continue;
      }
      const x = ((data.worldX[i] - projectionData.left) * projectionData.scale);
      const y = ((data.worldY[i] - projectionData.top) * projectionData.scale);

      const drawStyle = this.getDrawStyle(data.datetime[i], drawParams);
      if (prevDrawStyle !== drawStyle) {
        if (drawStyle === TRACK_SEGMENT_TYPES.OutOfInnerRange) {
          this.stage.lineStyle(0.5, color, 0.3);
        } else if (drawStyle === TRACK_SEGMENT_TYPES.InInnerRange) {
          this.stage.lineStyle(2, color, 1);
        } else if (drawStyle === TRACK_SEGMENT_TYPES.Highlighted) {
          this.stage.lineStyle(2, '0xFFFFFF', 1);
        }
        this.stage.moveTo(prevX || x, prevY || y);
      }
      if (prevSeries !== currentSeries) {
        this.stage.moveTo(x, y);
      }
      this.stage.lineTo(x, y);
      if (drawStyle === TRACK_SEGMENT_TYPES.Highlighted) {
        circlePoints.over.x.push(x);
        circlePoints.over.y.push(y);
      } else if (drawStyle === TRACK_SEGMENT_TYPES.InInnerRange) {
        circlePoints.inner.x.push(x);
        circlePoints.inner.y.push(y);
      }
      prevDrawStyle = drawStyle;
      prevX = x;
      prevY = y;
    }

    this.stage.lineStyle(0.5, color, 1);
    for (let i = 0, circlesLength = circlePoints.inner.x.length; i < circlesLength; i++) {
      this.stage.drawCircle(circlePoints.inner.x[i], circlePoints.inner.y[i], 6);
    }

    this.stage.lineStyle(0.5, '0xFFFFFF', 1);
    for (let i = 0, circlesLength = circlePoints.over.x.length; i < circlesLength; i++) {
      this.stage.drawCircle(circlePoints.over.x[i], circlePoints.over.y[i], 6);
    }
  }

  getDrawStyle(timestamp, { startTimestamp, endTimestamp, overStartTimestamp, overEndTimestamp }) {
    if (overStartTimestamp && overEndTimestamp &&
        timestamp > overStartTimestamp && timestamp < overEndTimestamp) {
      // over style
      return TRACK_SEGMENT_TYPES.Highlighted;
    } else if (timestamp > startTimestamp && timestamp < endTimestamp) {
      // inner style
      return TRACK_SEGMENT_TYPES.InInnerRange;
    }
    // out of inner style
    return TRACK_SEGMENT_TYPES.OutOfInnerRange;
  }
}
