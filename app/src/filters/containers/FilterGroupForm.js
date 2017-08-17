import { connect } from 'react-redux';
import FilterGroupForm from 'filters/components/FilterGroupForm';
import { setFilterGroupModalVisibility, createFilterGroup } from 'filters/filtersActions';
import { LAYER_TYPES } from 'constants';


const mapStateToProps = state => ({
  layers: state.layers.workspaceLayers.filter(elem => elem.type === LAYER_TYPES.Heatmap)
});

const mapDispatchToProps = dispatch => ({
  createFilterGroup: () => {
    dispatch(setFilterGroupModalVisibility(false));
    dispatch(createFilterGroup({
      label: 'foo',
      visible: true,
      color: 'FBFF8B'
    }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGroupForm);
