import { connect } from 'react-redux'
import Notifications from '../components/Notifications'
import { setNotification } from '../notificationsActions'

const mapStateToProps = (state) => ({
  visible: state.notifications.visible,
  type: state.notifications.type,
  content: state.notifications.content,
})

const mapDispatchToProps = (dispatch) => ({
  onCloseClick: () => dispatch(setNotification({ content: '', visible: false })),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)
