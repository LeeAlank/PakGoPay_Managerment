<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-views-container">
    <div class="main-title" style="width:95%;margin-left:0; border-radius: 0;margin-right: 0;padding-left:20px;padding-top:20px;">
      代收配置
    </div>

    <div class="main-views-form" style="background-color: white;height: 500px;margin-top: 0;width: 96%;display: flex;justify-content: center;">
      <el-form style="margin-top: 100px;height: 80%;">
        <div class="el-form-line">
          <el-form-item size="medium">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: deepskyblue">代收订单失效时长(min):</span>
            </template>
            <el-input :min="1" :step="1" class="center-input" type="number" v-model="orderLoseEfficacy" style="width: 200px">
            </el-input>
          </el-form-item>
        </div>
        <div class="el-form-line" style="width: auto">
          <el-form-item size="medium">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: deepskyblue">代收回调失败重试配置(times):</span>
            </template>
            <el-input :min="1" :step="1" type="number" v-model="callbackRetry" style="width: 200px;">
            </el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item size="medium" class="large-label">
            <template #label>
              <span style="width: 200px;font-size: 16px;color: deepskyblue">代收通道匹配模式:</span>
            </template>
            <el-radio-group v-model="collectingPathChannelMatchMode">
              <el-radio :label="3">优先级</el-radio>
              <el-radio :label="6">随机</el-radio>
              <el-radio :label="9">平均</el-radio>
            </el-radio-group>
          </el-form-item>
          <div style="text-align: left">
            <SvgIcon name="notice"></SvgIcon>模式说明:
          </div>
          <div style="text-align: left">
            <div>
              1.按优先级是指按照系统设置的优先级从小到大顺序,符合条件的返回<br>
              2.按随机是指所有符合条件的渠道随机返回<br>
              3.按平均是指符合条件的渠道按平均返回
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div style="background-color: white; display: flex;justify-content: space-between;align-items: center;width: 96%;border-top: solid 2px gray;height: 30%;">
      <el-button type="danger" style="margin-left: 30%;width: 100px;height: auto" @click="reset"><SvgIcon name="reset" width="25px" height="22px"/>重置</el-button>
      <el-button type="success" style="margin-right: 30%;width: 100px;height: auto"><SvgIcon name="success" width="30px" height="22px"/>提交</el-button>
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