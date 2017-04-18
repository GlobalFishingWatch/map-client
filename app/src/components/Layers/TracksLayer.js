/* global PIXI */
import 'pixi.js';
import {
  TRACK_SEGMENT_TYPES,
  TRACKS_DOTS_STYLE_ZOOM_THRESHOLD,
  HALF_WORLD
} from 'constants';
import { hueToRgbHexString } from 'util/hsvToRgb';

export default class TracksLayerGL {
  constructor() {
    this.stage = new PIXI.Graphics();
    this.stage.nativeLines = true;
  }

  clear() {
    this.stage.clear();
  }

  update(tracks, drawParams, offsets) {
    this.clear();

    tracks.forEach((track) => {
      this._drawTrack(track.data, track.selectedSeries, track.hue, drawParams, offsets);
    });
  }

  /**
   * Draw a single track (line + points)
   *
   * @param data
   * @param queriedSeries
   * @param hue
   * @param drawParams
   * @param offsets -
   * An object containing the world top and left and the scale factor (dependent on zoom).
   * This is used to convert world coordinates to pixels
   */
  _drawTrack(data, queriedSeries, hue, drawParams, offsets) {
    const color = hueToRgbHexString(hue);
    let prevDrawStyle;
    let prevSeries;
    let currentSeries;
    let prevX;
    let prevY;
    let newLine;

    const circlePoints = {
      inner: {
        x: [],
        y: [],
        radius: []
      },
      over: {
        x: [],
        y: [],
        radius: []
      }
    };

    const viewportWorldX = offsets.left;
    for (let i = 0, length = data.worldX.length; i < length; i++) {
      prevSeries = currentSeries;
      currentSeries = data.series[i];
      if (queriedSeries && queriedSeries !== currentSeries) {
        continue;
      }

      let pointWorldX = data.worldX[i];

      // Add a whole world to x coordinate, when point is after antimeridian and part of the world shown is the after the prime meridian.
      // This way we move the new point to the "second world" on the right avoiding issues when rendring tracks that cross antimeridian.
      if (viewportWorldX > HALF_WORLD && pointWorldX < HALF_WORLD) {
        pointWorldX += 256;
      }
      const x = ((pointWorldX - viewportWorldX) * offsets.scale);
      const y = ((data.worldY[i] - offsets.top) * offsets.scale);

      const drawStyle = this.getDrawStyle(data.datetime[i], drawParams);
      if (prevDrawStyle !== drawStyle) {
        if (drawStyle === TRACK_SEGMENT_TYPES.OutOfInnerRange) {
          this.stage.lineStyle(1, color, 0.3);
        } else if (drawStyle === TRACK_SEGMENT_TYPES.InInnerRange) {
          this.stage.lineStyle(2, color, 1);
        } else if (drawStyle === TRACK_SEGMENT_TYPES.Highlighted) {
          if (drawParams.zoom > TRACKS_DOTS_STYLE_ZOOM_THRESHOLD) {
            this.stage.lineStyle(2, '0xFFFFFF', 1);
          } else {
            this.stage.lineStyle(4, '0xFFFFFF', 1);
          }
        }
        this.stage.moveTo(prevX || x, prevY || y);
        newLine = true;
      }
      if (prevSeries !== currentSeries) {
        this.stage.moveTo(x, y);
        newLine = true;
      }
      this.stage.lineTo(x, y);

      // 'lineNative' rendering style fixes various rendering issues, but does not allow
      // for lines thickness different than 1. We double the line and offset it to give the illusion of
      // a 2px wide line
      if (drawStyle !== TRACK_SEGMENT_TYPES.OutOfInnerRange && newLine !== true) {
        this.stage.moveTo(prevX + 1, prevY);
        this.stage.lineTo(x + 1, y);
        this.stage.moveTo(x, y);
      }

      if (drawParams.zoom > TRACKS_DOTS_STYLE_ZOOM_THRESHOLD) {
        if (drawStyle === TRACK_SEGMENT_TYPES.Highlighted) {
          circlePoints.over.x.push(x);
          circlePoints.over.y.push(y);
          circlePoints.over.radius.push(data.radius[i]);
        } else if (drawStyle === TRACK_SEGMENT_TYPES.InInnerRange) {
          circlePoints.inner.x.push(x);
          circlePoints.inner.y.push(y);
          circlePoints.inner.radius.push(data.radius[i]);
        }
      }
      prevDrawStyle = drawStyle;
      prevX = x;
      prevY = y;
      newLine = false;
    }

    this.stage.lineStyle(0);

    // easier to check zoom lvl than if circlePoints exist
    if (drawParams.zoom > TRACKS_DOTS_STYLE_ZOOM_THRESHOLD) {
      // inner range center circle
      this.stage.beginFill(color, 1);
      for (let i = 0, circlesLength = circlePoints.inner.x.length; i < circlesLength; i++) {
        this.stage.drawCircle(circlePoints.inner.x[i], circlePoints.inner.y[i], 2);
      }
      this.stage.endFill();

      // hover range center circle
      this.stage.beginFill('0xFFFFFF', 1);
      for (let i = 0, circlesLength = circlePoints.over.x.length; i < circlesLength; i++) {
        this.stage.drawCircle(circlePoints.over.x[i], circlePoints.over.y[i], 2);
      }
      this.stage.endFill();
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
