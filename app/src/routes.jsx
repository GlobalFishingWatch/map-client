import React, {Component} from 'react';
import AppContainer from './containers/app';
import HomeContainer from './containers/home';
import MapContainer from './containers/map';
import BlogContainer from './containers/blog';
import BlogDetailContainer from './containers/blog_detail';
import ArticlesPublications from './components/articles_publications';
import FAQ from './components/faq';
import Tutorials from './components/tutorials';
import Definitions from './components/definitions';
import TheProject from './components/the_project';
import Partners from './components/partners';
import TermsOfUse from './components/terms_of_use';
import PrivacyPolicy from './components/privacy_policy';
import {Router, Route, IndexRoute} from 'react-router';
import ContactUsContainer from './containers/contact_us';

class Routes extends Component {
  render() {
    return <Router history={this.props.history}>
      <Route path="/" component={AppContainer}>
        <Route path="map" component={MapContainer}/>
        <IndexRoute component={HomeContainer}/>

        <Route path="blog" component={BlogContainer}/>
        <Route path="blog-detail" component={BlogDetailContainer}/>
        <Route path="articles-publications" component={ArticlesPublications}/>

        <Route path="faq" component={FAQ}/>
        <Route path="tutorials" component={Tutorials}/>
        <Route path="definitions" component={Definitions}/>

        <Route path="the-project" component={TheProject}/>
        <Route path="partners" component={Partners}/>
        <Route path="contact-us" component={ContactUsContainer}/>

        <Route path="terms-of-use" component={TermsOfUse}/>
        <Route path="privacy-policy" component={PrivacyPolicy}/>
      </Route>
    </Router>;
  }
}


export default Routes;
