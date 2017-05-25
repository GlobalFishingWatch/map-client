import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import recentVesselStyles from 'styles/components/map/c-recent-vessels.scss';
import ModalStyles from 'styles/components/shared/c-modal.scss';
import IconStyles from 'styles/icons.scss';
import MapButtonStyles from 'styles/components/map/c-button.scss';
import ResultListStyles from 'styles/components/shared/c-result-list.scss';

import PinIcon from 'babel!svg-react!assets/icons/pin-icon.svg?name=PinIcon';

class RecentVesselsModal extends Component {

  render() {
    const historyItems = [];

    if (this.props.history.length > 0) {
      this.props.history.map((entry, i) => (
        historyItems.push(
          <li
            className={classnames(ResultListStyles['result-item'], recentVesselStyles['history-item'])}
            key={i}
            onClick={() => this.props.drawVessel(entry.tilesetId, entry.seriesgroup)}
          >
            {entry.pinned === true &&
              <PinIcon
                className={classnames(IconStyles.icon, IconStyles['pin-icon'], recentVesselStyles.pinned)}
              />}
            <span className={recentVesselStyles['history-item-name']}>{`${entry.vesselname}, ${entry.mmsi}`}</span>
          </li>)
      ));
    }

    return (
      <div className={recentVesselStyles['c-recent-vessels']}>
        <h3 className={ModalStyles['modal-title']}>Recent vessels</h3>
        <div className={recentVesselStyles['history-container']}>
          {historyItems.length === 0 &&
            <div className={recentVesselStyles['empty-history']}>
              <span>Your history is currently empty</span>
            </div>}
          {historyItems.length > 0 &&
            <ul className={classnames(ResultListStyles['c-result-list'], recentVesselStyles['history-list'])}>
              {historyItems}
            </ul>}
        </div>
        <div className={recentVesselStyles.footer}>
          <button
            className={classnames(MapButtonStyles['c-button'], MapButtonStyles['-filled'], recentVesselStyles['btn-done'])}
            onClick={() => this.props.closeModal()}
          >
            done
          </button>
        </div>
      </div>
    );
  }
}

RecentVesselsModal.propTypes = {
  closeModal: PropTypes.func,
  drawVessel: PropTypes.func,
  history: PropTypes.array
};

export default RecentVesselsModal;
