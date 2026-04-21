<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getTimeFromTimestamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">{{ $t('merchantStatement.title') }}</div>
  <!-- 工具栏 -->
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <div class="main-toolform-item">
            <div class="main-toolform-line" style="justify-content: right;">
              <el-button @click="reset('filterboxForm')" class="filterButton">
                <SvgIcon class="filterButtonSvg" name="reset"/>
                <div>{{ $t('common.reset') }}</div>
              </el-button>
              <el-button @click="search()" class="filterButton">
                <SvgIcon class="filterButtonSvg" name="search"/>
                <div>{{ $t('common.query') }}</div>
              </el-button>
              <el-button @click="exportStatements()" class="filterButton">
                <SvgIcon class="filterButtonSvg" name="export"/>
                <div>{{ $t('common.export') }}</div>
              </el-button>
            </div>
          </div>
          <div class="main-toolform-item merchant-statement-toolform-item">
<!--            <el-form
                ref="filterboxForm" class="form" :model="filterbox"
                style="width: 100%"
            >-->
              <el-row class="merchant-statement-filter-row">
                <el-col class="merchant-statement-col">
                  <el-form-item :label="$t('merchantStatement.filter.merchantName')" label-width="90px" prop="merchantAgentId">
                    <el-select
                        :options="merchantAccountOptions"
                        :props="merchantAccountProps"
                        v-model="filterbox.merchantAgentId"
                        class="merchant-statement-filter-input"
                        :clearable="roleName !== 'merchant'"
                        filterable
                        :disabled="roleName === 'merchant'"
                    ></el-select>
                  </el-form-item>
                </el-col>
                <el-col class="merchant-statement-col">
                  <el-form-item :label="$t('merchantStatement.filter.orderId')" label-width="90px" prop="id">
                    <el-input v-model="filterbox.id" class="merchant-statement-filter-input" clearable/>
                  </el-form-item>
                </el-col>
                <el-col class="merchant-statement-col">
                  <el-form-item :label="$t('merchantStatement.filter.transactionType')" label-width="90px" prop="orderType">
                    <el-select
                        v-model="filterbox.orderType"
                        class="merchant-statement-filter-input"
                        clearable
                    >
                      <el-option :label="$t('merchantStatement.transactionType.collectionCredit')" :value="11"></el-option>
                      <el-option :label="$t('merchantStatement.transactionType.payoutFreeze')" :value="21"></el-option>
                      <el-option :label="$t('merchantStatement.transactionType.payoutUnfreeze')" :value="22"></el-option>
                      <el-option :label="$t('merchantStatement.transactionType.payoutConfirmDebit')" :value="23"></el-option>
                      <el-option :label="$t('merchantStatement.transactionType.withdrawFreeze')" :value="31"></el-option>
                      <el-option :label="$t('merchantStatement.transactionType.withdrawUnfreeze')" :value="32"></el-option>
                      <el-option :label="$t('merchantStatement.transactionType.withdrawConfirmDebit')" :value="33"></el-option>
                      <el-option :label="$t('merchantStatement.transactionType.manualAdd')" :value="41"></el-option>
                      <el-option :label="$t('merchantStatement.transactionType.manualSubtract')" :value="42"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="merchant-statement-time-col">
                  <el-form-item :label="$t('merchantStatement.filter.time')" label-width="90px" prop="filterDateRange">
                    <DateTimeRangeSplit
                        v-model="filterbox.filterDateRange"
                        picker-type="date"
                        format="YYYY/MM/DD"
                        value-format="x"
                        :clearable="true"
                        picker-width="140px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
