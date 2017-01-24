import {
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_LAYER_WORKSPACE_PRESENCE,
  SET_SEARCH_TERM,
  GA_SEARCH_RESULT_CLICKED,
  GA_VESSEL_POINT_CLICKED,
  GA_MAP_POINT_CLICKED,
  SET_OUTER_TIMELINE_DATES
} from 'actions';
import _ from 'lodash';
import { SEARCH_QUERY_MINIMUM_LIMIT } from 'constants';
import ga from 'ga-react-router';

const GA_ACTION_WHITELIST = [
  {
    type: TOGGLE_LAYER_VISIBILITY,
    category: 'Layer',
    action: 'Toggle layer visibility',
    getPayload: (action, state) => {
      const layerIndex = state.layers.findIndex(l => l.id === action.payload.layerId);
      const changedLayer = state.layers[layerIndex];

      return {
        layerId: action.payload.layerId,
        visibility: action.payload.forceStatus !== null ? action.payload.forceStatus : !changedLayer.visible
      };
    }
  },
  {
    type: TOGGLE_LAYER_WORKSPACE_PRESENCE,
    category: 'Layer',
    action: 'Add from GFW Library',
    getPayload: (action, state) => {
      const layerIndex = state.layers.findIndex(l => l.id === action.payload.layerId);
      const changedLayer = state.layers[layerIndex];

      return {
        layerId: action.payload.layerId,
        visibility: action.payload.forceStatus !== null ? action.payload.forceStatus : !changedLayer.added
      };
    }
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
    getPayload: action => action.payload
  },
  {
    type: GA_VESSEL_POINT_CLICKED,
    category: 'Map Interaction',
    action: 'Loaded a vessel data',
    getPayload: action => action.payload
  },
  {
    type: GA_MAP_POINT_CLICKED,
    category: 'Map Interaction',
    action: 'Click a vessel point',
    getPayload: action => action.payload
  },
  {
    type: SET_OUTER_TIMELINE_DATES,
    category: 'Timeline',
    action: 'Period being observed',
    getPayload: _.debounce(action => action.payload, 1000)
  }
];

const googleAnalyticsMiddleware = store => next => (action) => {
  if (typeof ga !== 'undefined' && typeof action.type !== 'undefined') {
    const state = store.getState();
    const gaAction = GA_ACTION_WHITELIST.find(whitelistAction => action.type === whitelistAction.type);
    if (gaAction) {
      const gaEvent = {
        hitType: 'event',
        eventCategory: gaAction.category,
        eventAction: gaAction.action
      };
      if (gaAction.getPayload) {
        gaEvent.eventLabel = gaAction.getPayload(action, state);
      }
      if (gaEvent.eventLabel !== null) {
        // console.log(action.type);
        // console.log(gaEvent.eventLabel);
        ga('send', gaEvent);
      }
    }
  }

  return next(action);
};

export { googleAnalyticsMiddleware as default };
