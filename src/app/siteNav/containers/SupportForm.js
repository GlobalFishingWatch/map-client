import { connect } from 'react-redux'
import SupportForm from 'app/siteNav/components/SupportForm'
import { submitForm, setSupportModalVisibility } from 'app/siteNav/supportFormActions'

const mapStateToProps = (state) => ({
  visibility: state.app.supportModal.open,
  supportRequestStatus: state.supportForm.supportRequestStatus,
  defaultUserName: state.user.loggedUser ? state.user.loggedUser.displayName : '',
  defaultUserEmail: state.user.loggedUser ? state.user.loggedUser.email : '',
})

const mapDispatchToProps = (dispatch) => ({
  onFormSubmit: (data, endpoint) => dispatch(submitForm(data, endpoint)),
  close: () => dispatch(setSupportModalVisibility(false)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupportForm)
