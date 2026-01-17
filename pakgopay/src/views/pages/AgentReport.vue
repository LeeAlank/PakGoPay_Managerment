<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">代理报表</div>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
    <el-form-item style="margin-left: 2%;">
      <template #label>
          <span style="color: black;font-size: small;align-items: center;">
            统计币种:
          </span>
      </template>
      <el-select
          style="width: 100px;align-items: center;text-align: center;"
          :options="currencyOptions"
          :props="currencyProps"
          default-first-option
          v-model="filterbox.currency"
          @change="handleCurrencyChange"
          filterable
      />
    </el-form-item>
  </div>

  <div class="statistics-container" style="justify-content: space-around">
    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.collectionCard">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;justify-items: right">
          <span style="text-align: left;font-size: x-large">代收总金额:</span>
          <textarea v-model="statisticsInfo.collectionAgentAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.payingCard">
      <div class="statistics-form-item">
        <SvgIcon name="paying" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">代付总金额:</span>
          <textarea v-model="statisticsInfo.payingAgentAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>

  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 1%;margin-right: 3%;">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏&统计数据
        </span>
      </template>
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterForm" :model="filterbox">
          <el-row style="display: flex;justify-content: center;align-items: center;">
            <el-col :span="8">
              <el-form-item label="代理:" label-width="150px" prop="agentId">
                <el-select
                    :options="agentOptions"
                    :props="agentProps"
                    placeholder="请选择代理"
                    v-model="filterbox.agentId"
                    style="width: 250px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间范围:" label-width="150px" prop="filterDateRange">
                <div style="display: flex; flex-direction: row;">
                  <el-date-picker
                      v-model="filterbox.filterDateRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="YYYY/MM/DD"
                      value-format="x"
                  >
                  </el-date-picker>
                  <el-button @click="reset('filterForm')">
                    <SvgIcon height="20px" width="20px" name="reset"/>
                    <div style="color: black">重置</div>
                  </el-button>
                  <el-button type="primary" @click="search()" style="margin:0">
                    <SvgIcon height="20px" width="20px" name="search"/>
                    <div style="color: black">查询</div>
                  </el-button>
                </div>

              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>


  <div class="reportInfo" style="margin-left: 1%;margin-right: 3%;margin-top: 1%;width: 95%;">
    <el-button @click="exportAgentInfo" style="margin:0;float: right">
      <SvgIcon height="20px" width="20px" name="export"/>
      <div style="color: black">导出</div>
    </el-button>
    <el-tabs type="border-card" style="width: 100%;" @tab-click="handleTabClick" v-model="activeTabPane">
      <el-tab-pane label="代收报表">
        <el-form style="width: 100%;">
          <el-table
              border
              :data="collectionAgentReportInfo"
              class="reportInfo-table1"
              style="width: 100%"
              height="auto"
          >
            <el-table-column
                label="代理名称"
                v-slot="{row}"
                align="center"
                prop="agentName"
            >
              <div>{{ row.agentName }}</div>
            </el-table-column>
            <el-table-column
                label="时间"
                v-slot="{row}"
                align="center"
                prop="recordDate"
            >
              <div>{{ row.recordDate }}</div>
            </el-table-column>
            <el-table-column
                label="代收订单总数"
                v-slot="{row}"
                align="center"
                prop="orderQuantity"
            >
              <div>{{ row.orderQuantity }}</div>
            </el-table-column>
            <el-table-column
                label="代收订单成功数"
                v-slot="{row}"
                align="center"
                prop="successQuantity"
            >
              <div>{{ row.successQuantity }}</div>
            </el-table-column>
            <el-table-column
                label="代收订单失败数"
                v-slot="{row}"
                align="center"
                prop="failureQuantity"
            >
              <div>{{ row.orderQuantity-row.successQuantity }}</div>
            </el-table-column>
            <el-table-column
                label="成功率"
                v-slot="{row}"
                align="center"
                prop="successRate"
            >
              <div>{{ ((row.successQuantity/row.orderQuantity)*100).toFixed(2) }}%</div>
            </el-table-column>
            <el-table-column
                label="代收订单佣金"
                v-slot="{row}"
                align="center"
                prop="commission"
            >
              <div>{{ row.commission }}</div>
            </el-table-column>
          </el-table>
          <el-pagination
              background
              layout="sizes, prev, pager, next, jumper, total"
              :total="tab1TotalCount"
              v-model:current-page="tab1CurrentPage"
              v-model:page-size="tab1PageSize"
              :page-sizes="pageSizes"
              @current-change="handleTab1CurrentChange"
              @size-change="handleTab1SizeChange"
              style="float:right; margin-right: 5%;"
          >
          </el-pagination>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="代付报表">
        <el-form style="width: 100%;">
          <el-table
              border
              :data="payingAgentReportInfo"
              class="reportInfo-table2"
              style="width: 100%"
              height="auto"
          >
            <el-table-column
                label="代理名称"
                v-slot="{row}"
                align="center"
                prop="agentName"
            >
              <div>{{ row.agentName }}</div>
            </el-table-column>
            <el-table-column
                label="时间"
                v-slot="{row}"
                align="center"
                prop="recordTime"
            >
              <div>{{ row.recordDate }}</div>
            </el-table-column>
            <el-table-column
                label="代付订单总数"
                v-slot="{row}"
                align="center"
                prop="orderQuantity"
            >
              <div>{{ row.orderQuantity }}</div>
            </el-table-column>
            <el-table-column
                label="代付成功订单数"
                v-slot="{row}"
                align="center"
                prop="successQuantity"
            >
              <div>{{ row.successQuantity }}</div>
            </el-table-column>
            <el-table-column
                label="代订失败订单数"
                v-slot="{row}"
                align="center"
                prop="failureQuantity"
            >
              <div>{{ row.orderQuantity-row.successQuantity }}</div>
            </el-table-column>
            <el-table-column
                label="代付成功率"
                v-slot="{row}"
                align="center"
                prop="successRate"
            >
              <div>{{ ((row.successQuantity/row.orderQuantity)*100).toFixed(2) }}%</div>
            </el-table-column>
            <el-table-column
                label="代付订单佣金"
                v-slot="{row}"
                align="center"
                prop="commission"
            >
              <div>{{ row.commission }}</div>
            </el-table-column>

          </el-table>
          <el-pagination
              background
              layout="sizes, prev, pager, next, jumper, total"
              :total="tab2TotalCount"
              v-model:current-page="tab2CurrentPage"
              v-model:page-size="tab2PageSize"
              :page-sizes="pageSizes"
              @current-change="handleTab2CurrentChange"
              @size-change="handleTab2SizeChange"
              style="float:right; margin-right: 5%;"
          >
          </el-pagination>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {ref} from "vue";
