<script>
import {heart, logOut, refreshAccessToken} from "@/api/interface/backendInterface.js";
import router from "@/router/index.js";
import SvgIcon from "@/components/SvgIcon/index.vue";
export default {
  name: 'Topbar',
  components: {SvgIcon},
  props: [
      'collapse'
  ],
  data() {
    return {
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
    }
  },
}
</script>

<template>
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