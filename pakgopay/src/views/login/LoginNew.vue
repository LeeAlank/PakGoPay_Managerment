<template>
  <div class="login-page">
    <div class="lang-switch">
      <label class="lang-label">
        <SvgIcon class="lang-icon" name="language" />
        {{ $t('language') }}
      </label>
      <select class="lang-select" v-model="selectedLang" @change="changeLanguage">
        <option v-for="item in languageOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </div>
    <div class="login-card">
      <div class="login-title">{{ $t('login.title') }}</div>
      <div class="login-subtitle">{{ $t('login.subtitle') }}</div>
      <div class="login-form">
        <label class="login-label">{{ $t('login.label.account') }}</label>
        <input
          v-model="loginForm.userName"
          class="login-input"
          type="text"
          :placeholder="$t('login.placeholder.username')"
          autocomplete="username"
        />
        <label class="login-label">{{ $t('login.label.password') }}</label>
        <div class="password-field">
          <input
            v-model="loginForm.password"
            class="login-input"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('login.placeholder.password')"
            autocomplete="current-password"
          />
          <button
            class="toggle-password"
            type="button"
            @click="showPassword = !showPassword"
            :aria-label="$t('login.action.togglePassword')"
          >
            <svg v-if="!showPassword" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
                fill="currentColor"
              />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 5l16 16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M12 5c-5 0-9 4-10 7 1 2.1 3.4 4.9 7 6.2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M9.5 9.5A3.5 3.5 0 0 1 14.5 14.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M14.5 14.5C19 13.2 21 10 21 12c-1 3-5 7-10 7"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
        <label class="login-label">{{ $t('login.label.googleCode') }}</label>
        <input
          v-model="loginForm.code"
          class="login-input"
          type="text"
          :placeholder="$t('login.placeholder.googleCode')"
          autocomplete="one-time-code"
        />
        <label class="login-label">{{ $t('login.label.turnstile') }}</label>
        <div class="turnstile-wrap">
          <div ref="turnstileWidget" class="turnstile-widget"></div>
          <div v-if="turnstileError" class="turnstile-error">{{ turnstileError }}</div>
          <div v-else-if="turnstileSuccess" class="turnstile-success">{{ $t('login.turnstileSuccess') }}</div>
        </div>
        <div class="login-actions">
          <button class="btn-primary" type="button" @click="login(loginForm)">
            {{ $t('login.action.login') }}
          </button>
<!--          <button class="btn-secondary" type="button" @click="getQrCodes(loginForm.userName, loginForm.password)">
            获取谷歌令牌二维码
          </button>-->
        </div>
      </div>
    </div>
    <Modal class="qr-modal" :isVisible="!isQrCode" @close="isQrCode = true" :imgUrl="qrCodeUrl" />
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { ElMessage } from "element-plus";
import {getCommonMessage, getQrCode, LoginBack, menu} from "@/api/interface/backendInterface.js";
import { getAsyncRoutes } from "@/router/asyncRouter.js";
import router from "@/router/index.js";

