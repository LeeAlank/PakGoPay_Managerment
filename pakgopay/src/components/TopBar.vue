<script>
import {heart, logOut} from "@/api/interface/backendInterface.js";
import router from "@/router/index.js";
export default {
  name: 'Topbar',
  data() {
    return {
      username: "",
    }
  },
  mounted() {
    this.username = localStorage.getItem("userInfo");
    this.heartBeat();
  },
  methods: {
    logOut,
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

  },
}
</script>

<template>
  <div class="topbar">
    <!-- 顶部栏内容 -->
    <div class="userInfo" >
      <div v-if="username">
        你好,{{username}}
      </div>
      <div v-else>
        请登陆
      </div>
      <div>
        <button @click="logOut()">退出</button>
      </div>
    </div>

  </div>
</template>



<style scoped>
/*.topbar {
  color: black;
  padding-top: 0;
  padding-bottom: 5px;
  text-align: center;
  height: 10%;
  border: solid 1px black;
  margin-bottom: 10px;
  top: 0;
  left: 8%;
  position: fixed;
  width: 92%;
}*/

.userInfo {
  top: 10px;
  right: 10px;
  text-align: center;
  position: absolute;
}
</style>