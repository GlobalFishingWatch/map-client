import reportReducer from 'app/report/reportReducer'
import basemapReducer from 'app/basemap/basemapReducer'
import layerLibraryReducer from 'app/layers/layersLibraryReducer'
import layersReducer from 'app/layers/layersReducer'
import userReducer from 'app/user/userReducer'
import filtersReducer from 'app/filters/filtersReducer'
import filterGroupsReducer from 'app/filters/filterGroupsReducer'
import supportFormReducer from 'app/siteNav/supportFormReducer'
import searchReducer from 'app/search/searchReducer'
import vesselInfoReducer from 'app/vesselInfo/vesselInfoReducer'
import fleetsReducer from 'app/fleets/fleetsReducer'
import encountersReducer from 'app/encounters/encountersReducer'
import customLayerReducer from 'app/layers/customLayerReducer'
import welcomeModalReducer from 'app/welcomeModal/welcomeModalReducer'
import timebarReducer from 'app/timebar/timebarReducer'
import literalsReducer from 'app/siteNav/literalsReducer'
import notificationsReducer from 'app/notifications/notificationsReducer'
import recentVesselsReducer from 'app/recentVessels/recentVesselsReducer'
import rightControlPanelReducer from 'app/mapPanels/rightControlPanel/rightControlPanelReducer'
import shareReducer from 'app/share/shareReducer'
import workspaceReducer from 'app/workspace/workspaceReducer'
import appReducer from 'app/app/appReducer'
import rulersReducer from 'app/rulers/rulersReducer'
import tracksReducer from 'app/tracks/tracksReducer'

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
  workspace: workspaceReducer,
  rulers: rulersReducer,
  tracks: tracksReducer,
}

export default reducers
