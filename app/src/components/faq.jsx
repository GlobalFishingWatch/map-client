import React, { Component } from 'react';
import home from '../../styles/index.scss';
import Header from '../containers/header';
import Footer from './shared/footer';

class FAQ extends Component {

  render() {
    return (<div>
      <Header />
      <section className={home.header_home}>
        <div>
          <h1>
            Frequently Asked Questions
          </h1>
        </div>
      </section>
      <Footer />
    </div>);
  }

}

export default FAQ;
