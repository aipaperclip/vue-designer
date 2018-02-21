const path = require('path')
const webpack = require('webpack')

const base = path.resolve(__dirname)

const plugins = []
if (!process.env.DEV) {
  plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
} else {
  plugins.push(new webpack.NamedModulesPlugin())
}

module.exports = {
  context: path.join(base, 'src'),
  entry: './view/main.ts',
  output: {
    path: path.join(base, 'lib'),
    filename: 'vue-designer-view.js'
  },
  resolve: {
    alias: {
      '@': path.join(base, 'src'),
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    extensions: ['.js', '.json', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.view.json',
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: [
              'style-loader',
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  data: '@import "view/globals";',
                  includePaths: [path.join(base, 'src')]
                }
              }
            ]
          }
        }
      }
    ]
  },
  plugins,
  devtool: 'inline-source-map',
  devServer: {
    port: 50000,
    proxy: {
      '*': {
        target: {
          port: 50001
        }
      },
      '/api': {
        target: {
          port: 50001
        },
        ws: true
      }
    }
  }
}
