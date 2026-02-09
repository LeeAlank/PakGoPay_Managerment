<script setup>
import '@/api/common.css'
import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate} from "@/api/common.js";

</script>
<script>
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
import {ref} from "vue";
import {
  exportPayment,
  getAllCurrencyType,
  getPaymentInfo,
  getPaymentReport
} from "@/api/interface/backendInterface.js";
import {
  exportExcel,
  getFormateTime, getPaymentListTitle,
  getTodayStartTimestamp,
  loadingBody
} from "@/api/common.js";

const filterDateRange = ref('')
export default {
  name: "ChannelReport",
  components: {
    ElPagination,
  },
  data() {
    return {
      payingPaymentInfo:[],
      activeTool: "1",
      collectionPaymentInfo: [],
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
      totalbox: {},
      pathChannelOptions: [],
      pathChannelProps: {
        value: 'paymentNo',
        label: 'paymentName'
      },
      currentPage: 1,
      tab1CurrentPage: 0,
      tab1TotalCount: 0,
      tab1PageSize: 1,
      tab2CurrentPage: 0,
      tab2TotalCount: 0,
      tab2PageSize: 1,
      pageSizes: [ 10, 20, 50, 100, 200],
      totalCount: 0,
      filterbox: {
        pathChannelName: '',
        pathChannelLabelName: '',
        startTime: '',
        endTime: '',
      }
    }
  },
  methods: {
    reset(form) {
      this.$refs[form].resetFields();
    },
    handleCurrencyChange(tab) {
      if (tab && tab.paneName !== undefined) {
        this.filterbox.currency = tab.paneName
      }
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency]
      this.filterSearch()
    },
    handleTab1SizeChange(pageSize) {
      this.tab1PageSize = pageSize
      this.tab1CurrentPage = 1
      //this.handleTab1CurrentChange(1)
      this.filterbox.pageSize = pageSize
      this.filterbox.pageNo = 1
      this.search(0)
    },
    handleTab1CurrentChange(currentPage) {
      this.filterbox.isNeedCardData = false
      this.tab1CurrentPage = currentPage
      let pageSize = this.pageSize
      // 清空table绑定数据
      this.collectionPaymentInfo = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      /*this.collectingReportInfoData = this.allCollectingReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))*/
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.tab1PageSize
      this.search(0)
    },
    handleTab2SizeChange(pageSize) {
      this.tab2PageSize = pageSize
      this.tab2CurrentPage = 1
      this.filterbox.pageSize = pageSize
      this.filterbox.pageNo = 1
      this.search(1)
    },
    handleTab2CurrentChange(currentPage) {
      this.filterbox.isNeedCardData = false
      this.tab2CurrentPage = currentPage
      let pageSize = this.pageSize
      // 清空table绑定数据
      this.payingPaymentInfo = []
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
    exportPathChannelInfo() {
      //export data
      this.filterbox.orderType = null
      this.filterbox.columns = getPaymentListTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000 + 86399
      } else {
        this.filterbox.startTime = getTodayStartTimestamp()
        this.filterbox.endTime = getTodayStartTimestamp() + 86399
      }
      exportPayment(this.filterbox).then(async res => {
         /*const fileName = this.$t('exportPaymentReportName') + getFormateTime()*/
        const fileName = this.$t('pathChannelReport.exportName') + getFormateTime()
        await exportExcel(res, fileName, this)
        this.filterbox.orderType = '0'
      })
    },
    filterSearch() {
      this.payingPaymentInfo = []
      this.collectionPaymentInfo = []
      this.activeTabPane = '0'
      this.search(0)
      this.filterbox.isNeed = true
    },
    search(orderType, paneName) {
      if (this.currencyOptions.length === 0) {
        this.tab1PageSize = 10;
        this.tab2PageSize = 10;
        return
      }
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
        this.filterbox.endTime = getTodayStartTimestamp() + 86399
      } else {
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000 + 86399
      }
      if (!orderType) {
        this.filterbox.orderType = 0;
      } else {
        this.filterbox.orderType = orderType
      }
      getPaymentReport(this.filterbox).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              let resData = JSON.parse(res.data.data)
              const cardInfo = resData.cardInfo[this.filterbox.currency]
              if (orderType === 0) {
                this.collectionPaymentInfo = resData.paymentReportDtoList
                this.tab1CurrentPage = resData.pageNo
                this.tab1TotalCount = resData.totalNumber
                this.tab1PageSize = resData.pageSize
                this.statisticsInfo.collectionAmount = this.currencyIcon + cardInfo.total
                this.statisticsInfo.collectionCard = true
                this.statisticsInfo.payingCard = false
              } else if (orderType === 1) {
                this.payingPaymentInfo = resData.paymentReportDtoList
                this.tab2CurrentPage = resData.pageNo
                this.tab2TotalCount = resData.totalNumber
                this.tab2PageSize = resData.pageSize
                this.statisticsInfo.payingAmount = this.currencyIcon + cardInfo.total
                this.statisticsInfo.payingCard = true
                this.statisticsInfo.collectionCard = false
              }
            } else if (res.status === 200 && res.data.code !== 0) {
              this.$notify({
                title: this.$t('common.error'),
                message: res.data.message,
                duration: 3000,
                type: 'error',
                position: 'bottom-right',
              })
            } else {
              this.$notify({
                title: this.$t('common.error'),
                message: this.$t('common.requestFailed'),
                duration: 3000,
                type: 'error',
                position: 'bottom-right'
              })
            }
               loadingInstance.close()
          }
      ).
        catch(err => {
          alert(err.message)
          loadingInstance.close()
        })
      }
    },
    async mounted() {
      await getPaymentInfo({pageSize: 1000}).then(res => {
        if (res.status === 200) {
          if (res.data.code === 0) {
            const allData = JSON.parse(res.data.data);
            this.pathChannelOptions = allData.paymentDtoList
            //this.filterbox.paymentId = this.pathChannelOptions[0].paymentId
          }
        }
      })

      await getAllCurrencyType().then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
          if (this.currencyOptions.length > 0) {
            this.currency = this.currencyOptions[0].currencyType
            this.filterbox.currency = this.currencyOptions[0].currencyType
            this.currencyIcons = {};
            this.currencyOptions.forEach(currency => {
              this.currencyIcons[currency.currencyType] = currency.icon
            })
            let iconKey = this.currency;
            this.currencyIcon = this.currencyIcons[iconKey]
          }
          return;
        }
        if (res.status !== 200 || res.data.code !== 0) {
          this.$notify({
            title: this.$t('common.failed'),
            message: this.$t('currencyTypeList.message.getFailed'),
            duration: 3000,
            type: 'error',
            position: 'bottom-right'
          })
        }
      })

      //get report data
      this.startTime = getTodayStartTimestamp()
      this.endTime = getTodayStartTimestamp()
      this.filterbox.isNeedCardData = true
      this.activeTabPane = '0'
      this.search(0)
      //this.tab1TotalCount = this.collectionChannelInfo.length
      //this.tab2TotalCount = this.payingChannelInfo.length
    }
  }
