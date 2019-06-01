/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};

// error https://github.com/facebook/react-native/issues/24065
// using nohoist for now

// const fs = require('fs');
// const path = require('path');
// const getDevPaths = require('get-dev-paths');
// const blacklist = require('metro-config/src/defaults/blacklist');

// const projectRoot = __dirname;
// const modules = getDevPaths(projectRoot).map($ => fs.realpathSync($));

// const blacklisted = modules.map(
//   module => new RegExp(`${module}/node_modules/react-native/.*`)
// );

// module.exports = {
//   watchFolders: Array.from(new Set(modules)),

//   resolver: {
//     extraNodeModules: {
//       'react-native': path.resolve(
//         projectRoot,
//         '../../node_modules/react-native'
//       )
//     },
//     blacklistRE: blacklist(blacklisted),
//     providesModuleNodeModules: [path.resolve(projectRoot, '../../node_modules')]
//   }
// };

