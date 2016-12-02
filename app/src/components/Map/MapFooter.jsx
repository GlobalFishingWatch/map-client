import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import FormSupport from 'containers/Map/SupportForm';
import Footer from 'components/Shared/Footer';
import Modal from 'components/Shared/Modal';
// import SupportModal from 'components/Map/SupportModal';

import MapFooterStyles from 'styles/components/map/c-map-footer.scss';
import ContainerFooterStyle from 'styles/components/shared/c-container-footer.scss';

import logooceana from 'assets/logos/oceana_logo_white.png';
import logosky from 'assets/logos/skytruth_white.png';
import logogoogle from 'assets/logos/google_logo.png';

class MapFooter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      footerExpanded: false,
      showSupport: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  showSupportModal() {
    this.setState({ showSupport: !this.state.showSupport });
  }

  toggleFooter() {
    this.setState({ footerExpanded: !this.state.footerExpanded });
  }

  render() {
    let supportModal;

    // if (this.state.footerExpanded) {
    //   expandedFooter = (
    //     <div className={ContainerFooterStyle['footer-expanded']}>
    //       <Footer
    //         isMap
    //       />
    //     </div>
    //   );
    // }
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
        <footer className={MapFooterStyles['c-footer-mini']}>
          <div className={MapFooterStyles['contain-partners']}>
            <img
              className={classnames(MapFooterStyles.partner, MapFooterStyles.oceana)}
              src={logooceana}
              alt="Oceana"
            />
            <img
              className={classnames(MapFooterStyles.partner, MapFooterStyles['-skytruth-logo'])}
              src={logosky}
              alt="Skytruth"
            />
            <img
              className={classnames(MapFooterStyles.partner, MapFooterStyles['-google'])}
              src={logogoogle}
              alt="Google"
            />
          </div>

          <ul className={MapFooterStyles.links}>
            <li className={classnames(MapFooterStyles.attributions, MapFooterStyles['-footer'])}>
              <a onClick={() => this.toggleFooter()}>{toggleLabel}</a>
            </li>
            <li className={MapFooterStyles.attributions}><a href="https://carto.com/" target="_blank">CartoDB</a></li>
            <li className={MapFooterStyles.attributions}>
              <span>Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics, EEZs:{' '}
                <a href="http://marineregions.org/" target="_blank">marineregions.org</a>, MPAs:{' '}
                <a href="http://mpatlas.org/">mpatlas.org</a>
              </span>
            </li>
            <li className={MapFooterStyles.attributions}><Link to="/terms-of-use">Terms of use</Link></li>
            <li className={MapFooterStyles.attributions}><a onClick={() => this.showSupportModal()}>Support</a></li>
          </ul>
        </footer>
        <Footer
          isMap
          expanded={this.state.footerExpanded}
        />
      </div>
    );
  }
}

export default MapFooter;
