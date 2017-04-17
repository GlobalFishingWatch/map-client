// import BaseOverlay from 'components/Layers/BaseOverlay';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import PolygonReportStyles from 'styles/components/map/c-polygon-report.scss';
// import buttonCloseStyles from 'styles/components/c-button-close.scss';
// import CloseIcon from 'babel!svg-react!assets/icons/close.svg?name=Icon';
import CustomInfoWindow from 'util/CustomInfoWindow';

export default class ClusterInfoWindow extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.map) {
      this.infoWindow = new CustomInfoWindow(nextProps.map);
      // this.infoWindow.div.addEventListener('click', this.onInfoWindowClickBound);
      this.map = nextProps.map;
    }
  }

  // avoids updating when props.map changes
  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.id !== this.props.id || nextProps.isInReport !== this.props.isInReport) {
  //     return true;
  //   }
  //   return false;
  // }

  componentDidUpdate() {
    if (!this.infoWindow) return;
    ReactDOM.render(this.element, this.infoWindow.div);
    if (this.props.latLng) {
      this.infoWindow.setLatLng(this.props.latLng);
    }
  }

  // onInfoWindowClick(e) {
  //   if (e.target.className.indexOf('js-close') > -1) {
  //     this.props.clearPolygon();
  //   } else if (e.target.className.indexOf('js-toggle') > -1) {
  //     this.props.toggleReportPolygon(this.props.id);
  //   }
  // }

  render() {
    console.log(this.props.isCluster)
    this.element = (this.props.isCluster !== true) ? <div /> : (<div
      className={classnames(PolygonReportStyles['c-polygon-report'], 'js-polygon-report')}
    >
      lala
    </div>);

    return null;
  }
}

ClusterInfoWindow.propTypes = {
  latLng: React.PropTypes.object,
  isCluster: React.PropTypes.bool,
  map: React.PropTypes.object
};
