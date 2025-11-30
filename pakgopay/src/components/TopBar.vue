<script>
import {heart, logOut, refreshAccessToken} from "@/api/interface/backendInterface.js";
import router from "@/router/index.js";
export default {
  name: 'Topbar',
  props: [
      'collapse'
  ],
  data() {
    return {
      username: "",
    }
  },
  created() {
    this.username = localStorage.getItem("userInfo");
  },
  mounted() {
    this.username = localStorage.getItem("userInfo");
    this.heartBeat();
  },
  methods: {
    logOut,
    async heartBeat() {
       console.log("heartBeat");
      /*await heart().then(res => {
        if(res.data !== 'success') {
          console.info("重新登陆")
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("menu")
          router.push("/web/login");
        }
      });*/

      await heart().then(res => {
        console.log("heartbeat response ---",res);
        if(res.data === 'refresh') {
          console.info("重新登陆")
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          localStorage.removeItem("menu");
          /*router.push("/web/login");*/
          // 返回refresh 需要调用refresh接口刷新token 无需重新登陆
          refreshAccessToken(localStorage.getItem("refreshToken")).then(response => {
            if (response.status === 200 && response.data) {
              if (response.data.code === 0) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userInfo", response.data.userId)
                localStorage.setItem("refreshToken", response.data.refreshToken)
              } else {
                router.push("/web/login")
              }
            }
          })
        }
      });
    },

  },
}
</script>

<template>
  <div :class="[collapse? 'topbar-collapsed':'topbar']">
    <!-- 顶部栏内容 -->
    <div class="userInfo" >
      <div v-if="username">
        <el-avatar style="font-size: 30px;color: black;background-color: #4f6f6f;height:30px;width:30px;border-radius: 30px">{{username.charAt(0)}}</el-avatar>
        {{username}}
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
.topbar {
  color: black;
  padding-top: 0;
  padding-bottom: 5px;
  text-align: center;
  height: 10%;
  margin-top: 0.8%;
  margin-bottom: 10px;
  top: 0;
  position: fixed;
  width: 90%;
  margin-left: 10%;
  background-color: white;
}
.topbar-collapsed {
  color: black;
  padding-top: 0;
  padding-bottom: 5px;
  text-align: center;
  height: 10%;
  margin-top: 0.8%;
  margin-bottom: 10px;
  top: 0;
  position: fixed;
  width: 100%;
  margin-left: 0;
  background-color: white;
}


.userInfo {
  top: 10px;
  right: 10px;
  text-align: center;
  position: fixed;
}
</style>