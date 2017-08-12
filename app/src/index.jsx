import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Promise from 'promise-polyfill';
import 'styles/global.scss';
import reportReducer from 'report/reportReducer';
import heatmapReducer from 'reducers/heatmap';
import layerLibraryReducer from 'layers/layersLibraryReducer';
import layersReducer from 'layers/layersReducer';
import mapReducer from 'reducers/map';
import analyticsMiddleware from 'analytics/analyticsMiddleware';
import areasOfInterestReducer from 'areasOfInterest/areasOfInterestReducer';
import userReducer from 'reducers/user';
import filtersReducer from 'filters/filtersReducer';
import contactReducer from 'siteNav/contactReducer';
import searchReducer from 'search/searchReducer';
import vesselInfoReducer from 'reducers/vesselInfo';
import customLayerReducer from 'layers/customLayerReducer';
import modalReducer from 'reducers/modal';
import timebarReducer from 'timebar/timebarReducer';
import literalsReducer from 'siteNav/literalsReducer';
import basemapReducer from 'basemap/basemapReducer';
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
  map: mapReducer,
  user: userReducer,
  filters: filtersReducer,
  contactStatus: contactReducer,
  search: searchReducer,
  vesselInfo: vesselInfoReducer,
  report: reportReducer,
  heatmap: heatmapReducer,
  layerLibrary: layerLibraryReducer,
  layers: layersReducer,
  customLayer: customLayerReducer,
  modal: modalReducer,
  timebar: timebarReducer,
  literals: literalsReducer,
  basemap: basemapReducer
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
