import PropTypes from 'prop-types';
import { Component } from 'preact';

const POLYGON_OPTIONS = {
  fillColor: '#174084',
  strokeColor: '#2b4f93',
  strokeOpacity: 1,
  fillOpacity: 0.5,
  strokeWeight: 3,
  clickable: false,
  editable: true,
  zIndex: 1
};

class DrawingManager extends Component {
  constructor() {
    super();
    this.state = {
      drawingManager: null,
      polygon: null,
      coordinates: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.map !== nextProps.map) {
      this.initDrawingManager(nextProps.map);
    }
  }

  getPolygonCoordinates(polygon) {
    const coordinates = [];
    polygon.getPath().forEach((latLng) => {
      coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
    });
    return coordinates;
  }

  deletePolygonFromMap(polygon) {
    google.maps.event.clearInstanceListeners(polygon);
    polygon.setMap(null);
  }

  onPolygonComplete(polygon) {
    const coordinates = this.getPolygonCoordinates(polygon);
    this.deletePolygonFromMap(polygon);
    this.toggleDrawingManager();
    this.addEditablePolygonToMap(coordinates);
    this.setState({ coordinates });
  }

  onSaveArea() {
    this.deletePolygonFromMap(this.state.polygon);
    this.props.createArea(this.state.coordinates);
  }

  componentWillUnmount() {
    this.state.drawingManager.setOptions({ drawingMode: null });
    this.state.drawingManager.setMap(null);
    this.deletePolygonFromMap(this.state.polygon);
  }

  initDrawingManager(map) {
    const drawingOptions = {
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      polygonOptions: POLYGON_OPTIONS
    };
    const drawingManager = new google.maps.drawing.DrawingManager(drawingOptions);
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
      this.onPolygonComplete(polygon);
    });
    this.setState({ drawingManager });
  }

  toggleDrawingManager() {
    const polygonMode = google.maps.drawing.OverlayType.POLYGON;
    this.state.drawingManager.setOptions({
      drawingMode: this.state.drawingManager.drawingMode === null ? polygonMode : null
    });
  }

  addEditablePolygonToMap(coords) {
    const polygon = new google.maps.Polygon(Object.assign(POLYGON_OPTIONS, { paths: coords }));
    polygon.setMap(this.props.map);
    this.setState({ polygon });
  }

  render() {
    return null;
  }
}

DrawingManager.propTypes = {
  map: PropTypes.object.isRequired,
  createArea: PropTypes.func.isRequired
};

export default DrawingManager;
