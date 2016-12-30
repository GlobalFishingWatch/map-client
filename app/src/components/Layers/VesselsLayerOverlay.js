/* global PIXI */
import 'pixi.js';
import BaseOverlay from 'components/Layers/BaseOverlay';
import {
  TIMELINE_MAX_STEPS,
  VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD,
  VESSELS_BASE_RADIUS,
  VESSELS_HEATMAP_BLUR_FACTOR,
  VESSELS_HEATMAP_COLOR_STOPS,
  VESSELS_CIRCLES_COLOR
} from 'constants';

const MAX_SPRITES_FACTOR = 0.002;

export default class VesselsLayerOverlay extends BaseOverlay {

  constructor(flag, viewportWidth, viewportHeight) {
    super();

    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    this.setFlag(flag);
  }

  setFlag(flag) {
    if (flag !== '') {
      this.flag = parseInt(flag, 10);
    } else {
      this.flag = null;
    }
  }

  onAdd() {
    this._build();
    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.container);
  }

  onRemove() {}

  _build() {
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';

    this.renderer = new PIXI.WebGLRenderer(this.viewportWidth, this.viewportHeight, { transparent: true });

    this.canvas = this.renderer.view;
    this.canvas.style.position = 'absolute';

    // this.stage = new PIXI.Container();
    // the ParticleContainer is a fastest version of the PIXI sprite container
    const maxSprites = this._getSpritesPerStep() * TIMELINE_MAX_STEPS;
    this.stage = new PIXI.particles.ParticleContainer(maxSprites, {
      scale: true,
      alpha: true,
      position: true,
      uvs: true
    });
    this.stage.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.container.appendChild(this.canvas);

    const baseTexture = PIXI.Texture.fromCanvas(
      this._getVesselTexture(VESSELS_BASE_RADIUS, VESSELS_HEATMAP_BLUR_FACTOR)
    );
    this.mainVesselTexture = new PIXI.Texture(baseTexture, this._getTextureFrame());

    this.spritesPool = [];
    this.timeIndexDelta = 0;
  }

  // builds a texture spritesheet containing both the heatmap style (radial gradient)
  // and the circle style that is used at higher zoom levels
  // Then, only the texture frame is modified depending on the zoom level,
  // in order not to have to recreate sprites
  _getVesselTexture(radius, blurFactor) {
    const tplCanvas = document.createElement('canvas');
    const tplCtx = tplCanvas.getContext('2d');
    const diameter = radius * 2;
    tplCanvas.width = diameter * 2 + 1; // tiny offset between 2 frames
    tplCanvas.height = diameter;

    const y = radius;

    // heatmap style
    let x = radius;
    const gradient = tplCtx.createRadialGradient(x, y, radius * blurFactor, x, y, radius);
    VESSELS_HEATMAP_COLOR_STOPS.forEach(colorStop => { gradient.addColorStop(colorStop.stop, colorStop.color); });
    tplCtx.fillStyle = gradient;
    tplCtx.fillRect(0, 0, diameter, diameter);

    // circle style
    x += diameter + 1; // tiny offset between 2 frames
    tplCtx.beginPath();
    tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
    tplCtx.fillStyle = VESSELS_CIRCLES_COLOR;
    tplCtx.fill();

    return tplCanvas;
  }

  _getTextureFrame(xOffset = 0) {
    return new PIXI.Rectangle(xOffset, 0, VESSELS_BASE_RADIUS * 2, VESSELS_BASE_RADIUS * 2);
  }

  repositionCanvas() {
    if (!this.container) return;
    const offset = super.getRepositionOffset(this.viewportWidth, this.viewportHeight);
    this.container.style.left = `${offset.x}px`;
    this.container.style.top = `${offset.y}px`;
    this.renderer.resize(this.viewportWidth, this.viewportHeight);
    this.canvas.style.width = `${this.viewportWidth}px`;
    this.canvas.style.height = `${this.viewportHeight}px`;
  }

  updateViewportSize(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this._resizeSpritesPool();
    this.repositionCanvas();
  }

  _getCanvasRect() {
    const overlayProjection = this.getProjection();

    const mapBounds = this.getMap().getBounds();
    const sw = overlayProjection.fromLatLngToDivPixel(mapBounds.getSouthWest());
    const ne = overlayProjection.fromLatLngToDivPixel(mapBounds.getNorthEast());

    return {
      x: sw.x,
      y: ne.y,
      width: ne.x - sw.x,
      height: sw.y - ne.y
    };
  }

  draw() {
    this.repositionCanvas();
  }

  show() {
    this.hidden = false;
    this.container.style.display = 'block';
  }

  hide() {
    this.hidden = true;
    this.container.style.display = 'none';
    this._clear(true);
  }

  setZoom(zoom) {
    // one diameter + tiny offset between 2 frames
    const textureXOffset = (zoom < VESSELS_HEATMAP_STYLE_ZOOM_THRESHOLD) ? 0 : VESSELS_BASE_RADIUS * 2 + 1;
    this.mainVesselTexture.frame = this._getTextureFrame(textureXOffset);
    this.mainVesselTexture.update();
  }

  setOpacity(opacity) {
    this.canvas.style.opacity = opacity;
  }

  render(tiles, startIndex, endIndex) {
    if (!this.stage || this.hidden) return;

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

      for (let index = 0, len = frame.x.length; index < len; index++) {
        if (this.flag && this.flag !== frame.category[index]) {
          continue;
        }
        numSprites++;
        const sprite = this.spritesPool[this.numSprites];

        sprite.position.x = offsetX + frame.x[index];
        sprite.position.y = offsetY + frame.y[index];
        sprite.alpha = frame.opacity[index];
        sprite.scale.set(frame.radius[index]);

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
    this._clear();
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

  _clear(render = false) {
    for (let i = 0, poolSize = this.spritesPool.length; i < poolSize; i++) {
      // ParticlesContainer does not support .visible, so we just move the sprite out of the viewport
      this.spritesPool[i].x = -100;
    }
    if (render) {
      this.renderer.render(this.stage);
    }
  }
}
