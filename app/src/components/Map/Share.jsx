import React, { Component } from 'react';
import classnames from 'classnames';

import facebookIcon from '../../../assets/icons/facebook.svg';
import twitterIcon from '../../../assets/icons/twitter.svg';
import googlePlusIcon from '../../../assets/icons/google-plus.svg';

import styles from '../../../styles/components/map/c-share.scss';


class Share extends Component {

  constructor(props) {
    super(props);

    this.state = {
      copied: false,   // If the input's content has been copied
      copyError: false // If the copy action failed
    };
  }

  /**
   * Copy the input's content into the clipboard and set the state's "copied"
   * attribute to true. If the action failed, set the "copyError" attribute to
   * true. After few milliseconds, the "copied" attribute is resetted to false
   * to display a quick visual feedback.
   *
   * @param {object} e - click event on the button
   */
  onCopy(e) {
    e.preventDefault();

    this.refs.input.select();

    let error = false;
    try {
      if (!document.execCommand('copy')) error = true;
    } catch (err) {
      error = true;
    }

    this.setState({
      copied: !error,
      error
    });

    /* We want the copied state to only last few millisecond to display a visual
     * feedback */
    if (!error) setTimeout(() => this.setState({ copied: false }), 1000);
  }

  /**
   * Return the URL of the page with the workspace id included
   *
   * @returns {string} URL
   */
  getURLWithWorkspace() {
    return `${location.origin}${location.pathname}?workspace=${this.props.workspaceId}`;
  }

  // openFacebook(e) {
  //   console.log(e);
  // }
  //
  // openGooglePlus(e) {
  //   console.log(e);
  // }
  //
  // openTwitter(e) {
  //   console.log(e);
  // }

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
    const copyError = (
      <p className={styles['copy-error']}>
        Sorry, the link couldn't be copied. Please right click on the input and copy it manually.
      </p>
    );

    return (
      <div className={styles['c-share']}>
        <h2 className={styles.title}>Share this campaign</h2>
        <p className={styles.intro}>
          Copy and paste the link into an email or IM
        </p>
        <form>
          <input className={styles['url-input']} type="text" readOnly value={url} ref="input" />
          <button className={styles['copy-button']} type="submit" onClick={e => this.onCopy(e)}>
            {this.state.copied ? 'Copied!' : 'Copy'}
          </button>
        </form>
        <div className={styles.separator}>
          <span className={styles['word-separator']}>or</span>
        </div>
        <div className={styles['social-links']}>
          <button
            className={classnames(styles['social-button'], styles['-facebook'])}
            onClick={e => this.openFacebook(e)}
          >
            <img src={facebookIcon} alt="Global Fishing Watch Facebook" />
            <span className={styles['button-text']}>facebook</span>
          </button>
          <button
            className={classnames(styles['social-button'], styles['-googleplus'])}
            onClick={e => this.openGooglePlus(e)}
          >
            <img src={googlePlusIcon} alt="Global Fishing Watch Google+" />
            <span className={styles['button-text']}>Google</span>
          </button>
          <button
            className={classnames(styles['social-button'], styles['-twitter'])}
            onClick={e => this.openTwitter(e)}
          >
            <img src={twitterIcon} alt="Global Fishing Watch Twitter" />
            <span className={styles['button-text']}>Twitter</span>
          </button>
        </div>

        {this.state.error && copyError}
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
