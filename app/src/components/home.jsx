import React, { Component } from 'react';
import home from '../../styles/index.scss';
import backMobile from '../../styles/components/c_mobile_menu.scss';
import Footer from './shared/footer';
import FooterSecond from './shared/second_footer';
import CaseStudySlider from './home/case_study_slider';
import CoverPage from './home/cover_page';
import InfoMap from './home/info_map';
import SuccessStoryGallery from './home/success_story_gallery';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false
    };
  }

  render() {
    return (<div>
      {this.props.menuVisible && <div className={backMobile.menu_back}></div>}
      <CoverPage />
      <section id="case_study" className={home.infostudy}>
        <CaseStudySlider />
      </section>
      <section className={home.infomap}>
        <InfoMap />
      </section>
      <section className={home['success-story']}>
        <h2>Success Stories</h2>
        <SuccessStoryGallery />
      </section>
      <Footer />
      <FooterSecond />
    </div>);
  }

}

Home.propTypes = {
  menuVisible: React.PropTypes.bool
};

export default Home;