<!--            </el-form>-->
          </div>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div :class="['reportInfo', 'merchant-statement-report', { 'merchant-statement-report--empty': isEmpty } ]">
    <form :class="['main-views-form', 'merchant-statement-form', { 'merchant-statement-form--empty': isEmpty }]">
      <div class="merchant-statement-table-wrap">
      <el-table
          border :data="merchantStatementsFormData"
          class="merchantInfos-table"
          :style="{ width: '100%', height: isEmpty ? 'auto' : '100%' }"
      >
        <el-table-column
            :label="$t('merchantStatement.column.orderId')"
            v-slot="{row}"
            width="200px"
            align="center"
        >
          <div>{{ row.serialNo || row.id }}</div>
        </el-table-column>
        <el-table-column
            prop="商户名称"
            :label="$t('merchantStatement.column.merchantName')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.name}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionType"
            :label="$t('merchantStatement.column.transactionType')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{transactionTypeLabel(row.orderType)}}
          </div>
        </el-table-column>
        <el-table-column
            prop="status"
            :label="$t('merchantStatement.column.status')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{statusLabel(row.status)}}
          </div>
        </el-table-column>
<!--        <el-table-column
            prop="transactionStatus"
            label="交易状态"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.transactionStatus}}
          </div>
        </el-table-column>-->
        <el-table-column
            prop="transactionCurrencyType"
            :label="$t('merchantStatement.column.currency')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.currency}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionCashAmount"
            :label="$t('merchantStatement.column.amount')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.amount}}
          </div>
        </el-table-column>
        <el-table-column
            prop="beforeTransactionAccountBalance"
            :label="$t('merchantStatement.column.balanceBefore')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div style="width: 100%;">
            {{row.availableBalanceBefore}}
          </div>
        </el-table-column>
        <el-table-column
            prop="afterTransactionAccountBalance"
            :label="$t('merchantStatement.column.balanceAfter')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.availableBalanceAfter}}
          </div>
        </el-table-column>
        <el-table-column
            prop="transactionTime"
            :label="$t('merchantStatement.column.transactionTime')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{getTimeFromTimestamp(row.createTime)}}
          </div>
        </el-table-column>
        <el-table-column
            prop="requestIp"
            :label="$t('merchantStatement.column.requestIp')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.requestIp}}
          </div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantStatement.column.remark')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.remark}}
          </div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantStatement.column.operator')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.createBy}}
          </div>
        </el-table-column>
      </el-table>
      </div>
      <el-pagination class="pageTool merchant-statement-pagination"
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
      >
      </el-pagination>
    </form>
  </div>
