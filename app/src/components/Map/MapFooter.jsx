import React, { Component } from 'react';
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

  onCloseFooter() {
    this.setState({ footerExpanded: false });
  }

  toggleFooter() {
    this.setState({ footerExpanded: !this.state.footerExpanded });
  }

  render() {
    const toggleLabel = (this.state.footerExpanded) ? 'Hide Footer' : 'Show Footer';

    return (
      <div className={MapFooterStyles['overflow-container']} >
        <div className={MapFooterStyles['c-map-footer']} >
          <div className={MapFooterStyles['logo-list']} >
            <img
              className={classnames(MapFooterStyles.logo, MapFooterStyles['-oceana'])}
              src={OceanaLogo}
              alt="Oceana"
            />
            <img
              className={classnames(MapFooterStyles.logo, MapFooterStyles['-skytruth'])}
              src={SkytruthLogo}
              alt="Skytruth"
            />
            <img
              className={classnames(MapFooterStyles.logo, MapFooterStyles['-google'])}
              src={GoogleLogo}
              alt="Google"
            />
          </div>

          <div className={MapFooterStyles.options} >
            {!this.props.isEmbedded &&
            <span
              className={classnames(MapFooterStyles.link, MapFooterStyles['-footer'])}
              onClick={() => this.toggleFooter()}
            >
              {toggleLabel}
            </span>
            }
            <span className={classnames(MapFooterStyles.link, MapFooterStyles['-attributions'])} >
              <a
                className={MapFooterStyles.link}
                href="https://carto.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CartoDB
              </a>
              {' '} Map data ©2016 Google, INEGI Imagery ©2016 NASA, <br />TerraMetrics, EEZs:{' '}
              <a
                className={MapFooterStyles.link}
                href="http://marineregions.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                marineregions.org
              </a>, MPAs:{' '}
              <a
                className={MapFooterStyles.link}
                href="http://mpatlas.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                mpatlas.org
              </a>
            </span>
            <span
              className={classnames(MapFooterStyles.link, MapFooterStyles['-support'])}
              onClick={this.props.onOpenSupportModal}
            >
              Support
            </span>
            <a
              className={classnames(MapFooterStyles.link, MapFooterStyles['-terms-of-use'])}
              href={`${SITE_URL}/terms-of-use`}
            >Terms of use</a>
          </div>
        </div>
        <Footer
          isMap
          isExpanded={this.state.footerExpanded}
          onClose={() => this.onCloseFooter()}
          onOpenSupportModal={this.props.onOpenSupportModal}
        />
      </div>
    );
  }
}

MapFooter.propTypes = {
  onOpenSupportModal: React.PropTypes.func,
  isEmbedded: React.PropTypes.bool
};

export default MapFooter;
