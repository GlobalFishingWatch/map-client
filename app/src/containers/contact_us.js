'use strict';

import {connect} from "react-redux";
import ContactUs from "../components/contact_us";
import {submitForm} from "../actions/contact";

const mapStateToProps = (state) => {
  return {
    contactStatus: state.contactStatus
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitForm: (data, endpoint) => dispatch(submitForm(data, endpoint))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
