import React, { Component } from 'react';
import supportModalStyle from '../../../styles/components/map/c-support-modal.scss';
import buttonStyle from '../../../styles/components/c-button.scss';

class SupportModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classSelect: '',
      disabledOption: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.name === 'selectCompany') {
      this.setState({
        classSelect: 'select-selected',
        disabledOption: true
      });
    }
  }

  render() {
    return (
      <div className={supportModalStyle['c-support-modal']}>
        <form>
          <h1>Support</h1>
          <div className={supportModalStyle['container-inputs']}>
            <label htmlFor="name_support">Name *</label>
            <input
              type="name"
              id="name_support"
              placeholder="Your name"
              className={supportModalStyle['input-text']}
              required
            />
            <label htmlFor="email:support">Email Address *</label>
            <input
              type="email"
              id="email_support"
              placeholder="john.sample@globalfishingwatch.org"
              className={supportModalStyle['input-text']}
              required
            />
            <label htmlFor="type_support">Type</label>
            <div className={supportModalStyle['select-container']}>
              <select
                id="type_support"
                onChange={this.handleChange}
                name="selectCompany"
                className={supportModalStyle[this.state.classSelect]}
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
          </div>
          <div className={supportModalStyle['container-textarea']}>
            <label htmlFor="description">Message *</label>
            <textarea
              id="contact_description"
              placeholder="Give us more details"
              className={supportModalStyle['textarea-form']}
              required
              onChange={this.handleChange}
            />
          </div>
          <div className={supportModalStyle['container-submit']}>
            <input
              type="submit"
              value="SEND"
              className={buttonStyle['c-button-submit-small']}
              disabled={this.state.submitted}
            />
          </div>
        </form>
      </div>);
  }
}


export default SupportModal;
