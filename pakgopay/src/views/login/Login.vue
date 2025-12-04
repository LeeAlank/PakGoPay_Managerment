<script setup>
/**
 * 登录注册页面
 * 这是我们的主页面组件
 */

import SvgIcon from "@/components/SvgIcon/index.vue";
/**
 * 控制显示登录还是注册
 * true 显示登录表单
 * false 显示注册表单
 */
import { ref, reactive } from 'vue'
import Modal from "@/components/Modal.vue";

/**
 * 控制显示登录还是注册
 */
const isLogin = ref(true)

/**
 * 登录表单数据
 * 使用 reactive 创建响应式对象
 * reactive 适合对象类型的数据
 */
const loginForm = reactive({
  userId: '',
  userName: '',    // 用户名
  password: '',    // 密码
  remember: false, // 是否记住我
  code: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  password2: '',
  email: ''
})

/**
 * 切换登录/注册模式
 */
const toggleMode = () => {
  isLogin.value = !isLogin.value
}

/**
 * 处理登录
 * 点击"立即登录"按钮时调用
 */
const handleLogin = () => {
  console.info('登录数据：', loginForm)
  // 后面会添加验证和真实登录逻辑
}

const handleRegister = () => {
  console.log('注册数据：', registerForm)
}
</script>

<template>
  <!-- 最外层容器：占满整个屏幕 -->
  <div class="auth-container">
    <!-- 卡片容器：白色半透明的玻璃卡片 -->
    <div class="auth-card">
      <!-- 标题：根据模式显示不同文字 -->
      <h1 class="title">
        {{ isLogin ? 'Welcome Back' : 'Create Account' }}
      </h1>

      <!-- 副标题 -->
      <p class="subtitle">
        {{ isLogin ? 'login to use' : 'sign info to use' }}
      </p>

      <!-- 表单内容区域（后面会填充） -->
      <form class="form-content">
        <div v-if="isLogin">
          <!-- 用户名输入框 -->
          <div class="form-item">
            <!-- 标签 -->
            <label class="form-label">
              <SvgIcon name="user"/>
              Account/Email
            </label>

            <!-- 输入框 -->
            <input
                v-model="loginForm.userName"
                type="text"
                placeholder="input username or email address"
                class="form-input"
                autocomplete="loginForm.username"
                :style="firstInput"
            />
          </div>

          <!-- 密码输入框 -->
          <div class="form-item">
            <label class="form-label">
              <SvgIcon name="pass"/>
              Password
            </label>

            <input
                v-model="loginForm.password"
                type="password"
                placeholder="please input password"
                class="form-input"
                autocomplete="loginForm.password"
                :style="secondInput"
            />
          </div>
          <!-- 密码输入框 -->
          <div class="form-item">
            <label class="form-label">
              <SvgIcon name="pass"/>
              Verification Code
            </label>
              <input
                  v-model="loginForm.code"
                  type="text"
                  placeholder="please input verification code"
                  class="form-input"
                  autocomplete="loginForm.code"
                  :style="thirdInput"
              />
          </div>

          <Modal :isVisible="!isQrCode" @close="showModal = false; isQrCode = true" :imgUrl="qrCodeUrl">
<!--            <img v-show="!isQrCode" alt="#" :src="qrCodeUrl" style="text-align: center"/>-->
          </Modal>
          <!-- 选项行：记住我 + 忘记密码 -->
          <div class="form-options">
            <!-- 记住我 -->
            <label class="checkbox-label">
              <input
                  v-model="loginForm.remember"
                  type="checkbox"
                  class="checkbox-input"
              />
              <span>remember me</span>
            </label>

            <input style="background-color: transparent;box-shadow: none;color: white;border:white;text-decoration: underline;cursor: pointer;" type="button" @click="getQrCodes(loginForm.userName, loginForm.password)" value="haven't code? click here" />

            <!-- 忘记密码链接 -->
            <a href="#" class="forgot-link">forgot password？</a>
          </div>

          <!-- 登录按钮 -->
          <button class="submit-btn" @click="login(loginForm)" type="button">
            <SvgIcon name="submitBtn"/>
            Login Now
          </button>
