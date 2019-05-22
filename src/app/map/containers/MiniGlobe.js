import { connect } from 'react-redux'
import MiniGlobe from '@globalfishingwatch/map-components/components/miniglobe'

const mapStateToProps = (state) => ({
  center: state.workspace.viewport.center,
  zoom: state.workspace.viewport.zoom,
  bounds: state.workspace.viewport.bounds,
  viewportThickness: 2,
})

export default connect(mapStateToProps)(MiniGlobe)
