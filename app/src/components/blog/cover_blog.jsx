import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';

class CoverBlog extends Component {

  render() {
    return (<section className={CoverPage['c-cover-page']}>
      <div>
        <h1 className={CoverPage.title_cover_blog}>
          Blog
        </h1>
        <p>
            Latest news on Global Fishing Watch
        </p>
        <div className={CoverPage.footer_header_blog}>
          <div>Brought to you by:</div>
        </div>
      </div>
    </section>);
  }
}

export default CoverBlog;
