import React, { Component } from 'react';
import home from '../../styles/index.scss';
import CoverPrimary from './shared/CoverPrimary';
import Header from '../containers/header';
import Footer from './shared/footer';

class Definitions extends Component {

  render() {
    return (<div>
      <Header />
      <CoverPrimary
        title="Glossary of Terms"
        subtitle="Review definitions of terms you will find across our site and as you explore the Map."
      />
      <section className={home.header_home}>
      </section>
      <Footer />
    </div>);
  }

}

export default Definitions;
