<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">商户流水</div>
  <!-- 工具栏 -->
  <div class="main-toolbar">
    <form class="main-toolform">
      <div class="main-toolform-item">
        <div class="main-toolform-line" style="justify-content: right;margin-right: 4%;">
          <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="reset"/>
            <div style="width: 50px;color: white">重置</div>
          </div>
          <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="search"/>
            <div style="width: 50px;color: white">查询</div>
          </div>
          <div v-on:click="exportStatements()" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="export"/>
            <div style="width: 50px;color: white">导出</div>
          </div>
        </div>
      </div>
      <div class="main-toolform-item">
        <div class="main-toolform-line">交易订单号：<input v-model="filterbox.orderNO"  type="text" class="main-toolform-input" placeholder="交易订单 号"/></div>
        <div class="main-toolform-line">交易类型：
              <el-select v-model="filterbox.selectedTransactionType" placeholder="请选择交易类型" style="width: 150px">
                <el-option v-for="item in filterbox.transactionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
        </div>
        <div class="main-toolform-line">
          订单状态：
          <el-select v-model="filterbox.transactionStatus" placeholder="请选择订单状态" style="width: 150px">
            <el-option v-for="item in filterbox.transactionStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="main-toolform-line">商户名称：<input v-model="filterbox.merchantName"  type="text" class="main-toolform-input" placeholder="商户名称"/></div>
        <div class="main-toolform-line">
          创建时间：
          <input v-model="filterbox.createStartTime" style="width: 150px"  type="date" class="main-toolform-input" placeholder="开始时间"/>
          ～
          <input v-model="filterbox.createEndTime"  style="width: 150px"  type="date" class="main-toolform-input" placeholder="截止时间"/>
        </div>
      </div>
    </form>
  </div>

  <div class="main-views-container">
    <form class="main-views-form">
      <el-table
          border :data="merchantStatementsFormData"
          class="merchantInfos-table"
          style="width: 97%"
          height="500px"
      >
        <el-table-column
            label="交易订单号"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.orderNO}}
          </div>
        </el-table-column>
        <el-table-column
            prop="商户名称"
            label="商户名称"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.merchantName}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionType"
            label="交易类型"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.transactionType}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionStatus"
            label="交易状态"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.transactionStatus}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionCurrencyType"
            label="交易币种"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.transactionCurrencyType}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionCashAmount"
            label="交易金额"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.transactionCashAmount}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionCommission"
            label="手续费"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.transactionCommission}}
          </div>
        </el-table-column>
        <el-table-column
            prop="beforeTransactionAccountBalance"
            label="交易前账户金额"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div style="width: 100%;">
            {{row.beforeTransactionAccountBalance}}
          </div>
        </el-table-column>
        <el-table-column
            prop="afterTransactionAccountBalance"
            label="交易后账户余额"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.afterTransactionAccountBalance}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionTime"
            label="交易时间"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.transactionTime}}
          </div>
        </el-table-column>
        <el-table-column
            label="交易原因"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.transactionReason}}
          </div>
        </el-table-column>
        <el-table-column
            label="操作人"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.operator}}
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          @current-change="handleCurrentChange"
          style="float:right; margin-right: 5%;"
      >
      </el-pagination>
    </form>
  </div>
</template>
<script>
import {ElPopconfirm} from "element-plus";
import 'element-plus/theme-chalk/el-popconfirm.css'
import {filterSearchMerchantStatement} from "@/api/interface/backendInterface.js";
export default {
  name: 'MerchantStatement',
  components: {
    'el-popconfirm': ElPopconfirm
  },
  data() {
    return {
      filterbox: {
        transactionStatus: '',
        orderNO: '',
        transactionType: '',
        merchantName: '',
        createStartTime: '',
        createEndTime: '',
        selectedTransactionType: '',
        transactionTypeOptions: [
            {
              value: '001',
              label: '代付'
            },
          {
            value: '002',
            label: '代收'
          },
          {
            value: '003',
            label: '提现'
          },
          {
            value: '004',
            label: '充值'
          },
          {
            value: '005',
            label: '手工调账'
          }
        ],
        transactionStatusOptions: [
          {
            value: '001',
            label: '处理中'
          },
          {
            value: '002',
            label: '成功'
          },
          {
            value: '003',
            label: '失败'
          },
        ],
      },
      filterForm: {
        orderNO: '',
        selectedTransactionType: '',
        transactionStatus: '',
        merchantName: '',
        createStartTime: '',
        createEndTime: '',
      },
      merchantStatementsFormData:[
        /*{
          orderNO: '',
          merchantName: '',
          transactionType: '',
          transactionStatus: '',
          transactionCurrencyType: '',
          transactionCashAmount: '',
          transactionCommission: '',
          beforeTransactionAccountBalance: '',
          afterTransactionAccountBalance: '',
          transactionTime: '',
          transactionReason: '',
          operator: '',
        }*/
      ],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [1,10,20,30,50],
      totalCount: 1,

    }
  },
  methods: {
    handleConfirm() {

    },
    handleCancel() {

    },
    handleCurrentChange(val) {

    },
    reset() {
      this.filterbox = {

      }
    },
    async search() {
      this.filterForm.orderNO = this.filterbox.orderNO;
      this.filterForm.selectedTransactionType = this.filterbox.transactionStatus;
      this.filterForm.transactionStatus = this.filterbox.transactionStatus;
      this.filterForm.merchantName = this.filterbox.merchantName;
      this.filterForm.createStartTime = this.filterbox.createStartTime;
      this.filterForm.createEndTime = this.filterbox.createEndTime;
      await filterSearchMerchantStatement(this.filterForm).then(response => {
        this.merchantStatementsFormData = [];
        let result = JSON.parse(response.data.data);
        this.merchantStatementsFormData = result;
        this.totalCount = this.merchantStatementsFormData.length;
        alert(this.totalCount)
        this.currentPage = 1;
        this.pageSize = 1;
      })
    }
  },

}
</script>
<style scoped>
.main-toolform-line {
  margin-right: 3%;
}

.main-toolform-line input{
  width: 200px;
}
</style>