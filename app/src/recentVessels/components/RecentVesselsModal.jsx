import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import RecentVesselStyles from 'styles/recentVessels/recent-vessels.scss';
import ModalResultListStyles from 'styles/search/result-list.scss';
import ModalStyles from 'styles/components/shared/modal.scss';
import MapButtonStyles from 'styles/components/button.scss';
import RecentVesselItem from 'recentVessels/containers/RecentVesselItem';

class RecentVesselsModal extends Component {

  render() {
    let historyItems = [];
    const pinnedVessels = this.props.vessels.filter(elem => elem.pinned === true);
    const pinnedVesselSeriesGroup = pinnedVessels.length > 0 ? pinnedVessels.map(elem => elem.seriesgroup) : [];

    if (this.props.history.length > 0) {
      historyItems = this.props.history.map(
        (entry, i) => (
          <RecentVesselItem
            vesselInfo={entry}
            key={i}
            pinned={pinnedVesselSeriesGroup.indexOf(entry.seriesgroup) !== -1}
            onClick={() => this.props.drawVessel(entry.tilesetId, entry.seriesgroup)}
          />
        )
      );
    }

    return (
      <div className={RecentVesselStyles.recentVessels} >
        <h3 className={ModalStyles.modalTitle} >Recent vessels</h3 >
        <div className={RecentVesselStyles.historyContainer} >
          {historyItems.length === 0 &&
          <div className={RecentVesselStyles.emptyHistory} >
            <span >Your history is currently empty</span >
          </div >}
          {historyItems.length > 0 &&
          <ul className={classnames(ModalResultListStyles.resultList, RecentVesselStyles.historyList)} >
            {historyItems}
          </ul >}
        </div >
        <div className={RecentVesselStyles.footer} >
          <button
            className={classnames(MapButtonStyles.button, MapButtonStyles._filled, RecentVesselStyles.btnDone)}
            onClick={() => this.props.closeModal()}
          >
            done
          </button >
        </div >
      </div >
    );
  }
}

RecentVesselsModal.propTypes = {
  closeModal: PropTypes.func,
  drawVessel: PropTypes.func,
  history: PropTypes.array,
  vessels: PropTypes.array
};

export default RecentVesselsModal;
