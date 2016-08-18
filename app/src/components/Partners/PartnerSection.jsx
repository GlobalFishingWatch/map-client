import React, { Component } from 'react';
import BaseStyle from '../../../styles/_base.scss';
import PartnerSectionStyle from '../../../styles/components/c-partner-section.scss';
import oceanaLogo from '../../../assets/logos/oceana_logo.png';
import skyLogo from '../../../assets/logos/skytruth_logo.jpg';
import googleLogo from '../../../assets/logos/google_logo.png';

class PartnerSection extends Component {

  render() {
    return (<section className={[BaseStyle.wrap, PartnerSectionStyle['c-partner-section']].join(' ')}>
      <h2>Founding Partners</h2>
      <ul>
        <li>
          <img src={oceanaLogo} className={PartnerSectionStyle['img-logo-partners']} alt="logo oceana"></img>
          <p>
            Oceana is the largest international advocacy organization dedicated solely to ocean conservation.
            Oceana is
            rebuilding abundant and biodiverse oceans by winning science-based policies in countries that control one
            third of the world’s wild fish catch. With over 100 victories that stop overfishing, habitat destruction,
            pollution and killing of threatened species like turtles and sharks, Oceana’s campaigns are delivering
            results. A restored ocean means that one billion people can enjoy a healthy seafood meal, every day,
            forever. Together, we can save the oceans and help feed the world.
            Visit <a href="http://oceana.org/">www.oceana.org</a> to learn more.
          </p>
        </li>
        <li>
          <img src={skyLogo} className={PartnerSectionStyle['img-logo-partners']} alt="logo SkyTruth  "></img>
          <p>
            If you can see it, you can change it. SkyTruth hopes this illustration of global fishing activity,
            made available
            on a public map for the first time, will prompt people to ask questions
            about how well our ocean and its living
            resources are being managed and protected. Founded in 2001, SkyTruth’s mission
            is to make the world visible to the
            people that live in it. We’re driven by the belief that better transparency
            leads to better management and better
            outcomes for people and the environment. Check out what we do and how we work at
            <a href="www.skytruth.org">www.skytruth.org</a>.
          </p>
        </li>
        <li>
          <img src={googleLogo} className={PartnerSectionStyle['img-logo-partners']} alt="logo google"></img>
          <p>
            Google Earth Outreach is a team dedicated to leveraging and developing Google’s
            infrastructure to address environmental and humanitarian issues through partnerships
            with non-profits, educational institutions, and research groups. To learn more, visit
            <a href="earth.google.com/outreach"> earth.google.com/outreach</a>.
          </p>
        </li>
      </ul>
    </section>);
  }
}

export default PartnerSection;
