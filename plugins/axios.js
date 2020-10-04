import { message } from 'ant-design-vue';

export default ({ $axios, $cookies }) => {

  $axios.onRequest(config => {
    const token = $cookies.get('clientAccessToken')
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  })


  $axios.onError(error => {
    const { data } = error.response
    message.info(data.message);
  })
}