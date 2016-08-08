import React, { Component } from 'react';
import $ from 'jquery';
import Slider from 'react-slick';
import ButtonBoxSlider from './button_box_slider';
import Header from '../../containers/header';
import MenuMobile from '../shared/menu_mobile';
import CoverPageStyle from '../../../styles/components/c-cover-page.scss';
import BoxTriangleStyle from '../../../styles/components/c-box-triangle.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';

class CoverPage extends Component {
  gosection() {
    $('html, body').animate({
      scrollTop: $('#case_study').offset().top
    }, 1000);
  }

  render() {
    return (
      <div className={CoverPageStyle['c-cover-page']}>
        <div className={CoverPageStyle['layer-cover']}>
        <MenuMobile />
        <Header />
        <div>
          <Slider
            dots
            dotsClass={CoverPageStyle['dots-cover']}
            arrows={false}
            draggable={false}
            infinite
            speed={500}
            fade
          >
            <div>
              <h1>
                The first global view of commercial fishing activity
              </h1>
              <p>Global Fishing Watch, a partnership of Oceana, SkyTruth and Google, enables anyone with an Internet
                connection to see global fishing activity worldwide in near real-time
                - for free. It s a powerful tool that
                will hold our leaders accountable for maintaining abundant oceans and show consumers
                where - - and by whom -- their fish is being caught.
              </p>
            </div>
            <div className={CoverPageStyle['leo-slider']}>
              <blockquote>
                “Welcome to Global Fishing Watch, the world’s first free,
                interactive tool that enables anyone in the world to track
                 commercial fishing activity, worldwide. Global Fishing Watch
                  will shed light on what is happening on our oceans so that
                  together, we can ensure the responsible and sustainable
                   management of our fisheries.”
              </blockquote>
              <p className={CoverPageStyle['author-quote']}>– Leonardo DiCaprio</p>
              <p>The Leonardo DiCaprio Foundation is Proud to be a Founding Funder of Global Fishing Watch</p>
            </div>
          </Slider>
          <div className={CoverPageStyle['footer-header']}>
            <ButtonBoxSlider />
            <div className={BoxTriangleStyle['c-box-triangle']} onClick={this.gosection}>
              <div className={BoxTriangleStyle['triangle-min']}></div>
            </div>
            <div>Brought to you by:
              <img className={CoverPageStyle['ldf-logo']} src={LogoLDF} alt="logo"></img>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default CoverPage;
