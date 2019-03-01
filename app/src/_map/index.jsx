import React from 'react';
import PropTypes from 'prop-types';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'remote-redux-devtools';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import throttle from 'lodash/throttle';

import Map from './glmap/Map.container';
import { initModule, setTemporalExtend } from './module/module.actions';
import {
  fitToBounds,
  updateViewport,
  transitionToZoom
} from './glmap/viewport.actions';
import {
  initStyle,
  commitStyleUpdates,
  applyTemporalExtent
} from './glmap/style.actions';
import {
  updateTracks
} from './tracks/tracks.actions';
import {
  updateHeatmapLayers,
  updateLayerLoadTemporalExtents
} from './heatmap/heatmap.actions';
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

const composeEnhancersDev = composeWithDevTools({
  name: 'Map module',
  realtime: true,
  hostname: 'localhost',
  port: 8000,
  maxAge: 30,
  stateSanitizer: state => ({ ...state, map: { ...state.map, heatmap: 'NOT_SERIALIZED' } })
});

// TODO: include env var when module is in gfw-components
const composeEnhancers = false && process.env.NODE_ENV === 'development'
  ? composeEnhancersDev
  : compose;

const store = createStore(
  combineReducers({
    map: mapReducer
  }),
  {},
  composeEnhancers(applyMiddleware(thunk))
);

const throttleApplyTemporalExtent = throttle((temporalExtent) => {
  store.dispatch(applyTemporalExtent(temporalExtent));
  store.dispatch(setTemporalExtend(temporalExtent));
}, 16);

const updateViewportFromIncomingProps = (incomingViewport) => {
  store.dispatch(updateViewport({
    latitude: incomingViewport.center[0],
    longitude: incomingViewport.center[1],
    zoom: incomingViewport.zoom
  }));
};

class MapModule extends React.Component {
  state = {
    initialized: false
  }

  componentDidMount() {
    // First trigger synchronous actions that should happen before any map render
    // At the end of this, set a flag to allow map rendering

    if (this.props.viewport !== undefined) {
      updateViewportFromIncomingProps(this.props.viewport);
    }

    // TODO
    if (this.props.glyphsPath !== undefined) {
      store.dispatch(initStyle({
        glyphsPath: this.props.glyphsPath
        // TODO apply URL updates here
      }));
    }

    if (this.props.onAttributionsChange !== undefined) {
      this.props.onAttributionsChange(store.getState().map.style.attributions);
    }

    if (store && store.getState().map.module.token === undefined) {
      store.dispatch(initModule({
        token: this.props.token,
        onViewportChange: this.props.onViewportChange,
        onHover: this.props.onHover,
        onClick: this.props.onClick,
        onLoadStart: this.props.onLoadStart,
        onLoadComplete: this.props.onLoadComplete,
        onClosePopup: this.props.onClosePopup,
        onAttributionsChange: this.props.onAttributionsChange
      }));
    }

    if ((this.props.basemapLayers !== undefined && this.props.basemapLayers.length) ||
        (this.props.staticLayers !== undefined && this.props.staticLayers.length)) {
      store.dispatch(commitStyleUpdates(this.props.staticLayers || [], this.props.basemapLayers || []));
    }

    if (this.props.tracks !== undefined) {
      store.dispatch(updateTracks(this.props.tracks));
    }

    // Now trigger async actions

    if (this.props.temporalExtent !== undefined && this.props.temporalExtent.length) {
      throttleApplyTemporalExtent(this.props.temporalExtent);
    }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      initialized: true
    });
  }

  componentDidUpdate(prevProps) {
    // tracks
    if (this.props.tracks !== prevProps.tracks) {
      store.dispatch(updateTracks(this.props.tracks));
    }

    // heatmap layers
    if (this.props.heatmapLayers !== prevProps.heatmapLayers) {
      store.dispatch(updateHeatmapLayers(this.props.heatmapLayers, this.props.loadTemporalExtent));
    }

    // basemap / static layers
    if ((this.props.basemapLayers !== undefined && this.props.basemapLayers.length) ||
        (this.props.staticLayers !== undefined && this.props.staticLayers.length)) {
      store.dispatch(commitStyleUpdates(this.props.staticLayers || [], this.props.basemapLayers || []));
    }

    // loadTemporalExtent
    if (this.props.loadTemporalExtent !== undefined && this.props.loadTemporalExtent.length) {
      if (
        prevProps.loadTemporalExtent === undefined || !prevProps.loadTemporalExtent.length ||
        this.props.loadTemporalExtent[0].getTime() !== prevProps.loadTemporalExtent[0].getTime() ||
        this.props.loadTemporalExtent[1].getTime() !== prevProps.loadTemporalExtent[1].getTime()
      ) {
        store.dispatch(updateLayerLoadTemporalExtents(this.props.loadTemporalExtent));
      }
    }

    // temporalExtent
    if (this.props.temporalExtent !== undefined && this.props.temporalExtent.length) {
      if (
        prevProps.temporalExtent === undefined || !prevProps.temporalExtent.length ||
        this.props.temporalExtent[0].getTime() !== prevProps.temporalExtent[0].getTime() ||
        this.props.temporalExtent[1].getTime() !== prevProps.temporalExtent[1].getTime()
      ) {
        throttleApplyTemporalExtent(this.props.temporalExtent);
      }
    }

    // viewport - since viewport will be updated internally to the module,
    // we have to compare incoming props to existing viewport in store, ie:
    // update viewport from incoming props ONLY if zoom or center is different
    // from the internally stored one
    // TODO FFS incoming lat lon should be an object, not an array
    const currentViewport = store.getState().map.viewport.viewport;
    //                                        stop propagating updates from outside when zooming in
    if (this.props.viewport !== undefined && store.getState().map.viewport.currentTransition === null) {
      if (
        currentViewport.latitude !== this.props.viewport.center[0] ||
        currentViewport.longitude !== this.props.viewport.center[1] ||
        currentViewport.zoom !== this.props.viewport.zoom
      ) {
        // if zoom delta is precisely === 1, zoom with a transition
        if (Math.abs(currentViewport.zoom - this.props.viewport.zoom) === 1) {
          store.dispatch(transitionToZoom(this.props.viewport.zoom));
        } else {
          updateViewportFromIncomingProps(this.props.viewport);
        }
      }
    }
  }
  render() {
    // won't render anything before actions in componentDidMount have been triggered
    return (this.state.initialized !== true) ? null : (
      <Provider store={store}>
        <Map {...this.props} />
      </Provider>
    );
  }
}

