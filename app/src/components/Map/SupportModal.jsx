import React, { Component } from 'react';
import FormSupport from '../ContactUs/SupportForm';
import supportModalStyle from '../../../styles/components/map/c-support-modal.scss';
import layerSupportModalStyle from '../../../styles/components/c-layer-back.scss';

class SupportModal extends Component {

  render() {
    return (<div>
      <div
        className={[layerSupportModalStyle['c-layer-back'],
        layerSupportModalStyle['-support-modal']].join(' ')}
        onClick={() => this.props.close()}
      >
      </div>)
      <div className={supportModalStyle['c-support-modal']}>
        <div
          className={supportModalStyle['close-modal-button']}
          onClick={() => this.props.close()}
        >
          <div className={supportModalStyle.cross}></div>
        </div>
        <FormSupport />
      </div>
    </div>);
  }
}

SupportModal.propTypes = {
  close: React.PropTypes.func
};


export default SupportModal;
