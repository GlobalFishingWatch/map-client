import React, { Component } from 'react';
import Header from '../containers/header';
import Footer from './shared/footer';
import ContactUsForm from './contact_us/contact_us_form';
import SupportForm from './contact_us/support_form';

class ContactUs extends Component {

  render() {
    return (<div>
      <Header />
      <ContactUsForm onFormSubmit={this.props.submitForm} contactStatus={this.props.contactStatus}></ContactUsForm>
      <SupportForm onFormSubmit={this.props.submitForm} contactStatus={this.props.contactStatus}></SupportForm>
      <Footer />
    </div>);
  }
}

export default ContactUs;
