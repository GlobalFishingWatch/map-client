import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import { Link } from 'react-router';

class CoverBlogContainer extends Component {

  render() {
    return (<section className={CoverPage['c-cover-page']}>
      <div>
        <h1 className={CoverPage['title-cover-blog-detail']}>
          <Link to={'/blog'}>Blog</Link>
        </h1>
        <p className={CoverPage['title-post-detail']}>
          {this.props.title}
        </p>
        <div className={CoverPage.footer_header_blog}>
          <div>Brought to you by:</div>
        </div>
      </div>
    </section>);
  }
}

CoverBlogContainer.propTypes = {
  title: React.PropTypes.string
};

export default CoverBlogContainer;
