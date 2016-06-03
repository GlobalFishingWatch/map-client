import React, {Component} from 'react';
import AppContainer from './containers/app';
import {Router, Route, IndexRedirect} from 'react-router';

class Routes extends Component{
  render(){
    return <Router history={this.props.history}>
      <Route path="/" component={AppContainer} />
    </Router>;
  }
}



export default Routes;
