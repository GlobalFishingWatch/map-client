/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LayerInfoStyles from 'styles/components/map/layer-info.scss';

class LayerInfo extends Component {

  constructor(props) {
    super(props);

    this.defaults = {
      messages: {
        noDescription: 'No description available.'
      }
    };
  }

  render() {
    if (this.props.info === undefined) {
      return null;
    }

    const description = this.props.info.description || this.defaults.messages.noDescription;

    return (
      <div className={LayerInfoStyles.layerInfo}>
        <h2 className={LayerInfoStyles.layerTitle}>{this.props.info.title}</h2>
        <p
          className={LayerInfoStyles.layerDescription}
          dangerouslySetInnerHTML={{
            __html: description
          }}
        />
      </div>
    );
  }
}

LayerInfo.propTypes = {
  info: PropTypes.object
};

export default LayerInfo;
