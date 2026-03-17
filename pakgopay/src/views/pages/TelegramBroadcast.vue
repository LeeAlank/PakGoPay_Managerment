<template>
  <div class="main-views-container">
    <div class="main-title telegram-broadcast-title">
      {{ $t('telegramBroadcast.title') }}
    </div>
    <div class="main-views-form telegram-broadcast-form">
      <el-form :model="form" class="telegram-broadcast-form-inner">
        <div class="el-form-line">
          <div class="telegram-broadcast-item telegram-target-row">
            <div class="telegram-target-label">{{ $t('telegramBroadcast.targetType') }}</div>
            <div class="telegram-target-content">
              <el-radio-group v-model="form.targetType" class="telegram-target-group">
                <el-radio :label="1">{{ $t('telegramBroadcast.targetTypeAll') }}</el-radio>
                <el-radio :label="2">{{ $t('telegramBroadcast.targetTypePartial') }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="el-form-line" v-if="form.targetType === 2">
          <div class="telegram-broadcast-item telegram-target-row">
            <div class="telegram-target-label">{{ $t('telegramBroadcast.merchantAccounts') }}</div>
            <div class="telegram-target-content telegram-target-content-wrap">
              <el-select
                v-model="form.merchantAccounts"
                multiple
                filterable
                clearable
                collapse-tags
                collapse-tags-tooltip
                class="telegram-merchant-select"
                :placeholder="$t('telegramBroadcast.merchantAccountsPlaceholder')"
              >
                <el-option
                  v-for="item in merchantOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span class="merchant-select-tip">
                <el-icon><WarningFilled /></el-icon>
                <span>{{ $t('telegramBroadcast.merchantSelectTip') }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="el-form-line">
          <div class="telegram-broadcast-item telegram-target-row telegram-form-row">
            <div class="telegram-target-label">{{ $t('telegramBroadcast.announcementTitle') }}</div>
            <div class="telegram-target-content">
              <el-input
                v-model="form.title"
                maxlength="100"
                show-word-limit
                class="telegram-title-input"
                :placeholder="$t('telegramBroadcast.announcementTitlePlaceholder')"
              />
            </div>
          </div>
        </div>
        <div class="el-form-line">
          <div class="telegram-broadcast-item telegram-target-row telegram-form-row telegram-form-row-top">
            <div class="telegram-target-label">{{ $t('telegramBroadcast.content') }}</div>
            <div class="telegram-target-content">
            <div
              class="telegram-message-editor"
              tabindex="0"
              @click="focusMessageInput"
              @dragover.prevent
              @drop.prevent="handleImageDrop"
              @paste="handleImagePaste"
            >
              <input
                ref="imageInputRef"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleImageSelect"
              />
              <el-input
                ref="messageInputRef"
                v-model="form.content"
                type="textarea"
                :rows="8"
                maxlength="5000"
                show-word-limit
                class="telegram-message-textarea"
                :placeholder="$t('telegramBroadcast.contentPlaceholder')"
              />
              <div class="telegram-editor-toolbar">
                <el-button class="telegram-image-btn" @click.stop="triggerImageSelect">
                  {{ form.imageDataUrl ? $t('telegramBroadcast.replaceImage') : $t('telegramBroadcast.selectImage') }}
                </el-button>
                <span class="telegram-image-subtip">{{ $t('telegramBroadcast.imagePasteTip') }}</span>
              </div>
              <div v-if="form.imageDataUrl" class="telegram-image-card">
                <div class="telegram-image-meta">
                  <span>{{ form.imageName || $t('telegramBroadcast.imageSelected') }}</span>
                  <el-button link type="danger" @click.stop="clearImage">
                    {{ $t('telegramBroadcast.removeImage') }}
                  </el-button>
                </div>
              </div>
              <div v-else class="telegram-image-placeholder">
                <div>{{ $t('telegramBroadcast.imageDropTip') }}</div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div class="el-form-line">
          <div class="telegram-broadcast-item telegram-target-row telegram-form-row">
            <div class="telegram-target-label">{{ $t('telegramBroadcast.pinMessage') }}</div>
            <div class="telegram-target-content telegram-target-content-wrap">
              <el-switch v-model="form.pinMessage" />
              <span class="merchant-select-tip merchant-select-tip-inline">
                <el-icon><WarningFilled /></el-icon>
                <span>{{ $t('telegramBroadcast.pinMessageTip') }}</span>
              </span>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="telegram-broadcast-actions">
      <el-button class="action-btn" @click="loadMerchants" :loading="loading">
        {{ $t('flyingConfig.action.reload') }}
      </el-button>
      <el-button class="action-btn" type="primary" @click="openGoogleDialog" :loading="sending">
        {{ $t('telegramBroadcast.send') }}
      </el-button>
    </div>

    <el-dialog
      v-model="googleDialogVisible"
      :title="$t('common.googleCode')"
      width="480px"
      align-center
      class="telegram-broadcast-google-dialog"
    >
      <el-form
        ref="googleFormRef"
        :rules="googleRule"
        :model="googleForm"
        class="google-confirm-form"
        @submit.prevent
      >
        <el-form-item :label="$t('common.googleCode')" prop="googleCode" label-width="120px">
          <el-input
            v-model="googleForm.googleCode"
            style="width: 220px"
            @keydown.enter.prevent="confirmSend"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelGoogleDialog">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="confirmSend" :loading="sending">{{ $t('common.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getMerchantInfo, telegramBroadcast } from "@/api/interface/backendInterface.js";
import { WarningFilled } from "@element-plus/icons-vue";

export default {
  name: "TelegramBroadcast",
  components: {
    WarningFilled
  },
  data() {
    return {
      loading: false,
      sending: false,
      googleDialogVisible: false,
      merchantOptions: [],
      form: {
        targetType: 1,
        merchantAccounts: [],
        title: "",
        content: "",
        imageName: "",
        imageDataUrl: "",
        pinMessage: false
      },
      googleForm: {
        googleCode: ""
      },
      googleRule: {
        googleCode: {
          required: true,
          trigger: "blur",
          message: this.$t("common.googleCodeRequired")
        }
      }
    };
  },
  methods: {
    notifyError(message) {
      this.$notify({
        title: this.$t("common.error"),
        type: "error",
        message: message || this.$t("common.requestFailed"),
        duration: 3000,
        position: "bottom-right"
      });
    },
    notifySuccess(message) {
      this.$message({
        type: "success",
        message: message || this.$t("common.success")
      });
    },
    loadMerchants() {
      this.loading = true;
      getMerchantInfo({ pageSize: 1000, telegramBoundOnly: true }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          const parsed = JSON.parse(res.data.data || "{}");
          const list = parsed?.merchantInfoDtoList || [];
          this.merchantOptions = list
            .map((item) => ({
              label: item?.merchantName || item?.accountName || "",
              value: item?.accountName || ""
            }))
            .filter((item) => item.label && item.value);
          return;
        }
        this.notifyError(res.data?.message);
      }).catch((err) => {
        this.notifyError(err.message);
      }).finally(() => {
        this.loading = false;
      });
    },
    openGoogleDialog() {
      if (Number(this.form.targetType) === 2
        && (!Array.isArray(this.form.merchantAccounts) || this.form.merchantAccounts.length === 0)) {
        this.notifyError(this.$t("telegramBroadcast.validation.merchantAccountsRequired"));
        return;
      }
      if ((!this.form.content || !this.form.content.trim()) && !this.form.imageDataUrl) {
        this.notifyError(this.$t("telegramBroadcast.validation.contentOrImageRequired"));
        return;
      }
      this.googleDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.googleFormRef?.clearValidate();
      });
    },
    cancelGoogleDialog() {
      this.googleDialogVisible = false;
      this.googleForm.googleCode = "";
      this.$refs.googleFormRef?.resetFields();
    },
    confirmSend() {
      if (this.sending) {
        return;
      }
      this.$refs.googleFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        this.sendBroadcast();
      });
    },
    sendBroadcast() {
      if (this.sending) {
        return;
      }
      const selectedAccounts = Number(this.form.targetType) === 1
        ? this.merchantOptions.map(item => item.value)
        : this.form.merchantAccounts;
      if (!Array.isArray(selectedAccounts) || selectedAccounts.length === 0) {
        this.notifyError(this.$t("telegramBroadcast.validation.noBoundMerchant"));
        return;
      }
      this.sending = true;
      telegramBroadcast({
        merchantAccounts: selectedAccounts,
        title: this.form.title?.trim() || "",
        content: this.form.content.trim(),
        imageName: this.form.imageName || "",
        imageDataUrl: this.form.imageDataUrl || "",
        pinMessage: !!this.form.pinMessage,
        googleCode: this.googleForm.googleCode
      }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          const result = res.data.data ? JSON.parse(res.data.data) : {};
          this.notifySuccess(this.$t("telegramBroadcast.sendSuccess", {
            sent: result.sentGroupCount ?? 0,
            total: result.totalAccounts ?? selectedAccounts.length
          }));
          this.form.title = "";
          this.form.content = "";
          this.form.imageName = "";
          this.form.imageDataUrl = "";
          this.form.pinMessage = false;
          if (Number(this.form.targetType) === 2) {
            this.form.merchantAccounts = [];
          }
          this.cancelGoogleDialog();
          return;
        }
        this.notifyError(res.data?.message);
      }).catch((err) => {
        this.notifyError(err.message);
      }).finally(() => {
        this.sending = false;
      });
    },
    triggerImageSelect() {
      this.$refs.imageInputRef?.click();
    },
    focusMessageInput() {
      const input = this.$refs.messageInputRef?.textarea;
      input?.focus?.();
    },
    handleImageSelect(event) {
      const file = event?.target?.files?.[0];
      if (file) {
        this.loadImageFile(file);
      }
      if (event?.target) {
        event.target.value = "";
      }
    },
    handleImageDrop(event) {
      const file = Array.from(event?.dataTransfer?.files || []).find(item => item.type?.startsWith("image/"));
      if (file) {
        this.loadImageFile(file);
      } else {
        this.notifyError(this.$t("telegramBroadcast.validation.imageRequired"));
      }
    },
    handleImagePaste(event) {
      const items = Array.from(event?.clipboardData?.items || []);
      const imageItem = items.find(item => item.type?.startsWith("image/"));
      const file = imageItem?.getAsFile?.();
      if (file) {
        this.loadImageFile(file);
      }
    },
    loadImageFile(file) {
      if (!file.type?.startsWith("image/")) {
        this.notifyError(this.$t("telegramBroadcast.validation.imageRequired"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.form.imageName = file.name || "telegram-broadcast-image.png";
        this.form.imageDataUrl = String(reader.result || "");
      };
      reader.onerror = () => {
        this.notifyError(this.$t("common.requestFailed"));
      };
      reader.readAsDataURL(file);
    },
    clearImage() {
      this.form.imageName = "";
      this.form.imageDataUrl = "";
    }
  },
  mounted() {
    this.loadMerchants();
  }
};
</script>

