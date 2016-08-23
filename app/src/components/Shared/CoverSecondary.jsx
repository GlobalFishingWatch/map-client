import React, { Component } from 'react';
import CoverPage from '../../../styles/components/c-cover-page.scss';
import baseStyle from '../../../styles/application.scss';
import Header from '../../containers/Header';
import termsBackgroundImage from '../../../assets/images/terms.png';
import articlesPublicationsBackgroundImage from '../../../assets/images/articles_publications.png';
import blogBackgroundImage from '../../../assets/images/blog.png';
import definitionsBackgroundImage from '../../../assets/images/definitions.png';
import faqBackgroundImage from '../../../assets/images/faq.png';
import partnersBackgroundImage from '../../../assets/images/partners.jpg';
import privacyPolicyBackgroundImage from '../../../assets/images/privacy_policy.png';
import projectBackgroundImage from '../../../assets/images/project.png';
import tutorialBackgroundImage from '../../../assets/images/tutorial.jpg';
import contactUsBackgroundImage from '../../../assets/images/contact_us.png';


class CoverSecondary extends Component {

  constructor(props) {
    super(props);
    this.images = [
      termsBackgroundImage,
      privacyPolicyBackgroundImage,
      projectBackgroundImage,
      partnersBackgroundImage,
      faqBackgroundImage,
      blogBackgroundImage,
      articlesPublicationsBackgroundImage,
      tutorialBackgroundImage,
      definitionsBackgroundImage,
      contactUsBackgroundImage
    ];
  }

  componentWillMount() {
    this.backgroundImage = this.images[Math.floor(Math.random() * this.images.length)];
  }

  render() {
    return (<section
      className={CoverPage['c-cover-page']}
      style={{ backgroundImage: `url(${this.backgroundImage})` }}
    >
      <div className={CoverPage['layer-cover']}>
        <Header />
        <div className={baseStyle.wrap}>
          <div className={CoverPage['contain-text-cover']}>
            <h1 className={CoverPage['cover-sub-title']}>
              {this.props.title}
            </h1>
            <p className={CoverPage['cover-sub-subtitle']}>
              {this.props.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>);
  }
}

CoverSecondary.propTypes = {
  title: React.PropTypes.any,
  subtitle: React.PropTypes.any
};

export default CoverSecondary;
