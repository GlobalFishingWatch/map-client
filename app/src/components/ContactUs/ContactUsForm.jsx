import React, { Component } from 'react';
import formStyle from '../../../styles/components/c-contact-form.scss';
import buttonStyle from '../../../styles/components/c-button.scss';

class ContactUsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      showFormResponse: false,
      classSelect: '',
      disabledOption: false
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
    if (event.target.name === 'selectCompany') {
      this.setState({
        classSelect: 'select-selected',
        disabledOption: true
      });
    }
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
      return (<section className={[formStyle['c-contact-form'], formStyle['message-after']].join(' ')}>
        <h1>{message}</h1>
      </section>);
    }

    return (<section className={formStyle['c-contact-form']}>
      <h1>
        Contact Us
      </h1>
      <p>
        Let us know what you think! Submit your questions,
        suggestions for improvement or general feedback using the form below
      </p>
      <form
        action=""
        method="POST"
        onSubmit={this.handleFormSubmit}
      >
        <label htmlFor="name">Name *</label>
        <input
          type="name"
          id="contact_name"
          placeholder="Your name"
          className={formStyle['input-text']}
          required
          onChange={this.handleChange}
        />

        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="contact_email"
          placeholder="john.sample@globalfishingwatch.org"
          className={formStyle['input-text']}
          required
          onChange={this.handleChange}
        />

        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="contact_company"
          placeholder="Your company's name"
          className={formStyle['input-text']}
          onChange={this.handleChange}
        />


        <label htmlFor="type">Type *</label>
        <div className={formStyle['select-container']}>
          <select
            id="contact_type"
            onChange={this.handleChange}
            name="selectCompany"
            className={formStyle[this.state.classSelect]}
            required
          >
            <option disabled={this.state.disabledOption}>Select a question type</option>
            <option value="Map">Map</option>
            <option value="Collaboration">Collaboration</option>
            <option value="Press">Press</option>
            <option value="Feedback">Feedback</option>
            <option value="General">General</option>
          </select>
        </div>

        <label htmlFor="subject">Subject *</label>
        <input
          type="text"
          id="contact_subject"
          placeholder="Tell us the subject of your contact"
          className={formStyle['input-text']}
          required
          onChange={this.handleChange}
        />

        <label htmlFor="description">Message *</label>
        <textarea
          id="contact_description"
          placeholder="Give us more details"
          className={formStyle['textarea-form']}
          required
          onChange={this.handleChange}
        />

        <input
          type="submit"
          value="SEND"
          className={buttonStyle['c-button-contact']}
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
