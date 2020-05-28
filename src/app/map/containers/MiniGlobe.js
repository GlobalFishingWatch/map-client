import { connect } from 'react-redux'
import MiniGlobe from '@globalfishingwatch/ui-components/dist/miniglobe'

const mapStateToProps = (state) => {
  const { viewport } = state.workspace
  return {
    center: {
      latitude: viewport.center && viewport.center[0],
      longitude: viewport.center && viewport.center[1],
    },
    bounds: viewport.bounds,
    viewportThickness: 2,
  }
}

export default connect(mapStateToProps)(MiniGlobe)
