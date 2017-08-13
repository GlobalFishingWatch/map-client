import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Promise from 'promise-polyfill';
import 'styles/global.scss';
import heatmapReducer from 'reducers/heatmap';
import reportReducer from 'report/reportReducer';
import mapReducer from 'reducers/map';
import layerLibraryReducer from 'layers/layersLibraryReducer';
import layersReducer from 'layers/layersReducer';
import analyticsMiddleware from 'analytics/analyticsMiddleware';
import areasOfInterestReducer from 'areasOfInterest/areasOfInterestReducer';
import userReducer from 'user/userReducer';
import filtersReducer from 'filters/filtersReducer';
import supportFormReducer from 'siteNav/supportFormReducer';
import searchReducer from 'search/searchReducer';
import vesselInfoReducer from 'reducers/vesselInfo';
import customLayerReducer from 'layers/customLayerReducer';
import welcomeModalReducer from 'welcomeModal/welcomeModalReducer';
import timebarReducer from 'timebar/timebarReducer';
import literalsReducer from 'siteNav/literalsReducer';
import basemapReducer from 'basemap/basemapReducer';
import recentVesselsReducer from 'recentVessels/recentVesselsReducer';
import rightControlPanelReducer from 'rightControlPanel/rightControlPanelReducer';
import shareReducer from 'share/shareReducer';
import AppContainer from 'containers/App';
import AuthMapContainer from 'containers/AuthMap';

// Polyfill for older browsers (IE11 for example)
window.Promise = window.Promise || Promise;
/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
  areas: areasOfInterestReducer,
  basemap: basemapReducer,
  supportForm: supportFormReducer,
  customLayer: customLayerReducer,
  filters: filtersReducer,
  heatmap: heatmapReducer,
  layerLibrary: layerLibraryReducer,
  layers: layersReducer,
  literals: literalsReducer,
  map: mapReducer,
  welcomeModal: welcomeModalReducer,
  recentVessels: recentVesselsReducer,
  rightControlPanel: rightControlPanelReducer,
  report: reportReducer,
  search: searchReducer,
  share: shareReducer,
  timebar: timebarReducer,
  user: userReducer,
  vesselInfo: vesselInfoReducer
});

/**
 * Global state
 * @info(http://redux.js.org/docs/basics/Store.html)
 * @type {Object}
 */
const store = createStore(
  reducer,
  applyMiddleware(analyticsMiddleware, thunk)
);

render(
  <Provider store={store} >
    <AppContainer >
      <AuthMapContainer />
    </AppContainer >
  </Provider >,
  document.getElementById('app')
);
