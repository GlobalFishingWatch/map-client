// makes an InfowWindow out of a generic OverlayView in order to allow for full
// customization of the infowindow. This should be instanciated by a React component,
// which will render html into the CustomInfoWindow's div property.
// See PolygonReport.jsx for an example of implementation.

export default class CustomInfoWindow extends google.maps.OverlayView {
  constructor() {
    super();
    this.latLng = { lat: 0, lng: 0 };
    this.div = document.createElement('div');
    this.div.style.borderStyle = 'none';
    this.div.style.borderWidth = '0px';
    this.div.style.position = 'absolute';
  }

  onAdd() {
    const panes = this.getPanes();
    panes.floatPane.appendChild(this.div);
  }

  draw() {
    const overlayProjection = this.getProjection();
    const sw = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.latLng));
    this.div.style.left = `${sw.x}px`;
    this.div.style.top = `${sw.y}px`;
  }

  setLatLng(latLng) {
    this.latLng = { lat: latLng[0], lng: latLng[1] };
    this.draw();
  }
}
