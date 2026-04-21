<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-views-container">
    <div class="main-title" style="width:95%;margin-left:0; border-radius: 0;margin-right: 0;padding-left:20px;padding-top:8px;">
      {{ $t('scasConfig.title') }}
    </div>

    <div class="main-views-form" style="background-color: white;height: 500px;margin-top: 0;width: 96%;display: flex;justify-content: center;">
      <el-form style="margin-top: 100px;height: 80%;">
        <div class="el-form-line">
          <el-form-item>
            <template #label>
              <span style="width: 250px;font-size: 16px;color: dodgerblue">{{ $t('scasConfig.label.orderLimit') }}</span>
            </template>
            <el-input :min="1" :step="1" class="center-input" type="number" v-model="merchantEachOrderTimes" style="width: 400px">
            </el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item>
            <template #label>
                <span style="width: 250px;font-size: 16px;color: dodgerblue">{{ $t('scasConfig.label.fixedIpQps') }}</span>
            </template>
            <el-input type="textarea" :autosize="{minRows: 1, maxRows:100}" v-model="qpsForIP" :placeholder="$t('scasConfig.placeholder.qpsFormat')" style="width: 400px;"></el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item style="margin-top: 8px;">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: dodgerblue">{{ $t('scasConfig.label.rateLimitEnabled') }}</span>
            </template>
            <el-switch v-model="rateLimitEnabled" />
          </el-form-item>
        </div>
        <div class="el-form-line" v-if="rateLimitEnabled">
          <el-form-item style="margin-top: 12px;">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: dodgerblue">{{ $t('scasConfig.label.rateLimitWindowSeconds') }}</span>
            </template>
            <el-input :min="1" :step="1" class="center-input" type="number" v-model="rateLimitWindowSeconds" style="width: 200px">
            </el-input>
          </el-form-item>
        </div>
        <div class="el-form-line" v-if="rateLimitEnabled">
          <el-form-item style="margin-top: 12px;">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: dodgerblue">{{ $t('scasConfig.label.rateLimitMaxRequests') }}</span>
            </template>
            <el-input :min="1" :step="1" class="center-input" type="number" v-model="rateLimitMaxRequests" style="width: 200px">
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="background-color: white; display: flex;justify-content: space-between;align-items: center;width: 96%;border-top: solid 2px gray;height: 30%;">
      <el-button style="margin-left: 30%;width: 100px;height: auto;color: #ffffff" @click="reset">{{ $t('common.reset') }}</el-button>
      <el-button style="margin-right: 30%;width: 100px;height: auto;color: #ffffff" @click="submit">{{ $t('common.submit') }}</el-button>
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
        <el-button type="primary" @click="confirmSubmit">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getRateLimitConfig, updateRateLimitConfig} from "@/api/interface/backendInterface.js";

export default {
  name: 'ScasConfig',
  data() {
    return {
      merchantEachOrderTimes: '',
      qpsForIP: '',
      rateLimitEnabled: false,
      rateLimitWindowSeconds: '',
      rateLimitMaxRequests: '',
      googleDialogVisible: false,
      googleForm: {
        googleCode: ''
      },
      googleRule: {
        googleCode: {
          required: true, trigger: 'blur', message: this.$t('common.googleCodeRequired')
        }
      },
      beforeRateLimitConfig: {
        rateLimitEnabled: false,
        rateLimitWindowSeconds: '',
        rateLimitMaxRequests: '',
        fixedIpQps: ''
      }
    }
  },
  mounted() {
    this.loadRateLimitConfig();
  },
  methods: {
    async loadRateLimitConfig() {
      const res = await getRateLimitConfig();
      if (res?.status === 200 && Number(res.data?.code) === 0) {
        let data = res.data?.data || {};
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            data = {};
          }
        }
        if (data && Array.isArray(data.configItems)) {
          const itemsMap = {};
          data.configItems.forEach(item => {
            if (item?.key) {
              itemsMap[item.key] = item.value;
            }
          });
          data = itemsMap;
        }
        if (data.enabled !== undefined && data.enabled !== null) {
          const enabledValue = typeof data.enabled === 'string' ? data.enabled.trim() : data.enabled;
          this.rateLimitEnabled = enabledValue === true || enabledValue === 1 || enabledValue === '1' || enabledValue === 'true';
        }
        this.rateLimitWindowSeconds = data.windowSeconds ?? this.rateLimitWindowSeconds;
        this.rateLimitMaxRequests = data.maxRequests ?? this.rateLimitMaxRequests;
        this.qpsForIP = data.fixedIpQps ?? data.fixedIpQpsRaw ?? this.qpsForIP;
        this.beforeRateLimitConfig = {
          rateLimitEnabled: this.rateLimitEnabled,
          rateLimitWindowSeconds: this.rateLimitWindowSeconds,
          rateLimitMaxRequests: this.rateLimitMaxRequests,
          fixedIpQps: this.qpsForIP
        };
      } else {
        this.$notify({
          title: this.$t('common.error'),
          message: res?.data?.message || this.$t('common.requestFailed'),
          type: 'error',
          position: 'bottom-right',
        });
      }
    },
    reset() {
      this.rateLimitEnabled = this.beforeRateLimitConfig.rateLimitEnabled;
      this.rateLimitWindowSeconds = this.beforeRateLimitConfig.rateLimitWindowSeconds;
      this.rateLimitMaxRequests = this.beforeRateLimitConfig.rateLimitMaxRequests;
      this.qpsForIP = this.beforeRateLimitConfig.fixedIpQps;
    },
    async submit() {
      if (this.rateLimitEnabled) {
        const windowSeconds = Number(this.rateLimitWindowSeconds);
        const maxRequests = Number(this.rateLimitMaxRequests);
        if (!windowSeconds || windowSeconds <= 0) {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('scasConfig.validation.windowSecondsPositive'),
            type: 'error',
            position: 'bottom-right',
          });
          return;
        }
        if (!maxRequests || maxRequests <= 0) {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('scasConfig.validation.maxRequestsPositive'),
            type: 'error',
            position: 'bottom-right',
          });
          return;
        }
      }
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
    confirmSubmit() {
      this.$refs.googleFormRef.validate(valid => {
        if (!valid) {
          return;
        }
        this.submitWithGoogleCode();
      })
    },
    async submitWithGoogleCode() {
      const payload = {
        enabled: this.rateLimitEnabled,
        windowSeconds: Number(this.rateLimitWindowSeconds),
        maxRequests: Number(this.rateLimitMaxRequests),
        fixedIpQps: this.qpsForIP,
        googleCode: this.googleForm.googleCode
      };
      const res = await updateRateLimitConfig(payload);
      if (res?.status === 200 && Number(res.data?.code) === 0) {
        this.beforeRateLimitConfig = {
          rateLimitEnabled: this.rateLimitEnabled,
          rateLimitWindowSeconds: this.rateLimitWindowSeconds,
          rateLimitMaxRequests: this.rateLimitMaxRequests,
          fixedIpQps: this.qpsForIP
        };
        this.$notify({
          title: this.$t('common.success'),
          message: this.$t('common.updateSuccess'),
          type: 'success',
          position: 'bottom-right',
        });
        this.googleDialogVisible = false;
        this.googleForm.googleCode = '';
        this.$refs.googleFormRef?.resetFields();
      } else {
        this.$notify({
          title: this.$t('common.error'),
          message: res?.data?.message || this.$t('common.updateFailed'),
          type: 'error',
          position: 'bottom-right',
        });
      }
    }
  }
}
</script>
<style scoped>
</style>
