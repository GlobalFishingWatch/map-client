import React, { Component } from 'react';
import $ from 'jquery';
import CoverPageStyle from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Slider from 'react-slick';
import Header from '../../containers/Header';
import CoverPagePreloader from './CoverPagePreloader';
import { scrollTo } from '../../lib/Utils';
import BoxTriangleStyle from '../../../styles/components/c-box-triangle.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';
import sliderBackground1 from '../../../assets/images/background_1.jpg';
import sliderBackgroundLDF from '../../../assets/images/background_ldf.jpg';
import sliderBackground3 from '../../../assets/images/background_3.jpg';
import sliderBackground4 from '../../../assets/images/background_4.jpg';
import sliderBackground5 from '../../../assets/images/background_5.jpg';
import ImageAttribution from '../Shared/ImageAttribution';

class CoverPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentSlider: 0,
      autoPlaySlider: true,
      speedPlaySlider: 10000,
      windowWidth: window.innerWidth
    };
  }

  componentDidUpdate() {
    $(`.${CoverPageStyle['dots-cover']}`).off('click').on('click', () => {
      if (!this.state.autoPlaySlider) {
        return;
      }
      this.setState({ autoPlaySlider: false });
    });
    window.addEventListener('resize', () => this.handleResize());
  }

  onSliderChange(currentSlider) {
    this.setState({ currentSlider });
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  scrollPage() {
    const el = document.getElementById('steps');
    if (!el) {
      return;
    }
    scrollTo(el);
  }

  render() {
    console.log(!this.state.windowWidth > 768);
    const settings = {
      dots: true,
      arrows: false,
      dotsClass: CoverPageStyle['dots-cover'],
      infinite: true,
      draggable: this.state.windowWidth <= 768,
      beforeChange: (currentSlider, nextSlider) => {
        this.onSliderChange(nextSlider);
      },
      autoplay: this.state.windowWidth > 768 ? this.state.autoPlaySlider : false,
      autoplaySpeed: this.state.windowWidth > 768 ? this.state.speedPlaySlider : 0,
      adaptiveHeight: this.state.windowWidth <= 768
    };

    const sliderBackgrounds = [
      sliderBackground1,
      sliderBackgroundLDF,
      sliderBackground3,
      sliderBackground4,
      sliderBackground5
    ];
    const sliderBackground = sliderBackgrounds[this.state.currentSlider];

    const sliderAttributions = [
      '© OCEANA / Juan Cuetos',
      null,
      '© Steve De Neef ',
      '© OCEANA / Eduardo Sorensen',
      'Hoatzinexp/iStock/Thinkstock'
    ];
    const sliderAttribution = sliderAttributions[this.state.currentSlider];

    return (
      <div className={CoverPageStyle['c-cover-page']} style={{ backgroundImage: `url(${sliderBackground})` }}>
        <CoverPagePreloader images={sliderBackgrounds} />
        <div className={CoverPageStyle['layer-cover']}>
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
                    “Global Fishing Watch is the first effective tool to track commercial fishing around the world. Now
                    anyone can help put an end to the massive overfishing that is decimating fisheries everywhere and
                    help authorities protect our precious marine ecosystems before it’s too late.”
                  </blockquote>
                  <p className={CoverPageStyle['author-quote']}>– Leonardo DiCaprio</p>
                  <p>The Leonardo DiCaprio Foundation is proud to be a Funding Partner of Global Fishing Watch</p>
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
            <div className={BoxTriangleStyle['c-box-triangle']} onClick={this.scrollPage}>
              <div className={BoxTriangleStyle['triangle-min']}></div>
            </div>
            <div className={CoverPageStyle['footer-header']}>
              <div className={CoverPageStyle['contain-ldf']}>
                <span className={CoverPageStyle['brought-text']}>Brought to you by:</span>
                <img className={CoverPageStyle['ldf-logo']} src={LogoLDF} alt="logo"></img>
              </div>
            </div>
          </div>

          {sliderAttribution && <ImageAttribution>
            {sliderAttribution && `Photo: ${sliderAttribution}`}
          </ImageAttribution>}
        </div>
      </div>
    );
  }
}

export default CoverPage;
