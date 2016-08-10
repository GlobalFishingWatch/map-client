import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';
import Header from '../../containers/Header';
import MenuMobile from './MenuMobile';

class CoverSecondary extends Component {

  render() {
    return (<section className={CoverPage['c-cover-page']}>
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
  subtitle: React.PropTypes.any
};

export default CoverSecondary;
