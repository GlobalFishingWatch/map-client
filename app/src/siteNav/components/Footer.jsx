import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import BaseStyles from 'styles/_base.scss';
import IconStyles from 'styles/icons.scss';
import FooterStyles from 'styles/components/footer.scss';
import OceanaLogo from 'assets/logos/oceana_logo_white.png';
import SkytruthLogo from 'assets/logos/skytruth_white.png';
import GoogleLogo from 'assets/logos/google_logo.png';
import LDFLogo from '-!babel-loader!svg-react-loader!assets/logos/ldf_logo_white.svg?name=LDFLogo';
import FacebookIcon from '-!babel-loader!svg-react-loader!assets/icons/facebook.svg?name=FacebookIcon';
import TwitterIcon from '-!babel-loader!svg-react-loader!assets/icons/twitter.svg?name=TwitterIcon';
import SubscribeIcon from '-!babel-loader!svg-react-loader!assets/icons/subscribe.svg?name=SubscribeIcon';

class Footer extends Component {

  render() {
    let footerClass;

    if (this.props.isExpanded) {
      footerClass = classnames(FooterStyles.footer, FooterStyles._map, FooterStyles._expanded);
    } else {
      footerClass = classnames(FooterStyles.footer, FooterStyles._map);
    }

    return (
      <div>
        {this.props.isExpanded &&
        <div
          className={FooterStyles.veil}
          onClick={this.props.onClose}
        />
        }
        <footer className={footerClass} >
          <div
            className={FooterStyles.closeButton}
            onClick={this.props.onClose}
          >
            <span className={FooterStyles.cross} />
          </div>
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
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/transparency-platform/`} >Our Platform</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/research/`} >Research</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/use-the-data/`} >Use the Data</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/initiatives/`} >Initiatives</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/publications/`} >Publications & Tools</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/transparency-makes-a-difference/`} >Making a Difference</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/media-center/`} >Media Center</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/about-us/`} >Our Mission</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/contact-us/`} >Contact us</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/terms-of-use/`} >Terms of use</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <a className={FooterStyles.navLink} href={`${SITE_URL}/privacy-policy/`} >Privacy policy</a>
                  </li>
                  <li className={FooterStyles.navItem} >
                    <span className={FooterStyles.navLink} onClick={this.props.onOpenSupportModal} >Support</span>
                  </li>
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
          </div>
        </footer>
      </div>
    );
  }
}

Footer.propTypes = {
  isExpanded: PropTypes.bool,
  onClose: PropTypes.func,
  onOpenSupportModal: PropTypes.func
};

Footer.defaultProps = {
  isExpanded: false
};

export default Footer;
