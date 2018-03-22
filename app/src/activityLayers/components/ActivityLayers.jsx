import React from 'react';
import * as PIXI from 'pixi.js';
import PropTypes from 'prop-types';
import { worldToPixels, lngLatToWorld } from 'viewport-mercator-project';

class ActivityLayers extends React.Component {
  componentDidMount() {
    this._build();
    this._redraw();
  }

  componentDidUpdate() {
    this._redraw();
  }

  _build() {


    // TODO VP W/H
    this.pixi = new PIXI.Application({ width: 1000, height: 800, transparent: true, antialias: true });

    // this.pixi.ticker.add(this._onTickBound);

    this.renderer = this.pixi.renderer;
    this.canvas = this.pixi.view;
    this.canvas.style.position = 'absolute';

    this.container.appendChild(this.canvas);

    this.stage = this.pixi.stage;

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(4, 0xffd900, 1);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(470, 90, 60);
    graphics.endFill();
    this.graphics = graphics;

    this.stage.addChild(graphics);
  }

  _redraw() {
    const { viewport } = this.context;

    const PARIS = [2.373046875, 48.80686346108517];
    // console.log(PARIS)
    // console.log(viewport.scale)
    const parisWorld = lngLatToWorld(PARIS, 1);
    // console.log(parisWorld)
    // console.log(worldToLngLat(parisWorld, 1 ))

    const scale = viewport.scale;
    const parisPx = worldToPixels([parisWorld[0] * scale, parisWorld[1] * scale], viewport.pixelProjectionMatrix);

    this.graphics.lineStyle(4, 0xffd900, 1);
    this.graphics.beginFill(0xFFFF0B, 0.5);
    this.graphics.drawCircle(parisPx[0], parisPx[1], 10);
    this.graphics.endFill();

  }

  render() {
    const { viewport: { width, height } } = this.context;

    // return null;

    return (<div
      ref={(ref) => { this.container = ref; }}
      style={{ position: 'absolute' }}
    />);


    // const pixelRatio = window.devicePixelRatio || 1;
    //
    //
    // return (
    //   createElement('canvas', {
    //     ref: 'overlay',
    //     width: width * pixelRatio,
    //     height: height * pixelRatio,
    //     style: {
    //       width: `${width}px`,
    //       height: `${height}px`,
    //       position: 'absolute',
    //       pointerEvents: 'none',
    //       opacity: 0.8,
    //       left: 0,
    //       top: 0
    //     }
    //   })
    // );
  }
}

ActivityLayers.propTypes = {
};

ActivityLayers.contextTypes = {
  viewport: PropTypes.object
};

export default ActivityLayers;
