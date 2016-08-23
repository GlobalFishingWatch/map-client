import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Header from '../../containers/Header';
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

  componentWillMount() {
    this.backgroundImage = this.props.backgroundImage;
  }

  render() {
    return (
      <section
        className={CoverPage['c-cover-page']}
        style={{ backgroundImage: `url(${this.backgroundImage})` }}
      >
        <div className={CoverPage['layer-cover']}>
          <Header />
          <div className={baseStyle.wrap}>
            <div className={CoverPage['contain-text-cover']}>
              <h1 className={CoverPage['cover-main-title']}>
                {this.props.title}
              </h1>
              <p className={CoverPage['cover-main-subtitle']}>
                {this.props.subtitle}
              </p>
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
  backgroundImage: React.PropTypes.object
};

export default CoverPrimary;
