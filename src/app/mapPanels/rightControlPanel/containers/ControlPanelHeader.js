import { connect } from 'react-redux'
import ControlPanelHeader from 'app/mapPanels/rightControlPanel/components/ControlPanelHeader'
import { openTimebarInfoModal } from 'app/app/appActions'

const mapStateToProps = (state) => ({
  chartData: state.timebar.chartData,
  timelineInnerExtent: state.filters.timelineInnerExtent,
})

const mapDispatchToProps = (dispatch) => ({
  openTimebarInfoModal: () => {
    dispatch(openTimebarInfoModal())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanelHeader)
