import React, { Component } from 'react';
import Footer from 'components/Shared/Footer';
import Steps from 'components/Home/Steps';
import CoverPage from 'containers/CoverPage';
import InfoMap from 'components/Home/InfoMap';
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
