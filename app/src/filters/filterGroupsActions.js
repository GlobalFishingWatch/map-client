import { LAYER_TYPES } from 'constants';
import { GEAR_TYPE_ID, COLOR_HUES } from 'config';

export const SAVE_FILTER_GROUP = 'SAVE_FILTER_GROUP';
export const SET_FILTER_GROUP_MODAL_VISIBILITY = 'SET_FILTER_GROUP_MODAL_VISIBILITY';
export const SET_FILTER_GROUP_VISIBILITY = 'SET_FILTER_GROUP_VISIBILITY';
export const SET_EDIT_FILTER_GROUP_INDEX = 'SET_EDIT_FILTER_GROUP_INDEX';
export const DELETE_FILTER_GROUP = 'DELETE_FILTER_GROUP';
export const SET_FILTER_GROUPS = 'SET_FILTER_GROUPS';

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

/**
 * gets the information to create the sublayer for each layer and filter
 * @param {array} heatmapLayer
 * @param {array} filter
 * @returns {array} [{flag, hue, gearTypeId}, {flag, hue, gearTypeId}, ...]
 */
const getLayerData = (heatmapLayer, filters) => {
  const LayerGroupedFilters = [];
  let hue = heatmapLayer.hue;
  let flag = 'ALL';
  let gearTypeId = null;

  filters.forEach((filter) => {
    // Filter hue overrides heatmap layer hue
    // Filter flag overrides all flags ('ALL')
    const isLayerChecked = filter.checkedLayers !== undefined && filter.checkedLayers[heatmapLayer.id];
    if (isLayerChecked && filter.visible) {

      if (filter.filterValues !== undefined) {
        if (filter.filterValues.flag !== undefined) {
          const flagValue = filter.filterValues.flag;
          if (filter.color !== undefined) {
            hue = COLOR_HUES[filter.color];
          }
          if (flagValue !== '') flag = parseInt(flagValue, 10);
        }

        if (filter[GEAR_TYPE_ID] !== undefined) {
          gearTypeId = filter[GEAR_TYPE_ID];
        }
      }
      LayerGroupedFilters.push({ flag, hue, gearTypeId });
    }
  });

  // Set default sublayer if there are no filters
  if (LayerGroupedFilters.length === 0) {
    LayerGroupedFilters.push({ flag, hue, gearTypeId });
  }
  return LayerGroupedFilters;
};

/**
 * sets filterGroups for the map
 * @param {array} initialFilters - the original filters to process
 * @returns {array} filters - Filters to save in the store and workspace
 * @returns {array} layerFilters - Filters grouped by layer
 */

export function setFilterGroups(initialFilters) {
  return (dispatch, getState) => {
    // Get heatmap layers and organise filters to have one sublayer per heatmapLayer
    const heatmapLayers = getState().layers.workspaceLayers.filter(layer =>
      layer.type === LAYER_TYPES.Heatmap && layer.added === true
    );
    // slice(0) clones an array
    const filters = (initialFilters === undefined) ? [{}] : initialFilters.slice(0);

    const layerFilters = {};
    heatmapLayers.forEach((heatmapLayer) => {
      layerFilters[heatmapLayer.id] = getLayerData(heatmapLayer, filters);
    });

    dispatch({
      type: SET_FILTER_GROUPS,
      payload: {
        filters,
        layerFilters
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
    dispatch(setFilterGroups(getState().filterGroups.filterGroups));
  };
}

export function deleteFilterGroup(index) {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_FILTER_GROUP,
      payload: index
    });
    dispatch(setFilterGroups(getState().filterGroups.filterGroups));
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
    dispatch(setFilterGroups(getState().filterGroups.filterGroups));
  };
}

export function refreshFlagFiltersLayers() {
  return (dispatch, getState) => {
    dispatch(setFilterGroups(getState().filterGroups.filterGroups));
  };
}
