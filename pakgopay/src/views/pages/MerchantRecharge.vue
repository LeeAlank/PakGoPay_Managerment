<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-container" style="height: 100%">
    <div class="main-title">{{$t('route.merchantRecharge')}}</div>

    <el-collapse style="margin-top: 20px; width: 95%;margin-left: 1%;">
      <el-collapse-item>
        <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
        </template>
        <div class="main-toolbar" style="height: auto;flex-direction: column;position: relative;">
          <el-form
              prop="merchantName"
              style="width: 90%;height:auto;display: flex;align-items: center;"
          >
            <el-row style="width: 90%;">
              <el-col :span="8" style="display: flex;justify-content: center;align-items: center;">
                <el-form-item :label="$t('merchantRecharge.filter.merchantName')" style="height: 30px;"><el-input :placeholder="$t('merchantRecharge.placeholder.merchantName')" v-model="filterbox.merchantName" style="width: 200px;display: flex;text-align: center"/></el-form-item>
              </el-col>
              <el-col :span="16" style="display: flex;justify-content: center;align-items: center;">
                <el-form-item style="height: 30px;">
                  <template #label>
                    <span>{{ $t('common.timeRange') }}</span>
                  </template>
                  <el-date-picker
                      v-model="filterbox.timeRage"
                      type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :placeholder="$t('merchantRecharge.placeholder.dateTime')"
                      style="width: 400px"
                  >
                  </el-date-picker>
                  <el-button style="width: 80px;display: flex;align-items: center;background-color: deepskyblue;color: black"><SvgIcon name="search" style="width: 20px;height: 20px"/>{{ $t('common.query') }}</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>


    <div class="main-views-container" style="margin-top: 3%;height: 70%;width:95%;margin-left: 1%;">
      <div style="display: flex;position: relative;float: right">
        <el-button style="background-color: mediumseagreen" @click="rechargeAccount">
          <SvgIcon name="withdrawl"/>{{ $t('merchantRecharge.action.recharge') }}
        </el-button>
      </div>
      <el-table
          :data="merchantRechargeInfo"
          style="height: auto;width: 100%"
          border
      >
        <el-table-column
            :label="$t('merchantRecharge.column.merchantName')"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.merchantName}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantRecharge.column.rechargeAmount')"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.rechargeAmount}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantRecharge.column.beforeBalance')"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.beforeBalance}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantRecharge.column.afterBalance')"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.afterBalance}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantRecharge.column.rechargeTime')"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.rechargeTime}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantRecharge.column.operator')"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.operator}}</div>
        </el-table-column>
      </el-table>
      <el-pagination class="pageTool"
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
         
          @current-change="handleChange"
          @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>

  <el-dialog
      :title="dialogTitle"
      v-model="dialogFormVisible"
      class="dialog"
      center="true"
      width="40%"
      style="height: 400px;"
      @closed="cancelDialog"
  >
    <el-form style="margin-top: 50px;" :model="rechargeAccountInfo" :rules="rules" ref="rechargeAccountInfo">
      <div class="el-form-line">
        <el-row style="display: flex;justify-content: center;">
          <el-col :span="24" style="display: flex;justify-content: center;">
            <el-form-item :label="$t('merchantRecharge.form.merchantName')" label-width="150px"  prop="merchantName">
              <el-autocomplete
                  v-model="rechargeAccountInfo.merchantName"
                  :placeholder="$t('merchantRecharge.placeholder.merchantName')"
                  :fetch-suggestions="getOperators"
                  @select="handleSelect"
                  style="width: 200px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex;justify-content: center;">
          <el-col :span="24" style="display: flex;justify-content: center;">
            <el-form-item :label="$t('merchantRecharge.form.rechargeAmount')" label-width="150px"  prop="rechargeAmount">
              <el-input type="number" v-model="rechargeAccountInfo.rechargeAmount" :placeholder="$t('merchantRecharge.placeholder.rechargeAmount')" style="width: 200px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex;justify-content: center;">
          <el-col :span="24" style="display: flex;justify-content: center;">
            <el-form-item :label="$t('common.googleCode')" label-width="150px"  prop="googleCode">
              <el-input oninput="if(value.length>6)value=value.slice(0,6)" type="number" v-model="rechargeAccountInfo.googleCode" :placeholder="$t('common.placeholder.googleCode')" style="width: 200px"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submit('rechargeAccountInfo')">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>


