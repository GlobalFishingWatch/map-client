import React, {Component} from "react";
import AppContainer from "./containers/app";
import HomeContainer from "./containers/home";
import NewsContainer from "./containers/news";
import {Router, Route} from "react-router";

class Routes extends Component {
  render() {
    return <Router history={this.props.history}>
      <Route path="/map" component={AppContainer}/>
      <Route path="/" component={HomeContainer}/>
      <Route path="/news" component={NewsContainer}/>
    </Router>;
  }
}


export default Routes;
