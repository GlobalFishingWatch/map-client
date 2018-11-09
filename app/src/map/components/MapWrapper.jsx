import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Popup } from 'react-map-gl';
import PopupStyles from 'styles/components/map/popup.scss';
import StaticLayerPopup from 'map/containers/StaticLayerPopup';
import MapModule from 'src/_map';
import store from '../..';

class MapWrapper extends Component {
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
    const popupComponent = <StaticLayerPopup forceRender={Math.random()} />;
    const hoverPopupComponent = this.renderHoverPopup();

    // <Map popupComponent={popupComponent} hoverPopupComponent={hoverPopupComponent} />
    // {this.props.children}
    return (
      <MapModule
        // TODO MAP MODULE REMOVE THIS
        store={store}
        popupComponent={popupComponent}
        {...this.props}
        // // TODO MODULE just pass {...props} + isolate to MapWrapper
        // token={this.props.token}
        // viewport={this.props.mapViewport}
        // tracks={this.props.mapTracks}
        // heatmapLayers={this.props.mapHeatmapLayers}
        // staticLayers={this.props.mapStaticLayers}
        // basemapLayers={this.props.mapBasemapLayers}
        // hoverPopupComponent={hoverPopupComponent}
        // onViewportChange={this.props.onMapViewportChange}
        // onLoadStart={this.props.onMapLoadStart}
        // onLoadComplete={this.props.onMapLoadComplete}
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
