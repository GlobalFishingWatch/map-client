import React, { Component } from 'react';
import classnames from 'classnames';

import UploadLayerStyles from 'styles/components/map/c-upload-layer.scss';
import MapFormStyles from 'styles/components/map/c-form.scss';
import ButtonStyles from 'styles/components/map/c-button.scss';

class UploadLayer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'layer-name': 'layer name',
      'layer-file': 'layer.kml',
      'layer-description': ''
    };
  }

  onChange(target) {
    const newState = Object.assign({}, this.state);

    if (target.type === 'file') {
      // gets file name from the path file.
      newState[target.name] = target.value.split(/(\\|\/)/g).pop();
    } else {
      newState[target.name] = target.value;
    }

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
              <label className={MapFormStyles['field-name']} htmlFor="layer-name">name</label>
              <input
                className={MapFormStyles['text-input']}
                type="text"
                name="layer-name"
                placeholder="layer name"
                value="test"
                onChange={e => this.onChange(e.currentTarget)}
                required
              />
            </div>

            <div className={UploadLayerStyles.row}>
              <label className={MapFormStyles['field-name']} htmlFor="layer-file">file</label>
              <div className={MapFormStyles['file-container']}>
                <div className={MapFormStyles['fake-file-container']}>
                  <div className={MapFormStyles['fake-file-input']}>
                    <span className={MapFormStyles['fake-file-input-placeholder']}>{this.state['layer-file']}</span>
                  </div>
                  <div
                    className={classnames(ButtonStyles['c-button'], ButtonStyles['-filled'], MapFormStyles['fake-file-button'])}
                  >
                    select file
                  </div>
                </div>
                <div className={MapFormStyles['file-input-container']}>
                  <input
                    className={MapFormStyles['file-input']}
                    name="layer-file"
                    onChange={e => this.onChange(e.currentTarget)}
                    required
                    type="file"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={UploadLayerStyles.column}>
            <div className={UploadLayerStyles.row}>
              <label className={MapFormStyles['field-name']} htmlFor="layer-description">description</label>
              <textarea
                className={MapFormStyles.textarea}
                name="layer-description"
                onChange={e => this.onChange(e.currentTarget)}
                placeholder="Your layer description"
                value="description :)"
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
