import React from 'react';
import { render } from 'react-dom';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Promise from 'promise-polyfill';
import 'styles/global.scss';

import reportReducer from 'report/reportReducer';
import basemapReducer from 'basemap/basemapReducer';
import layerLibraryReducer from 'layers/layersLibraryReducer';
import layersReducer from 'layers/layersReducer';
import analyticsMiddleware from 'analytics/analyticsMiddleware';
import userReducer from 'user/userReducer';
import filtersReducer from 'filters/filtersReducer';
import filterGroupsReducer from 'filters/filterGroupsReducer';
import supportFormReducer from 'siteNav/supportFormReducer';
import searchReducer from 'search/searchReducer';
import vesselInfoReducer from 'vesselInfo/vesselInfoReducer';
import fleetsReducer from 'fleets/fleetsReducer';
import encountersReducer from 'encounters/encountersReducer';
import customLayerReducer from 'layers/customLayerReducer';
import welcomeModalReducer from 'welcomeModal/welcomeModalReducer';
import timebarReducer from 'timebar/timebarReducer';
import literalsReducer from 'siteNav/literalsReducer';
import notificationsReducer from 'src/notifications/notificationsReducer';
import recentVesselsReducer from 'recentVessels/recentVesselsReducer';
import rightControlPanelReducer from 'mapPanels/rightControlPanel/rightControlPanelReducer';
import shareReducer from 'share/shareReducer';
import workspaceReducer from 'workspace/workspaceReducer';
import AppContainer from 'containers/App';
import AuthMapContainer from 'containers/AuthMap';
import { init } from './app/appActions';
import appReducer from './app/appReducer';

const { NODE_ENV } = process.env;

// Polyfill for older browsers (IE11 for example)
window.Promise = window.Promise || Promise;

const reducers = {
  supportForm: supportFormReducer,
  customLayer: customLayerReducer,
  filters: filtersReducer,
  filterGroups: filterGroupsReducer,
  layerLibrary: layerLibraryReducer,
  layers: layersReducer,
  literals: literalsReducer,
  notifications: notificationsReducer,
  basemap: basemapReducer,
  welcomeModal: welcomeModalReducer,
  recentVessels: recentVesselsReducer,
  rightControlPanel: rightControlPanelReducer,
  report: reportReducer,
  search: searchReducer,
  share: shareReducer,
  timebar: timebarReducer,
  user: userReducer,
  vesselInfo: vesselInfoReducer,
  fleets: fleetsReducer,
  encounters: encountersReducer,
  app: appReducer,
  workspace: workspaceReducer
};

/**
 * Global state
 * @info(http://redux.js.org/docs/basics/Store.html)
 * @type {Object}
 */
const composeEnhancers =
  NODE_ENV === 'development' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      stateSanitizer: state => ({ ...state, tracks: 'NOT_SERIALIZED', heatmap: 'NOT_SERIALIZED' })
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(analyticsMiddleware, thunk)
);
const store = createStore(combineReducers(reducers), enhancer);

render(
  <Provider store={store} >
    <AppContainer>
      <AuthMapContainer />
    </AppContainer>
  </Provider>,
  document.getElementById('app')
);

store.dispatch(init());

export default store;
