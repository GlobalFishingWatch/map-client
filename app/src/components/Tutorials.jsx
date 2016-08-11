import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';

class Tutorials extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Watch Our Tutorial"
        subtitle="View our tutorial video to see Global Fishing in action."
      />
      <section>
        <p>Click on the video below to watch a brief tutorial of how Global Fishing Watch works. </p>
      </section>
      <Footer />
    </div>);
  }

}

export default Tutorials;
