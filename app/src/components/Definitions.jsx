import React, { Component } from 'react';
import _ from 'lodash';
import $ from 'jquery';
import classnames from 'classnames';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import AppStyles from '../../styles/_base.scss';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import definitionsBackgroundImage from '../../assets/images/definitions.jpg';
import Accordion from './Shared/Accordion';

class Definitions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentAccordionIndex: null,
      firstAccordion: false
    };
  }

  componentDidMount() {
    this.props.getDefinitionEntries();
  }

  componentWillReceiveProps(nextProps) {
    const urlSlug = this.props.params.term;
    const currentAccordionIndex = _.findIndex(nextProps.definitionEntries, entry => entry.slug === urlSlug);
    // If we just got the entries and we have a slug in the URL, we expand the corresponding item
    if (!this.props.definitionEntries && nextProps.definitionEntries && urlSlug) {
      this.setState({ currentAccordionIndex });
    }
    if (this.props.definitionEntries && !this.state.firstAccordion && urlSlug) {
      this.state = {
        firstAccordion: true
      };
      this.setState({ currentAccordionIndex });
      const linkaccordion = document.getElementById('fishing-activity');
      const topPosition = window.scrollY + linkaccordion.getBoundingClientRect().top;
      $('html, body').animate({ scrollTop: topPosition }, 500);
    }
  }

  onAccordionItemClick(index, slug) {
    this.props.push(slug);

    // close accordion item if clicked again
    if (this.state.currentAccordionIndex === index) {
      this.setState({
        currentAccordionIndex: null
      });
      return;
    }

    this.setState({
      currentAccordionIndex: index
    });
  }

  render() {
    const accordion = (<Accordion
      entries={this.props.definitionEntries}
      onAccordionItemClick={(index, slug) => { this.onAccordionItemClick(index, slug); }}
      currentAccordionIndex={this.state.currentAccordionIndex}
      autoscroll
    />);

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
            {accordion}
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
  params: React.PropTypes.object,
  push: React.PropTypes.func
};

export default Definitions;
