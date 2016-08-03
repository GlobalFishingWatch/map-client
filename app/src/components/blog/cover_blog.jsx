'use strict';
import React, {Component} from "react";
import cover_page from '../../../styles/components/c-cover_page.scss';

class CoverBlog extends Component {

  render() {
    return <section className={cover_page['c-cover-page']}>
      <div>
        <h1 className={cover_page.title_cover_blog}>
          Blog
        </h1>
        <p>Lorem ipsum donec ullamcorper nulla non metus auctor fringilla. Donec id elit non mi porta gravida at eget metus. Curabitur
           blandit tempus porttitor. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
        <div className={cover_page.footer_header_blog}>
          <div>Brought to you by:</div>
        </div>
      </div>
    </section>
  }
}

export default CoverBlog;
