/* eslint-disable react/no-danger */
import React, { Component } from 'react';
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
  closeModal: React.PropTypes.func,
  content: React.PropTypes.string
};

export default WelcomeModal;
