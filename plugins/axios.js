import { message } from 'ant-design-vue';


export default ({ $axios }) => {
  $axios.onError(error => {
    const { data } = error.response
    message.info(data.message);
  })
}