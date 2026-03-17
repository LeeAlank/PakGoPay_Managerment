<template>
  <div class="main-views-container">
    <div class="main-title" style="width:95%;margin-left:0; border-radius: 0;margin-right: 0;padding-left:20px;padding-top:20px;">
      {{ $t('flyingConfig.title') }}
    </div>
    <div class="main-views-form flying-config-form">
      <el-form :model="form" class="flying-config-form-inner">
        <div class="el-form-line">
          <el-form-item>
            <template #label>
              <span class="flying-config-label">{{ $t('flyingConfig.telegram.token') }}</span>
            </template>
            <el-input v-model="form.token" show-password :placeholder="$t('flyingConfig.telegram.tokenPlaceholder')" style="width: 300px;" />
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item>
            <template #label>
              <span class="flying-config-label">{{ $t('flyingConfig.telegram.webhookSecret') }}</span>
            </template>
            <el-input v-model="form.webhookSecret" show-password :placeholder="$t('flyingConfig.telegram.webhookSecretPlaceholder')" style="width: 300px;" />
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item>
            <template #label>
              <span class="flying-config-label">{{ $t('flyingConfig.telegram.enabled') }}</span>
            </template>
            <el-switch v-model="form.enabled" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="flying-config-actions">
      <el-button style="margin-left: 30%;width: 100px;height: auto;color: dodgerblue" @click="load" :loading="loading">
        {{ $t('flyingConfig.action.reload') }}
      </el-button>
      <el-button style="margin-right: 30%;width: 100px;height: auto;color: dodgerblue" @click="openGoogleDialog" :loading="saving">
        {{ $t('flyingConfig.action.save') }}
      </el-button>
    </div>
    <el-dialog
      v-model="googleDialogVisible"
      :title="$t('common.googleCode')"
      class="dialog"
      center
      width="30%"
      height="200px"
    
      align-center>
      <el-form ref="googleFormRef" :rules="googleRule" :model="googleForm" style="height:100px;margin-top: 20px">
        <el-row>
          <el-col :span="24" style="display: flex;justify-content: center;align-items: center;">
            <el-form-item :label="$t('common.googleCode')" label-width="150px" prop="googleCode">
              <el-input v-model="googleForm.googleCode" style="width: 200px"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 3%;height: 30px;">
        <el-button @click="cancelGoogleDialog">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="confirmSave">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTelegramConfig, updateTelegramConfig } from "@/api/interface/backendInterface.js";

export default {
  name: "FlyingConfig",
  data() {
    return {
      form: {
        token: "",
        webhookSecret: "",
        enabled: 1
      },
      googleDialogVisible: false,
      googleForm: {
        googleCode: ''
      },
      googleRule: {
        googleCode: {
          required: true, trigger: 'blur', message: this.$t('common.googleCodeRequired')
        }
      },
      loading: false,
      saving: false
    };
  },
  methods: {
    load() {
      this.loading = true;
      getTelegramConfig().then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const data = res.data.data ? JSON.parse(res.data.data) : {};
          this.form.token = data.token || "";
          this.form.webhookSecret = data.webhookSecret || "";
          this.form.enabled = data.enabled === undefined || data.enabled === null || data.enabled === "" ? 1 : Number(data.enabled);
        } else {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            message: res.data?.message || this.$t('common.requestFailed'),
            duration: 3000,
            position: 'bottom-right'
          })
        }
      }).catch(err => {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          message: err.message,
          duration: 3000,
          position: 'bottom-right'
        })
      }).finally(() => {
        this.loading = false;
      });
    },
    openGoogleDialog() {
      this.googleDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.googleFormRef?.clearValidate();
      });
    },
    cancelGoogleDialog() {
      this.googleDialogVisible = false;
      this.googleForm.googleCode = '';
      this.$refs.googleFormRef?.resetFields();
    },
    confirmSave() {
      this.$refs.googleFormRef.validate(valid => {
        if (!valid) {
          return;
        }
        this.save();
      })
    },
    save() {
      this.saving = true;
      const payload = Object.assign({}, this.form, { googleCode: this.googleForm.googleCode });
      updateTelegramConfig(payload).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: this.$t('common.success')
          })
          this.googleDialogVisible = false;
          this.googleForm.googleCode = '';
          this.$refs.googleFormRef?.resetFields();
        } else {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            message: res.data?.message || this.$t('common.requestFailed'),
            duration: 3000,
            position: 'bottom-right'
          })
        }
      }).catch(err => {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          message: err.message,
          duration: 3000,
          position: 'bottom-right'
        })
      }).finally(() => {
        this.saving = false;
      });
    }
  },
  mounted() {
    this.load();
  }
};
</script>

<style scoped>
.flying-config-form {
  background-color: white;
  height: 500px;
  margin-top: 0;
  width: 96%;
  display: flex;
  justify-content: center;
}

.flying-config-form-inner {
  margin-top: 100px;
  height: 80%;
}

.flying-config-label {
  width: 250px;
  font-size: 16px;
  color: dodgerblue;
}

.flying-config-actions {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 96%;
  border-top: solid 2px gray;
  height: 30%;
}
</style>