export default {
  name: "LoginNew",
  components: {
    Modal,
    SvgIcon
  },
  data() {
    return {
      loginForm: {
        userName: "",
        password: "",
        code: "",
        turnstileToken: ""
      },
      turnstileEnabled: import.meta.env.VITE_TURNSTILE_ENABLED !== "false",
      turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || "",
      turnstileWidgetId: null,
      turnstileError: "",
      turnstileSuccess: false,
      showPassword: false,
      isQrCode: true,
      qrCodeUrl: "",
      selectedLang: "zh-cn",
      languageOptions: []
    };
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.selectedLang;
      localStorage.setItem("lang", this.selectedLang);
      this.refreshLanguageOptions();
      this.rerenderTurnstileForLanguage();
    },
    refreshLanguageOptions() {
      this.languageOptions = [
        { value: 'en', label: this.$t('language.en') },
        { value: 'zh-cn', label: this.$t('language.zh') },
        { value: 'ms', label: this.$t('language.ms') }
      ];
    },
    loadTurnstile() {
      if (!this.turnstileEnabled) {
        return;
      }
      if (!this.turnstileSiteKey) {
        this.turnstileError = this.$t('login.error.turnstileMissing');
        return;
      }
      if (window.turnstile) {
        this.renderTurnstile();
        return;
      }
      const scriptId = "cf-turnstile-script";
      const existing = document.getElementById(scriptId);
      if (existing) {
        existing.addEventListener("load", this.renderTurnstile);
        return;
      }
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => this.renderTurnstile();
      script.onerror = () => {
        this.turnstileError = this.$t('login.error.turnstileFailed');
      };
      document.head.appendChild(script);
    },
    renderTurnstile() {
      if (!window.turnstile || !this.$refs.turnstileWidget) return;
      if (this.turnstileWidgetId !== null) {
        window.turnstile.reset(this.turnstileWidgetId);
        return;
      }
      this.turnstileWidgetId = window.turnstile.render(this.$refs.turnstileWidget, {
        sitekey: this.turnstileSiteKey,
        language: this.getTurnstileLanguage(),
        callback: (token) => {
          this.turnstileError = "";
          this.turnstileSuccess = true;
          this.loginForm.turnstileToken = token;
        },
        "expired-callback": () => {
          this.loginForm.turnstileToken = "";
          this.turnstileSuccess = false;
        },
        "error-callback": () => {
          this.loginForm.turnstileToken = "";
          this.turnstileError = this.$t('login.error.turnstileFailed');
          this.turnstileSuccess = false;
        }
      });
    },
    getTurnstileLanguage() {
      const lang = (this.selectedLang || "auto").toLowerCase();
      if (lang === "zh" || lang === "zh-cn") return "zh-cn";
      if (lang === "ms") return "ms";
      if (lang === "en") return "en";
      return "auto";
    },
    rerenderTurnstileForLanguage() {
      this.turnstileSuccess = false;
      this.loginForm.turnstileToken = "";
      if (window.turnstile && this.$refs.turnstileWidget) {
        if (this.turnstileWidgetId !== null && typeof window.turnstile.remove === "function") {
          window.turnstile.remove(this.turnstileWidgetId);
        }
        this.$refs.turnstileWidget.innerHTML = "";
        this.turnstileWidgetId = null;
        this.renderTurnstile();
        return;
      }
      this.loadTurnstile();
    },
    resetTurnstile() {
      if (window.turnstile && this.turnstileWidgetId !== null) {
        window.turnstile.reset(this.turnstileWidgetId);
      }
      this.loginForm.turnstileToken = "";
      this.turnstileSuccess = false;
    },
    async login(loginForm) {
      if (!loginForm.userName || !loginForm.password) {
        ElMessage.error(this.$t('login.error.missingAccountPassword'));
        return;
      }
      if (this.turnstileEnabled && !loginForm.turnstileToken) {
        ElMessage.error(this.$t('login.error.turnstileRequired'));
        this.resetTurnstile();
        return;
      }
      await LoginBack(loginForm).then((response) => {
        if (response.status === 200 && response.data) {
          if (response.data.code !== 0) {
            ElMessage.error(response.data.message || this.$t('login.error.loginFailed'));
            this.resetTurnstile();
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
                  router.push("/web/pakGoPay")

                      /*.then((res) => {
                        getCommonMessage().then(message => {
                          if (message.status === 200 && message.data.code == 0) {
                            if (message.data.data != 'success') {
                              ElMessage.error(
                                  message.data.message,
                              )
                            }
                          }
                        })
                      })*/
                });
                // get commonMessage

              } else {
                ElMessage.error(this.$t('login.error.menuFailed'));
              }
            });
          } catch (e) {
            console.error(e);
            ElMessage.error(this.$t('login.error.loginFailed'));
          }
        } else {
          ElMessage.error(response?.data?.message || this.$t('login.error.loginFailed'));
          this.resetTurnstile();
        }
      });
    },
    getQrCodes(username, password) {
      if (!username || !password) {
        ElMessage.error(this.$t('login.error.missingUsernamePassword'));
        return;
      }
      getQrCode(username, password).then((res) => {
        if (res.status === 200 && res.data.code !== 0) {
          ElMessage({
            message: res.data.message || this.$t('login.error.qrFailed'),
            type: "warning",
            showClose: true
          });
          return;
        }
        if (res.status !== 200) {
          ElMessage.error(this.$t('login.error.qrFailed'));
          return;
        }
        this.isQrCode = false;
        this.qrCodeUrl = "data:image/png;base64," + res.data.data;
      });
    }
  },
  mounted() {
    const storedLang = localStorage.getItem("lang");
    this.selectedLang = storedLang || this.$i18n.locale || "zh-cn";
    this.$i18n.locale = this.selectedLang;
    this.refreshLanguageOptions();
    this.loadTurnstile();
  },
  watch: {
    "$i18n.locale"() {
      this.refreshLanguageOptions();
      this.rerenderTurnstileForLanguage();
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

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field .login-input {
  width: 100%;
  padding-right: 70px;
}

.turnstile-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.turnstile-widget {
  min-height: 65px;
  display: flex;
  align-items: center;
}

.turnstile-error {
  font-size: 12px;
  color: #ef4444;
}

.turnstile-success {
  font-size: 12px;
  color: #10b981;
}

.lang-switch {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.lang-label {
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-shadow: none;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  line-height: 1;
}

.lang-icon {
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
}

.lang-select {
  background: rgba(9, 18, 40, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.65);
  color: #f8fafc;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  outline: none;
  box-shadow: 0 4px 12px rgba(4, 10, 24, 0.3);
}

.lang-select:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.25);
}

.toggle-password {
  position: absolute;
  right: 8px;
  height: 28px;
  width: 28px;
  border: none;
  background: #eef2f7;
  color: #1f2a37;
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  font-size: 12px;
}

.toggle-password svg {
  width: 16px;
  height: 16px;
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
