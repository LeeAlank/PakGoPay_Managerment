<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-container" style="height: 100%">
    <div class="main-title">{{$t('route.merchantRecharge')}}</div>
    <div class="main-toolbar" style="height: 100px;flex-direction: column;position: relative;">
      <el-form
          prop="merchantName"
          style="width: 100%;height:100%;display: flex;align-items: center;"
      >
        <el-row style="width: 90%;display: flex;margin-left: 5%;height: 100px;justify-items: center;">
          <el-col :span="8" style="display: flex;justify-content: center;align-items: center;">
            <el-form-item label="商户名称:" style="height: 30px;"><el-input placeholder="商户名称" v-model="filterbox.merchantName" style="width: 200px;display: flex;text-align: center"/></el-form-item>
          </el-col>
          <el-col :span="8" style="display: flex;justify-content: center;align-items: center;">
            <el-form-item label="开始时间:" style="height: 30px;"><el-input type="date" placeholder="开始时间" v-model="filterbox.startTime" style="width: 200px"/></el-form-item>
          </el-col>
          <el-col :span="8" style="display: flex;justify-content: center;align-items: center;">
            <el-form-item label="截止时间:" style="height: 30px;"><el-input type="date" placeholder="截止时间" v-model="filterbox.endTime" style="width: 280px;display: flex;">
              <template #append>
                <el-button style="width: 80px;display: flex;align-items: center;background-color: deepskyblue;color: black"><SvgIcon name="search" style="width: 20px;height: 20px"/>查询</el-button>
              </template>
            </el-input></el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="main-views-container" style="margin-top: 3%;height: 90%;width:93%;overflow: auto;">
      <div style="display: flex;position: relative;float: right">
        <el-button style="background-color: mediumseagreen" @click="rechargeAccount">
          <SvgIcon name="withdrawl"/>充值
        </el-button>
      </div>
      <el-table
          :data="merchantRechargeInfo"
          style="height: 90%;width: 100%"
          border
      >
        <el-table-column
            label="商户名称"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.merchantName}}</div>
        </el-table-column>
        <el-table-column
            label="充值金额"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.rechargeAmount}}</div>
        </el-table-column>
        <el-table-column
            label="充值前余额"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.beforeBalance}}</div>
        </el-table-column>
        <el-table-column
            label="充值后余额"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.afterBalance}}</div>
        </el-table-column>
        <el-table-column
            label="充值时间"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.rechargeTime}}</div>
        </el-table-column>
        <el-table-column
            label="操作员"
            align="center"
            v-slot="{row}"
        >
          <div>{{row.operator}}</div>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          style="position: relative;bottom: 0;float: right;margin-right: 3%"
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
            <el-form-item label="充值商户:" label-width="150px" size="medium" prop="merchantName">
              <el-autocomplete
                  v-model="rechargeAccountInfo.merchantName"
                  placeholder="输入商户名称"
                  :fetch-suggestions="getOperators"
                  @select="handleSelect"
                  style="width: 200px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex;justify-content: center;">
          <el-col :span="24" style="display: flex;justify-content: center;">
            <el-form-item label="充值金额:" label-width="150px" size="medium" prop="rechargeAmount">
              <el-input type="number" v-model="rechargeAccountInfo.rechargeAmount" placeholder="input recharge amount" style="width: 200px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex;justify-content: center;">
          <el-col :span="24" style="display: flex;justify-content: center;">
            <el-form-item label="谷歌验证码:" label-width="150px" size="medium" prop="googleCode">
              <el-input oninput="if(value.length>6)value=value.slice(0,6)" type="number" v-model="rechargeAccountInfo.googleCode" placeholder="input google verify code" style="width: 200px"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="submit('rechargeAccountInfo')">确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
export default {
  data() {
    return {
      filterbox: {
      },
      rechargeAccountInfo: {

      },
      merchantInfos:[],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10,50,100,200],
      dialogTitle: "",
      dialogFormVisible: false,
      rules: {
        merchantName: [
          {required: true, message: ' please input merchantName', trigger: 'blur' },
        ],
        rechargeAmount: [
            {required: true, message: ' please input recharge amount', trigger: 'blur' },
        ],
        googleCode: [
            {required: true, message: ' please input google verify code', trigger: 'blur' },
        ]
      }
    }
  },
  mounted() {
    const merchantInfos = [
      {
        value: '商户一',
        merchantAccount: '123123'
      },
      {
        value: '商户二',
        merchantAccount: '121212'
      }
    ]
    this.merchantInfos = merchantInfos
  },
  methods: {
    handleSizeChange(val) {

    },
    handleChange(val) {

    },
    rechargeAccount() {
      this.dialogTitle="充值"
      this.dialogFormVisible = true
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
      this.rechargeAccountInfo = {}
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

        } else {
          this.$notify({
            title: '错误',
            message: 'please check your typed info',
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
/deep/.el-input__inner {
  text-align: center;
}
</style>