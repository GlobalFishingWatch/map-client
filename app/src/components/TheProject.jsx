import React, { Component } from 'react';
import { Link } from 'react-router';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';

class TheProject extends Component {

  render() {
    return (
      <div>
        <CoverPrimary
          title="About the Project "
          subtitle="Global Fishing Watch enables anyone with an Internet connection
           to see fishing activity anywhere in the ocean in near real-time, for free."
          backgroundImageIndex={5}
        />
        <section>
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
            commercial fishing is occurring around the world.
          </p>

          <ul>
            <li>
              Citizens can see for themselves how their fisheries are being effectively
              managed and hold leaders accountable for long-term sustainability.
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
            Global Fishing Watch uses public broadcast data from the Automatic Identification System (AIS), collected
            by satellite and terrestrial receivers, to show the movement of
            vessels over time. AIS provides a global feed of
            vessel locations, and Global Fishing Watch uses this information to track vessel movement and classify
            it as apparent “fishing” or “non-fishing” activity.
          </p>
          <p>
            A growing number of partners and collaborating organizations have contributed technical
            resources and expertise to Global Fishing Watch. If you would like to become involved, please
            <Link to="/contact-us">contact us.</Link>.
          </p>
          <ul>
            <li>
              <h3>STEP 1: SATELLITES</h3>
              Over the course of the year, more than 200,000 different vessels, including more than 30,000
              known or likely commercial fishing vessels, broadcast their
              position, course and speed through AIS. Every day, a fleet of satellites
              records these broadcasts and beams the information down to Earth.
            </li>
            <li>
              <h3>STEP 2: DATA PROCESSING</h3>
              Each day, more than 20 million data points are added to the system. Using cloud
              computing and machine learning, Global Fishing Watch processes this data, identifying
              which vessels are fishing boats, and when and where they are likely fishing.
            </li>
            <li>
              <h3>STEP 3: YOU</h3>
              Once the data is visualized on Global Fishing Watch, anyone can track fishing activity across the globe.
            </li>
          </ul>
          <p>
            For media or press inquiries, please contact Dustin Cranor at
            954.348.1314 or via email at <a href="mailto:dcranor@oceana.org">dcranor@oceana.org</a>
          </p>
        </section>
        <Footer />
      </div>
    );
  }

}

export default TheProject;
