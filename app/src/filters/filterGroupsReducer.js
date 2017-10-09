import { SET_FILTER_GROUP_MODAL_VISIBILITY, SAVE_FILTER_GROUP, SET_FILTER_GROUP_VISIBILITY } from 'filters/filtersActions';
import { SET_EDIT_FILTER_GROUP_INDEX, DELETE_FILTER_GROUP, SET_FILTER_GROUPS, SET_DEFAULT_COLOR } from 'filters/filterGroupsActions';
import { COLORS } from 'config';

const initialState = {
  filterGroups: [],
  editFilterGroupIndex: null,
  isFilterGroupModalOpen: false,
  // the color that is selected by default when opening a new filter group modal
  defaultColorIndex: 0
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_EDIT_FILTER_GROUP_INDEX: {
      return Object.assign({}, state, { editFilterGroupIndex: action.payload });
    }
    case SET_FILTER_GROUP_MODAL_VISIBILITY: {
      return Object.assign({}, state, { isFilterGroupModalOpen: action.payload });
    }
    case SAVE_FILTER_GROUP: {
      const index = action.payload.index;
      let newFilterGroup;
      if (index !== null) {
        newFilterGroup = [...state.filterGroups.slice(0, index), action.payload.filterGroup, ...state.filterGroups.slice(index + 1)];
      } else {
        newFilterGroup = [...state.filterGroups, action.payload.filterGroup];
      }
      return Object.assign({}, state, { filterGroups: newFilterGroup });
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
    case SET_DEFAULT_COLOR: {
      return Object.assign({}, state, {
        defaultColorIndex: (state.defaultColorIndex === Object.keys(COLORS).length - 1) ? 0 : state.defaultColorIndex + 1
      });
    }
    default:
      return state;
  }
}
