import React, { Component } from 'react';
import $ from 'jquery';
import CoverPageStyle from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Slider from '../../lib/react-slick.min';
import Header from '../../containers/Header';
import MenuMobile from '../../containers/MenuMobile';
import BoxTriangleStyle from '../../../styles/components/c-box-triangle.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';
import sliderBackground1 from '../../../assets/images/background_1.png';
import sliderBackgroundLDF from '../../../assets/images/background_ldf.jpg';
import sliderBackground2 from '../../../assets/images/background_2.png';
import sliderBackground3 from '../../../assets/images/background_3.png';
import sliderBackground4 from '../../../assets/images/background_4.png';

class CoverPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentSlider: 0,
      autoPlaySlider: true,
      speedPlaySlider: 10000
    };
  }

  componentDidUpdate() {
    $(`.${CoverPageStyle['dots-cover']}`).off('click').on('click', () => {
      if (!this.state.autoPlaySlider) return;
      this.setState({ autoPlaySlider: false });
    });
  }

  onSliderChange(currentSlider) {
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
      arrows: false,
      dotsClass: CoverPageStyle['dots-cover'],
      infinite: true,
      draggable: false,
      afterChange: (currentSlider) => { this.onSliderChange(currentSlider); },
      autoplay: this.state.autoPlaySlider,
      autoplaySpeed: this.state.speedPlaySlider
    };

    const sliderBackgrounds = [
      sliderBackground1,
      sliderBackgroundLDF,
      sliderBackground3,
      sliderBackground2,
      sliderBackground4
    ];
    const sliderBackground = sliderBackgrounds[this.state.currentSlider];

    return (
      <div className={CoverPageStyle['c-cover-page']} style={{ backgroundImage: `url(${sliderBackground})` }}>
        <div className={CoverPageStyle['layer-cover']}>
          <MenuMobile />
          <Header />
          <div className={baseStyle.wrap}>
            <Slider {...settings}>
              <div>
                <div className={CoverPageStyle['contain-text-cover']}>
                  <h1>
                    Introducing Global Fishing Watch
                  </h1>
                  <p>Global Fishing Watch enables anyone with an Internet connection to see fishing
                    activity anywhere in the ocean in near real-time — for free.
                  </p>
                </div>
              </div>
              <div className={CoverPageStyle['leo-slider']}>
                <div className={CoverPageStyle['contain-quote-text']}>
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
              </div>
              <div>
                <div className={CoverPageStyle['contain-text-cover']}>
                  <h1>
                    Protect ocean ecosystems
                  </h1>
                  <p>
                    Monitor fishing activity in marine protected areas to ensure
                    proper management and oversight of these special places.
                  </p>
                </div>
              </div>
              <div>
                <div className={CoverPageStyle['contain-text-cover']}>
                  <h1>
                    See where fishing is happening
                  </h1>
                  <p>
                    Observe fishing patterns and activity based on vessel position, course and
                    speed as revealed by Automatic Identification System broadcasts.
                  </p>
                </div>
              </div>
              <div>
                <div className={CoverPageStyle['contain-text-cover']}>
                  <h1>
                    Improve fisheries management worldwide
                  </h1>
                  <p>
                    Provide tools for governments, fishery management organizations,
                    scientists, private industry, and NGOs to implement rules and
                    regulations that will ensure a sustainable and abundant ocean.
                  </p>
                </div>
              </div>
            </Slider>
            <div className={BoxTriangleStyle['c-box-triangle']} onClick={this.gosection}>
              <div className={BoxTriangleStyle['triangle-min']}></div>
            </div>
            <div className={CoverPageStyle['footer-header']}>
              <div>
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
