'use strict';

import React, {Component} from 'react';
import PelagosClient  from '../lib/pelagosClient';

var url = "http://localhost:8000/ui_tests/data/testtiles/-90,-45,-45,-22.5";
class App extends Component {

  render() {
    let promise = new PelagosClient().obtainTile(url);
    promise.then(function(data){
      console.log('Todo ocorrecto', data);
    }, function(err){
      console.error('Error', err);
    });
    return (
      <div>
        <p>Hello!</p>
      </div>
    );
  }

}

export default App;
