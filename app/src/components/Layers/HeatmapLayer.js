/* global PIXI */
import 'pixi.js';
import HeatmapSubLayer from './HeatmapSubLayer';

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

  setSubLayers(flags, useHeatmapStyle) {
    const subLayerDelta = flags.length - this.subLayers.length;
    if (subLayerDelta === -1) {
      const subLayer = this.subLayers.pop();
      this.destroySubLayer(subLayer);
    } else if (subLayerDelta > 0) {
      for (let i = 0; i < subLayerDelta; i++) {
        const subLayer = new HeatmapSubLayer(this.baseTexture, this.maxSprites, useHeatmapStyle);
        this.subLayers.push(subLayer);
        this.stage.addChild(subLayer.stage);
      }
    }
    this.subLayers.forEach((subLayer, index) => {
      const flagData = flags[index];
      subLayer.setFilters(flagData.flag, flagData.hue);
    });
  }

  render(tiles, startIndex, endIndex, offsets) {
    // if (this.stage.visible === false) return;

    this.subLayers.forEach((subLayer) => {
      subLayer.render(tiles, startIndex, endIndex, offsets);
    });
  }

  destroy() {
    this.subLayers.forEach(this.destroySubLayer);
    this.stage.destroy({ children: true });
  }

  destroySubLayer(subLayer) {
    this.stage.removeChild(subLayer.stage);
    subLayer.destroy();
  }
}
