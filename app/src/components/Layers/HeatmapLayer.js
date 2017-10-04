/* global PIXI */
import 'pixi.js';
import HeatmapSubLayer from './HeatmapSubLayer';
import uniq from 'lodash/uniq';

export default class HeatmapLayer {
  constructor(layerSettings, baseTexture, maxSprites) {
    this.id = layerSettings.id;
    this.subLayers = [];
    this.baseTexture = baseTexture;
    this.maxSprites = maxSprites;

    this.stage = new PIXI.Container();

    if (layerSettings.visible === false) {
      this.hide(false);
    }
    this.setOpacity(layerSettings.opacity, false);
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

  setRenderingStyle(useHeatmapStyle) {
    this.subLayers.forEach((subLayer) => {
      subLayer.setRenderingStyle(useHeatmapStyle);
    });
  }

  /**
   * Add or remove sublayers and set filters to each one
   * @param {array} filters
   * @param {bool} useHeatmapStyle
   */
  setSubLayers(layerFilters, useHeatmapStyle) {
    const subLayerDelta = layerFilters.length - this.subLayers.length;
    if (subLayerDelta === -1) {
      const subLayer = this.subLayers.pop();
      this._destroySubLayer(subLayer);
    } else if (subLayerDelta > 0) {
      for (let i = 0; i < subLayerDelta; i++) {
        const subLayer = new HeatmapSubLayer(this.baseTexture, this.maxSprites, useHeatmapStyle);
        this.subLayers.push(subLayer);
        this.stage.addChild(subLayer.stage);
      }
    }
    this.subLayers.forEach((subLayer, index) => {
      const filterData = layerFilters[index];
      subLayer.setFilters(filterData);
    });
  }

  setFilters(layerFilters) {
    this.filters = layerFilters;
    this.numFilters = this.filters.length;

    // TODO move to
    this.defaultHue = layerFilters.defaultHue;
  }

  render(tiles, startIndex, endIndex, offsets) {
    const allNeededHues = (this.filters.length) ? this.filters.map(f => f.hue) : [this.defaultHue];
    const currentlyUsedHues = Object.keys(this.subLayers);

    // get all hues, old and new
    const allHues = uniq(allNeededHues.concat(currentlyUsedHues));
    for (let i = 0; i < allNeededHues.length; i++) {
      const hue = allHues[i];
      if (allNeededHues.indexOf(hue) === -1) {
        // not on new hues: delete sublayer
        this._destroySubLayer(this.subLayers[hue]);
        continue;
      }
      if (currentlyUsedHues.indexOf(hue) === -1) {
        // not on old hues: create sublayer
        this.subLayers[hue] = this._createSublayer(hue, this.baseTexture, this.maxSprites);
      }
      this.subLayers[hue].spriteProps = [];
    }

    tiles.forEach((tile) => {
      this._setSubLayersSpritePropsForTile(tile.data, startIndex, endIndex, offsets);

    });

    allNeededHues.forEach((hue) => {
      this.subLayers[hue].render();
    });
    // this.subLayers.forEach((subLayer) => {
    //   subLayer.render(tiles, startIndex, endIndex, offsets);
    // });
  }

  _setSubLayersSpritePropsForTile(data, startIndex, endIndex, offsets) {
    if (!data) {
      return;
    }

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      for (let index = 0, len = frame.worldX.length; index < len; index++) {
        let hue;
        if (!this.filters.length) {
          hue = this.defaultHue;
        }
        for (let fi = 0; fi < this.numFilters; fi++) {
          const filter = this.filters[fi];
          if (this._vesselSatisfiesFilter(frame, index, filter.filterValues)) {
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
          alpha: frame.opacity[index],
          radius: frame.radius[index]
        };

        const subLayer = this.subLayers[hue];
        subLayer.spritesProps.push(spriteProps);
      }
    }
  }

  _vesselSatisfiesFilter(frame, index, filterValues) {

  }


  destroy() {
    this.subLayers.forEach(this._destroySubLayer);
    this.stage.destroy({ children: true });
  }

  _destroySubLayer(subLayer) {
    this.stage.removeChild(subLayer.stage);
    subLayer.destroy();
  }
}
