import Vue from 'vue'
import axios from 'axios'

let config = {
    method: 'get',
    baseURL: 'http://ph.istra-adm.ru/api/',
    timeout: 60*1000,
    withCredentials: false
}

const _axios = axios.create(config)

Vue.prototype.$axios = _axios
