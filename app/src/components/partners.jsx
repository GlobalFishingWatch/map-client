'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import Header from "../containers/header";
import Footer from "./shared/footer";

class Partners extends Component {

  render() {
    return <div>
      <Header></Header>
      <section className={home.header_home}>
        <div>
          <h1>
            Partners
          </h1>
        </div>
      </section>
      <Footer></Footer>
    </div>

  }

}

export default Partners;
