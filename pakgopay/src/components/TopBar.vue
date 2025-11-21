<script>
import {reactive} from "vue";

export default {
  name: 'Topbar',
  data() {
    return {
      username: "",
    }
  },
  mounted() {
    this.username = localStorage.getItem("userInfo");
  }
}
</script>

<template>
  <div class="topbar">
    <!-- 顶部栏内容 -->
    <h1>顶部栏</h1>
    <div class="userInfo" >
      <div v-if="username">
        你好,{{username}}
      </div>
      <div v-else>
        请登陆
      </div>
    </div>

  </div>
</template>



<style scoped>
.topbar {
  color: black;
  padding: 10px;
  text-align: center;
  height: 10vh;
}

.userInfo {
  top: 10px;
  right: 10px;
  text-align: center;
  position: absolute;
}
</style>