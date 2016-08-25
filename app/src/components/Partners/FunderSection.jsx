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
        <h2>Funding Partners</h2>
        <div className={FunderSectionStyle['ldf-information']}>
          <img src={ldfLogo} alt="Leonardo Dicaprio Foundation logo"></img>
          <p>
            Since 1998, Leonardo DiCaprio Foundation (LDF) has been on a mission to protect the Earth’s last wild
            places, implementing solutions that restore balance to threatened ecosystems, and ensure the long-term
            health and wellbeing of all its inhabitants. Through grant making, public campaigns and media
            initiatives, LDF brings attention and needed funding to three areas: protecting biodiversity,
            ocean & forest conservation, and climate change. The Foundation works in close collaboration with a
            broad network of environmental leaders and experts, effective organizations, and committed
            philanthropists to identify and support innovative, results-driven projects in the world’s most
            wild and threatened ecosystems. LDF has supported over 128 high-impact projects in more than 46
            countries around the world. For more information visit:&nbsp;
            <a href="http://www.ldcfoundation.org" target="_blank">www.ldcfoundation.org</a>.
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
