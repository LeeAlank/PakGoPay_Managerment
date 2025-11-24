<template>
  <div class="content">
    这是欢迎页
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import UserInfoBar from '@/components/TopBar.vue'
import {heart} from "@/api/interface/backendInterface.js";
import router from "@/router/index.js";
import {reactive} from "vue"; // 确保路径正确


const userInfo = reactive({
  username: "",
})

export default {
  name: 'App',
  components: {
    UserInfoBar,
    Sidebar // 注册Sidebar组件
  },
  data() {

  },
  mounted() {
    this.heartBeat()
  },
  methods: {
    async heartBeat() {
      await heart().then(res => {
        if(res.data !== 'success') {
          console.info("重新登陆")
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("menu")
          router.push("/web/login");
        }
      });
    },
    logOut() {
      localStorage.removeItem("token");
      router.push("/web/login");
    }
  }
}
</script>

<style>

</style>