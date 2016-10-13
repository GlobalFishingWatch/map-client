import PIXI from 'pixi.js';

export default class VesselsOverlay extends google.maps.OverlayView {

  constructor(bounds, image, map, initialDimensions) {
    super();

    this.bounds_ = bounds;
    this.image_ = image;
    this.map = map;
    this.dimensions = initialDimensions;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
  }

  onAdd() {
    this.container = document.createElement('div');

    this.renderer = new PIXI.WebGLRenderer(this.dimensions.width, this.dimensions.height, { transparent: false });

    this.canvas = this.renderer.view;
    this.canvas.style.position = 'absolute';

    this.stage = new PIXI.ParticleContainer(20000);
    this.stage.blendMode = PIXI.BLEND_MODES.SCREEN;

    this.container.appendChild(this.canvas);

    this.container.style.borderStyle = 'none';
    this.container.style.borderWidth = '0px';
    this.container.style.position = 'absolute';

    // Create the img element and attach it to the div.
    const img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    // this.container.appendChild(img);


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

    // console.log('rep changed')
    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    var mapBounds = this.map.getBounds();
    var sw2 = overlayProjection.fromLatLngToDivPixel(mapBounds.getSouthWest())
    var ne2 = overlayProjection.fromLatLngToDivPixel(mapBounds.getNorthEast())
    // Resize the image's div to fit the indicated dimensions.
    var div = this.container;
    div.style.opacity = 0.5;
    div.style.left = sw2.x + 'px';
    div.style.top = ne2.y + 'px';
    div.style.width = (ne2.x - sw2.x) + 'px';
    div.style.height = (sw2.y - ne2.y) + 'px';
  }


}
