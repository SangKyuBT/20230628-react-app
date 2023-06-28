const path = require('path')
const getAbsolutePath = (pathDir) => path.resolve(__dirname, pathDir)

module.exports = (_env, argv) => {
  const isProd = argv.mode === 'production'
  const isDev = !isProd

  return {
    entry: {
      main: './src/index.js',
    },
    output: {
      path: getAbsolutePath('dist'),
      filename: 'assets/js/[name].[contenthash:8].js',
      publicPath: '/',
    },
    mode: 'development',
    devtool: isDev && 'cheap-module-source-map',
  }
}