import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import BaseStyles from 'styles/_base.scss';
import IconStyles from 'styles/icons.scss';
import FooterStyles from 'styles/components/c-footer.scss';

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
      footerClass = classnames(FooterStyles['c-footer'], FooterStyles['-map'], FooterStyles['-expanded']);
    } else if (this.props.isMap) {
      footerClass = classnames(FooterStyles['c-footer'], FooterStyles['-map']);
    } else {
      footerClass = FooterStyles['c-footer'];
    }

    return (
      <div>
        {this.props.isMap && this.props.isExpanded &&
          <div
            className={FooterStyles.veil}
            onClick={this.props.onClose}
          />
        }
        <footer className={footerClass}>
          {this.props.isMap &&
            <div
              className={FooterStyles['close-button']}
              onClick={this.props.onClose}
            >
              <span className={FooterStyles.cross} />
            </div>}
          <div className={FooterStyles['scroll-container']}>
            <div className={BaseStyles.wrap}>
              <div className={FooterStyles['logos-footer']}>
                <div className={FooterStyles['partner-section']}>
                  <span className={FooterStyles['partner-text']}>Founding Partners</span>
                  <ul className={FooterStyles['logo-list']}>
                    <li className={FooterStyles['logo-item']}>
                      <img
                        className={classnames(FooterStyles.logo, FooterStyles['-oceana'])}
                        src={OceanaLogo}
                        alt="Oceana"
                      />
                    </li>
                    <li className={FooterStyles['logo-item']}>
                      <img
                        className={classnames(FooterStyles.logo, FooterStyles['-skytruth-logo'])}
                        src={SkytruthLogo}
                        alt="Skytruth"
                      />
                    </li>
                    <li className={FooterStyles['logo-item']}>
                      <img
                        className={FooterStyles.logo}
                        src={GoogleLogo}
                        alt="Google"
                      />
                    </li>
                  </ul>
                </div>
                <div className={FooterStyles['funder-section']}>
                  <ul className={FooterStyles['logo-funder-list']}>
                    <li className={FooterStyles['logo-item']}>
                      <LDFLogo className={classnames(IconStyles.icon, FooterStyles['logo-ldf'])} />
                    </li>
                  </ul>
                </div>
              </div>
              <div className={FooterStyles['map-section']}>
                <ul className={FooterStyles['nav-list']}>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/map">Map</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <a href={BLOG_URL} target="_blank" className={FooterStyles['nav-link']}>Blog</a>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link
                      className={FooterStyles['nav-link']}
                      to="/articles-publications"
                    >
                      Articles and Publications
                    </Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/faq">FAQ</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/tutorials">Tutorials</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/definitions">Definitions</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/the-project">The project</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/partners">Partners</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/research-program">Research program</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/contact-us">Contact us</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/terms-of-use">Terms of use</Link>
                  </li>
                  <li className={FooterStyles['nav-item']}>
                    <Link className={FooterStyles['nav-link']} to="/privacy-policy">Privacy policy</Link>
                  </li>
                </ul>
                <div className={FooterStyles['social-section']}>
                  <a
                    className={FooterStyles['button-subscribe']}
                    href="http://info.globalfishingwatch.org/catch_signup"
                    target="_blank"
                  >
                    sign up for email updates!
                    <SubscribeIcon className={classnames(IconStyles.icon, FooterStyles['icon-subscribe'])} />
                  </a>
                  <div className={FooterStyles['social-links']}>
                    <span className={FooterStyles['social-text']}>Follow us</span>
                    <ul className={FooterStyles['social-list']}>
                      <li className={FooterStyles['social-item']}>
                        <a href="https://twitter.com/GlobalFishWatch" target="_blank">
                          <TwitterIcon className={classnames(IconStyles.icon, FooterStyles['icon-twitter'])} />
                        </a>
                      </li>
                      <li className={FooterStyles['social-item']}>
                        <a href="https://www.facebook.com/GlobalFishingWatch/" target="_blank">
                          <FacebookIcon className={classnames(IconStyles.icon, FooterStyles['icon-facebook'])} />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {!this.props.isMap &&
              <div className={FooterStyles['sub-footer']}>
                <img className={FooterStyles['logo-gfw']} src={GFWLogo} alt="Global Fishing Watch" />
                <span className={FooterStyles['sub-footer-text']}>Global Fishing Watch</span>
              </div>}
          </div>
        </footer>
      </div>
    );
  }
}

Footer.propTypes = {
  isMap: React.PropTypes.bool,
  isExpanded: React.PropTypes.bool,
  onClose: React.PropTypes.func
};

Footer.defaultProps = {
  isMap: false,
  isExpanded: false
};

export default Footer;
