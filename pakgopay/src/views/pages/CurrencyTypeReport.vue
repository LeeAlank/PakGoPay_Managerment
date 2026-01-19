<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate} from "@/api/common.js";
</script>

<template>
 <div class="main-title" style="margin-top: 0">币种报表</div>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0" >
    <el-form-item style="margin-left: 2%;">
      <template #label>
          <span style="color: black;font-size: small;align-items: center;">
            统计币种:
          </span>
      </template>
      <el-select
          style="width: 150px;align-items: center;text-align: center;"
          :options="currencyOptions"
          :props="currencyProps"
          default-first-option
          v-model="filterbox.currency"
          @change="handleCurrencyChange"
          filterable
          placeholder="select currency"
      />
    </el-form-item>
  </div>
  <div class="statistics-container"  style="flex-direction: row;justify-content: space-around">
    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.collectionCard">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">代收总金额:</span>
          <textarea v-model="statisticsInfo.collectionCurrencyAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.payingCard">
      <div class="statistics-form-item">
        <SvgIcon name="paying" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">代付总金额:</span>
          <textarea v-model="statisticsInfo.payingCurrencyAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>

  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 1%;margin-right: 3%;">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="toolbar" style="width: 96%">
        <el-row style="display: flex;justify-content: space-around;">
          <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
            <template #label>
              <span>币种:</span>
            </template>
            <el-select
                v-model="filterbox.selectedCurrency"
                placeholder="请选择币种"
                size="medium"
                style="width: 150px;"
                clearable
                :options="currencyOptions"
                :props="currencyProps"
            >
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
                v-model="filterDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY/MM/DD"
                value-format="x"
            >
            </el-date-picker>
            <el-button @click="filterSearch" style="color: deepskyblue">搜索</el-button>
            <el-button @click="exportCurrencyInfo" style="color: deepskyblue;margin: 0"><SvgIcon name="export"/>导出</el-button>
          </el-form-item>
        </el-row>
      </div>
    </el-collapse-item>
  </el-collapse>


  <div class="reportInfo" style="margin-left: 1%;margin-right: 3%;margin-top: 1%;width: 95%;">
    <el-tabs style="height: 100%;width: 100%" @tab-click="handleTabClick" v-model="activeTabPane">
      <el-tab-pane label="代收" class="tabTable" style="width: 100%">
        <el-table
          :data="collectionCurrencyInfo"
          height="auto"
          border
          style="width: 100%"
          class="reportInfo-table1"
        >
          <el-table-column
            label="币种"
            prop="currencyType"
            align="center"
            v-slot="{row}"
          >
            <div>{{row.currency}}</div>
          </el-table-column>
          <el-table-column
              label="代收订单数量"
              prop="orderQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity}}</div>
          </el-table-column>
          <el-table-column
              label="代收成功订单数"
              prop="successQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.successQuantity}}</div>
          </el-table-column>
          <el-table-column
              label="代收失败订单数"
              prop="failureQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity-row.successQuantity}}</div>
          </el-table-column>
          <el-table-column
              label="成功率"
              prop="successRate"
              align="center"
              v-slot="{row}"
          >
            <div>{{((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%</div>
          </el-table-column>
          <el-table-column
              label="代收商户手续费"
              prop="merchantFee"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.merchantFee}}</div>
          </el-table-column>
          <el-table-column
              label="代收总利润"
              prop="orderProfit"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderProfit}}</div>
          </el-table-column>
          <el-table-column
              label="日期"
              prop="recordDate"
              align="center"
              v-slot="{row}"
          >
            <div>{{getFormateDate(row.recordDate)}}</div>
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
            @size-change="handleTab1PageSizeChange"
            style="float:right; margin-right: 5%;"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="代付" class="tabTable" style="width: 100%">
        <el-table
          :data="payingCurrencyInfo"
          height="auto"
          border
          class="reportInfo-table2"
        >
          <el-table-column
              label="币种"
              prop="currency"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.currency}}</div>
          </el-table-column>
          <el-table-column
              label="代付订单数量"
              prop="orderQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity}}</div>
          </el-table-column>
          <el-table-column
              label="代付成功订单数"
              prop="successQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>row.successQuantity</div>
          </el-table-column>
          <el-table-column
              label="代付失败订单数"
              prop="failureQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>row.orderQuantity-row.successQuantity</div>
          </el-table-column>
          <el-table-column
              label="成功率"
              prop="successRate"
              align="center"
              v-slot="{row}"
          >
            <div>{{((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%</div>
          </el-table-column>
          <el-table-column
              label="代付商户手续费"
              prop="merchantFee"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.merchantFee}}</div>
          </el-table-column>
          <el-table-column
              label="代付总利润"
              prop="orderProfit"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderProfit}}</div>
          </el-table-column>
          <el-table-column
              label="日期"
              prop="recordDate"
              align="center"
              v-slot="{row}"
          >
            <div>{{getFormateDate(row.recordDate)}}</div>
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
            @size-change="handleTab2PageSizeChange"
            style="float:right; margin-right: 5%;"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {ref} from "vue";
import {
  exportCurrencyReport,
  getAllCurrencyType,
  getCurrencyReport,
} from "@/api/interface/backendInterface.js";
import {
  exportExcel,
  getCurrencyReportTitle,
  getFormateTime,
  getTodayStartTimestamp,
  loadingBody
} from "@/api/common.js";

