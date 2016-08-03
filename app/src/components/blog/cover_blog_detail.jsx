'use strict';
import React, {Component} from "react";
import cover_page from '../../../styles/components/c-cover_page.scss';

class CoverBlogContainer extends Component {

  render() {
    return <section className={cover_page['c-cover-page']}>
      <div>
        <h1 className={cover_page['title-cover-blog-detail']}>
          Blog
        </h1>
        <p className={cover_page['title-post-detail']}>
            {this.props.title}
        </p>
        <div className={cover_page.footer_header_blog}>
          <div>Brought to you by:</div>
        </div>
      </div>
    </section>
  }
}

export default CoverBlogContainer;
