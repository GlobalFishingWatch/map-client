const fs = require('fs');
const path = require('path');

module.exports = (prefix, sourcePath) => {
  const aliases = {};
  const dirs = fs.readdirSync(sourcePath);
  dirs.forEach((item) => {
    const p = path.join(sourcePath, item);
    let name = item;
    const stat = fs.lstatSync(p);
    if (!stat.isDirectory()) {
      name = name.replace(/\.jsx?$/, '');
    }
    aliases[name] = p.replace(prefix, '');
  });
  return aliases;
};

