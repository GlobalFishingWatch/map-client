import React, { Component } from 'react';
import _ from 'lodash';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import AppStyles from '../../styles/application.scss';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import definitionsBackgroundImage from '../../assets/images/definitions.jpg';
import Accordion from './Shared/Accordion';

class Definitions extends Component {

  componentDidMount() {
    this.props.getDefinitionEntries();
  }

  componentWillReceiveProps(nextProps) {
    this.openAccordionItem(nextProps.definitionEntries, nextProps.params.term);
  }

  onAccordionItemClick(index, slug) {
    this.props.push(index ? slug : '');
  }

  openAccordionItem(definitionEntries, slug) {
    const currentAccordionIndex = _.findIndex(definitionEntries, entry => entry.slug === slug);

    this.setState({
      currentAccordionIndex
    });
  }

  render() {
    const accordion = (<Accordion
      entries={this.props.definitionEntries}
      onAccordionItemClick={(index, slug) => { this.onAccordionItemClick(index, slug); }}
      currentAccordionIndex={(this.state) ? this.state.currentAccordionIndex : null}
    />);

    return (<div>
      <CoverPrimary
        title="Definitions"
        subtitle="Review definitions of terms you will find across our site and as you explore the Map."
        backgroundImage={definitionsBackgroundImage}
        attribution="© OCEANA /A. Ellis"
      />
      <div className={StaticPageStyles['l-static-page']}>
        <div className={AppStyles.wrap}>
          <p className={StaticPageStyles.intro}>Click on the term below to see the definition.</p>
          {accordion}
        </div>
      </div>
      <Footer />
    </div>);
  }

}

Definitions.propTypes = {
  definitionEntries: React.PropTypes.array,
  getDefinitionEntries: React.PropTypes.func,
  params: React.PropTypes.object,
  push: React.PropTypes.func
};

export default Definitions;
