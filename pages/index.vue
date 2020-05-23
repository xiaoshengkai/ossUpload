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
            <div v-for="(url, index) in fileList" :key="index" class="box">
                <img :src="url" alt="">
                <p>{{ url }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { Loading } from 'element-ui';

export default {
    data() {
        return {
            fileList: []
        };
    },
    methods: {
        async beforeUpload (file) {
            console.log(file)
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            try {
              const { data } = await this.$requestFormPsot('/upload', file)
              if (data.type) {
                this.fileList.push(data.url)
              }
            } catch (e) {
              this.$message.error('网络异常');
            }
            loading.close()
            return false
        },
        // 获取剪切板图片上传
        getScreenshotData () {
          document.addEventListener('paste', (event) => {
              event.preventDefault()
              const f = event.clipboardData.items[0]
              if (f) {
                const file = f.getAsFile()
                this.beforeUpload(file)
              }
          })
        }
    },
    mounted () {
      this.getScreenshotData()
    }
}
</script>

<style lang="less">
.upload {

    .box {
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
