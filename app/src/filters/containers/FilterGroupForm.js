import { connect } from 'react-redux';
import FilterGroupForm from 'filters/components/FilterGroupForm';
import { setFilterGroupModalVisibility, saveFilterGroup, setEditFilterGroupIndex } from 'filters/filterGroupsActions';
import { LAYER_TYPES } from 'constants';
import { setLayerInfoModal } from 'actions/map';

const mapStateToProps = (state) => {
  const editFilterGroupIndex = state.filterGroups.editFilterGroupIndex;
  return {
    layers: state.layers.workspaceLayers.filter(elem => elem.type === LAYER_TYPES.Heatmap),
    filterGroup: editFilterGroupIndex !== null ? state.filterGroups.filterGroups[editFilterGroupIndex] : {},
    editFilterGroupIndex,
    defaultColorIndex: state.filterGroups.defaultColorIndex
  };
};

const mapDispatchToProps = dispatch => ({
  saveFilterGroup: (filterGroup, index) => {
    dispatch(setFilterGroupModalVisibility(false));
    dispatch(saveFilterGroup(filterGroup, index));
    dispatch(setEditFilterGroupIndex(null));
  },
  openLayerInfoModal: (modalParams) => {
    dispatch(setLayerInfoModal(modalParams));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGroupForm);
