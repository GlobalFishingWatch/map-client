import React, { Component } from 'react';
import classNames from 'classnames';
import Slider from 'react-slick';
import BaseStyle from '../../../styles/_base.scss';
import ResearchSectionStyle from '../../../styles/components/c-research-section.scss';
import csiroLogo from '../../../assets/research-partners/csiro-logo.png';
import ancorsLogo from '../../../assets/research-partners/ancors-logo.png';
import dalhousieLogo from '../../../assets/research-partners/dalhousie-logo.jpg';
import marineLogo from '../../../assets/research-partners/marine-logo.png';
import mccauleyLogo from '../../../assets/research-partners/mccauley-logo.png';
import stanfordLogo from '../../../assets/research-partners/stanford-logo.png';
import sustainableLogo from '../../../assets/research-partners/sustainable-logo.png';

class ResearchSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth
    };
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  render() {
    const settings = {
      arrows: true,
      infinite: true,
      draggable: false,
      autoplay: false,
      slidesToShow: this.state.windowWidth > 768 ? 4 : 2,
      slidesToScroll: 1
    };
    return (<section className={ResearchSectionStyle['c-research-section']}>
      <div className={BaseStyle.wrap}>
        <h2>Research Partners</h2>
        <div className={ResearchSectionStyle['slider-logos']}>
          <Slider {...settings}>
            <div>
              <img src={dalhousieLogo} alt="dalhousie logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
            <div>
              <img
                src={csiroLogo}
                alt="csiro logo"
                className={classNames(ResearchSectionStyle['image-slider'], ResearchSectionStyle['-small'])}
              ></img>
            </div>
            <div>
              <img src={stanfordLogo} alt="stanford logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
            <div>
              <img src={ancorsLogo} alt="ancors logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
            <div>
              <img src={marineLogo} alt="msi logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
            <div>
              <img src={mccauleyLogo} alt="mccauley logo" className={ResearchSectionStyle['image-slider']}></img>
            </div>
            <div>
              <img
                src={sustainableLogo}
                alt="sustainable logo"
                className={classNames(ResearchSectionStyle['image-slider'], ResearchSectionStyle['-small'])}
              ></img>
            </div>
          </Slider>
        </div>
      </div>
    </section>);
  }
}

export default ResearchSection;
