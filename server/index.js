const Koa = require('koa')
const route = require('koa-route')
const koaBody = require('koa-body');
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()

app.use(koaBody({
  multipart: true
}))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = config


  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(route.post('/upload', async (etx) => {

      const oss = require('ali-oss');

      const client = oss({
        accessKeyId: 'LTAIBathEzzg276g',
        accessKeySecret: '4oQrHuURu2RCHTuKw51FSvX1GHywBZ',
        bucket: 'mpv-blog',
        region: 'oss-cn-beijing'
      });

      // 查看拥有 bucket信息
      // let result = await client.listBuckets();
      // console.log(result)
      try {
        let size = etx.request.files.file.size / 1024 / 1024;
        let result
        // 如果文件大于5M,采用分分片上传
        if (size > 5) {
          result = await client.multipartUpload(
            etx.request.files.file.name,
            etx.request.files.file.path, {
            parallel: parseInt(size / 10)
          })
        } else {
          result = await client.put(etx.request.files.file.name, etx.request.files.file.path);
        }
        etx.body = {
          type: 1,
          name: result.res.name,
          url: result.res.requestUrls[0]
        }
      } catch (e) {
        etx.body = {
          type: 0
        }
      }
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
