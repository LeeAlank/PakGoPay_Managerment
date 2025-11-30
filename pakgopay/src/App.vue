<script setup>
import Sidebar from "@/components/Sidebar.vue";
import UserInfoBar from "@/components/TopBar.vue";
import Content from "@/components/Content.vue";
</script>

<template>
  <div id="app" :class="[!$route.meta.showBar ? 'layout' :'']">
    <UserInfoBar :collapse="collapse" v-if="!$route.meta.showBar"/>
    <Sidebar :collapse="collapse" class="sidebar" v-if="!$route.meta.showBar"/>
    <Content :class="{'content': !$route.meta.showBar, 'beforeContent': $route.meta.showBar, 'content-collapse': collapse}"></Content>
    <div v-if="!$route.meta.showBar" :class="[!collapse? 'zhedie':'zhedie-zhedie']" @click="changeCollapse()">
      <SvgIcon width="30px" height="30px" :name="!collapse ? 'shouqi' : 'zhankai'" style="cursor: pointer;margin:0;"/>
    </div>
  </div>
</template>
<script>
import {heart, refreshAccessToken} from "@/api/interface/backendInterface.js";
  import router from "@/router/index.js";

  export default {
    name: 'app',
    methods: {
      logOut() {
        localStorage.removeItem("token" );
        router.push("/web/login");
      },
      changeCollapse() {
        this.collapse = !this.collapse;
      }
    },
    mounted() {
      heart();
    },
    data() {
      return {
        collapse : false
      }
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
  /*position: fixed;*/
  background-color: #F3F3F3;
  display: flex;
  width: 100%;
}
.layout {
  display: flex;
  height: 100vh;
  width: 100%;
  padding: 0;
}
.userInfo {
  color: black;
  padding-top: 0;
  padding-bottom: 5px;
  text-align: center;
  height: 7%;
  margin-bottom: 10px;
  top: 1%;
  /*left: 10.9%;*/
  position: fixed;
  background-color: white;
  flex-grow: 1;
}
.sidebar {
  position: fixed;
  top: 1%;
  left: 0.8%;
  padding: 0;
  height: 98%;
}
.beforeContent {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: white;
}
.content {
 position: fixed;
  top: 15%;
  margin-left: 10.3%;
  width: 90%;
  height: 75%;
  background-color: #F3F3F3;
}

.content-collapse {
  position: fixed;
  top: 15%;
  margin-left: 0;
  width: 100%;
  height: 75%;
  background-color: #F3F3F3;
}

.zhedie {
  position: fixed;
  color: red;
  margin-left: 10%;
  margin-top:0.1%;
  background-color: limegreen;
}
.zhedie-zhedie {
  position: fixed;
  color: red;
  margin-left: 0;
  margin-top: 0.1%;
  background-color: limegreen;
}
</style>