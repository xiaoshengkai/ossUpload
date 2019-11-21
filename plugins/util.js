import Vue from 'vue'
import axios from 'axios'

const util = {
    install(Vue) {
        Vue.prototype.$requestFormPsot = async (url, file) => {
          let instance = axios.create({
            baseURL: `http://localhost:3000/`,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          });
          const formData = new FormData()
          formData.set('file', file)
          return await instance.post(url, formData)
        }
    }
}

Vue.use(util)
