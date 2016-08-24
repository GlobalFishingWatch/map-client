import React, { Component } from 'react';
import classnames from 'classnames';
import FormSupport from './../../containers/Map/SupportForm';
import supportModalStyle from '../../../styles/components/map/c-support-modal.scss';
import layerSupportModalStyle from '../../../styles/components/c-layer-back.scss';

class SupportModal extends Component {

  render() {
    return (<div>
      <div
        className={classnames(layerSupportModalStyle['c-layer-back'], layerSupportModalStyle['-support-modal'])}
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
        <FormSupport close={() => this.props.close()} />
      </div>
    </div>);
  }
}

SupportModal.propTypes = {
  close: React.PropTypes.func
};

export default SupportModal;
