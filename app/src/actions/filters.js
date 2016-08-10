import { UPDATE_FILTERS } from '../actions';

export function updateFilters(filters) {
  return {
    type: UPDATE_FILTERS,
    payload: filters
  };
}
