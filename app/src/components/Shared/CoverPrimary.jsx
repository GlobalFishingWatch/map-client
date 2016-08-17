import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';
import Header from '../../containers/Header';
import MenuMobile from './MenuMobile';
import sliderBackground1 from '../../../assets/images/background_1.png';
import sliderBackground2 from '../../../assets/images/background_2.png';
import sliderBackground3 from '../../../assets/images/background_3.png';
import sliderBackground4 from '../../../assets/images/background_4.png';
import sliderBackground5 from '../../../assets/images/background_5.png';
import sliderBackground6 from '../../../assets/images/background_6.png';
import sliderBackground7 from '../../../assets/images/background_7.png';
import sliderBackground8 from '../../../assets/images/background_8.png';
import sliderBackground9 from '../../../assets/images/background_9.png';
import sliderBackground10 from '../../../assets/images/background_10.png';

class CoverPrimary extends Component {

  constructor(props) {
    super(props);
    this.images = [
      sliderBackground1,
      sliderBackground2,
      sliderBackground3,
      sliderBackground4,
      sliderBackground5,
      sliderBackground6,
      sliderBackground7,
      sliderBackground8,
      sliderBackground9,
      sliderBackground10
    ];
  }

  componentWillMount() {
    this.backgroundImage = this.getBackground(this.props.backgroundImageIndex);
  }

  getBackground(index = null) {
    if (!index) {
      return this.images[Math.floor(Math.random() * this.images.length)];
    }

    return this.images[index - 1];
  }

  render() {
    return (
      <section className={CoverPage['c-cover-page']} style={{ backgroundImage: `url(${this.backgroundImage})` }}>
        <div className={CoverPage['layer-cover']}>
          <MenuMobile />
          <Header />
          <h1 className={CoverPage['cover-main-title']}>
            {this.props.title}
          </h1>
          <p className={CoverPage['cover-main-subtitle']}>
            {this.props.subtitle}
          </p>
          <div className={CoverPage['footer-header']}>
            <div>
              <img className={CoverPage['ldf-logo']} src={LogoLDF} alt="Leonardo Dicaprio Foundation" />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

CoverPrimary.propTypes = {
  title: React.PropTypes.any,
  subtitle: React.PropTypes.any,
  backgroundImageIndex: React.PropTypes.number
};

export default CoverPrimary;
