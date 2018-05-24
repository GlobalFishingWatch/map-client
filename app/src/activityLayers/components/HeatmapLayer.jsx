import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import * as PIXI from 'pixi.js';
import { worldToPixels, pixelsToWorld } from 'viewport-mercator-project';
import { BRUSH_RENDERING_STYLE, BRUSH_ZOOM_RENDERING_STYLE } from 'constants';
import { vesselSatisfiesFilters } from 'utils/heatmapTileData';
import HeatmapSubLayer from './HeatmapSubLayer';

class HeatmapLayer extends React.Component {
  componentDidMount() {
    this._build();
  }

  componentWillUnmount() {
    this._destroy();
  }

  componentDidUpdate() {
    this._redraw();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.useRadialGradientStyle !== this.props.useRadialGradientStyle) {
      this.setBrushZoomRenderingStyle(nextProps.useRadialGradientStyle);
    }
  }

  _build() {
    const { layer, rootStage, useRadialGradientStyle, customRenderingStyle } = this.props;
    this.subLayers = {};
    this.renderingStyle = (layer.header && layer.header.rendering) ? layer.header.rendering : customRenderingStyle;

    this.setBrushRenderingStyle(this.renderingStyle.style);
    this.setBrushZoomRenderingStyle(useRadialGradientStyle);

    this.stage = new PIXI.Container();

    rootStage.addChild(this.stage);
  }

  setBrushRenderingStyle(style = BRUSH_RENDERING_STYLE.NORMAL) {
    if (typeof style === 'string') {
      this.brushRenderingStyle = BRUSH_RENDERING_STYLE[style.toUpperCase()];
    } else {
      this.brushRenderingStyle = style;
    }
    this._setBrushRenderingStyleIndex();
  }

  setBrushZoomRenderingStyle(useRadialGradientStyle) {
    this.brushZoomRenderingStyle = (useRadialGradientStyle === true)
      ? BRUSH_ZOOM_RENDERING_STYLE.RADIAL_GRADIENT
      : BRUSH_ZOOM_RENDERING_STYLE.CIRCLE;
    this._setBrushRenderingStyleIndex();
  }

  _setBrushRenderingStyleIndex() {
    // only NORMAL brush styles support different zoom styles
    const cappedZoomRenderingStyle = (this.brushRenderingStyle === BRUSH_RENDERING_STYLE.NORMAL) ? this.brushZoomRenderingStyle : 0;
    const newStyleIndex = this.brushRenderingStyle + cappedZoomRenderingStyle;
    if (newStyleIndex === this.renderingStyleIndex) {
      return;
    }
    this.renderingStyleIndex = newStyleIndex;
    Object.values(this.subLayers).forEach((subLayer) => {
      subLayer.setRenderingStyleIndex(this.renderingStyleIndex);
    });
  }

  _redraw() {
    const { data, filters, baseTexture, maxSprites, layer, viewport } = this.props;

    if (data === null || data === undefined || layer.visible === false) {
      this.stage.visible = false;
      return;
    }

    this.stage.visible = true;
    this.stage.alpha = layer.opacity;

    const tiles = data.tiles;
    const defaultHue = layer.hue;

    const allHuesToRender = (filters !== undefined && filters.length)
      ? filters
      // pass is set to true by filterGroupActions when none of the filters fields
      // in the filter group is supported by the layer headers
        .filter(f => f.pass !== true)
        .map(f => f.hue.toString())
      : [defaultHue.toString()];
    const currentlyUsedHues = Object.keys(this.subLayers);

    // get all hues, old and new
    const allHues = uniq(allHuesToRender.concat(currentlyUsedHues));

    // compute left and right offsets to deal with antimeridian issue
    const topLeftWorld = pixelsToWorld([0, 0], viewport.pixelUnprojectionMatrix);
    const topRightWorld = pixelsToWorld([viewport.width, 0], viewport.pixelUnprojectionMatrix);
    const leftOffset = topLeftWorld[0] / viewport.scale;
    const rightOffset = topRightWorld[0] / viewport.scale;

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
        this.subLayers[hue] = this._createSublayer(baseTexture, maxSprites, this.renderingStyleIndex, hue);
      }
      this.subLayers[hue].spritesProps = [];
    }

    if (!allHuesToRender.length) return;

    tiles.forEach((tile) => {
      this._setSubLayersSpritePropsForTile({
        data: tile.data,
        numFilters: filters.length,
        defaultHue,
        leftOffset,
        rightOffset
      });
    });

    allHuesToRender.forEach((hueToRender) => {
      this.subLayers[hueToRender].render();
    });
  }

  _setSubLayersSpritePropsForTile({ data, numFilters, defaultHue, leftOffset, rightOffset }) {
    if (!data) {
      return;
    }

    const { startIndex, endIndex, viewport, filters } = this.props;

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

        // wrap worldX when point crosses the antimeridian
        // world points go from 0 to 512. There is no way to determine if worldX is on the "wrong" side 
        // of the antimeridian just by looking at its value (where with lat/lon we can simply look at -/+)
        // Therefore we compare it to the viewport's left or right boundary, depending on what is currently
        // "the right side" of the antimeridian
        let worldX = frame.worldX[index];
        if (leftOffset > 0 && worldX < leftOffset) {
          // worldX is "behind" leftOffset, which means it is "on the right" of the antimeridian
          worldX += 512;
        } else if (leftOffset < 0 && worldX > rightOffset) {
          worldX -= 512;
        }

        const px = worldToPixels(
          [worldX * viewport.scale, frame.worldY[index] * viewport.scale],
          viewport.pixelProjectionMatrix
        );

        const spriteProps = {
          x: px[0],
          y: px[1],
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

  _destroy() {
    Object.values(this.subLayers).forEach(this._destroySubLayer);
    this.stage.destroy({ children: true });
    const { rootStage } = this.props;
    rootStage.removeChild(this.stage);
  }

  _destroySubLayer(subLayer) {
    this.stage.removeChild(subLayer.stage);
    subLayer.destroy();
  }

  render() {
    return null;
  }
}

HeatmapLayer.propTypes = {
  layer: PropTypes.object,
  data: PropTypes.object,
  rootStage: PropTypes.object,
  viewport: PropTypes.object,
  startIndex: PropTypes.number,
  endIndex: PropTypes.number,
  filters: PropTypes.array,
  baseTexture: PropTypes.object,
  maxSprites: PropTypes.number,
  useRadialGradientStyle: PropTypes.bool,
  customRenderingStyle: PropTypes.object
};

export default HeatmapLayer;
