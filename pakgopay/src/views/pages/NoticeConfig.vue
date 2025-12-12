<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-views-container">
    <div class="main-title" style="width:95%;margin-left:0; border-radius: 0;margin-right: 0;padding-left:20px;padding-top:20px;">
      通知配置
    </div>

    <div class="main-views-form" style="background-color: white;height: 500px;margin-top: 0;width: 96%;display: flex;justify-content: center;">
      <el-form style="margin-top: 100px;height: 80%;">
        <div class="el-form-line">
          <el-form-item size="medium">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: deepskyblue">代付订单手动回调:</span>
            </template>
            <el-radio-group v-model="payingOrderManualCallback" style="width: 250px;">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item size="medium">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: deepskyblue">提现申请确认:</span>
            </template>
            <el-radio-group v-model="withDrawlOrdereManualConfirm" style="width: 250px;">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item size="medium">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: deepskyblue">商户余额通知:</span>
            </template>
            <el-radio-group v-model="merchantBalanceNotice" style="width: 250px;">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item size="medium">
            <template #label>
              <span style="width: 250px;font-size: 16px;color: deepskyblue">失败订单数通知:</span>
            </template>
            <el-radio-group v-model="failureOrderNumNotice" style="width: 250px;">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="background-color: white; display: flex;justify-content: space-between;align-items: center;width: 96%;border-top: solid 2px gray;height: 30%;">
      <el-button type="danger" style="margin-left: 30%;width: 100px;height: auto" @click="reset"><SvgIcon name="reset" width="25px" height="22px"/>重置</el-button>
      <el-button type="success" style="margin-right: 30%;width: 100px;height: auto" @click="submit"><SvgIcon name="success" width="30px" height="22px"/>提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payingOrderManualCallback: 2,
      withDrawlOrdereManualConfirm: 2,
      merchantBalanceNotice: 2,
      failureOrderNumNotice: 2,
    }
  },
  methods: {
    reset() {
      this.payingOrderManualCallback = 2;
      this.withDrawlOrdereManualConfirm = 2;
      this.merchantBalanceNotice = 2;
      this.failureOrderNumNotice = 2;
    },
    submit() {
      this.$notify({
        title: '成功',
        message: '提交成功!',
        type: 'success'
      });
    }
  }
}
</script>
<style scoped>

</style>