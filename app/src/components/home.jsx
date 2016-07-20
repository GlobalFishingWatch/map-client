'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import gallery from "../../styles/components/c_gallery_images.scss";
import button from "../../styles/components/c_button.scss";
import box_triangle from "../../styles/components/c_box_triangle.scss";
import Header from "../containers/header";
import Footer from "./footer";
import FooterSecond from "./second_footer";
import CaseStudySlider from "./case_study_slider"
import boxtriangle from "../../assets/icons/box_triangle.svg";
import boxtrianglewhite from "../../assets/icons/box_triangle_white.svg";

class Home extends Component {

  scrollToSection() {
    $('html,body').animate({
      scrollTop: $('#case_study')
    });
  }

  render() {
    return <div>
      <header className={home.c_header}>
        <Header></Header>
      </header>
      <section className={home.c_cover_page}>
        <h1>
          The first global view of commercial fishing activity
        </h1>
        <p>Global Fishing Watch, a partnership of Oceana, SkyTruth and Google, enables anyone with an Internet
          connection to see global fishing activity worldwide in near real-time - for free. It s a powerful tool that
          will hold our leaders accountable for maintaining abundant oceans and show consumers where - - and by whom --
          their fish is being caught.</p>
        <div className={home.footer_header}>
          <div>Hello</div>
          <div className={box_triangle.c_box_triangle} onClick={this.scrollToSection()}>
            <div className={box_triangle.triangle_min}></div>
          </div>
          <div>Brought to you by:</div>
        </div>
      </section>
      <section id="case_study" className={home.infostudy}>
        <CaseStudySlider></CaseStudySlider>
      </section>

      <section className={home.infomap}>
        <div>
          <h2>THE MAP</h2>
          <h3>Lorem ipsum dolor sit amet</h3>
          <p>Morbi porttitor massa id bibendum varius. Etiam vitae pulvinar nisi, vel fringilla libero. Nulla consequat
            sodales lectus.</p>
          <p>
            <a href="map" className={button.c_btn_primary}><img src={boxtrianglewhite}></img>EXPLORE MAP</a>
          </p>
        </div>
      </section>
      <section className={home.success_story}>
        <h2>Success Stories</h2>
        <div className={gallery.c_gallery_images}>
          <div className={gallery.image_text}>
            <div className={gallery.img}></div>
            <p className={gallery.info_text}>
              Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
              porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
              <span className={gallery.title_info}><b>Name</b> / Position</span>
              <a className={gallery.link_more} href="#"><img src={boxtriangle}></img>find out more</a>
            </p>
          </div>
          <div className={gallery.image_text}>
            <div className={gallery.img}></div>
            <p className={gallery.info_text}>
              Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
              porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
              <span className={gallery.title_info}><b>Name</b> / Position</span>
              <a className={gallery.link_more} href="#"><img src={boxtriangle}></img>find out more</a>
            </p>
          </div>
          <div className={gallery.image_text}>
            <div className={gallery.img}></div>
            <p className={gallery.info_text}>
              Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
              porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
              <span className={gallery.title_info}><b>Name</b> / Position</span>
              <a className={gallery.link_more} href="#"><img src={boxtriangle}></img>find out more</a>
            </p>
          </div>
        </div>
      </section>
      <Footer></Footer>
      <FooterSecond></FooterSecond>
    </div>
  }

}

export default Home;
