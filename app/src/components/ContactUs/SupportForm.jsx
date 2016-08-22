import React, { Component } from 'react';
import home from '../../../styles/index.scss';
import supportFormStyle from '../../../styles/components/c-support-form.scss';
import buttonStyle from '../../../styles/components/c-button.scss';

class SupportForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: window.location,
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

    return (<section className={supportFormStyle['c-support-form']}>
      <h1>
        Support
      </h1>
      <form action="" method="POST" onSubmit={this.handleFormSubmit}>
        <div className={supportFormStyle['container-inputs']}>
          <label htmlFor="name">Name</label>
          <input
            className={supportFormStyle['input-text']}
            type="name"
            id="support_name"
            placeholder="Name"
            required
            onChange={this.handleChange}
          />

          <label htmlFor="support_email">Email</label>
          <input
            className={supportFormStyle['input-text']}
            type="Email"
            id="support_email"
            placeholder="email"
            required
            onChange={this.handleChange}
          />

          <label htmlFor="support_type">Type</label>
          <div className={supportFormStyle['select-container']}>
            <select
              id="support_type"
              onChange={this.handleChange}
              name="selectCompany"
              className={supportFormStyle[this.state.classSelect]}
              required
            >
              <option disabled={this.state.disabledOption}>Select an option</option>
              <option value="Type1">Type 1</option>
              <option value="Type2">Type 2</option>
              <option value="Type3">Type 3</option>
              <option value="Type4">Type 4</option>
              <option value="Type5">Type 5</option>
            </select>
          </div>

          <label htmlFor="support_subject">Subject</label>
          <input
            className={supportFormStyle['input-text']}
            type="text"
            id="support_subject"
            placeholder="Subject"
            required
            onChange={this.handleChange}
          />
        </div>
        <div className={supportFormStyle['container-textarea']}>
          <label htmlFor="support_description">description</label>
          <textarea
            id="support_description"
            placeholder="Description"
            className={supportFormStyle['textarea-form']}
            required
            onChange={this.handleChange}
          />
        </div>
        <input
          type="hidden"
          name="url"
          id="support_url"
          value={window.location}
          onChange={this.handleChange}
        />
        <div className={supportFormStyle['container-submit']}>
          <input
            type="submit"
            value="Send"
            disabled={this.state.submitted}
            className={buttonStyle['c-button-submit-small']}
          />
        </div>
      </form>
    </section>);
  }
}

SupportForm.propTypes = {
  contactStatus: React.PropTypes.number,
  onFormSubmit: React.PropTypes.func
};


export default SupportForm;
