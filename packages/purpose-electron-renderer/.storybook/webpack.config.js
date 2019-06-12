'use strict';

const devConfig = require('../config/webpack.config');

module.exports = ({config}) => {
  config.module.rules.push(
    devConfig.module.rules[0].oneOf[0], // typescript
  );
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
