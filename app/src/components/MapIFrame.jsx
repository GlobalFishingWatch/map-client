import React, { Component } from 'react';
import Modal from './Shared/Modal';
import NoLogin from '../containers/Map/NoLogin';
import FooterMini from './Shared/FooterMini';

class MapIFrame extends Component {
  render() {
    /**
     * To add any new param to the URL, add a new entry to the following object with
     * the key being the name of the param
     */
    const urlParams = {
      headers: this.props.token && encodeURIComponent(JSON.stringify({ Authentication: `bearer ${this.props.token}` })),
      // This is the real workspace ID
      workspace_id: this.props.workspaceId,
      // This is a temporal workspace parameter for SkyTruth's map
      /* eslint max-len:0 */
      workspace: 'http%3A%2F%2Fstorage.googleapis.com%2Fworld-fishing-827%2Fpelagos%2Fdata%2Fsf-sso-test%2Fsandbox%2Fpelagos-client%2Fpelagos-api-test-worldfishing.json'
    };

    /**
     * To compute the URL, we add the base URL, and all the params stored in the object
     * removing the ones with no value
     */
    const url = EMBED_MAP_URL +
      Object.keys(urlParams)
        .filter(key => !!urlParams[key])
        .map(key => `${key}=${urlParams[key]}`)
        .reduce((res, param, index) => (index === 0 ? `${res}${param}` : `${res}&${param}`), '?');

    return (
      <div
        style={{
          width: '100%',
          height: 'calc(100% - 38px)'
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
          src={url}
        />
        <FooterMini />
      </div>
    );
  }
}

MapIFrame.propTypes = {
  /**
   * User token for the map
   */
  token: React.PropTypes.string,
  /**
   * Map's workpace ID
   */
  workspaceId: React.PropTypes.string
};

export default MapIFrame;
