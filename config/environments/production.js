'use strict';

const path = require('path');
const express = require('express');

const indexPath = path.join(process.cwd(), 'dist/index.html');

module.exports = function (app) {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
};
