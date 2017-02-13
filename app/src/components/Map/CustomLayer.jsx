import React, { Component } from 'react';
import classnames from 'classnames';

import CustomLayerStyles from 'styles/components/map/c-custom-layer.scss';
import MapFormStyles from 'styles/components/map/c-form.scss';
import ButtonStyles from 'styles/components/map/c-button.scss';

class CustomLayer extends Component {

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

    this.props.onCustomLayer(this.state);
  }

  render() {
    return (
      <div className={CustomLayerStyles['c-custom-layer']}>
        <form
          className={classnames(MapFormStyles['c-form'], CustomLayerStyles['upload-form'])}
          onSubmit={e => this.onSubmit(e)}
        >
          <div className={CustomLayerStyles.column}>
            <div className={CustomLayerStyles.row}>
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

            <div className={CustomLayerStyles.row}>
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
          <div className={CustomLayerStyles.column}>
            <div className={CustomLayerStyles.row}>
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

          <div className={CustomLayerStyles.row}>
            <div className={CustomLayerStyles['submit-container']}>
              <input
                className={classnames(ButtonStyles['c-button'], ButtonStyles['-filled'],
                  ButtonStyles['-big'], CustomLayerStyles['submit-button'])}
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

CustomLayer.propTypes = {
  // function triggered once the form is submitted
  onCustomLayer: React.PropTypes.func
};

export default CustomLayer;
