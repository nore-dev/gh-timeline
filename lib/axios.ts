import axios from "axios"

const instance = axios.create({
    baseURL: "http://api.github.com"
})

export default instance