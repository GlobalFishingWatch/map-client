import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import CustomLayerStyles from 'styles/components/map/custom-layer.scss';
import MapFormStyles from 'styles/components/map/form.scss';
import ButtonStyles from 'styles/components/button.scss';

class CustomLayer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'Layer name',
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
    if (this.props.userPermissions !== null && this.props.userPermissions.indexOf('custom-layer') === -1) {
      return (
        <div className={CustomLayerStyles.customLayer} >
          <div className={CustomLayerStyles.noAccess} >
            <a
              className="loginRequiredLink"
              onClick={this.props.login}
            >Only registered users can upload custom layers. Click here to log in.</a>
          </div>
        </div>
      );
    }

    return (
      <div className={CustomLayerStyles.customLayer} >
        <form
          className={classnames(MapFormStyles.form, CustomLayerStyles.uploadForm)}
          onSubmit={e => this.onSubmit(e)}
        >
          <div className={CustomLayerStyles.column} >
            <div className={CustomLayerStyles.row} >
              <label className={MapFormStyles.fieldName} htmlFor="name" >name</label>
              <input
                className={MapFormStyles.textInput}
                type="text"
                name="name"
                placeholder="Layer name"
                onChange={e => this.onChange(e.currentTarget)}
                required
              />
            </div>

            <div className={CustomLayerStyles.row} >
              <label className={MapFormStyles.fieldName} htmlFor="url" >url</label>
              <input
                className={MapFormStyles.textInput}
                name="url"
                placeholder="Insert a link to a .geojson layer file"
                type="text"
                onChange={e => this.onChange(e.currentTarget)}
                required
              />
            </div>
          </div>
          <div className={CustomLayerStyles.column} >
            <div className={CustomLayerStyles.row} >
              <label className={MapFormStyles.fieldName} htmlFor="description" >description</label>
              <textarea
                className={MapFormStyles.textarea}
                name="description"
                onChange={e => this.onChange(e.currentTarget)}
                placeholder="Your layer description"
                value={this.state.description}
              />
            </div>
          </div>

          <div className={CustomLayerStyles.row} >
            {this.props.error &&
            <span className={CustomLayerStyles.submitError} > Whoops! Something went wrong. </span>
            }
            <div className={CustomLayerStyles.submitContainer} >
              <input
                className={classnames(ButtonStyles.button, ButtonStyles._filled,
                  ButtonStyles._big, CustomLayerStyles.submitButton)}
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
  onCustomLayer: PropTypes.func,
  error: PropTypes.string,
  login: PropTypes.func,
  userPermissions: PropTypes.array
};

export default CustomLayer;
