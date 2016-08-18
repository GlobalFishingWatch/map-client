import React, { Component } from 'react';
import Modal from './Shared/Modal';
import NoLogin from '../containers/Map/NoLogin';

class MapIFrame extends Component {
  render() {
    /* URL params */
    const headers = encodeURIComponent(JSON.stringify({ Authentication: `bearer ${this.props.token}` }));

    return (
      <div
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <Modal
          opened={!this.props.token}
          closeable={false}
          close={() => {}}
        >
          <NoLogin />
        </Modal>
        <iframe
          style={{
            border: 0,
            width: '100%',
            height: '100%',
            display: 'block'
          }}
          src={`${EMBED_MAP_URL}?headers=${headers}`}
        />
      </div>
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
