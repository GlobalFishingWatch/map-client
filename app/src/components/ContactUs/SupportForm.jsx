import React, { Component } from 'react';
import home from '../../../styles/index.scss';

class SupportForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: window.location,
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

    this.props.onFormSubmit(this.state, '/v1/contact/support');
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

    return (<section>
      <h1>
        Support
      </h1>
      <form action="" method="POST" onSubmit={this.handleFormSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="name"
          id="support_name"
          placeholder="Name"
          required
          onChange={this.handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="support_email"
          placeholder="email"
          required
          onChange={this.handleChange}
        />

        <label htmlFor="type">Type</label>
        <div className={home.select_container}>
          <select
            id="support_type"
            required
            onChange={this.handleChange}
          >
            <option>Select an option...</option>
            <option value="Error">Error</option>
            <option value="Question">Question</option>
            <option value="Feature">Feature</option>
          </select>
        </div>

        <label htmlFor="subject">Subject</label>
        <input
          type="text"
          id="support_subject"
          placeholder="subject"
          required
          onChange={this.handleChange}
        />

        <label htmlFor="description">description</label>
        <input
          type="textarea"
          id="support_description"
          placeholder="description"
          required
          onChange={this.handleChange}
        />

        <input
          type="hidden"
          name="url"
          id="support_url"
          value={window.location}
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

SupportForm.propTypes = {
  contactStatus: React.PropTypes.number,
  onFormSubmit: React.PropTypes.func
};


export default SupportForm;
