import React, { Component } from 'react';
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
      disabledOption: false,
      name: this.props.defaultUserName,
      email: this.props.defaultUserEmail
    };
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
        message = 'Thank you for your inquiry';
      } else {
        message = 'There was a problem submitting your contact request. Please try again later';
      }
      return (<section className={supportFormStyle['c-support-form']}>
        <h1 className={supportFormStyle['message-after']}>{message}</h1>
        <button className={buttonStyle['c-button-submit-small']} onClick={() => this.props.close()}>Close</button>
      </section>);
    }

    return (<section className={supportFormStyle['c-support-form']}>
      <h1>
        Support
      </h1>
      <form action="" method="POST" onSubmit={(event) => { this.handleFormSubmit(event); }}>
        <div className={supportFormStyle['contain-form']}>
          <div className={supportFormStyle['container-inputs']}>
            <label htmlFor="name">Name</label>
            <input
              className={supportFormStyle['input-text']}
              type="name"
              id="support_name"
              placeholder="Name"
              required
              onChange={(event) => { this.handleChange(event); }}
              value={this.state.name}
            />

            <label htmlFor="support_email">Email</label>
            <input
              className={supportFormStyle['input-text']}
              type="email"
              id="support_email"
              placeholder="Email"
              disabled
              onChange={(event) => { this.handleChange(event); }}
              value={this.state.email}
            />

            <label htmlFor="support_type">Type</label>
            <div className={supportFormStyle['select-container']}>
              <select
                id="support_type"
                onChange={(event) => { this.handleChange(event); }}
                name="selectCompany"
                className={supportFormStyle[this.state.classSelect]}
                required
              >
                <option disabled={this.state.disabledOption}>Select an option</option>
                <option value="Error">Error</option>
                <option value="Question">Question</option>
                <option value="Feature">Feature</option>
              </select>
            </div>

            <label htmlFor="support_subject">Subject</label>
            <input
              className={supportFormStyle['input-text']}
              type="text"
              id="support_subject"
              placeholder="Subject"
              required
              onChange={(event) => { this.handleChange(event); }}
            />
          </div>
          <div className={supportFormStyle['container-textarea']}>
            <label htmlFor="support_description">description</label>
            <textarea
              id="support_description"
              placeholder="Please let us know how we can help!"
              className={supportFormStyle['textarea-form']}
              required
              onChange={(event) => { this.handleChange(event); }}
            />
          </div>
        </div>
        <input
          type="hidden"
          name="url"
          id="support_url"
          value={window.location}
          onChange={(event) => { this.handleChange(event); }}
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
  onFormSubmit: React.PropTypes.func,
  defaultUserName: React.PropTypes.string,
  defaultUserEmail: React.PropTypes.string,
  close: React.PropTypes.func
};


export default SupportForm;
