/* global PIXI */
import 'pixi.js';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HUES_INCREMENTS_NUM,
  MAX_SPRITES_PER_LAYER
} from 'config';
import { hueToHueIncrement } from 'utils/colors';

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
    }
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
    const prevNumSprites = this.stage.children.length;
    const numSpritesNeededWithMargin = numProps + 4000;

    if (numProps + 2000 > prevNumSprites || numProps < prevNumSprites / 2) {
      this._resizeSpritesPool(numSpritesNeededWithMargin);
    }

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

  _resizeSpritesPool(finalPoolSize) {
    const currentPoolSize = this.stage.children.length;
    const poolDelta = finalPoolSize - currentPoolSize;
    if (poolDelta === 0) {
      return;
    }
    console.log('before ', this.stage.children.length);
    if (poolDelta > 0) {
      console.log('adding ', poolDelta, 'sprites');
      this._addSprites(poolDelta);
    } else {
      console.log('removing ', poolDelta, 'sprites');
      for (let i = finalPoolSize; i < currentPoolSize; i++) {
        this.stage.removeChildAt(finalPoolSize - 1);
      }
    }

    console.log('now ', this.stage.children.length);
    console.log('----')

    // disable all sprites and let render take it from there
    this._clear();
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

  _clear(render = false) {
    for (let i = 0, poolSize = this.stage.children.length; i < poolSize; i++) {
      // ParticlesContainer does not support .visible, so we just move the sprite out of the viewport
      this.stage.children[i].x = -100;
    }
    if (render) {
      this.renderer.render(this.stage);
    }
  }
}
