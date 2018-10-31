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
    this.props.initModule({
      token: this.props.token,
      onViewportChange: this.props.onViewportChange,
      onLoadStart: this.props.onLoadStart,
      onLoadComplete: this.props.onLoadComplete
    });

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
  highlightedTrack: PropTypes.string,
  // TODO Colors are passed through filters...
  heatmapLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
    subtype: PropTypes.string,
    isPBF: PropTypes.bool,
    colsByName: PropTypes.object,
    temporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    temporalExtentsLess: PropTypes.bool
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
  // customLayers
  // filters
  onViewportChange: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func,
  // interaction callbacks...
  onAttributionsChange: PropTypes.func
};

export default MapProxy;
