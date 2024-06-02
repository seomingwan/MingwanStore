const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    allowedHosts: 'all',

    webSocketServer: false
    
  },
  
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },

  publicPath: '/membertest/',
  // outputDir: 'dist',
  // assetsDir: 'static',

})
