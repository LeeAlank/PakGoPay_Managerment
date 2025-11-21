<template>
  <div id="app" class="layout">
    <UserInfoBar />
    <div class="content">
      <Sidebar />
      <div class="main-content">
        <!-- 主内容区域 -->
        <h2>主内容区</h2>
        <p>这里是主要内容。</p>
      </div>
    </div>
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

          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
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
#app {
  display: flex; /* 使用flex布局 */
  flex-direction: column;
}
.content {
  display: flex;
  margin-left: 195px; /* 根据侧边栏宽度调整 */
  border: solid 1px black;
  height: 85vh;
}
</style>