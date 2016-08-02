import React, { Component } from 'react';
import home from '../../../styles/index.scss';

class ContactUsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      showFormResponse: false
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const showThankYou = !!(!this.props.contactStatus && nextProps.contactStatus);
    this.setState({
      showFormResponse: showThankYou
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.id.substr(8)]: event.target.value
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.setState({
      submitted: true
    });

    this.props.onFormSubmit(this.state, '/v1/contact/us');
  }

  render() {
    if (this.state.showFormResponse) {
      let message;
      if (this.props.contactStatus === 200) {
        message = 'Thank you for your contact';
      } else {
        message = 'There was a problem submitting your contact request. Please try again later';
      }
      return (<section className={home.c_contact_form}>
        <h1>{message}</h1>
      </section>);
    }

    return (<section className={home.c_contact_form}>
      <h1>
        Contact Us
      </h1>
      <form
        action=""
        method="POST"
        onSubmit={this.handleFormSubmit}
      >
        <label htmlFor="name">Name</label>
        <input
          type="name"
          id="contact_name"
          placeholder="Name"
          required
          onChange={this.handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="contact_email"
          placeholder="email"
          required
          onChange={this.handleChange}
        />

        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="contact_company"
          placeholder="company"
          onChange={this.handleChange}
        />


        <label htmlFor="type">Type</label>
        <div className={home.select_container}>
          <select id="contact_type" onChange={this.handleChange} required>
            <option>Select an option...</option>
            <option value="Map">Map</option>
            <option value="Collaboration">Collaboration</option>
            <option value="Press">Press</option>
            <option value="Feedback">Feedback</option>
            <option value="General">General</option>
          </select>
        </div>

        <label htmlFor="subject">Subject</label>
        <input
          type="text" id="contact_subject"
          placeholder="subject"
          required
          onChange={this.handleChange}
        />

        <label htmlFor="description">description</label>
        <input
          type="textarea"
          id="contact_description"
          placeholder="description"
          required
          onChange={this.handleChange}
        />

        <input
          type="submit"
          disabled={this.state.submitted}
        />
      </form>
    </section>);
  }
}
ContactUsForm.propTypes = {
  contactStatus: React.PropTypes.number,
  onFormSubmit: React.PropTypes.func
};

export default ContactUsForm;
