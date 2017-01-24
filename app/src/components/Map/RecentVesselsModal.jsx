import React, { Component } from 'react';

import recentVesselStyles from 'styles/components/map/c-recent-vessels.scss';
import ModalStyles from 'styles/components/shared/c-modal.scss';
import ResultListStyles from 'styles/components/shared/c-result-list.scss';

class recentVesselsModal extends Component {

  render() {
    const historyItems = [];

    if (this.props.history.length > 0) {
      this.props.history.map((entry, i) => (
        historyItems.push(
          <li
            className={ResultListStyles['result-item']}
            key={i}
            onClick={() => this.props.drawVessel(entry.seriesgroup)}
          >
            {`${entry.vesselName}, ${entry.mmsi}`}
          </li>
        )
      ));
    }

    return (
      <div className={recentVesselStyles['c-recent-vessels']}>
        <h3 className={ModalStyles['modal-title']}>Recent vessels</h3>
        {historyItems.length === 0 &&
          <div className={recentVesselStyles['empty-history']}>
            <span>Your history is currently empty</span>
          </div>
        }
        {historyItems.length > 0 &&
          <ul className={ResultListStyles['c-result-list']}>
            {historyItems}
          </ul>
        }
      </div>
    );
  }
}

recentVesselsModal.propTypes = {
  closeModal: React.PropTypes.func,
  drawVessel: React.PropTypes.func,
  history: React.PropTypes.array
};

export default recentVesselsModal;
