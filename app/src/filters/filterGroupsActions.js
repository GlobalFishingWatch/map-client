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

export function toggleFilterGroupVisibility(index, forceValue = null) {
  return {
    type: SET_FILTER_GROUP_VISIBILITY,
    payload: {
      index,
      forceValue
    }
  };
}

export function saveFilterGroup(filterGroup, index = null) {
  return {
    type: SAVE_FILTER_GROUP,
    payload: {
      filterGroup,
      index
    }
  };
}

export function deleteFilterGroup(index) {
  return {
    type: DELETE_FILTER_GROUP,
    payload: index
  };
}

export function setFlagFilters(filters_) {
  return (dispatch, getState) => {
    // get heatmap layers and organise filters to have one sublayer per filter in each layer
    // if there's only one filter and it's not set, set it to ALL
    // for the next ones, ignore undefined filters
    // filter hue overrides heatmap layer hue when set
    const heatmapLayers = getState().layers.workspaceLayers.filter(layer =>
      layer.type === LAYER_TYPES.Heatmap && layer.added === true
    );
    const filters = (filters_ === undefined) ? [] : filters_.slice(0);
    // filters = filters.filter(filter => filter.filterValues.flag !== undefined);
    const flagFiltersLayers = {};
    if (!filters.length) {
      filters.push({});
    }


    heatmapLayers.forEach((heatmapLayer) => {
      filters.forEach((filter) => {
        const layerIsChecked = filter.checkedLayers !== undefined && filter.checkedLayers[heatmapLayer.id];
        let hue = heatmapLayer.hue;
        let flag = 'ALL';

        if (filter.filterValues !== undefined) {
          Object.keys(filter.filterValues).forEach((filterValue) => {
            if (filterValue === 'flag') {
              const flagValue = filter.filterValues.flag;
              if (layerIsChecked) {
                if (filter.color !== undefined) {
                  hue = COLOR_HUES[filter.color];
                }
                if (flagValue !== '') {
                  flag = parseInt(flagValue, 10);
                }
              }
            }
          });
        }

        const subLayer = [{ flag, hue }];
        flagFiltersLayers[heatmapLayer.id] = subLayer;
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

export function refreshFlagFiltersLayers() {
  return (dispatch, getState) => {
    dispatch(setFlagFilters(getState().filters.flags));
  };
}
