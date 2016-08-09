import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import LogoLDF from '../../../assets/logos/ldf_logo.png';

class CoverPrimary extends Component {

  render() {
    return (<section className={CoverPage['c-cover-page']}>
      <div>
        <h1 className={CoverPage['cover-main-title']}>
          {this.props.title}
        </h1>
        <p>
          {this.props.subtitle}
        </p>
        <div className={CoverPage['footer-header']}>
          <div>
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
