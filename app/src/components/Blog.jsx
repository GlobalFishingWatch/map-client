import React, { Component } from 'react';
import Footer from './Shared/Footer';
import Loader from './Shared/Loader';
import { Link } from 'react-router';
import listPosts from '../../styles/components/c-list-posts.scss';
import CoverPrimary from './Shared/CoverPrimary';
import PaginationBlog from './Blog/Pagination';
import boxtriangle from '../../assets/icons/box_triangle.svg';

class Blog extends Component {

  constructor(props) {
    super(props);

    let currentPage = 1;
    if (props.queryParams && props.queryParams.page) {
      currentPage = parseInt(props.queryParams.page, 10);
    }

    this.state = {
      totalPageCount: 0,
      currentPage
    };

    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    this.props.getRecentPost(this.state.currentPage);
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    if (nextProps.recentPost && nextProps.recentPost.pages >= 1) {
      newState.totalPageCount = nextProps.recentPost.pages;
    }
    if (nextProps.queryParams && nextProps.queryParams.page) {
      newState.currentPage = parseInt(nextProps.queryParams.page, 10);
    } else {
      newState.currentPage = 1;
    }

    this.setState(newState);
  }

  onPageChange(event) {
    this.props.getRecentPost(event.selected + 1);
  }

  render() {
    let articles = [];

    if (this.props.recentPost) {
      articles = this.props.recentPost.posts.map((article) => (
        <article key={article.id}>
          <Link to={`/blog/${article.slug}`}>
            <h2>{article.title}</h2>
          </Link>
          <span className={listPosts.datapost}>{article.date.substr(0, 10)}</span>
          <span
            dangerouslySetInnerHTML={{
              __html: article.excerpt
            }}
          />
          <p className={listPosts['button-more']}>
            <Link to={`/blog/${article.slug}`}>
              <img
                alt="Find out more"
                src={boxtriangle}
              />
              FIND OUT MORE
            </Link>
          </p>
          <hr />
        </article>
      ));
    } else {
      articles = (<Loader />);
    }

    return (<div>
      <CoverPrimary
        title="Global Fishing Watch Blog"
        subtitle="Get the latest news on Global Fishing Watch."
        backgroundImageIndex={9}
      />
      <section className={listPosts['c-list-posts']}>
        {articles}
      </section>
      <PaginationBlog
        pages={this.state.totalPageCount}
        onPageChange={this.onPageChange}
        initialPage={this.state.currentPage}
      />
      <Footer />
    </div>);
  }
}

Blog.propTypes = {
  queryParams: React.PropTypes.object,
  initialPage: React.PropTypes.number,
  recentPost: React.PropTypes.object,
  getRecentPost: React.PropTypes.func
};


export default Blog;
