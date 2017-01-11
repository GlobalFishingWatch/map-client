import {
  SET_FLAG_FILTERS,
  SET_INNER_TIMELINE_DATES,
  SET_OUTER_TIMELINE_DATES,
  SET_PLAYING_STATUS,
  SET_TIMELINE_OVER_DATES
} from 'actions';
import { LAYER_TYPES } from 'constants';

export function setFlagFilters(flagFilters_) {
  return (dispatch, getState) => {
    // get heatmap layers and organise filters to have one sublayer per filter in each layer
    // if there's only one filter and it's not set, set it to ALL
    // for the next ones, ignore undefined filters
    // filter hue overrides heatmap layer hue when set
    const heatmapLayers = getState().layers.filter(layer => layer.type === LAYER_TYPES.ClusterAnimation);
    const flagFilters = (flagFilters_ === undefined) ? [] : flagFilters_.slice(0);
    const flagFiltersLayers = {};
    if (!flagFilters.length) {
      flagFilters.push({});
    }
    heatmapLayers.forEach(heatmapLayer => {
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
  return {
    type: SET_OUTER_TIMELINE_DATES,
    payload: outerTimelineDates
  };
}

export function setPlayingStatus(paused) {
  return {
    type: SET_PLAYING_STATUS,
    payload: paused
  };
}

export function setTimelineOverDates(overDates) {
  return {
    type: SET_TIMELINE_OVER_DATES,
    payload: overDates
  };
}
