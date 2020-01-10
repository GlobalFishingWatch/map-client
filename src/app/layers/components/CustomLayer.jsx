import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import { debounce } from 'lodash'
import CustomLayerStyles from 'styles/components/map/custom-layer.module.scss'
import MapFormStyles from 'styles/components/map/form.module.scss'
import ButtonStyles from 'styles/components/button.module.scss'
import { CUSTOM_LAYERS_SUBTYPES } from 'app/constants'

class CustomLayer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      description: '',
      subtype: 'geojson',
      url: '',
      subLayersActives: [],
      allowSubmitting: true,
    }
  }

  onChange(target) {
    const key = target.name
    this.setState((state) => ({
      // Resets url when type changes
      url: key === 'subtype' ? '' : state.url,
      [key]: target.value,
    }))
    if (key === 'subtype') {
      this.props.resetCustomLayer()
    }
    if (key === 'url') {
      if (target.value) {
        this.setState({
          allowSubmitting: false,
        })
        this.uploadCustomLayer()
      } else {
        this.setState({
          allowSubmitting: true,
        })
        this.uploadCustomLayer.cancel()
        this.props.resetCustomLayer()
      }
    }
  }

  uploadCustomLayer = debounce(() => {
    this.props.onUploadCustomLayer(this.state)
    this.setState({
      allowSubmitting: true,
    })
  }, 500)

  onSubmit(event) {
    event.preventDefault()
    this.props.onConfirmCustomLayer(this.state)
  }

  toggleSubActiveLayers(subLayerId) {
    const { subLayersActives } = this.state
    const isActive = subLayersActives.includes(subLayerId)
    const newLayersActives = isActive
      ? subLayersActives.filter((l) => l !== subLayerId)
      : [...subLayersActives, subLayerId]

    this.setState({ subLayersActives: newLayersActives })
  }

  render() {
    const { subtype, subLayersActives, allowSubmitting } = this.state
    const { subLayers, error } = this.props

    if (
      this.props.userPermissions !== null &&
      this.props.userPermissions.indexOf('custom-layer') === -1
    ) {
      return (
        <div className={CustomLayerStyles.customLayer}>
          <div className={CustomLayerStyles.noAccess}>
            <a className="loginRequiredLink" href={this.props.loginUrl}>
              Only registered users can upload custom layers. Click here to log in.
            </a>
          </div>
        </div>
      )
    }

    return (
      <div className={CustomLayerStyles.customLayer}>
        <form
          className={classnames(MapFormStyles.form, CustomLayerStyles.uploadForm)}
          onSubmit={(e) => this.onSubmit(e)}
        >
          <div className={CustomLayerStyles.column}>
            <div className={CustomLayerStyles.row}>
              <label className={MapFormStyles.fieldName} htmlFor="name">
                Type
              </label>
              <div className={MapFormStyles.radioGroup}>
                <input
                  type="radio"
                  name="subtype"
                  id={CUSTOM_LAYERS_SUBTYPES.geojson}
                  value={CUSTOM_LAYERS_SUBTYPES.geojson}
                  checked={this.state.subtype === CUSTOM_LAYERS_SUBTYPES.geojson}
                  onChange={(e) => this.onChange(e.currentTarget)}
                />
                <label htmlFor={CUSTOM_LAYERS_SUBTYPES.geojson}>GeoJSON</label>
              </div>
              <div className={MapFormStyles.help}>
                A simple vector format that can be produced by various GIS such as ArcGIS or QGIS.
                You first need to upload the file, using a service such as Dropbox or Github.
              </div>
              <div className={MapFormStyles.radioGroup}>
                <input
                  type="radio"
                  name="subtype"
                  id={CUSTOM_LAYERS_SUBTYPES.raster}
                  value={CUSTOM_LAYERS_SUBTYPES.raster}
                  checked={this.state.subtype === CUSTOM_LAYERS_SUBTYPES.raster}
                  onChange={(e) => this.onChange(e.currentTarget)}
                />
                <label htmlFor={CUSTOM_LAYERS_SUBTYPES.raster}>Raster</label>
              </div>
              <div className={MapFormStyles.help}>
                Use this option for data that can be consumed as tiles (images), such as satellite
                imagery.
              </div>
              <div className={MapFormStyles.radioGroup}>
                <input
                  type="radio"
                  name="subtype"
                  id="wms"
                  value="wms"
                  checked={this.state.subtype === 'wms'}
                  onChange={(e) => this.onChange(e.currentTarget)}
                />
                <label htmlFor="wms">WMS</label>
              </div>
              <div className={MapFormStyles.help}>
                Web Map Service (WMS) following the OGC standard and capable of serving raster tiles
                from a GIS database.
              </div>
            </div>
          </div>
          <div className={CustomLayerStyles.column}>
            <div className={CustomLayerStyles.row}>
              <label className={MapFormStyles.fieldName} htmlFor="name">
                name
              </label>
              <input
                className={MapFormStyles.textInput}
                type="text"
                name="name"
                placeholder="Layer name"
                onChange={(e) => this.onChange(e.currentTarget)}
                required
              />
            </div>
            <div className={CustomLayerStyles.row}>
              <label className={MapFormStyles.fieldName} htmlFor="description">
                description (optional)
              </label>
              <textarea
                className={MapFormStyles.textarea}
                name="description"
                onChange={(e) => this.onChange(e.currentTarget)}
                placeholder="Your layer description"
                value={this.state.description}
              />
            </div>
            <div className={CustomLayerStyles.row}>
              <label className={MapFormStyles.fieldName} htmlFor="url">
                url
              </label>
              <input
                className={MapFormStyles.textInput}
                name="url"
                type="text"
                onChange={(e) => this.onChange(e.currentTarget)}
                value={this.state.url}
                required
                placeholder={
                  {
                    geojson: 'Link to a GeoJSON file',
                    raster: 'Raster tiles URL template with XYZ parameters',
                    wms: 'WMS server root',
                  }[this.state.subtype]
                }
              />
            </div>
          </div>

          {subtype === 'wms' && subLayers && subLayers.length > 0 && (
            <div className={CustomLayerStyles.rowSeparator}>
              <div className={CustomLayerStyles.row}>
                <span className={MapFormStyles.fieldName}>Available sub layers</span>
                {subLayers.map((layer) => [
                  <div key="check" className={MapFormStyles.radioGroup}>
                    <input
                      type="checkbox"
                      name={`sub-layer-${layer.id}`}
                      id={`sub-layer-${layer.id}`}
                      checked={subLayersActives.includes(layer.id)}
                      onChange={() => this.toggleSubActiveLayers(layer.id)}
                    />
                    <label htmlFor={`sub-layer-${layer.id}`}>{layer.label}</label>
                  </div>,
                  layer.description && (
                    <span
                      key="description"
                      title={layer.description}
                      className={MapFormStyles.help}
                    >
                      {layer.description}
                    </span>
                  ),
                ])}
              </div>
            </div>
          )}

          <div className={CustomLayerStyles.row}>
            {error !== null && (
              <span className={CustomLayerStyles.submitError}>
                {error === 'generic' ? (
                  <span>
                    Whoops! Something went wrong.
                    <br />
                    Please check if the custom layer type is properly selected or if the data you
                    provided is correct.
                  </span>
                ) : (
                  error
                )}
              </span>
            )}
            <div className={CustomLayerStyles.submitContainer}>
              <input
                className={classnames(
                  ButtonStyles.button,
                  ButtonStyles._filled,
                  ButtonStyles._big,
                  CustomLayerStyles.submitButton
                )}
                type="submit"
                value="done"
                disabled={allowSubmitting === false || error !== null}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

CustomLayer.propTypes = {
  // resets custom layer preview
  resetCustomLayer: PropTypes.func.isRequired,
  // function to upload and preview the layer
  onUploadCustomLayer: PropTypes.func.isRequired,
  // function triggered once the form is submitted
  onConfirmCustomLayer: PropTypes.func.isRequired,
  subLayers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      description: PropTypes.string,
    }).isRequired
  ).isRequired,
  error: PropTypes.string.isRequired,
  loginUrl: PropTypes.string.isRequired,
  userPermissions: PropTypes.array.isRequired,
}

export default CustomLayer
