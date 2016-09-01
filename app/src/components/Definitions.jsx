import React, { Component } from 'react';
import classnames from 'classnames';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import Loader from './Shared/Loader';
import ContentAccordion from '../containers/ContentAccordion';
import AppStyles from '../../styles/application.scss';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import definitionsBackgroundImage from '../../assets/images/definitions.jpg';

class Definitions extends Component {

  componentDidMount() {
    this.props.getDefinitionEntries();
  }
  render() {
    let accordionContent = (<Loader />);

    const activeItem = !!this.props.params ?
      this.props.params.term : null;

    if (this.props.definitionEntries && this.props.definitionEntries.length > 0) {
      accordionContent = (<ContentAccordion
        entries={this.props.definitionEntries}
        activeItem={activeItem}
      />);
    }
    return (<div>

      <CoverPrimary
        title="Definitions"
        subtitle="Review definitions of terms you will find across our site and as you explore the Map."
        backgroundImage={definitionsBackgroundImage}
        attribution="© OCEANA /A. Ellis"
      />
      <div className={classnames(StaticPageStyles['l-static-page'], StaticPageStyles['-definitions'])}>
        <div className={AppStyles.wrap}>
          <p className={StaticPageStyles.intro}>Click on the term below to see the definition.</p>
          <div className="section-page">
            {accordionContent}
          </div>
        </div>
      </div>
      <Footer />
    </div>);
  }

}

Definitions.propTypes = {
  definitionEntries: React.PropTypes.array,
  getDefinitionEntries: React.PropTypes.func,
  params: React.PropTypes.object
};

export default Definitions;
