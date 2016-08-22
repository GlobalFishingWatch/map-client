import { connect } from 'react-redux';
import ContactUs from '../components/ContactUs';
import { submitForm } from '../actions/contact';

const mapStateToProps = (state) => ({
  contactStatus: state.contactStatus,
  defaultUserName: state.user.loggedUser ? state.user.loggedUser.displayName : '',
  defaultUserEmail: state.user.loggedUser ? state.user.loggedUser.email : ''
});

const mapDispatchToProps = (dispatch) => ({
  submitForm: (data, endpoint) => dispatch(submitForm(data, endpoint))
});
export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
