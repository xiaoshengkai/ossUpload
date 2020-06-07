const Koa = require('koa')
const route = require('koa-route')
const koaBody = require('koa-body');
const WebSocket = require('faye-websocket')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const fs = require('fs')
const url = require('url');

const app = new Koa()
const server = require('http').createServer(app.callback());

app.use(koaBody({
  multipart: true
}))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

// 客户端ws请求进入upgrade事件监听
// 注册WebSocket 实例
let clients = []
server.on('upgrade', (request, socket, head) => {
  const ws = new WebSocket(request, socket, head)
  ws.ws_id = url.parse(request.url).query
  ws.onopen = function() {
    ws.send('WS：connected');
    clients.push(ws)
  }
  ws.onclose = function() {
    // 过滤掉当前关闭ws实例
    clients = clients.filter(function (x) {
      return x !== ws;
    });
  }
})

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
        let size = etx.request.files.file.size;
        let pos = 0
        // 采用流式上传
        let stream = fs.createReadStream(etx.request.files.file.path);
        let searchParams = new URL(`http://${host}:${port}${etx.request.url}`).searchParams
        let ws = clients.find(ws => ws.ws_id === searchParams.get('ws_id'))
        // 监听片段，配合webscoket实现进度条
        stream.on('data', (chunk) => {
          pos += chunk.length
          ws.send(JSON.stringify({
            file_id: searchParams.get('file_id'),
            progress: pos / size * 100
          }))
        })
        stream.on('end', () => {
          console.log('WS:下载完毕')
        })
        let result = await client.putStream(etx.request.files.file.name, stream);
        etx.body = {
          type: 1,
          name: result.res.name,
          url: result.res.requestUrls[0]
        }
      } catch (e) {
        console.log(e)
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

  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