const filterDateRange = ref('')
export default {
  name: 'CurrencyTypeReport',
  data() {
    return {
      timeRange: [],
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      activeTabPane: '0',
      statisticsInfo: {},
      payingCurrencyInfo : [],
      collectionCurrencyInfo : [],
      totalbox: {},
      tab1TotalCount: 0,
      tab2TotalCount: 0,
      tab1CurrentPage: 1,
      tab2CurrentPage: 1,
      pageSizes: [10, 20, 30, 40],
      tab1PageSize:10,
      tab2PageSize:10,
      filterbox: {},
    }
  },
  methods: {
    handleCurrencyChange() {
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency]
      this.filterSearch()
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
    filterSearch() {
      this.payingCurrencyInfo = []
      this.collectionCurrencyInfo = []
      this.activeTabPane = '0'
      this.search(0)
      this.filterbox.isNeed = true
    },
    search(orderType, paneName){
      let loadingClass = ''
      if (paneName === '0') {
        loadingClass = 'reportInfo-table1'
      } else if (paneName === '1') {
        loadingClass = 'reportInfo-table2'
      } else {
        loadingClass = 'reportInfo-table1'
      }
      /*this.loadingBody(loadingClass)*/
      const loadingInstance = loadingBody(this, loadingClass)
      let timeRange = new String(this.filterbox.filterDateRange)
      if (!this.filterbox.filterDateRange) {
        this.filterbox.startTime = getTodayStartTimestamp()
        this.filterbox.endTime = getTodayStartTimestamp()
      } else {
        this.filterbox.startTime = timeRange.split(',')[0]/1000
        this.filterbox.endTime = timeRange.split(',')[1]/1000
      }
      if (!orderType) {
        this.filterbox.orderType = 0;
      } else {
        this.filterbox.orderType = orderType
      }

      getCurrencyReport(this.filterbox).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          let resData = JSON.parse(response.data.data)
          const cardInfo = resData.cardInfo[this.filterbox.currency]
          if (orderType === 0) {
            this.collectionCurrencyInfo = resData.channelReportDtoList
            this.tab1CurrentPage = resData.pageNo
            this.tab1TotalCount = resData.totalNumber
            this.tab1PageSize = resData.pageSize
            this.statisticsInfo.collectionCurrencyAmount = this.currencyIcon + cardInfo.total
            this.statisticsInfo.collectionCard = true
            this.statisticsInfo.payingCard = false
          } else if (orderType === 1) {
            this.payingCurrencyInfo = resData.channelReportDtoList
            this.tab2CurrentPage = resData.pageNo
            this.tab2TotalCount = resData.totalNumber
            this.tab2PageSize = resData.pageSize
            this.statisticsInfo.payingCurrencyAmount = this.currencyIcon + cardInfo.total
            this.statisticsInfo.payingCard = true
            this.statisticsInfo.collectionCard = false
          }
        } else if (response.data.code !==0) {
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
      }).catch(err => {
        loadingInstance.close()
      })
    },
    exportCurrencyInfo() {
      this.filterbox.orderType = null
      this.filterbox.columns = getCurrencyReportTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
      } else {
        this.filterbox.startTime = getTodayStartTimestamp(this.filterbox.startTime)
        this.filterbox.endTime = getTodayStartTimestamp()
      }
      exportCurrencyReport(this.filterbox).then(async res => {
          const fileName = this.$t('exportMerchantReportName') + getFormateTime()
         await exportExcel(res, fileName, this)
      }).catch(err => {
          console.log(err)
      })
    },
    handleTab1CurrentChange(currentPage) {
      this.filterbox.isNeedCardData = false
      this.tab1CurrentPage = currentPage
      let pageSize = this.pageSize
      // 清空table绑定数据
      this.collectionCurrencyInfo = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      /*this.collectingReportInfoData = this.allCollectingReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))*/
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.tab1PageSize
      this.search(0)
    },
    handleTab2CurrentChange(val) {
      this.filterbox.isNeedCardData = false
      this.tab2CurrentPage = currentPage
      let pageSize = this.pageSize
      // 清空table绑定数据
      this.payingCurrencylInfo = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      /*this.collectingReportInfoData = this.allCollectingReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))*/
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.tab2PageSize
      this.search(1)
    },
    handleTab1PageSizeChange(pageSize) {
      this.tab1PageSize = pageSize
      this.tab1CurrentPage = 1
      this.handleTab1CurrentChange(1)
    },
    handleTab2PageSizeChange(pageSize) {
      this.tab2PageSize = pageSize
      this.tab2CurrentPage = 1
      this.handleTab2CurrentChange(1)
    }
  },
  async mounted() {
    await getAllCurrencyType().then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data)
          this.currency = this.currencyOptions[0].currencyType
          this.filterbox.currency = this.currencyOptions[0].currencyType
          this.currencyIcons = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon
          })
          let iconKey = this.currency;
          this.currencyIcon = this.currencyIcons[iconKey]
          this.statisticsInfo.collectionCurrencyAmount = this.currencyIcon+0;
          this.statisticsInfo.payingCurrencyAmount = this.currencyIcon+0;
        }
      }
    })

    this.startTime = getTodayStartTimestamp()
    this.endTime = getTodayStartTimestamp()
    this.filterbox.isNeedCardData = true
    this.activeTabPane = '0'
    this.search(0)
    this.tab1TotalCount = this.collectionCurrencyInfo.length
    this.tab2TotalCount = this.payingCurrencyInfo.length
  }
}
</script>
<style scoped>
@import "@/assets/base.css";
@import "@/api/common.css";
.toolbar {
  margin-left: 2%;
  margin-top: 1%;
}

.tabTable {
  height: 700px;
  width: 97%;
}
</style>