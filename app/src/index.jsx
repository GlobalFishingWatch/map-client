import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
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
import recentVesselsReducer from 'recentVessels/recentVesselsReducer';
import rightControlPanelReducer from 'mapPanels/rightControlPanel/rightControlPanelReducer';
import shareReducer from 'share/shareReducer';
import workspaceReducer from 'workspace/workspaceReducer';
import AppContainer from 'containers/App';
import AuthMapContainer from 'containers/AuthMap';
import { init } from './app/appActions';
import appReducer from './app/appReducer';

import MapDashboard from 'map/containers/MapDashboard';
// TODO MAP MODULE Move to Map Module
import mapModuleReducer from './_map/module/module.reducer';
import mapTracksReducer from './_map/tracks/tracks.reducer';
import mapHeatmapReducer from './_map/heatmap/heatmap.reducer';
import mapHeatmapTilesReducer from './_map/heatmap/heatmapTiles.reducer';
import mapViewportReducer from './_map/glmap/viewport.reducer';
import mapStyleReducer from './_map/glmap/style.reducer';
import mapInteractionReducer from './_map/glmap/interaction.reducer';


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

const mapReducer = combineReducers({
  module: mapModuleReducer,
  tracks: mapTracksReducer,
  heatmap: mapHeatmapReducer,
  heatmapTiles: mapHeatmapTilesReducer,
  style: mapStyleReducer,
  viewport: mapViewportReducer,
  interaction: mapInteractionReducer
});


const store = createStore(
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
        <MapDashboard />
      </AuthMapContainer>
    </AppContainer>
  </Provider>,
  document.getElementById('app')
);

store.dispatch(init());

export default store;
