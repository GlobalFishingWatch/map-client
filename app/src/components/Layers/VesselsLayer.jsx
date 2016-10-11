
// USGSOverlay.prototype = new google.maps.OverlayView();
// Initialize the map and the custom overlay.

export default class initMap {

  constructor(map) {
    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(62.281819, -150.287132),
      new google.maps.LatLng(62.400471, -150.005608));

      // The photograph is courtesy of the U.S. Geological Survey.
      var srcImage = 'https://developers.google.com/maps/documentation/' +
      'javascript/examples/full/images/talkeetna.png';

      // The custom USGSOverlay object contains the USGS image,
      // the bounds of the image, and a reference to the map.
      this.overlay = new USGSOverlay(bounds, srcImage, map);
  }

  boundsChanged() {
    // this.overlay.draw();
  }
}

/** @constructor */
class USGSOverlay extends google.maps.OverlayView {

  constructor(bounds, image, map) {
    super()
    // Initialize all properties.
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
  }

  /**
  * onAdd is called when the map's panes are ready and the overlay has been
  * added to the map.
  */
  onAdd() {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    div.appendChild(img);

    this.div_ = div;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
  };

  draw() {
    console.log('draw!')
    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    var mapBounds = this.map_.getBounds();
    var sw2 = overlayProjection.fromLatLngToDivPixel(mapBounds.getSouthWest())
    var ne2 = overlayProjection.fromLatLngToDivPixel(mapBounds.getNorthEast())
    // Resize the image's div to fit the indicated dimensions.
    var div = this.div_;
    div.style.left = sw2.x + 'px';
    div.style.top = ne2.y + 'px';
    div.style.width = (ne2.x - sw2.x) + 'px';
    div.style.height = (sw2.y - ne2.y) + 'px';
  };

  // The onRemove() method will be called automatically from the API if
  // we ever set the overlay's map property to 'null'.
  onRemove() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  };
}
