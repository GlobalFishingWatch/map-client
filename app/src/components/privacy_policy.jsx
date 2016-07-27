'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import Header from "./shared/header";
import Footer from "./shared/footer";

class PrivacyPolicy extends Component {

  render() {
    return <div>
      <Header></Header>
      <section className={home.header_home}>
        <div>
          <h1>
            Privacy Policy
          </h1>
        </div>
      </section>
      <Footer></Footer>
    </div>

  }

}

export default PrivacyPolicy;
