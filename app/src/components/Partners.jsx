import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';

class Partners extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Global Fishing Watch Partners"
        subtitle="Global Fishing Watch was created by Oceana, SkyTruth and Google, and works in partnership
        with a growing number of organizations that contribute data, expertise
        and funding to make global fishing activity more transparent."
        backgroundImageIndex={2}
      />
      <section>
        <h2>Founding Partners</h2>
        <ul>
          <li>
            <a href="#">Oceana</a>
            <p>
              Oceana is the largest international advocacy organization dedicated solely to ocean conservation.
              Oceana is
              rebuilding abundant and biodiverse oceans by winning science-based policies in countries that control one
              third of the world’s wild fish catch. With over 100 victories that stop overfishing, habitat destruction,
              pollution and killing of threatened species like turtles and sharks, Oceana’s campaigns are delivering
              results. A restored ocean means that one billion people can enjoy a healthy seafood meal, every day,
              forever. Together, we can save the oceans and help feed the world. Visit www.oceana.org to learn more.
            </p>
          </li>
          <li>
            <a href="#">SkyTruth</a>
            <p>
              If you can see it, you can change it. SkyTruth hopes this illustration of global fishing activity,
              made available
              on a public map for the first time, will prompt people to ask questions
              about how well our ocean and its living
              resources are being managed and protected. Founded in 2001, SkyTruth’s mission
              is to make the world visible to the
              people that live in it. We’re driven by the belief that better transparency
              leads to better management and better
              outcomes for people and the environment. Check out what we do and how we work at
              <a href="www.skytruth.org">www.skytruth.org</a>.
            </p>
          </li>
          <li>
            <a href="#">Google</a>
            <p>
              Google Earth Outreach is a team dedicated to leveraging and developing Google’s
              infrastructure to address environmental and humanitarian issues through partnerships
              with non-profits, educational institutions, and research groups. To learn more, visit
              <a href="earth.google.com/outreach"> earth.google.com/outreach</a>.
            </p>
          </li>
        </ul>
        <h2>Founding Funders</h2>
        <a href="#">The Leonardo DiCaprio Foundation</a>
        <p>
          The Leonardo DiCaprio Foundation is dedicated to the long-term health and wellbeing of all Earth’s
          inhabitants. Through collaborative partnerships, we support innovative projects that protect vulnerable
          wildlife from extinction, while restoring balance to threatened ecosystems and communities.
        </p>
      </section>
      <Footer />
    </div>);
  }

}

export default Partners;
