<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-views-container" style="overflow:auto;height: 100%;">
    <div class="main-title" style="width:95%;margin-left:0; border-radius: 0;margin-right: 0;padding-left:20px;padding-top:20px;">
      风控配置
    </div>

    <div class="main-views-form" style="background-color: white;height: 500px;margin-top: 0;width: 96%;display: flex;justify-content: center;">
      <el-form style="margin-top: 100px;height: 80%;">
        <div class="el-form-line">
          <el-form-item size="medium">
            <template #label>
              <div style="width: 250px;font-size: 16px;color: deepskyblue;">单笔订单请求次数(/min):</div>
            </template>
            <el-input :min="1" :step="1" class="center-input" type="number" v-model="merchantEachOrderTimes" style="width: 400px">
            </el-input>
          </el-form-item>
          <el-form-item size="medium" style="height: 300px;margin-top: 50px;">
            <template #label>
                <div style="width: 250px;font-size: 16px;color: deepskyblue;">固定IP QPS:</div>
            </template>
            <el-input type="textarea" :autosize="{minRows: 1, maxRows:100}" v-model="qpsForIP" placeholder="格式：IP:QPS 多个用'，'隔开" style="min-height: 300px !important; max-height: 400px;width: 400px;"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="background-color: white; display: flex;justify-content: space-between;align-items: center;width: 96%;border-top: solid 2px gray;height: 10%;">
      <el-button type="danger" style="margin-left: 30%;width: 100px;height: auto" @click="reset"><SvgIcon name="reset" width="25px" height="22px"/>重置</el-button>
      <el-button type="success" style="margin-right: 30%;width: 100px;height: auto" @click="submit"><SvgIcon name="success" width="30px" height="22px"/>提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ScasConfig',
  data() {
    return {
      merchantEachOrderTimes: '',
      qpsForIP: '',
    }
  }
}
</script>
<style scoped>

</style>