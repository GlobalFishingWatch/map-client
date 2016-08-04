import React, { Component } from 'react';
import styles from '../../../styles/components/map/c-share.scss';

class Share extends Component {

  onCopy(e) {
    e.preventDefault();
    /* TODO */
  }

  /**
   * Return the URL of the page with the workspace id included
   *
   * @returns {string} URL
   */
  getURLWithWorkspace() {
    return `${location.origin}${location.pathname}?workspaceId=${this.props.workspaceId}`;
  }

  render() {
    if (this.props.error) {
      return (
        <div className={styles['c-share']}>
          <h2 className={styles.title}>Share this campaign</h2>
          <p>
            Sorry, an error prevented the workspace to be saved. Try again.
          </p>
        </div>
      );
    }


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

    const url = this.getURLWithWorkspace();

    return (
      <div className={styles['c-share']}>
        <h2 className={styles.title}>Share this campaign</h2>
        <p className={styles.intro}>
          Copy and paste the link into an email or IM
        </p>
        <form>
          <input className={styles['url-input']} type="text" readOnly value={url} />
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
  workspaceId: React.PropTypes.string,
  /**
   * Possible error due to failed request to save the workspace
   */
  error: React.PropTypes.string
};

export default Share;
