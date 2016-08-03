import { UPDATE_FILTERS } from '../constants';

export function updateFilters(filters) {
  return {
    type: UPDATE_FILTERS,
    payload: filters
  };
}
