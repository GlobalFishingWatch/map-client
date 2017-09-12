import { LAYER_TYPES } from 'constants';
import { COLOR_HUES } from 'config';

export const SAVE_FILTER_GROUP = 'SAVE_FILTER_GROUP';
export const SET_FILTER_GROUP_MODAL_VISIBILITY = 'SET_FILTER_GROUP_MODAL_VISIBILITY';
export const SET_FILTER_GROUP_VISIBILITY = 'SET_FILTER_GROUP_VISIBILITY';
export const SET_EDIT_FILTER_GROUP_INDEX = 'SET_EDIT_FILTER_GROUP_INDEX';
export const DELETE_FILTER_GROUP = 'DELETE_FILTER_GROUP';
export const SET_FLAG_FILTERS = 'SET_FLAG_FILTERS';

export function setEditFilterGroupIndex(editFilterGroupIndex) {
  return {
    type: SET_EDIT_FILTER_GROUP_INDEX,
    payload: editFilterGroupIndex
  };
}

export function setFilterGroupModalVisibility(visibility) {
  return {
    type: SET_FILTER_GROUP_MODAL_VISIBILITY,
    payload: visibility
  };
}

const getSublayer = (heatmapLayer, filter) => {
  // Filter hue overrides heatmap layer hue and filter flag overrides all flags ('ALL') when set
  const isLayerChecked = filter.checkedLayers !== undefined && filter.checkedLayers[heatmapLayer.id];
  let hue = heatmapLayer.hue;
  let flag = 'ALL';

  if (filter.filterValues !== undefined && filter.visible) {
    Object.keys(filter.filterValues).forEach((filterValue) => {
      if (filterValue === 'flag' && isLayerChecked) {
        const flagValue = filter.filterValues.flag;
        if (filter.color !== undefined) {
          hue = COLOR_HUES[filter.color];
        }
        if (flagValue !== '') {
          flag = parseInt(flagValue, 10);
        }
      }
    });
  }
  return [{ flag, hue }];
};

export function setFlagFilters(filters_) {
  return (dispatch, getState) => {
    // Get heatmap layers and organise filters to have one sublayer per filter in each layer
    const flagFiltersLayers = {};
    const heatmapLayers = getState().layers.workspaceLayers.filter(layer =>
      layer.type === LAYER_TYPES.Heatmap && layer.added === true
    );
    // slice(0) clones an array
    const filters = (filters_ === undefined) ? [{}] : filters_.slice(0);
    if (filters.length === 0) { filters.push({}); }

    heatmapLayers.forEach((heatmapLayer) => {
      filters.forEach((filter) => {
        flagFiltersLayers[heatmapLayer.id] = getSublayer(heatmapLayer, filter);
      });
    });

    dispatch({
      type: SET_FLAG_FILTERS,
      payload: {
        flagFilters: filters,
        flagFiltersLayers
      }
    });
  };
}

export function saveFilterGroup(filterGroup, index = null) {
  return (dispatch, getState) => {
    dispatch({
      type: SAVE_FILTER_GROUP,
      payload: {
        filterGroup,
        index
      }
    });
    dispatch(setFlagFilters(getState().filterGroups.filterGroups));
  };
}

export function deleteFilterGroup(index) {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_FILTER_GROUP,
      payload: index
    });
    dispatch(setFlagFilters(getState().filterGroups.filterGroups));
  };
}

export function toggleFilterGroupVisibility(index, forceValue = null) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_FILTER_GROUP_VISIBILITY,
      payload: {
        index,
        forceValue
      }
    });
    dispatch(setFlagFilters(getState().filterGroups.filterGroups));
  };
}

export function refreshFlagFiltersLayers() {
  return (dispatch, getState) => {
    dispatch(setFlagFilters(getState().filterGroups.filterGroups));
  };
}
