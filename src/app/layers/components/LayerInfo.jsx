/* eslint-disable react/no-danger */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'app/components/Shared/Icon'
import LayerInfoStyles from 'styles/components/map/layer-info.module.scss'

class LayerInfo extends Component {
  constructor(props) {
    super(props)

    this.defaults = {
      messages: {
        noDescription: 'No description available.',
      },
    }
  }

  render() {
    const { info } = this.props
    if (info === undefined) {
      return null
    }

    const description = info.description || this.defaults.messages.noDescription
    const isIndonesianLayer = info.id === 'indo-public-fishing' || info.id === 'indo-private'

    return (
      <div className={LayerInfoStyles.layerInfo}>
        <h2 className={LayerInfoStyles.layerTitle}>{info.title}</h2>
        {isIndonesianLayer && (
          <p className={LayerInfoStyles.layerDescription}>
            <Icon icon="alert" inline /> VMS data for Indonesia is not currently available for the
            period from July 2020 to date
          </p>
        )}
        <p
          className={LayerInfoStyles.layerDescription}
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </div>
    )
  }
}

LayerInfo.propTypes = {
  info: PropTypes.object,
}

export default LayerInfo
