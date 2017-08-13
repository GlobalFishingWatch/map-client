/* eslint react/sort-comp:0 */
/* eslint-disable max-len  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Shared/Modal';
import Share from 'share/containers/Share';
import LayerInfo from 'layers/containers/LayerInfo';
import LayerLibrary from 'layers/containers/LayerManagementModal';
import SearchModal from 'search/containers/SearchModal';
import SupportForm from 'siteNav/containers/SupportForm';
import RecentVesselsModal from 'recentVessels/containers/RecentVesselsModal';
import WelcomeModal from 'welcomeModal/containers/WelcomeModal';
import PromptLayerRemoval from 'containers/Map/PromptLayerRemoval';
import NoLogin from 'containers/Map/NoLogin';


class ModalContainer extends Component {
  render() {
    const canShareWorkspaces = !this.props.isEmbedded && (this.props.userPermissions !== null && this.props.userPermissions.indexOf('shareWorkspace') !== -1);
    return (
      <div >
        <Modal
          opened={(!this.props.token && REQUIRE_MAP_LOGIN) || (this.props.userPermissions !== null && this.props.userPermissions.indexOf('seeMap') === -1)}
          closeable={false}
          visible={!this.props.isEmbedded}
          close={() => {
          }}
        >
          <NoLogin />
        </Modal >
        <Modal
          opened={this.props.layerModal.open}
          visible={!this.props.isEmbedded}
          closeable
          close={this.props.closeLayerInfoModal}
          zIndex={1003}
        >
          <LayerInfo />
        </Modal >
        <Modal
          opened={this.props.supportFormModalOpen}
          visible={!this.props.isEmbedded}
          closeable
          close={this.props.closeSupportModal}
        >
          <SupportForm />
        </Modal >
        <Modal
          opened={this.props.layerManagementModal}
          visible={!this.props.isEmbedded}
          closeable
          close={this.props.closeLayerManagementModal}
        >
          <LayerLibrary />
        </Modal >
        <Modal
          opened={this.props.searchModalOpen}
          visible={!this.props.isEmbedded}
          closeable
          close={this.props.closeSearchModal}
        >
          <SearchModal />
        </Modal >
        <Modal
          visible={!this.props.isEmbedded}
          opened={this.props.recentVesselModalOpen}
          closeable
          close={this.props.closeRecentVesselModal}
        >
          <RecentVesselsModal />
        </Modal >
        <Modal
          visible={!this.props.isEmbedded}
          opened={this.props.welcomeModalOpen}
          closeable
          close={this.props.closeWelcomeModal}
        >
          <WelcomeModal />
        </Modal >
        <Modal
          visible={!this.props.isEmbedded}
          opened={this.props.layerIdPromptedForRemoval !== false}
          isSmall
          close={this.props.closeLayerRemovalModal}
        >
          <PromptLayerRemoval />
        </Modal >
        <Modal
          opened={this.props.shareModalOpenState}
          closeable
          visible={canShareWorkspaces}
          close={this.props.closeShareModal}
        >
          <Share />
        </Modal >
      </div >
    );
  }
}

ModalContainer.propTypes = {
  closeLayerInfoModal: PropTypes.func,
  closeLayerManagementModal: PropTypes.func,
  closeLayerRemovalModal: PropTypes.func,
  closeRecentVesselModal: PropTypes.func,
  closeSearchModal: PropTypes.func,
  closeShareModal: PropTypes.func,
  closeSupportModal: PropTypes.func,
  closeWelcomeModal: PropTypes.func,
  isEmbedded: PropTypes.bool,
  layerIdPromptedForRemoval: PropTypes.any,
  layerManagementModal: PropTypes.bool,
  layerModal: PropTypes.object,
  openSupportModal: PropTypes.func,
  recentVesselModalOpen: PropTypes.bool,
  searchModalOpen: PropTypes.bool,
  shareModalOpenState: PropTypes.bool,
  supportFormModalOpen: PropTypes.bool,
  token: PropTypes.string,
  userPermissions: PropTypes.array,
  welcomeModalOpen: PropTypes.bool
};

export default ModalContainer;
