import React from 'react';
import { Link } from 'react-router';
import '../../../styles/components/c-footer.scss';
import navfooter from '../../../styles/components/c-nav-footer.scss';
import logosfooter from '../../../styles/components/c-logos-footer.scss';
import logooceana from '../../../assets/logos/oceana_logo.png';
import logosky from '../../../assets/logos/skytruth_logo.jpg';
import logogoogle from '../../../assets/logos/google_logo.png';
import logoldf from '../../../assets/logos/ldf_logo.png';

export default function () {
  return (
    <footer>
      <div className={logosfooter.c_logos_footer}>
        <div className={logosfooter.partner_footer}>
          <span>Founding Partners</span>
          <img className={logosfooter.first_partner} src={logooceana} alt="oceana logo" />
          <img src={logosky} alt="skytruth logo" />
          <img src={logogoogle} alt="google logo" />
        </div>
        <div className={logosfooter.sponsor_footer}>
          <img className={logosfooter.first_partner} src={logoldf} alt="ldf logo" />
        </div>
      </div>
      <div className={navfooter.c_nav_footer}>
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
          <li><Link to="#">SUBSCRIBE TO NEWS</Link></li>
        </ul>
      </div>
    </footer>
  );
}
