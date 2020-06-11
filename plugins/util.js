import Vue from 'vue'
import axios from 'axios'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

const util = {
    install(Vue) {
        // 图片上传请求
        Vue.prototype.$requestFormPsot = async (url, file, fnPG) => {
          let instance = axios.create({
            baseURL: '/',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            // 监听 onUploadProgress 事件
            onUploadProgress: e => {
                const {loaded, total} = e;
                // 使用本地 progress 事件
                if (e.lengthComputable) {
                    let progress = loaded / total * 100;
                    fnPG(progress)
                }
            }
          });
          const formData = new FormData()
          formData.set('file', file)
          return await instance.post(url, formData)
        }
        // 图片查看器
        Vue.use(Viewer)
    }
}

Vue.use(util)