import {exportAgentReport, getAgentInfo, getAgentReport, getAllCurrencyType} from "@/api/interface/backendInterface.js";
import {exportExcel, getAgentReportTitle, getFormateTime, getTodayStartTimestamp, loadingBody} from "@/api/common.js";

const filterTimeRange = ref('')
export default {
  data() {
    return {
      agentOptions: [],
      agentProps: {
        value: 'agentAccount',
        label: 'agentName'
      },
      timeRange: [],
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      statisticsInfo: {},
      collectionAgentReportInfo: [],
      payingAgentReportInfo: [],
      activeTabPane: '0',
      tableKey: 0,
      tab1CurrentPage: 1,
      tab1PageSize: 5,
      tab1TotalCount: 2,
      tab2CurrentPage: 1,
      tab2PageSize: 5,
      tab2TotalCount: 2,
      pageSizes: [5, 10, 15, 30, 50, 100],

      filterbox: {
        pathChannelName: '',
        pathChannelLabelName: '',
        startTime: '',
        endTime: '',
      },
    }
  },
  methods: {
    exportAgentInfo() {
      this.filterbox.orderType = null
      this.filterbox.columns = getAgentReportTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
      } else {
        this.filterbox.startTime = getTodayStartTimestamp(this.filterbox.startTime)
        this.filterbox.endTime = getTodayStartTimestamp()
      }
      exportAgentReport(this.filterbox).then(async res => {
          const fileName = this.$t('exportAgentReportName') + getFormateTime()
          await exportExcel(res, fileName, this)
      }).catch(err => {
        console.log(err)
      })
    },
    reset(form) {
      this.$refs[form].resetFields()
      this.filterbox.currency = this.currency
    },
    handleCurrencyChange() {
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency]
      this.filterSearch()
    },
    filterSearch() {
      this.collectionAgentReportInfo = []
      this.payingAgentReportInfo = []
      this.activeTabPane = '0'
      this.search(0)
    },
    search(orderType, paneName) {
      let loadingClass = ''
      if (paneName === '0') {
        loadingClass = 'reportInfo-table1'
      } else if (paneName === '1') {
        loadingClass = 'reportInfo-table2'
      } else {
        loadingClass = 'reportInfo-table1'
      }
      const loadingInstance = loadingBody(this, loadingClass)
      let timeRange = new String(this.filterbox.filterDateRange)
      if (!this.filterbox.filterDateRange) {
        this.filterbox.startTime = getTodayStartTimestamp()
        this.filterbox.endTime = getTodayStartTimestamp()
      } else {
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
      }

      if (!orderType) {
        this.filterbox.orderType = 0;
      } else {
        this.filterbox.orderType = orderType
      }
      // request backend interface to get data
      getAgentReport(this.filterbox).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          let resData = JSON.parse(response.data.data)
          let dataList = resData.agentReportDtoList
          const cardInfo = resData.cardInfo[this.filterbox.currency]
          if (orderType === 0) {
            this.collectionAgentReportInfo = dataList
            this.tab1CurrentPage = resData.pageNo
            this.tab1TotalCount = resData.totalNumber
            this.tab1PageSize = resData.pageSize
            this.statisticsInfo.collectionAgentAmount = this.currencyIcon + cardInfo.total
            this.statisticsInfo.collectionCard = true
            this.statisticsInfo.payingCard = false
          } else if (orderType === 1) {
            this.payingAgentReportInfo = dataList
            this.tab2CurrentPage = resData.pageNo
            this.tab2TotalCount = resData.totalNumber
            this.tab2PageSize = resData.pageSize
            this.statisticsInfo.payingAgentAmount = this.currencyIcon + cardInfo.total
            this.statisticsInfo.collectionCard = false
            this.statisticsInfo.payingCard = true
          }
        } else if (response.data.code !== 0) {
          this.$notify({
            title: 'Error',
            message: response.data.message,
            duration: 3000,
            type: 'error',
            position: 'bottom-right',
          })
        } else {
          this.$notify({
            title: 'Error',
            message: 'Some error occurred.',
            duration: 3000,
            type: 'error',
            position: 'bottom-right'
          })
        }
        loadingInstance.close()
      }).catch(error => {
        console.log(error)
        loadingInstance.close()
        this.$notify({
          title: 'Error',
          message: error.message,
          duration: 3000,
          type: 'error',
          position: 'bottom-right'
        })

      })
    },
    handleTab1CurrentChange(currentPage) {
      this.filterbox.isNeedCardData = false
      this.tab1CurrentPage = currentPage
      let pageSize = this.pageSize
      // 清空table绑定数据
      this.collectionChannelInfo = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      /*this.collectingReportInfoData = this.allCollectingReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))*/
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.tab1PageSize
      this.search(0)
    },
    handleTab1SizeChange(pageSize) {
      this.tab1PageSize = pageSize
      this.tab1CurrentPage = 1
      this.handleTab1CurrentChange(1)
    },
    handleTab2CurrentChange(currentPage) {
      this.filterbox.isNeedCardData = false
      this.tab2CurrentPage = currentPage
      let pageSize = this.pageSize
      // 清空table绑定数据
      this.payingChannelInfo = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      /*this.collectingReportInfoData = this.allCollectingReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))*/
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.tab2PageSize
      this.search(1)
    },
    handleTab2SizeChange(currentPage) {
      this.tab2PageSize = pageSize
      this.tab2CurrentPage = 1
      this.handleTab2CurrentChange(1)
    },
    handleTabClick(tab) {
      this.filterbox.pageNo = 1;
      this.filterbox.pageSize = 10;
      if (tab.paneName === '0') {
        this.tab2CurrentPage = 1;
        this.tab2PageSize = 10;
        this.search(0, tab.paneName)
      } else if (tab.paneName === '1') {
        this.tab1CurrentPage = 1;
        this.tab1PageSize = 10;
        this.search(1, tab.paneName)
      }
    },
  },
  async mounted() {
    await getAllCurrencyType().then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data)
          console.log('options----' + this.currencyOptions[0].currencyType)
          this.currency = this.currencyOptions[0].currencyType
          this.filterbox.currency = this.currencyOptions[0].currencyType
          this.currencyIcons = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon
          })
          let iconKey = this.currency;
          this.currencyIcon = this.currencyIcons[iconKey]
        }
      }
    })
    getAgentInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        const allData = JSON.parse(res.data.data)
        this.agentOptions = allData.agentInfoDtoList
      } else {
        this.$notify({
          title: 'Error',
          type: 'error',
          message: 'get agent info failed, please refresh',
          position: 'bottom-right',
          duration: 3000
        })
      }
    })
    this.startTime = getTodayStartTimestamp()
    this.endTime = getTodayStartTimestamp()
    this.filterbox.isNeedCardData = true
    this.activeTabPane = '0'
    this.search(0)
    this.tab1TotalCount = this.collectionAgentReportInfo.length
    this.tab2TotalCount = this.payingAgentReportInfo.length
  }


}
</script>
<style scoped>
@import "@/assets/base.css";
@import '@/api/common.css';

.main-toolform-input {
  text-align: center;
}

.statistics-form {
  margin-left: 2%;
  margin-top: 1%;
  background-color: white;
  height: 150px;
  width: 500px;
  display: flex;
  align-items: center;
  border-radius: 20px;
}

.statistics-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 30px;
  margin-right: 50px;
}

.statistics-form-item {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 70%;
}

.cash-text-area {
  width: 90%;
  height: 100%;
  background-color: transparent;
  border: none;
  resize: none;
  font-size: 30px;
  font-weight: bold;
  margin-left: 30px;
  text-align: left;
}

.reportInfo {
  margin-top: 1%;
  height: 60%;
  margin-left: 3%;
}

.reportInfoForm {
  height: 100%;
}

.reportInfo-table {
  height: 100%;
  text-align: center;
}

:deep().el-table th.is-leaf {

  background-color: lightskyblue;
  color: white;
  font-weight: bold;
  font-size: larger;
}

</style>