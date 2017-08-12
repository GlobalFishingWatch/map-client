import PropTypes from 'prop-types';
import { Component } from 'react';
import { COLORS } from 'constants';

class DrawingManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawingManager: null,
      polygon: null,
      coordinates: null
    };
    this.polygonOptions = {
      fillColor: COLORS[props.polygonColor],
      strokeColor: COLORS[props.polygonColor],
      strokeOpacity: 1,
      fillOpacity: 0.5,
      strokeWeight: 3,
      clickable: false,
      editable: true,
      zIndex: 1
    };

    this.updateCoordinates = this.updateCoordinates.bind(this);
    this.addEditablePolygonToMap = this.addEditablePolygonToMap.bind(this);
  }

  componentDidMount() {
    if (this.props.map) {
      this.initDrawingManager(this.props.map);
    }
  }

  initDrawingManager(map) {
    const drawingOptions = {
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      polygonOptions: this.polygonOptions
    };
    const drawingManager = new google.maps.drawing.DrawingManager(drawingOptions);
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon) => {
      this.onPolygonComplete(polygon);
    });
    this.setState({ drawingManager });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.map !== nextProps.map) {
      this.initDrawingManager(nextProps.map);
    }
    if (this.props.polygonColor !== nextProps.polygonColor) {
      this.updatePolygonColor(nextProps.polygonColor);
    }
  }

  updatePolygonColor(color) {
    const hexColor = COLORS[color];
    this.polygonOptions.fillColor = hexColor;
    this.polygonOptions.strokeColor = hexColor;
    if (this.state.polygon) {
      this.state.polygon.setOptions({
        fillColor: hexColor, strokeColor: hexColor
      });
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
    this.props.updateWorkingAreaOfInterest({ coordinates });
  }

  componentWillUnmount() {
    this.state.drawingManager.setOptions({ drawingMode: null });
    this.state.drawingManager.setMap(null);
    if (this.state.polygon) this.deletePolygonFromMap(this.state.polygon);
  }


  toggleDrawingManager() {
    const polygonMode = google.maps.drawing.OverlayType.POLYGON;
    this.state.drawingManager.setOptions({
      drawingMode: this.state.drawingManager.drawingMode === null ? polygonMode : null
    });
  }

  updateCoordinates(polygon) {
    const coordinates = this.getPolygonCoordinates(polygon);
    this.props.updateWorkingAreaOfInterest({ coordinates });
  }

  addEditablePolygonToMap(coords) {
    const polygon = new google.maps.Polygon(Object.assign(this.polygonOptions, { paths: coords }));
    this.setState({ polygon });
    ['set_at', 'insert_at', 'remove_at'].forEach((action) => {
      google.maps.event.addListener(polygon.getPath(), action, () => this.updateCoordinates(polygon));
    });
    polygon.setMap(this.props.map);
  }

  render() {
    return null;
  }
}

DrawingManager.propTypes = {
  map: PropTypes.object.isRequired,
  updateWorkingAreaOfInterest: PropTypes.func.isRequired,
  polygonColor: PropTypes.string
};

export default DrawingManager;
