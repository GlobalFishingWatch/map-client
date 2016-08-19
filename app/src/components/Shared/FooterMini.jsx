import React, { Component } from 'react';
import styles from '../../../styles/components/shared/c-footer-mini.scss';
import logooceana from '../../../assets/logos/oceana_logo.png';
import logosky from '../../../assets/logos/skytruth_logo.jpg';
import logogoogle from '../../../assets/logos/google_logo.png';
import Footer from './Footer';

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
    let expandedFooter;
    if (this.state.footerExpanded) {
      expandedFooter = (
        <div
          style={{
            position: 'absolute',
            bottom: '38px',
            width: '100%'
          }}
        >
          <Footer />
        </div>
      );
    }

    let toggleLabel = (this.state.footerExpanded) ? 'Hide Footer' : 'Show Footer';

    return (
      <div>
        {expandedFooter}
        <footer className={styles['c-footer-mini']}>
          <div className={styles.partners}>
            <img className={styles.partner} src={logooceana} alt="oceana logo" />
            <img className={styles.partner} src={logosky} alt="skytruth logo" />
            <img className={styles.partner} src={logogoogle} alt="google logo" />
          </div>

          <ul className={styles.links}>
            <li><a onClick={() => this.toggleFooter()}>{toggleLabel}</a></li>
          </ul>
        </footer>
      </div>
    );
  }
}

export default FooterMini;
