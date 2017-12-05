import { connect } from 'react-redux';
import FilterGroupForm from 'filters/components/FilterGroupForm';
import {
  setCurrentFilterGroupActiveLayer,
  setCurrentFilterGroupColor,
  setCurrentFilterValue,
  setCurrentFilterGroupLabel
} from 'filters/filterGroupsActions';
import { setLayerInfoModal } from 'actions/map';

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
  openLayerInfoModal: (modalParams) => {
    dispatch(setLayerInfoModal(modalParams));
  }
});

export default connect(null, mapDispatchToProps)(FilterGroupForm);
