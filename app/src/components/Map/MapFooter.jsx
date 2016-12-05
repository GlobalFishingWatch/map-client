import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import Footer from 'components/Shared/Footer';

import MapFooterStyles from 'styles/components/map/c-map-footer.scss';

import OceanaLogo from 'assets/logos/oceana_logo_white.png';
import SkytruthLogo from 'assets/logos/skytruth_white.png';
import GoogleLogo from 'assets/logos/google_logo.png';

class MapFooter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      footerExpanded: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  toggleFooter() {
    this.setState({ footerExpanded: !this.state.footerExpanded });
  }

  render() {
    const toggleLabel = (this.state.footerExpanded) ? 'Hide Footer' : 'Show Footer';

    return (
      <div className={MapFooterStyles['overflow-container']}>
        <div className={MapFooterStyles['c-map-footer']}>
          <ul className={MapFooterStyles['logo-list']}>
            <li className={MapFooterStyles['logo-item']}>
              <img
                className={classnames(MapFooterStyles.logo, MapFooterStyles['-oceana'])}
                src={OceanaLogo}
                alt="Oceana"
              />
            </li>
            <li className={MapFooterStyles['logo-item']}>
              <img
                className={classnames(MapFooterStyles.logo, MapFooterStyles['-skytruth'])}
                src={SkytruthLogo}
                alt="Skytruth"
              />
            </li>
            <li className={MapFooterStyles['logo-item']}>
              <img
                className={classnames(MapFooterStyles.logo, MapFooterStyles['-google'])}
                src={GoogleLogo}
                alt="Google"
              />
            </li>
          </ul>
          <div className={MapFooterStyles.options}>
            <span
              className={classnames(MapFooterStyles.link, MapFooterStyles['-footer'])}
              onClick={() => this.toggleFooter()}
            >
              {toggleLabel}
            </span>
            <ul className={MapFooterStyles['attribution-list']}>
              <li className={MapFooterStyles['attribution-item']}>
                <a
                  className={MapFooterStyles.link}
                  href="https://carto.com/"
                  target="_blank"
                >
                  CartoDB
                </a>
              </li>
              <li className={classnames(MapFooterStyles.link, MapFooterStyles['attribution-item'])}>
                <span className={MapFooterStyles['attribution-item']}>
                  Map data ©2016 Google, INEGI Imagery ©2016 NASA, TerraMetrics, EEZs:{' '}
                  <a
                    className={MapFooterStyles.link}
                    href="http://marineregions.org/"
                    target="_blank"
                  >
                    marineregions.org
                  </a>, MPAs:{' '}
                  <a
                    className={MapFooterStyles.link}
                    href="http://mpatlas.org/"
                    target="_blank"
                  >
                    mpatlas.org
                  </a>
                </span>
              </li>
            </ul>
            <span
              className={classnames(MapFooterStyles.link, MapFooterStyles['-support'])}
              onClick={this.props.onOpenSupportModal}
            >
              Support
            </span>
            <Link
              className={classnames(MapFooterStyles.link, MapFooterStyles['-terms-of-use'])}
              to="/terms-of-use"
            >Terms of use</Link>
          </div>
        </div>
        <Footer
          isMap
          isExpanded={this.state.footerExpanded}
          onClose={() => this.onCloseFooter()}
        />
      </div>
    );
  }
}

MapFooter.propTypes = {
  onOpenSupportModal: React.PropTypes.func
};

export default MapFooter;
