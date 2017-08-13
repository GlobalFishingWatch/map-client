import PropTypes from 'prop-types';
/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import WelcomeModalStyles from 'styles/components/map/welcome-modal.scss';

class WelcomeModal extends Component {

  render() {
    return (
      <div className={WelcomeModalStyles.welcomeModal}>
        <div className={WelcomeModalStyles.content} dangerouslySetInnerHTML={{ __html: this.props.content }} />
      </div>
    );
  }
}

WelcomeModal.propTypes = {
  closeModal: PropTypes.func,
  content: PropTypes.string
};

export default WelcomeModal;
