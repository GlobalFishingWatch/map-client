import _ from 'lodash';

class Format {

  static initialize(args) {
    var self = this;
    self.header = { length: 0, colsByName: {} };
    self.data = {};
    self.rowcount = 0;
    self.seriescount = 0;
    self.loadingStarted = false;
    self.loadingCanceled = false;
    self.headerIsLoaded = false;
    self.allIsLoaded = false;

    if (args) {
      _.extend(self, args);
    }
  }
}

export default Format;
