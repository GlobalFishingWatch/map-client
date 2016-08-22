import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from '../../../styles/components/shared/c-footer-mini.scss';
import layerStyle from '../../../styles/components/c-layer-back.scss';
import logooceana from '../../../assets/logos/oceana_logo_white.png';
import logosky from '../../../assets/logos/skytruth_logo.jpg';
import logogoogle from '../../../assets/logos/google_logo.png';
import Footer from './Footer';
import SupportModal from '../../components/Map/SupportModal';

class FooterMini extends Component {

  constructor(props) {
    super(props);
    this.state = {
      footerExpanded: false,
      showSupport: false
    };
  }

  toggleFooter() {
    this.setState({ footerExpanded: !this.state.footerExpanded });
  }

  showSupportModal() {
    this.setState({ showSupport: !this.state.showSupport });
  }

  render() {
    let expandedFooter;
    let supportModal;
    let layerModal;

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

    if (this.state.showSupport) {
      layerModal = (
        <div className={[layerStyle['c-layer-back'], layerStyle['-support-modal']].join(' ')}></div>
      );
      supportModal = (
        <SupportModal />
      );
    }

    let toggleLabel = (this.state.footerExpanded) ? 'Hide Footer' : 'Show Footer';

    return (
      <div>
        {layerModal}
        {supportModal}
        {expandedFooter}
        <footer className={styles['c-footer-mini']}>
          <div className={styles['contain-partners']}>
            <img className={styles.partner} src={logooceana} alt="oceana logo" />
            <img className={styles.partner} src={logosky} alt="skytruth logo" />
            <img className={styles.partner} src={logogoogle} alt="google logo" />
          </div>

          <ul className={styles.links}>
            <li><a onClick={() => this.toggleFooter()}>{toggleLabel}</a></li>
            <li><a href="https://carto.com/" target="_blank">CartoDB</a></li>
            <li><span>Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics</span></li>
            <li><Link to="/terms-of-use">Terms of use</Link></li>
            <li><a onClick={() => this.showSupportModal()}>Support</a></li>
          </ul>
        </footer>
      </div>
    );
  }
}

export default FooterMini;
