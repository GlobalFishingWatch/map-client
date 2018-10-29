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
  }

  render() {
    return (
      <Map providedTracks={this.props.tracks} />
    );
  }
}

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
  })),
  heatmapLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    url: PropTypes.string,
    subtype: PropTypes.string,
    isPBF: PropTypes.bool,
    colsByName: PropTypes.object,
    temporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    temporalExtentsLess: PropTypes.bool
  })),
  onViewportChange: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func
};

export default MapProxy;
