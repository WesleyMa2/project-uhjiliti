import * as a from 'axios'

const axios = a.create({
  baseURL: window.location.origin,
  withCredentials: true
})

export default axios