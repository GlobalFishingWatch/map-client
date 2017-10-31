import { connect } from 'react-redux';
import FilterGroupForm from 'filters/components/FilterGroupForm';
import {
  setCurrentFilterGroupActiveLayer,
  setCurrentFilterGroupColor,
  setCurrentFilterValue,
  setCurrentFilterGroupLabel,
  saveFilterGroup,
  setFilterGroupModalVisibility
} from 'filters/filterGroupsActions';
import { setLayerInfoModal } from 'actions/map';
import { LAYER_TYPES, FLAG_FILTER_GROUP_VALUES } from 'constants';

const mapStateToProps = (state) => {
  const currentlyEditedFilterGroup = state.filterGroups.currentlyEditedFilterGroup;
  const filterValuesKeys = Object.keys(currentlyEditedFilterGroup.filterValues);

  // prepare layers list for component, add a filterActivated prop to set checkbox status
  const layers = state.layers.workspaceLayers.filter(elem => elem.type === LAYER_TYPES.Heatmap).map((l) => {
    l.filterActivated = currentlyEditedFilterGroup.checkedLayers[l.id] === true;
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
  // const label = (defaultName === currentlyEditedFilterGroup.label || ) ? defaultName : currentlyEditedFilterGroup.label;

  // prepare save button status: at least one layer must be checked, and at least one filter defined
  const anyLayerChecked = Object.keys(currentlyEditedFilterGroup.checkedLayers)
    .some(key => currentlyEditedFilterGroup.checkedLayers[key] === true);
  const anyFilterSelected = Object.keys(currentlyEditedFilterGroup.filterValues).length > 0;
  const disableSave = anyLayerChecked === false || anyFilterSelected === false;

  return {
    layers,
    currentlyEditedFilterGroup,
    filters,
    label: currentlyEditedFilterGroup.label,
    defaultLabel,
    disableSave
  };
};

const mapDispatchToProps = dispatch => ({
  onLayerChecked: (layerId) => {
    dispatch(setCurrentFilterGroupActiveLayer(layerId));
  },
  onColorChanged: (color) => {
    dispatch(setCurrentFilterGroupColor(color));
  },
  onLabelChanged: (label) => {
    dispatch(setCurrentFilterGroupLabel(label));
  },
  onFilterValueChanged: (id, values) => {
    dispatch(setCurrentFilterValue(id, values));
  },
  onSaveClicked: () => {
    dispatch(setFilterGroupModalVisibility(false));
    dispatch(saveFilterGroup());
  },
  openLayerInfoModal: (modalParams) => {
    dispatch(setLayerInfoModal(modalParams));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGroupForm);
