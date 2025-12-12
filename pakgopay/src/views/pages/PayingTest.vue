<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">
    代付测试
  </div>

  <div class="main-views-container" style="background-color: white;height: 80%;margin-right: 5%;">
    <div class="main-views-form" style="display: flex;justify-content: center;padding-top: 5%;height: 500px;margin-right:10%;">
      <el-form style="height: 100%">
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <template #label>
                <span class="form-label"><SvgIcon name="must"/>选择商户:</span>
              </template>
              <el-select v-model="apiTestInfo.selectedMerchant" placeholder="请选择商户">
                <el-option
                    v-for="item in merchantInfos"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <template #label>
                <span class="form-label"><SvgIcon name="must"/>选择币种:</span>
              </template>
              <el-select v-model="apiTestInfo.currencyType" placeholder="请选择币种">
                <el-option
                    v-for="item in currencyTypeInfos"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <template #label>
                <span class="form-label"><SvgIcon name="must"/>选择银行:</span>
              </template>
              <el-select v-model="apiTestInfo.bankType" placeholder="请选择银行">
                <el-option
                    v-for="item in bankTypeInfos"
                    :value="item.value"
                    :key="item.value"
                    :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col>
              <el-form-item>
                <template #label>
                  <span class="form-label"><SvgIcon name="must"/>代付金额:</span>
                </template>
                <el-input v-model="apiTestInfo.collectingAmount" type="number" min="1" style="width: 300px;"/>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col>
              <el-form-item>
                <template #label>
                  <span class="form-label"><SvgIcon name="must"/>银行卡号/支付平台账号:</span>
                </template>
                <el-input v-model="apiTestInfo.payAccount" type="text" min="1" style="width: 300px;" placeholder="请输入付款人姓名"/>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col>
              <el-form-item>
                <template #label>
                  <span class="form-label"><SvgIcon name="must"/>银行卡户名/支付平台真实姓名:</span>
                </template>
                <el-input v-model="apiTestInfo.payRealName" type="text" min="1" style="width: 300px;" placeholder="请输入付款人姓名"/>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col>
              <el-form-item>
                <template #label>
                  <span class="form-label">下单IP:</span>
                </template>
                <el-input v-model="apiTestInfo.requestIP" type="text" min="1" style="width: 300px;" placeholder="请输入下单IP"/>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col>
              <el-form-item>
                <template #label>
                  <span class="form-label">回调地址:</span>
                </template>
                <el-input v-model="apiTestInfo.callbackURL" type="text" min="1" style="width: 300px;" placeholder="请输入回调地址">
                  <template #prefix>https://</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="background-color: white; display: flex;justify-content: space-between;align-items: center;width: 100%;border-top: solid 2px gray;height: 100px;">
      <el-button type="danger" style="margin-left: 30%;width: 100px;height: auto" @click="reset"><SvgIcon name="reset" width="25px" height="22px"/>重置</el-button>
      <el-button type="success" style="margin-right: 30%;width: 100px;height: auto"><SvgIcon name="success" width="30px" height="22px"/>提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiTestInfo: {
        selectedMerchant: "",
        selectedPathChannel: "",
        payerName: "",
        payerId: "",
        responseType: '',
        callbackURL: "",
        requestIP: "",
        collectingAmount: '',
        payAccount: "",
        payRealName: "",
        bankType: "",
      },
      merchantInfos: [],
      currencyTypeInfos: [],
      bankTypeInfos: [],
    }
  },
  methods: {
    reset() {
      this.apiTestInfo = {}
    },
    submit(){

    }
  },
  mounted() {
    //加载商户信息/通道信息
    this.merchantInfos = [{
      value: '001',
      label: '商户一'
    },
      {
        value: '002',
        label: '商户二'
      }],
        this.pathChannelInfos = [{
          value: '001',
          label: 'weChat'
        },
          {
            value: '002',
            label: 'aliPay'
          }],
        this.apiTestInfo.responseType = 2
  }
}
</script>
<style scoped>
.form-label {
  color: deepskyblue;
  font-size: larger;
  width: 400px;
}
</style>