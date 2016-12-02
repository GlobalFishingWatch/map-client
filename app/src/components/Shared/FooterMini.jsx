import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import styles from 'styles/components/shared/c-footer-mini.scss';
import ContainerFooterStyle from 'styles/components/shared/c-container-footer.scss';
import logooceana from 'assets/logos/oceana_logo_white.png';
import logosky from 'assets/logos/skytruth_white.png';
import logogoogle from 'assets/logos/google_logo.png';
import Footer from 'components/Shared/Footer';
import FormSupport from 'containers/Map/SupportForm';
import Modal from 'components/Shared/Modal';
// import SupportModal from 'components/Map/SupportModal';

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

    if (this.state.footerExpanded) {
      expandedFooter = (
        <div className={ContainerFooterStyle['footer-expanded']}>
          <Footer />
        </div>
      );
    }
    if (this.state.showSupport) {
      supportModal = (
        <Modal
          opened
          closeable
          close={() => this.showSupportModal()}
        >
          <FormSupport close={() => this.showSupportModal()} />
        </Modal>
      );
    }

    const toggleLabel = (this.state.footerExpanded) ? 'Hide Footer' : 'Show Footer';

    return (
      <div>
        {supportModal}
        <div className={ContainerFooterStyle['c-container-footer']}>
          {expandedFooter}
          {!this.state.footerExpanded && <div className={ContainerFooterStyle['contain-responsive-attributions']}>
            <ul>
              <li><a href="https://carto.com/" target="_blank">Carto</a></li>
              <li>
                <span>Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics, EEZs:{' '}
                  <a href="http://marineregions.org/" target="_blank">marineregions.org</a>, MPAs:{' '}
                  <a href="http://mpatlas.org/">mpatlas.org</a>
                </span>
              </li>
            </ul>
          </div>}
          <div
            className={ContainerFooterStyle['contain-responsive-buttons']}
            style={this.state.footerExpanded ? {
              marginTop: '20px'
            } : null}
          >
            <span onClick={() => this.toggleFooter()}>{toggleLabel}</span>
            <span onClick={() => this.showSupportModal()}>Support</span>
          </div>
        </div>
        <footer className={styles['c-footer-mini']}>
          <div className={styles['contain-partners']}>
            <img className={classnames(styles.partner, styles.oceana)} src={logooceana} alt="oceana logo" />
            <img className={classnames(styles.partner, styles['-skytruth-logo'])} src={logosky} alt="skytruth logo" />
            <img className={classnames(styles.partner, styles['-google'])} src={logogoogle} alt="google logo" />
          </div>

          <ul className={styles.links}>
            <li className={classnames(styles.attributions, styles['-footer'])}>
              <a onClick={() => this.toggleFooter()}>{toggleLabel}</a>
            </li>
            <li className={styles.attributions}><a href="https://carto.com/" target="_blank">CartoDB</a></li>
            <li className={styles.attributions}>
              <span>Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics, EEZs:{' '}
                <a href="http://marineregions.org/" target="_blank">marineregions.org</a>, MPAs:{' '}
                <a href="http://mpatlas.org/">mpatlas.org</a>
              </span>
            </li>
            <li className={styles.attributions}><Link to="/terms-of-use">Terms of use</Link></li>
            <li className={styles.attributions}><a onClick={() => this.showSupportModal()}>Support</a></li>
          </ul>
        </footer>
      </div>
    );
  }
}

FooterMini.propTypes = {
  setVisibleSupportModal: React.PropTypes.func,
  supportModalVisible: React.PropTypes.bool
};

export default FooterMini;
