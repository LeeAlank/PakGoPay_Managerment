<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-title">PakGoPay Login</div>
      <div class="login-subtitle">Please sign in to continue</div>
      <div class="login-form">
        <label class="login-label">Account</label>
        <input
          v-model="loginForm.userName"
          class="login-input"
          type="text"
          placeholder="Username"
          autocomplete="username"
        />
        <label class="login-label">Password</label>
        <input
          v-model="loginForm.password"
          class="login-input"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
        />
        <label class="login-label">Verification Code</label>
        <input
          v-model="loginForm.code"
          class="login-input"
          type="text"
          placeholder="Google code"
          autocomplete="one-time-code"
        />
        <div class="login-actions">
          <button class="btn-primary" type="button" @click="login(loginForm)">Login</button>
          <button class="btn-secondary" type="button" @click="getQrCodes(loginForm.userName, loginForm.password)">
            获取谷歌令牌二维码
          </button>
        </div>
      </div>
    </div>
    <Modal class="qr-modal" :isVisible="!isQrCode" @close="isQrCode = true" :imgUrl="qrCodeUrl" />
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import { ElMessage } from "element-plus";
import { getQrCode, LoginBack, menu } from "@/api/interface/backendInterface.js";
import { getAsyncRoutes } from "@/router/asyncRouter.js";
import router from "@/router/index.js";

export default {
  name: "LoginNew",
  components: {
    Modal
  },
  data() {
    return {
      loginForm: {
        userName: "",
        password: "",
        code: ""
      },
      isQrCode: true,
      qrCodeUrl: ""
    };
  },
  methods: {
    async login(loginForm) {
      if (!loginForm.userName || !loginForm.password || !loginForm.code) {
        ElMessage.error("please enter account, password and code");
        return;
      }
      await LoginBack(loginForm).then((response) => {
        if (response.status === 200 && response.data) {
          if (response.data.code !== 0) {
            ElMessage.error(response.data.message);
            return;
          }
          try {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userName", response.data.userName);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("roleName", response.data.roleName);
            menu().then((m) => {
              if (m.status === 200 && m.data.data) {
                this.menuItems = JSON.parse(m.data.data);
                localStorage.setItem("menu", JSON.stringify(this.menuItems));
                getAsyncRoutes(this.menuItems).forEach((route) => {
                  router.addRoute(route);
                  router.push("/web/pakGoPay");
                });
              }
            });
          } catch (e) {
            console.error(e);
          }
        } else {
          ElMessage.error(response.data.message);
        }
      });
    },
    getQrCodes(username, password) {
      if (!username || !password) {
        ElMessage.error("please enter username and password before");
        return;
      }
      getQrCode(username, password).then((res) => {
        if (res.status === 200 && res.data.code !== 0) {
          ElMessage({
            message: res.data.message,
            type: "warning",
            showClose: true
          });
          return;
        }
        this.isQrCode = false;
        this.qrCodeUrl = "data:image/png;base64," + res.data.data;
      });
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f7f8fa 0%, #eef2f5 100%);
  padding: 24px;
}

.login-card {
  width: 420px;
  background: #ffffff;
  border: 1px solid #e6e9ee;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 10px 28px rgba(20, 20, 20, 0.08);
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2a37;
  margin-bottom: 6px;
}

.login-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-label {
  font-size: 12px;
  color: #4b5563;
}

.login-input {
  height: 40px;
  border: 1px solid #d7dce2;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}

.login-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}

.login-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.btn-primary {
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  height: 40px;
  border: 1px solid #d7dce2;
  border-radius: 8px;
  background: #ffffff;
  color: #1f2a37;
  cursor: pointer;
}

:deep(.qr-modal.modal) {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
}

:deep(.qr-modal .modal-content) {
  width: min(360px, 82vw);
  height: auto;
  margin: 0;
  padding: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.qr-modal .close) {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: #4b5563;
  font-size: 22px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18);
}

:deep(.qr-modal .modal-content img) {
  width: min(360px, 82vw) !important;
  height: auto !important;
  display: block;
  padding: 16px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1px #e5e7eb, 0 18px 40px rgba(15, 23, 42, 0.18);
}
</style>
