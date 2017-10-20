import { SET_FILTER_GROUP_MODAL_VISIBILITY, SAVE_FILTER_GROUP, SET_FILTER_GROUP_VISIBILITY } from 'filters/filtersActions';
import {
  CREATE_NEW_FILTER_GROUP,
  SET_EDIT_FILTER_GROUP_INDEX,
  DELETE_FILTER_GROUP,
  SET_FILTER_GROUPS,
  SET_CURRENT_FILTER_GROUP_ACTIVE_LAYER,
  SET_CURRENT_FILTER_GROUP_COLOR,
  SET_CURRENT_FILTER_GROUP_LABEL,
  SET_CURRENT_FILTER_VALUE
} from 'filters/filterGroupsActions';
import { COLORS } from 'config';

const initialState = {
  // the filters - structure matches how filters are visually presented
  filterGroups: [],
  // a list of filters organized by layers
  layerFilters: {},
  // the filter group currently edited in the modal
  currentlyEditedFilterGroup: null,
  // filterGroups' index of the filter group currently edited in the modal
  editFilterGroupIndex: null,
  // the color that is selected by default when opening a new filter group modal
  defaultColorIndex: 0,
  isFilterGroupModalOpen: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_NEW_FILTER_GROUP: {
      return Object.assign({}, state, {
        currentlyEditedFilterGroup: action.payload.newFilterGroup,
        editFilterGroupIndex: null,
        defaultColorIndex: (state.defaultColorIndex === Object.keys(COLORS).length - 1) ? 0 : state.defaultColorIndex + 1
      });
    }
    case SET_EDIT_FILTER_GROUP_INDEX: {
      const editFilterGroupIndex = action.payload;
      const currentlyEditedFilterGroup =
        (editFilterGroupIndex === null) ? null : Object.assign({}, state.filterGroups[editFilterGroupIndex]);
      return Object.assign({}, state, {
        editFilterGroupIndex,
        currentlyEditedFilterGroup
      });
    }
    case SET_FILTER_GROUP_MODAL_VISIBILITY: {
      return Object.assign({}, state, { isFilterGroupModalOpen: action.payload });
    }
    case SAVE_FILTER_GROUP: {
      const index = state.editFilterGroupIndex;
      let newFilterGroups;
      if (index !== null) {
        newFilterGroups = [...state.filterGroups.slice(0, index), action.payload.filterGroup, ...state.filterGroups.slice(index + 1)];
      } else {
        newFilterGroups = [...state.filterGroups, action.payload.filterGroup];
      }
      return Object.assign({}, state, { filterGroups: newFilterGroups });
    }
    case SET_FILTER_GROUP_VISIBILITY: {
      const { index, forceValue } = action.payload;
      const visible = forceValue !== null ? forceValue : !state.filterGroups[index].visible;
      const newFilterGroup = Object.assign({}, state.filterGroups[index], { visible });

      return Object.assign({}, state, {
        filterGroups: [...state.filterGroups.slice(0, index), newFilterGroup, ...state.filterGroups.slice(index + 1)]
      });

    }
    case DELETE_FILTER_GROUP: {
      if (action.payload >= state.filterGroups) {
        console.warn('trying to delete a filterGroup that does not exist');
        return state;
      }

      return Object.assign({}, state, {
        filterGroups: [...state.filterGroups.slice(0, action.payload), ...state.filterGroups.slice(action.payload + 1)]
      });

    }
    case SET_FILTER_GROUPS: {
      const { filters, layerFilters } = action.payload;
      return Object.assign({}, state, {
        filters, layerFilters
      });
    }
    case SET_CURRENT_FILTER_GROUP_ACTIVE_LAYER: {
      const currentlyEditedFilterGroup = Object.assign({}, state.currentlyEditedFilterGroup);
      currentlyEditedFilterGroup.checkedLayers[action.payload.layerId] = !currentlyEditedFilterGroup.checkedLayers[action.payload.layerId];
      return Object.assign({}, state, {
        currentlyEditedFilterGroup
      });
    }
    case SET_CURRENT_FILTER_GROUP_COLOR: {
      const currentlyEditedFilterGroup = Object.assign({}, state.currentlyEditedFilterGroup);
      currentlyEditedFilterGroup.color = action.payload.color;
      return Object.assign({}, state, {
        currentlyEditedFilterGroup
      });
    }
    case SET_CURRENT_FILTER_GROUP_LABEL: {
      const currentlyEditedFilterGroup = Object.assign({}, state.currentlyEditedFilterGroup);
      currentlyEditedFilterGroup.label = action.payload.label;
      return Object.assign({}, state, {
        currentlyEditedFilterGroup
      });
    }
    case SET_CURRENT_FILTER_VALUE: {
      const currentlyEditedFilterGroup = Object.assign({}, state.currentlyEditedFilterGroup);
      if (action.payload.value === '') {
        delete currentlyEditedFilterGroup.filterValues[action.payload.id];
      } else {
        currentlyEditedFilterGroup.filterValues[action.payload.id] = parseInt(action.payload.value, 10);
      }
      return Object.assign({}, state, {
        currentlyEditedFilterGroup
      });
    }
    default:
      return state;
  }
}
