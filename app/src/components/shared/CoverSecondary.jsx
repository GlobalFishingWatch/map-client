import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';
import Header from '../../containers/header';
import MenuMobile from '../shared/menu_mobile';

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
<<<<<<< e5302c4a886429963586b06d3a9b95331105e06e
=======
            <p className={CoverPage['text-ldf-footer']}>Brought to you by:</p>
>>>>>>> update styles from blog page detail, fix cover and layer
            <img className={CoverPage['ldf-logo']} src={LogoLDF} alt="logo"></img>
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
