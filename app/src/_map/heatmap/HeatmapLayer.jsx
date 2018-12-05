import React from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import * as PIXI from 'pixi.js';
import { worldToPixels } from 'viewport-mercator-project';
import { BRUSH_RENDERING_STYLE, BRUSH_ZOOM_RENDERING_STYLE } from '../constants';
import { vesselSatisfiesFilters } from '../utils/heatmapTileData';
import HeatmapSubLayer from './HeatmapSubLayer';

// This is a faster version of worldToPixels that omits pitch,
// and ignores values from the matrix that are consistently = 0
const s = 1 / 1.5;
const worldToPixelsSimple = (x, y, m) => {
  const fx = s * ((m[0] * x) + (m[4] * y) + m[12]);
  const fy = s * ((m[5] * y) + m[13]);
  return [fx, fy];
};

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
    const { filters, baseTexture, layer } = this.props;

    if (layer === null || layer === undefined || layer.tiles === undefined || layer.visible === false) {
      this.stage.visible = false;
      return;
    }

    this.stage.visible = true;
    this.stage.alpha = layer.opacity;

    const tiles = layer.tiles;
    const defaultHue = layer.hue;

    const allHuesToRender = (filters !== undefined && filters.length)
      ? filters
      // pass is set to true by filterGroupActions when none of the filters fields
      // in the filter group is supported by the layer headers
        .filter(f => f.pass !== true)
        .map(f => ((f.hue === undefined) ? '0' : f.hue.toString()))
      : [defaultHue.toString()];
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
        this.subLayers[hue] = this._createSublayer(baseTexture, this.renderingStyleIndex, hue);
      }
      this.subLayers[hue].clearSpriteProps();
    }

    if (!allHuesToRender.length) return;
    tiles.forEach((tile) => {
      this._setSubLayersSpritePropsForTile({
        data: tile.data,
        numFilters: filters.length,
        defaultHue
      });
    });

    allHuesToRender.forEach((hueToRender) => {
      this.subLayers[hueToRender].render();
    });
  }

  _setSubLayersSpritePropsForTile({ data, numFilters, defaultHue }) {
    if (!data) {
      return;
    }

    const { startIndex, endIndex, viewport, filters, viewportLeft, viewportRight } = this.props;

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

        // wrap worldX when point crosses the antimeridian/dateline
        // world points go from 0 to 512. There is no way to determine if worldX is on the "wrong" side
        // of the antimeridian just by looking at its value (where with lat/lon we can simply look at -/+)
        // Therefore we compare it to the viewport's left or right boundary, depending on what is currently
        // "the right side" of the antimeridian
        let worldX = frame.worldX[index];
        if (viewportLeft > 0 && worldX < viewportLeft) {
          // worldX is "behind" viewportLeft, which means it is "on the right" of the antimeridian
          worldX += 512;
        } else if (viewportLeft < 0 && worldX > viewportRight) {
          worldX -= 512;
        }

        const scaledX = worldX * viewport.scale;
        const scaledY = frame.worldY[index] * viewport.scale;
        const mtx = viewport.pixelProjectionMatrix;

        const [x, y] = (viewport.pitch === 0) ? worldToPixelsSimple(scaledX, scaledY, mtx) : worldToPixels([scaledX, scaledY], mtx);

        if (
          x > -10 && x < viewport.width + 10 &&
          y > -10 && y < viewport.height + 10
        ) {
          this.subLayers[hue].pushSpriteProps(
            x,
            y,
            (frame.opacity) ? frame.opacity[index] : this.renderingStyle.defaultOpacity,
            (frame.radius) ? frame.radius[index] : this.renderingStyle.defaultSize
          );
        }
      }
    }
  }

  _createSublayer(baseTexture, renderingStyleIndex, hue) {
    const subLayer = new HeatmapSubLayer(baseTexture, renderingStyleIndex, hue,
      this.brushRenderingStyle === BRUSH_RENDERING_STYLE.BULLSEYE);
    this.stage.addChild(subLayer.stage);
    return subLayer;
  }

  _destroy() {
    Object.values(this.subLayers).forEach(this._destroySubLayer.bind(this));
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
  rootStage: PropTypes.object,
  viewport: PropTypes.object,
  startIndex: PropTypes.number,
  endIndex: PropTypes.number,
  filters: PropTypes.array,
  baseTexture: PropTypes.object,
  useRadialGradientStyle: PropTypes.bool,
  customRenderingStyle: PropTypes.object,
  viewportLeft: PropTypes.number,
  viewportRight: PropTypes.number
};

export default HeatmapLayer;
