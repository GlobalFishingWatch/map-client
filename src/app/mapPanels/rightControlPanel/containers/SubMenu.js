import { connect } from 'react-redux'
import SubMenu from 'app/mapPanels/rightControlPanel/components/SubMenu'
import { setSubmenu } from 'app/mapPanels/rightControlPanel/rightControlPanelActions'

const mapDispatchToProps = (dispatch) => ({
  setSubmenu: (submenuName) => {
    dispatch(setSubmenu(submenuName))
  },
})

export default connect(
  null,
  mapDispatchToProps
)(SubMenu)
