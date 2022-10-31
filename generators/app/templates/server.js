require('./build/check-versions')()
var config = require('./config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./build/webpack.dev')
var api = require('./mock/api')
var views = require('./mock/views')
var filter = require('./mock/filter')
var errorHanlder = require('./mock/error')
var port = process.env.PORT || config.dev.port
var proxyTable = config.dev.proxyTable
var autoOpenBrowser = !!config.dev.autoOpenBrowser
var app = express()
var ora = require('ora')
var spinner = ora('building for developing...')
spinner.start()

app.set('views', './mock/views')
app.set('view engine', 'pug')
app.use('/', views)
app.use('/api', api)
app.use('/filter', filter)
app.use(errorHanlder)

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)

app.use(hotMiddleware)

var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port + '/' + config.subAssetsPath + config.projectPath + config.htmlEntry

devMiddleware.waitUntilValid(function () {
  spinner.stop()
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) {
  if (err) return console.log(err)
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
