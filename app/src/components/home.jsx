'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import Header from "../containers/header";
import Footer from "./footer";
import FooterSecond from "./second_footer";
import CaseStudySlider from "./home/case_study_slider";
import CoverPage from "./home/cover_page";
import InfoMap from "./home/info_map";
import SuccessStoryGallery from "./home/success_story_gallery";

class Home extends Component {

  render() {
    return <div>
      <header className={home.c_header}>
        <Header></Header>
      </header>
      <CoverPage></CoverPage>
      <section id="case_study" className={home.infostudy}>
        <CaseStudySlider></CaseStudySlider>
      </section>
      <section className={home.infomap}>
        <InfoMap></InfoMap>
      </section>
      <section className={home.success_story}>
        <h2>Success Stories</h2>
        <SuccessStoryGallery></SuccessStoryGallery>
      </section>
      <Footer></Footer>
      <FooterSecond></FooterSecond>
    </div>
  }

}

export default Home;
