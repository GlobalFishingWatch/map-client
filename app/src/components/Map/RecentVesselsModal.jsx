import React, { Component } from 'react';

import recentVesselStyles from 'styles/components/map/c-recent-vessels.scss';

class recentVesselsModal extends Component {

  render() {
    return (
      <div className={recentVesselStyles['c-recent-vessels']}>
        Recent Vessels content
      </div>
    );
  }

}

recentVesselsModal.propTypes = {
  closeModal: React.PropTypes.func
};

export default recentVesselsModal;
