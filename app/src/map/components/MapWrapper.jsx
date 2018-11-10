import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Popup } from 'react-map-gl';
import PopupStyles from 'styles/components/map/popup.scss';
import StaticLayerPopup from 'map/containers/StaticLayerPopup';
import MapModule from 'src/_map';
import store from '../..';

class MapWrapper extends Component {
  onClick = (event) => {
    // TODO CLEAR POPUP
    this.props.onMapClick(event);
    // TODO trigger encounters or vessel click
    if (event.type === 'static') {
      console.log('show popup', event);
    } else if (event.type === 'activity') {
      console.log('activity', event);
    }
  }
  onHover = (event) => {
    // console.log(event);
    // TODO MAP MODULE
    // setState({
    //   hoverPopupContent  
    // })
  }
  renderHoverPopup() {
    const { hoverPopup } = this.props;
    if (hoverPopup === null) return null;
    return (<Popup
      latitude={hoverPopup.latitude}
      longitude={hoverPopup.longitude}
      closeButton={false}
      anchor="bottom"
      offsetTop={-10}
      tipSize={4}
    >
      <div className={classnames(PopupStyles.popup, PopupStyles._compact)}>
        {hoverPopup.layerTitle}: {hoverPopup.featureTitle}
      </div>
    </Popup>);
  }
  render() {
    // const popupComponent = <StaticLayerPopup forceRender={Math.random()} />;
    // const hoverPopupComponent = this.renderHoverPopup();

    // <Map popupComponent={popupComponent} hoverPopupComponent={hoverPopupComponent} />
    // {this.props.children}
    return (
      <MapModule
        // TODO MAP MODULE REMOVE STORE
        store={store}
        onHover={this.onHover}
        onClick={this.onClick}
        // hoverPopupContent={}
        {...this.props}
      />);
  }
}

MapWrapper.propTypes = {
  token: PropTypes.string,
  viewport: PropTypes.object,
  tracks: PropTypes.array,
  heatmapLayers: PropTypes.array,
  staticLayers: PropTypes.array,
  basemapLayers: PropTypes.array,
  onViewportChange: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func,
  hoverPopup: PropTypes.object
};

export default MapWrapper;
