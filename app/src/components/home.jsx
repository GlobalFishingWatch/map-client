'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import back_mobile from "../../styles/components/c_mobile_menu.scss";
import Header from "../containers/header";
import Footer from "./shared/footer";
import FooterSecond from "./shared/second_footer";
import CaseStudySlider from "./home/case_study_slider";
import CoverPage from "./home/cover_page";
import InfoMap from "./home/info_map";
import MenuMobile from "./shared/menu_mobile";
import SuccessStoryGallery from "./home/success_story_gallery";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
  }
  togglemenu() {}
  render() {
    return <div>
      {this.props.menuVisible && <div className={back_mobile.menu_back}></div> }
      <MenuMobile></MenuMobile>
      <Header></Header>
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
