import React, { Component } from 'react';
import CoverPrimary from './shared/CoverPrimary';
import Footer from './shared/footer';

class Tutorials extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Watch Our Tutorial"
        subtitle="View our tutorial video to see Global Fishing in action"
      />
      <section>
      </section>
      <Footer />
    </div>);
  }

}

export default Tutorials;
