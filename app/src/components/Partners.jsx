import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import PartnerSection from './Partners/PartnerSection'

class Partners extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Global Fishing Watch Partners"
        subtitle="Global Fishing Watch was created by Oceana, SkyTruth and Google, and works in partnership
        with a growing number of organizations that contribute data, expertise
        and funding to make global fishing activity more transparent."
      />
      <section>
        <PartnerSection />
        <h2>Founding Funders</h2>
        <a href="#">The Leonardo DiCaprio Foundation</a>
        <p>
          The Leonardo DiCaprio Foundation is dedicated to the long-term health and wellbeing of all Earth’s
          inhabitants. Through collaborative partnerships, we support innovative projects that protect vulnerable
          wildlife from extinction, while restoring balance to threatened ecosystems and communities.
        </p>
      </section>
      <Footer />
    </div>);
  }

}

export default Partners;
