import { connect } from 'react-redux';
import ContactUs from '../components/ContactUs';
import { submitForm } from '../actions/contact';

const mapStateToProps = (state) => ({
  contactStatus: state.contactStatus
});

const mapDispatchToProps = (dispatch) => ({
  submitForm: (data, endpoint) => dispatch(submitForm(data, endpoint))
});
export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
