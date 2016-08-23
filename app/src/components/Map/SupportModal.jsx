import React, { Component } from 'react';
import FormSupport from '../ContactUs/SupportForm';
import supportModalStyle from '../../../styles/components/map/c-support-modal.scss';

class SupportModal extends Component {

  render() {
    return (
      <div className={supportModalStyle['c-support-modal']}>
        <div
          className={supportModalStyle['close-modal-button']}
          onClick={() => this.props.setVisibleSupportModal(false)}
        >
          <div className={supportModalStyle.cross}></div>
        </div>
        <FormSupport />
      </div>);
  }
}

SupportModal.propTypes = {
  setVisibleSupportModal: React.PropTypes.func
};


export default SupportModal;
