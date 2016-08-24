import React from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Header from '../../containers/Header';
import CoverPrimary from './CoverPrimary';

class CoverSecondary extends CoverPrimary {

  render() {
    return (<section
      className={CoverPage['c-cover-page']}
      style={{ backgroundImage: `url(${this.backgroundImage})` }}
    >
      <div className={CoverPage['layer-cover']}>
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
        <div className={CoverPage['cover-attribution']}>
          <span>
            Photo: {this.props.attribution}
          </span>
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
