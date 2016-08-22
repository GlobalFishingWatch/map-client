import React, { Component } from 'react';
import FormSupport from '../ContactUs/SupportForm';
import supportModalStyle from '../../../styles/components/map/c-support-modal.scss';

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
        <div className={supportModalStyle['close-modal-button']}>
          <div className={supportModalStyle.cross}></div>
        </div>
        <FormSupport />
      </div>);
  }
}


export default SupportModal;
