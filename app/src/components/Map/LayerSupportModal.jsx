import React, { Component } from 'react';
import layerSupportModalStyle from '../../../styles/components/c-layer-back.scss';

class LayerSupportModal extends Component {

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
      <div
        className={[layerSupportModalStyle['c-layer-back'],
        layerSupportModalStyle['-support-modal']].join(' ')}
        onClick={() => this.props.setVisibleSupportModal(false)}
      >
      </div>);
  }
}

LayerSupportModal.propTypes = {
  setVisibleSupportModal: React.PropTypes.func
};


export default LayerSupportModal;
