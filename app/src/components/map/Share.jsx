import React, { Component } from 'react';
import styles from '../../../styles/components/map/c-share.scss';

class Share extends Component {

  onCopy(e) {
    e.preventDefault();
    /* TODO */
  }

  render() {
    if (!this.props.workspaceId) {
      return (
        <div className={styles['c-share']}>
          <h2 className={styles.title}>Share this campaign</h2>
          <p>
            Saving your workspace...
          </p>
        </div>
      );
    }

    return (
      <div className={styles['c-share']}>
        <h2 className={styles.title}>Share this campaign</h2>
        <p className={styles.intro}>
          Copy and paste the link in email or IM
        </p>
        <form>
          <input className={styles['url-input']} type="text" readOnly value="" />
          <button className={styles['copy-button']} type="submit" onClick={() => this.onCopy()}>Copy</button>
        </form>
      </div>
    );
  }

}

Share.propTypes = {
  /**
   * Id of the created workspace
   */
  workspaceId: React.PropTypes.number
};

export default Share;
