import PropTypes from 'prop-types';
import React, { Component } from 'preact';
import classnames from 'classnames';
import BaseStyles from 'styles/_base.scss';
import IconStyles from 'styles/icons.scss';
import FooterStyles from 'styles/components/footer.scss';
import OceanaLogo from 'assets/logos/oceana_logo_white.png';
import SkytruthLogo from 'assets/logos/skytruth_white.png';
import GoogleLogo from 'assets/logos/google_logo.png';
import GFWLogo from 'assets/logos/gfw_logo.png';
import LDFLogo from 'babel!svg-react!assets/logos/ldf_logo_white.svg?name=LDFLogo';
import FacebookIcon from 'babel!svg-react!assets/icons/facebook.svg?name=FacebookIcon';
import TwitterIcon from 'babel!svg-react!assets/icons/twitter.svg?name=TwitterIcon';
import SubscribeIcon from 'babel!svg-react!assets/icons/subscribe.svg?name=SubscribeIcon';

class Footer extends Component {

  render() {
    let footerClass;

    if (this.props.isMap && this.props.isExpanded) {
      footerClass = classnames(FooterStyles.footer, FooterStyles._map, FooterStyles._expanded);
    } else if (this.props.isMap) {
      footerClass = classnames(FooterStyles.footer, FooterStyles._map);
    } else {
      footerClass = FooterStyles.footer;
    }

    return (
      <div>
        {this.props.isMap && this.props.isExpanded &&
        <div
          className={FooterStyles.veil}
          onClick={this.props.onClose}
        />
        }
        <footer className={footerClass} >
          {this.props.isMap &&
          <div
            className={FooterStyles.closeButton}
            onClick={this.props.onClose}
          >
            <span className={FooterStyles.cross} />
          </div>}
          <div className={FooterStyles.scrollContainer} >
            <div className={BaseStyles.wrap} >
              <div className={FooterStyles.logosFooter} >
                <div className={FooterStyles.partnerSection} >
                  <span className={FooterStyles.partnerText} >Founding Partners</span>
                  <ul className={FooterStyles.logoList} >
                    <li className={FooterStyles.logoItem} >
                      <img
                        className={classnames(FooterStyles.logo, FooterStyles._oceana)}
                        src={OceanaLogo}
                        alt="Oceana"
                      />
                    </li>
                    <li className={FooterStyles.logoItem} >
                      <img
                        className={classnames(FooterStyles.logo, FooterStyles._skytruthLogo)}
                        src={SkytruthLogo}
                        alt="Skytruth"
                      />
                    </li>
                    <li className={FooterStyles.logoItem} >
                      <img
                        className={FooterStyles.logo}
                        src={GoogleLogo}
                        alt="Google"
                      />
                    </li>
                  </ul>
                </div>
                <div className={FooterStyles.funderSection} >
                  <ul className={FooterStyles.logoFunderList} >
                    <li className={FooterStyles.logoItem} >
                      <LDFLogo className={classnames(IconStyles.icon, FooterStyles.logoLdf)} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className={FooterStyles.mapSection} >
                <ul className={FooterStyles.navList} >
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={SITE_URL} >Home</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className={FooterStyles.navLink} >Blog</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a
                      className={FooterStyles.navLink}
                      href={`${SITE_URL}/articles-publications`}
                    >
                      Articles and Publications
                    </a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/faq`} >FAQ</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/tutorials`} >Tutorials</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/definitions`} >Definitions</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/the-project`} >The project</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/partners`} >Partners</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/research-program`} >Research program</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/contact-us`} >Contact us</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/terms-of-use`} >Terms of use</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/privacy-policy`} >Privacy policy</a>
                  </li>
                  {this.props.isMap &&
                  <li className={FooterStyles.navItem} >
                    <span className={FooterStyles.navLink} onClick={this.props.onOpenSupportModal} >Support</span>
                  </li>}
                </ul>
                <div className={FooterStyles.socialSection} >
                  <a
                    className={FooterStyles.buttonSubscribe}
                    href="http://info.globalfishingwatch.org/catch_signup"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    sign up for email updates!
                    <SubscribeIcon className={classnames(IconStyles.icon, FooterStyles.iconSubscribe)} />
                  </a>
                  <div className={FooterStyles.socialLinks} >
                    <span className={FooterStyles.socialText} >Follow us</span>
                    <ul className={FooterStyles.socialList} >
                      <li className={FooterStyles.socialItem} >
                        <a
                          href="https://twitter.com/GlobalFishWatch"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <TwitterIcon className={classnames(IconStyles.icon, FooterStyles.iconTwitter)} />
                        </a>
                      </li>
                      <li className={FooterStyles.socialItem} >
                        <a
                          href="https://www.facebook.com/GlobalFishingWatch/"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <FacebookIcon className={classnames(IconStyles.icon, FooterStyles.iconFacebook)} />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {!this.props.isMap &&
            <div className={FooterStyles.subFooter} >
              <img className={FooterStyles.logoGfw} src={GFWLogo} alt="Global Fishing Watch" />
              <span className={FooterStyles.subFooterText} >Global Fishing Watch</span>
            </div>}
          </div>
        </footer>
      </div>
    );
  }
}

Footer.propTypes = {
  isMap: PropTypes.bool,
  isExpanded: PropTypes.bool,
  onClose: PropTypes.func,
  onOpenSupportModal: PropTypes.func
};

Footer.defaultProps = {
  isMap: false,
  isExpanded: false
};

export default Footer;
