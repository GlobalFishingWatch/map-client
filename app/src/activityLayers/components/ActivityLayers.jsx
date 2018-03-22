import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { worldToPixels, lngLatToWorld } from 'viewport-mercator-project';

function round(x, n) {
  const tenN = Math.pow(10, n);
  return Math.round(x * tenN) / tenN;
}

class ActivityLayers extends Component {
  componentDidMount() {
    this._redraw();
  }

  componentDidUpdate() {
    this._redraw();
  }

  _redraw() {
    const { viewport } = this.context;

    const pixelRatio = window.devicePixelRatio || 1;
    const canvas = this.refs.overlay;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.scale(pixelRatio, pixelRatio);
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    // ctx.globalCompositeOperation = compositeOperation;

    const PARIS = [2.373046875, 48.80686346108517];
    // console.log(PARIS)
    // console.log(viewport.scale)
    const parisWorld = lngLatToWorld(PARIS, 1);
    // console.log(parisWorld)
    // console.log(worldToLngLat(parisWorld, 1 ))

    const scale = viewport.scale;
    const parisPx = worldToPixels([parisWorld[0] * scale, parisWorld[1] * scale], viewport.pixelProjectionMatrix);

    // const pixel = viewport.project(PARIS);
    const pixel = parisPx;
    const pixelRounded = [round(pixel[0], 1), round(pixel[1], 1)];
    if (pixelRounded[0] + 10 >= 0 &&
      pixelRounded[0] - 10 < viewport.width &&
      pixelRounded[1] + 10 >= 0 &&
      pixelRounded[1] - 10 < viewport.height
    ) {
      ctx.fillStyle = '#00a8fe';
      ctx.beginPath();
      ctx.arc(pixelRounded[0], pixelRounded[1], 10, 0, Math.PI * 2);
      ctx.fill();
    }


    ctx.restore();
  }
  /* eslint-enable max-statements */

  render() {
    const { viewport: { width, height } } = this.context;
    const pixelRatio = window.devicePixelRatio || 1;
    return (
      createElement('canvas', {
        ref: 'overlay',
        width: width * pixelRatio,
        height: height * pixelRatio,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0.8,
          left: 0,
          top: 0
        }
      })
    );
  }
}

ActivityLayers.propTypes = {

};

ActivityLayers.contextTypes = {
  viewport: PropTypes.object
};

export default ActivityLayers;
