import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import PartnerSection from './Partners/PartnerSection';
import FunderSection from './Partners/FunderSection';
import ResearchSection from './Partners/ResearchSection';
import OtherSection from './Partners/OtherSection';
import ContactUsSection from './Partners/ContactUsSection';
import partnersBackgroundImage from '../../assets/images/partners.jpg';

class Partners extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Partners"
        subtitle="Global Fishing Watch was created by Oceana, SkyTruth and Google. Its Funding Partners are:
        Leonardo DiCaprio Foundation, Marisla Foundation, Bloomberg Philanthropies, The Wyss Foundation,
        The Waterloo Foundation and Adessium Foundation. Global Fishing Watch works in partnership with a
        growing number of organizations that contribute
        data, expertise, and funding to make global fishing activity more transparent. Global Fishing Watch
        provides the tools to allow people to visualize fishing activity and to analyze its effects."
        backgroundImage={partnersBackgroundImage}
        attribution="US Coast Guard"
      />
      <div>
        <PartnerSection />
        <FunderSection />
        <ResearchSection />
        <OtherSection />
        <ContactUsSection />
      </div>
      <Footer />
    </div>);
  }

}

export default Partners;
