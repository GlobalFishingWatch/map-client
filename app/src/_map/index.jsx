import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import MapProxy from './MapProxy.container';
import { fitBoundsToTrack, incrementZoom as mapIncrementZoom, decrementZoom as mapDecrementZoom } from './glmap/viewport.actions';
import { initModule } from './module/module.actions';
import { initStyle } from './glmap/style.actions';
import { loadTrack, removeTracks } from './tracks/tracks.actions';
// TODO MAP MODULE REMOVE HEATMAP LAYER
import { addHeatmapLayer, removeHeatmapLayer, loadTilesExtraTimeRange } from './heatmap/heatmap.actions';
import GL_STYLE from './glmap/gl-styles/style.json';


import ModuleReducer from './module/module.reducer';
import TracksReducer from './tracks/tracks.reducer';
import HeatmapReducer from './heatmap/heatmap.reducer';
import HeatmapTilesReducer from './heatmap/heatmapTiles.reducer';
import ViewportReducer from './glmap/viewport.reducer';
import StyleReducer from './glmap/style.reducer';
import InteractionReducer from './glmap/interaction.reducer';

const mapReducer = combineReducers({
  module: ModuleReducer,
  tracks: TracksReducer,
  heatmap: HeatmapReducer,
  heatmapTiles: HeatmapTilesReducer,
  style: StyleReducer,
  viewport: ViewportReducer,
  interaction: InteractionReducer
});

const store = createStore(
  combineReducers({
    map: mapReducer
  }),
  applyMiddleware(thunk)
);


const containsTrack = (track, tracks) => tracks.find(prevTrack =>
  prevTrack.id === track.id &&
  prevTrack.segmentId === track.segmentId
) !== undefined;

const containsLayer = (layer, layers) => layers.find(prevLayer =>
  prevLayer.id === layer.id
) !== undefined;


class MapModule extends React.Component {
  componentDidMount() {
    // TODO MAP MODULE INITIAL VIEWPORT ?
    if (store && store.getState().map.module.token === undefined) {
      store.dispatch(initModule({
        token: this.props.token,
        // TODO MAP MODULE lat/lon updates should be triggered by onHover
        onViewportChange: this.props.onViewportChange,
        onHover: this.props.onHover,
        onClick: this.props.onClick,
        onLoadStart: this.props.onLoadStart,
        onLoadComplete: this.props.onLoadComplete
      }));
    }
    if (this.props.glyphsPath !== undefined) {
      store.dispatch(initStyle({
        glyphsPath: this.props.glyphsPath
      }));
    }

  }
  componentDidUpdate(prevProps) {
    if (this.props.tracks !== prevProps.tracks) {
      if (this.props.tracks.length !== prevProps.tracks.length) {
        const newTracks = this.props.tracks;
        const prevTracks = prevProps.tracks;
        newTracks.forEach((newTrack) => {
          if (!containsTrack(newTrack, prevTracks)) {
            store.dispatch(loadTrack(newTrack));
          }
        });
        prevTracks.forEach((prevTrack) => {
          if (!containsTrack(prevTrack, newTracks)) {
            store.dispatch(removeTracks([prevTrack]));
          }
        });
      }
    }

    if (this.props.heatmapLayers.length !== prevProps.heatmapLayers.length) {
      const newHeatmapLayers = this.props.heatmapLayers;
      const prevHeatmapLayers = prevProps.heatmapLayers;
      newHeatmapLayers.forEach((newHeatmapLayer) => {
        if (!containsLayer(newHeatmapLayer, prevHeatmapLayers)) {
          store.dispatch(addHeatmapLayer(newHeatmapLayer, this.props.loadTemporalExtent));
        }
      });
      prevHeatmapLayers.forEach((prevHeatmapLayer) => {
        if (!containsLayer(prevHeatmapLayer, newHeatmapLayers)) {
          store.dispatch(removeHeatmapLayer(prevHeatmapLayer.id));
        }
      });
    }

    if (this.props.loadTemporalExtent !== undefined && this.props.loadTemporalExtent.length) {
      if (
        prevProps.loadTemporalExtent === undefined || !prevProps.loadTemporalExtent.length ||
        this.props.loadTemporalExtent[0].getTime() !== prevProps.loadTemporalExtent[0].getTime() ||
        this.props.loadTemporalExtent[1].getTime() !== prevProps.loadTemporalExtent[1].getTime()
      ) {
        store.dispatch(loadTilesExtraTimeRange(this.props.loadTemporalExtent));
      }

    }
  }
  render() {
    return (
      <Provider store={store}>
        <MapProxy {...this.props} />
      </Provider>
    );
  }
}

export default MapModule;

export const targetMapVessel = (id, segmentId) => {
  const track = store.getState().map.tracks.find(t =>
    t.id === id && (segmentId === undefined || t.segmentId === segmentId)
  );

  store.dispatch(fitBoundsToTrack(track.geoBounds));

  return track.timelineBounds;
};

// TODO MAP MODULE use prop diffing instead ?
export const incrementZoom = () => {
  store.dispatch(mapIncrementZoom());
};

export const decrementZoom = () => {
  store.dispatch(mapDecrementZoom());
};

// TODO MAP MODULE make it a function
export const AVAILABLE_BASEMAPS = GL_STYLE.metadata['gfw:basemap-layers'];
