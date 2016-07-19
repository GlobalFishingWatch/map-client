import React from "react";
import home from "../../styles/components/c_footer.scss";
import navfooter from "../../styles/components/c_nav_footer.scss";
import logosfooter from "../../styles/components/c_logos_footer.scss";
import logooceana from "../../assets/logos/oceana_logo.png";
import logosky from "../../assets/logos/skytruth_logo.jpg";

export default function (props) {
  return (
    <footer>
      <div className={logosfooter.c_logos_footer}>
        <div className={logosfooter.partner_footer}>
          <span>Founding Partners</span>
          <img className={logosfooter.first_partner} src={logooceana} alt="oceana logo"></img>
          <img src={logosky} alt="skytruth logo"></img>
          <img src="app/assets/partners/google.png"></img>
        </div>
        <div className={logosfooter.sponsor_footer}>
          <span>Lead Sponsor</span>
        </div>
      </div>
      <div className={navfooter.c_nav_footer}>
        <ul>
          <li><a href="/map">Map</a></li>
          <li><a href="/news">News</a></li>
          <li>how to</li>
          <li>about</li>
        </ul>
        <ul>
          <li>terms of use</li>
          <li>privacy policy</li>
          <li>contact us</li>
        </ul>
        <ul>
          <li>Follow us</li>
          <li>ICONS</li>
        </ul>
        <ul>
          <li>SUBSCRIBE TO NEWS</li>
          <li><a href="#" target="_blank">Go to form</a></li>
        </ul>
      </div>
      <div className={home.project_name_footer}></div>
    </footer>
  )
};
