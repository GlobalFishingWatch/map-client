import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import CustomLayerStyles from 'styles/components/map/custom-layer.scss';
import MapFormStyles from 'styles/components/map/form.scss';
import ButtonStyles from 'styles/components/button.scss';
import { CUSTOM_LAYERS_SUBTYPES } from 'constants';

class CustomLayer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'Layer name',
      description: '',
      subtype: 'geojson'
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
      <div className={CustomLayerStyles.customLayer}>
        <form
          className={classnames(MapFormStyles.form, CustomLayerStyles.uploadForm)}
          onSubmit={e => this.onSubmit(e)}
        >
          <div className={CustomLayerStyles.column}>
            <div className={CustomLayerStyles.row}>
              <label className={MapFormStyles.fieldName} htmlFor="name">Type</label>
              <div className={MapFormStyles.radioGroup}>
                <input
                  type="radio"
                  name="subtype"
                  id={CUSTOM_LAYERS_SUBTYPES.geojson}
                  value={CUSTOM_LAYERS_SUBTYPES.geojson}
                  checked={this.state.subtype === CUSTOM_LAYERS_SUBTYPES.geojson}
                  onChange={e => this.onChange(e.currentTarget)}
                />
                <label htmlFor={CUSTOM_LAYERS_SUBTYPES.geojson}>
                  GeoJSON
                  <div className={MapFormStyles.help}>
                    A simple vector format that can be produced by various GIS packages such as ArcGIS or QGIS.
                    You first need to upload the file, using a service such as Dropbox or Github.
                  </div>
                </label>
              </div>
              <div className={MapFormStyles.radioGroup}>
                <input
                  type="radio"
                  name="subtype"
                  id={CUSTOM_LAYERS_SUBTYPES.raster}
                  value={CUSTOM_LAYERS_SUBTYPES.raster}
                  checked={this.state.subtype === CUSTOM_LAYERS_SUBTYPES.raster}
                  onChange={e => this.onChange(e.currentTarget)}
                />
                <label htmlFor={CUSTOM_LAYERS_SUBTYPES.raster}>
                  Raster
                  <div className={MapFormStyles.help}>
                    Use this option for data that can be consumed as tiles (images), such as
                    satellite imagery.
                  </div>
                </label>
              </div>
              <div className={MapFormStyles.radioGroup}>
                <input
                  type="radio"
                  name="subtype"
                  id="wms"
                  value="wms"
                  checked={this.state.subtype === 'wms'}
                  onChange={e => this.onChange(e.currentTarget)}
                />
                <label htmlFor="wms">
                  WMS
                  <div className={MapFormStyles.help}>
                    Web Map Service (WMS) following the OGC standard and capable of serving raster tiles from a GIS database.
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className={CustomLayerStyles.column}>
            <div className={CustomLayerStyles.row}>
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
            <div className={CustomLayerStyles.row}>
              <label className={MapFormStyles.fieldName} htmlFor="url" >url</label>
              <input
                className={MapFormStyles.textInput}
                name="url"
                type="text"
                onChange={e => this.onChange(e.currentTarget)}
                required
                placeholder={{
                  geojson: 'Link to a GeoJSON file',
                  raster: 'Raster tiles URL template with XYZ parameters',
                  wms: 'WMS server root'
                }[this.state.subtype]
                }
              />
            </div>
            <div className={CustomLayerStyles.row}>
              <label className={MapFormStyles.fieldName} htmlFor="description" >description (optional)</label>
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
            {this.props.error !== null &&
            <span className={CustomLayerStyles.submitError}>
              Whoops! Something went wrong.<br />
              Please check if the custom layer type is properly selected or if the data you provided is correct.
            </span>
            }
            <div className={CustomLayerStyles.submitContainer}>
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
