const path = require('path')
const getAbsolutePath = (pathDir) => path.resolve(__dirname, pathDir)
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const os = require('os')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

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
    resolve: {
      extensions: ['js', 'jsx', 'json'],
      alias: {
        '@components': getAbsolutePath('src/components/'),
        '@contexts': getAbsolutePath('src/contexts/'),
        '@hooks': getAbsolutePath('src/hooks/'),
        '@pages': getAbsolutePath('src/pages/'),
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
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin({
          parallel: os.cpus().length - 1
        }),
      ],
    },
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
      })
    ],
    devServer: {
      // dist 디렉토리를 웹 서버의 기본 호스트 위치로 설정
      contentBase: path.resolve(__dirname, './dist'),
      // 인덱스 파일 설정
      index: 'index.html',
      // 포트 번호 설정
      port: 3000,
      // 핫 모듈 교체(HMR) 활성화 설정
      hot: true,
      // gzip 압축 활성화
      compress: true,
      // dist 디렉토리에 실제 파일 생성
      writeToDisk: true,
      // History 라우팅 대체 사용 설정
      historyApiFallback: true,
      // 개발 서버 자동 실행 설정
      open: true,
      // 오류 표시 설정
      overlay: true,
    },
  }
}