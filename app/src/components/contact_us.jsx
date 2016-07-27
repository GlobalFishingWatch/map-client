'use strict';

import React, {Component} from "react";
import home from "../../styles/index.scss";
import Header from "../containers/header";
import Footer from "./shared/footer";

class ContactUs extends Component {

  render() {
    return <div>
<Header></Header>
      <section className={home.header_home}>
        <div>
          <h1>
            Contact Us
          </h1>
        </div>
      </section>
      <Footer></Footer>
    </div>

  }

}

export default ContactUs;
