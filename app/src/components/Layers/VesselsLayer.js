import VesselsLayerOverlay from './VesselsLayerOverlay';
import VesselsLayerTiled from './VesselsLayerTiled';

export default class VesselsLayer {

  constructor(map) {
    this.map = map;

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(62.281819, -150.287132),
      new google.maps.LatLng(62.400471, -150.005608));

    // The photograph is courtesy of the U.S. Geological Survey.
    const srcImage = 'https://developers.google.com/maps/documentation/' +
    'javascript/examples/full/images/talkeetna.png';

    this.overlay = new VesselsLayerOverlay(bounds, srcImage, map, this.map.getDiv().getBoundingClientRect());
    this.tiled = new VesselsLayerTiled(
      0/* position */,
      this.map,
      true /* layerSettings.visible */
    );

    this.tiled.tileCreatedCallback = this._onTileCreated;
    this.tiled.tileReleasedCallback = this._onTileReleased;

    this.centerListener = google.maps.event.addListener(this.map, 'center_changed', this.overlay.repositionCanvas.bind(this.overlay));
  }


  _onTileCreated(data) {
    // console.log(data)
  }
  _onTileReleased(data) {
    // console.log(data)
  }
}
