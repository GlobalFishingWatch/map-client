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

  onClosePopup = () => {
    this.setState({
      clickPopup: null
    });
  }

  render() {
    const {
      onViewportChange,
      onLoadStart,
      onLoadComplete,
      token,
      viewport,
      tracks,
      heatmapLayers,
      staticLayers,
      basemapLayers,
      temporalExtent,
      loadTemporalExtent,
      highlightTemporalExtent
    } = this.props;
    return (
      <MapModule
        onHover={this.onHover}
        onClick={this.onClick}
        onViewportChange={onViewportChange}
        onLoadStart={onLoadStart}
        onLoadComplete={onLoadComplete}
        onClosePopup={this.onClosePopup}
        hoverPopup={this.state.hoverPopup}
        clickPopup={this.state.clickPopup}
        token={token}
        glyphsPath={`${PUBLIC_PATH}gl-fonts/{fontstack}/{range}.pbf`}
        viewport={viewport}
        tracks={tracks}
        heatmapLayers={heatmapLayers}
        staticLayers={staticLayers}
        basemapLayers={basemapLayers}
        temporalExtent={temporalExtent}
        loadTemporalExtent={loadTemporalExtent}
        highlightTemporalExtent={highlightTemporalExtent}
      />);
  }
}

MapWrapper.propTypes = {
  // sent to MapModule
  onViewportChange: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func,
  token: PropTypes.string,
  viewport: PropTypes.object,
  tracks: PropTypes.array,
  heatmapLayers: PropTypes.array,
  staticLayers: PropTypes.array,
  basemapLayers: PropTypes.array,
  temporalExtent: PropTypes.array,
  loadTemporalExtent: PropTypes.array,
  highlightTemporalExtent: PropTypes.array,
  // internal
  onMapClick: PropTypes.func,
  report: PropTypes.object,
  workspaceLayers: PropTypes.array,
  toggleCurrentReportPolygon: PropTypes.func
};

export default MapWrapper;
