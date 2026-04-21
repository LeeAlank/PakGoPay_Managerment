<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-views-container">
    <div class="main-title" style="width:95%;margin-left:0; border-radius: 0;margin-right: 0;padding-left:20px;padding-top:8px;">
      {{ $t('collectingConfig.title') }}
    </div>

    <div class="main-views-form" style="background-color: white;height: 500px;margin-top: 0;width: 96%;display: flex;justify-content: center;">
      <el-form style="margin-top: 100px;height: 80%;">
        <div class="el-form-line">
          <el-form-item >
            <template #label>
              <span style="width: 250px;font-size: 16px;color: dodgerblue">{{ $t('collectingConfig.label.orderTimeout') }}</span>
            </template>
            <el-input :min="1" :step="1" class="center-input" type="number" v-model="orderLoseEfficacy" style="width: 200px">
            </el-input>
          </el-form-item>
        </div>
        <div class="el-form-line" style="width: auto">
          <el-form-item >
            <template #label>
              <span style="width: 250px;font-size: 16px;color: dodgerblue">{{ $t('collectingConfig.label.callbackRetry') }}</span>
            </template>
            <el-input :min="1" :step="1" type="number" v-model="callbackRetry" style="width: 200px;">
            </el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item  class="large-label">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: dodgerblue">{{ $t('collectingConfig.label.matchMode') }}</span>
            </template>
            <el-radio-group v-model="collectingPathChannelMatchMode">
              <el-radio :label="3">{{ $t('common.matchMode.priority') }}</el-radio>
              <el-radio :label="6">{{ $t('common.matchMode.random') }}</el-radio>
              <el-radio :label="9">{{ $t('common.matchMode.average') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div style="text-align: left">
            <SvgIcon name="notice"></SvgIcon>{{ $t('common.matchMode.title') }}
          </div>
          <div style="text-align: left">
            <div>
              {{ $t('common.matchMode.desc1') }}<br>
              {{ $t('common.matchMode.desc2') }}<br>
              {{ $t('common.matchMode.desc3') }}
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div style="background-color: white; display: flex;justify-content: space-between;align-items: center;width: 96%;border-top: solid 2px gray;height: 30%;">
      <el-button style="margin-left: 30%;width: 100px;height: auto;color: #ffffff" @click="reset">{{ $t('common.reset') }}</el-button>
      <el-button style="margin-right: 30%;width: 100px;height: auto;color: #ffffff">{{ $t('common.submit') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectingConfig',
  data() {
    return {
      orderLoseEfficacy: 1,
      callbackRetry: 1,
      collectingPathChannelMatchMode: 3,
      collectingConfig: {
        collectingPathChannelMatchMode:3
      },
      /** 数据库拿到的现有配置 */
      beforeCollectingConfig: {
        collectingPathChannelMatchMode:3,
        orderLoseEfficacy: 5,
        callbackRetry: 5,
      }
    }
  },
  mounted() {
    /** 初始加载系统配置 */
    this.orderLoseEfficacy = this.beforeCollectingConfig.orderLoseEfficacy;
    this.callbackRetry = this.beforeCollectingConfig.callbackRetry;
    this.collectingPathChannelMatchMode = this.beforeCollectingConfig.collectingPathChannelMatchMode;
  },
  methods: {
    reset() {
      /** 修改过程中点重置，回填系统配置 */
      this.orderLoseEfficacy = this.beforeCollectingConfig.orderLoseEfficacy;
      this.callbackRetry = this.beforeCollectingConfig.callbackRetry;
      this.collectingPathChannelMatchMode = this.beforeCollectingConfig.collectingPathChannelMatchMode;

    },
    submit() {

    }
  }
}
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
<style scoped>

</style>
