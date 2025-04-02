const { default: axios } = require("axios");

const api = axios.create({
  baseURL: 'https://alg-2-back-1.onrender.com'
})

export default api