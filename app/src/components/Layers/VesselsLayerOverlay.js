/* global PIXI */

import 'pixi.js';
import { TIMELINE_MAX_STEPS } from '../../constants';

const MAX_SPRITES_FACTOR = 0.002;

export default class VesselsOverlay extends google.maps.OverlayView {

  constructor(map, viewportWidth, viewportHeight) {
    super();

    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    this.map = map;
    this.setMap(map);
  }

  onAdd() {
    this._build();
    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.container);
  }

  _build() {
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';

    const rect = this._getCanvasRect();
    this.renderer = new PIXI.WebGLRenderer(rect.width, rect.height, { transparent: true });

    this.canvas = this.renderer.view;
    this.canvas.style.position = 'absolute';

    // this.stage = new PIXI.Container();
    const maxSprites = this._getSpritesPerStep() * TIMELINE_MAX_STEPS;
    this.stage = new PIXI.ParticleContainer(maxSprites, { scale: true, position: true });
    this.stage.blendMode = PIXI.BLEND_MODES.SCREEN;
    // this.stage = new PIXI.Container();

    this.container.appendChild(this.canvas);

    this.mainVesselTexture = PIXI.Texture.fromCanvas(this._getVesselTemplate(5, 0.15));

    this.spritesPool = [];
    this.timeIndexDelta = 0;

    this.debugTexts = [];
  }

  _getVesselTemplate(radius, blurFactor) {
    const tplCanvas = document.createElement('canvas');
    const tplCtx = tplCanvas.getContext('2d');
    const x = radius;
    const y = radius;
    tplCanvas.width = tplCanvas.height = radius * 2;

    if (blurFactor === 1) {
      tplCtx.beginPath();
      tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
      tplCtx.fillStyle = 'rgba(255, 255, 237, 0.5)';
      tplCtx.fill();
    } else {
      const gradient = tplCtx.createRadialGradient(x, y, radius * blurFactor, x, y, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.1, 'rgba(136, 251, 255,1)');
      gradient.addColorStop(0.2, 'rgba(255, 248, 150,1)');
      gradient.addColorStop(1, 'rgba(48, 149, 255, 0)');
      tplCtx.fillStyle = gradient;
      tplCtx.fillRect(0, 0, 2 * radius, 2 * radius);
    }
    return tplCanvas;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.div_);
    this.container = null;
  }

  repositionCanvas() {
    if (!this.container) return;

    const rect = this._getCanvasRect();

    this.container.style.left = `${rect.x}px`;
    this.container.style.top = `${rect.y}px`;
    this.renderer.resize(rect.width, rect.height);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  updateViewportSize(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this._resizeSpritesPool();
  }

  _getCanvasRect() {
    const overlayProjection = this.getProjection();

    const mapBounds = this.map.getBounds();
    const sw = overlayProjection.fromLatLngToDivPixel(mapBounds.getSouthWest());
    const ne = overlayProjection.fromLatLngToDivPixel(mapBounds.getNorthEast());

    return {
      x: sw.x,
      y: ne.y,
      width: ne.x - sw.x,
      height: sw.y - ne.y
    };
  }

  draw() {}

  render(tiles, startIndex, endIndex) {
    if (!this.stage) return;
    // this.debugTexts.forEach(text => {
    //   this.stage.removeChild(text);
    // });
    // this.debugTexts = [];

    const newTimeIndexDelta = endIndex - startIndex;

    if (this.timeIndexDelta !== newTimeIndexDelta) {
      const delta = newTimeIndexDelta - this.timeIndexDelta;
      // because of the way dates are rounded, the range length can vary of one day even if the user didnt change range
      // in that case skip resizing sprites pool, avoiding doing this in the middle of on animation
      if (Math.abs(delta) !== 1) {
        this.timeIndexDelta = newTimeIndexDelta;
        this._resizeSpritesPool();
      }
    }

    this.numSprites = 0;

    tiles.forEach(tile => {
      // const text = new PIXI.Text('This is a pixi text', { fontFamily: 'Arial', fontSize: 14, fill: 0xff1010 });
      // text.position.x = bounds.left;
      // text.position.y = bounds.top;
      // this.stage.addChild(text);
      // this.debugTexts.push(text);

      const bounds = tile.getBoundingClientRect();
      if (!document.body.contains(tile)) {
        console.warn('rendering tile that doesnt exist in the DOM', tile);
      }

      if (bounds.left === 0 && bounds.top === 0) {
        console.warn('tile at 0,0');
      }

      if (tile.ready === true) {
        this.numSprites += this._dumpTileVessels(startIndex, endIndex, tile.data, bounds.left, bounds.top, tile.error);
      }
    });

    // hide unused sprites
    for (let i = this.numSprites, poolSize = this.spritesPool.length; i < poolSize; i++) {
      this.spritesPool[i].x = -100;
    }

    this.renderer.render(this.stage);
  }

  _dumpTileVessels(startIndex, endIndex, data, offsetX, offsetY) {
    if (!data) {
      return 0;
    }

    let numSprites = 0;

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex ++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      numSprites += frame.x.length;
      for (let index = 0, len = frame.x.length; index < len; index++) {
        const sprite = this.spritesPool[this.numSprites];
        // const weight = playbackData.weight[i];
        const value = frame.value[index];
        // const value = Math.min(5, Math.max(1, Math.round(weight / 30)));
        // allValues += value;

        sprite.position.x = offsetX + frame.x[index];
        sprite.position.y = offsetY + frame.y[index];
        sprite.scale.set(value);

        this.numSprites++;
      }
    }

    return numSprites;
  }

  _resizeSpritesPool() {
    // compute final pool size
    const finalPoolSize = this.timeIndexDelta * this._getSpritesPerStep();
    const currentPoolSize = this.spritesPool.length;
    const poolDelta = finalPoolSize - currentPoolSize;

    if (poolDelta > 0) {
      this._addSprites(poolDelta);
    } else {
      const startRemovingAt = currentPoolSize - poolDelta;
      for (let i = startRemovingAt; i < currentPoolSize; i++) {
        // this is actually insanely costly - keep this in RAM and be done with it ?
        // this.stage.removeChild(this.spritesPool[i]);
      }
      // this.spritesPool.splice(- deltaSprites);
    }

    // disable all sprites and let render take it from there
    const newTotalPoolSize = this.spritesPool.length;

    for (let i = 0; i < newTotalPoolSize; i++) {
      // ParticlesContainer does not support .visible, so we just move the sprite out of the viewport
      this.spritesPool[i].x = -100;
    }
  }

  _addSprites(num) {
    // console.log('add sprites: ', num);
    for (let i = 0; i < num; i++) {
      const vessel = new PIXI.Sprite(this.mainVesselTexture);
      vessel.anchor.x = vessel.anchor.y = 0.5;
      // ParticlesContainer does not support .visible, so we just move the sprite out of the viewport
      vessel.x = -100;
      // vessel.blendMode = PIXI.BLEND_MODES.SCREEN;
      // vessel.filters=  [new PIXI.filters.BlurFilter(10,10)]
      this.spritesPool.push(vessel);
      this.stage.addChild(vessel);
    }
  }

  _getSpritesPerStep() {
    return Math.round(this.viewportWidth * this.viewportHeight * MAX_SPRITES_FACTOR);
  }
}
