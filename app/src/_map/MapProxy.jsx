import React from 'react';
import PropTypes from 'prop-types';
import Map from './glmap/Map.container';

const containsTrack = (track, tracks) => tracks.find(prevTrack =>
  prevTrack.id === track.id &&
  prevTrack.segmentId === track.segmentId
) !== undefined;

const containsLayer = (layer, layers) => layers.find(prevLayer =>
  prevLayer.id === layer.id
) !== undefined;

class MapProxy extends React.Component {
  componentDidMount() {
    if (this.props.viewport !== null) {
      this.props.updateViewport(this.props.viewport);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.viewport !== prevProps.viewport) {
      this.props.updateViewport(this.props.viewport);
    }

    if (this.props.tracks !== prevProps.tracks) {
      if (this.props.tracks.length !== prevProps.tracks.length) {
        const newTracks = this.props.tracks;
        const prevTracks = prevProps.tracks;
        newTracks.forEach((newTrack) => {
          if (!containsTrack(newTrack, prevTracks)) {
            this.props.loadTrack(newTrack);
          }
        });
        prevTracks.forEach((prevTrack) => {
          if (!containsTrack(prevTrack, newTracks)) {
            this.props.removeTrack(prevTrack);
          }
        });
      }

    }

    if (this.props.heatmapLayers.length !== prevProps.heatmapLayers.length) {
      const newHeatmapLayers = this.props.heatmapLayers;
      const prevHeatmapLayers = prevProps.heatmapLayers;
      newHeatmapLayers.forEach((newHeatmapLayer) => {
        if (!containsLayer(newHeatmapLayer, prevHeatmapLayers)) {
          this.props.addHeatmapLayer(newHeatmapLayer);
        }
      });
      prevHeatmapLayers.forEach((prevHeatmapLayer) => {
        if (!containsLayer(prevHeatmapLayer, newHeatmapLayers)) {
          this.props.removeHeatmapLayer(prevHeatmapLayer.id);
        }
      });
    }

    if (this.props.basemapLayers !== prevProps.basemapLayers ||
        this.props.staticLayers !== prevProps.staticLayers) {
      this.props.commitStyleUpdates(this.props.staticLayers, this.props.basemapLayers);
    }
  }

  render() {
    return (
      <Map
        providedTracks={this.props.tracks}
        // providedHeatmapLayers={this.props.heatmapLayers}
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
    id: PropTypes.string,
    segmentId: PropTypes.string,
    layerUrl: PropTypes.string,
    layerTemporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    // color: ...
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
  basemapLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    visible: PropTypes.bool
  })),
  staticLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
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
