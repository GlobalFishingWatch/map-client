export default class CustomLayerWrapper {
  constructor(map, url) {
    this.map = map;
    this.kmlLayer = new google.maps.KmlLayer({
      url,
      map
    });
  }

  show() {
    this.kmlLayer.setMap(this.map);
  }

  hide() {
    this.kmlLayer.setMap(null);
  }
}
