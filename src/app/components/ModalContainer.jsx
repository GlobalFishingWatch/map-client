/* eslint react/sort-comp:0 */
/* eslint-disable max-len  */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'app/components/Shared/Modal'
import Share from 'app/share/containers/Share'
import LayerInfo from 'app/layers/containers/LayerInfo'
import LayerLibrary from 'app/layers/containers/LayerManagementModal'
import SearchModal from 'app/search/containers/SearchModal'
import SupportForm from 'app/siteNav/containers/SupportForm'
import RecentVesselsModal from 'app/recentVessels/containers/RecentVesselsModal'
import WelcomeModal from 'app/welcomeModal/containers/WelcomeModal'
import PromptLayerRemovalModal from 'app/containers/Map/PromptLayerRemovalModal'
import NoLogin from 'app/containers/Map/NoLogin'
import FilterGroupModal from 'app/filters/containers/FilterGroupModal'
import FleetsModal from 'app/fleets/containers/FleetsModal'
import SubscriptionModal from 'app/report/containers/SubscriptionModal'

const REQUIRE_MAP_LOGIN = process.env.REACT_APP_REQUIRE_MAP_LOGIN === 'true'

class ModalContainer extends Component {
  render() {
    const canShareWorkspaces = !this.props.isEmbedded && this.props.canShareWorkspaces === true
    return (
      <div>
        <Modal
          opened={
            REQUIRE_MAP_LOGIN &&
            this.props.userPermissions !== null &&
            this.props.userPermissions.indexOf('seeMap') === -1
          }
          closeable={false}
          visible={!this.props.isEmbedded}
          close={() => {}}
        >
          <NoLogin />
        </Modal>
        <Modal
          opened={this.props.layerModal.open}
          visible={!this.props.isEmbedded}
          isScrollable
          closeable
          close={this.props.closeLayerInfoModal}
          zIndex={1003}
        >
          <LayerInfo />
        </Modal>
        <Modal
          opened={this.props.supportFormModalOpen}
          isScrollable
          visible={!this.props.isEmbedded}
          closeable
          close={this.props.closeSupportModal}
        >
          <SupportForm />
        </Modal>
        <Modal
          opened={this.props.layerManagementModal}
          isScrollable
          visible={!this.props.isEmbedded}
          closeable
          close={this.props.closeLayerManagementModal}
        >
          <LayerLibrary />
        </Modal>
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
        </Modal>
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
        </Modal>
        {this.props.isFilterGroupModalOpen && (
          <FilterGroupModal
            opened={this.props.isFilterGroupModalOpen}
            close={this.props.closeFilterGroupModal}
          />
        )}
        {this.props.isFleetsModalOpen && (
          <FleetsModal opened={this.props.isFleetsModalOpen} close={this.props.closeFleetsModal} />
        )}
        <Modal
          opened={this.props.subscriptionModalOpen}
          visible
          closeable={this.props.reportHasPolygon}
          close={this.props.closeSubscriptionModal}
        >
          <SubscriptionModal />
        </Modal>
      </div>
    )
  }
}

ModalContainer.propTypes = {
  closeFilterGroupModal: PropTypes.func,
  closeFleetsModal: PropTypes.func,
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
  isFleetsModalOpen: PropTypes.bool,
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
  canShareWorkspaces: PropTypes.bool,
}

export default ModalContainer
