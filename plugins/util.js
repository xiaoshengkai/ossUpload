import Vue from 'vue'
import axios from 'axios'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

const util = {
    install(Vue) {
        // 图片上传请求
        Vue.prototype.$requestFormPsot = async (url, file) => {
          let instance = axios.create({
            baseURL: '/',
            headers: {
                'Content-Type': 'multipart/form-data'
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
