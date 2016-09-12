import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'lodash';
import classnames from 'classnames';
import CoverPageStyle from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Slider from 'react-slick';
import Header from '../../containers/Header';
import { Link } from 'react-router';
import Rhombus from '../Shared/Rhombus';
import CoverPagePreloader from './CoverPagePreloader';
import { scrollTo } from '../../lib/Utils';
import BoxTriangleStyle from '../../../styles/components/c-box-triangle.scss';
import LogoLDF from '../../../assets/logos/ldf_logo_white.svg';
import sliderBackground1 from '../../../assets/images/background_1.jpg';
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

    this.handleResize = _.debounce(this.handleResize.bind(this), 50);
  }

  componentDidMount() {
    this.props.getCoverPageEntries();
  }

  componentDidUpdate() {
    $(`.${CoverPageStyle['dots-cover']}`).off('click').on('click', () => {
      if (!this.state.autoPlaySlider) {
        return;
      }
      this.setState({
        autoPlaySlider: false
      });
    });
    window.addEventListener('resize', this.handleResize);
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

  renderQuoteSlide(coverPageEntry) {
    return (
      <div key={coverPageEntry.quote} className={CoverPageStyle['leo-slider']}>
        <div className={CoverPageStyle['contain-quote-text']}>
          <blockquote>
            {coverPageEntry.quote}
          </blockquote>
          <p className={CoverPageStyle['author-quote']}>– {coverPageEntry.author}</p>
          <p>{coverPageEntry.subtitle}</p>
          {coverPageEntry.linkHref && coverPageEntry.linkText && <Link
            className={CoverPageStyle['links-home-page']}
            to={coverPageEntry.linkHref}
          >
            <Rhombus color="white" />
            <span>See our partners</span>
          </Link>}
        </div>
      </div>
    );
  }

  renderSliderLink(coverPageEntry) {
    return (
      <div>
        {coverPageEntry.linkHref && coverPageEntry.linkText && <Link
          className={CoverPageStyle['links-home-page']}
          to={coverPageEntry.linkHref}
        >
          <Rhombus color="white" />
          <span>Explore The Map</span>
        </Link>}
      </div>
    );
  }

  renderStandardSlide(coverPageEntry) {
    return (
      <div key={coverPageEntry.title}>
        <div className={CoverPageStyle['contain-text-cover']}>
          <h1>
            {coverPageEntry.title}
          </h1>
          <p>
            {coverPageEntry.subtitle}
          </p>
          {coverPageEntry.linkHref && this.renderSliderLink(coverPageEntry)}
        </div>
      </div>
    );
  }

  render() {
    const loadedEntries = (this.props.coverPageEntries && this.props.coverPageEntries.length > 0);
    const settings = {
      dots: loadedEntries,
      arrows: false,
      dotsClass: CoverPageStyle['dots-cover'],
      infinite: this.state.windowWidth >= 768,
      draggable: this.state.windowWidth <= 768,
      beforeChange: (currentSlider, nextSlider) => {
        this.onSliderChange(nextSlider);
      },
      autoplay: this.state.windowWidth > 768 ? this.state.autoPlaySlider : false,
      autoplaySpeed: this.state.windowWidth > 768 ? this.state.speedPlaySlider : 0,
      adaptiveHeight: this.state.windowWidth <= 768
    };

    let coverEntriesContent = (
      <div
        className={classnames(CoverPageStyle['contain-text-cover'], CoverPageStyle['-is-empty'])}
        key={-1}
      />
    );

    const sliderBackgrounds = [];
    const sliderAttributions = [];
    if (loadedEntries) {
      const slides = [];

      this.props.coverPageEntries.forEach(coverPageEntry => {
        if (coverPageEntry.type === 'quote') {
          slides.push(this.renderQuoteSlide(coverPageEntry));
        } else {
          slides.push(this.renderStandardSlide(coverPageEntry));
        }

        sliderBackgrounds.push(coverPageEntry.background);
        sliderAttributions.push(coverPageEntry.attribution);
      });

      coverEntriesContent = <Slider {...settings}>{slides}</Slider>;
    }

    const sliderBackground = sliderBackgrounds.length ? sliderBackgrounds[this.state.currentSlider] : sliderBackground1;
    const sliderAttribution = (sliderBackgrounds.length ?
      sliderAttributions[this.state.currentSlider] : '© OCEANA / Juan Cuetos');
    return (

      <div
        className={classnames(CoverPageStyle['c-cover-page'], CoverPageStyle['-is-home'])}
        style={{ backgroundImage: `url(${sliderBackground})` }}
      >
        <CoverPagePreloader images={sliderBackgrounds} />
        <div className={CoverPageStyle['layer-cover']}>
          <Header />
          <div className={baseStyle.wrap}>
            {coverEntriesContent}
            <div className={BoxTriangleStyle['c-box-triangle']} onClick={this.scrollPage}>
              <div className={BoxTriangleStyle['triangle-min']}></div>
            </div>
            <div className={CoverPageStyle['footer-header']}>
              <div className={CoverPageStyle['contain-ldf']}>
                <img
                  className={CoverPageStyle['ldf-logo']}
                  src={LogoLDF} alt="logo"
                >
                </img>
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

CoverPage.propTypes = {
  coverPageEntries: React.PropTypes.array,
  getCoverPageEntries: React.PropTypes.func
};

export default CoverPage;
