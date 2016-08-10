import React, { Component } from 'react';
import CoverPrimary from './shared/CoverPrimary';
import Footer from './shared/footer';

class PrivacyPolicy extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Privacy Policy"
        subtitle="lorem ipsum"
      />
      <section>
      </section>
      <Footer />
    </div>);
  }

}

export default PrivacyPolicy;
