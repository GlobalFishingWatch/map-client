import { connect } from 'react-redux'
import SearchResult from 'app/search/components/SearchResult'
import { addVessel, clearVesselInfo } from 'app/vesselInfo/vesselInfoActions'
import { toggleLayerVisibility } from 'app/layers/layersActions'

const mapStateToProps = (state) => ({
  searchTerm: state.search.searchTerm,
})

const mapDispatchToProps = (dispatch) => ({
  drawVessel: (vesselDetails) => {
    dispatch(toggleLayerVisibility(vesselDetails.tilesetId, true))
    dispatch(clearVesselInfo())
    dispatch(
      addVessel({
        tilesetId: vesselDetails.tilesetId,
        seriesgroup: vesselDetails.seriesgroup,
        fromSearch: true,
      })
    )
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResult)