<script>
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const MERCHANT_RECHARGE_DRAFT_KEY = 'draft:MerchantRecharge:form';
const buildEmptyRechargeAccountInfo = () => ({
  merchantName: '',
  merchantAccount: '',
  rechargeAmount: '',
  googleCode: ''
});

export default {
  data() {
    return {
      filterbox: {
      },
      rechargeAccountInfo: buildEmptyRechargeAccountInfo(),
      merchantInfos:[],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10,50,100,200],
      dialogTitle: "",
      dialogFormVisible: false,
      rules: {
        merchantName: [
          {required: true, message: this.$t('merchantRecharge.validation.merchantRequired'), trigger: 'blur' },
        ],
        rechargeAmount: [
            {required: true, message: this.$t('merchantRecharge.validation.amountRequired'), trigger: 'blur' },
        ],
        googleCode: [
            {required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' },
        ]
      }
    }
  },
  watch: {
    dialogFormVisible(visible) {
      if (visible) {
        this.loadRechargeDraft();
      }
    },
    rechargeAccountInfo: {
      deep: true,
      handler() {
        this.saveRechargeDraft();
      }
    }
  },
  mounted() {
    const merchantInfos = [
      {
        value: this.$t('merchantRecharge.merchant.sample1'),
        merchantAccount: '123123'
      },
      {
        value: this.$t('merchantRecharge.merchant.sample2'),
        merchantAccount: '121212'
      }
    ]
    this.merchantInfos = merchantInfos
  },
  methods: {
    saveRechargeDraft() {
      if (!this.dialogFormVisible) return;
      saveDraft(MERCHANT_RECHARGE_DRAFT_KEY, { data: this.rechargeAccountInfo || {} });
    },
    loadRechargeDraft() {
      const draft = loadDraft(MERCHANT_RECHARGE_DRAFT_KEY);
      if (!draft || !draft.data) return;
      this.rechargeAccountInfo = Object.assign(buildEmptyRechargeAccountInfo(), draft.data || {});
    },
    clearRechargeDraft() {
      clearDraft(MERCHANT_RECHARGE_DRAFT_KEY);
    },
    handleSizeChange(val) {

    },
    handleChange(val) {

    },
    rechargeAccount() {
      this.dialogTitle = this.$t('merchantRecharge.dialog.title')
      this.dialogFormVisible = true
      this.loadRechargeDraft()
    },
    getOperators(queryString, cb) {
      /**
       *  调用后端接口获取商户信息
       * */
      const merchantInfos = this.merchantInfos
      const result = queryString ? merchantInfos.filter(this.createNameFilter(queryString)) : merchantInfos
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(result)
      }, 3000)
    },
    createNameFilter(queryString) {
      return (operatorName) => {
        return (operatorName.value.toLowerCase().indexOf(queryString.toLowerCase())>=0)
      }
    },
    handleSelect() {

    },
    cancelDialog() {
      this.dialogTitle=''
      this.dialogFormVisible = false
      this.rechargeAccountInfo = buildEmptyRechargeAccountInfo()
      this.clearRechargeDraft()
    },
    submit(rechargeAccountInfo) {
      /*if(this.rechargeAccountInfo.googleCode.length < 6){
        this.$notify({
          title: '错误',
          message: 'please check your typed info',
          type: 'error',
          position: 'bottom-right'
        });
        return false;
      }*/
      this.$refs[rechargeAccountInfo].validate((valid) => {
        if (valid) {
          this.clearRechargeDraft()
          this.rechargeAccountInfo = buildEmptyRechargeAccountInfo()
        } else {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('merchantRecharge.message.checkForm'),
            type: 'error',
            position: 'bottom-right'
          });
          return false;
        }
      });
    }
  }
}
</script>
<style>
.dialog-footer {
  position: absolute;
  bottom: 2%;
  right: 0;
  margin-right: 3%
}
</style>
<style scoped>
@import "@/api/common.css";
@import "@/assets/base.css";
:deep().el-input__inner {
  text-align: center;
}
</style>
