import { connect } from 'react-redux';
import FilterGroupModal from 'filters/components/FilterGroupModal';
import { LAYER_TYPES, FLAG_FILTER_GROUP_VALUES } from 'constants';
import {
  saveFilterGroup,
  setFilterGroupModalVisibility
} from 'filters/filterGroupsActions';

const mapStateToProps = (state) => {
  const currentlyEditedFilterGroup = state.filterGroups.currentlyEditedFilterGroup;
  const filterValuesKeys = currentlyEditedFilterGroup && Object.keys(currentlyEditedFilterGroup.filterValues);

  // prepare layers list for component, add a filterActivated prop to set checkbox status
  const layers = state.layers.workspaceLayers.filter(elem => elem.type === LAYER_TYPES.Heatmap).map((l) => {
    l.filterActivated = currentlyEditedFilterGroup && currentlyEditedFilterGroup.checkedLayers[l.id] === true;
    return l;
  });

  // prepare filters: dedupe filters that have the same id, set default values
  const filteredLayers = layers.filter(l => l.filterActivated === true);
  const availableFilters = filteredLayers.map(l => l.header.filters);
  const flattenedFilters = [].concat(...availableFilters);
  const filtersById = {};
  // this will remove duplicates by filter.id (ie category / flag_id)
  flattenedFilters.forEach((f) => {
    filtersById[f.id] = f;
    if (f.useDefaultValues === true) {
      if (f.id === 'flag') {
        filtersById[f.id].values = FLAG_FILTER_GROUP_VALUES;
      }
    }
  });
  const filters = Object.values(filtersById);

  // prepare save button status: at least one layer must be checked, and at least one filter defined
  const anyLayerChecked = currentlyEditedFilterGroup && Object.keys(currentlyEditedFilterGroup.checkedLayers)
    .some(key => currentlyEditedFilterGroup.checkedLayers[key] === true);
  const anyFilterSelected = currentlyEditedFilterGroup && Object.keys(currentlyEditedFilterGroup.filterValues).length > 0;
  const disableSave = anyLayerChecked === false || anyFilterSelected === false;

  // prepare warnings, when a filter is applied to a layer that doesn't support it
  let warningFilterId;
  const warningLayer = filteredLayers.find((layer) => {
    const layerFiltersIds = layer.header.filters.map(f => f.id);
    return !filterValuesKeys.every((filterId) => {
      if (layerFiltersIds.indexOf(filterId) === -1) {
        warningFilterId = filterId;
        return false;
      }
      return true;
    });
  });

  let warning;
  if (warningLayer) {
    if (!state.literals.filter_groups_warning) {
      console.warn('filter_groups_warning is missing from your literals.json file.');
      warning = '';
    } else {
      warning = state.literals.filter_groups_warning
        .replace('$LAYER', warningLayer.title)
        .replace('$FILTER', filters.find(f => f.id === warningFilterId).label);
    }
  }

  // take all the displayed labels to set default filter group label
  const defaultLabel = (!filters.length) ? '' : filterValuesKeys.map((filterId) => {
    const currentFilterValues = currentlyEditedFilterGroup.filterValues[filterId];
    const filterValues = filters.find(filter => filter.id === filterId).values;
    const filterValueLabel = filterValues
      .filter(filterValue => currentFilterValues.indexOf(parseInt(filterValue.id, 10)) > -1)
      .map(f => f.label)
      .join(', ');
    return filterValueLabel;
  }).join(' ');

  return {
    disableSave,
    warning,
    layers,
    currentlyEditedFilterGroup,
    filters,
    label: currentlyEditedFilterGroup && currentlyEditedFilterGroup.label,
    defaultLabel,
    isNewFilter: state.filterGroups.editFilterGroupIndex === null
  };
};

const mapDispatchToProps = dispatch => ({
  onSaveClicked: () => {
    dispatch(setFilterGroupModalVisibility(false));
    dispatch(saveFilterGroup());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGroupModal);
