import { MAX_AUTO_ZOOM_LONGITUDE_SPAN } from 'config';

export default class CustomLayerWrapper {
  constructor(map, url, justUploaded) {
    this.map = map;
    this.kmlLayer = new google.maps.KmlLayer({
      url,
      map,
      // preserveViewport: true = do not use KML boundaries
      // always set to true because when we want to do that we'll use some custom logic for it (handleZoomLevel)
      preserveViewport: true
    });
    this.handleZoomLevel = this.handleZoomLevel.bind(this);

    if (justUploaded === true) {
      this.zoomListener = google.maps.event.addListenerOnce(this.kmlLayer, 'defaultviewport_changed', this.handleZoomLevel);
    }
  }

  show() {
    this.kmlLayer.setMap(this.map);
  }

  hide() {
    this.kmlLayer.setMap(null);
  }

  handleZoomLevel() {
    const bounds = this.kmlLayer.getDefaultViewport();
    const span = bounds.toSpan().toJSON();

    if (span.lng >= MAX_AUTO_ZOOM_LONGITUDE_SPAN) this.map.setCenter(bounds.getCenter());
    else this.map.fitBounds(bounds.toJSON());
  }

  destroy() {
    google.maps.event.removeListener(this.zoomListener);
    this.hide();
  }
}
