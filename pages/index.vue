<template>
    <div class="upload">
        <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :before-upload="beforeUpload"
            :show-file-list="false"
            auto-upload
            drag
            multiple>
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button class="cancel" style="margin-left: 10px;" size="small" type="success" @click="fileList = []">清空</el-button>
        </el-upload>
        <div class="showImgs" v-if="fileList.length" v-viewer="{movable: false}">
            <div v-for="(item, index) in fileList" :key="index" class="box">
                <div class="flex">
                  <img :src="item.url" alt="">
                  <p>{{ item.url }}</p>
                </div>
                <el-progress
                  :show-text="false"
                  :stroke-width="10"
                  :percentage="item.progress"></el-progress>
            </div>
        </div>
    </div>
</template>

<script>
import { Loading } from 'element-ui';

export default {
    data() {
        return {
            fileList: [],
            ws_id: new Date().valueOf()
        };
    },
    methods: {
        async beforeUpload (file) {
            // const loading = this.$loading({
            //   lock: true,
            //   text: 'Loading',
            //   spinner: 'el-icon-loading',
            //   background: 'rgba(0, 0, 0, 0.7)'
            // });
            try {
              let file_id = `file_id${new Date().valueOf()}` // 为每个文件打上id，让ws知道是哪个文件
              this.fileList.push({
                file_id,
                progress: 0,
                url: ''
              })
              const { data } = await this.$requestFormPsot(`/upload?ws_id=${this.ws_id}&file_id=${file_id}`, file)
              if (data.type) {
                this.fileList.forEach(item => {
                  if (item.file_id === file_id) {
                    item.url = data.url
                  }
                })
                this.$forceUpdate()
              }
            } catch (e) {
              this.fileList.pop()
              this.$message.error('网络异常');
            }
            // loading.close()
            return false
        },
        // 获取剪切板图片上传
        getScreenshotData () {
          document.addEventListener('paste', (event) => {
              event.preventDefault()
              const f = event.clipboardData.items[0]
              if (f) {
                let file = f.getAsFile()
                // 文件重命名
                let fileReset = new File([file], new Date().valueOf() + '/' + file.name, {type: file.type})
                this.beforeUpload(fileReset)
              }
          })
        },
        // 注入 webscoket,实现进度条
        registerWS () {
          if (WebSocket) {
            const address = 'ws://' + window.location.host + window.location.pathname + `?${this.ws_id}`;
            const socket = new WebSocket(address);
            socket.onmessage = (msg) => {
              try {
                let json = JSON.parse((msg.data))
                this.fileList.forEach(item => {
                  if (item.file_id === json.file_id) {
                    item.progress = Number(json.progress)
                  }
                })
              } catch (e) {
                console.log(msg.data)
              }
            };
          }
        }
    },
    mounted () {
      this.getScreenshotData()
      this.registerWS()
    }
}
</script>

<style lang="less">
.upload {
    .box {
      margin-bottom: 10px;
    }

    .flex {
        display: flex;
        align-items: center;
        margin: 10px 0;
        img {
            width: 10%;
        }

        p {
            flex: 1;
            margin: 10px;
        }
    }
}
.showImgs {
    margin: 20px 0;
    background-color: #f2f2f2;
    padding: 20px;
    width: 100vw;
}
.el-upload-dragger {
  padding: 20px;
  margin: 20px;
  width: 100vw;
  text-align: left;
}
.cancel {
  position: absolute;
  top: 41px;
  left: 120px;
}
</style>
