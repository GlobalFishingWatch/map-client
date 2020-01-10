import { connect } from 'react-redux'
import App from 'app/components/App'
import { checkInitialNotification } from 'app/notifications/notificationsActions'
import { getLoggedUser } from 'app/user/userActions'
import { setWelcomeModalUrl, setWelcomeModalContent } from 'app/welcomeModal/welcomeModalActions'

const mapStateToProps = (state) => ({
  welcomeModalUrl: state.welcomeModal.url,
})

const mapDispatchToProps = (dispatch) => ({
  checkInitialNotification: () => dispatch(checkInitialNotification()),
  getLoggedUser: () => dispatch(getLoggedUser()),
  setWelcomeModalUrl: () => dispatch(setWelcomeModalUrl()),
  setWelcomeModalContent: () => dispatch(setWelcomeModalContent()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
