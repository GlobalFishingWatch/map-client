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
      disabledOption: false,
      name: '',
      email: ''
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmitClicked = this.onSubmitClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const showThankYou = !!(!this.props.contactStatus && nextProps.contactStatus);
    this.setState({
      showFormResponse: showThankYou,
      name: nextProps.defaultUserName,
      email: nextProps.defaultUserEmail
    });
  }

  onSubmitClicked() {
    this.setState({
      validated: true
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
    // Safari triggers form submit even if checkValidity returns false,
    // see http://blueashes.com/2013/web-development/html5-form-validation-fallback/
    if (this.form.checkValidity() === false) {
      return false;
    }

    this.setState({
      submitted: true
    });

    this.props.onFormSubmit(this.state, '/v1/contact/us');
    return true;
  }

  render() {
    if (this.state.showFormResponse) {
      let message;
      if (this.props.contactStatus === 200) {
        message = 'Thank you for your inquiry.';
      } else {
        message = 'There was a problem submitting your inquiry. Please try again later.';
      }
      return (<section className={[formStyle['c-contact-form'], formStyle['message-after']].join(' ')}>
        <h1>{message}</h1>
      </section>);
    }

    const classNames = [formStyle['c-contact-form']];
    if (this.state.validated) {
      classNames.push(formStyle.validated);
    }

    return (<section className={classNames.join(' ')}>
      <h1>
        Contact Us
      </h1>
      <p>
        Let us know what you think! Submit your questions,
        suggestions for improvement or general feedback using the form below.
      </p>
      <form
        action=""
        method="POST"
        onSubmit={this.handleFormSubmit}
        ref={(ref) => { this.form = ref; }}
      >
        <label htmlFor="name">Name *</label>
        <input
          type="name"
          id="contact_name"
          placeholder="Your name"
          className={formStyle['input-text']}
          required
          onChange={this.handleChange}
          value={this.state.name}
        />

        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="contact_email"
          placeholder="john.sample@globalfishingwatch.org"
          className={formStyle['input-text']}
          required
          onChange={this.handleChange}
          value={this.state.email}
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
            <option value="" disabled={this.state.disabledOption}>Select a question type</option>
            <option value="Map">I have a question about the map</option>
            <option value="Collaboration">I have a question about collaboration opportunities</option>
            <option value="Press">I would like to speak to someone about a media or press opportunity</option>
            <option value="Feedback">I want to provide feedback.</option>
            <option value="General">I have a general question.</option>
          </select>
        </div>

        <label htmlFor="subject">Subject *</label>
        <input
          type="text"
          id="contact_subject"
          placeholder="Please let us know how we can help"
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
          onClick={this.onSubmitClicked}
        />
      </form>
    </section>);
  }
}
ContactUsForm.propTypes = {
  contactStatus: React.PropTypes.number,
  onFormSubmit: React.PropTypes.func,
  defaultUserName: React.PropTypes.string,
  defaultUserEmail: React.PropTypes.string
};

export default ContactUsForm;
