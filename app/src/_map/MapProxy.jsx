// TODO MAP MODULE Move remaining diff logic to index.jsx
// TODO MAP MODULE Merge with Map
import React from 'react';
import PropTypes from 'prop-types';
import Map from './glmap/Map.container';

class MapProxy extends React.Component {
  componentDidMount() {
    if (this.props.viewport !== undefined) {
      this.props.updateViewport(this.props.viewport);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.viewport !== undefined && this.props.viewport !== prevProps.viewport) {
      if (
        prevProps.viewport === undefined ||
        prevProps.viewport.center[0] !== this.props.viewport.center[0] ||
        prevProps.viewport.center[1] !== this.props.viewport.center[1] ||
        prevProps.viewport.zoom !== this.props.viewport.zoom
      ) {
        this.props.updateViewport(this.props.viewport);
      }
    }

    if (this.props.basemapLayers !== prevProps.basemapLayers ||
        this.props.staticLayers !== prevProps.staticLayers) {
      this.props.commitStyleUpdates(this.props.staticLayers, this.props.basemapLayers);
    }
  }

  render() {
    return (
      <Map
        tracks={this.props.tracks}
        heatmapLayers={this.props.heatmapLayers}
        temporalExtentIndexes={this.props.temporalExtentIndexes}
        highlightTemporalExtentIndexes={this.props.highlightTemporalExtentIndexes}
        loadTemporalExtent={this.props.loadTemporalExtent}
        hoverPopup={this.props.hoverPopup}
        clickPopup={this.props.clickPopup}
      />
    );
  }
}

// TODO MAP MODULE move to index? Keep 'internal' (not provided) proptypes here and merge?
MapProxy.propTypes = {
  token: PropTypes.string.isRequired,
  viewport: PropTypes.shape({
    zoom: PropTypes.number,
    center: PropTypes.arrayOf(PropTypes.number)
  }),
  tracks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    segmentId: PropTypes.string,
    layerUrl: PropTypes.string.isRequired,
    layerTemporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    color: PropTypes.string
  })),
  // TODO Move inside track object ^^^
  highlightedTrack: PropTypes.string,
  // TODO Colors are passed through filters...
  heatmapLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    tilesetId: PropTypes.string,
    subtype: PropTypes.string,
    header: PropTypes.shape({
      endpoints: PropTypes.object,
      isPBF: PropTypes.bool,
      colsByName: PropTypes.object,
      temporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      temporalExtentsLess: PropTypes.bool
    })
    // color: ...
  })),
  temporalExtent: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  highlightTemporalExtent: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  loadTemporalExtent: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  basemapLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    visible: PropTypes.bool
  })),
  staticLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    // TODO MAP MODULE Is that needed and if so why
    visible: PropTypes.bool,
    // this replaces report system
    selectedPolygons: PropTypes.arrayOf(PropTypes.string),
    opacity: PropTypes.number,
    color: PropTypes.string,
    showLabels: PropTypes.bool
  })),
  // interactiveLayerIds TODO MAP MODULE
  // customLayers
  // filters
  hoverPopup: PropTypes.shape({
    content: PropTypes.node,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }),
  clickPopup: PropTypes.shape({
    content: PropTypes.node,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }),
  // TODO MAP Module those are not needed here as they are used directly in index.
  onViewportChange: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  onAttributionsChange: PropTypes.func
};

export default MapProxy;
