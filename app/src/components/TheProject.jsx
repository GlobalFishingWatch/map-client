import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import ToolTip from '../components/Shared/ToolTip';
import Footer from './Shared/Footer';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import baseStyle from '../../styles/_base.scss';
import theProjectStyle from '../../styles/components/c-the-project.scss';
import projectBackgroundImage from '../../assets/images/project.jpg';

class TheProject extends Component {

  render() {
    return (
      <div>
        <CoverPrimary
          title="About the Project "
          subtitle="Global Fishing Watch enables anyone with an Internet connection
           to see fishing activity anywhere in the ocean in near real-time, for free."
          backgroundImage={projectBackgroundImage}
          attribution="© OCEANA / Keith Ellenbogen"
        />
        <div className={StaticPageStyles['l-static-page']}>
          <div className={baseStyle.wrap}>
            <section className={theProjectStyle['c-the-project']}>
              <p>
                Hundreds of millions of people depend on the ocean for their livelihoods
                and many more rely on the ocean for
                food. However, the world’s oceans are threatened by global overfishing,
                illegal fishing and habitat destruction. Their
                sustainability depends on action by governments, fishery management
                organizations, citizens and the fishing industry itself.
              </p>
              <p>
                This public beta version of Global Fishing Watch is available to anyone
                with an Internet connection and allows users to monitor when and where
                commercial <ToolTip text="Apparent fishing" href="/definitions/fishing-effort">fishing</ToolTip> is
                 occurring around the world.
              </p>
              <ul className={theProjectStyle['list-info']}>
                <li>
                  <p>
                    Citizens can see for themselves how their fisheries are being effectively
                    managed and hold leaders accountable for long-term sustainability.
                  </p>
                </li>
                <li>
                  <p>
                    Seafood suppliers can monitor the vessels they buy fish from.
                  </p>
                </li>
                <li>
                  <p>
                    Journalists and the public can act as watchdogs to
                    improve the sustainable management of global fisheries.
                  </p>
                </li>
                <li>
                  <p>
                    Responsible fishermen can show they are adhering to the law.
                  </p>
                </li>
                <li>
                  <p>
                    Researchers can address important fishery management questions.
                  </p>
                </li>
              </ul>
              <p>
                For media or press inquiries, please contact Dustin Cranor at
                954.348.1314 or via email
                at&nbsp;
                <a
                  href="mailto:dcranor@oceana.org"
                  className="gfw-link"
                >dcranor@oceana.org</a>.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

}

export default TheProject;
