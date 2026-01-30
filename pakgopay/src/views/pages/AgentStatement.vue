<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
import {getTimeFromTimestamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">代理流水</div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">工具栏</span>
      </template>
      <!-- 工具栏 -->
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <div class="main-toolform-item">
            <div class="main-toolform-line" style="justify-content: right;margin-right: 4%;">
              <el-button @click="reset('filterboxForm')" class="filterButton">
                <SvgIcon class="filterButtonSvg" name="reset"/>
                <div>重置</div>
              </el-button>
              <el-button @click="search()" class="filterButton">
                <SvgIcon class="filterButtonSvg" name="search"/>
                <div>查询</div>
              </el-button>
              <el-button @click="exportStatements()" class="filterButton">
                <SvgIcon class="filterButtonSvg" name="export"/>
                <div>导出</div>
              </el-button>
            </div>
          </div>
          <div class="main-toolform-item" style="margin-right: 3%;">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="代理名称:" label-width="150px" prop="merchantAgentId">
                    <el-select
                        :options="agentOptions"
                        :props="agentProps"
                        v-model="filterbox.merchantAgentId"
                        style="width: 200px"
                        clearable
                        filterable
                    ></el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="交易订单号:" label-width="150px" prop="id">
                    <el-input v-model="filterbox.id" style="width: 200px" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="交易类型:" label-width="150px" prop="orderType">
                    <el-select
                        v-model="filterbox.orderType"
                        style="width: 200px"
                        clearable
                    >
                      <el-option label="充值" :value="1"></el-option>
                      <el-option label="提现" :value="2"></el-option>
                      <el-option label="手工调账" :value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="时间:" label-width="150px" prop="filterDateRange">
                    <el-date-picker
                        v-model="filterbox.filterDateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="YYYY/MM/DD"
                        value-format="x"
                        clearable
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
          </div>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="reportInfo">
    <form class="main-views-form">
      <el-table
        border :data="agentStatementsFormData"
        class="merchantInfos-table"
        style="width: 100%; height: auto"
      >
        <el-table-column
          label="交易订单号"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{row.id}}
          </div>
        </el-table-column>
        <el-table-column
          prop="agentName"
          label="代理名称"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{row.name}}
          </div>
        </el-table-column>
        <el-table-column
          prop="transactionType"
          label="交易类型"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{transactionType[row.orderType]}}
          </div>
        </el-table-column>
        <el-table-column
          prop="transactionCurrencyType"
          label="交易币种"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{row.currency}}
          </div>
        </el-table-column>
        <el-table-column
          prop="transactionCashAmount"
          label="交易金额"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{row.amount}}
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
            {{row.totalBalanceBefore}}
          </div>
        </el-table-column>
        <el-table-column
            prop="afterTransactionAccountBalance"
            label="交易后账户余额"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.totalBalanceAfter}}
          </div>
        </el-table-column>
        <el-table-column
          prop="transactionTime"
          label="交易时间"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{getTimeFromTimestamp(row.createTime)}}
          </div>
        </el-table-column>
        <el-table-column
          label="备注"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{row.remark}}
          </div>
        </el-table-column>
        <el-table-column
          label="操作人"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{row.createBy}}
          </div>
        </el-table-column>
      </el-table>
      <el-pagination class="pageTool"
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
import {getAgentInfo, getWithdrawStatementeOrder} from "@/api/interface/backendInterface.js";
import {getTodayStartTimestamp} from "@/api/common.js";

export default {
  name: "AgentStatement",
  data() {
    return {
      transactionType: {
        '1': '充值',
        '2': '提现',
        '3': '调账'
      },
      activeTool: '1',
      filterbox: {},
      agentOptions: [],
      agentProps: {
        value: "userId",
        label: "agentName"
      },
      filterForm: {},
      agentStatementsFormData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 50],
      totalCount: 0
    };
  },
  methods: {
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
    },
    search() {
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
      getWithdrawStatementeOrder(this.filterbox).then(response => {
        this.agentStatementsFormData = [];
        let result = JSON.parse(response.data.data);
        this.agentStatementsFormData = result.accountStatementsDtoList;
        this.totalCount = result.totalNumber
        this.currentPage = result.pageNo;
        this.pageSize = result.pageSize;
      })
    },
    exportStatements() {}
  },
  mounted() {
    getAgentInfo({ pageSize: 1000 }).then(response => {
      if (response.status === 200 && response.data.code === 0) {
        this.agentOptions = JSON.parse(response.data.data).agentInfoDtoList || [];
        this.search()
      }
    })
  }
}
</script>

<style scoped>
@import "@/assets/base.css";

.main-toolform-line {
  margin-right: 3%;
}

.main-toolform-line input{
  width: 200px;
}
</style>
