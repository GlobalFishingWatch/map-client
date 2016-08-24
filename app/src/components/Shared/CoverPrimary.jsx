import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Header from '../../containers/Header';

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
          <div className={CoverPage['cover-attribution']}>
            <span>Photo: {this.props.attribution}</span>
          </div>
        </div>
      </section>
    );
  }
}

CoverPrimary.propTypes = {
  title: React.PropTypes.any,
  subtitle: React.PropTypes.any,
  attribution: React.PropTypes.any,
  backgroundImage: React.PropTypes.object
};

export default CoverPrimary;
