/* global PIXI */
import 'pixi.js';
import React from 'react';
import PropTypes from 'prop-types';
import { worldToPixels } from 'viewport-mercator-project';
import {
  TRACKS_DOTS_STYLE_ZOOM_THRESHOLD
} from 'config';

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
    const { tracks, zoom, startIndex, endIndex, timelineOverExtentIndexes, highlightedTrack } = this.props;

    this.clear();
    if (!tracks.length) {
      return;
    }

    const overInInner = (timelineOverExtentIndexes === undefined) ? undefined : [
      Math.max(startIndex, timelineOverExtentIndexes[0]),
      Math.min(endIndex, timelineOverExtentIndexes[1])
    ];
    const overExtent = (overInInner && overInInner[1] - overInInner[0] > 0) ? overInInner : undefined;

    let n = 0; // eslint-disable-line no-unused-vars

    const drawFishingCircles = zoom > TRACKS_DOTS_STYLE_ZOOM_THRESHOLD;
    const fishingCirclesRadius = 1 + ((zoom - TRACKS_DOTS_STYLE_ZOOM_THRESHOLD) * 0.5);
    const drawOverTrack = overExtent !== undefined &&
        overExtent[0] > 0 && overExtent[1] > 0;

    tracks.forEach((track) => {
      n += this._drawTrack({
        data: track.data,
        startIndex,
        endIndex,
        series: track.selectedSeries,
        drawFishingCircles,
        fishingCirclesRadius,
        color: (highlightedTrack === track.seriesgroup) ? '0xFFFFFF' : `0x${track.color.substr(1)}`,
        lineThickness: (highlightedTrack === track.seriesgroup) ? 3 : 1,
        lineOpacity: 1
      });

      // Draw the highlight over the track when the user hovers over the Timebar
      if (drawOverTrack === true) {
        n += this._drawTrack({
          data: track.data,
          startIndex: timelineOverExtentIndexes[0],
          endIndex: timelineOverExtentIndexes[1],
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
   * @param worldOffset offset to use when a track crosses the dateline (ie 512 to add a second world to the right)
   */
  _drawTrack({
    data, startIndex, endIndex, series, drawFishingCircles,
    fishingCirclesRadius, color, lineThickness, lineOpacity, worldOffset = 0
  }) {
    const { viewport } = this.props;

    let n = 0;
    let prevSeries;
    let prevWorldX;
    let prevWorldY;

    const circlePoints = {
      x: [],
      y: []
    };

    // line thickness is ignored in native mode anyways.
    this.stage.lineStyle(lineThickness, color, lineOpacity);

    let duplicateWorld = false;

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      for (let i = 0, len = frame.series.length; i < len; i++) {
        const currentSeries = frame.series[i];
        if (series && series !== currentSeries) {
          continue;
        }

        n++;

        const worldX = frame.worldX[i] + worldOffset;
        const worldY = frame.worldY[i];

        const [x, y] = worldToPixels(
          [worldX * viewport.scale, worldY * viewport.scale],
          viewport.pixelProjectionMatrix
        );

        if (prevSeries !== currentSeries) {
          this.stage.moveTo(x, y);
        }

        // more than a ½ world of distance between two points = crossing the dateline
        if (prevWorldX && Math.abs(worldX - prevWorldX) > 256) {
          // worldOffset === 0 -> this is the first time drawTrack is called
          if (worldOffset === 0) {
            // set a flag to call drawTrack again at the end of the loop
            duplicateWorld = true;
          }

          // get Y coordinate where track intersects with dateline
          const atDatelineWorldY = prevWorldY + ((worldY - prevWorldY) / 2);

          // whether tracks crosses dateline from west to east
          const isWestToEast = (worldX - prevWorldX) < 0;

          const worldXEnd = worldOffset + (512 - 0.000001);
          const worldXStart = worldOffset;

          // get X coordinate ending at dateline
          const atDatelineEndWorldX = (isWestToEast) ? worldXEnd : worldXStart;

          // get X coordinate starting at dateline
          const atDatelineStartWorldX = (isWestToEast) ? worldXStart : worldXEnd;

          const [x1, y1] = worldToPixels(
            [atDatelineEndWorldX * viewport.scale, atDatelineWorldY * viewport.scale],
            viewport.pixelProjectionMatrix
          );
          this.stage.lineTo(x1, y1);
          const [x2, y2] = worldToPixels(
            [atDatelineStartWorldX * viewport.scale, atDatelineWorldY * viewport.scale],
            viewport.pixelProjectionMatrix
          );
          this.stage.moveTo(x2, y2);
        }

        this.stage.lineTo(x, y);

        if (drawFishingCircles && frame.hasFishing[i] === true) {
          circlePoints.x.push(x);
          circlePoints.y.push(y);
        }

        prevWorldX = worldX;
        prevWorldY = worldY;
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

    if (duplicateWorld === true) {
      [-512, 512].forEach((offset) => {
        this._drawTrack({
          worldOffset: offset,
          data,
          startIndex,
          endIndex,
          series,
          drawFishingCircles,
          fishingCirclesRadius,
          color,
          lineThickness,
          lineOpacity
        });
      });
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
  tracks: PropTypes.array,
  highlightedTrack: PropTypes.number
};

export default TracksLayer;
