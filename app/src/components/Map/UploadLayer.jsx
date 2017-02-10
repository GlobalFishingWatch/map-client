import React, { Component } from 'react';
import classnames from 'classnames';

import UploadLayerStyles from 'styles/components/map/c-upload-layer.scss';
import MapFormStyles from 'styles/components/map/c-form.scss';
import ButtonStyles from 'styles/components/map/c-button.scss';

class UploadLayer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'layer name',
      file: 'layer.kml',
      description: ''
    };
  }

  onChange(target) {
    const newState = Object.assign({}, this.state);
    newState[target.name] = target.value;

    this.setState(newState);
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.onUploadLayer(this.state);
  }

  render() {
    return (
      <div className={UploadLayerStyles['c-upload-layer']}>
        <form
          className={classnames(MapFormStyles['c-form'], UploadLayerStyles['upload-form'])}
          onSubmit={e => this.onSubmit(e)}
        >
          <div className={UploadLayerStyles.column}>
            <div className={UploadLayerStyles.row}>
              <label className={MapFormStyles['field-name']} htmlFor="name">name</label>
              <input
                className={MapFormStyles['text-input']}
                type="text"
                name="name"
                placeholder="layer name"
                onChange={e => this.onChange(e.currentTarget)}
                required
              />
            </div>

            <div className={UploadLayerStyles.row}>
              <label className={MapFormStyles['field-name']} htmlFor="url">url</label>
              <input
                className={MapFormStyles['text-input']}
                name="url"
                placeholder="example.org"
                type="text"
                onChange={e => this.onChange(e.currentTarget)}
                required
              />
            </div>
          </div>
          <div className={UploadLayerStyles.column}>
            <div className={UploadLayerStyles.row}>
              <label className={MapFormStyles['field-name']} htmlFor="description">description</label>
              <textarea
                className={MapFormStyles.textarea}
                name="description"
                onChange={e => this.onChange(e.currentTarget)}
                placeholder="Your layer description"
                value={this.state.description}
              />
            </div>
          </div>

          <div className={UploadLayerStyles.row}>
            <div className={UploadLayerStyles['submit-container']}>
              <input
                className={classnames(ButtonStyles['c-button'], ButtonStyles['-filled'],
                  ButtonStyles['-big'], UploadLayerStyles['submit-button'])}
                type="submit"
                value="done"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

UploadLayer.propTypes = {
  // function triggered once the form is submitted
  onUploadLayer: React.PropTypes.func
};

export default UploadLayer;
