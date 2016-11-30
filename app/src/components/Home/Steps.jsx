import React, { Component } from 'react';
import classnames from 'classnames';
import ToolTip from '../../components/Shared/ToolTip';
import StepsStyle from '../../../styles/components/homepage/c-steps.scss';
import baseStyle from '../../../styles/_base.scss';
import iconSatellite from '../../../assets/images/steps/icon-step-1.svg';
import iconData from '../../../assets/images/steps/icon-step-2.svg';
import iconYou from '../../../assets/images/steps/icon-step-3.svg';

class Steps extends Component {
  render() {
    return (
      <section className={baseStyle.wrap}>
        <div className={StepsStyle['c-steps']} id="steps">
          <div className={StepsStyle.intro}>
            <p>Global Fishing Watch analyzes data from the Automatic Identification System (AIS), which is
              collected by satellites and terrestrial receivers, to identify{' '}
              <ToolTip text="Apparent fishing" href="/definitions/fishing-activity">apparent fishing</ToolTip> behavior
              based on the movement of vessels over time.
            </p>
          </div>

          <ul className={StepsStyle['steps-list']}>
            <li className={StepsStyle.step}>
              <div className={StepsStyle['step-intro']}>
                <h2 className={StepsStyle.amount}>35,000+</h2>
                <span className={StepsStyle.definition}>fishing vessels tracked</span>
              </div>
              <div className={classnames(StepsStyle.thumbnail, StepsStyle['-satellite'])}>
                <img
                  className={StepsStyle['thumbnail-icon']}
                  src={iconSatellite}
                  alt="step-1 satellites"
                />
              </div>
              <div className={StepsStyle.content}>
                <h3 className={StepsStyle.name}>Step 1: Satellites</h3>
                <p>
                  Over the course of the year, 200,000+ vessels, including more than 35,000 known or likely commercial
                  fishing boats, broadcast their position, course, and speed through AIS. Fleets of satellites record
                  these broadcasts and transmit the information to Earth.
                </p>
              </div>
            </li>
            <li className={StepsStyle.step}>
              <div className={StepsStyle['step-intro']}>
                <span className={StepsStyle.amount}>37+ billion</span>
                <span className={StepsStyle.definition}>ais messages processed</span>
              </div>
              <div className={classnames(StepsStyle.thumbnail, StepsStyle['-data'])}>
                <img
                  className={StepsStyle['thumbnail-icon']}
                  src={iconData}
                  alt="step-2 data processing"
                />
              </div>
              <div className={StepsStyle.content}>
                <h3 className={StepsStyle.name}>Step 2: Data Processing</h3>
                <p>22+ million data points are added to the system every day. Using cloud computing and machine
                  learning, Global Fishing Watch processes the data, identifying which vessels are fishing boats,
                  and when and where they are fishing.
                </p>
              </div>
            </li>
            <li className={StepsStyle.step}>
              <div className={StepsStyle['step-intro']}>
                <span className={StepsStyle.amount}>4.5+</span>
                <span className={StepsStyle.definition}>years of data</span>
              </div>
              <div className={classnames(StepsStyle.thumbnail, StepsStyle['-you'])}>
                <img
                  className={StepsStyle['thumbnail-icon']}
                  src={iconYou}
                  alt="step-3 engage"
                />
              </div>
              <div className={StepsStyle.content}>
                <h3 className={StepsStyle.name}>Step 3: Engage</h3>
                <p>Once the data are visualized on Global Fishing Watch, anyone can track fishing activity
                across the globe.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

export default Steps;
