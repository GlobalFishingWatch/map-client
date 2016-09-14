import React, { Component } from 'react';
import classnames from 'classnames';
import BaseStyle from '../../../styles/_base.scss';
import PartnerSectionStyle from '../../../styles/components/c-partner-section.scss';
import oceanaLogo from '../../../assets/logos/oceana_logo.png';
import skyLogo from '../../../assets/logos/skytruth_blue.png';
import googleLogo from '../../../assets/logos/google_logo_color.png';

class PartnerSection extends Component {

  render() {
    return (<section className={PartnerSectionStyle['c-partner-section']}>
      <div className={BaseStyle.wrap}>
        <h2>Founding Partners</h2>
        <ul>
          <li>
            <div className={PartnerSectionStyle['contain-img-logo']}>
              <img src={oceanaLogo} className={PartnerSectionStyle['img-logo-partners']} alt="logo oceana"></img>
            </div>
            <ul className={PartnerSectionStyle['name-list']}>
              <li><span className={PartnerSectionStyle.name}>Andy Sharpless.</span> Chief Executive Officer</li>
              <li><span className={PartnerSectionStyle.name}>Jackie Savitz.</span> Vice President</li>
              <li><span className={PartnerSectionStyle.name}>Adam Reyer.</span> Project Director</li>
            </ul>
            <p>
              Oceana is the largest international advocacy organization dedicated solely to ocean conservation.
              Oceana is
              rebuilding abundant and biodiverse oceans by winning science-based policies in countries that control one
              third of the world’s wild fish catch. With over 100 victories that stop overfishing, habitat destruction,
              pollution and killing of threatened species like turtles and sharks, Oceana’s campaigns are delivering
              results. A restored ocean means that one billion people can enjoy a healthy seafood meal, every day,
              forever. Together, we can save the oceans and help feed the world.
              To learn more, visit <a
                className="gfw-link"
                href="http://oceana.org/"
                target="_blank"
              >www.oceana.org</a>.
            </p>
          </li>
          <li>
            <div className={PartnerSectionStyle['contain-img-logo']}>
              <img
                src={skyLogo}
                className={classnames(PartnerSectionStyle['img-logo-partners'], PartnerSectionStyle['-skytruth-logo'])}
                alt="logo SkyTruth"
              ></img>
            </div>
            <ul className={PartnerSectionStyle['name-list']}>
              <li><span className={PartnerSectionStyle.name}>John Amos.</span> President</li>
              <li><span className={PartnerSectionStyle.name}>Paul Woods.</span> Chief Technology Officer</li>
              <li><span className={PartnerSectionStyle.name}>David Kroodsma.</span> Research Program Manager</li>
            </ul>
            <p>
              If you can see it, you can change it. SkyTruth hopes this illustration of global fishing activity,
              made available
              on a public map for the first time, will prompt people to ask questions
              about how well our ocean and its living
              resources are being managed and protected. Founded in 2001, SkyTruth’s mission
              is to make the world visible to the
              people that live in it. We’re driven by the belief that better transparency
              leads to better management and better
              outcomes for people and the environment. To learn more, check out what we do and how we work
              at <a
                className="gfw-link"
                href="http://skytruth.org/"
                target="_blank"
              > www.skytruth.org</a>.
            </p>
          </li>
          <li>
            <div className={PartnerSectionStyle['contain-img-logo']}>
              <img src={googleLogo} className={PartnerSectionStyle['img-logo-partners']} alt="logo google"></img>
            </div>
            <ul className={PartnerSectionStyle['name-list']}>
              <li><span className={PartnerSectionStyle.name}>Brian Sullivan.</span> Senior Program Manager</li>
              <li><span className={PartnerSectionStyle.name}>Alex Wilson.</span> Machine Learning Engineer</li>
            </ul>
            <p>
              Google Earth Outreach is a team dedicated to leveraging and developing Google’s
              infrastructure to address environmental and humanitarian issues through partnerships
              with non-profits, educational institutions, and research groups. To learn more,
              visit <a
                className="gfw-link"
                href="https://www.google.com/earth/outreach/index.html"
                target="_blank"
              >earth.google.com/outreach</a>.
            </p>
          </li>
        </ul>
      </div>
    </section>);
  }
}

export default PartnerSection;
