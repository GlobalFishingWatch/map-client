/* global PIXI */
import 'pixi.js';

export default class TracksLayerGL {
  constructor() {
    this.stage = new PIXI.Graphics();
  }

  drawTracks(tracks, drawParams) {
    this.stage.clear();
    tracks.forEach((track) => {
      this._drawTrack(track.data, track.selectedSeries, track.hue, drawParams);
    });
    this.stage.lineStyle(10, 0xff00ff, 1);
    this.stage.moveTo(0, 0);
    this.stage.lineTo(Math.random() * 300,Math.random() *  300);
  }
}
