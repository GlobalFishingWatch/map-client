'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import Header from "../containers/header";
import Footer from "./shared/footer";

class FAQ extends Component {

  render() {
    return <div>
      <header className={home.c_header}>
        <Header></Header>
      </header>
      <section className={home.header_home}>
        <div>
          <h1>
            Frequently Asked Questions
          </h1>
        </div>
      </section>
      <Footer></Footer>
    </div>

  }

}

export default FAQ;
