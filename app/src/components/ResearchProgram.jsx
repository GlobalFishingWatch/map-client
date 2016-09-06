import React, { Component } from 'react';
import classnames from 'classnames';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import { Link } from 'react-router';
import Rhombus from './Shared/Rhombus';
import baseStyle from '../../styles/_base.scss';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import researchProgramBackgroundImage from '../../assets/images/research-program.jpg';
import AncorsLogo from '../../assets/research-partners/ancors.svg';
import CSIROLogo from '../../assets/research-partners/csiro.svg';
import StanfordLogo from '../../assets/research-partners/stanford.svg';
import McCauleyLogo from '../../assets/research-partners/mc-cauley.svg';
import MarineGeospatialLogo from '../../assets/research-partners/marine-geospatial-ecology-lab.svg';
import SustainableFisheries from '../../assets/research-partners/sustainable-fisheries-group.svg';
import WormLabLogo from '../../assets/research-partners/worm-lab.svg';

class ResearchProgram extends Component {

  render() {
    return (
      <div>
        <CoverPrimary
          title="Research Program"
          subtitle="The Research Program is an interdisciplinary collaboration
          that strives to improve fisheries management and science through shared data and cooperation."
          backgroundImage={researchProgramBackgroundImage}
          attribution="earl_of_omaha/iStock/Thinkstock"
        />
        <div className={baseStyle.wrap}>
          <div className={classnames(StaticPageStyles['l-static-page'], StaticPageStyles['-research-program'])}>
            <section className="section-page">
              <p>
                Scientists play a key role in identifying and understanding the complex challenges facing our oceans,
                which is why we are working closely with some of the world’s leading researchers to extend
                the value of our dataset. Our collaborations contribute to discoveries and solutions critical
                to marine conservation,
                global economics, and human welfare. The partnerships we are forging will help us understand the role
                fishing plays in the physical, biological, economic, and political factors facing the oceans. The
                Research Program also aims to support the entire scientific community by making additional datasets
                publicly available to enable future works.
              </p>
              <p>
                Core principles of Global Fishing Watch include transparency and collaboration, and the Research
                Program is based on these same principles. Research partners are committed to sharing datasets,
                ideas, and techniques, with the belief that broader access to information leads to future
                initiatives and more impact.
              </p>
            </section>
            <section className="section-page">
              <h2 className="section-title">Research Partners & Projects</h2>
              <article className={StaticPageStyles['section-item']}>
                <img
                  className={StaticPageStyles['logo-partner']} src={CSIROLogo}
                  alt="Commonwealth Scientific and Industrial Research Organisation (CSIRO)"
                />
                <h4 className="section-subtitle">
                  Commonwealth Scientific and Industrial Research Organisation (CSIRO): MCS Analytics
                </h4>
                <p>
                  MCS (Monitoring, Control and Surveillance) Analytics is a collaboration between the Indonesian
                  Ministry of Marine Affairs and Fisheries and the Australian Commonwealth Scientific and Industrial
                  Research Organization (CSIRO) to improve the use of fisheries monitoring data. The research teams are
                  developing statistical tools for understanding the activities of fishing vessels, with the goal of
                  improving fisheries statistics and enhancing the information available for reducing IUU fishing.
                  Working with Global Fishing Watch, CSIRO researchers within this collaboration seek to to identify
                  when vessels intentionally disable AIS devices, and they are working to better understand
                  transshipment behavior.
                </p>
              </article>
              <article className={StaticPageStyles['section-item']}>
                <img
                  className={StaticPageStyles['logo-partner']}
                  src={WormLabLogo}
                  alt="Worm Lab"
                />
                <h4 className="section-subtitle">Dalhousie University: Worm Lab</h4>
                <p>
                  The Worm Lab includes students and postdoctoral fellows engaged in the study of marine biodiversity,
                  its causes, consequences of change, and conservation. The lab focuses on how marine biodiversity is
                  distributed across the globe, how it changes over time, and how its loss can be prevented. Fishing can
                  cause major impacts on marine biodiversity, and together with Global Fishing Watch, the Worm lab is
                  conducting several studies on these impacts, including investigations into the interactions of fishing
                  with marine protected areas, biodiversity hotspots, migratory species, and the global effects of
                  fishing on biodiversity.
                </p>
              </article>
              <article className={StaticPageStyles['section-item']}>
                <img
                  className={StaticPageStyles['logo-partner']}
                  src={MarineGeospatialLogo}
                  alt="Marine Geospatial Ecology Lab"
                />
                <h4 className="section-subtitle">Duke University: Marine Geospatial Ecology Lab</h4>
                <p>
                  The Marine Geospatial Ecology Lab at Duke University applies geospatial technologies to issues in
                  marine ecology, resource management and ocean conservation. The lab contributes ecological analysis,
                  statistical models, geospatial tools, and open-access data to marine policy and management processes
                  from local to international scales. In partnership with Global Fishing Watch, the lab is working to
                  better characterize fishing activity in the Pacific Ocean and understand how Global Fishing Watch data
                  can assist with management challenges in the high seas.
                </p>
              </article>
              <article className={StaticPageStyles['section-item']}>
                <img
                  className={StaticPageStyles['logo-partner']}
                  src={StanfordLogo}
                  alt="Stanford University: Block Lab"
                />
                <h4 className="section-subtitle">Stanford University: Block Lab</h4>
                <p>
                  The Block lab focus on how large pelagic fishes utilize the open ocean, and draws on innovative
                  telemetry devices to track the movement of pelagic predators. The research in the lab is
                  interdisciplinary, combining physiology, ecology, and genetics with oceanography and engineering.
                  Working with Global Fishing Watch, the lab is undertaking a few projects related to understanding
                  patterns of high-seas fishing activity across the globe and how global fishing fleets interact with
                  large pelagic fish and sharks. This work will be applied to inform marine spatial planning and
                  fisheries management for areas outside national jurisdictions.
                </p>
              </article>
              <article className={StaticPageStyles['section-item']}>
                <img
                  className={StaticPageStyles['logo-partner']}
                  src={McCauleyLogo}
                  alt="McCauley Lab"
                />
                <h4 className="section-subtitle">University of California, Santa Barbara: McCauley Lab</h4>
                <p>
                  The McCauley Lab is a consortium of broadly trained ecologists that focus on understanding how we
                  influence the oceans and how the oceans influence us. The lab is using Global Fishing Watch data to
                  evaluate the efficacy of large marine protected areas; to strengthen emerging commitments by the
                  United Nations to protect biodiversity of the high seas; and to better understand how fishing shapes
                  global patterns of environmental justice.
                </p>
              </article>
              <article className={StaticPageStyles['section-item']}>
                <img
                  className={StaticPageStyles['logo-partner']}
                  src={SustainableFisheries}
                  alt="Sustainable Fisheries Group"
                />
                <h4 className="section-subtitle">
                  University of California, Santa Barbara: Sustainable Fisheries Group
                </h4>
                <p>
                  The Sustainable Fisheries Group (SFG) is a collaboration between UC Santa Barbara’s Marine Science
                  Institute and the Bren School of Environmental Science and Management. SFG’s research draws on diverse
                  market approaches, bioeconomic modeling, and spatial analysis to improve the ecological and economic
                  performance of fisheries and other ocean uses. Using Global Fishing Watch data, SFG is engaged in
                  projects on the costs of high seas fishery policies, behavioral shifts following large-scale marine
                  reserve implementation, the importance of global change in the spatial distribution of fish and
                  fishermen, and real-time stock assessments.
                </p>
              </article>
              <article className={StaticPageStyles['section-item']}>
                <img
                  className={StaticPageStyles['logo-partner']}
                  src={AncorsLogo}
                  alt="Australian National Centre for Ocean Resources and Security (ANCORS)"
                />
                <h4 className="section-subtitle">
                  University of Wollongong: Australian National Centre for Ocean Resources and Security (ANCORS)
                </h4>
                <p>
                  The ANCORS Fisheries Governance Program studies how we manage human interaction with our marine
                  environment, and develops innovative solutions to manage our activities and impacts. Their applied
                  research engages with communities and governments, analyzes key problems, and creates new solutions
                  that deliver real outcomes with tangible impacts. ANCORS is collaborating with Global Fishing Watch to
                  research and develop innovative approaches to fisheries governance, science, and marine conservation.
                </p>
              </article>
            </section>
            <section className="section-page">
              <h2 className="section-title">Researcher Testimonials and Videos</h2>
              <article className={StaticPageStyles.testimonial}>
                <iframe
                  src="https://www.youtube.com/embed/jT_XhUiiUaE"
                  frameBorder="0"
                  allowFullScreen
                />
                <p className={StaticPageStyles['video-quote']}>
                  “I think Global Fishing Watch is poised to completely revolutionize the way fisheries are managed, the
                  way fisheries are assessed, the way fisheries are monitored and evaluated. So I think pretty much
                  everything we don in fisheries could be revolutionized by Global Fishing Watch.”
                  -- Dr. Chris Costello
                </p>

                <Rhombus direction="-right">
                  <Link
                    to="http://blog.globalfishingwatch.org/2016/08/interview-with-chris-costello-
environmental-economist.html"
                    target="_blank"
                  >
                    read full article
                  </Link>
                </Rhombus>

              </article>
              <article className={StaticPageStyles.testimonial}>
                <iframe
                  src="https://www.youtube.com/embed/7cMVTLKNozI"
                  frameBorder="0"
                  allowFullScreen
                />
                <p className={StaticPageStyles['video-quote']}>
                  “I think Global Fishing Watch could play a key role in making human use of the
                  ocean transparent to everybody.”
                  --Dr. Boris Worm
                </p>

                <Rhombus direction="-right">
                  <Link
                    to="http://blog.globalfishingwatch.org/2016/07/interview-with-renowned-marine-
ecologist-boris-worm.html"
                    target="_blank"
                  >
                    read full article
                  </Link>
                </Rhombus>

              </article>
              <article className={StaticPageStyles.testimonial}>
                <iframe
                  src="https://www.youtube.com/embed/c-Yubmdk1hQ"
                  frameBorder="0"
                  allowFullScreen
                />
                <p className={StaticPageStyles['video-quote']}>
                  “Until Global Fishing Watch came online, there was not a publicly available source of
                  information about where fishing was happening.”
                  --Dr. Douglas McCauley
                </p>

                <Rhombus direction="-right">
                  <Link
                    to="http://blog.globalfishingwatch.org/2016/07/interview-with-marine-ecologist-
dr-doug-mccauley.html"
                    target="_blank"
                  >
                    read full article
                  </Link>
                </Rhombus>

              </article>
            </section>
            <section className="section-page">
              <h2 className="section-title">Access to Global Fishing Watch Data</h2>
              <p>Global Fishing Watch is committed to making as much of its data freely available as possible. We
                will be publishing daily, detailed, global rasters of fishing activity, which will be available to
                research partners via <a
                  className="gfw-link"
                  href="http://earthengine.google.com/"
                  target="_blank"
                >
                Google’s Earth Engine
                </a>
                &nbsp; platform. Earth Engine provides incredibly powerful cloud spatial
                analytics alongside the world’s largest public data catalog with over five petabytes of imagery at
                your fingertips. The underlying AIS data, with positions of individual vessels, is a commercial
                dataset we have licensed for the project. While our agreement does not allow for redistribution of the
                raw data, as that would adversely affect our providers, we are seeking arrangements for researchers to
                more easily acquire a license. Please contact&nbsp;
                <a
                  className="gfw-link"
                  href="mailto:research@globalfishingatch.org"
                >
                research@globalfishingatch.org
                </a>
                &nbsp;if interested in these datasets.
              </p>
            </section>
            <section className="section-page">
              <h2 className="section-title">Research Program Publications</h2>
              <p>McCauley, D., P. Woods, B. Sullivan, B. Bergman, C. Jablonicky, A. Roan,
                M. Hirshfield, K. Boerder,
                and B. Worm. 2016.&nbsp;
                <a
                  className="gfw-link"
                  href="http://science.sciencemag.org/content/351/6278/1148"
                  target="_blank"
                >
                  Ending hide and seek in the oceans.
                </a> Science.
              </p>
              <p>Souza, E. N. de, Boerder, K., Matwin, S. and Worm, B. 2016.&nbsp;
                <a
                  className="gfw-link"
                  href="http://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0158248"
                  target="_blank"
                >
                  Improving Fishing Pattern Detection from Satellite AIS Using Data Mining and Machine Learning
                </a>. PLOS ONE 11, e0158248.
              </p>
              <p>Robards, M., Silber, G., Adams, J., Arroyo, J., Lorenzini, D., Schwehr, K., and Amos, J. 2016.&nbsp;
                <a
                  className="gfw-link"
                  href="http://vislab-ccom.unh.edu/~schwehr/papers/2016-RobardsEtAl-AIS-conservation.pdf"
                  target="_blank"
                >
                  Conservation science and policy applications of the marine vessel Automatic Identification System
                  (AIS)—a review
                </a>
                . Bulletin of Marine Science 92, 75–103.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

}

export default ResearchProgram;
