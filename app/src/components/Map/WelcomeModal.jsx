import PropTypes from 'prop-types';
/* eslint-disable react/no-danger */
import React, { Component } from 'preact';
import styles from 'styles/components/map/c-welcome-modal.scss';

class WelcomeModal extends Component {

  render() {
    return (
      <div className={styles['c-welcome-modal']}>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: this.props.content }} />
      </div>
    );
  }
}

WelcomeModal.propTypes = {
  closeModal: PropTypes.func,
  content: PropTypes.string
};

export default WelcomeModal;
