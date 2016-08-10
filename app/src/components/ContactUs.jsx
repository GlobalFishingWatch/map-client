import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import ContactUsForm from './ContactUs/ContactUsForm';
import SupportForm from './ContactUs/SupportForm';

class ContactUs extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Contact Us"
        subtitle="Let us know what you think! Submit your questions, suggestions
        for improvement or general feedback using the form below"
      />
      <ContactUsForm onFormSubmit={this.props.submitForm} contactStatus={this.props.contactStatus} />
      <SupportForm onFormSubmit={this.props.submitForm} contactStatus={this.props.contactStatus} />
      <Footer />
    </div>);
  }
}

ContactUs.propTypes = {
  contactStatus: React.PropTypes.number,
  submitForm: React.PropTypes.func
};

export default ContactUs;
