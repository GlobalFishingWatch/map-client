'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import Header from "./header";

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

      <footer>
        <div className={home.logos_footer}>
          <div className={home.partner_footer}>
            <span>Founding Partners</span>
            <img src="app/assets/partners/google.png"></img>
            <img src="app/assets/partners/google.png"></img>
            <img src="app/assets/partners/google.png"></img>
          </div>
          <div className={home.sponsor_footer}>
            <span>Lead Sponsor</span>
          </div>
        </div>
        <div className={home.nav_footer}>
          <ul>
            <li><a href="/map">Map</a></li>
            <li><a href="/news">News</a></li>
            <li>how to</li>
            <li>about</li>
          </ul>
          <ul>
            <li>terms of use</li>
            <li>privacy policy</li>
            <li>contact us</li>
          </ul>
          <ul>
            <li>Follow us</li>
            <li>ICONS</li>
          </ul>
          <div className={home.input_footer}>
            <span>SUBSCRIBE TO NEWS</span>
            <div className={home.c_input_button}>
              <input type="email" placeholder="Email"></input>
              <button class="button--addOnRight" className={home.button_addOnRight}>icon</button>
            </div>
          </div>
        </div>
        <div className={home.project_name_footer}></div>
      </footer>
    </div>

  }

}

export default News;
