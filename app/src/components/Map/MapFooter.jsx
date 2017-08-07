import PropTypes from 'prop-types';
import React, { Component } from 'preact';
import classnames from 'classnames';
import Footer from 'components/Shared/Footer';
import MapFooterStyles from 'styles/components/map/map-footer.scss';
import OceanaLogo from 'assets/logos/oceana_logo_white.png';
import SkytruthLogo from 'assets/logos/skytruth_white.png';
import GoogleLogo from 'assets/logos/google_logo.png';

class MapFooter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      footerExpanded: false
    };
    this.onExternalLink = this.onExternalLink.bind(this);
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

  onExternalLink(e) {
    e.preventDefault();
    const link = e.target.href;
    if (typeof link !== 'undefined') {
      this.props.onExternalLink(link);
    }
  }

  render() {
    const toggleLabel = (this.state.footerExpanded) ? 'Hide Footer' : 'Show Footer';

    return (
      <div className={MapFooterStyles.overflowContainer} >
        <div className={MapFooterStyles.mapFooter} >
          <div className={MapFooterStyles.logoList} >
            <img
              className={classnames(MapFooterStyles.logo, MapFooterStyles._oceana)}
              src={OceanaLogo}
              alt="Oceana"
            />
            <img
              className={classnames(MapFooterStyles.logo, MapFooterStyles._skytruth)}
              src={SkytruthLogo}
              alt="Skytruth"
            />
            <img
              className={classnames(MapFooterStyles.logo, MapFooterStyles._google)}
              src={GoogleLogo}
              alt="Google"
            />
          </div>

          <div className={classnames(MapFooterStyles.options, { [MapFooterStyles._embed]: this.props.isEmbedded })} >
            {!this.props.isEmbedded &&
            <span
              className={classnames(MapFooterStyles.link, MapFooterStyles._footer)}
              onClick={() => this.toggleFooter()}
            >
              {toggleLabel}
            </span>
            }
            <span
              className={classnames(MapFooterStyles.link, MapFooterStyles._attributions)}
              onClick={this.onExternalLink}
            >
              <a
                className={MapFooterStyles.link}
                href="https://carto.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CARTO
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
              className={classnames(MapFooterStyles.link, MapFooterStyles._support)}
              onClick={this.props.onOpenSupportModal}
            >
              Support
            </span>
            <a
              className={classnames(MapFooterStyles.link, MapFooterStyles._termsOfUse)}
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
  onOpenSupportModal: PropTypes.func,
  isEmbedded: PropTypes.bool,
  onExternalLink: PropTypes.func
};

export default MapFooter;
