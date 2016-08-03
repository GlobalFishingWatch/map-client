'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import listposts from "../../styles/components/c-list_posts.scss";
import Header from "../containers/header";
import Footer from "./shared/footer";
import CoverBlog from "./blog/cover_blog";
import PaginationBlog from "./blog/pagination";
import boxtriangle from "../../assets/icons/box_triangle.svg";

class Blog extends Component {

  componentDidMount() {
    this.props.getRecentPost();
  }

  render() {
    let articles = [];
    if (this.props.recentPost) {
      articles = this.props.recentPost.posts.map(function(article) {
        return (
          <article>
            <h2>{article.title}</h2>
            <span dangerouslySetInnerHTML={{
              __html: article.content
            }}/>
          <p className={listposts['button-more']}>
              <a href={'/blog/'+article.id}><img src={boxtriangle}></img>FIND OUT MORE</a>
            </p>
            <hr></hr>
          </article>
        );
      });
    }

    return <div>
      <Header></Header>
      <CoverBlog></CoverBlog>
      <section className={listposts['c-list-posts']}>
        {articles}
      </section>
      <PaginationBlog></PaginationBlog>
      <Footer></Footer>
    </div>

  }

}

export default Blog;
