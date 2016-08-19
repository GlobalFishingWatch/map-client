import React, { Component } from 'react';
import BaseStyle from '../../../styles/_base.scss';
import FunderSectionStyle from '../../../styles/components/c-funder-section.scss';
import ldfLogo from '../../../assets/logos/ldf_logo_color.png';
import adessiumLogo from '../../../assets/logos/adessium_logo.png';
import marislaLogo from '../../../assets/logos/marisla_logo.png';
import waterlooLogo from '../../../assets/logos/waterloo_logo.png';
import wyssLogo from '../../../assets/logos/wyss_logo.png';

class FunderSection extends Component {

  render() {
    return (<section className={FunderSectionStyle['c-funder-section']}>
      <div className={BaseStyle.wrap}>
        <h2>Founding Funders</h2>
        <div className={FunderSectionStyle['ldf-information']}>
          <img src={ldfLogo} alt="Leonardo Dicaprio Foundation logo"></img>
          <p>
          The Leonardo DiCaprio Foundation is dedicated to the long-term health and wellbeing of all Earth’s
          inhabitants. Through collaborative partnerships, we support innovative projects that protect vulnerable
          wildlife from extinction, while restoring balance to threatened ecosystems and communities.
          </p>
        </div>
        <div className={FunderSectionStyle['funder-logos']}>
          <img src={marislaLogo} alt="marisla foundation logo"></img>
          <img src={wyssLogo} alt="the wyss foundation logo"></img>
          <img src={waterlooLogo} alt="the waterloo foundation logo"></img>
          <img src={adessiumLogo} alt="adessium foundation logo"></img>
        </div>
      </div>
    </section>);
  }
}

export default FunderSection;
