import React from 'react';
import { Link } from 'react-router';
import SocialFooter from '../Shared/SocialContentFooter';
import logooceana from '../../../assets/logos/oceana_logo_white.png';
import logosky from '../../../assets/logos/skytruth_logo.jpg';
import logogoogle from '../../../assets/logos/google_logo.png';
import logoldf from '../../../assets/logos/ldf_logo_white.svg';
import logoGFW from '../../../assets/logos/gfw_logo.png';


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
            <ul className={footerStyle['logo-list']}>
              <li className={footerStyle['logo-item']}>
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
          </ul>
          <ul className={footerStyle['nav-section']}>
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
          </ul>
          <ul className={footerStyle['nav-section']}>
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

          <ul className={footerStyle['nav-section-mobile']}>
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
              <Link className={footerStyle['nav-link']} to="/research-program">Research program</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/contact-us">Contact us</Link>
            </li>
          </ul>

          <ul className={footerStyle['nav-section-mobile']}>
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
              <Link className={footerStyle['nav-link']} to="/terms-of-use">Terms of use</Link>
            </li>
            <li className={footerStyle['nav-item']}>
              <Link className={footerStyle['nav-link']} to="/privacy-policy">Privacy policy</Link>
            </li>
          </ul>
          <SocialFooter />
        </div>
        <SocialFooter />
      </div>
      <div className={footerStyle['second-footer']}>
        <img className={footerStyle['gfw-logo']} src={logoGFW} alt="Global Fishing Watch logo" />
        <span className={footerStyle['gfw-text']}>Global Fishing Watch</span>
      </div>
    </footer>
  );
}
