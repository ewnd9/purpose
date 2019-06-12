const path = require('path');
const config = require('./webpack.config');

const rootDir = path.resolve(`${__dirname}/..`);
const electronMainPackageDir = path.resolve(`${rootDir}/../purpose-electron-main`);

config.mode = 'production',
config.output = {
  path: `${electronMainPackageDir}/public`,
  filename: '[name].js'
};

module.exports = config;
