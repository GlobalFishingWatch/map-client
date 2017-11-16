/* global PIXI */
import 'pixi.js';
import uniq from 'lodash/uniq';
import { vesselSatisfiesFilters } from 'util/heatmapTileData';
import { COLOR_HUES } from 'config';
import { RENDERING_STYLE } from 'constants';
import HeatmapSubLayer from './HeatmapSubLayer';

export default class HeatmapLayer {
  constructor(layerSettings, baseTexture, maxSprites, useHeatmapStyle) {
    this.id = layerSettings.id;
    this.subLayers = {};
    this.baseTexture = baseTexture;
    this.maxSprites = maxSprites;
    this.renderingStyle = (layerSettings.header && layerSettings.header.rendering) ? layerSettings.header.rendering : {};
    this.setRenderingStyle(useHeatmapStyle);

    this.stage = new PIXI.Container();

    if (layerSettings.visible === false) {
      this.hide(false);
    }
    const defaultHue = layerSettings.hue !== undefined ? layerSettings.hue : COLOR_HUES[Object.keys(COLOR_HUES)[0]];
    this.setDefaultHue(defaultHue);
    this.setOpacity(layerSettings.opacity);
  }

  show() {
    this.stage.visible = true;
  }

  hide() {
    this.stage.visible = false;
  }

  setOpacity(opacity) {
    this.stage.alpha = opacity;
  }

  setDefaultHue(hue) {
    this.defaultHue = hue;
  }

  setRenderingStyle(useHeatmapStyle) {
    this.renderingStyleIndex = (useHeatmapStyle) ? RENDERING_STYLE.HEATMAP : RENDERING_STYLE.CIRCLE;
    if (this.renderingStyle.style === 'bullseye') {
      this.renderingStyleIndex = RENDERING_STYLE.BULLSEYE;
    }
    Object.values(this.subLayers).forEach((subLayer) => {
      subLayer.setRenderingStyle(this.renderingStyleIndex);
    });
  }

  setFilters(layerFilters) {
    this.filters = layerFilters;
    this.numFilters = this.filters.length;
  }

  render(tiles, startIndex, endIndex, offsets) {

    const allHuesToRender = (this.filters !== undefined && this.filters.length)
      ? this.filters
        // pass is set to true by filterGroupActions when none of the filters fields in the filter group is supported by the layer headers
        .filter(f => f.pass !== true)
        .map(f => f.hue.toString())
      : [this.defaultHue.toString()];
    const currentlyUsedHues = Object.keys(this.subLayers);

    // get all hues, old and new
    const allHues = uniq(allHuesToRender.concat(currentlyUsedHues));

    for (let i = 0; i < allHues.length; i++) {
      const hue = allHues[i];
      if (allHuesToRender.indexOf(hue) === -1) {
        // not on new hues: delete sublayer
        this._destroySubLayer(this.subLayers[hue]);
        delete this.subLayers[hue];
        continue;
      }
      if (currentlyUsedHues.indexOf(hue) === -1) {
        // not on old hues: create sublayer
        this.subLayers[hue] = this._createSublayer(this.baseTexture, this.maxSprites, this.renderingStyleIndex, hue);
      }
      this.subLayers[hue].spritesProps = [];
    }

    if (!allHuesToRender.length) return;

    tiles.forEach((tile) => {
      this._setSubLayersSpritePropsForTile({
        data: tile.data,
        startIndex,
        endIndex,
        offsets,
        filters: this.filters,
        numFilters: this.numFilters,
        defaultHue: this.defaultHue
      });
    });

    allHuesToRender.forEach((hue) => {
      this.subLayers[hue].render();
    });
  }

  _setSubLayersSpritePropsForTile({ data, startIndex, endIndex, offsets, filters, numFilters, defaultHue }) {
    if (!data || offsets === undefined) {
      return;
    }

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      for (let index = 0, len = frame.worldX.length; index < len; index++) {
        let hue;
        if (filters === undefined || !filters.length) {
          hue = defaultHue;
        }
        for (let fi = 0; fi < numFilters; fi++) {
          const filter = filters[fi];
          if (vesselSatisfiesFilters(frame, index, filter.filterValues)) {
            hue = filter.hue;
            break;
          }
        }

        // no filter passes: bail
        if (hue === undefined) {
          continue;
        }

        const worldX = frame.worldX[index];
        let originX = offsets.left;
        if (originX > worldX) {
          originX -= 256;
        }

        const spriteProps = {
          x: (worldX - originX) * offsets.scale,
          y: ((frame.worldY[index] - offsets.top) * offsets.scale),
          alpha: (frame.opacity) ? frame.opacity[index] : this.renderingStyle.defaultOpacity,
          scale: (frame.radius) ? frame.radius[index] : this.renderingStyle.defaultSize
        };
        if (Object.prototype.hasOwnProperty.call(this.subLayers, hue)) {
          this.subLayers[hue].spritesProps.push(spriteProps);
        }
      }
    }
  }

  _createSublayer(baseTexture, maxSprites, renderingStyleIndex, hue) {
    const subLayer = new HeatmapSubLayer(baseTexture, maxSprites, renderingStyleIndex, hue);
    this.stage.addChild(subLayer.stage);
    return subLayer;
  }

  destroy() {
    Object.values(this.subLayers).forEach(this._destroySubLayer);
    this.stage.destroy({ children: true });
  }

  _destroySubLayer(subLayer) {
    this.stage.removeChild(subLayer.stage);
    subLayer.destroy();
  }
}
