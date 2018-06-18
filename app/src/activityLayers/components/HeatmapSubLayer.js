/* global PIXI */
import 'pixi.js';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HUES_INCREMENTS_NUM
} from 'config';
import { hueToHueIncrement } from 'utils/colors';

export default class HeatmapSubLayer {
  constructor(baseTexture, maxSprites, renderingStyleIndex, hue, useNormalBlendMode = false) {
    // this.stage = new PIXI.Container();
    // the ParticleContainer is a faster version of the PIXI sprite container
    this.stage = new PIXI.particles.ParticleContainer(maxSprites, {
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

    this._resizeSpritesPool(10000);
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
    // spritesProps is set by HeatmapLayer
    const numSpritesNeeded = this.spritesProps.length;
    const numSpritesNeededWithMargin = numSpritesNeeded * 2;

    if (numSpritesNeeded * 1.3 > this.spritesPool.length) {
      this._resizeSpritesPool(numSpritesNeededWithMargin);
    }

    for (let i = 0; i < numSpritesNeeded; i++) {
      const sprite = this.spritesPool[i];
      const spriteProps = this.spritesProps[i];

      sprite.position.x = spriteProps.x;
      sprite.position.y = spriteProps.y;
      sprite.alpha = spriteProps.alpha;
      sprite.scale.set(spriteProps.scale);
    }

    for (let i = numSpritesNeeded, poolSize = this.spritesPool.length; i < poolSize; i++) {
      this.spritesPool[i].x = -100;
    }
  }

  _resizeSpritesPool(finalPoolSize) {
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
    for (let i = 0; i < num; i++) {
      const vessel = new PIXI.Sprite(this.mainVesselTexture);
      vessel.anchor.x = 0.5;
      vessel.anchor.y = 0.5;
      // ParticlesContainer does not support .visible, so we just move the sprite out of the viewport
      vessel.x = -100;
      // vessel.blendMode = PIXI.BLEND_MODES.SCREEN;
      // vessel.filters=  [new PIXI.filters.BlurFilter(10,10)]
      this.spritesPool.push(vessel);
      this.stage.addChild(vessel);
    }
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
