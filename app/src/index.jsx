import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Promise from 'promise-polyfill';
import 'styles/global.scss';
import reportReducer from 'reducers/report';
import heatmapReducer from 'reducers/heatmap';
import layerLibraryReducer from 'reducers/layersLibrary';
import layersReducer from 'reducers/layers';
import mapReducer from 'reducers/map';
import analyticsMiddleware from 'middleware/analytics';
import userReducer from 'reducers/user';
import filtersReducer from 'reducers/filters';
import contactReducer from 'reducers/contact';
import searchReducer from 'reducers/search';
import vesselInfoReducer from 'reducers/vesselInfo';
import customLayerReducer from 'reducers/customLayer';
import modalReducer from 'reducers/modal';
import timebarReducer from 'reducers/timebar';
import AppContainer from 'containers/App';
import AuthMapContainer from 'containers/AuthMap';
import ReactGA from 'react-ga';

ReactGA.initialize(GA_TRACKING_CODE);

// Polyfill for older browsers (IE11 for example)
window.Promise = window.Promise || Promise;
/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
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
  timebar: timebarReducer
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
    <AppContainer>
      <AuthMapContainer />
    </AppContainer>
  </Provider>,
  document.getElementById('app')
);
