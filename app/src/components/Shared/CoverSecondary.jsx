import React from 'react';
import CoverPrimary from './CoverPrimary';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Header from '../../containers/Header';
import MenuMobile from './MenuMobile';

class CoverSecondary extends CoverPrimary {

  render() {
    return (<section
      className={CoverPage['c-cover-page']}
      style={{ backgroundImage: `url(${this.getBackground()})` }}
    >
      <div className={CoverPage['layer-cover']}>
        <MenuMobile />
        <Header />
        <div className={baseStyle.wrap}>
          <div className={CoverPage['contain-text-cover']}>
            <h1 className={CoverPage['cover-sub-title']}>
              {this.props.title}
            </h1>
            <p className={CoverPage['cover-sub-subtitle']}>
              {this.props.subtitle}
            </p>
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
