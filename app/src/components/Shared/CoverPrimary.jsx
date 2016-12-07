import React, { Component } from 'react';
import classnames from 'classnames';
import CoverPage from 'styles/components/c-cover-page.scss';
import baseStyle from 'styles/_base.scss';
import LogoLDF from 'assets/logos/ldf_logo.png';
import Header from 'containers/Header';
import ImageAttribution from './ImageAttribution';

class CoverPrimary extends Component {

  componentWillMount() {
    this.backgroundImage = this.props.backgroundImage;
  }

  render() {
    const attribution = this.props.attribution ? `Photo: ${this.props.attribution}` : null;

    const ldfLogo = (
      <div className={CoverPage['footer-header']}>
        <div>
          <img className={CoverPage['ldf-logo']} src={LogoLDF} alt="logo"></img>
        </div>
      </div>
    );

    return (
      <section
        className={CoverPage['c-cover-page']}
        style={{ backgroundImage: `url(${this.backgroundImage})` }}
      >
        <div className={classnames(CoverPage['layer-cover'], CoverPage['-sub-page'])}>
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
            {this.props.showLDFLogo && ldfLogo}
          </div>
          {attribution && <ImageAttribution>
            {attribution}
          </ImageAttribution>}
        </div>
      </section>
    );
  }
}

CoverPrimary.propTypes = {
  title: React.PropTypes.any,
  subtitle: React.PropTypes.any,
  attribution: React.PropTypes.any,
  backgroundImage: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.string
  ]),
  showLDFLogo: React.PropTypes.bool
};

export default CoverPrimary;
