import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';
import Header from '../../containers/header';
import MenuMobile from '../shared/menu_mobile';

class CoverPrimary extends Component {

  render() {
    return (<section className={CoverPage['c-cover-page']}>
      <div className={CoverPage['layer-cover']}>
        <MenuMobile />
        <Header />
        <h1 className={CoverPage['cover-main-title']}>
          {this.props.title}
        </h1>
        <p>
          {this.props.subtitle}
        </p>
        <div className={CoverPage['footer-header']}>
          <div>
            <p className={CoverPage['text-ldf-footer']}>Brought to you by:</p>
            <img className={CoverPage['ldf-logo']} src={LogoLDF} alt="logo"></img>
          </div>
        </div>
      </div>
    </section>);
  }
}

CoverPrimary.propTypes = {
  title: React.PropTypes.any,
  subtitle: React.PropTypes.any
};

export default CoverPrimary;