MapModule.propTypes = {
  token: PropTypes.string,
  viewport: PropTypes.shape({
    zoom: PropTypes.number,
    center: PropTypes.arrayOf(PropTypes.number)
  }),
  tracks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    layerTemporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    color: PropTypes.string,
    fitBoundsOnLoad: PropTypes.bool
  })),
  heatmapLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    tilesetId: PropTypes.string,
    subtype: PropTypes.string,
    visible: PropTypes.bool,
    hue: PropTypes.number,
    opacity: PropTypes.number,
    filters: PropTypes.arrayOf(PropTypes.shape({
      // hue overrides layer hue if set
      hue: PropTypes.number,
      // filterValues is a dictionary in which each key is a filterable field,
      // and values is an array of all possible values (OR filter)
      // ie: filterValues: { category: [5, 6] }
      filterValues: PropTypes.object
    })),
    header: PropTypes.shape({
      endpoints: PropTypes.object,
      isPBF: PropTypes.bool,
      colsByName: PropTypes.object,
      temporalExtents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      temporalExtentsLess: PropTypes.bool
    }).isRequired,
    interactive: PropTypes.bool
  })),
  temporalExtent: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  highlightTemporalExtent: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  loadTemporalExtent: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  basemapLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    visible: PropTypes.bool
  })),
  staticLayers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    // TODO MAP MODULE Is that needed and if so why
    visible: PropTypes.bool,
    selectedPolygons: PropTypes.shape({
      field: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.string)
    }),
    opacity: PropTypes.number,
    color: PropTypes.string,
    showLabels: PropTypes.bool,
    interactive: PropTypes.bool,
    isCustom: PropTypes.bool,
    subtype: PropTypes.oneOf([undefined, 'geojson', 'raster']),
    url: PropTypes.string,
    data: PropTypes.object,
    gl: PropTypes.object
  })),
  // customLayers
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
  glyphsPath: PropTypes.string,
  onViewportChange: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadComplete: PropTypes.func,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  onAttributionsChange: PropTypes.func,
  onClosePopup: PropTypes.func
};


export default MapModule;

export const targetMapVessel = (id) => {
  const track = store.getState().map.tracks.data.find(t =>
    t.id === id.toString()
  );
  store.dispatch(fitToBounds(track.geoBounds));

  return track.timelineBounds;
};

// TODO MAP MODULE make it a function
export const AVAILABLE_BASEMAPS = GL_STYLE.metadata['gfw:basemap-layers'];
