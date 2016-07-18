'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import Header from "./header";
import Footer from './footer';

class News extends Component {

  componentDidMount(){
    this.props.getRecentPost();
  }
  render() {
    let posts = [];
    if (this.props.recentPost){
      for (let i = 0, length = this.props.recentPost.posts.length; i < length; i++) {
        posts.push(<li>{this.props.recentPost.posts[i].title}</li>);
      }
    }
    return <div>
      <section className={home.header_home}>
        <Header></Header>
        <h1>
          News
        </h1>

      </section>
      <section>
        <div>
          <ul>
            {posts}
          </ul>
        </div>
      </section>
      <Footer></Footer>
    </div>

  }

}

export default News;
