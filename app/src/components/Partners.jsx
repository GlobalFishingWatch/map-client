import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import PartnerSection from './Partners/PartnerSection';
import FunderSection from './Partners/FunderSection';
import ResearchSection from './Partners/ResearchSection';
import OtherSection from './Partners/OtherSection';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import partnersBackgroundImage from '../../assets/images/partners.jpg';

class Partners extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Global Fishing Watch Partners"
        subtitle="Global Fishing Watch was created by Oceana, SkyTruth and Google, and works in partnership
        with a growing number of organizations that contribute data, expertise
        and funding to make global fishing activity more transparent."
        backgroundImage={partnersBackgroundImage}
        attribution="US Coast Guard"
      />
      <div className={StaticPageStyles['l-static-page']}>
        <PartnerSection />
        <FunderSection />
        <ResearchSection />
        <OtherSection />
      </div>
      <Footer />
    </div>);
  }

}

export default Partners;
