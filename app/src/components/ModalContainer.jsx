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
import PromptLayerRemovalModal from 'containers/Map/PromptLayerRemovalModal';
import NoLogin from 'containers/Map/NoLogin';
import FilterGroupModal from 'filters/containers/FilterGroupModal';
import SubscriptionModal from 'report/containers/SubscriptionModal';


class ModalContainer extends Component {
  render() {
    const canShareWorkspaces = !this.props.isEmbedded && this.props.canShareWorkspaces === true;
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
          isScrollable
          visible={!this.props.isEmbedded}
          closeable
          close={this.props.closeSupportModal}
        >
          <SupportForm />
        </Modal >
        <Modal
          opened={this.props.layerManagementModal}
          isScrollable
          visible={!this.props.isEmbedded}
          closeable
          close={this.props.closeLayerManagementModal}
        >
          <LayerLibrary />
        </Modal >
        <SearchModal
          opened={this.props.searchModalOpen}
          visible={!this.props.isEmbedded}
          close={this.props.closeSearchModal}
        />
        <RecentVesselsModal
          visible={!this.props.isEmbedded}
          opened={this.props.recentVesselModalOpen}
          close={this.props.closeRecentVesselModal}
        />
        <Modal
          visible={!this.props.isEmbedded}
          opened={this.props.welcomeModalOpen}
          closeable
          close={this.props.closeWelcomeModal}
        >
          <WelcomeModal />
        </Modal >
        <PromptLayerRemovalModal
          visible={!this.props.isEmbedded}
          opened={this.props.layerIdPromptedForRemoval !== false}
          close={this.props.closeLayerRemovalModal}
        />
        <Modal
          opened={this.props.shareModalOpenState}
          closeable
          visible={canShareWorkspaces}
          close={this.props.closeShareModal}
        >
          <Share />
        </Modal >
        <FilterGroupModal
          opened={this.props.isFilterGroupModalOpen}
          close={this.props.closeFilterGroupModal}
        />
        <Modal
          opened={this.props.subscriptionModalOpen}
          visible
          closeable={this.props.reportHasPolygon}
          close={this.props.closeSubscriptionModal}
        >
          <SubscriptionModal />
        </Modal >
      </div >
    );
  }
}

ModalContainer.propTypes = {
  closeFilterGroupModal: PropTypes.func,
  closeLayerInfoModal: PropTypes.func,
  closeLayerManagementModal: PropTypes.func,
  closeLayerRemovalModal: PropTypes.func,
  closeRecentVesselModal: PropTypes.func,
  closeSearchModal: PropTypes.func,
  closeShareModal: PropTypes.func,
  closeSubscriptionModal: PropTypes.func,
  closeSupportModal: PropTypes.func,
  closeWelcomeModal: PropTypes.func,
  isFilterGroupModalOpen: PropTypes.bool,
  isEmbedded: PropTypes.bool,
  layerIdPromptedForRemoval: PropTypes.any,
  layerManagementModal: PropTypes.bool,
  layerModal: PropTypes.object,
  openSupportModal: PropTypes.func,
  recentVesselModalOpen: PropTypes.bool,
  reportHasPolygon: PropTypes.bool,
  searchModalOpen: PropTypes.bool,
  shareModalOpenState: PropTypes.bool,
  subscriptionModalOpen: PropTypes.bool,
  supportFormModalOpen: PropTypes.bool,
  token: PropTypes.string,
  userPermissions: PropTypes.array,
  welcomeModalOpen: PropTypes.bool,
  canShareWorkspaces: PropTypes.bool
};

export default ModalContainer;
