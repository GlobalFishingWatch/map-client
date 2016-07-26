'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import Header from "../containers/header";
import Footer from "./shared/footer";

class Blog extends Component {

  componentDidMount() {
    this.props.getRecentPost();
  }

  render() {
    let articles = [];
    if (this.props.recentPost) {
      articles = this.props.recentPost.posts.map(function (article) {
        return (
          <article>
            <h2>{article.title}</h2>
            <span dangerouslySetInnerHTML={{__html: article.content}}/>
          </article>
        );
      });
    }


    return <div>
      <header className={home.c_header}>
        <Header></Header>
      </header>
      <section className={home.header_home}>
        <h1>
          Blog
        </h1>

      </section>
      <section>
        {articles}
      </section>
      <Footer></Footer>
    </div>

  }

}

export default Blog;
