import React from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Header from '../../containers/Header';
import CoverPrimary from './CoverPrimary';
import ImageAttribution from './ImageAttribution';

class CoverSecondary extends CoverPrimary {

  render() {
    const attribution = this.props.attribution ? `Photo: ${this.props.attribution}` : null;

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
        {attribution && <ImageAttribution>
          {attribution}
        </ImageAttribution>}
      </div>
    </section>);
  }
}

CoverSecondary.propTypes = {
  title: React.PropTypes.any,
  subtitle: React.PropTypes.any
};

export default CoverSecondary;
