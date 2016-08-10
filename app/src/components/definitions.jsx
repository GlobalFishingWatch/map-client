import React, { Component } from 'react';
import CoverPrimary from './shared/CoverPrimary';
import Footer from './shared/footer';

class Definitions extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Glossary of Terms"
        subtitle="Review definitions of terms you will find across our site and as you explore the Map."
      />
      <section>
      </section>
      <Footer />
    </div>);
  }

}

export default Definitions;
