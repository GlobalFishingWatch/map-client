import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classnames from 'classnames'
import RecentVesselStyles from 'styles/recentVessels/recent-vessels.module.scss'
import ModalResultListStyles from 'styles/search/result-list.module.scss'
import ModalStyles from 'styles/components/shared/modal.module.scss'
import RecentVesselItem from 'app/recentVessels/containers/RecentVesselItem'
import MapButtonStyles from 'styles/components/button.module.scss'
import Modal from 'app/components/Shared/Modal'

class RecentVesselsModal extends Component {
  renderContent() {
    let historyItems = []
    const pinnedVessels = this.props.vessels.filter((elem) => elem.pinned === true)
    const pinnedVesselIds =
      pinnedVessels.length > 0 ? pinnedVessels.map((elem) => elem.id) : []

    if (this.props.history.length > 0) {
      historyItems = this.props.history.map((entry, i) => (
        <RecentVesselItem
          vesselInfo={entry}
          pinned={pinnedVesselIds.indexOf(entry.id) !== -1}
          onClick={() => this.props.drawVessel(entry.tilesetId, entry.id)}
          key={i}
          closeable
        />
      ))
    }

    return (
      <div className={RecentVesselStyles.recentVessels}>
        <h3 className={ModalStyles.modalTitle}>Recent vessels</h3>
        <div className={RecentVesselStyles.historyContainer}>
          {historyItems.length === 0 && (
            <div className={RecentVesselStyles.emptyHistory}>
              <span>Your history is currently empty</span>
            </div>
          )}
          {historyItems.length > 0 && (
            <ul
              className={classnames(
                ModalResultListStyles.resultList,
                RecentVesselStyles.historyList
              )}
            >
              {historyItems}
            </ul>
          )}
        </div>
      </div>
    )
  }

  renderFooter() {
    return (
      <div className={RecentVesselStyles.footer}>
        <button
          className={classnames(
            MapButtonStyles.button,
            MapButtonStyles._filled,
            RecentVesselStyles.btnDone
          )}
          onClick={this.props.close}
        >
          done
        </button>
      </div>
    )
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        opened={this.props.opened}
        closeable
        isScrollable
        close={this.props.close}
        footer={this.renderFooter()}
      >
        {this.renderContent()}
      </Modal>
    )
  }
}

RecentVesselsModal.propTypes = {
  closeModal: PropTypes.func,
  drawVessel: PropTypes.func,
  history: PropTypes.array,
  vessels: PropTypes.array,
  visible: PropTypes.bool,
  close: PropTypes.func,
  opened: PropTypes.bool,
}

export default RecentVesselsModal
