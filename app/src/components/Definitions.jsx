import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import Loader from './Shared/Loader';
import ContentAccordion from './Shared/ContentAccordion';
import AppStyles from '../../styles/application.scss';
import definitionsBackgroundImage from '../../assets/images/definitions.png';


class Definitions extends Component {

  componentDidMount() {
    this.props.getDefinitionEntries();
  }
  render() {
    let accordionContent = (<Loader />);

    if (this.props.definitionEntries && this.props.definitionEntries.length > 0) {
      accordionContent = (<ContentAccordion
        entries={this.props.definitionEntries}
      />);
    }

    return (<div>
      <CoverPrimary
        title="Definitions"
        subtitle="Review definitions of terms you will find across our site and as you explore the Map."
        backgroundImage={definitionsBackgroundImage}
      />
      <div className={AppStyles.wrap}>
        {accordionContent}
      </div>
      <Footer />
    </div>);
  }

}

Definitions.propTypes = {
  definitionEntries: React.PropTypes.array,
  getDefinitionEntries: React.PropTypes.func
};

export default Definitions;
