import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { scrollTo } from 'lib/Utils';
import formStyle from 'styles/components/c-contact-form.scss';
import buttonStyle from 'styles/components/c-button.scss';
import contactStyle from 'styles/components/c-contact.scss';

class ContactUsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFormResponse: false,
      classSelect: '',
      disabledOption: false,
      name: props.defaultUserName ? props.defaultUserName : '',
      email: props.defaultUserEmail ? props.defaultUserEmail : '',
      validated: false // If the form has been submitted yet and thus validated
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const showThankYou = this.props.contactStatus !== nextProps.contactStatus;
    this.setState({
      showFormResponse: showThankYou,
      name: nextProps.defaultUserName,
      email: nextProps.defaultUserEmail
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

  scrollPage() {
    const el = document.getElementsByTagName('BODY');
    if (!el) {
      return;
    }
    scrollTo(el);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    // Safari triggers form submit even if checkValidity returns false,
    // see http://blueashes.com/2013/web-development/html5-form-validation-fallback/
    if (!this.form.checkValidity()) {
      this.setState({
        validated: true
      });
      return false;
    }

    this.props.onFormSubmit(this.state, '/v1/contact/us');
    return true;
  }

  render() {
    if (this.state.showFormResponse) {
      this.scrollPage();
      let message;
      if (this.props.contactStatus && this.props.contactStatus.status === 200) {
        message = 'Thank you for your inquiry.';
      } else {
        message = 'There was a problem submitting your inquiry. Please try again later.';
      }
      return (<section className={[formStyle['c-contact-form'], formStyle['message-after']].join(' ')}>
        <h1>{message}</h1>
      </section>);
    }

    return (<div className={contactStyle['contain-text-contact']}>
      <h1>
        Contact Us
      </h1>
      <p className={contactStyle['intro-contact']}>
        Let us know what you think! Submit your questions, suggestions
        for improvement or general feedback using the form below.
        You may also find answers to your questions by reviewing our
        FAQ page <Link to="/faq">here</Link> or viewing our tutorial
        video <Link to="/tutorials">here</Link>.
      </p>
      <section
        className={classnames({
          [formStyle['c-contact-form']]: true,
          [formStyle.validated]: this.state.validated
        })}
      >
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

          <label htmlFor="company">Organization</label>
          <input
            type="text"
            id="contact_company"
            placeholder="Your organization's name"
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

          <button
            type="submit"
            className={buttonStyle['c-button-contact']}
          >SEND</button>
        </form>
        <div className={contactStyle['emails-text']}>
          For media or press inquiries, please contact:
          <ul>
            <li>Oceana: Megan Jordan, <a href="mailto:mjordan@oceana.org">mjordan@oceana.org</a>, 202.868.4061</li>
            <li>SkyTruth: Kimbra Cutlip, <a href="mailto:kimbra@skytruth.org">kimbra@skytruth.org</a>, 443.871.1632</li>
            <li>Google: Mara Harris, <a href="mailto:press@google.com">press@google.com</a></li>
          </ul>
        </div>
        <div className={contactStyle['emails-text']}>
          For Research Program related inquiries, please contact{' '}
          <a href="mailto:research@globalfishingwatch.org">research@globalfishingwatch.org</a>.
        </div>
      </section>
    </div>);
  }
}
ContactUsForm.propTypes = {
  contactStatus: React.PropTypes.number,
  onFormSubmit: React.PropTypes.func,
  defaultUserName: React.PropTypes.string,
  defaultUserEmail: React.PropTypes.string
};

export default ContactUsForm;
