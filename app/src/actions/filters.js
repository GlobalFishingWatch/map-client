import {
  SET_FLAG_FILTERS,
  SET_INNER_TIMELINE_DATES,
  SET_OUTER_TIMELINE_DATES,
  SET_PLAYING_STATUS,
  SET_TIMELINE_HOVER_DATES,
  GA_PLAY_STATUS_TOGGLED,
  GA_OUTER_TIMELINE_DATES_UPDATED
} from 'actions';
import { LAYER_TYPES } from 'constants';
import _ from 'lodash';

const gaLogOuterTimelineDatesUpdated = _.debounce((dispatch, outerTimelineDates) => {
  dispatch({
    type: GA_OUTER_TIMELINE_DATES_UPDATED,
    payload: outerTimelineDates
  });
}, 1000);

export function setFlagFilters(flagFilters_) {
  return (dispatch, getState) => {
    // get heatmap layers and organise filters to have one sublayer per filter in each layer
    // if there's only one filter and it's not set, set it to ALL
    // for the next ones, ignore undefined filters
    // filter hue overrides heatmap layer hue when set
    const heatmapLayers = getState().layers.workspaceLayers.filter(layer => layer.type === LAYER_TYPES.ClusterAnimation);
    const flagFilters = (flagFilters_ === undefined) ? [] : flagFilters_.slice(0);
    const flagFiltersLayers = {};
    if (!flagFilters.length) {
      flagFilters.push({});
    }
    heatmapLayers.forEach((heatmapLayer) => {
      const subLayers = [];
      flagFilters.forEach((flagFilter, index) => {
        let flag = flagFilter.flag;
        if (flag === undefined) {
          if (index === 0) {
            flag = 'ALL';
          } else {
            return;
          }
        } else {
          flag = parseInt(flag, 10);
        }
        const hue = (flagFilter.hue !== undefined) ? flagFilter.hue : heatmapLayer.hue;
        subLayers.push({ flag, hue });
      });
      flagFiltersLayers[heatmapLayer.id] = subLayers;
    });
    dispatch({
      type: SET_FLAG_FILTERS,
      payload: {
        flagFilters,
        flagFiltersLayers
      }
    });
  };
}

export function updateFlagFilters() {
  return (dispatch, getState) => {
    dispatch(setFlagFilters(getState().filters.flags));
  };
}

export function setInnerTimelineDates(innerTimelineDates) {
  return {
    type: SET_INNER_TIMELINE_DATES,
    payload: innerTimelineDates
  };
}

export function setOuterTimelineDates(outerTimelineDates) {
  return (dispatch) => {
    gaLogOuterTimelineDatesUpdated(dispatch, outerTimelineDates);

    dispatch({
      type: SET_OUTER_TIMELINE_DATES,
      payload: outerTimelineDates
    });
  };
}

export function setPlayingStatus(paused) {
  return (dispatch, getState) => {
    const state = getState();

    if (paused !== state.filters.timelinePaused) {
      dispatch({
        type: GA_PLAY_STATUS_TOGGLED,
        payload: paused
      });
    }

    dispatch({
      type: SET_PLAYING_STATUS,
      payload: paused
    });
  };
}

export function setTimelineHoverDates(overDates) {
  return {
    type: SET_TIMELINE_HOVER_DATES,
    payload: overDates
  };
}
