import React, { Component } from 'react';
import home from '../../styles/index.scss';
import Footer from './Shared/Footer';
import Steps from './Home/Steps';
import CoverPage from './Home/CoverPage';
import InfoMap from './Home/InfoMap';
import HomepageStyles from '../../styles/layout/l-homepage.scss';

class Home extends Component {
  render() {
    return (
      <div classsName={HomepageStyles['l-homepage']}>
        <CoverPage />
        <Steps />
        <section className={home.infomap}>
          <InfoMap />
        </section>
        <Footer />
      </div>);
  }

}

export default Home;
