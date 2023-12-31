const path = require('path')
const getAbsolutePath = (pathDir) => path.resolve(__dirname, pathDir)
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require('os')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const DEFAULT_PORT = 3000
const cssRegex = /\.css$/i

module.exports = (_env, argv) => {
  const isProd = argv.mode === 'production'
  const isDev = !isProd

  let entry = {
    main: './src/index.js',
  }

  if (isProd) {
    entry = {
      ...entry,
      'polyfills': './src/polyfills/index.js',
      'detect.polyfills': './src/polyfills/detect.js',
    }
  }

  return {
    entry,
    output: {
      path: getAbsolutePath('dist'),
      filename: 'assets/js/[name].[contenthash:8].js',
      publicPath: '/',
    },
    mode: isDev ? 'development' : 'production',
    devtool: isDev && 'cheap-module-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        '@components': getAbsolutePath('src/components/'),
        '@contexts': getAbsolutePath('src/contexts/'),
        '@hooks': getAbsolutePath('src/hooks/'),
        '@pages': getAbsolutePath('src/pages/'),
        'unfetch': path.resolve(__dirname, 'node_modules/unfetch/dist/unfetch.mjs') 
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
                envName: isProd ? 'production' : 'development'
              }
            }
          ]
        },
        {
          test: cssRegex,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].[contenthash:8].css',
        chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: isDev ? 'development' : 'production'
      }),
      new HtmlWebpackPlugin({
        template: getAbsolutePath('public/index.html'),
        inject: true
      }),
      new CleanWebpackPlugin({
        // 플러그인 옵션 셜정
        // dry 기본 값: false
        // dry: true,
        // verbose 기본 값: false
        verbose: true,
        // cleanOnceBeforeBuildPatterns 기본 값: ['**/*']
        cleanOnceBeforeBuildPatterns: [
          '**/*',
          // build 폴더 안의 모든 것을 지우도록 설정
          path.resolve(process.cwd(), 'build/**/*')
        ]
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "public")
      },
      // 포트 번호 설정
      port: process.env.PORT || DEFAULT_PORT,
      // 핫 모듈 교체(HMR) 활성화 설정
      hot: true,
      // gzip 압축 활성화
      compress: true,
      // History 라우팅 대체 사용 설정
      historyApiFallback: true,
      // 개발 서버 자동 실행 설정
      open: true,
    },
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin({
          parallel: os.cpus().length - 1
        }),
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        minRemainingSize: 0,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 20,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
    },
  }
}