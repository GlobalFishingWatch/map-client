import React, { Component } from 'react';
import Footer from './Shared/Footer';
import Steps from './Home/Steps';
import CoverPage from 'containers/CoverPage';
import InfoMap from './Home/InfoMap';
import HomepageStyles from 'styles/layout/l-homepage.scss';

class Home extends Component {
  render() {
    return (
      <div className={HomepageStyles['l-homepage']}>
        <CoverPage />
        <Steps />
        <section className={HomepageStyles.infomap}>
          <InfoMap />
        </section>
        <Footer />
      </div>);
  }

}

export default Home;