</template>
<script>
import {ElPopconfirm} from "element-plus";
import 'element-plus/theme-chalk/el-popconfirm.css'
import {
  filterSearchMerchantStatement,
  getMerchantInfo,
  getWithdrawStatementeOrder
} from "@/api/interface/backendInterface.js";
import {getTodayStartTimestamp} from "@/api/common.js";
export default {
  name: 'MerchantStatement',
  components: {
    'el-popconfirm': ElPopconfirm
  },
  data() {
    return {
      activeTool: '1',
      filterbox: {
      },
      merchantAccountOptions: [],
      merchantAccountProps: {
        value: 'userId',
        label: 'merchantName'
      },
      filterForm: {

      },
      roleName: '',
      merchantStatementsFormData:[

      ],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10,20,50, 100, 200],
      totalCount: 1,

    }
  },
  computed: {
    isEmpty() {
      return !this.merchantStatementsFormData || this.merchantStatementsFormData.length === 0;
    }
  },
  methods: {
    transactionTypeLabel(type) {
      const typeMap = {
        11: 'collectionCredit',
        21: 'payoutFreeze',
        22: 'payoutUnfreeze',
        23: 'payoutConfirmDebit',
        31: 'withdrawFreeze',
        32: 'withdrawUnfreeze',
        33: 'withdrawConfirmDebit',
        41: 'manualAdd',
        42: 'manualSubtract'
      }
      const key = typeMap[String(type)]
      return key ? this.$t(`merchantStatement.transactionType.${key}`) : '-'
    },
    statusLabel(status) {
      if (status === 0 || status === '0') {
        return this.$t('merchantStatement.status.pendingApproval')
      }
      if (status === 1 || status === '1') {
        return this.$t('merchantStatement.status.success')
      }
      if (status === 2 || status === '2') {
        return this.$t('merchantStatement.status.failed')
      }
      if (status === 3 || status === '3') {
        return this.$t('merchantStatement.status.processing')
      }
      return '-'
    },
    handleConfirm() {

    },
    handleCancel() {

    },
    handleCurrentChange(val) {
        this.filterbox.pageNo = val;
        this.currentPage = val;
        this.filterbox.pageSize = this.pageSize;
        this.search()
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.filterbox.pageSize = this.pageSize;
      this.filterbox.pageNo = 1
      this.currentPage = 1
      this.search()
    },
    reset(form) {
      this.$refs[form].resetFields();
      this.filterbox.startTime = null
      this.filterbox.endTime = null
      if (this.roleName === 'merchant') {
        this.filterbox.merchantAgentId = localStorage.getItem('userId') || ''
      }
    },
    async search() {
      /*this.filterForm.orderNO = this.filterbox.orderNO;
      this.filterForm.selectedTransactionType = this.filterbox.transactionStatus;
      this.filterForm.transactionStatus = this.filterbox.transactionStatus;
      this.filterForm.merchantName = this.filterbox.merchantName;
      this.filterForm.createStartTime = this.filterbox.createStartTime;
      this.filterForm.createEndTime = this.filterbox.createEndTime;*/
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000 + 86399
      } else {
        this.filterbox.filterDateRange = [getTodayStartTimestamp()*1000,getTodayStartTimestamp()*1000],
        this.filterbox.startTime = getTodayStartTimestamp()
        this.filterbox.endTime = getTodayStartTimestamp() + 86399
      }
      this.filterbox.userRole = 2
      await getWithdrawStatementeOrder(this.filterbox).then(response => {
        this.merchantStatementsFormData = [];
        let result = JSON.parse(response.data.data);
        this.merchantStatementsFormData = result.accountStatementsDtoList;
        this.totalCount = result.totalNumber
        this.currentPage = result.pageNo;
        this.pageSize = result.pageSize;
      })
    }
  },
  mounted() {
    this.roleName = localStorage.getItem('roleName') || ''
    const currentUserId = localStorage.getItem('userId') || ''
    const currentUserName = localStorage.getItem('userName') || ''
    if (this.roleName === 'merchant') {
      this.filterbox.merchantAgentId = currentUserId
      this.merchantAccountOptions = [{
        userId: currentUserId,
        merchantName: currentUserName,
        accountName: currentUserName
      }]
      this.search()
      return
    }
    getMerchantInfo({pageSize: 1000}).then(response => {
      if (response.status === 200 && response.data.code === 0) {
         this.merchantAccountOptions = JSON.parse(response.data.data).merchantInfoDtoList;
         this.search()
      }
    })
  }

}
</script>
<style scoped>
@import "@/assets/base.css";
.main-toolform-line {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-right: 0;
}

.main-toolform-line input{
  width: 200px;
}

.merchant-statement-toolform-item{
  margin-right: 0;
}

.merchant-statement-filter-row{
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: flex-start;
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.merchant-statement-col{
  flex: 0 0 290px;
  max-width: 290px;
}

.merchant-statement-time-col{
  flex: 0 0 388px;
  max-width: 388px;
}

.merchant-statement-time-col :deep(.el-form-item){
  width: 388px;
  margin-left: 0;
}

.merchant-statement-filter-input{
  width: 200px !important;
  max-width: 200px;
}

:deep(.merchant-statement-filter-input.el-date-editor.el-range-editor){
  width: 200px !important;
  min-width: 200px !important;
}

.main-toolbar{
  overflow-x: hidden;
}

.merchant-statement-report{
  height: calc(100vh - 300px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.merchant-statement-form{
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.merchant-statement-table-wrap{
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.merchant-statement-pagination{
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.merchant-statement-report--empty{
  height: auto;
  overflow: visible;
}

.merchant-statement-form--empty{
  height: auto;
}

.merchant-statement-form--empty .merchant-statement-table-wrap{
  flex: 0 0 auto;
  min-height: 0;
}

.merchant-statement-form--empty .merchant-statement-pagination{
  margin-top: 12px;
}
</style>
