import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import convert from 'globalfishingwatch-convert';
import { LAYER_TYPES } from 'constants';
import classnames from 'classnames';
import CustomInfowindowStyles from 'styles/components/map/custom-infowindow.scss';
import CustomInfoWindow from 'util/CustomInfoWindow';
import { FORMAT_DATE } from 'config';

export default class EncounterInfoWindow extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.map && nextProps.map) {
      this.infoWindow = new CustomInfoWindow(nextProps.map);
      this.map = nextProps.map;
    }
  }

  // avoids updating when props.map changes
  shouldComponentUpdate(nextProps) {
    if (nextProps.latLng !== this.props.latLng) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (!this.infoWindow) return;
    render(this.element, this.infoWindow.div);
    if (this.props.latLng) {
      this.infoWindow.setLatLng(this.props.latLng);
    }
  }

  render() {
    const foundVessel = (this.props.foundVessels && this.props.foundVessels.length) ? this.props.foundVessels[0] : {};

    let time;
    if (foundVessel.timeIndex) {
      const date = new Date(convert.getTimestampFromOffsetedtTimeAtPrecision(foundVessel.timeIndex));
      time = moment(date).format(FORMAT_DATE);
    }

    this.element = (this.props.layerSubtype !== LAYER_TYPES.Encounters) ? <div /> : (<div
      className={classnames(
        CustomInfowindowStyles.customInfowindow,
        CustomInfowindowStyles._small,
        CustomInfowindowStyles._topleft
      )}
    >
      <div className={CustomInfowindowStyles.description}>
        Encounter: {time}
      </div>
    </div>);

    return null;
  }
}

EncounterInfoWindow.propTypes = {
  layerSubtype: PropTypes.string,
  foundVessels: PropTypes.array,
  latLng: PropTypes.object,
  map: PropTypes.object
};