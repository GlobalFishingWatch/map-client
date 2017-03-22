import {
  ADD_CUSTOM_LAYER,
  GA_EXTERNAL_LINK_CLICKED,
  GA_MAP_POINT_CLICKED,
  GA_OUTER_TIMELINE_DATES_UPDATED,
  GA_PLAY_STATUS_TOGGLED,
  ADD_REPORT_POLYGON,
  DELETE_REPORT_POLYGON,
  GA_SEARCH_RESULT_CLICKED,
  GA_VESSEL_POINT_CLICKED,
  SET_FLAG_FILTERS,
  SET_INNER_TIMELINE_DATES,
  SET_SEARCH_TERM,
  SET_WORKSPACE_ID,
  SHOW_POLYGON,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_LAYER_WORKSPACE_PRESENCE,
  SET_REPORT_STATUS_SENT,
  GA_DISCARD_REPORT
} from 'actions';
import _ from 'lodash';
import { FLAGS, SEARCH_QUERY_MINIMUM_LIMIT } from 'constants';

const GA_ACTION_WHITELIST = [
  {
    type: TOGGLE_LAYER_VISIBILITY,
    category: 'Layer',
    action: (action, state) => {
      const layerIndex = state.layers.workspaceLayers.findIndex(l => l.id === action.payload.layerId);
      const changedLayer = state.layers.workspaceLayers[layerIndex];
      const isVisible = action.payload.forceStatus !== null ? action.payload.forceStatus : !changedLayer.visible;
      return isVisible ? 'Turn Layer On' : 'Turn Layer Off';
    },
    getPayload: action => action.payload.layerId
  },
  {
    type: TOGGLE_LAYER_WORKSPACE_PRESENCE,
    category: 'Layer',
    action: action => (action.payload.added ? 'Add from GFW Library' : 'Remove from GFW Library'),
    getPayload: action => action.payload.layerId
  },
  {
    type: ADD_CUSTOM_LAYER,
    category: 'Layer',
    action: 'Add user generated layer',
    getPayload: action => action.payload.layerId
  },
  {
    type: SET_SEARCH_TERM,
    category: 'Search',
    action: 'Search for vessel',
    getPayload: (action) => {
      if (action.payload.length >= SEARCH_QUERY_MINIMUM_LIMIT) {
        return action.payload;
      }
      return null;
    }
  },
  {
    type: GA_SEARCH_RESULT_CLICKED,
    category: 'Search',
    action: 'Search result selected',
    getPayload: action => action.payload.name
  },
  {
    type: GA_VESSEL_POINT_CLICKED,
    category: 'Map Interaction',
    action: 'Loaded a vessel data',
    getPayload: action => `${action.payload.name}:${action.payload.tilesetId}:${action.payload.seriesgroup}`
  },
  {
    type: GA_MAP_POINT_CLICKED,
    category: 'Map Interaction',
    action: 'Click a vessel point',
    getPayload: action => `${action.payload.lat}:${action.payload.long}:${action.payload.type}`
  },
  {
    type: GA_OUTER_TIMELINE_DATES_UPDATED,
    category: 'Timeline',
    action: 'Outer period changed',
    getPayload: action => `${action.payload[0].getTime()}:${action.payload[1].getTime()}`
  },
  {
    type: SET_INNER_TIMELINE_DATES,
    category: 'Timeline',
    action: 'Inner period changed',
    getPayload: (action, state) => {
      if (state.filters.timelinePaused === false) {
        return null;
      }
      return `${action.payload[0].getTime()}:${action.payload[1].getTime()}`;
    }
  },
  {
    type: GA_PLAY_STATUS_TOGGLED,
    category: 'Timeline',
    action: 'Press Play',
    getPayload: (action, state) => {
      if (action.payload === false) { // pressed play
        return `play:${state.filters.timelineInnerExtent[0].getTime()}`;
      }
      return `pause:${state.filters.timelineInnerExtent[1].getTime()}`;
    }
  },
  {
    type: SET_WORKSPACE_ID,
    category: 'Share',
    action: 'Share Link',
    getPayload: action => action.payload
  },
  {
    type: SET_FLAG_FILTERS,
    category: 'Settings',
    action: 'Filter by Country',
    getPayload: ({ payload }) => {
      const filters = payload.flagFilters.filter(flagFilter => typeof flagFilter.flag !== 'undefined');
      if (filters.length) {
        return filters.map((flagFilter) => {
          if (flagFilter.flag) return FLAGS[flagFilter.flag];
          return 'ALL';
        });
      }
      return null;
    }
  },
  {
    type: GA_EXTERNAL_LINK_CLICKED,
    category: 'External Link',
    action: 'Click to leave',
    getPayload: ({ payload }) => payload
  },
  {
    type: SHOW_POLYGON,
    category: 'Report Interaction',
    action: 'Click on polygon',
    getPayload: (action, state) => `${state.report.layerId}:${action.payload.polygonData.name}`
  },
  {
    type: ADD_REPORT_POLYGON,
    category: 'Report Interaction',
    action: 'Add polygon to report',
    getPayload: (action, state) => `${state.report.layerId}:${state.report.currentPolygon.name}`
  },
  {
    type: DELETE_REPORT_POLYGON,
    category: 'Report Interaction',
    action: 'Add polygon to report',
    getPayload: (action, state) => `${state.report.layerId}:${state.report.polygons[action.payload.polygonIndex].name}`
  },
  {
    type: GA_DISCARD_REPORT,
    category: 'Report Interaction',
    action: 'Discard report',
    getPayload: (action, state) => `${state.report.layerId}:${state.report.polygons.map(elem => elem.name).join(':')}`
  },
  {
    type: SET_REPORT_STATUS_SENT,
    category: 'Report Interaction',
    action: 'Report sent',
    getPayload: (action, state) => `${state.report.layerId}:${state.report.polygons.map(elem => elem.name).join(':')}`
  }
];

const googleAnalyticsMiddleware = store => next => (action) => {
  if (typeof window.ga !== 'undefined' && typeof action.type !== 'undefined') {
    const state = store.getState();
    const gaAction = GA_ACTION_WHITELIST.find(whitelistAction => action.type === whitelistAction.type);
    if (gaAction) {
      const gaEvent = {
        hitType: 'event',
        eventCategory: gaAction.category
      };
      if (_.isFunction(gaAction.action)) {
        gaEvent.eventAction = gaAction.action(action, state);
      } else {
        gaEvent.eventAction = gaAction.action;
      }
      if (gaAction.getPayload) {
        gaEvent.eventLabel = gaAction.getPayload(action, state);
      }
      if (gaEvent.eventLabel !== null && typeof gaEvent.eventLabel !== 'undefined') {
        window.ga('send', gaEvent);
      }
    }
  }

  return next(action);
};

export { googleAnalyticsMiddleware as default };
