const Koa = require('koa')
const route = require('koa-route')
const koaBody = require('koa-body');
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200*1024*1024*100	// 设置上传文件大小最大限制，默认2M
  }
}))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(route.post('/upload', async (etx) => {
      console.log(etx.request.files)
      etx.body = {a: etx.file}
  }))

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
