import React, { Component } from 'react';
import styles from '../../../styles/components/shared/c-footer-mini.scss';
import logooceana from '../../../assets/logos/oceana_logo.png';
import logosky from '../../../assets/logos/skytruth_logo.jpg';
import logogoogle from '../../../assets/logos/google_logo.png';

class FooterMini extends Component {

  constructor(props) {
    super(props);
    this.state = {
      footerExpanded: false
    };
  }

  toggleFooter() {
    this.setState({ footerExpanded: !this.state.footerExpanded });
  }

  render() {
    if (this.state.footerExpanded) {
      return (
        <div>Show full footer, don't remove mini one (we still need the link to hide the footer)?</div>
      );
    }

    /**
     * TODO:
     * Don't hide mini footer because we need the link to toggle the full footer
     * Need to review the link and the legal terms
     */

    return (
      <footer className={styles['c-footer-mini']}>
        <div className={styles.partners}>
          <img className={styles.partner} src={logooceana} alt="oceana logo" />
          <img className={styles.partner} src={logosky} alt="skytruth logo" />
          <img className={styles.partner} src={logogoogle} alt="google logo" />
        </div>

        <ul className={styles.links}>
          <li><a onClick={() => this.toggleFooter()}>Show Footer</a></li>
          <li>CARTO</li>
          <li>Map data ©2016 Google, INEGI</li>
          <li>Terms of Use</li>
        </ul>
      </footer>
    );
  }
}

export default FooterMini;
