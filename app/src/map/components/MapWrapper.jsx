import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StaticLayerPopup from 'map/components/StaticLayerPopup';
import HoverPopup from 'map/components/HoverPopup';
import MapModule from 'src/_map';

class MapWrapper extends Component {
  state = {
    hoverPopupData: null,
    clickPopupData: null
  }

  renderClickPopup = () => {
    const { clickPopupData } = this.state;
    if (clickPopupData === null) {
      return null;
    }

    const { report, workspaceLayers, toggleCurrentReportPolygon } = this.props;
    return (<StaticLayerPopup
      event={clickPopupData}
      report={report}
      workspaceLayers={workspaceLayers}
      toggleCurrentReportPolygon={toggleCurrentReportPolygon}
    />);
  }

  onClick = (event) => {
    this.props.onMapClick(event);
    const clickPopupData = (event.type === 'static') ? event : null;

    this.setState({
      clickPopupData,
      hoverPopupData: (clickPopupData !== null) ? null : this.state.hoverPopupData
    });
  }

  renderHoverPopup = () => {
    const { hoverPopupData } = this.state;
    if (hoverPopupData === null || hoverPopupData.type === null) {
      return null;
    }
    const { workspaceLayers } = this.props;
    const workspaceLayer = workspaceLayers.find(l => l.id === hoverPopupData.layer.id);
    return <HoverPopup event={hoverPopupData} layerTitle={workspaceLayer.title} />;
  }

  onHover = (event) => {
    const hoverPopupData = (event.type !== null) ? event : null;
    this.props.onMapHover(event);
    this.setState({
      hoverPopupData
    });
  }

  onClosePopup = () => {
    this.setState({
      clickPopupData: null
    });
  }

  render() {
    const {
      onViewportChange,
      onLoadStart,
      onLoadComplete,
      onAttributionsChange,
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

    const { hoverPopupData, clickPopupData } = this.state;

    const hoverPopup = (hoverPopupData === null) ? null : { ...hoverPopupData, content: this.renderHoverPopup() };
    const clickPopup = (clickPopupData === null) ? null : { ...clickPopupData, content: this.renderClickPopup() };


    return (
      <MapModule
        onHover={this.onHover}
        onClick={this.onClick}
        onViewportChange={onViewportChange}
        onLoadStart={onLoadStart}
        onLoadComplete={onLoadComplete}
        onAttributionsChange={onAttributionsChange}
        onClosePopup={this.onClosePopup}
        hoverPopup={hoverPopup}
        clickPopup={clickPopup}
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
  onAttributionsChange: PropTypes.func,
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
  onMapHover: PropTypes.func,
  onMapClick: PropTypes.func,
  report: PropTypes.object,
  workspaceLayers: PropTypes.array,
  toggleCurrentReportPolygon: PropTypes.func
};

export default MapWrapper;
