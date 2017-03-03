import {
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_LAYER_WORKSPACE_PRESENCE,
  SET_SEARCH_TERM,
  GA_SEARCH_RESULT_CLICKED,
  GA_VESSEL_POINT_CLICKED,
  GA_MAP_POINT_CLICKED,
  GA_PLAY_STATUS_TOGGLED,
  SET_INNER_TIMELINE_DATES,
  GA_OUTER_TIMELINE_DATES_UPDATED,
  SET_WORKSPACE_ID,
  SET_FLAG_FILTERS
} from 'actions';
import { FLAGS, SEARCH_QUERY_MINIMUM_LIMIT } from 'constants';

const GA_ACTION_WHITELIST = [
  {
    type: TOGGLE_LAYER_VISIBILITY,
    category: 'Layer',
    action: 'Toggle layer visibility',
    getPayload: (action, state) => {
      const layerIndex = state.layers.workspaceLayers.findIndex(l => l.id === action.payload.layerId);
      const changedLayer = state.layers.workspaceLayers[layerIndex];

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
    getPayload: action => (
      {
        layerId: action.payload.layerId,
        visibility: action.payload.added
      }
    )
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
    type: GA_OUTER_TIMELINE_DATES_UPDATED,
    category: 'Timeline',
    action: 'Outer period changed',
    getPayload: action => action.payload
  },
  {
    type: SET_INNER_TIMELINE_DATES,
    category: 'Timeline',
    action: 'Inner period changed',
    getPayload: (action, state) => {
      if (state.filters.timelinePaused === false) {
        return null;
      }
      return action.payload;
    }
  },
  {
    type: GA_PLAY_STATUS_TOGGLED,
    category: 'Timeline',
    action: 'Press Play',
    getPayload: (action, state) => {
      if (action.payload === false) { // pressed play
        return {
          play: true,
          timeStart: state.filters.timelineInnerExtent[0]
        };
      }
      return {
        play: false,
        timeEnd: state.filters.timelineInnerExtent[1]
      };
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
    getPayload: action => action.payload.flagFilters.map((flagFilter) => {
      if (flagFilter.flag) {
        return FLAGS[flagFilter.flag];
      }
      return 'ALL';
    })
  }
];

const googleAnalyticsMiddleware = store => next => (action) => {
  if (typeof window.ga !== 'undefined' && typeof action.type !== 'undefined') {
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
      if (gaEvent.eventLabel !== null && typeof gaEvent.eventLabel !== 'undefined') {
        window.ga('send', gaEvent);
      }
    }
  }

  return next(action);
};

export { googleAnalyticsMiddleware as default };
