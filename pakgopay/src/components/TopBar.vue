<script>
import {getWsMessages, heart, logOut, markReadMessage, refreshAccessToken, menu, clearAllMessages} from "@/api/interface/backendInterface.js";
import router from "@/router/index.js";
import SvgIcon from "@/components/SvgIcon/index.vue";
import { connectWebSocket, disconnectWebSocket } from "@/util/websocket.js"
import { getAsyncRoutes } from "@/router/asyncRouter.js";
import { buildFullTimeZoneOptions } from "@/util/timezoneOptions.js";
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
      userRole: "",
      lastLoginAt: "",
      notifications: [],
      expandedNotificationId: null,
      selectedLang: 'zh-cn',
      selectedTimeZone: 'Asia/Shanghai',
      clearingNotifications: false,
      languageOptions: [],
      timeZoneOptions: [],
      speechUnlocked: false,
      pendingSpeechText: '',
      voiceChangeHandler: null,
      lastAnnouncedNotificationKey: '',
      wsMessagePollTimer: null,
      speechTimer: null,
      speechAfterNoticeHandler: null,
      speechRequestId: 0,
      hasLoadedNotifications: false,
      pendingNoticeTone: false,
      noticeToneCooldownUntil: 0,
      speechQueue: [],
      speechPlaying: false,
      speechStartedAt: 0,
      speechUtteranceTimer: null,
      speechCircuitUntil: 0,
      speechFailureCount: 0,
      announcementBatchCount: 0,
      announcementBatchTitle: '',
      announcementBatchTimer: null,
      notificationChannelEnabled: true,
      sessionPaused: false,
      sessionPauseHandler: null,
      sessionResumeHandler: null,
    }
  },
  created() {
    this.username = localStorage.getItem("userName");
    const storedZone = localStorage.getItem("timeZone");
    this.timeZoneOptions = buildFullTimeZoneOptions();
    if (storedZone) {
      this.selectedTimeZone = storedZone;
    }
    if (!this.timeZoneOptions.some(item => item.value === this.selectedTimeZone)) {
      this.timeZoneOptions.unshift({ value: this.selectedTimeZone, label: this.selectedTimeZone });
    }
    const storedLang = localStorage.getItem("lang");
    this.selectedLang = storedLang || this.$i18n.locale || "zh-cn";
    this.$i18n.locale = this.selectedLang;
    this.refreshLanguageOptions();
    this.notificationChannelEnabled = localStorage.getItem("notificationChannelEnabled") !== "0";
  },
  mounted() {
    this.username = localStorage.getItem("userName")
    this.userId = localStorage.getItem("userId")
    this.userRole = localStorage.getItem("roleName") || localStorage.getItem("role") || ""
    this.lastLoginAt = localStorage.getItem("lastLoginTime") || localStorage.getItem("loginTime") || ""
    this.connectNotificationChannel()
    document.addEventListener("click", this.unlockSpeech, { passive: true })
    document.addEventListener("keydown", this.unlockSpeech, { passive: true })
    if ("speechSynthesis" in window) {
      this.voiceChangeHandler = () => {
        try {
          window.speechSynthesis.getVoices()
        } catch (error) {
          console.warn("load voices failed", error)
        }
      }
      window.speechSynthesis.onvoiceschanged = this.voiceChangeHandler
      window.speechSynthesis.getVoices()
    }

    /*this.username = localStorage.getItem("userName");
    if (!this.username) {
      this.logOut()
    }*/
   /* this.heartBeat();*/
    this.sessionPaused = !!window.__pakSessionPaused
    this.sessionPauseHandler = () => {
      this.sessionPaused = true
      this.stopWsMessagePolling()
    }
    this.sessionResumeHandler = () => {
      this.sessionPaused = false
      this.startWsMessagePolling()
    }
    window.addEventListener("pak-session-paused", this.sessionPauseHandler)
    window.addEventListener("pak-session-resumed", this.sessionResumeHandler)
    this.startWsMessagePolling()
  },
  beforeUnmount() {
    this.disconnectNotificationChannel()
    document.removeEventListener("click", this.unlockSpeech)
    document.removeEventListener("keydown", this.unlockSpeech)
    if ("speechSynthesis" in window && window.speechSynthesis.onvoiceschanged === this.voiceChangeHandler) {
      window.speechSynthesis.onvoiceschanged = null
    }
    this.stopWsMessagePolling()
    if (this.sessionPauseHandler) {
      window.removeEventListener("pak-session-paused", this.sessionPauseHandler)
      this.sessionPauseHandler = null
    }
    if (this.sessionResumeHandler) {
      window.removeEventListener("pak-session-resumed", this.sessionResumeHandler)
      this.sessionResumeHandler = null
    }
    if (this.speechUtteranceTimer) {
      window.clearTimeout(this.speechUtteranceTimer)
      this.speechUtteranceTimer = null
    }
    if (this.announcementBatchTimer) {
      window.clearTimeout(this.announcementBatchTimer)
      this.announcementBatchTimer = null
    }
    if (this.speechTimer) {
      window.clearTimeout(this.speechTimer)
      this.speechTimer = null
    }
    if (this.$refs.noticePlayer && this.speechAfterNoticeHandler) {
      this.$refs.noticePlayer.removeEventListener("ended", this.speechAfterNoticeHandler)
      this.speechAfterNoticeHandler = null
    }
  },
  methods: {
    logOut,
    connectNotificationChannel() {
      if (!this.notificationChannelEnabled || !this.username || this.stomp) {
        return
      }
      // RabbitMQ STOMP topic destination does not allow extra '/' segments.
      // Use a dot-delimited routing key: /topic/<userId>.newOrder
      this.stomp = connectWebSocket(this.userId + '.newOrder', (message) => this.showNewMessage(message), null)
    },
    disconnectNotificationChannel() {
      if (this.stomp) {
        disconnectWebSocket()
        this.stomp = null
      }
    },
    handleNotificationChannelToggle(value) {
      const enabled = !!value
      this.notificationChannelEnabled = enabled
      localStorage.setItem("notificationChannelEnabled", enabled ? "1" : "0")
      if (enabled) {
        this.connectNotificationChannel()
        this.startWsMessagePolling()
        this.fetchWsMessages()
        return
      }
      this.pendingNoticeTone = false
      this.noticeToneCooldownUntil = 0
      if (this.$refs.noticePlayer) {
        this.$refs.noticePlayer.pause()
      }
      this.stopWsMessagePolling()
      this.disconnectNotificationChannel()
    },
    startWsMessagePolling() {
      if (this.sessionPaused || this.wsMessagePollTimer || !this.notificationChannelEnabled) {
        return
      }
      this.fetchWsMessages()
      this.wsMessagePollTimer = window.setInterval(() => {
        this.fetchWsMessages()
      }, 10000)
    },
    stopWsMessagePolling() {
      if (this.wsMessagePollTimer) {
        window.clearInterval(this.wsMessagePollTimer)
        this.wsMessagePollTimer = null
      }
    },
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
      localStorage.setItem("lang", lang);
      this.selectedLang = lang;
      this.refreshLanguageOptions();
    },
    refreshLanguageOptions() {
      this.languageOptions = [
        {
          value: 'en',
          label: this.$t('language.en'),
          flag: 'english'
        },
        {
          value: 'zh-cn',
          label: this.$t('language.zh'),
          flag: 'chinese'
        },
        {
          value: 'ms',
          label: this.$t('language.ms'),
          flag: 'singapore'
        }
      ]
    },
    handleTimeZoneChange(value) {
      const prev = localStorage.getItem("timeZone") || this.selectedTimeZone || "";
      localStorage.setItem("timeZone", value);
      window.__lastTimezoneChange = {
        prev,
        next: value,
        at: Date.now()
      };
      window.dispatchEvent(new CustomEvent("timezone-change", { detail: value }));
    },
    changeCollapse() {
      this.collapse = !this.collapse;
      this.$emit("changeBar", this.collapse);
    },
    getUserInitial() {
      const name = (this.username || "").trim()
      if (!name) {
        return "U"
      }
      return name.charAt(0).toUpperCase()
    },
    formatLastLoginLabel() {
      if (!this.lastLoginAt) {
        return "-"
      }
      return this.formatDateByTs(this.lastLoginAt)
    },
    formatUserRoleLabel() {
      const role = (this.userRole || "").toLowerCase()
      if (role === "admin") return this.$t("topbar.role.admin")
      if (role === "merchant") return this.$t("topbar.role.merchant")
      if (role === "agent") return this.$t("topbar.role.agent")
      return this.userRole || this.$t("topbar.role.user")
    },
    unlockSpeech() {
      if (!("speechSynthesis" in window) || this.speechUnlocked) {
        return
      }
      try {
        const synthesis = window.speechSynthesis
        synthesis.resume()
        synthesis.getVoices()
        this.speechUnlocked = true
        if (this.pendingNoticeTone) {
          this.pendingNoticeTone = false
          this.triggerNoticeTone(true)
        }
        if (this.pendingSpeechText) {
          const text = this.pendingSpeechText
          this.pendingSpeechText = ''
          this.enqueueSpeech(text)
        }
      } catch (error) {
        console.warn("speech unlock failed", error)
      }
    },
    resolveSpeechLang() {
      if (this.selectedLang === 'zh-cn') {
        return 'zh-CN'
      }
      if (this.selectedLang === 'ms') {
        return 'ms-MY'
      }
      return 'en-US'
    },
    speak(text = this.textToSpeak) {
      if (!('speechSynthesis' in window)) {
        console.warn(this.$t('topbar.speechUnsupported'))
        return
      }
      const speechText = String(text || '').trim()
      if (!speechText) {
        return
      }
      try {
        const synthesis = window.speechSynthesis
        const requestId = ++this.speechRequestId
        synthesis.resume()
        const utterance = new SpeechSynthesisUtterance(speechText)
        utterance.onstart = () => {
          this.speechPlaying = true
          this.speechStartedAt = Date.now()
          this.pendingSpeechText = ''
        }
        utterance.onerror = (event) => {
          if (event?.error === 'canceled') {
            this.finishSpeechPlayback(false)
            return
          }
          this.pendingSpeechText = speechText
          this.finishSpeechPlayback(true)
          console.warn("speech play failed", event)
        }
        utterance.onend = () => {
          if (this.speechRequestId === requestId) {
            this.pendingSpeechText = ''
          }
          this.finishSpeechPlayback(false)
        }
        this.speech = utterance
        if (this.speechUtteranceTimer) {
          window.clearTimeout(this.speechUtteranceTimer)
        }
        this.speechUtteranceTimer = window.setTimeout(() => {
          try {
            if (window.speechSynthesis?.speaking) {
              window.speechSynthesis.cancel()
            }
          } finally {
            this.finishSpeechPlayback(true)
          }
        }, 8000)
        synthesis.speak(utterance)
      } catch (error) {
        this.finishSpeechPlayback(true)
        console.warn("speech play failed", error)
      }
    },
    finishSpeechPlayback(hasFailure) {
      if (this.speechUtteranceTimer) {
        window.clearTimeout(this.speechUtteranceTimer)
        this.speechUtteranceTimer = null
      }
      this.speechPlaying = false
      this.speechStartedAt = 0
        if (hasFailure) {
        this.speechFailureCount += 1
        if (this.speechFailureCount >= 3) {
          this.speechCircuitUntil = Date.now() + 60000
          this.speechQueue = []
          this.pendingSpeechText = ''
        }
      } else {
        this.speechFailureCount = 0
      }
      window.setTimeout(() => this.drainSpeechQueue(), 0)
    },
    enqueueSpeech(text) {
      const speechText = String(text || '').trim()
      if (!speechText) {
        return
      }
      if (Date.now() < this.speechCircuitUntil) {
        return
      }
      if (this.speechQueue.length >= 5) {
        const count = this.speechQueue.length + 1
        this.speechQueue = [this.$t('topbar.newNotificationsCount', { count })]
      } else {
        this.speechQueue.push(speechText)
      }
      this.drainSpeechQueue()
    },
    drainSpeechQueue() {
      if (!('speechSynthesis' in window)) {
        return
      }
      if (Date.now() < this.speechCircuitUntil) {
        return
      }
      if (this.speechPlaying) {
        return
      }
      const synthesis = window.speechSynthesis
      if (synthesis.speaking) {
        if (!this.speechStartedAt || Date.now() - this.speechStartedAt > 8000) {
          synthesis.cancel()
        } else {
          return
        }
      }
      const nextText = this.speechQueue.shift()
      if (!nextText) {
        return
      }
      if (!this.speechUnlocked) {
        this.pendingSpeechText = nextText
        return
      }
      this.speak(nextText)
    },
    queueAnnouncementSpeech(title) {
      const normalizedTitle = String(title || '').trim()
      this.announcementBatchCount += 1
      this.announcementBatchTitle = normalizedTitle || this.announcementBatchTitle || 'new message'
      if (this.announcementBatchTimer) {
        return
      }
      this.announcementBatchTimer = window.setTimeout(() => {
        const count = this.announcementBatchCount
        const titleToSpeak = this.announcementBatchTitle || 'new message'
        this.announcementBatchCount = 0
        this.announcementBatchTitle = ''
        this.announcementBatchTimer = null
        const summary = count > 1 ? this.$t('topbar.newNotificationsCount', { count }) : titleToSpeak
        this.enqueueSpeech(summary)
      }, 3000)
    },
    showNewMessage(message) {
      if (!this.notificationChannelEnabled) {
        return
      }
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
        title: messageData.title,
        content: messageData.content,
        read: false,
        path: messageData.path,
        timestamp: messageData.timestamp
      })
      this.fetchWsMessages()
      this.announceNotification(messageData)
    },
    fetchWsMessages() {
      if (this.sessionPaused || !this.notificationChannelEnabled) {
        return
      }
      getWsMessages().then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let data = JSON.parse(res.data.data)
          const previousIds = new Set((this.notifications || []).map(item => item?.id))
          this.messageCount = data.messageCount
          this.notifications = data.messages
          if (!this.notifications.some(item => item.id === this.expandedNotificationId)) {
            this.expandedNotificationId = null
          }
          const latestUnread = this.notifications.find(item => !item?.read)
          if (this.hasLoadedNotifications && latestUnread && !previousIds.has(latestUnread.id)) {
            this.announceNotification(latestUnread)
          }
          this.hasLoadedNotifications = true
        }
      })
    },
    announceNotification(notification) {
      const notificationKey = String(notification?.id || '')
      if (!notificationKey || this.lastAnnouncedNotificationKey === notificationKey) {
        return
      }
      this.lastAnnouncedNotificationKey = notificationKey
      this.textToSpeak = this.formatSpeechTitle({ title: notification?.title })
      const noticePlayer = this.$refs.noticePlayer
      if (noticePlayer && this.speechAfterNoticeHandler) {
        noticePlayer.removeEventListener("ended", this.speechAfterNoticeHandler)
        this.speechAfterNoticeHandler = null
      }
      if (this.speechUnlocked) {
        this.triggerNoticeTone(false)
      } else {
        this.pendingNoticeTone = true
      }
      if (this.textToSpeak) {
        this.queueAnnouncementSpeech(this.textToSpeak)
      }
    },
    triggerNoticeTone(force) {
      const now = Date.now()
      if (!force && now < this.noticeToneCooldownUntil) {
        return
      }
      const noticePlayer = this.$refs.noticePlayer
      if (noticePlayer && !noticePlayer.paused) {
        return
      }
      this.noticeToneCooldownUntil = now + 5000
      this.playNotice().catch((error) => {
        console.warn("notice audio play failed", error)
      })
    },
    async playNotice() {
      if (!this.$refs.noticePlayer) {
        return
      }
      this.$refs.noticePlayer.pause()
      this.$refs.noticePlayer.currentTime = 0
      this.$refs.noticePlayer.muted = true
      this.$refs.noticePlayer.muted = false
      await this.$refs.noticePlayer.play()
    },
    async navigateToNotification(notification) {
      const targetPath = notification?.path
      if (targetPath) {
        await this.ensureRouteLoaded()
        const messageTimestamp = this.normalizeNotificationTimestamp(notification?.timestamp)
        const notifyQuery = {
          orderNo: notification?.id,
          timestamp: messageTimestamp
        }
        if (router.hasRoute(targetPath)) {
          await router.push({
            name: targetPath,
            query: notifyQuery
          })
          return
        }
        if (String(targetPath).startsWith('/')) {
          await this.ensureRouteLoadedByPath(targetPath)
          const resolved = router.resolve({ path: targetPath })
          if (resolved?.matched?.length > 0) {
            await router.push({
              path: resolved.path,
              query: {
                ...resolved.query,
                ...notifyQuery
              }
            })
          }
        }
      }
    },
    async markNotificationRead(notificationId) {
      if (!notificationId) {
        return
      }
      await markReadMessage(notificationId).then(res => {
        if(res.status === 200 && res.data.code === 0) {
          this.messageCount = JSON.parse(res.data.data).messageCount
          this.notifications = JSON.parse(res.data.data).messages
        }
      })
    },
    toggleNotification(notification) {
      const currentId = notification?.id
      if (!currentId) {
        return
      }
      this.expandedNotificationId = this.expandedNotificationId === currentId ? null : currentId
    },
    async goNotification(notification) {
      await this.markNotificationRead(notification?.id)
      this.expandedNotificationId = null
      await this.navigateToNotification(notification)
    },
    async clearNotification(notification) {
      const notificationId = notification?.id
      if (!notificationId) {
        return
      }
      await this.markNotificationRead(notificationId)
      if (this.expandedNotificationId === notificationId) {
        this.expandedNotificationId = null
      }
    },
    async clearAllNotifications() {
      if (this.clearingNotifications || !this.notifications.length) {
        return
      }
      this.clearingNotifications = true
      try {
        const res = await clearAllMessages()
        if (res?.status === 200 && res?.data?.code === 0) {
          const data = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data
          this.messageCount = data?.messageCount || 0
          this.notifications = data?.messages || []
        } else {
          await this.fetchWsMessages()
        }
      } finally {
        this.expandedNotificationId = null
        this.clearingNotifications = false
      }
    },
    resolveNotificationTypeLabel(rawTitle) {
      const key = String(rawTitle || '').toLowerCase()
      if (key === 'withdraw') {
        return this.$t('topbar.type.withdrawOrder')
      }
      if (key === 'withdraw_result') {
        return this.$t('topbar.type.withdrawReviewDone')
      }
      if (key === 'payout') {
        return this.$t('topbar.type.payoutTimeoutOrder')
      }
      if (key === 'collection') {
        return this.$t('topbar.type.collectionTimeoutOrder')
      }
      return this.$t('topbar.newMessage')
    },
    resolveNotificationPayload(notification) {
      const content = notification?.content
      let payload = {}
      if (content && typeof content === 'string') {
        const text = content.trim()
        if (text.startsWith('{') && text.endsWith('}')) {
          try {
            payload = JSON.parse(text)
          } catch (e) {
            payload = {}
          }
        }
      } else if (content && typeof content === 'object') {
        payload = content
      }
      const orderNo = payload.orderNo || payload.transactionNo || payload.id || notification?.id || notification?.content || '-'
      const amount = payload.orderAmount ?? payload.amount ?? notification?.amount ?? '-'
      return { orderNo, amount }
    },
    toDayStartTimestamp(rawTimestamp) {
      const normalized = this.normalizeNotificationTimestamp(rawTimestamp)
      if (!normalized) {
        return undefined
      }
      const date = new Date(Number(normalized))
      if (Number.isNaN(date.getTime())) {
        return undefined
      }
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
      return String(dayStart.getTime())
    },
    normalizeNotificationTimestamp(rawTimestamp) {
      const ts = Number(rawTimestamp)
      if (!Number.isFinite(ts)) {
        return undefined
      }
      const normalized = String(Math.trunc(ts)).length === 10 ? ts * 1000 : ts
      const date = new Date(normalized)
      if (Number.isNaN(date.getTime())) {
        return undefined
      }
      return String(normalized)
    },
    async ensureRouteLoadedByPath(targetPath) {
      if (!String(targetPath).startsWith('/')) {
        return
      }
      const resolved = router.resolve({ path: targetPath })
      if (resolved?.matched?.length > 0) {
        return
      }
      await this.ensureRouteLoaded()
    },
    async ensureRouteLoaded(routeName) {
      if (routeName && router.hasRoute(routeName)) {
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
          window.dispatchEvent(new CustomEvent("menu-updated"))
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
    formatNotificationTitle(notification) {
      const rawTitle = String(notification?.title || '').toLowerCase()
      if (rawTitle === 'withdraw') {
        return this.$t('topbar.title.withdraw')
      }
      if (rawTitle === 'withdraw_result') {
        return this.$t('topbar.title.withdrawResult')
      }
      if (rawTitle === 'payout') {
        return this.$t('topbar.title.payout')
      }
      if (rawTitle === 'collection') {
        return this.$t('topbar.title.collection')
      }
      return notification?.title || this.$t('topbar.newMessage')
    },
    formatSpeechTitle(notification) {
      const rawTitle = String(notification?.title || '').trim()
      if (!rawTitle) {
        return this.$t('topbar.newMessage')
      }
      const typeLabel = this.resolveNotificationTypeLabel(rawTitle)
      if (typeLabel && typeLabel !== this.$t('topbar.newMessage')) {
        return this.$t('topbar.content.needHandle', { type: typeLabel })
      }
      return this.formatNotificationTitle({ title: rawTitle })
    },
    formatNotificationOrderNo(notification) {
      return this.resolveNotificationPayload(notification).orderNo
    },
    formatNotificationTime(timestamp) {
      return this.formatDateByTs(timestamp)
    },
    formatDateByTs(ts) {
      const ms = Number(String(Math.trunc(Number(ts))).length === 10 ? Number(ts) * 1000 : Number(ts))
      if (!Number.isFinite(ms)) {
        return '-'
      }
      const d = new Date(ms)
      if (Number.isNaN(d.getTime())) {
        return '-'
      }
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hour = String(d.getHours()).padStart(2, '0')
      const minute = String(d.getMinutes()).padStart(2, '0')
      const second = String(d.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    isNotificationExpanded(notification) {
      return notification?.id && this.expandedNotificationId === notification.id
    },
    viewDetail() {
      alert(this.$t('topbar.viewDetail'))
      router.push({
        name: 'AccountManagement'
      })
    }
  },
  watch: {
    "$i18n.locale"(val) {
      this.selectedLang = val;
      this.refreshLanguageOptions();
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
        <div class="topbar-tools">
        <div class="topbar-tool-item">
          <el-tooltip :content="$t('language')" placement="bottom">
            <span class="topbar-tool-icon-wrap">
              <SvgIcon name="language" class="topbar-tool-icon" />
            </span>
          </el-tooltip>
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
            <span class="lang-option">
              <SvgIcon :name="item.flag" :class="['lang-flag', { 'lang-flag-tall': item.value === 'ms' }]" />
              <span class="lang-label">{{ item.label }}</span>
            </span>
          </el-option>
        </el-select>
        <div class="topbar-tool-item topbar-tool-item-spaced">
          <el-tooltip :content="$t('timezone')" placement="bottom">
            <span class="topbar-tool-icon-wrap">
              <SvgIcon name="clock" class="topbar-tool-icon" />
            </span>
          </el-tooltip>
        </div>
        <el-select
            v-model="selectedTimeZone"
            size="small"
            @change="handleTimeZoneChange"
            filterable
            style="border: none;width: 190px"
        >
          <el-option
              v-for="item in timeZoneOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
          />
        </el-select>
      </div>
      <div style="display: flex;justify-content: center;align-items: center;">
        <div v-if="username" style="display: flex; align-items: center;">
          <el-dropdown trigger="click" class="notice-dropdown" :hide-on-click="false">
            <span class="notice-trigger">
              <el-badge :value="unreadCount()" :hidden="unreadCount() === 0">
                <span class="topbar-tool-icon-wrap">
                  <SvgIcon name="bell" class="topbar-tool-icon"/>
                </span>
              </el-badge>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="notice-menu">
                <el-dropdown-item class="notice-toggle-row" @click.stop>
                  <div class="notice-toggle-wrap">
                    <span>{{ $t('topbar.notificationChannel') }}</span>
                    <el-switch
                      :model-value="notificationChannelEnabled"
                      inline-prompt
                      :active-text="$t('topbar.enabled')"
                      :inactive-text="$t('topbar.disabled')"
                      @change="handleNotificationChannelToggle"
                    />
                  </div>
                </el-dropdown-item>
                <el-dropdown-item v-if="notifications.length > 0" class="notice-clear-row notice-clear-row-top" @click.stop>
                  <div class="notice-clear-all" @click.stop="clearAllNotifications">
                    {{ clearingNotifications ? $t('topbar.clearing') : $t('topbar.clearAll') }}
                  </div>
                </el-dropdown-item>
                <el-dropdown-item v-if="notifications.length === 0" disabled>
                  {{ notificationChannelEnabled ? $t('topbar.noMessages') : $t('topbar.notificationDisabled') }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-for="item in notifications"
                  :key="item.id"
                >
                  <div class="notice-item" :class="{ 'notice-unread': !item.read }">
                    <div class="notice-title-row">
                      <div class="notice-title" @click.stop="toggleNotification(item)">
                        {{ formatNotificationTitle(item) }}
                      </div>
                      <span class="notice-remove" @click.stop="clearNotification(item)">×</span>
                    </div>
                    <div v-if="isNotificationExpanded(item)" class="notice-detail">
                      <div class="notice-line">{{ $t('topbar.orderNo') }}{{ formatNotificationOrderNo(item) }}</div>
                      <div class="notice-line">{{ $t('topbar.orderCreateTime') }}{{ formatNotificationTime(item.timestamp) }}</div>
                      <div class="notice-actions">
                        <el-button type="primary" size="small" @click.stop="goNotification(item)">
                          {{ $t('topbar.goTo') }}
                        </el-button>
                      </div>
                    </div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click" class="user-dropdown">
            <span class="user-profile-trigger">
              <span class="user-avatar-wrapper">
                <el-avatar class="user-avatar">{{ getUserInitial() }}</el-avatar>
                <span class="user-online-dot"></span>
              </span>
              <span class="user-meta">
                <span class="user-name">{{ username }}</span>
                <span class="user-subtext">{{ formatUserRoleLabel() }}</span>
              </span>
              <SvgIcon name="downBlack" class="user-caret"/>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="user-menu">
                <div class="user-menu-panel">
                  <div class="user-menu-card">
                    <div class="user-menu-card-top">
                      <span class="user-menu-card-name">{{ username }}</span>
                      <span class="user-role-tag">{{ formatUserRoleLabel() }}</span>
                    </div>
                    <div class="user-menu-card-sub">
                      <span class="user-menu-label">{{ $t('topbar.lastLogin') }}</span>
                      <span>{{ formatLastLoginLabel() }}</span>
                    </div>
                    <div class="user-menu-card-actions">
                      <button type="button" class="user-menu-logout-inline" @click.stop="logOut">
                        <SvgIcon name="logout" style="height:16px"/>
                        {{$t('topbar.logout')}}
                      </button>
                    </div>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </div>
        <div v-else>
          {{ $t('topbar.pleaseLogin') }}
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

.topbar-tools {
  margin-left: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
}

.topbar-tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topbar-tool-item-spaced {
  margin-left: 12px;
}

.topbar-tool-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  color: #475569;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.topbar-tool-icon-wrap:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.topbar-tool-icon {
  width: 18px;
  height: 18px;
}

.topbar-tool-label {
  font-size: 12px;
  margin: 0;
  line-height: 1.2;
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
  margin-left: 0;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.notice-dropdown {
  margin-right: 6px;
}

.notice-toggle-row {
  cursor: default;
  position: sticky;
  top: 0;
  z-index: 3;
  background: #fff;
}

.notice-toggle-wrap {
  min-width: 220px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: #334155;
}

.user-dropdown {
  margin-left: 2px;
}

.user-profile-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.user-profile-trigger:hover {
  background-color: rgba(100, 115, 135, 0.12);
  box-shadow: inset 0 0 0 1px rgba(100, 115, 135, 0.22);
}

.user-avatar-wrapper {
  position: relative;
  width: 34px;
  height: 34px;
}

.user-avatar {
  width: 34px;
  height: 34px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #4f7cf7, #2f5fdb);
  color: #ffffff;
  border: 2px solid #e2e8f0;
}

.user-online-dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #22c55e;
  border: 2px solid #f8fafc;
}

.user-meta {
  display: inline-flex;
  flex-direction: column;
  line-height: 1.1;
}

.user-name {
  color: #1f2937;
  font-size: 14px;
  font-weight: 700;
}

.user-subtext {
  color: #64748b;
  font-size: 12px;
  margin-top: 2px;
}

.user-caret {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.user-menu {
  min-width: 260px;
}

.user-menu-panel {
  padding: 8px 10px;
}

.user-menu-summary-item {
  cursor: default;
}

.user-menu-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.user-menu-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
}

.user-menu-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.user-menu-card-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role-tag {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #1d4ed8;
  background: #dbeafe;
}

.user-menu-card-sub {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: #334155;
}

.user-menu-card-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.user-menu-logout-inline {
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.user-menu-logout-inline:hover {
  background: #fef2f2;
  color: #b91c1c;
}

.user-menu-line {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: #1f2937;
}

.user-menu-label {
  color: #64748b;
}

.speech-test-btn {
  margin-right: 12px;
}

.notice-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
}

.notice-menu {
  width: 260px;
  max-height: 260px;
  overflow-y: auto;
}

.notice-unread {
  font-weight: 600;
}
.notice-item {
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.notice-title {
  font-size: 13px;
  line-height: 18px;
  cursor: pointer;
}
.notice-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.notice-remove {
  color: #909399;
  cursor: pointer;
  line-height: 1;
  font-size: 14px;
  user-select: none;
}
.notice-remove:hover {
  color: #f56c6c;
}
.notice-line {
  font-size: 12px;
  line-height: 16px;
  color: #606266;
  word-break: break-all;
}
.notice-detail {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.notice-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2px;
}
.notice-clear-row {
  justify-content: center;
}
.notice-clear-row-top {
  position: sticky;
  top: 36px;
  z-index: 2;
  background: #fff;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}
.notice-clear-all {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #409EFF;
  cursor: pointer;
  user-select: none;
}
.lang-option {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
.lang-flag {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
.lang-flag-tall {
  height: 32px;
}
.lang-label {
  line-height: 16px;
}
.timezone-label {
  white-space: nowrap;
}

.zhedie {
  position: fixed;
  margin-top:0;
  top: 0;
}
.zhedie-zhedie {
  margin-top:0;
  top: 0;
  position: fixed;
}
</style>
<style>
.noticeMessage {
  cursor: pointer;
}
</style>
