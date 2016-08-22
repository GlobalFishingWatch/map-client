import React, { Component } from 'react';
import Header from '../containers/Header';
import Footer from './Shared/Footer';
import ContactUsForm from './ContactUs/ContactUsForm';
import contactStyle from '../../styles/components/c-contact.scss';
import baseStyle from '../../styles/_base.scss';

class ContactUs extends Component {

  render() {
    return (<div>
      <div className={contactStyle['c-contact']}>
        <Header />
        <div className={baseStyle.wrap}>
          <ContactUsForm
            onFormSubmit={this.props.submitForm}
            contactStatus={this.props.contactStatus}
            defaultUserName={this.props.defaultUserName}
            defaultUserEmail={this.props.defaultUserEmail}
          />
        </div>
      </div>
      <Footer />
    </div>);
  }
}

ContactUs.propTypes = {
  contactStatus: React.PropTypes.number,
  submitForm: React.PropTypes.func,
  defaultUserName: React.PropTypes.string,
  defaultUserEmail: React.PropTypes.string
};

export default ContactUs;
