import React from 'react';
import CoverPrimary from './CoverPrimary';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';
import Header from '../../containers/Header';
import MenuMobile from './MenuMobile';

class CoverSecondary extends CoverPrimary {

  render() {
    return (<section className={CoverPage['c-cover-page']} style={{ backgroundImage: `url(${this.getBackground()})` }}>
      <div className={CoverPage['layer-cover']}>
        <MenuMobile />
        <Header />
        <h1 className={CoverPage['cover-sub-title']}>
          {this.props.title}
        </h1>
        <p className={CoverPage['cover-sub-subtitle']}>
          {this.props.subtitle}
        </p>
        <div className={CoverPage['footer-header']}>
          <div>
            <img className={CoverPage['ldf-logo']} src={LogoLDF} alt="logo" />
          </div>
        </div>
      </div>
    </section>);
  }
}

CoverSecondary.propTypes = {
  title: React.PropTypes.any,
  subtitle: React.PropTypes.any,
  backgroundImageIndex: React.PropTypes.number.optional
};

export default CoverSecondary;
