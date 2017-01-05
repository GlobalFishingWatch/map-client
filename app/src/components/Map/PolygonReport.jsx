// import BaseOverlay from 'components/Layers/BaseOverlay';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import PolygonReportStyles from 'styles/components/map/c-polygon-report.scss';
import buttonCloseStyles from 'styles/components/c-button-close.scss';
import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=Icon';

class PolygonReportInfoWindow extends google.maps.OverlayView {
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

export default class PolygonReport extends Component {
  constructor() {
    super();
    this.onInfoWindowClickBound = this.onInfoWindowClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.map) {
      this.infoWindow = new PolygonReportInfoWindow();
      this.infoWindow.setMap(nextProps.map);
      this.infoWindow.div.addEventListener('click', this.onInfoWindowClickBound);
      this.map = nextProps.map;
    }
  }

  // avoids updating when props.map changes
  shouldComponentUpdate(nextProps) {
    if (nextProps.id !== this.props.id || nextProps.isInReport !== this.props.isInReport) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (!this.infoWindow) return;
    ReactDOM.render(this.element, this.infoWindow.div);
    if (this.props.latLng) {
      this.infoWindow.setLatLng(this.props.latLng);
    }
  }

  onInfoWindowClick(e) {
    if (e.target.className.indexOf('js-close') > -1) {
      this.props.clearPolygon();
    } else if (e.target.className.indexOf('js-toggle') > -1) {
      this.props.toggleReportPolygon(this.props.id);
    }
  }

  render() {
    const toggleButtonText = (this.props.isInReport) ? 'remove from report' : 'add to report';
    let toggleButtonClassName = classnames('js-toggle', PolygonReportStyles.toggle);
    if (this.props.isInReport) {
      toggleButtonClassName += ` ${PolygonReportStyles['-remove']}`;
    }
    this.element = (this.props.id === undefined) ? <div /> : (<div className={PolygonReportStyles['c-polygon-report']}>
      <div className={PolygonReportStyles.title}>
        {this.props.id}
      </div>
      <div className={PolygonReportStyles.description}>
        {this.props.description}
      </div>
      <button className={classnames('js-close', PolygonReportStyles.close, buttonCloseStyles['c-button-close'])}>
        <CloseIcon className={buttonCloseStyles.cross} />
      </button>
      <button className={toggleButtonClassName}>
        {toggleButtonText}
      </button>
    </div>);

    return null;
  }
}

PolygonReport.propTypes = {
  id: React.PropTypes.number,
  description: React.PropTypes.string,
  latLng: React.PropTypes.array,
  isInReport: React.PropTypes.bool,
  toggleReportPolygon: React.PropTypes.func,
  clearPolygon: React.PropTypes.func
};
