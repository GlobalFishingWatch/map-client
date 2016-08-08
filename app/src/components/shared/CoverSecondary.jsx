import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';

class CoverSecondary extends Component {

  render() {
    return (<section className={CoverPage['c-cover-page']}>
      <div>
        <h1 className={CoverPage['cover-sub-title']}>
          {this.props.title}
        </h1>
        <p className={CoverPage['cover-sub-subtitle']}>
          {this.props.subtitle}
        </p>
        <div className={CoverPage.footer_header_blog}>
          <div>Brought to you by:</div>
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
