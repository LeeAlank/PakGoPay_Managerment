<script setup>
import '@/api/common.css'
import SvgIcon from "@/components/SvgIcon/index.vue";
import merchantReport from "@/views/pages/MerchantReport.vue";
import {getFormateDate} from "@/api/common.js";

</script>
<script>
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
import '@/api/common.css'
import {ref} from "vue";
import {exportChannelReport, getAllCurrencyType, getChannelReport} from "@/api/interface/backendInterface.js";
import {exportExcel, getChannelReportTitle, getFormateTime, getTodayStartTimestamp, loadingBody} from "@/api/common.js";
export default {
  name: "ChannelReport",
  components: {
    ElPagination,
  },
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
      statisticsInfo: {},
      channelOptions: [
        {
          channelId: 1,
          channelName: '渠道一'
        },
        {
          channelId: 2,
          channelName: '渠道二'
        }
      ],
      channelProps: {
        value: 'channelId',
        label: 'channelName'
      },
      loadingInstance: '',
      payingChannelInfo: [],
      collectionChannelInfo: [],
      activeTabPane: '0',
      tab1CurrentPage: 0,
      tab1TotalCount: 0,
      tab1PageSize: 1,
      tab2CurrentPage: 0,
      tab2TotalCount: 0,
      tab2PageSize: 1,
      pageSizes: [1,5,10,15,30,50,100],

      filterbox: {
      }
    }
  },
  methods: {
    exportChannelInfo() {
      //导出报表方法
      this.filterbox.orderType = null
      this.filterbox.columns = getChannelReportTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
      } else {
        this.filterbox.startTime = getTodayStartTimestamp(this.filterbox.startTime)
        this.filterbox.endTime = getTodayStartTimestamp()
      }
      exportChannelReport(this.filterbox).then(async res => {
        const fileName = this.$t('exportChannelReportName') + getFormateTime()
        await exportExcel(res, fileName, this)
        this.filterbox.orderType = '0'
      })
    },
    handleCurrencyChange() {
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency]
      this.filterSearch()
    },
    // 改变每页显示条数
    handleTab1SizeChange(pageSize) {
      this.tab1PageSize = pageSize
      this.tab1CurrentPage = 1
      this.handleTab1CurrentChange(1)
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
    handleTab2SizeChange(pageSize) {
      this.tab2PageSize = pageSize
      this.tab2CurrentPage = 1
      this.handleTab2CurrentChange(1)
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
      this.payingChannelInfo = []
      this.collectionChannelInfo = []
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
      this.loadingInstance = loadingBody(this, loadingClass)
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
      this.filterbox.channelId = '1'
      getChannelReport(this.filterbox).then(response => {
         if (response.status === 200 && response.data.code === 0) {
           let resData = JSON.parse(response.data.data)
           const cardInfo = resData.cardInfo[this.filterbox.currency]
             if (orderType === 0) {
               this.collectionChannelInfo = resData.channelReportDtoList
               this.tab1CurrentPage = resData.pageNo
               this.tab1TotalCount = resData.totalNumber
               this.tab1PageSize = resData.pageSize
               this.statisticsInfo.collectionChannelAmount = this.currencyIcon + cardInfo.total
               this.statisticsInfo.collectionCard = true
               this.statisticsInfo.payingCard = false
             } else if (orderType === 1) {
               this.payingChannelInfo = resData.channelReportDtoList
               this.tab2CurrentPage = resData.pageNo
               this.tab2TotalCount = resData.totalNumber
               this.tab2PageSize = resData.pageSize
               this.statisticsInfo.payingChannelAmount = this.currencyIcon + cardInfo.total
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
        this.loadingInstance.close()
      }).catch(err => {
        this.loadingInstance.close()
      })
    },
    reset(form) {
      this.$refs[form].resetFields()
      this.filterbox.currency = this.currency
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
        }
      }
    })
    this.startTime = getTodayStartTimestamp()
    this.endTime = getTodayStartTimestamp()
    this.filterbox.isNeedCardData = true
    this.activeTabPane = '0'
    this.search(0)
    this.tab1TotalCount = this.collectionChannelInfo.length
    this.tab2TotalCount = this.payingChannelInfo.length
  }
}
</script>
<template>
  <div class="main-title">渠道报表</div>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0" >
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
  <div class="statistics-container"  style="flex-direction: row;justify-content: space-around">
    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.collectionCard">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">代收金额:</span>
          <textarea v-model="statisticsInfo.collectionChannelAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.payingCard">
      <div class="statistics-form-item">
        <SvgIcon name="paying" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">代付总金额:</span>
          <textarea v-model="statisticsInfo.payingChannelAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>
  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 2%;">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterForm" :model="filterbox">
          <el-row style="display: flex;justify-content: center;align-items: center;">
            <el-col :span="8">
              <el-form-item label="渠道:" label-width="150px" prop="channelId">
                <el-select
                  :options="channelOptions"
                  :props="channelProps"
                  placeholder="请选择渠道"
                  v-model="filterbox.channelId"
                  style="width: 250px;text-align: center;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="16">
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
                  <el-button type="primary" @click="filterSearch()" style="margin:0">
                    <SvgIcon height="20px" width="20px" name="search"/>
                    <div style="color: black">查询</div>
                  </el-button>
                  <el-button @click="exportChannelInfo" style="margin:0">
                    <SvgIcon height="20px" width="20px" name="export"/>
                    <div style="color: black">导出</div>
                  </el-button>
                </div>

              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="reportInfo" style="width: 95%;margin-left: 2%;">
    <el-tabs @tab-click="handleTabClick" v-model="activeTabPane">
      <el-tab-pane label="代收">
        <form id="reportInfoTable" class="reportInfoForm">
          <el-table style="width: 100%; height: 100%;" border :data="collectionChannelInfo" class="reportInfo-table1">
            <el-table-column
                prop="channelName"
                label="渠道名称"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.channelName}}</div>
            </el-table-column>
            <el-table-column
                prop="orderQuantity"
                label="代收订单总数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.orderQuantity}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelFailureOrderNumber"
                label="代收失败订单数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.orderQuantity-row.successQuantity}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelSuccessOrderNumber"
                label="代收成功订单数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.successQuantity}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelSuccessRate"
                label="代收订单成功率"
                align="center"
                v-slot="{row}"
            >
              <div>{{((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelMerchantCommission"
                label="代收商户手续费"
                align="center"
                v-slot="{row}"
            >
              <div>{{this.currencyIcon+row.merchantFee}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelProfit"
                label="代收净利润"
                align="center"
                v-slot="{row}"
            >
              <div>{{this.currencyIcon+row.orderBalance}}</div>
            </el-table-column>
            <el-table-column
                prop="recordDate"
                label="时间"
                align="center"
                v-slot="{row}"
            >
              {{getFormateDate(row.recordDate)}}
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
        </form>
      </el-tab-pane>
      <el-tab-pane label="代付">
        <form id="reportInfoTable" class="reportInfoForm">
          <el-table style="width: 100%; height: 100%;" border :data="payingChannelInfo" class="reportInfo-table2">
            <el-table-column
                prop="channelName"
                label="渠道名称"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.channelName}}</div>
            </el-table-column>
            <el-table-column
                prop="orderQuantity"
                label="代付订单总数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.orderQuantity}}</div>
            </el-table-column>
            <el-table-column
              prop="failureQuantity"
                label="代付失败订单数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.orderQuantity-row.successQuantity}}</div>
            </el-table-column>
            <el-table-column
                prop="successQuantity"
                label="代付成功订单数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.successQuantity}}</div>
            </el-table-column>
            <el-table-column
                prop="orderSuccessRate"
                label="代收订单成功率"
                align="center"
                v-slot="{row}"
            >
              <div>{{((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%</div>
            </el-table-column>
            <el-table-column
                prop="merchantFee"
                label="代付商户手续费"
                align="center"
                v-slot="{row}"
            >
              <div>{{this.currencyIcon+row.merchantFee}}</div>
            </el-table-column>
            <el-table-column
                prop="orderBalance"
                label="代付净利润"
                align="center"
                v-slot="{row}"
            >
              <div>{{this.currencyIcon+row.orderBalance}}</div>
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
              align="center"
              v-slot="{row}"
            >
              {{getFormateDate(row.recordDate)}}
            </el-table-column>
          </el-table>
          <el-pagination
              background
              layout="sizes, prev, pager, next, jumper, total"
              :total="tab2TotalCount"
              v-model:current-page="tab2CurrentPage"
              v-model:page-size="tab2PageSize"
              :page-sizes="pageSizes"
              @current-change= "handleTab2CurrentChange"
              @size-change= "handleTab2SizeChange"
              style="float:right; margin-right: 5%;"
          >
          </el-pagination>
        </form>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<style scoped>
.reportInfo{
  margin-top: 20px;
}

.el-table .el-table_body-rapper{
  width: 100%;
  height: calc(100% - 23px);
}

:deep().el-table th.is-leaf {

  background-color: lightskyblue;
  color: white;
  font-weight: bold;
  font-size: larger;
}

.toolbarName{
  color: black;
}
:deep() .el-collapse-item__header {
  background-color: deepskyblue;
}
</style>