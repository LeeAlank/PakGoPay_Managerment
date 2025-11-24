<script>
import {logOut} from "@/api/interface/backendInterface.js";
export default {
  name: 'Topbar',
  data() {
    return {
      username: "",
    }
  },
  mounted() {
    this.username = localStorage.getItem("userInfo");
  },
  methods: {
    logOut

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
.topbar {
  color: black;
  padding: 0;
  text-align: center;
  height: 10%;
  border: solid 1px black;
  margin: 0;
  top: 0;
  left: 10%;
  position: fixed;
  width: 89%;
}

.userInfo {
  top: 10px;
  right: 10px;
  text-align: center;
  position: absolute;
}
</style>