</script>
<template>
  <div class="main-title">{{ $t('pathChannelReport.title') }}</div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="main-toolbar">
        <el-form style="width: 96%;" ref="filterboxForm" :model="filterbox">
          <el-row style="display: flex;justify-content: space-around;">
            <el-form-item style="display: flex;justify-content: center;color: deepskyblue" prop="paymentNo">
              <template #label>
                <span style="width: 150px;">{{ $t('pathChannelReport.filter.channel') }}</span>
              </template>
              <el-select
                  :options="pathChannelOptions"
                  :props="pathChannelProps"
                  v-model="filterbox.paymentNo"
                  style="width: 200px"
              />
            </el-form-item>


            <el-form-item style="display: flex;justify-content: center;color: deepskyblue" prop="filterDateRange">
              <template #label>
                <span style="width: 150px">{{ $t('common.timeRange') }}</span>
              </template>
              <el-date-picker
                  v-model="filterbox.filterDateRange"
                  type="daterange"
                  :range-separator="$t('common.rangeSeparator')"
                  :start-placeholder="$t('common.startDate')"
                  :end-placeholder="$t('common.endDate')"
                  format="YYYY/MM/DD"
                  value-format="x"
              >
              </el-date-picker>
              <el-button @click="reset('filterboxForm')" class="filterButton">
                <template #icon>
                  <SvgIcon class="filterButtonSvg" name="reset"/>
                </template>
                <span>{{ $t('common.reset') }}</span>
              </el-button>
              <el-button @click="filterSearch" class="filterButton">
                <template #icon>
                  <div style="width: 100%">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                  </div>
                </template>
                <div>{{ $t('common.query') }}</div>
              </el-button>
              <el-button @click="exportPathChannelInfo" class="filterButton">
                <template #icon>
                  <div style="width: 100%">
                    <SvgIcon name="export" class="filterButtonSvg"/>
                  </div>
                </template>
                <div>{{ $t('common.export') }}</div>
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
    <div style="display: flex;flex-direction: column;gap: 6px;margin-left: 2%;width: 96%;">
      <span style="color: black;font-size: small;">{{ $t('pathChannelReport.currencyLabel') }}</span>
      <el-tabs
          v-model="filterbox.currency"
          type="card"
          @tab-click="handleCurrencyChange"
      >
        <el-tab-pane
            v-for="item in currencyOptions"
            :key="item.currencyType"
            :label="item.name"
            :name="item.currencyType"
        />
      </el-tabs>
    </div>
  </div>
  <div class="statistics-container" style="justify-content: space-around">
    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.collectionCard">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;justify-items: right">
          <span style="text-align: left;font-size: x-large">{{ $t('pathChannelReport.statistics.collectionAmount') }}</span>
          <textarea v-model="statisticsInfo.collectionAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.payingCard">
      <div class="statistics-form-item">
        <SvgIcon name="paying" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">{{ $t('pathChannelReport.statistics.payoutAmount') }}</span>
          <textarea v-model="statisticsInfo.payingAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>


  <div class="reportInfo">
    <el-tabs @tab-click="handleTabClick" v-model="activeTabPane">
      <el-tab-pane :label="$t('pathChannelReport.tab.collection')">
        <form id="reportInfoTable" class="reportInfoForm">
          <el-table style="width: 100%; height: 100%;" border :data="collectionPaymentInfo" class="reportInfo-table1">
            <el-table-column
                prop="channelName"
                :label="$t('pathChannelReport.column.channelName')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.paymentName }}</div>
            </el-table-column>
            <el-table-column
                prop="orderQuantity"
                :label="$t('pathChannelReport.column.collectionOrderTotal')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.orderQuantity }}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelFailureOrderNumber"
                :label="$t('pathChannelReport.column.collectionFailed')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.orderQuantity - row.successQuantity }}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelSuccessOrderNumber"
                :label="$t('pathChannelReport.column.collectionSuccess')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.successQuantity }}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelSuccessRate"
                :label="$t('pathChannelReport.column.collectionSuccessRate')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.orderQuantity === 0 ? 0 : ((row.successQuantity / row.orderQuantity) * 100).toFixed(2) }}%</div>
            </el-table-column>
            <el-table-column
                prop="orderBalance"
                :label="$t('pathChannelReport.column.orderAmount')"
                align="center"
                v-slot="{row}"
            >
              <div>{{currencyIcon + row.orderBalance }}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelMerchantCommission"
                :label="$t('pathChannelReport.column.collectionMerchantFee')"
                align="center"
                v-slot="{row}"
            >
              <div>{{currencyIcon + row.merchantFee }}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelProfit"
                :label="$t('pathChannelReport.column.platformFee')"
                align="center"
                v-slot="{row}"
            >
              <div>{{currencyIcon + row.orderProfit }}</div>
            </el-table-column>
            <el-table-column
                prop="recordDate"
                :label="$t('pathChannelReport.column.recordDate')"
                align="center"
                v-slot="{row}"
            >
              {{ getFormateDate(row.recordDate) }}
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
              class="pageTool"
          >
          </el-pagination>
        </form>
      </el-tab-pane>
      <el-tab-pane :label="$t('pathChannelReport.tab.payout')">
        <form id="reportInfoTable" class="reportInfoForm">
          <el-table style="width: 100%; height: 100%;" border :data="payingPaymentInfo" class="reportInfo-table2">
            <el-table-column
                prop="paymentName"
                :label="$t('pathChannelReport.column.channelName')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.paymentName }}</div>
            </el-table-column>
            <el-table-column
                prop="orderQuantity"
                :label="$t('pathChannelReport.column.payoutOrderTotal')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.orderQuantity }}</div>
            </el-table-column>
            <el-table-column
                prop="failureQuantity"
                :label="$t('pathChannelReport.column.payoutFailed')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.orderQuantity - row.successQuantity }}</div>
            </el-table-column>
            <el-table-column
                prop="successQuantity"
                :label="$t('pathChannelReport.column.payoutSuccess')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.successQuantity }}</div>
            </el-table-column>
            <el-table-column
                prop="orderSuccessRate"
                :label="$t('pathChannelReport.column.payoutSuccessRate')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ row.orderQuantity === 0 ? 0 : ((row.successQuantity / row.orderQuantity) * 100).toFixed(2) }}%</div>
            </el-table-column>
            <el-table-column
                prop="orderBalance"
                :label="$t('pathChannelReport.column.orderAmount')"
                align="center"
                v-slot="{row}"
            >
              <div>{{currencyIcon + row.orderBalance }}</div>
            </el-table-column>
            <el-table-column
                prop="merchantFee"
                :label="$t('pathChannelReport.column.payoutMerchantFee')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ currencyIcon + row.merchantFee }}</div>
            </el-table-column>
            <el-table-column
                prop="orderBalance"
                :label="$t('pathChannelReport.column.platformFee')"
                align="center"
                v-slot="{row}"
            >
              <div>{{ currencyIcon + row.orderProfit }}</div>
            </el-table-column>
            <el-table-column
                prop="time"
                :label="$t('pathChannelReport.column.recordDate')"
                align="center"
                v-slot="{row}"
            >
              {{ getFormateDate(row.recordDate) }}
            </el-table-column>
          </el-table>
          <el-pagination class="pageTool"
              background
              layout="sizes, prev, pager, next, jumper, total"
              :total="tab2TotalCount"
              v-model:current-page="tab2CurrentPage"
              v-model:page-size="tab2PageSize"
              :page-sizes="pageSizes"
              @current-change="handleTab2CurrentChange"
              @size-change="handleTab2SizeChange"
             
          >
          </el-pagination>
        </form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
@import "@/assets/base.css";
@import "@/api/common.css";
</style>
