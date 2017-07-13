#!/usr/bin/env node

// format amercian style numbers first!

// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

const fs = require('fs')
const csvRaw = fs.readFileSync('./analytics-tiles.csv', 'utf-8');
console.log('Event Label,Total Events,Unique Events,Event Value,Avg. Value,lat,lng');

const TILE_SIZE = 256;
const Z = 5;
const SCALE = 1 << Z;

function tile2lng(x,z) {
  return (x/Math.pow(2,z)*360-180);
}
function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

csvRaw.split('\n').splice(1).filter(line => line !== '').forEach((line) => {
  const xy = line.split('"')[1];
  const x = parseInt(xy.split(',')[0], 10);
  const y = parseInt(xy.split(',')[1], 10);
  const lat = tile2lat(y, Z);
  const lng = tile2lng(x, Z);
  console.log(`${line},${lat},${lng}`)
});
