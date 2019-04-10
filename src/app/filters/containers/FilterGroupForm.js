import { connect } from 'react-redux'
import FilterGroupForm from 'app/filters/components/FilterGroupForm'
import {
  setCurrentFilterGroupActiveLayer,
  setCurrentFilterGroupHue,
  setCurrentFilterValue,
  setCurrentFilterGroupLabel,
} from 'app/filters/filterGroupsActions'
import { setLayerInfoModal } from 'app/app/appActions'

const mapDispatchToProps = (dispatch) => ({
  onLayerChecked: (layerId) => {
    dispatch(setCurrentFilterGroupActiveLayer(layerId))
  },
  onHueChange: (color, hue) => {
    dispatch(setCurrentFilterGroupHue(hue))
  },
  onLabelChanged: (label) => {
    dispatch(setCurrentFilterGroupLabel(label))
  },
  onFilterValueChanged: (id, values) => {
    dispatch(setCurrentFilterValue(id, values))
  },
  openLayerInfoModal: (modalParams) => {
    dispatch(setLayerInfoModal(modalParams))
  },
})

export default connect(
  null,
  mapDispatchToProps
)(FilterGroupForm)
