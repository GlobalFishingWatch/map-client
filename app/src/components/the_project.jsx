import React, { Component } from 'react';
import { Link } from 'react-router';
import Header from '../containers/header';
import CoverPrimary from './shared/CoverPrimary';
import Footer from './shared/footer';

class TheProject extends Component {

  render() {
    return (
      <div>
        <CoverPrimary
          title="The Project"
          subtitle="Global Fishing Watch enables anyone with an Internet connection to see
        fishing activity anywhere in the ocean in near real-time, for free."
        />
        <section>
          <p>
            Hundreds of millions of people depend on the ocean for their livelihoods and many more rely on the ocean for
            food. However, the world’s oceans are threatened by global overfishing, illegal fishing and habitat
            destruction. Their sustainability depends on action by governments, fishery management organizations,
            citizens and the fishing industry itself.
          </p>

          <p>
            This public beta version of Global Fishing Watch is available to anyone with an Internet connection
            and allows users to monitor when and where commercial fishing is occurring around the world.
          </p>

          <ul>
            <li>
              Citizens can see for themselves how their fisheries are being effectively managed and
              hold leaders accountable for long-term sustainability.
            </li>
            <li>
              Seafood suppliers can monitor the vessels they buy fish from.
            </li>
            <li>
              Journalists and the public can act as watchdogs to improve the sustainable management of global fisheries.
            </li>
            <li>
              Responsible fishermen can show they are adhering to the law.
            </li>
            <li>
              Researchers can address important fishery management questions.
            </li>
          </ul>
          <p>
            Global Fishing Watch uses public broadcast data from the Automatic Identification System (AIS), collected by
            satellite and terrestrial receivers, to show the movement of vessels over time. AIS provides a global feed
            of
            vessel locations, and Global Fishing Watch uses this information to track vessel movement and classify it as
            apparent “fishing” or “non-fishing” activity.
          </p>
          <p>
            A growing number of partners and collaborating organizations have contributed technical resources and
            expertise to Global Fishing Watch. If you would like to become involved, please
            <Link to="/contact-us">contact us</Link>.
          </p>
        </section>
        <Footer />
      </div>
    );
  }

}

export default TheProject;
