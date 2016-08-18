import React, { Component } from 'react';

class MapIFrame extends Component {
  render() {
    if (!this.props.token) {
      return (
        <div>Modal to propose login / sign up</div>
      );
    }

    /* URL params */
    const headers = encodeURIComponent(JSON.stringify({ Authentication: `bearer ${this.props.token}` }));

    return (
      <iframe
        style={{
          border: 0,
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        src={`${EMBED_MAP_URL}?headers=${headers}`}
      />
    );
  }
}

MapIFrame.propTypes = {
  /**
   * User token for the map
   */
  token: React.PropTypes.string
};

export default MapIFrame;
