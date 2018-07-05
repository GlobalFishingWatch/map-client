import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import Footer from 'siteNav/components/Footer';
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

  renderAttribution() {
    return <span dangerouslySetInnerHTML={{ __html: this.props.attributions.join(', ') }} />;
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
            <span>
              <span
                className={classnames(MapFooterStyles.link, MapFooterStyles._footer)}
                onClick={() => this.toggleFooter()}
              >
                {toggleLabel}
              </span>
              <span className={MapFooterStyles.betaPill}>Beta</span>
            </span>
            }

            <span
              className={classnames(MapFooterStyles.link, MapFooterStyles._attributions)}
              onClick={this.onExternalLink}
            >
              {this.renderAttribution()}
            </span>

            <span
              className={classnames(MapFooterStyles.link, MapFooterStyles._support)}
              onClick={this.props.onOpenSupportFormModal}
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
          isExpanded={this.state.footerExpanded}
          onClose={() => this.onCloseFooter()}
          onOpenSupportModal={this.props.onOpenSupportFormModal}
        />
      </div>
    );
  }
}

MapFooter.propTypes = {
  onOpenSupportFormModal: PropTypes.func,
  isEmbedded: PropTypes.bool,
  attributions: PropTypes.array,
  onExternalLink: PropTypes.func
};

export default MapFooter;
