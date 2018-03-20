/* global PIXI */
import 'pixi.js';
import {
  TRACKS_DOTS_STYLE_ZOOM_THRESHOLD,
  HALF_WORLD
} from 'config';
import { hueToRgbHexString } from 'util/colors';

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
    let n = 0; // eslint-disable-line no-unused-vars

    const drawFishingCircles = drawParams.zoom > TRACKS_DOTS_STYLE_ZOOM_THRESHOLD;
    const fishingCirclesRadius = 1 + ((drawParams.zoom - TRACKS_DOTS_STYLE_ZOOM_THRESHOLD) * 0.5);
    const drawOverTrack = drawParams.timelineOverExtentIndexes !== undefined &&
        drawParams.timelineOverExtentIndexes[0] > 0 && drawParams.timelineOverExtentIndexes[1] > 0;

    tracks.forEach((track) => {
      // TODO move to tracksActions, let's have TracksLayer be dumber and not care about hue
      const convertedColor = hueToRgbHexString(Math.min(359, track.hue));

      n += this._drawTrack({
        data: track.data,
        extent: drawParams.timelineInnerExtentIndexes,
        series: track.selectedSeries,
        offsets,
        drawFishingCircles,
        fishingCirclesRadius,
        color: track.color || convertedColor,
        lineThickness: 1,
        lineOpacity: 1
      });

      // Draw the highlight over the track when the user hovers over the Timebar
      if (drawOverTrack === true) {
        n += this._drawTrack({
          data: track.data,
          extent: drawParams.timelineOverExtentIndexes,
          series: track.selectedSeries,
          offsets,
          drawFishingCircles,
          fishingCirclesRadius,
          color: '0xFFFFFF',
          lineThickness: 2,
          lineOpacity: 1
        });
      }
    });

    // console.log(n);
  }

  /**
   * Draws a single track (line + points)
   *
   * @param data track points data in 'playback form' (ie organized by days)
   * @param extent extent, in day indices
   * @param series (optional) used to filter points by series
   * @param offset object containing info about the current situation of the map viewport, used to compute screen coords
   * @param drawFishingCircles whether to draw fishing circles or not
   * @param fishingCirclesRadius radius of the fishing circles
   * @param color
   * @param lineThickness
   * @param lineOpacity
   */
  _drawTrack({ data, extent, series, offsets, drawFishingCircles, fishingCirclesRadius, color, lineThickness, lineOpacity }) {
    const startIndex = extent[0];
    const endIndex = extent[1];
    const viewportWorldX = offsets.left;

    let n = 0;
    let prevSeries;

    const circlePoints = {
      x: [],
      y: []
    };

    this.stage.lineStyle(lineThickness, color, lineOpacity);

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      for (let i = 0, len = frame.series.length; i < len; i++) {
        const currentSeries = frame.series[i];
        if (series && series !== currentSeries) {
          continue;
        }

        n++;

        let pointWorldX = frame.worldX[i];

        // Add a whole world to x coordinate, when point is after antimeridian and part of the world shown is the after the prime meridian.
        // This way we move the new point to the "second world" on the right avoiding issues when rendring tracks that cross antimeridian.
        if (viewportWorldX > HALF_WORLD && pointWorldX < HALF_WORLD) {
          pointWorldX += 256;
        }
        const x = ((pointWorldX - viewportWorldX) * offsets.scale);
        const y = ((frame.worldY[i] - offsets.top) * offsets.scale);

        if (prevSeries !== currentSeries) {
          this.stage.moveTo(x, y);
        }
        this.stage.lineTo(x, y);

        if (drawFishingCircles && frame.hasFishing[i] === true) {
          circlePoints.x.push(x);
          circlePoints.y.push(y);
        }

        prevSeries = currentSeries;
      }
    }

    if (drawFishingCircles) {
      this.stage.lineStyle(0);
      this.stage.beginFill(color, 1);
      for (let i = 0, circlesLength = circlePoints.x.length; i < circlesLength; i++) {
        this.stage.drawCircle(circlePoints.x[i], circlePoints.y[i], fishingCirclesRadius);
      }
      this.stage.endFill();
    }

    return n;
  }
}
