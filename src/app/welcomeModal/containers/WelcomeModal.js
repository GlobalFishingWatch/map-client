import { connect } from 'react-redux'
import WelcomeModal from 'app/welcomeModal/components/WelcomeModal'
import { setWelcomeModalVisibility } from 'app/welcomeModal/welcomeModalActions'

const mapStateToProps = (state) => ({
  content: state.welcomeModal.content,
})

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(setWelcomeModalVisibility(false))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomeModal)
