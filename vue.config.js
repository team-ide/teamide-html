const path = require('path')
const fs = require('fs')

module.exports = {
  assetsDir: process.env.assetsDir,
  publicPath: process.env.publicPath,
  devServer: {
    port: 21081,
    proxy: {
      "/api": {
        ws: true,
        target: "https://127.0.0.1:21080/teamide/",
        changeOrigin: true
      },
    },
    https: {
      cert: fs.readFileSync(path.join(__dirname, './server.crt')), // 此处路径为自己项目实际为准
      key: fs.readFileSync(path.join(__dirname, './server.key')),  // 此处路径为自己项目实际为准
    },
  },
  productionSourceMap: false,
  transpileDependencies: [
    "vuetify"
  ],
  runtimeCompiler: true,
}