import axios from 'axios'

const service = axios.create({
    //baseURL: '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'text/plain'
    }
});

service.interceptors.request.use(config => {
    console.info("begin")
    return config;
}, error => {
    console.info("some error happened when request interceptors", error)
    return Promise.reject(error);
})

/*service.interceptors.response.use(response => {
    console.info("hello")
    return response;
}, error => {
    console.info("error")
    return Promise.reject(error);
})*/

export default service;