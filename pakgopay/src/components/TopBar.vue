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
    this.username = localStorage.getItem("userName");
  },
  mounted() {
    this.username = localStorage.getItem("userName")
    /*this.username = localStorage.getItem("userName");
    if (!this.username) {
      this.logOut()
    }*/
   /* this.heartBeat();*/
  },
  methods: {
    logOut,
    async heartBeat() {
       console.log("heartBeat");
      await heart().then(res => {
        console.log("heartbeat response ---",res);
        if(res.data === 'refresh') {
          console.info("重新登陆")
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          localStorage.removeItem("userId");
          localStorage.removeItem("menu");
          /*router.push("/web/login");*/
          // 返回refresh 需要调用refresh接口刷新token 无需重新登陆
          refreshAccessToken(localStorage.getItem("refreshToken")).then(response => {
            if (response.status === 200 && response.data) {
              if (response.data.code === 0) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userName", response.data.userName)
                localStorage.setItem("userId", response.data.userId);
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
  text-align: center;
  height: 10%;
  display: flex;
  align-items: center;
  width: 90%;
  margin-top: 0.3%;
  margin-left: 11.5%;
  background-color: white;
}
.topbar-collapsed {
  color: black;
  padding-top: 0;
  text-align: center;
  height: 10%;
  top: 0;
  display: flex;
  width: 100%;
  margin-top: 0.3%;
  margin-left: 0;
  background-color: white;
  align-items: center;
}


.userInfo {
  height: 50px;
  right: 10px;
  padding-right: 10px;
  position: fixed;
}
</style>