'use strict';

import React, {Component} from 'react';
import home from '../../styles/index.scss';
import Header from './header';
import Footer from './footer';

class Home extends Component {

  render() {
    return <div>
      <header className={home.m_header_menu}>
        <Header></Header>
      </header>
      <section className={home.m_cover_page}>
        <h1>
          The first global view of commercial fishing activity
        </h1>
        <p>Global Fishing Watch, a partnership of Oceana, SkyTruth and Google, enables anyone with an Internet
          connection to see global fishing activity worldwide in near real-time - for free. It s a powerful tool that
          will hold our leaders accountable for maintaining abundant oceans and show consumers where - - and by whom --
          their fish is being caught.</p>
        <div className={home.footer_header}>
          <div className={home.triangle}>
            <div className={home.triangle_min}></div>
          </div>
        </div>
      </section>
      <section className={home.infostudy}>
        <div>
          <h2>CASE STUDY</h2>
          <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis orci varius sem posuere tempus.
            Pellentesque enim nulla, consequat vitae faucibus a, vulputate at est. Quisque interdum, ex imperdiet
            feugiat eleifend, dui nibh cursus neque, dapibus fringilla lectus elit eget dolor. Phasellus ut nisl tortor.
            Ut posuere convallis consectetur. Nam.</p>
          <p>
            <a href="#">FIND OUT MORE</a>
          </p>
        </div>
        <div></div>
      </section>
      <section className={home.infomap}>
        <div>
          <h2>THE MAP</h2>
          <h3>Lorem ipsum dolor sit amet</h3>
          <p>Morbi porttitor massa id bibendum varius. Etiam vitae pulvinar nisi, vel fringilla libero. Nulla consequat
            sodales lectus.</p>
          <p>
            <a href="map" className={home.c_btn_primary}>EXPLORE MAP</a>
          </p>
        </div>
      </section>
      <section className={home.success_story}>
        <h2>Success Stories</h2>
        <div className={home.gallery_info}>
          <div className={home.image_text}>
            <div className={home.img}></div>
            <p className={home.info_text}>
              Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
              porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
              <span className={home.title_info}><b>Name</b> / Position</span>
              <a className={home.link_more} href="#">find out more</a>
            </p>
          </div>
          <div className={home.image_text}>
            <div className={home.img}></div>
            <p className={home.info_text}>
              Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
              porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
              <span className={home.title_info}><b>Name</b> / Position</span>
              <a className={home.link_more} href="#">find out more</a>
            </p>
          </div>
          <div className={home.image_text}>
            <div className={home.img}></div>
            <p className={home.info_text}>
              Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum id ligula
              porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.
              <span className={home.title_info}><b>Name</b> / Position</span>
              <a className={home.link_more} href="#">find out more</a>
            </p>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>

  }

}

export default Home;
