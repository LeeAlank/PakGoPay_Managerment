<script setup>
import Sidebar from "@/components/Sidebar.vue";
import UserInfoBar from "@/components/TopBar.vue";
import Content from "@/components/Content.vue";
</script>

<template>
  <div id="app" :class="[!$route.meta.showBar ? 'layout' :'']">
    <UserInfoBar :collapse="collapse" v-if="!$route.meta.showBar" @changeBar="changeCollapse"/>
    <Sidebar :collapse="collapse" class="sidebar" v-if="!$route.meta.showBar"/>
    <Content :class="{'content': !$route.meta.showBar, 'beforeContent': $route.meta.showBar, 'content-collapse': collapse}"></Content>
  </div>
</template>
<script>
import { ElMessageBox } from 'element-plus'
import {heart, menu, refreshAccessToken} from "@/api/interface/backendInterface.js";
  import router from "@/router/index.js";
import {getAsyncRoutes} from "@/router/asyncRouter.js";

  export default {
    name: 'app',
    methods: {
      isLoginRoute() {
        return this.$route?.path === "/web/login" || this.$route?.meta?.showBar;
      },
      hasAuthToken() {
        return !!localStorage.getItem("token");
      },
      hasRefreshToken() {
        return !!localStorage.getItem("refreshToken");
      },
      logOut() {
        localStorage.removeItem("token" );
        localStorage.removeItem("userName")
        localStorage.removeItem("userId")
        localStorage.removeItem("menu")
        router.push("/web/login");
      },
      promptSessionExpired() {
        if (this.heartPrompting) {
          return;
        }
        this.heartPrompting = true;
        ElMessageBox.confirm(this.$t('app.sessionExpired'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.confirm'),
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          if (!this.hasRefreshToken()) {
            this.heartPrompting = false;
            this.logOut();
            return;
          }
          refreshAccessToken(localStorage.getItem("refreshToken")).then(response => {
            if (response && response.data && response.data.code === 0) {
              if (response.data.token) {
                localStorage.setItem("token", response.data.token);
              }
              if (response.data.refreshToken) {
                localStorage.setItem("refreshToken", response.data.refreshToken);
              }
              location.reload();
            }
          }).finally(() => {
            this.heartPrompting = false;
          })
        }).catch(() => {
          this.heartPrompting = false;
        })
      },
      changeCollapse() {
        this.collapse = !this.collapse;
      },
      startHeartbeat() {
        const runHeart = () => {
          if (this.isLoginRoute() || !this.hasAuthToken()) {
            return;
          }
          heart().then(res => {
            if (res.status === 200 && res.data === 'refresh') {
              this.promptSessionExpired();
            }
          }).catch((error) => {
            if (error?.response?.status === 401) {
              this.promptSessionExpired();
            }
          })
        }
        runHeart();
        this.heartbeatTimer = setInterval(runHeart, 5 * 60 * 1000);
      }
    },
    mounted() {
      if (this.isLoginRoute() || !this.hasAuthToken()) {
        return;
      }
      this.startHeartbeat();
      heart().then(res => {
        if (res.status === 200) {
          if (res.data === 'refresh') {
                if (!this.hasRefreshToken()) {
                  this.logOut()
                  return
                }
                refreshAccessToken(localStorage.getItem("refreshToken")).then((response) => {
                if (response && response.data) {
                  if (response.data.code !== 0) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("menu")
                    localStorage.removeItem("userName")
                    localStorage.removeItem("userId")
                    localStorage.removeItem("currentPath")
                    /*localStorage.removeItem("refreshToken")*/
                    router.push("/web/login")
                    return
                  }
                  localStorage.setItem("userName", response.data.userName);
                  localStorage.setItem("userId", response.data.userId);
                  localStorage.setItem("token", response.data.token);
                  menu().then(res => {
                    if (res.status === 200 && res.data.data) {
                      let menuJson = JSON.parse(res.data.data)
                      let menu = JSON.stringify(JSON.parse(res.data.data))
                      localStorage.setItem('menu', menu)
                      // 根据菜单提取路由
                       getAsyncRoutes(menuJson).forEach((route) => {
                        router.addRoute(route)
                      })
                    }
                    router.replace(localStorage.getItem("currentPath"));
                  })
                  /*localStorage.setItem("menu", response.data.menu);*/
                }
            })
          }else if(res.data === 'success') {
            router.replace(localStorage.getItem("currentPath"));
          } else {
            router.replace("/web/login");
          }
        }
      }).catch((error) => {
        if (error?.response?.status === 401) {
          this.promptSessionExpired();
        }
      })
    },
    beforeUnmount() {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    },
    data() {
      return {
        collapse : false,
        heartbeatTimer: null,
        heartPrompting: false
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
  height: 98vh;
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
  /*top: 0.8%;*/
  /*left: 10.9%;*/
  position: fixed;
  background-color: white;
  flex-grow: 1;
}
.sidebar {
  position: fixed;
  /*top: 1%;
  left: 0.8%;
  padding: 0;
  height: 98%;*/
}
.beforeContent {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: white;
}
.content {
  position: fixed;
  top: 5%;
  margin-left: 13.5%;
  width: 88%;
  height: 90%;
  background-color: #F3F3F3;
}

.content-collapse {
  position: fixed;
  top: 5%;
  margin-left: 0;
  width: 100%;
  height: 75%;
  background-color: #F3F3F3;
}

.zhedie {
  position: fixed;
  color: red;
  margin-left: 12%;
  margin-top:0.2%;
  background-color: #20b978;
  bottom:12px;
}
.zhedie-zhedie {
  position: fixed;
  color: red;
  margin-left: 0;
  margin-top: 0.1%;
  background-color: #20b978;
  bottom:12px;
}
</style>
