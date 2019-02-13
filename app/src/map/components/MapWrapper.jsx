import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StaticLayerPopup from 'map/components/StaticLayerPopup';
import HoverPopup from 'map/components/HoverPopup';
import MapModule from 'src/_map';

class MapWrapper extends Component {
  state = {
    hoverPopup: null,
    clickPopup: null
  }
  onClick = (event) => {
    const { report, workspaceLayers, toggleCurrentReportPolygon } = this.props;
    // TODO CLEAR POPUP
    this.props.onMapClick(event);
    let clickPopup = null;
    if (event.type === 'static') {
      clickPopup = {
        content: <StaticLayerPopup
          event={event}
          report={report}
          workspaceLayers={workspaceLayers}
          toggleCurrentReportPolygon={toggleCurrentReportPolygon}
        />,
        latitude: event.latitude,
        longitude: event.longitude
      };
    }
    this.setState({
      clickPopup,
      hoverPopup: (clickPopup !== undefined) ? null : this.state.hoverPopup
    });
  }
  onHover = (event) => {
    // console.log(event)
    let hoverPopup = null;
    if (event.type !== null) {
      const workspaceLayer = this.props.workspaceLayers.find(l => l.id === event.layer.id);
      hoverPopup = {
        content: <HoverPopup event={event} layerTitle={workspaceLayer.title} />,
        latitude: event.latitude,
        longitude: event.longitude
      };
    }
    this.setState({
      hoverPopup
    });
  }

  render() {
    return (
      <MapModule
        onHover={this.onHover}
        onClick={this.onClick}
        hoverPopup={this.state.hoverPopup}
        clickPopup={this.state.clickPopup}
        glyphsPath={`${PUBLIC_PATH}gl-fonts/{fontstack}/{range}.pbf`}
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
