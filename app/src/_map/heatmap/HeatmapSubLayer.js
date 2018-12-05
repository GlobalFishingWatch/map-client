/* global PIXI */
import 'pixi.js';
import { hueToHueIncrement, VESSELS_HUES_INCREMENTS_NUM } from '@globalfishingwatch/map-colors';
import {
  VESSELS_BASE_RADIUS,
  MAX_SPRITES_PER_LAYER
} from '../config';

export default class HeatmapSubLayer {
  constructor(baseTexture, renderingStyleIndex, hue, useNormalBlendMode = false) {
    // this.stage = new PIXI.Container();
    // the ParticleContainer is a faster version of the PIXI sprite container
    this.stage = new PIXI.particles.ParticleContainer(MAX_SPRITES_PER_LAYER, {
      scale: true,
      alpha: true,
      position: true,
      uvs: true
    });
    if (useNormalBlendMode === false) {
      this.stage.blendMode = PIXI.BLEND_MODES.SCREEN;
    }

    this.spritesPool = [];

    const initialTextureFrame = new PIXI.Rectangle(0, 0, VESSELS_BASE_RADIUS * 2, VESSELS_BASE_RADIUS * 2);
    this.mainVesselTexture = new PIXI.Texture(baseTexture, initialTextureFrame);
    this._setTextureFrame(renderingStyleIndex, hue);

    this.clearSpriteProps();
  }

  clearSpriteProps() {
    this.spritesProps = {
      x: new Float32Array(MAX_SPRITES_PER_LAYER),
      y: new Float32Array(MAX_SPRITES_PER_LAYER),
      a: new Float32Array(MAX_SPRITES_PER_LAYER),
      s: new Float32Array(MAX_SPRITES_PER_LAYER)
    };
    this.spritesPropsCount = 0;
  }

  pushSpriteProps(x, y, a, s) {
    this.spritesProps.x[this.spritesPropsCount] = x;
    this.spritesProps.y[this.spritesPropsCount] = y;
    this.spritesProps.a[this.spritesPropsCount] = a;
    this.spritesProps.s[this.spritesPropsCount] = s;
    this.spritesPropsCount++;
  }

  setRenderingStyleIndex(renderingStyleIndex) {
    this._setTextureFrame(renderingStyleIndex);
  }

  destroy() {
    this.spritesPool = null;
    this.stage.destroy({ children: true });
  }

  /**
   * Updates the main texture frame offset to show different brush styles and hues
   * Both args are optional, if one is omitted, previous value is used
   * @heatmapStyle bool whether to use heatmap style or solid circle style
   * @hue number hue value between 0 and 360
   */
  _setTextureFrame(renderingStyleIndex = null, hue = null) {
    const textureFrame = this.mainVesselTexture.frame.clone();

    if (renderingStyleIndex !== null) {
      // one diameter + tiny offset between 2 frames
      textureFrame.x = (VESSELS_BASE_RADIUS * 2 * renderingStyleIndex) + renderingStyleIndex;
    }

    if (hue !== null) {
      let hueIncrement = hueToHueIncrement(hue);
      if (hueIncrement === VESSELS_HUES_INCREMENTS_NUM - 1) {
        hueIncrement = 0;
      }
      textureFrame.y = hueIncrement * VESSELS_BASE_RADIUS * 2;
      if (hueIncrement > 0) {
        textureFrame.y += hueIncrement;
      }
    }

    this.mainVesselTexture.frame = textureFrame;
    this.mainVesselTexture.update();
  }


  render() {
    const numProps = this.spritesPropsCount;
    this.resizeSpritesPool();

    for (let i = 0; i < numProps; i++) {
      const sprite = this.stage.children[i];
      const s = this.spritesProps.s[i];
      sprite.setTransform(this.spritesProps.x[i], this.spritesProps.y[i], s, s)
      sprite.alpha = this.spritesProps.a[i];
    }

    const numSprites = this.stage.children.length;
    for (let i = numProps; i < numSprites; i++) {
      const sprite = this.stage.children[i];
      sprite.x = -100;
    }
  }

  resizeSpritesPool() {
    const numProps = this.spritesPropsCount;
    const prevNumSprites = this.stage.children.length;
    const delta = numProps - prevNumSprites;
    // console.log(prevNumSprites, '->', numProps, ' delta:', delta);

    if (delta < -4999) {
      // sprite needs to be removed. Do that progressively (max 100) to avoid UI lock
      const toRemove = Math.min(100, -delta);
      // console.log('removing ', toRemove);
      for (let i = 0; i < toRemove; i++) {
        this.stage.removeChildAt(0);
      }
    }

    if (delta > 0) {
      const toAdd = Math.max(5000, delta);
      // console.log('adding ', toAdd);
      this._addSprites(toAdd);
    }
  }

  _addSprites(num) {
    for (let i = 0; i < num; i++) {
      const vessel = new PIXI.Sprite(this.mainVesselTexture);
      vessel.anchor.x = 0.5;
      vessel.anchor.y = 0.5;
      // ParticlesContainer does not support .visible, so we just move the sprite out of the viewport
      vessel.x = -100;
      // vessel.blendMode = PIXI.BLEND_MODES.SCREEN;
      // vessel.filters=  [new PIXI.filters.BlurFilter(10,10)]
      this.stage.addChild(vessel);
    }
  }
}
