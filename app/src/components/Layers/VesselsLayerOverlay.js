import PIXI from 'pixi.js';

export default class VesselsOverlay extends google.maps.OverlayView {

  constructor(map) {
    super();

    this.map = map;
    this.setMap(map);
  }

  onAdd() {
    this._build();
    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.container);
  }

  _build() {
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';

    const rect = this._getCanvasRect();
    this.renderer = new PIXI.WebGLRenderer(rect.width, rect.height, { transparent: true });

    this.canvas = this.renderer.view;
    this.canvas.style.position = 'absolute';
    this.canvas.style.border = '1px solid green';

    this.stage = new PIXI.ParticleContainer(50000);
    // this.stage.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.container.appendChild(this.canvas);

    this.mainVesselTexture = PIXI.Texture.fromCanvas(this._getVesselTemplate(5, 0.3));

    this.spritesPool = [];
    this._addSprites(10000);

    this.debugTexts = [];
  }

  _getVesselTemplate(radius, blurFactor) {
    const tplCanvas = document.createElement('canvas');
    const tplCtx = tplCanvas.getContext('2d');
    const x = radius;
    const y = radius;
    tplCanvas.width = tplCanvas.height = radius * 2;

    if (blurFactor === 1) {
      tplCtx.beginPath();
      tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
      tplCtx.fillStyle = 'rgba(255, 255, 237, 0.5)';
      tplCtx.fill();
    } else {
 //      'rgb(48, 149, 255)',
 // +      'rgb(136, 251, 255)',
 // +      'rgb(255, 248, 150)',
 // +      'rgb(255, 220, 45)'
      const gradient = tplCtx.createRadialGradient(x, y, radius * blurFactor, x, y, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.1, 'rgba(136, 251, 255,1)');
      gradient.addColorStop(0.2, 'rgba(255, 248, 150,1)');
      gradient.addColorStop(1, 'rgba(48, 149, 255, 0)');
      tplCtx.fillStyle = gradient;
      tplCtx.fillRect(0, 0, 2 * radius, 2 * radius);
    }
    return tplCanvas;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.div_);
    this.container = null;
  }

  repositionCanvas() {
    if (!this.container) return;

    const rect = this._getCanvasRect();

    this.container.style.left = `${rect.x}px`;
    this.container.style.top = `${rect.y}px`;
    this.renderer.resize(rect.width, rect.height);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  _getCanvasRect() {
    const overlayProjection = this.getProjection();

    const mapBounds = this.map.getBounds();
    const sw = overlayProjection.fromLatLngToDivPixel(mapBounds.getSouthWest());
    const ne = overlayProjection.fromLatLngToDivPixel(mapBounds.getNorthEast());

    return {
      x: sw.x,
      y: ne.y,
      width: ne.x - sw.x,
      height: sw.y - ne.y
    };
  }

  draw() {}



  render(tiles, startIndex, endIndex) {
    // console.log(startIndex, endIndex)
    if (!this.stage) return;
    this.debugTexts.forEach(text => {
      this.stage.removeChild(text);
    });
    this.debugTexts = [];

    this.numSprites = 0;

    tiles.forEach(tile => {
      const bounds = tile.getBoundingClientRect();
      const text = new PIXI.Text('This is a pixi text', { fontFamily: 'Arial', fontSize: 10, fill: 0xff1010 });
      text.position.x = bounds.left;
      text.position.y = bounds.top;
      this.stage.addChild(text);
      this.debugTexts.push(text);

      this._dumpTileVessels(startIndex, endIndex, tile.data, bounds.left, bounds.top);
    });

    //console.log(this.numSprites)

    this.renderer.render(this.stage);
  }

  _dumpTileVessels(startIndex, endIndex, data, offsetX, offsetY) {
    if (!data) {
      return;
    }

    for (let timeIndex = startIndex; timeIndex < endIndex; timeIndex ++) {
      const frame = data[timeIndex];

      if (!frame) continue;

      for (let index = 0, len = frame.x.length; index < len; index++) {
          let sprite = this.spritesPool[this.numSprites];
          // const weight = playbackData.weight[i];
          const value = frame.value[index];
          // const value = Math.min(5, Math.max(1, Math.round(weight / 30)));
          // allValues += value;

          if (sprite === undefined) {
            // TODO : should we have a cleanup mechanism as well?
            this._addSprites(1000);
            sprite = this.spritesPool[this.numSprites];
          }

          sprite.visible = true;
          sprite.position.x = offsetX + frame.x[index];
          sprite.position.y = offsetY + frame.y[index];
          sprite.scale.x = sprite.scale.y = value;

          this.numSprites++;
      }
    }

    // hide unused sprites
    for (let i = this.numSprites, poolSize = this.spritesPool.length; i < poolSize; i++) {
      this.spritesPool[i].visible = false;
    }
  }

  _addSprites(num) {
    for (let i = 0; i < num; i++) {
      const vessel = new PIXI.Sprite(this.mainVesselTexture);
      vessel.anchor.x = vessel.anchor.y = 0.5;
      vessel.visible = false;
      // vessel.blendMode = PIXI.BLEND_MODES.SCREEN;
      // vessel.filters=  [new PIXI.filters.BlurFilter(10,10)]
      this.spritesPool.push(vessel);
      this.stage.addChild(vessel);
    }
  }
}
