/* global PIXI */
import 'pixi.js';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HUES_INCREMENTS_NUM,
  VESSELS_HUES_INCREMENT
} from 'constants';

export default class HeatmapSubLayer {
  constructor(layerSettings, baseTexture, maxSprites, globalStageRenderCallback) {
    this.id = layerSettings.id;
    this.globalStageRenderCallback = globalStageRenderCallback;
    this._build(baseTexture, maxSprites);

    if (layerSettings.visible === false) {
      this.hide(false);
    }
    this.setOpacity(layerSettings.opacity, false);
    this.setHue(layerSettings.hue, false);
  }

  _build(baseTexture, maxSprites) {
    // this.stage = new PIXI.Container();
    // the ParticleContainer is a faster version of the PIXI sprite container
    this.stage = new PIXI.particles.ParticleContainer(maxSprites, {
      scale: true,
      alpha: true,
      position: true,
      uvs: true
    });
    this.stage.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.spritesPool = [];

    const initialTextureFrame = new PIXI.Rectangle(0, 0, VESSELS_BASE_RADIUS * 2, VESSELS_BASE_RADIUS * 2);
    this.mainVesselTexture = new PIXI.Texture(baseTexture, initialTextureFrame);
  }

  show() {
    this.stage.visible = true;
    this.globalStageRenderCallback();
  }

  hide(rerender = true) {
    this.stage.visible = false;
    if (rerender) this.globalStageRenderCallback();
  }

  setOpacity(opacity, rerender = true) {
    this.stage.alpha = opacity;
    if (rerender) this.globalStageRenderCallback();
  }

  setHue(hue, rerender = true) {
    this.setTextureFrame(null, hue);
    if (rerender) this.globalStageRenderCallback();
  }

  /**
   * Updates the main texture frame offset to show different brush styles and hues
   * Both args are optional, if one is omitted, previous value is used
   * @heatmapStyle bool whether to use heatmap style or solid circle style
   * @hue number hue value between 0 and 360
   */
  setTextureFrame(useHeatmapStyle = null, hue = null) {
    const textureFrame = this.mainVesselTexture.frame.clone();

    if (useHeatmapStyle !== null) {
      // one diameter + tiny offset between 2 frames
      textureFrame.x = (useHeatmapStyle) ? 0 : VESSELS_BASE_RADIUS * 2 + 1;
    }

    if (hue !== null) {
      // 0 - 360 -> 0 -> 10
      let hueIncrement = hue / VESSELS_HUES_INCREMENT;
      if (hueIncrement === VESSELS_HUES_INCREMENTS_NUM) {
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

  render(tiles, startIndex, endIndex) {
    if (this.stage.visible === false) return;

    this.numSprites = 0;

    tiles.forEach(tile => {
      const bounds = tile.canvas.getBoundingClientRect();
      if (!document.body.contains(tile.canvas)) {
        console.warn('rendering tile that doesnt exist in the DOM', tile);
      }

      if (bounds.left === 0 && bounds.top === 0) {
        console.warn('tile at 0,0');
      }
      this.numSprites += this._dumpTileVessels(startIndex, endIndex, tile.data, bounds.left, bounds.top);
    });

    // hide unused sprites
    for (let i = this.numSprites, poolSize = this.spritesPool.length; i < poolSize; i++) {
      this.spritesPool[i].x = -100;
    }
  }

  _dumpTileVessels(startIndex, endIndex, data, offsetX, offsetY) {
    if (!data) {
      return 0;
    }

    let numSprites = 0;

    if (!this.spritesPool.length) {
      console.warn('empty sprites pool')
      return 0;
    }

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

  resizeSpritesPool(finalPoolSize) {
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
