import { LAYER_TYPES } from 'constants';
import { PALETTE_COLORS_LAYERS } from 'config';
import { trackCreateFilterGroups } from 'analytics/analyticsActions';

export const CREATE_NEW_FILTER_GROUP = 'CREATE_NEW_FILTER_GROUP';
export const SAVE_FILTER_GROUP = 'SAVE_FILTER_GROUP';
export const SET_FILTER_GROUP_MODAL_VISIBILITY = 'SET_FILTER_GROUP_MODAL_VISIBILITY';
export const SET_FILTER_GROUP_VISIBILITY = 'SET_FILTER_GROUP_VISIBILITY';
export const SET_EDIT_FILTER_GROUP_INDEX = 'SET_EDIT_FILTER_GROUP_INDEX';
export const DELETE_FILTER_GROUP = 'DELETE_FILTER_GROUP';
export const SET_FILTER_GROUPS = 'SET_FILTER_GROUPS';
export const SET_CURRENT_FILTER_GROUP_ACTIVE_LAYER = 'SET_CURRENT_FILTER_GROUP_ACTIVE_LAYER';
export const SET_CURRENT_FILTER_GROUP_HUE = 'SET_CURRENT_FILTER_GROUP_HUE';
export const SET_CURRENT_FILTER_GROUP_LABEL = 'SET_CURRENT_FILTER_GROUP_LABEL';
export const SET_CURRENT_FILTER_VALUE = 'SET_CURRENT_FILTER_VALUE';

export function createNewFilterGroup() {
  return (dispatch, getState) => {
    const checkedLayers = {};
    getState().layers.workspaceLayers.filter(elem => elem.type === LAYER_TYPES.Heatmap).map(l => l.id).forEach((lid) => {
      checkedLayers[lid] = false;
    });

    const hue = PALETTE_COLORS_LAYERS[getState().filterGroups.defaultColorIndex].hue;

    const newFilterGroup = {
      checkedLayers,
      hue,
      filterValues: {},
      visible: true,
      label: ''
    };

    dispatch({
      type: CREATE_NEW_FILTER_GROUP,
      payload: {
        newFilterGroup
      }
    });
  };
}

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
    .forEach((filterGroup) => {
      const filterValues = {};
      Object.keys(filterGroup.filterValues).forEach((filterValueKey) => {
        // set actual field name usable on layer, from filter id (ie id:flag --> filterValue:category or filterValue:flag_id)
        if (heatmapLayer.header.filters === undefined) {
          return;
        }
        const originalLayerHeaderFilter = heatmapLayer.header.filters.find(layerHeaderFilter => layerHeaderFilter.id === filterValueKey);
        // check if filter is supported in layer header
        if (originalLayerHeaderFilter !== undefined) {
          const fieldName = originalLayerHeaderFilter.field;
          filterValues[fieldName] = filterGroup.filterValues[filterValueKey];
        }
      });
      const layerGroupedFilter = {
        hue: filterGroup.hue,
        filterValues,
        // 'pass' is set to true when none of the filters fields in the filter group is supported by
        // the layer headers.
        // This avoids having to filter every point of a completely filtered out layer.
        // See HeatmapLayer.render and heatmapTileData.vesselSatisfiesAllFilters
        pass: Object.keys(filterValues).length === 0
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
 */

export function setLayerFilters() {
  return (dispatch, getState) => {
    // Get heatmap layers and organise filters to have one sublayer per heatmapLayer
    const heatmapLayers = getState().layers.workspaceLayers.filter(layer =>
      layer.type === LAYER_TYPES.Heatmap && layer.added === true
    );
    const filters = getState().filterGroups.filterGroups;

    const layerFilters = {};
    heatmapLayers.forEach((heatmapLayer) => {
      layerFilters[heatmapLayer.id] = getLayerData(heatmapLayer, filters);
    });

    dispatch({
      type: SET_FILTER_GROUPS,
      payload: {
        layerFilters
      }
    });
  };
}

export function saveFilterGroup(filterGroup = null) {
  return (dispatch, getState) => {
    // if filterGroup is not set, use the currently edited one
    const newFilterGroup = filterGroup || Object.assign({}, getState().filterGroups.currentlyEditedFilterGroup);

    // Send analytics only if new filter is created (index === null)
    if (getState().filterGroups.editFilterGroupIndex === null) {
      dispatch(trackCreateFilterGroups(newFilterGroup));
    }

    dispatch({
      type: SAVE_FILTER_GROUP,
      payload: {
        filterGroup: newFilterGroup
      }
    });
    dispatch(setLayerFilters());
  };
}

export function deleteFilterGroup(index) {
  return (dispatch) => {
    dispatch({
      type: DELETE_FILTER_GROUP,
      payload: index
    });
    dispatch(setLayerFilters());
  };
}

export function toggleFilterGroupVisibility(index, forceValue = null) {
  return (dispatch) => {
    dispatch({
      type: SET_FILTER_GROUP_VISIBILITY,
      payload: {
        index,
        forceValue
      }
    });
    dispatch(setLayerFilters());
  };
}

export function refreshFlagFiltersLayers() {
  return (dispatch) => {
    dispatch(setLayerFilters());
  };
}

export function setCurrentFilterGroupActiveLayer(layerId) {
  return {
    type: SET_CURRENT_FILTER_GROUP_ACTIVE_LAYER,
    payload: { layerId }
  };
}

export function setCurrentFilterGroupHue(hue) {
  return {
    type: SET_CURRENT_FILTER_GROUP_HUE,
    payload: { hue }
  };
}

export function setCurrentFilterGroupLabel(label) {
  return {
    type: SET_CURRENT_FILTER_GROUP_LABEL,
    payload: { label }
  };
}

export function setCurrentFilterValue(id, values) {
  return {
    type: SET_CURRENT_FILTER_VALUE,
    payload: { id, values }
  };
}
