<script>
import {heart, logOut, refreshAccessToken} from "@/api/interface/backendInterface.js";
import router from "@/router/index.js";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { connectWebSocket, disconnectWebSocket } from "@/util/websocket.js"

/*const showNewMessage = (message) => {
  /!*this.$notify({
    title: 'new message',
    message: message,
    type: "info",
    duration: 0,
    position: "top-right",
  })*!/
  this.speak(message)
}*/
export default {
  name: 'Topbar',
  components: {SvgIcon},
  props: [
      'collapse'
  ],
  emits: ["changeBar"],
  data() {
    return {
      stomp: null,
      speech: null, //存储语音合成实例
      textToSpeak: '',
      collapse: false,
      username: "",
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
    if (this.username) {
      this.stomp = connectWebSocket('newOrder', this.showNewMessage, null)
    }

    /*this.username = localStorage.getItem("userName");
    if (!this.username) {
      this.logOut()
    }*/
   /* this.heartBeat();*/
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
      this.$notify({
        title: 'new message',
        dangerouslyUseHTMLString: true,
        customClass: 'noticeMessage',
        message: message,
        type: "info",
        duration: 0,
        position: "top-right",
        onClick: () => {
          router.push({
            path: '/web/AccountManagement'
          })
        }
      })
      //this.textToSpeak = message;
      //this.playNotice()
      //this.speak()
    },
    async playNotice() {
      this.$refs.noticePlayer.muted=false
      await this.$refs.noticePlayer.play()
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
          <el-avatar style="font-size: 30px;background-color: grey">{{username.charAt(0)}}</el-avatar>
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
.topbar {
  color: black;
  text-align: center;
  height: 10%;
  display: grid;
  align-items: center;
  width: 87%;
  background-color: #20b978;
  position: absolute;
  top: 0;
  left: 13%;
}
.topbar-collapsed {
  color: black;
  text-align: center;
  height: 10%;
  display: grid;
  align-items: center;
  width: 100%;
  background-color: #20b978;
  position: absolute;
  top: 0;
  left: 0;
}


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

.zhedie {
  position: fixed;
  background-color: #20b978;
}
.zhedie-zhedie {
  position: fixed;
  background-color: #20b978;
}
</style>
<style>
.noticeMessage {
  cursor: pointer;
}
</style>