<!--          <button class="submit-btn" @click="getQrCodes(loginForm.username)" type="button">扫码登录</button>-->
        </div>
        <div v-if="!isLogin">
          <div class="form-item">
            <!-- 标签 -->
            <label class="form-label">
              <SvgIcon name="user"/>
              Account
            </label>

            <!-- 输入框 -->
            <input
                v-model="registerForm.username"
                type="text"
                placeholder="input username or email address"
                class="form-input"
                autocomplete="registerForm.username"
            />
          </div>

          <!-- 密码输入框 -->
          <div class="form-item">
            <label class="form-label">
              <SvgIcon name="pass"/>
              Password
            </label>

            <input
                v-model="registerForm.password"
                type="password"
                placeholder="please input password"
                class="form-input"
                autocomplete="registerForm.password"
            />
          </div>

          <!-- 密码输入框 -->
          <div class="form-item">
            <label class="form-label">
              <SvgIcon name="pass"/>
              Confirm Password
            </label>

            <input
                v-model="registerForm.password2"
                type="password"
                placeholder="please input password again"
                class="form-input"
                autocomplete="registerForm.password2"
            />
          </div>

          <!-- 密码输入框 -->
          <div class="form-item">
            <label class="form-label">
              <SvgIcon name="email"/>
              Email
            </label>

            <input
                v-model="registerForm.email"
                type="password"
                placeholder="please input email"
                class="form-input"
            />
          </div>

          <!-- 注册按钮 -->
          <button class="submit-btn" @click="handleRegister">
            <SvgIcon name="submitBtn"/>
            Sign Up Now
          </button>

        </div>
      </form>
      <canvas ref="canvas" width="300" height="300"></canvas>
      <!-- 底部切换按钮 -->
      <div class="toggle-mode">
        <span>{{ isLogin ? 'no account？' : 'have account？' }}</span>
        <button @click="toggleMode">
          {{ isLogin ? 'register now' : 'login now' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/**
 * scoped 表示这些样式只在当前组件生效
 * 不会影响其他组件
 */

/*
 * 最外层容器
 * 占满整个屏幕，内容居中
 */
.auth-container {
  /* 最小高度100vh（vh = viewport height，视口高度） */
  min-height: 100vh;

  /* 使用 flex 布局让内容居中 */
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */

  /* 内边距：防止内容贴边 */
  padding: 20px;

  /*
   * 渐变背景：这是页面的颜值担当！
   * linear-gradient 创建一个渐变背景
   * 135deg 表示从左上到右下的方向
   * 三个颜色值创建紫-蓝-粉的渐变
   */
  background: linear-gradient(
      135deg,
      #667eea 0%,    /* 紫色 */
      #764ba2 50%,   /* 深紫色 */
      #f093fb 100%   /* 粉色 */
  );

  position: relative;
  overflow: hidden;
}

/*
 * 背景装饰球 - 左上角
 * 使用伪元素创建一个模糊的装饰圆球
 */
.auth-container::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;  /* 圆形 */

  /* blur(80px) 让圆球边缘非常模糊，产生梦幻效果 */
  filter: blur(80px);
  opacity: 0.5;

  background: #667eea;
  top: -150px;
  left: -150px;

  /* 浮动动画 */
  animation: float 8s ease-in-out infinite;
}

/*
 * 背景装饰球 - 右下角
 */
.auth-container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;

  background: #f093fb;
  bottom: -150px;
  right: -150px;

  /* 延迟4秒开始动画，让两个球的运动不同步 */
  animation: float 8s ease-in-out infinite;
  animation-delay: 4s;
}

/*
 * 浮动动画
 * 让装饰球缓慢移动，增加动态感
 */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, 30px);
  }
}

/*
 * 卡片容器
 * 这是页面的核心 - 玻璃拟态效果！
 */
.auth-card {
  /*
   * 玻璃拟态的关键三要素：
   * 1. 半透明背景
   * 2. backdrop-filter 背景模糊
   * 3. 边框和阴影
   */

  /* rgba 的最后一个值是透明度，0.15 表示85%透明 */
  background: rgba(255, 255, 255, 0.15);

  /*
   * backdrop-filter 是玻璃拟态的核心
   * blur(20px) 让背景模糊，产生磨砂玻璃效果
   * 注意：某些老浏览器可能不支持
   */
  backdrop-filter: blur(20px);

  /* 白色半透明边框，增加立体感 */
  border: 1px solid rgba(255, 255, 255, 0.3);

  /* 阴影让卡片浮起来 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  /* 内边距 */
  padding: 40px;

  /* 圆角，让卡片更柔和 */
  border-radius: 24px;

  /* 宽度限制 */
  width: 100%;
  max-width: 450px;

  /*
   * z-index: 1 让卡片显示在装饰球上方
   * 必须配合 position 使用
   */
  position: relative;
  z-index: 1;

  /* 过渡动画：所有属性变化时平滑过渡 */
  transition: all 0.3s ease;
}

/*
 * 鼠标悬停效果
 * 让卡片向上浮动一点
 */
.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

/*
 * 标题样式
 */
.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
  color: #ffffff;

  /* 文字阴影，增加立体感 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/*
 * 副标题样式
 */
.subtitle {
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 32px;
  font-size: 14px;
}

/*
 * 表单内容区域
 */
.form-content {
  margin-bottom: 24px;
}

/*
 * 切换模式区域
 */
