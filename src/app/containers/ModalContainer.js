import { connect } from 'react-redux'
import ModalContainer from 'app/components/ModalContainer'
import { setLayerInfoModal, setLayerManagementModalVisibility } from 'app/app/appActions'
import { deleteWorkspace } from 'app/workspace/workspaceActions'
import { setWelcomeModalVisibility } from 'app/welcomeModal/welcomeModalActions'
import { confirmLayerRemoval } from 'app/layers/layersActions'
import { setSearchModalVisibility } from 'app/search/searchActions'
import { setRecentVesselsModalVisibility } from 'app/recentVessels/recentVesselsActions'
import { openShareModal, setShareModalError } from 'app/share/shareActions'
import { setSupportModalVisibility } from 'app/siteNav/supportFormActions'
import {
  setFilterGroupModalVisibility,
  setEditFilterGroupIndex,
} from 'app/filters/filterGroupsActions'
import { discardCurrentEdits } from 'app/fleets/fleetsActions'
import {
  toggleSubscriptionModalVisibility,
  toggleReportPanelVisibility,
} from 'app/report/reportActions'
import isEmpty from 'lodash/isEmpty'
import { USER_PERMISSIONS } from 'app/constants'
import { canShareWorkspaces, hasUserActionPermission } from 'app/user/userSelectors'

const mapStateToProps = (state) => ({
  isFilterGroupModalOpen: state.filterGroups.isFilterGroupModalOpen,
  isFleetsModalOpen: state.fleets.isFleetsModalOpen,
  layerIdPromptedForRemoval: state.layers.layerIdPromptedForRemoval,
  layerManagementModal: state.app.layerManagementModal.open,
  layerModal: state.app.layerModal,
  recentVesselModalOpen: state.recentVessels.recentVesselModal.open,
  reportHasPolygon: !isEmpty(state.report.currentPolygon),
  searchModalOpen: state.search.searchModalOpen,
  shareModalOpenState: state.share.shareModal.open,
  subscriptionModalOpen: state.report.showSubscriptionModal,
  supportFormModalOpen: state.supportForm.open,
  token: state.user.token,
  canSeeMap: hasUserActionPermission(USER_PERMISSIONS.seeMap)(state),
  canShareWorkspaces: canShareWorkspaces(state),
  welcomeModalOpen: state.welcomeModal.open,
  isEmbedded: state.app.isEmbedded,
})

const mapDispatchToProps = (dispatch) => ({
  closeShareModal: () => {
    dispatch(openShareModal(false))
    dispatch(deleteWorkspace())
    dispatch(setShareModalError(null))
  },
  closeLayerInfoModal: () => {
    dispatch(
      setLayerInfoModal({
        open: false,
      })
    )
  },
  closeSupportModal: () => {
    dispatch(setSupportModalVisibility(false))
  },
  openSupportFormModal: () => {
    dispatch(setSupportModalVisibility(true))
  },
  closeLayerManagementModal: () => {
    dispatch(setLayerManagementModalVisibility(false))
  },
  closeSearchModal: () => {
    dispatch(setSearchModalVisibility(false))
  },
  closeRecentVesselModal: () => {
    dispatch(setRecentVesselsModalVisibility(false))
  },
  closeWelcomeModal: () => {
    dispatch(setWelcomeModalVisibility(false))
  },
  closeLayerRemovalModal: () => {
    dispatch(confirmLayerRemoval(false))
  },
  closeSubscriptionModal: () => {
    dispatch(toggleSubscriptionModalVisibility(false))
    dispatch(toggleReportPanelVisibility())
  },
  closeFilterGroupModal: () => {
    dispatch(setFilterGroupModalVisibility(false))
    dispatch(setEditFilterGroupIndex(null))
  },
  closeFleetsModal: () => {
    dispatch(discardCurrentEdits())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalContainer)
