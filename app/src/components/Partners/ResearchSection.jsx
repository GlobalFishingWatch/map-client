import React, { Component } from 'react';
import Slider from '../../lib/react-slick.min';
import BaseStyle from '../../../styles/_base.scss';
import ResearchSectionStyle from '../../../styles/components/c-research-section.scss';
import ucsbLogo from '../../../assets/logos/ucsb_logo.png';
import stanfordLogo from '../../../assets/logos/stanford_logo.png';
import wollongongLogo from '../../../assets/logos/wollongong_logo.png';
import dalhouseLogo from '../../../assets/logos/dalhouse_logo.png';

class ResearchSection extends Component {

  render() {
    const settings = {
      arrows: true,
      infinite: true,
      draggable: false,
      autoplay: false,
      slidesToShow: 4,
      slidesToScroll: 1
    };
    return (<section className={ResearchSectionStyle['c-research-section']}>
      <div className={BaseStyle.wrap}>
        <h2>Research Partners</h2>
        <div className={ResearchSectionStyle['slider-logos']}>
          <Slider {...settings}>
            <div>
              <img src={dalhouseLogo} alt="dalhousie logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
            <div>
              <img src={wollongongLogo} alt="wollongong logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
            <div>
              <img src={stanfordLogo} alt="stanford logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
            <div>
              <img src={ucsbLogo} alt="ucsb logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
          </Slider>
        </div>
      </div>
    </section>);
  }
}

export default ResearchSection;
