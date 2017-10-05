import { LAYER_TYPES } from 'constants';
import { COLOR_HUES } from 'config';
import { trackCreateFilterGroups } from 'analytics/analyticsActions';

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
 * @returns {array} [{hue, filterValues}, {hue, filterValues}, ...]
 */
const getLayerData = (heatmapLayer, filters) => {
  const layerGroupedFilters = [];
  filters
    .filter(f => f.visible === true)
    .filter(f => f.checkedLayers[heatmapLayer.id] === true)
    .forEach((filter) => {
      const layerGroupedFilter = {
        hue: COLOR_HUES[filter.color],
        filterValues: filter.filterValues
      };
      layerGroupedFilters.push(layerGroupedFilter);
    });
  return layerGroupedFilters;
};

/**
 * Sets filterGroups for the map
 *
 * Filters are grouped by layer
 * A sublayer is created for each layerFilters information
 * through GLContainer and HeatmapLayer
 * Then is filtered in the _dumpTileVessels method of HeatmapSublayer
 *
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
    filters.filter(f => Object.keys(f).length !== 0); // remove empty filters

    const layerFilters = {};
    heatmapLayers.forEach((heatmapLayer) => {
      layerFilters[heatmapLayer.id] = getLayerData(heatmapLayer, filters);
    });

    console.log(filters, layerFilters)

    dispatch({
      type: SET_FILTER_GROUPS,
      payload: {
        filters,
        layerFilters
        // TODO flattened layer filters for highlight layer
      }
    });
  };
}

export function saveFilterGroup(filterGroup, index = null) {
  return (dispatch, getState) => {
    // Send analytics only if new filter is created (index === null)
    if (index === null) {
      dispatch(trackCreateFilterGroups(filterGroup));
    }

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
