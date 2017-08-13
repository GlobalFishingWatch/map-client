import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import recentVesselStyles from 'styles/components/map/recent-vessels.scss';
import ModalStyles from 'styles/components/shared/modal.scss';
import IconStyles from 'styles/icons.scss';
import MapButtonStyles from 'styles/components/map/button.scss';
import ResultListStyles from 'styles/components/shared/result-list.scss';

import PinIcon from '-!babel-loader!svg-react-loader!assets/icons/pin-icon.svg?name=PinIcon';

class RecentVesselsModal extends Component {

  render() {
    let historyItems = [];
    const pinnedVessels = this.props.vessels.filter(elem => elem.pinned === true);
    const pinnedVesselSeriesGroup = pinnedVessels.length > 0 ? pinnedVessels.map(elem => elem.seriesgroup) : [];

    if (this.props.history.length > 0) {
      historyItems = this.props.history.map(
        (entry, i) => {
          const vesselLabel = entry.label || `${entry.vesselname}, ${entry.mmsi}`;
          return (
            <li
              className={classnames(ResultListStyles.resultItem, recentVesselStyles.historyItem)}
              key={i}
              onClick={() => this.props.drawVessel(entry.tilesetId, entry.seriesgroup)}
            >
              {pinnedVesselSeriesGroup.indexOf(entry.seriesgroup) !== -1 &&
              <PinIcon
                className={classnames(IconStyles.icon, IconStyles.pinIcon, recentVesselStyles.pinned)}
              />}
              <span className={recentVesselStyles.historyItemName} >{vesselLabel}</span >
            </li >
          );
        }
      );
    }

    return (
      <div className={recentVesselStyles.recentVessels} >
        <h3 className={ModalStyles.modalTitle} >Recent vessels</h3 >
        <div className={recentVesselStyles.historyContainer} >
          {historyItems.length === 0 &&
          <div className={recentVesselStyles.emptyHistory} >
            <span >Your history is currently empty</span >
          </div >}
          {historyItems.length > 0 &&
          <ul className={classnames(ResultListStyles.resultList, recentVesselStyles.historyList)} >
            {historyItems}
          </ul >}
        </div >
        <div className={recentVesselStyles.footer} >
          <button
            className={classnames(MapButtonStyles.button, MapButtonStyles._filled, recentVesselStyles.btnDone)}
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
