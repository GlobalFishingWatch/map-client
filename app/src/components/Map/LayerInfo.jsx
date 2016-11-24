import React, { Component } from 'react';

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
    const description = this.props.info.description || this.defaults.messages.noDescription;

    return (
      <div>
        <h2>{this.props.info.title}</h2>
        <p>{description}</p>
      </div>
    );
  }
}

LayerInfo.propTypes = {
  info: React.PropTypes.object
};

export default LayerInfo;
