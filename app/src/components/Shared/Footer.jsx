import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import logooceana from '../../../assets/logos/oceana_logo_white.png';
import logosky from '../../../assets/logos/skytruth_logo.jpg';
import logogoogle from '../../../assets/logos/google_logo.png';
import logoldf from '../../../assets/logos/ldf_logo_white.svg';
import logoGFW from '../../../assets/logos/gfw_logo.png';
import iconFacebook from '../../../assets/icons/facebook.svg';
import iconTwitter from '../../../assets/icons/twitter.svg';
import SubscribeSVG from '../../../assets/icons/subscribe.svg';


import AppStyles from '../../../styles/application.scss';
import footerStyle from '../../../styles/components/c-footer.scss';


export default function () {
  return (
    <footer className={footerStyle['c-footer']}>
      <div className={AppStyles.wrap}>
        <div className={footerStyle['logos-footer']}>
          <div className={footerStyle['partner-footer']}>
            <span className={footerStyle['partner-text']}>Founding Partners</span>
            <ul className={footerStyle['logo-list']}>
              <li className={footerStyle['logo-item']}>
                <img
                  className={[footerStyle.logo, footerStyle['-oceana']].join(' ')}
                  src={logooceana} alt="oceana logo"
                />
              </li>
              <li className={footerStyle['logo-item']}>
                <img className={footerStyle.logo} src={logosky} alt="skytruth logo" />
              </li>
              <li className={footerStyle['logo-item']}>
                <img className={footerStyle.logo} src={logogoogle} alt="google logo" />
              </li>
            </ul>
          </div>
          <div className={footerStyle['sponsor-footer']}>
            <ul className={footerStyle['logo-list-funding']}>
              <li className={classnames(footerStyle['logo-item'], footerStyle['-funding-logo'])}>
                <span className={footerStyle['funding-text']}>Funding Partners</span>
                <img className={footerStyle['logo-ldf']} src={logoldf} alt="ldf logo" />
              </li>
            </ul>
          </div>
        </div>
        <div className={footerStyle['nav-footer']}>
          <ul className={footerStyle['nav-section']}>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/map">Map</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <a href={BLOG_URL} target="_blank" className={footerStyle['nav-link']}>Blog</a>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/articles-publications">Articles and Publications</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/faq">FAQ</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/tutorials">Tutorials</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/definitions">Definitions</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/the-project">The project</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/partners">Partners</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/research-program">Research program</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/contact-us">Contact us</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/terms-of-use">Terms of use</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/privacy-policy">Privacy policy</Link>
            </li>
          </ul>
          <div className={footerStyle['social-section']}>
            <a
              className={footerStyle['subscribe-button']}
              href="http://info.globalfishingwatch.org/catch_signup"
              target="_blank"
            >
              SIGN UP FOR EMAIL UPDATES!
              <img
                className={footerStyle['email-subscribe']}
                src={SubscribeSVG} alt="subscribe news"
              />
            </a>

            <div className={footerStyle['social-links']}>
              <span className={footerStyle['social-text']}>Follow us</span>
              <ul className={footerStyle['social-list']}>
                <li className={footerStyle['social-item']}>
                  <a href="https://twitter.com/globalfishwatch" target="_blank">
                    <img src={iconTwitter} alt="Global Fishing Watch Twitter" />
                  </a>
                </li>
                <li className={footerStyle['social-item']}>
                  <a href="https://www.facebook.com/GlobalFishingWatch/" target="_blank">
                    <img src={iconFacebook} alt="Global Fishing Watch Facebook" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={footerStyle['second-footer']}>
        <img className={footerStyle['gfw-logo']} src={logoGFW} alt="Global Fishing Watch logo" />
        <span className={footerStyle['gfw-text']}>Global Fishing Watch</span>
      </div>
    </footer>
  );
}
