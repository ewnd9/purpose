const path = require('path');
const rootDir = path.resolve(`${__dirname}/..`);

module.exports = {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  devtool: 'source-map',
  target: 'electron-renderer',
  entry: {
    app: [`${rootDir}/src/index.tsx`]
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  { targets: { browsers: 'last 2 versions ' } }
                ],
                '@babel/preset-typescript',
                '@babel/preset-react'
              ],
              plugins: [
                ['@babel/plugin-proposal-class-properties', { loose: true }]
              ]
            }
          },
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader')
              }
            ]
          },
          {
            exclude: [/\.(js|jsx|mjs|ts|tsx)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    public: 'localhost:8080'
  }
};
