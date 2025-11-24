<script setup>
import Sidebar from "@/components/Sidebar.vue";
import UserInfoBar from "@/components/TopBar.vue";
</script>

<template id="app">
  <UserInfoBar v-if="!$route.meta.showBar"/>
  <Sidebar v-if="!$route.meta.showBar"/>
  <div v-if="!$route.meta.showBar" class="content" style="margin:0;">
    <router-view></router-view>
  </div>
  <div v-if="$route.meta.showBar" style="margin:0;">
    <router-view></router-view>
  </div>
</template>
<script>
  import {heart} from "@/api/interface/backendInterface.js";
  import router from "@/router/index.js";

  export default {
    name: 'app',
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
    },
    mounted() {
      heart();
    }
  }
</script>
<style scoped>
/*.content {
  display: flex;
  top:20vh;
  margin-left: 23vh; !* 根据侧边栏宽度调整 *!
  border: solid 10px red;
  margin-top: 30vh;
  height: 90vh;
}*/
#app {
  position: fixed;
}
</style>