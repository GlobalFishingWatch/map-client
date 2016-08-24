import React, { Component } from 'react';
import infoWebStyle from '../../../styles/components/c-info-web.scss';
import baseStyle from '../../../styles/application.scss';
import infoIconBlack from '../../../assets/icons/info_black.svg';
import tooltipStyle from '../../../styles/components/c-tooltip-info.scss';

class InfoWeb extends Component {
  render() {
    return (
      <section className={baseStyle.wrap}>
        <div className={infoWebStyle['c-info-web']}>
          <div className={infoWebStyle['image-info-web']}></div>
          <div className={infoWebStyle['text-info-web']}>
            <p>
              Global Fishing Watch uses public broadcast data from the Automatic Identification System (AIS), collected
              by satellite and terrestrial receivers, to show the movement of vessels over time.
            </p>
            <h3>STEP 1: SATELLITES</h3>
            <p>
              Over the course of the year, more than 200,000 different vessels, including more than 30,000 known or
              likely commercial fishing vessels, broadcast their position, course and speed through AIS. Every day, a
              fleet of satellites records these broadcasts and beams the information down to Earth.
            </p>
            <h3>STEP 2: DATA PROCESSING</h3>
            <p>
              Each day, more than 20 million data points are added to the system. Using cloud computing and machine
              learning, Global Fishing Watch processes these data, identifying which vessels are fishing boats, and when
              and where they are fishing.
            </p>
            <h3>STEP 3: YOU</h3>
            <p>
              Once the data is visualized on Global Fishing Watch, anyone can track fishing activity
              <a
                className={tooltipStyle['c-tooltip-info']} href="#"
              >
                <img src={infoIconBlack} alt="info icon"></img>
                <span>Apparent fishing activity</span>
              </a>
              across the globe.
            </p>
          </div>
        </div>
      </section>);
  }
}

export default InfoWeb;
