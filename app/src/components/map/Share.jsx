import React, { Component } from 'react';
import styles from '../../../styles/components/map/c-share.scss';

class Share extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  onCopy(e) {
    e.preventDefault();
    /* TODO */
  }

  render() {
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

export default Share;
