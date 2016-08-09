import React, { Component } from 'react';
import CoverPrimary from './shared/CoverPrimary';
import Header from '../containers/header';
import Footer from './shared/footer';
import ContactUsForm from './contact_us/contact_us_form';
import SupportForm from './contact_us/support_form';

class ContactUs extends Component {

  render() {
    return (<div>
      <Header />
      <CoverPrimary
        title="Contact Us"
        subtitle="Let us know what you think! Submit your questions, suggestions for
        improvement or general feedback using the form below."
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
