import React, { Component } from 'react';
import listposts from '../../styles/components/c-list-posts.scss';
import Header from '../containers/header';
import Footer from './shared/footer';
import { Link } from 'react-router';
import CoverSecondary from './shared/CoverSecondary';

class BlogDetail extends Component {

  componentDidMount() {
    this.props.getPostBySlug(this.props.params.slug);
  }

  render() {
    let article;

    if (this.props.post) {
      article = (<article className={listposts['article-post']}>
        <span
          dangerouslySetInnerHTML={{
            __html: this.props.post
              ? this.props.post.content
              : null
          }}
        />
      </article>);
    } else {
      article = (<div>Loading....</div>);
    }
    let coverTitle = (<Link to={'/blog'}>Blog</Link>);

    return (<div>
      <CoverSecondary title={coverTitle} subtitle={this.props.post ? this.props.post.title : null} />
      <section className={listposts['c-list-posts']}>
        {article}
      </section>
      <Footer />
    </div>);
  }
}

BlogDetail.propTypes = {
  post: React.PropTypes.object,
  params: React.PropTypes.object,
  getPostBySlug: React.PropTypes.func
};


export default BlogDetail;
