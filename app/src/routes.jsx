import React, { Component } from 'react';
import AppContainer from './containers/App';
import HomeContainer from './components/Home';
import AuthMapContainer from './containers/AuthMap';
import ArticlesPublications from './containers/ArticlesPublications';
import FAQContainer from './containers/FAQ';
import Tutorials from './components/Tutorials';
import Orbcomm from './components/Orbcomm';
import Definitions from './containers/Definitions';
import TheProject from './components/TheProject';
import Partners from './components/Partners';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import { Router, Route, IndexRoute } from 'react-router';
import ContactUsContainer from './containers/ContactUs';

class Routes extends Component {
  render() {
    return (<Router history={this.props.history}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={HomeContainer} />

        <Route path="map" component={AuthMapContainer} />

        <Route path="articles-publications" component={ArticlesPublications} />

        <Route path="faq" component={FAQContainer} />
        <Route path="tutorials" component={Tutorials} />
        <Route path="definitions" component={Definitions} />

        <Route path="the-project" component={TheProject} />
        <Route path="partners" component={Partners} />
        <Route path="contact-us" component={ContactUsContainer} />

        <Route path="terms-of-use" component={TermsOfUse} />
        <Route path="privacy-policy" component={PrivacyPolicy} />

        <Route path="orbcomm" component={Orbcomm} />
      </Route>
    </Router>);
  }
}

Routes.propTypes = {
  history: React.PropTypes.any
};

export default Routes;
