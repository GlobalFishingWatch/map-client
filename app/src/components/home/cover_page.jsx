import React, { Component } from 'react';
import $ from 'jquery';
import Slider from 'react-slick';
import ButtonBoxSlider from './button_box_slider';
import Header from '../../containers/header';
import MenuMobile from '../shared/menu_mobile';
import CoverPageStyle from '../../../styles/components/c-cover-page.scss';
import BoxTriangleStyle from '../../../styles/components/c-box-triangle.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';
import imageLeo from '../../../assets/images/slider_2.jpg';
import sliderOne from '../../../assets/images/ship_1.jpg';

class CoverPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSlider: 0
    };

    this.onSliderChange = this.onSliderChange.bind(this);
  }

  onSliderChange(currentSlider) {
    console.log(arguments);
    this.setState({ currentSlider });
  }

  gosection() {
    $('html, body').animate({
      scrollTop: $('#case_study').offset().top
    }, 1000);
  }


  render() {
    const settings = {
      dots: true,
      dotsClass: CoverPageStyle['dots-cover'],
      infinite: false,
      draggable: false,
      afterChange: this.onSliderChange
    };

    let background;
    switch (this.state.currentSlider) {
      case 1:
        background = imageLeo;
        break;

      default:
        background = sliderOne;
        break;
    }

    return (
      <div className={CoverPageStyle['c-cover-page']} style={{ backgroundImage: `url(${background})` }}>
        <div className={CoverPageStyle['layer-cover']}>
          <MenuMobile />
          <Header />
          <div>
            <Slider {...settings}>
              <div>
                <h1>
                  Introducing Global Fishing Watch
                </h1>
                <p>Global Fishing Watch enables anyone with an Internet connection to see fishing
                   activity anywhere in the ocean in near real-time — for free.
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
