import PropTypes from 'prop-types';
import { Component } from 'react';
import { COLORS } from 'constants';

class Areas extends Component {
  constructor(props) {
    super();
    if (props.map) this.initAreas(props.areas);
    this.polygons = [];
  }

  componentWillUnmount() {
    this.polygons.forEach((polygon) => {
      this.deletePolygonFromMap(polygon);
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.map && nextProps.map) {
      this.initAreas(nextProps.areas);
    }
    if (this.props.areas !== nextProps.areas) {
      this.updateAreas(nextProps.areas);
    }
  }

  initAreas(areas) {
    areas.forEach((area) => {
      this.addPolygonToMap(area);
    });
  }

  updateAreas(areas) {
    this.polygons.forEach((polygon) => {
      this.deletePolygonFromMap(polygon);
    });
    areas.forEach((area) => {
      this.addPolygonToMap(area);
    });
  }

  deletePolygonFromMap(polygon) {
    google.maps.event.clearInstanceListeners(polygon);
    polygon.setMap(null);
  }

  addPolygonToMap(area) {
    this.polygonOptions = {
      fillColor: COLORS[area.color],
      strokeColor: COLORS[area.color],
      strokeOpacity: area.visible ? 1 : 0,
      fillOpacity: area.visible ? 0.5 : 0,
      strokeWeight: 3,
      clickable: false,
      editable: false,
      zIndex: 1
    };
    const polygon = new google.maps.Polygon(Object.assign(this.polygonOptions, { paths: area.coordinates }));
    polygon.setMap(this.props.map);
    this.polygons = this.polygons.concat([polygon]);
  }

  render() {
    return null;
  }
}

Areas.propTypes = {
  map: PropTypes.object,
  areas: PropTypes.array.isRequired
};

export default Areas;
