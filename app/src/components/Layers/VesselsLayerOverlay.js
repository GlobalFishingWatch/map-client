import PIXI from 'pixi.js';

export default class VesselsOverlay extends google.maps.OverlayView {

  constructor(map) {
    super();

    this.map = map;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
  }

  _build() {
    this.container = document.createElement('div');

    const rect = this._getCanvasRect();
    this.renderer = new PIXI.WebGLRenderer(rect.width, rect.height, { transparent: true });

    this.canvas = this.renderer.view;
    this.canvas.style.position = 'absolute';
    this.canvas.style.border = '4px solid green';

    this.stage = new PIXI.Container();
    // this.stage.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.container.appendChild(this.canvas);

    this.container.style.position = 'absolute';

    this.debugTexts = [];
  }

  onAdd() {
    this._build();
    // Add the element to the "overlayLayer" pane.
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.container);
  }

  onRemove() {
    this.container.parentNode.removeChild(this.div_);
    this.container = null;
  }

  draw() {
    // console.log('draw!')
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

  render(canvases) {
    if (!this.stage) return;
    this.debugTexts.forEach(text => {
      this.stage.removeChild(text);
    });
    this.debugTexts = [];
    canvases.forEach(canvas => {
      const bounds = canvas.getBoundingClientRect();
      const text = new PIXI.Text('This is a pixi text', { fontFamily: 'Arial', fontSize: 10, fill: 0xff1010 });
      text.position.x = bounds.left;
      text.position.y = bounds.top;
      this.stage.addChild(text);
      this.debugTexts.push(text);
    });

    this.renderer.render(this.stage);
  }
}
