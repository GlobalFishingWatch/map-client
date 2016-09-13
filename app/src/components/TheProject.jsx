import React, { Component } from 'react';
import classnames from 'classnames';
import CoverPrimary from './Shared/CoverPrimary';
import ToolTip from '../components/Shared/ToolTip';
import Footer from './Shared/Footer';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import baseStyle from '../../styles/_base.scss';
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
        <div className={baseStyle.wrap}>
          <div className={classnames(StaticPageStyles['l-static-page'], StaticPageStyles['-about'])}>
            <section className="section-page">
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
                commercial <ToolTip text="Apparent fishing" href="/definitions/fishing-activity">fishing</ToolTip> is
                 occurring around the world.
              </p>
              <ul className="c-item-list">
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
                at{' '}
                <a
                  href="mailto:dcranor@oceana.org"
                  className="gfw-link"
                >dcranor@oceana.org</a>.
              </p>
            </section>
            <section className="section-page">
              <article className={StaticPageStyles.testimonial}>
                <iframe
                  src="https://www.youtube.com/embed/1R94qBIwMKM"
                  frameBorder="0"
                  allowFullScreen
                />
                <p className={classnames(StaticPageStyles['video-quote'], StaticPageStyles['-big-author'])}>
                  <i>“Global Fishing Watch is going to be transformative.
                  It will really change the way we manage fisheries because
                  we can see what’s happening instead of just trying to
                  envision what’s out there on the water. We will know,
                  and therefore, we can make smarter decisions…Right
                  now commercial fishers know that no one can actually
                  see where they are and what they’re doing. And many of
                  them abide by the rules, many of them do not. Global
                  Fishing Watch is going to change that, because now somebody
                  can be watching, purely and simply. We can see what they
                  are doing and that’s going to make a big difference.”</i>
                  <span>– Dr. Jane Lubchenco, U.S. Science Envoy for the Ocean,
                  U.S. Department of State; Distinguished University Professor,
                  Oregon State University; former Administrator at the National
                  Oceanic and Atmospheric Association</span>
                </p>
              </article>

              <article className={StaticPageStyles.testimonial}>
                <iframe
                  src="https://www.youtube.com/embed/ISbIUjCz8Pg"
                  frameBorder="0"
                  allowFullScreen
                />
                <p className={classnames(StaticPageStyles['video-quote'], StaticPageStyles['-big-author'])}>
                  <i>“Global Fishing Watch is a godsend to ocean conservation.
                    It is the only remote vessel tracking system that is
                    global and publicly available. This is the beginning
                    of the end of illegal fishing.”
                  </i>
                  <span>– Dr. Enric Sala, Explorer-in-Residence, National Geographic Society</span>
                </p>
              </article>

              <article className={StaticPageStyles.testimonial}>
                <iframe
                  src="https://www.youtube.com/embed/uVpwBzFnxI8"
                  frameBorder="0"
                  allowFullScreen
                />
                <p className={classnames(StaticPageStyles['video-quote'], StaticPageStyles['-big-author'])}>
                  <i>“It’s interesting to be able to follow a
                  given ship and to look back at where
                  it’s been. So if they claim one thing,
                  as a journalist you can go back and say
                  ‘no you were not there, you were here at
                  that time.’ So that’s new… To journalists
                  I think the big story is going to be how
                  Global Fishing Watch is going to change the
                  way illegal fishing is done. Until now, boats
                  could turn on or turn off their AIS systems
                  and nobody really noticed. But now, it’s going
                  o be a lot harder.”</i>
                  <span>– Chris Pala, Freelance Journalist</span>
                </p>
              </article>

              <article className={StaticPageStyles.testimonial}>
                <p className={classnames(StaticPageStyles['video-quote'], StaticPageStyles['-big-author'])}>
                  <i>“Global Fishing Watch is a transformative tool
                  to identify fishing activity and verify
                  fleets are fishing both sustainably and responsibly.”</i>
                  <span>– Alexandra Cousteau, Ocean Advocate</span>
                </p>
              </article>

              <article className={StaticPageStyles.testimonial}>
                <p className={classnames(StaticPageStyles['video-quote'], StaticPageStyles['-big-author'])}>
                  <i>“Illegal, Unreported and Unregulated (IUU) Fishing is a global crime.
                  To put an end to it, we have to use all the tools we have
                  to ensure that all fishing efforts in our waters are seen
                  and recorded. Once Global Fishing Watch kicks in,
                  no fishing boat will be able to hide.”</i>
                  <span>– Susi Pudjiastuti, Minister of Maritime Affairs and Fisheries, Indonesia</span>
                </p>
              </article>

              <article className={StaticPageStyles.testimonial}>
                <p className={classnames(StaticPageStyles['video-quote'], StaticPageStyles['-big-author'])}>
                  <i>“Global Fishing Watch will be a groundbreaking tool to help
                  ensure that fishers are following the rules that govern
                  where and when they can fish. As a result, every
                  scientist, government and ocean advocate will be
                  well equipped with information to help reverse
                  current trends and rebuild ocean abundance.”</i>
                  <span>– Dr. Daniel Pauly, Professor, Institute for the Oceans
                  and Fisheries & Department of Zoology, The University
                  of British Columbia</span>
                </p>
              </article>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

}

export default TheProject;
