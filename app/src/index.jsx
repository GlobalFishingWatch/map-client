import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Promise from 'promise-polyfill';
import 'styles/global.scss';

import reportReducer from 'report/reportReducer';
import mapViewportReducer from 'map/mapViewportReducer';
import mapStyleReducer from 'map/mapStyleReducer';
import mapInteractionReducer from 'map/mapInteractionReducer';
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
import recentVesselsReducer from 'recentVessels/recentVesselsReducer';
import rightControlPanelReducer from 'mapPanels/rightControlPanel/rightControlPanelReducer';
import shareReducer from 'share/shareReducer';
import workspaceReducer from 'workspace/workspaceReducer';
import AppContainer from 'containers/App';
import AuthMapContainer from 'containers/AuthMap';
import { init } from './app/appActions';
import appReducer from './app/appReducer';


// TODO Remove when Map broke free from main store 
import MapDashboard from 'map/containers/MapDashboard';
// TODO Move to Map Module
import testReducer from './_map/mapTestReducer';
import mapTracksReducer from './_map/tracks/tracks.reducer';
import heatmapReducer from './_map/heatmap/heatmap.reducer';
import heatmapTilesReducer from './_map/heatmap/heatmapTiles.reducer';


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
  mapViewport: mapViewportReducer,
  mapStyle: mapStyleReducer,
  mapInteraction: mapInteractionReducer,
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

// const reducer = combineReducers(reducers);


const mapReducer = combineReducers({
  test: testReducer,
  tracks: mapTracksReducer,
  heatmap: heatmapReducer,
  heatmapTiles: heatmapTilesReducer
});


const store = createStore(
  // reducer,
  combineReducers({
    map: mapReducer,
    ...reducers
  }),
  applyMiddleware(analyticsMiddleware, thunk)
);

render(
  <Provider store={store} >
    <AppContainer>
      <AuthMapContainer>
        <MapDashboard>
          {/* <MapModule store={store} /> */}
        </MapDashboard>
      </AuthMapContainer>
    </AppContainer>
  </Provider>,
  document.getElementById('app')
);

store.dispatch(init());

export default store;
