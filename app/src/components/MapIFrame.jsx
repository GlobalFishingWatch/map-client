import React from 'react';
import classnames from 'classnames';

import Modal from 'components/Shared/Modal';
import NoLogin from 'containers/Map/NoLogin';
import Header from 'containers/Header';
import FooterMini from 'components/Map/MapFooter';
import mapStyles from 'styles/components/c-map.scss';

function MapIFrame(props) {
  /**
   * To add any new param to the URL, add a new entry to the following object with
   * the key being the name of the param
   */
  const workspace = props.workspaceId || DEFAULT_WORKSPACE;
  const urlParams = {
    headers: props.token && encodeURIComponent(JSON.stringify({ Authorization: `Bearer ${props.token}` })),
    workspace: encodeURIComponent(`${MAP_API_ENDPOINT}/v1/workspaces/${workspace}`)
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

  let content = <iframe src={url} />;
  const showModal = !props.token && REQUIRE_MAP_LOGIN;
  if (showModal) {
    content = (
      <Modal
        opened={!props.token && REQUIRE_MAP_LOGIN}
        closeable={false}
        close={() => {}}
      >
        <NoLogin />
      </Modal>
    );
  }

  return (
    <div className={classnames({ [mapStyles['map-iframe-container']]: true, [mapStyles['-placeholder']]: showModal })}>
      <Header />
      {content}
      <FooterMini />
    </div>
  );
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
