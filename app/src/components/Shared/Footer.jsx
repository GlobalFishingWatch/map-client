import React from 'react';
import { Link } from 'react-router';
import footerStyle from '../../../styles/components/c-footer.scss';
import logooceana from '../../../assets/logos/oceana_logo.png';
import logosky from '../../../assets/logos/skytruth_logo.jpg';
import logogoogle from '../../../assets/logos/google_logo.png';
import logoldf from '../../../assets/logos/ldf_logo.png';
import logoGFWHorizontal from '../../../assets/logos/gfw_logo_hor_white.png';

export default function () {
  return (
    <footer>
      <div className={footerStyle['logos-footer']}>
        <div className={footerStyle['partner-footer']}>
          <span>Founding Partners</span>
          <img className={footerStyle['first-partner']} src={logooceana} alt="oceana logo" />
          <img src={logosky} alt="skytruth logo" />
          <img src={logogoogle} alt="google logo" />
        </div>
        <div className={footerStyle['sponsor-footer']}>
          <img className={footerStyle['first-partner']} src={logoldf} alt="ldf logo" />
        </div>
      </div>
      <div className={footerStyle['nav-footer']}>
        <ul>
          <li><Link to="/map">Map</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/articles-publications">Articles and Publications</Link></li>
        </ul>
        <ul>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/tutorials">Tutorials</Link></li>
          <li><Link to="/definitions">Definitions</Link></li>
        </ul>
        <ul>
          <li><Link to="/the-project">The project</Link></li>
          <li><Link to="/partners">Partners</Link></li>
          <li><Link to="/contact-us">Contact us</Link></li>
        </ul>
        <ul>
          <li><Link to="/terms-of-use">Terms of Use</Link></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="#">Follow us</Link></li>
        </ul>
        <div>
          <a
            className={footerStyle['subscribe-button']}
            href="http://info.globalfishingwatch.org/catch_signup"
            target="_blank"
          >
            SIGN UP FOR EMAIL UPDATES!
          </a>
        </div>
      </div>
      <div className={footerStyle['second-footer']}>
        <img src={logoGFWHorizontal} alt="GFW logo" />
      </div>
    </footer>
  );
}
