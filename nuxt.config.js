module.exports = {
  /*
  ** Headers of the pageaxios
  */
  head: {
    title: '智业移动护理',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Nuxt.js project'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** 插件
  */
  plugins: [
    '~plugins/http',
    '~plugins/mint-ui',
    '~plugins/components-common',
    '~plugins/mobile'
    // {src: '~plugins/xml2js', ssr: false}
    // '~plugins/xml2js'
  ],
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/main.css',
    '~/assets/css/components/main.css',
    'mint-ui/lib/style.css'
  ],
  /*
  ** Add axios globally
  */
  build: {
    //vendor: ['axios', 'lodash', 'x2js']
    /*
    ** Run ESLINT on save
    */
    /*extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }*/
  }
}
