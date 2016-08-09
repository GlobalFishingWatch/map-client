import React, { Component } from 'react';
import home from '../../styles/index.scss';
import CoverPrimary from './shared/CoverPrimary';
import Header from '../containers/header';
import Footer from './shared/footer';

class Tutorials extends Component {

  render() {
    return (<div>
      <Header />
      <CoverPrimary
        title="Watch Our Tutorial"
        subtitle="View our tutorial video to see Global Fishing in action"
      />
      <section className={home.header_home}>
      </section>
      <Footer />
    </div>);
  }

}

export default Tutorials;
