import { connect } from 'react-redux'
import SearchResult from 'app/search/components/SearchResult'
import { addVesselFromSearch, clearVesselInfo } from 'app/vesselInfo/vesselInfoActions'
import { toggleLayerVisibility } from 'app/layers/layersActions'

const mapStateToProps = (state) => ({
  searchTerm: state.search.searchTerm,
})

const mapDispatchToProps = (dispatch) => ({
  drawVessel: (vesselDetails) => {
    dispatch(toggleLayerVisibility(vesselDetails.tilesetId, true))
    dispatch(clearVesselInfo())
    dispatch(addVesselFromSearch(vesselDetails))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResult)
