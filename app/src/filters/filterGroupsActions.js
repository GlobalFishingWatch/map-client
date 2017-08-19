export const SAVE_FILTER_GROUP = 'SAVE_FILTER_GROUP';
export const SET_FILTER_GROUP_MODAL_VISIBILITY = 'SET_FILTER_GROUP_MODAL_VISIBILITY';
export const SET_FILTER_GROUP_VISIBILITY = 'SET_FILTER_GROUP_VISIBILITY';
export const SET_EDIT_FILTER_GROUP_INDEX = 'SET_EDIT_FILTER_GROUP_INDEX';
export const DELETE_FILTER_GROUP = 'DELETE_FILTER_GROUP';

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