<style scoped>
.telegram-broadcast-title {
  width: 95%;
  margin-left: 0;
  margin-right: 0;
  border-radius: 0;
  padding-left: 20px;
  padding-top: 20px;
}

.telegram-broadcast-form {
  background-color: #fff;
  width: 96%;
  min-height: 560px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 36px 0 32px;
  box-sizing: border-box;
}

.telegram-broadcast-form-inner {
  width: 980px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.telegram-broadcast-item {
  width: 980px;
}

.telegram-target-row {
  display: grid;
  grid-template-columns: 140px 720px;
  column-gap: 16px;
  align-items: center;
  width: 980px;
}

.telegram-target-label {
  color: dodgerblue;
  font-size: 16px;
  text-align: right;
  line-height: 40px;
}

.telegram-target-content {
  width: 720px;
  min-width: 720px;
  max-width: 720px;
  display: flex;
  align-items: center;
}

.telegram-target-content-wrap {
  flex-wrap: wrap;
  row-gap: 8px;
}

.telegram-merchant-select {
  width: 420px;
  flex: 0 0 420px;
}

.el-form-line {
  display: flex;
  justify-content: center;
}

.telegram-form-row {
  align-items: center;
}

.telegram-form-row-top {
  align-items: flex-start;
}

.telegram-form-row-top .telegram-target-label {
  line-height: 1.5;
  padding-top: 8px;
}

.telegram-target-group {
  width: 100%;
}

.telegram-title-input {
  width: 420px;
}

.telegram-message-editor {
  width: 720px;
  min-height: 260px;
  border: 1px dashed #c0c4cc;
  border-radius: 10px;
  background: #fafcff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  gap: 12px;
}

.telegram-message-editor:hover,
.telegram-message-editor:focus {
  border-color: #409eff;
  background: #f3f9ff;
  outline: none;
}

.telegram-message-textarea {
  width: 100%;
}

.telegram-message-textarea :deep(.el-textarea__inner) {
  border: none;
  background: transparent;
  box-shadow: none;
  resize: none;
  padding: 0;
  min-height: 140px !important;
}

.telegram-editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.telegram-image-btn {
  margin: 0;
}

.telegram-image-card {
  border-top: 1px solid #e4e7ed;
  padding-top: 12px;
}

.telegram-image-placeholder {
  color: #606266;
  text-align: center;
  line-height: 1.8;
  border-top: 1px dashed #e4e7ed;
  padding-top: 12px;
}

.telegram-image-subtip {
  font-size: 13px;
  color: #909399;
}

.telegram-image-meta {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #606266;
  line-height: 1.6;
}

.merchant-select-tip {
  color: #f56c6c;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  white-space: normal;
  word-break: break-word;
}

.merchant-select-tip-inline {
  margin-left: 12px;
}

.telegram-broadcast-actions {
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 160px;
  width: 96%;
  border-top: solid 2px gray;
  height: 100px;
  box-sizing: border-box;
}

.action-btn {
  width: 100px;
}

.telegram-broadcast-actions .action-btn:first-child {
  margin-left: 0;
}

.telegram-broadcast-actions .action-btn:last-child {
  margin-right: 0;
}

.google-confirm-form {
  padding-top: 8px;
  padding-bottom: 8px;
}

.google-confirm-form :deep(.el-form-item) {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.google-confirm-form :deep(.el-form-item__content) {
  flex: 0 0 auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}
</style>
