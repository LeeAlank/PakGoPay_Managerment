<script>
import {getWsMessages, heart, logOut, markReadMessage, refreshAccessToken, menu} from "@/api/interface/backendInterface.js";
import router from "@/router/index.js";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { connectWebSocket, disconnectWebSocket } from "@/util/websocket.js"
import { getAsyncRoutes } from "@/router/asyncRouter.js";

const showNewMessage = (message) => {
  this.$notify({
    title: 'new message',
    message: message.content,
    type: "info",
    duration: 0,
    position: "top-right",
  })
  this.speak(message)
}
export default {
  name: 'Topbar',
  components: {SvgIcon},
  props: [
      'collapse'
  ],
  emits: ["changeBar"],
  data() {
    return {
      messageCount: 0,
      messages: [],
      stomp: null,
      speech: null, //存储语音合成实例
      textToSpeak: '',
      collapse: false,
      username: "",
      userId: "",
      notifications: [],
      selectedLang: 'zh-cn',
      languageOptions: [
        {
          value: 'en',
          label: 'En',
          flag: 'english'
        },
        {
          value: 'zh-cn',
          label: '中文',
          flag: 'chinese'
        }
      ]
    }
  },
  created() {
    this.username = localStorage.getItem("userName");
  },
  mounted() {
    this.username = localStorage.getItem("userName")
    this.userId = localStorage.getItem("userId")
    if (this.username) {
      this.stomp = connectWebSocket(this.userId+'/newOrder', this.showNewMessage, null)
    }

    /*this.username = localStorage.getItem("userName");
    if (!this.username) {
      this.logOut()
    }*/
   /* this.heartBeat();*/
    this.fetchWsMessages()
  },
  beforeUnmount() {
    if (this.stomp) {
      disconnectWebSocket();
    }

  },
  methods: {
    logOut,
    async heartBeat() {
       console.log("heartBeat");
      await heart().then(res => {
        if(res.data === 'refresh') {
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
    changeLanauage(lang) {
      this.$i18n.locale = lang;
    },
    changeCollapse() {
      this.collapse = !this.collapse;
      this.$emit("changeBar", this.collapse);
    },
    speak() {
      if ('speechSynthesis' in window) {
        if (this.speech){
          window.speechSynthesis.cancel() //取消之前的语音
        }
        this.speech = new SpeechSynthesisUtterance(this.textToSpeak)
        //this.speech.lang = 'ja-JP'
        window.speechSynthesis.speak(this.speech)
      } else {
        alert('换个浏览器')
      }
    },
    showNewMessage(message) {
      let messageData = JSON.parse(message)
      /*this.$notify({
        title: 'new message',
        dangerouslyUseHTMLString: true,
        customClass: 'noticeMessage',
        message: messageData.content,
        type: "info",
        duration: 5000,
        position: "bottom-right",
        onClick: () => {
          router.push({
            name: "CollectingOrder"
          })
        }
      })*/
      this.notifications.unshift({
        id: messageData.id,
        content: messageData.content,
        read: false
      })
      this.fetchWsMessages()
      this.textToSpeak = messageData.content;
      this.playNotice()
      this.speak()
    },
    fetchWsMessages() {
      getWsMessages().then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let data = JSON.parse(res.data.data)
          this.messageCount = data.messageCount
          this.notifications = data.messages
        }
      })
    },
    async playNotice() {
      this.$refs.noticePlayer.muted=true
      this.$refs.noticePlayer.muted=false
      await this.$refs.noticePlayer.play()
    },
    async handleNotificationClick(notification) {
      console.log('messagessss--'+notification.id);
      markReadMessage(notification.id).then(res => {
        if(res.status === 200 && res.data.code === 0) {
          this.messageCount = JSON.parse(res.data.data).messageCount
          this.notifications = JSON.parse(res.data.data).messages
        }
        //this.unreadCount()
      })
      await this.ensureRouteLoaded("ChannelList")
      await router.push({
        name: "ChannelList",
        query: {
          "filterbox.channelName": "New Channel By Front"
        }
      })
      /*router.push('/web/OrderManagement/ChannelList')*/
    },
    async ensureRouteLoaded(routeName) {
      if (router.hasRoute(routeName)) {
        return
      }
      let menuJson = null
      const menuString = localStorage.getItem("menu")
      if (menuString) {
        try {
          menuJson = JSON.parse(menuString)
        } catch (error) {
          menuJson = null
        }
      }
      if (!menuJson) {
        const res = await menu()
        if (res.status === 200 && res.data.data) {
          menuJson = JSON.parse(res.data.data)
          localStorage.setItem("menu", JSON.stringify(menuJson))
        }
      }
      if (menuJson) {
        getAsyncRoutes(menuJson).forEach((route) => {
          router.addRoute(route)
        })
      }
    },
    unreadCount() {
      return this.messageCount
    },
    viewDetail() {
      alert("出发")
      router.push({
        name: 'AccountManagement'
      })
    }
  },
}
</script>

<template>
  <audio ref="noticePlayer" muted="true">
    <source type="audio/mp3" src="@/audio/notice.mp3">
  </audio>
  <button refs="startButton"></button>
  <div :class="[collapse? 'topbar-collapsed':'topbar']">
    <div v-if="!$route.meta.showBar" :class="[!collapse? 'zhedie':'zhedie-zhedie']" @click="changeCollapse()">
      <SvgIcon width="30px" height="30px" :name="!collapse ? 'shouqi' : 'zhankai'" style="cursor: pointer;margin:0;"/>
    </div>
    <!-- 顶部栏内容 -->
    <div class="userInfo" >
      <div style="margin-left: 10%;display: flex;flex-direction: row;align-items: center;width: auto;">
        <div style="display: flex; flex-direction: column">
          <SvgIcon name="language" style="width: 25px;height: 25px;width: 50px;margin: 0" />
          <div style="font-size: small;margin:0">{{$t('language')}}</div>
        </div>
        <el-select v-model="selectedLang"
                   size="small"
                   @change="changeLanauage"
                   style="border: none;width: 60px"
        >
          <el-option
              v-for="item in languageOptions"
              :key = "item.value"
              :value="item.value"
              :label="item.label"
          >
            <SvgIcon :name="item.flag"/>{{ item.label }}
          </el-option>
        </el-select>
      </div>
      <div style="display: flex;justify-content: center;align-items: center;">
        <div v-if="username" style="display: flex; align-items: center;">
          <el-dropdown trigger="click" class="notice-dropdown">
            <span class="notice-trigger">
              <el-badge :value="unreadCount()" :hidden="unreadCount() === 0">
                <SvgIcon name="bell" style="width: 22px;height: 22px"/>
              </el-badge>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="notice-menu">
                <el-dropdown-item v-if="notifications.length === 0" disabled>
                  暂无消息
                </el-dropdown-item>
                <el-dropdown-item
                  v-for="item in notifications"
                  :key="item.id"
                >
                  <span @click="handleNotificationClick(item)" :class="{ 'notice-unread': !item.read }">{{ item.content }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-avatar style="font-size: 30px;background-color: #647387; color: black;">{{username.charAt(0)}}</el-avatar>
              {{username}}
              <el-dropdown trigger="click">
                <SvgIcon name="downBlack" style="width: 22px;height: 22px"/>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="logOut">
                      <SvgIcon name="logout" style="height:22px"/>
                      {{$t('topbar.logout')}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

        </div>
        <div v-else>
          请登陆
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "@/assets/base.css";


.userInfo {
  height: 50px;
  right: 10px;
  width: auto;
  display: flex;
  flex-direction: row;
  justify-items: center;
  position: absolute;
  padding-right: 40px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.notice-dropdown {
  margin-right: 12px;
}

.notice-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.notice-menu {
  width: 260px;
  max-height: 260px;
  overflow-y: auto;
}

.notice-unread {
  font-weight: 600;
}

.zhedie {
  position: fixed;
  margin-top:0;
  top: 0;
 /* background-color: #20b978;*/
}
.zhedie-zhedie {
  margin-top:0;
  top: 0;
  position: fixed;
/*  background-color: #20b978;*/
}
</style>
<style>
.noticeMessage {
  cursor: pointer;
}
</style>
