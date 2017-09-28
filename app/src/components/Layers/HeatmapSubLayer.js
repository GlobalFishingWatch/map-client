/* global PIXI */
import 'pixi.js';
import {
  VESSELS_BASE_RADIUS,
  VESSELS_HUES_INCREMENTS_NUM
} from 'config';
import { hueToHueIncrement } from 'util/colors';

export default class HeatmapSubLayer {
  constructor(baseTexture, maxSprites, useHeatmapStyle) {
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
    this.setRenderingStyle(useHeatmapStyle);

    this._resizeSpritesPool(10000);
  }


  setFilters(filterData) {
    const { category, hue } = filterData;
    // Don't filter categories if 'ALL' is selected (No filters case)
    this.categories = (category === 'ALL') ? undefined : [category];
    this.filterFields = Object.keys(filterData).filter(filter =>
      filter !== 'hue' && filter !== 'category' && filter !== 'category'
    );
    this.filters = filterData;
    this._setTextureFrame(null, hue);
  }

  setSeriesFilter(foundVessels) {
    this.foundVessels = foundVessels;
  }

  setRenderingStyle(useHeatmapStyle) {
    this._setTextureFrame(useHeatmapStyle);
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
  _setTextureFrame(useHeatmapStyle = null, hue = null) {
    const textureFrame = this.mainVesselTexture.frame.clone();

    if (useHeatmapStyle !== null) {
      // one diameter + tiny offset between 2 frames
      textureFrame.x = (useHeatmapStyle) ? 0 : (VESSELS_BASE_RADIUS * 2) + 1;
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

  render(tiles, startIndex, endIndex, offsets) {
    if (tiles.length === 0) return;

    if (offsets === undefined) {
      console.warn('map offsets not set yet while trying to render gl sublayer');
      return;
    }

    const numSpritesNeeded = this._getNumSpritesNeeded(tiles, startIndex, endIndex);
    const numSpritesNeededWithMargin = numSpritesNeeded * 2;

    if (numSpritesNeeded * 1.3 > this.spritesPool.length) {
      this._resizeSpritesPool(numSpritesNeededWithMargin);
    }

    this.numSprites = 0;


    tiles.forEach((tile) => {
      if (!document.body.contains(tile.canvas)) {
        console.warn('rendering tile that doesnt exist in the DOM', tile);
      }
      this._dumpTileVessels(startIndex, endIndex, tile.data, offsets);
    });

    // hide unused sprites
    for (let i = this.numSprites, poolSize = this.spritesPool.length; i < poolSize; i++) {
      this.spritesPool[i].x = -100;
    }
  }


  shouldSkipRenderByCategories(frame, index) {
    // Skip the render by category (country-flag) if the category is not in the tile data
    return this.categories !== undefined &&
           frame.category !== undefined &&
           this.categories.indexOf(frame.category[index]) === -1;
  }

  shouldSkipRenderByFoundVessels(frame, index) {
    return (this.foundVessels &&
      (this.foundVessels.filter(v => v.series === frame.series[index] && v.seriesgroup === frame.seriesgroup[index]).length === 0));
  }

  shouldSkipRenderByFieldFilters(frame, index) {
    // If any of the filters should apply return true
    return this.filterFields.some((filterField) => {
      const filterValue = this.filters[filterField];
      const tileField = frame[filterField];

      // Filter all the fields in the filters
      if (filterValue !== undefined &&
        tileField !== undefined &&
        filterValue !== null &&
        filterValue.indexOf(tileField[index]) === -1) {
        return true;
      }

      // Skip the rendering if the filter for that layer doesn't have information (e.g AIS)
      if (tileField === undefined && filterValue !== null) return true;

      return false; // render
    });
  }

  _dumpTileVessels(startIndex, endIndex, data, offsets) {
    if (!data) {
      return;
    }

    if (!this.spritesPool.length) {
      console.warn('empty sprites pool');
      return;
    }

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      for (let index = 0, len = frame.worldX.length; index < len; index++) {
        if (this.shouldSkipRenderByCategories(frame, index) ||
            this.shouldSkipRenderByFieldFilters(frame, index) ||
            this.shouldSkipRenderByFoundVessels(frame, index)
        ) {
          continue;
        }

        this.numSprites++;
        const sprite = this.spritesPool[this.numSprites];

        // sprite.position.x = offsetX + frame.x[index];
        // sprite.position.y = offsetY + frame.y[index];
        const worldX = frame.worldX[index];
        let originX = offsets.left;
        if (originX > worldX) {
          originX -= 256;
        }
        sprite.position.x = (worldX - originX) * offsets.scale;
        sprite.position.y = ((frame.worldY[index] - offsets.top) * offsets.scale);
        sprite.alpha = frame.opacity[index];
        sprite.scale.set(frame.radius[index]);
      }
    }
  }

  _getNumSpritesNeeded(tiles, startIndex, endIndex) {
    let numSprites = 0;
    // get pool size
    tiles.forEach((tile) => {
      for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex++) {
        if (!tile.data) continue;
        const frame = tile.data[timeIndex];
        if (!frame) continue;
        for (let index = 0, len = frame.worldX.length; index < len; index++) {
          if (this.shouldSkipRenderByCategories(frame, index) ||
            this.shouldSkipRenderByFieldFilters(frame, index)) {
            continue;
          }
          numSprites++;
        }
      }
    });
    return numSprites;
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
