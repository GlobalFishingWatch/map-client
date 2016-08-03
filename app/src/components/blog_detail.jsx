'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import listposts from "../../styles/components/c-list_posts.scss";
import Header from "../containers/header";
import Footer from "./shared/footer";
import CoverBlogDetail from "./blog/cover_blog_detail";
import PaginationBlog from "./blog/pagination";
import boxtriangle from "../../assets/icons/box_triangle.svg";

class BlogDetail extends Component {

  componentDidMount() {
    this.props.getPostById(this.props.params.id);
  }

  render() {
    return <div>
      <Header></Header>
      <CoverBlogDetail title={this.props.post ? this.props.post.title : null}></CoverBlogDetail>
      <section className={listposts['c-list-posts']}>
        <article>
        </article>
      </section>
      <Footer></Footer>
    </div>

  }

}

export default BlogDetail;
