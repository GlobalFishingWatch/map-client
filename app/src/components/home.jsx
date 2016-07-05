'use strict';

import React, {Component} from 'react';
import home from '../../styles/index.scss';

class Home extends Component {

  render() {
    return <div>
      <section className={home.header_home}>
        <nav>
          <img src="#"/>
          <ul>
            <li>
              <a href="#map">Map</a>
            </li>
            <li>
              <a href="#">News</a>
            </li>
            <li>
              <a href="#">How to</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Login</a>
            </li>
          </ul>
        </nav>
        <h1>
          The first global view of commercial fishing activity
        </h1>
        <p>Global Fishing Watch, a partnership of Oceana, SkyTruth and Google, enables anyone with an Internet connection to see global fishing activity worldwide in near real-time - for free. It s a powerful tool that will hold our leaders accountable for maintaining abundant oceans and show consumers where - - and by whom -- their fish is being caught.</p>
        <div className={home.footer_header}>
          <div className={home.triangle}>
            <div className={home.triangle_min}></div>
          </div>
        </div>
      </section>
      <section className={home.section2}>
        <div>
          <h2>CASE ESTUDY</h2>
          <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis orci varius sem posuere tempus. Pellentesque enim nulla, consequat vitae faucibus a, vulputate at est. Quisque interdum, ex imperdiet feugiat eleifend, dui nibh cursus neque, dapibus fringilla lectus elit eget dolor. Phasellus ut nisl tortor. Ut posuere convallis consectetur. Nam.</p>
          <p>
            <a href="#">FIND OUT MORE</a>
          </p>
        </div>
        <div></div>
      </section>
      <section className={home.section3}>
        <div>
          <h2>THE MAP</h2>
          <h3>Lorem ipsum dolor sit amet</h3>
          <p>Morbi porttitor massa id bibendum varius. Etiam vitae pulvinar nisi, vel fringilla libero. Nulla consequat sodales lectus.</p>
          <p>
            <a href="#" className={home.btn_primary}>EXPLORE MAP</a>
          </p>
        </div>
      </section>
    </div>

  }

}

export default Home;
