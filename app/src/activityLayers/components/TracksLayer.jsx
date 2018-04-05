/* global PIXI */
import 'pixi.js';
import React from 'react';
import PropTypes from 'prop-types';
import { worldToPixels } from 'viewport-mercator-project';
import {
  TRACKS_DOTS_STYLE_ZOOM_THRESHOLD,
  // HALF_WORLD
} from 'config';
import { hueToRgbHexString } from 'utils/colors';

class TracksLayer extends React.Component {
  componentDidMount() {
    this._build();
  }

  componentDidUpdate() {
    this._redraw();
  }

  _build() {
    const { rootStage } = this.props;
    this.stage = new PIXI.Graphics();
    this.stage.nativeLines = true;
    rootStage.addChild(this.stage);
  }

  clear() {
    this.stage.clear();
  }

  _redraw() {
    const { tracks, zoom, startIndex, endIndex, timelineOverExtentIndexes } = this.props;

    const overInInner = (timelineOverExtentIndexes === undefined) ? undefined : [
      Math.max(startIndex, timelineOverExtentIndexes[0]),
      Math.min(endIndex, timelineOverExtentIndexes[1])
    ];
    const overExtent = (overInInner && overInInner[1] - overInInner[0] > 0) ? overInInner : undefined;

    this.clear();
    let n = 0; // eslint-disable-line no-unused-vars

    const drawFishingCircles = zoom > TRACKS_DOTS_STYLE_ZOOM_THRESHOLD;
    const fishingCirclesRadius = 1 + ((zoom - TRACKS_DOTS_STYLE_ZOOM_THRESHOLD) * 0.5);
    const drawOverTrack = overExtent !== undefined &&
        overExtent[0] > 0 && overExtent[1] > 0;

    tracks.forEach((track) => {
      // TODO move to tracksActions, let's have TracksLayer be dumber and not care about hue
      const convertedColor = hueToRgbHexString(Math.min(359, track.hue));

      n += this._drawTrack({
        data: track.data,
        series: track.selectedSeries,
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
          series: track.selectedSeries,
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
  _drawTrack({ data, series, drawFishingCircles, fishingCirclesRadius, color, lineThickness, lineOpacity }) {
    const { viewport, startIndex, endIndex } = this.props;

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

        const [x, y] = worldToPixels(
          [frame.worldX[i] * viewport.scale, frame.worldY[i] * viewport.scale],
          viewport.pixelProjectionMatrix
        );

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

  render() {
    return null;
  }
}

TracksLayer.propTypes = {
  zoom: PropTypes.number,
  rootStage: PropTypes.object,
  viewport: PropTypes.object,
  startIndex: PropTypes.number,
  endIndex: PropTypes.number,
  timelineOverExtentIndexes: PropTypes.array,
  tracks: PropTypes.array
};

export default TracksLayer;
