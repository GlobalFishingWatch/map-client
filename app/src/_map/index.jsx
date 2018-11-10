import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import MapProxy from './MapProxy.container';
import { fitBoundsToTrack, incrementZoom as mapIncrementZoom, decrementZoom as mapDecrementZoom } from './glmap/viewport.actions';
import { initModule } from './module/module.actions';
import GL_STYLE from './glmap/gl-styles/style.json';


// import ModuleReducer from './module/module.reducer';
// import TracksReducer from './tracks/tracks.reducer';
// import HeatmapReducer from './heatmap/heatmap.reducer';
// import HeatmapTilesReducer from './heatmap/heatmapTiles.reducer';
// import ViewportReducer from './glmap/viewport.reducer';
// import StyleReducer from './glmap/style.reducer';
// import InteractionReducer from './glmap/interaction.reducer';

// const mapReducer = combineReducers({
//   module: ModuleReducer,
//   tracks: TracksReducer,
//   heatmap: HeatmapReducer,
//   heatmapTiles: HeatmapTilesReducer,
//   style: StyleReducer,
//   viewport: ViewportReducer
// });

// const ownStore = createStore(
//   combineReducers({
//     map: mapReducer
//   }),
//   applyMiddleware(thunk)
// );

let store;

class MapModule extends React.Component {
  componentDidMount() {

  }
  componentDidUpdate() {
    // TODO MAP MODULE This should be in componentDidMount, but currently props.store is not ready yet
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
  }
  render() {
    if (this.props.store) {
      store = this.props.store;
      // TODO MAP MODULE Switch to own store
      // store = ownStore;

      return (
        <Provider store={store}>
          <MapProxy {...this.props} />
        </Provider>
      );
    }
    return null;
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
