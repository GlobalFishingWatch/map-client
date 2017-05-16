import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import CustomInfowindowStyles from 'styles/components/map/c-custom-infowindow.scss';
import CustomInfoWindow from 'util/CustomInfoWindow';

export default class ClusterInfoWindow extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.map) {
      this.infoWindow = new CustomInfoWindow(nextProps.map);
      this.map = nextProps.map;
    }
  }

  // avoids updating when props.map changes
  shouldComponentUpdate(nextProps) {
    if (nextProps.latLng !== this.props.latLng || nextProps.clickableCluster !== this.props.clickableCluster) {
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

  render() {
    this.element = (this.props.clickableCluster !== true) ? <div /> : (<div
      className={classnames(
        CustomInfowindowStyles['c-custom-infowindow'],
        CustomInfowindowStyles['-small'],
        CustomInfowindowStyles['-topleft']
      )}
    >
      <div className={CustomInfowindowStyles.description}>
        There are multiple vessels at this location
      </div>
    </div>);

    return null;
  }
}

ClusterInfoWindow.propTypes = {
  latLng: PropTypes.object,
  clickableCluster: PropTypes.bool,
  map: PropTypes.object
};
