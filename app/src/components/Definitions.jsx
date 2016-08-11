import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';

class Definitions extends Component {

  componentDidMount() {
    this.props.getDefinitionEntries();
  }
  render() {
    let definitionContent = [];
    const definitionEntries = this.props.definitionEntries;
    if (!!definitionEntries && definitionEntries.length > 0) {
      for (let index = 0; index < definitionEntries.length; index++) {
        definitionContent.push(
          <li>
            <h2>{definitionEntries[index].term}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: definitionEntries[index].definition
              }}
            />
          </li>
        );
      }
    }
    return (<div>
      <CoverPrimary
        title="Glossary of Terms"
        subtitle="Review definitions of terms you will find across our site and as you explore the Map."
      />
      <section>
        {definitionContent}
      </section>
      <Footer />
    </div>);
  }

}

Definitions.propTypes = {
  definitionEntries: React.PropTypes.array,
  getDefinitionEntries: React.PropTypes.func
};

export default Definitions;