.toggle-mode {
  text-align: center;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

/*
 * 切换按钮
 */
.toggle-mode button {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  margin-left: 8px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

/*
 * 按钮悬停效果
 */
.toggle-mode button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.form-input {
  /* 宽度占满父容器 */
  width: 100%;

  /* 内边距 */
  padding: 12px 16px;

  /* 半透明白色背景 */
  background: rgba(255, 255, 255, 0.2);

  /* 半透明白色边框 */
  border: 1px solid rgba(255, 255, 255, 0.3);

  /* 圆角 */
  border-radius: 12px;

  /* 文字颜色 */
  color: #ffffff;

  /* 字体大小 */
  font-size: 14px;

  /* 过渡动画 */
  transition: all 0.3s ease;

  /* 确保宽度计算包含 padding 和 border */
  box-sizing: border-box;
}

/*
 * 输入框占位符（placeholder）样式
 */
.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/*
 * 输入框聚焦效果
 * 这是最酷炫的部分！
 */
.form-input:focus {
  /* 去掉浏览器默认的蓝色边框 */
  outline: none;

  /* 背景变亮一点 */
  background: rgba(255, 255, 255, 0.25);

  /* 边框变亮 */
  border-color: rgba(255, 255, 255, 0.6);

  /* 外发光效果 */
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);

  /* 轻微上浮 */
  transform: translateY(-2px);
}

/*
 * 表单选项行
 * 记住我和忘记密码在同一行
 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

/*
 * 复选框标签
 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

/*
 * 复选框
 */
.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/*
 * 忘记密码链接
 */
.forgot-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #ffffff;
  text-decoration: underline;
}

/*
 * 提交按钮
 * 超大、超显眼的按钮！
 */
.submit-btn {
  /* 宽度占满 */
  width: 100%;

  /* 内边距 */
  padding: 14px;

  /* 渐变背景 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* 无边框 */
  border: none;

  /* 圆角 */
  border-radius: 12px;

  /* 白色文字 */
  color: #ffffff;

  /* 字体 */
  font-size: 16px;
  font-weight: 600;

  /* 鼠标样式 */
  cursor: pointer;

  /* 过渡动画 */
  transition: all 0.3s ease;

  /* 使用 flex 让图标和文字居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  /* 阴影 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/*
 * 按钮悬停效果
 */
.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/*
 * 按钮按下效果
 */
.submit-btn:active {
  transform: translateY(0);
}

/*
 * 按钮图标
 */
.btn-icon {
  font-size: 20px;
}
</style>
<script>

import {getQrCode, LoginBack, menu} from "@/api/interface/backendInterface.js";
import Modal from "@/components/Modal.vue"
import {ElMessage} from "element-plus";
import {getAsyncRoutes} from "@/router/asyncRouter.js";
import router from "@/router/index.js";

;

  export default {
    name: "Login",
    data() {
      return {
        data: null,
        isQrCode: true,
        qrCodeUrl:'',
        showModal: false,
        firstInput: "",
        secondInput: "",
        thirdInput: "",
      };
    },
    components: {
      Modal
    },
    mounted() {
      //this.login();
  },
    computed: {

    },
    methods: {
    async login(loginForm) {
      if (!loginForm.userName) {
        this.firstInput = "border: solid 1px red;"
        return;
        }
      if (!loginForm.password) {
        this.secondInput = "border: solid 1px red;"
        return;
      }
      if (!loginForm.code) {
        this.thirdInput = "border: solid 1px red;"
        return;
      }
      this.firstInput = "border: none";
      this.secondInput = "border: none";
      this.thirdInput = "border: none";
        await LoginBack(loginForm).then((response) => {
           if (response.status === 200 && response.data) {
             console.log("new response----",response.data);
             if (response.data.code !== 0) {
               ElMessage.error(response.data.message)
               return;
             }
             try {
               // 登录成功后 根据返回结果跳转
               // 如果登录成功，跳转到首页
               // 如果token过期，则需要调用refreshToken接口刷新token
               // 如果refreshToken也过期，则跳转到登陆页重新获取refreshToken
               /*localStorage.setItem("userInfo", response.data.data.split("&&")[1]);
               localStorage.setItem("token", response.data.data.split("&&")[0]);*/
               localStorage.setItem("token", response.data.token);
               localStorage.setItem("userInfo", response.data.userId)
               localStorage.setItem("refreshToken", response.data.refreshToken)
               menu().then(m => {
                 if (m.status === 200 && m.data.data) {
                   this.menuItems = JSON.parse(m.data.data)
                   console.log(m.data.data)
                   localStorage.setItem('menu', JSON.stringify(this.menuItems))
                   // 根据菜单提取路由
                   getAsyncRoutes(this.menuItems).forEach((route) => {
                     router.addRoute(route)
                   })
                 }
                 router.push("/web/pakGoPay");
               })
             } catch (e) {
               console.error(e)
             }
           } else {
             ElMessage.error(response.data.message);
           }
        })
    },
    getQrCodes(username, password) {
      if (!username && !password) {
        ElMessage.error("please enter username and password before")
        return;
      }
         getQrCode(username, password).then(res => {
           if (res.status === 200 && res.data.code !== 0) {
             ElMessage({
               message: res.data.message,
               type: "warning",
               showClose: true,
             })
             return;
           }
           this.isQrCode = false;
           try {
             this.qrCodeUrl = 'data:image/png;base64,'+res.data.data;
           } catch (error) {
             console.log(error);
           }
         })
      },
    }
  }
</script>
