<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate} from "@/api/common.js";

</script>
<script>
import '@/api/common.css'
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
import '@/api/common.css'

import {exportMerchantReport, getAllCurrencyType, getMerchantReport} from "@/api/interface/backendInterface.js";
import {
  exportExcel,
  getFormateDate,
  getFormateTime,
  getMerchantReportTitle,
  getTodayStartTimestamp,
  loadingBody
} from "@/api/common.js";

export default {
  components: {},
  data() {
    return {
      activeTool: "1",
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      activeTabPane: 0,
      starttingTime: '',
      endingTime: '',
      value: '',
      statisticsInfo: {},
      timeRange: '',
      filterbox: {},
      reportTitle: this.$t('merchantReport.reportTitle'),
      tab1CurrentPage: 1,
      tab1TotalCount: 2,
      pageSizes: [10, 15, 30, 50, 100],
      tab1PageSize: 1,
      tab2CurrentPage: 1,
      tab2TotalCount: 2,
      tab2PageSize: 1,
      collectingReportInfoData: [],
      payingReportInfoData: [],
      allCollectingReportInfoData: [
        {
          dsOrderNumber: '100000000000',
          dsOrderSuccessRate: '98%',
          dsOrderSuccessNumber: 1000,
          dfOrderNumber: '001',
          dfOrderSuccessRate: '98%',
          dfOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: this.$t('common.sampleMerchant')
        }
      ],
      allPayingReportInfoData: [
        {
          dsOrderNumber: '100000000000',
          dsOrderSuccessRate: '98%',
          dsOrderSuccessNumber: 1000,
          dfOrderNumber: '001',
          dfOrderSuccessRate: '98%',
          dfOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: this.$t('common.sampleMerchant')
        }
      ],
    }
  },
  methods: {
    handleCurrencyChange(tab) {
      if (tab && tab.paneName !== undefined) {
        this.filterbox.currency = tab.paneName
      }
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency]
      this.filtersearch()
    },
    exportMerchantInfo() {
      //导出报表方法
      this.filterbox.orderType = null
      this.filterbox.columns = getMerchantReportTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000 + 86399
      } else {
        this.filterbox.startTime = getTodayStartTimestamp()
        this.filterbox.endTime = getTodayStartTimestamp()+ 86399
      }
      exportMerchantReport(this.filterbox).then(async res => {
        const fileName = this.$t('exportMerchantReportName') + getFormateTime()
        await exportExcel(res, fileName, this)
        /*if (res.status === 200) {
          if (res.data.type === 'application/json') {
            const blobData = res.data;
            const jsonData = JSON.parse(await blobData.text())
            if (jsonData.code !== 0) {
              this.$notify({
                title: 'Failed',
                message: jsonData.message,
                duration: 3000,
                type: 'error',
                position: 'bottom-right',
              })
            }
          } else {
            const blob = new Blob([res.data], {type: "application/vnd.ms-excel;charset=UTF-8"});
            console.log('blob---'+ blob.size)
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, fileName)
            } else {
              const downLoadElement = document.createElement('a');
              const href = window.URL.createObjectURL(blob);
              downLoadElement.href = href;
              downLoadElement.download = fileName;
              document.body.appendChild(downLoadElement);
              downLoadElement.click();
              document.body.removeChild(downLoadElement);
              window.URL.revokeObjectURL(href);
            }
            this.$notify({
              title: 'Success',
              message: 'export data success',
              duration: 3000,
              type: 'success',
              position: 'bottom-right',
            })
          }
        } else {
          if (res.data.type === 'application/json') {
            const blobData = res.data;
            const jsonData = JSON.parse(await blobData.text())
            this.$notify({
              title: 'Error',
              message: jsonData.message,
              duration: 3000,
              type: 'error',
              position: 'bottom-right',
            })
          }

        }
        this.filterbox.orderType = '0'*/
      }).catch(err => {
        console.log(err)
      })
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
      this.collectingReportInfoData = []
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
      let pageSize = this.tab2PageSize
      // 清空table绑定数据
      this.payingReportInfoData = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      /*this.payingReportInfoData = this.allPayingReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))*/
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.tab2PageSize
      this.search(1)

    },
    getAllReportInfoData() {
      //获取所有数据
    },
    filtersearch() {
      console.log('filterbox----'+JSON.stringify(this.filterbox))
      this.collectingReportInfoData = []
      this.payingReportInfoData = []
      this.activeTabPane = '0'
      this.search(0)
      this.filterbox.isNeeded = true
    },
    search(orderType, paneName) {
      if (this.currencyOptions.length === 0) {
        this.tab1PageSize = 10;
        this.tab2PageSize = 10;
        return
      }
      this.filterbox.isNeedCardData = true
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
        this.filterbox.endTime = getTodayStartTimestamp()+86399
      } else {
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000 + 86399
      }
      if (!orderType) {
        this.filterbox.orderType = 0;
      } else {
        this.filterbox.orderType = orderType
      }
      getMerchantReport(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let resData = JSON.parse(res.data.data)
          if (orderType === 0) {
            this.collectingReportInfoData = resData.merchantReportDtoList
            this.tab1CurrentPage = resData.pageNo
            this.tab1TotalCount = resData.totalNumber
            this.tab1PageSize = resData.pageSize
          } else if (orderType === 1) {
            this.payingReportInfoData = resData.merchantReportDtoList
            this.tab2CurrentPage = resData.pageNo
            this.tab2TotalCount = resData.totalNumber
            this.tab2PageSize = resData.pageSize
          }
          const cardInfo = resData.cardInfo[this.filterbox.currency]
          if(!cardInfo) {
            this.statisticsInfo.totalAmount = this.currencyIcon + 0;
            this.statisticsInfo.totalWithdrawlAmount = this.currencyIcon + 0;
            this.statisticsInfo.totalFreezeAmount = this.currencyIcon + 0;
          }else {
            this.statisticsInfo.totalAmount = this.currencyIcon + cardInfo.total;
            this.statisticsInfo.totalWithdrawlAmount = this.currencyIcon + cardInfo.withdraw;
            this.statisticsInfo.totalFreezeAmount = this.currencyIcon + cardInfo.frozen;
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
      }).catch(err => {
        loadingInstance.close()
      })

    },
    reset(form) {
      this.$refs[form].resetFields();
      this.filterbox.currency = this.currency
      //filterDateRange.value = '';
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
          title: this.$t('common.error'),
          message: this.$t('currencyTypeList.message.getFailed'),
          duration: 3000,
          type: 'error',
          position: 'bottom-right'
        })
      }
    })
    this.startTime = getTodayStartTimestamp()
    this.endTime = getTodayStartTimestamp()
    this.filterbox.isNeedCardData = true
    this.activeTabPane = '0'
    this.search(0)
    this.tab1TotalCount = this.collectingReportInfoData.length
    this.tab2TotalCount = this.payingReportInfoData.length
  }
}
</script>
<template>
  <div class="main-title">
    {{ $t('merchantReport.title') }}
  </div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="toolbar" style="height: auto">
        <el-form class="toolform" :model="filterbox" ref="filterForm">
          <el-row class="toolform-item">
            <el-col :span="8" class="toolform-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item :label="$t('merchantReport.filter.merchantName')" label-width="150px" prop="merchantAccount">
                <el-input v-model="filterbox.merchantName" type="text" :placeholder="$t('merchantReport.placeholder.merchantAccount')"/>
              </el-form-item>
            </el-col>
            <el-col :span="16" class="toolform-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item :label="$t('merchantReport.filter.timeRange')" label-width="150px" prop="filterDateRange">
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
                <div style="display: flex;flex-direction: row">
                  <el-button @click="reset('filterForm')"
                       class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="reset"/>
                    <div>{{ $t('common.reset') }}</div>
                  </el-button>
                  <el-button @click="filtersearch"
                       class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>{{ $t('common.query') }}</div>
                  </el-button>
                  <el-button @click="exportMerchantInfo"
                       class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="export"/>
                    <div>{{ $t('common.export') }}</div>
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
    <div class="currency-tabs">
      <span class="currency-tabs-label">{{ $t('merchantReport.currencyLabel') }}</span>
      <el-tabs
          v-model="filterbox.currency"
          type="card"
          class="currency-tabs-control"
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
  <!-- 统计数据展示 -->
  <div class="statistics-container" style="width: 95%;margin-right: 3%; padding: 0;margin-left: 0">
    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">{{ $t('merchantReport.statistics.totalAmount') }}</span>
          <textarea v-model="statisticsInfo.totalAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">{{ $t('merchantReport.statistics.withdrawAmount') }}</span>
          <textarea v-model="statisticsInfo.totalWithdrawlAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash-freeze" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">{{ $t('merchantReport.statistics.freezeAmount') }}</span>
          <textarea v-model="statisticsInfo.totalFreezeAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>
  <div class="reportInfo">
    <el-tabs type="border-card" class="report-tabs" @tab-click="handleTabClick" v-model="activeTabPane">
      <el-tab-pane :label="$t('merchantReport.tab.collection')" style="width: 100%">
        <form id="reportInfo" class="reportInfoForm" style="height: auto">
          <el-table
              border :data="collectingReportInfoData"
              class="reportInfo-table1"
              style="width: 100%"
              height="auto"
          >
            <el-table-column
                :label="$t('merchantReport.column.merchantName')"
                v-slot="{row}"
                align="center"
                width="150px"
            >
              <div>
                {{ row.merchantName }}
              </div>
            </el-table-column>
            <el-table-column
                prop="orderQuantity"
                :label="$t('merchantReport.column.collectionOrderTotal')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ row.orderQuantity }}
              </div>
            </el-table-column>
            <el-table-column
                prop="dsOrderSuccessRate"
                :label="$t('merchantReport.column.collectionSuccessRate')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ row.orderQuantity === 0 ? 0 :((row.successQuantity / row.orderQuantity) * 100).toFixed(2) }}%
              </div>
            </el-table-column>
            <el-table-column
                prop="successQuantity"
                :label="$t('merchantReport.column.collectionSuccessCount')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ row.successQuantity }}
              </div>
            </el-table-column>
<!--            <el-table-column
                prop="commission"
                label="订单金额"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.orderBalance }}
              </div>
            </el-table-column>-->
            <el-table-column
                prop="merchantFee"
                :label="$t('merchantReport.column.collectionMerchantFee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.merchantFee }}
              </div>
            </el-table-column>
            <el-table-column
                prop="agent1Fee"
                :label="$t('merchantReport.column.agent1Fee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.agent1Fee }}
              </div>
            </el-table-column>
            <el-table-column
                prop="agent2Fee"
                :label="$t('merchantReport.column.agent2Fee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.agent2Fee }}
              </div>
            </el-table-column>
            <el-table-column
                prop="agent3Fee"
                :label="$t('merchantReport.column.agent3Fee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.agent3Fee }}
              </div>
            </el-table-column>
            <el-table-column
                prop="orderProfit"
                :label="$t('merchantReport.column.platformFee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.orderProfit }}
              </div>
            </el-table-column>
            <el-table-column
                prop="recordDate"
                :label="$t('merchantReport.column.recordDate')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ (getFormateDate(row.recordDate)) }}
              </div>
            </el-table-column>
          </el-table>
          <el-pagination class="pageTool"
              background
              layout="sizes, prev, pager, next, jumper, total"
              :total="tab1TotalCount"
              v-model:current-page="tab1CurrentPage"
              v-model:page-size="tab1PageSize"
              :page-sizes="pageSizes"
              @current-change="handleTab1CurrentChange"
              @size-change="handleTab1SizeChange"
             
          >
          </el-pagination>
        </form>
      </el-tab-pane>
      <el-tab-pane :label="$t('merchantReport.tab.payout')" style="width: 100%">
        <form id="reportInfo" class="reportInfoForm" style="height: auto">
          <el-table
              border :data="payingReportInfoData"
              class="reportInfo-table2"
              style="width: 100%"
              height="auto"
          >
            <el-table-column
                :label="$t('merchantReport.column.merchantName')"
                v-slot="{row}"
                align="center"
                width="150px"
            >
              <div>
                {{ row.merchantName }}
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderNumber"
                :label="$t('merchantReport.column.payoutOrderTotal')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ row.orderQuantity }}
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderSuccessRate"
                :label="$t('merchantReport.column.payoutSuccessRate')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ row.orderQuantity === 0 ? 0 : ((row.successQuantity / row.orderQuantity) * 100).toFixed(2) }}%
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderSuccessNumber"
                :label="$t('merchantReport.column.payoutSuccessCount')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ row.successQuantity }}
              </div>
            </el-table-column>
<!--            <el-table-column
                prop="commission"
                label="订单金额"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.orderBalance }}
              </div>
            </el-table-column>-->
            <el-table-column
                prop="commission"
                :label="$t('merchantReport.column.payoutMerchantFee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.merchantFee }}
              </div>
            </el-table-column>
            <el-table-column
                prop="firstLevelAgentCommission"
                :label="$t('merchantReport.column.agent1Fee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.agent1Fee }}
              </div>
            </el-table-column>
            <el-table-column
                prop="secondLevelAgentCommission"
                :label="$t('merchantReport.column.agent2Fee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.agent2Fee }}
              </div>
            </el-table-column>
            <el-table-column
                prop="thirdLevelAgentCommission"
                :label="$t('merchantReport.column.agent3Fee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.agent3Fee }}
              </div>
            </el-table-column>
            <el-table-column
                prop="totalProfit"
                :label="$t('merchantReport.column.platformFee')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ this.currencyIcon + row.orderProfit }}
              </div>
            </el-table-column>
            <el-table-column
                prop="time"
                :label="$t('merchantReport.column.recordDate')"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{ (getFormateDate(row.recordDate)) }}
              </div>
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
.title {
  /*margin-top: 1%;*/
  margin-top: 0;
  margin-left: 2%;
  font-size: 24px;
  font-weight: bold;
  background-color: white;
  padding-left: 10px;
  border-radius: 10px;
  width: 10%;
  color: deepskyblue;
}

.toolbar {
  margin-top: 1%;
  margin-left: 2%;
  background-color: white;
  height: 20%;
  width: 96%;
  border-radius: 15px;
  overflow: auto;
  display: flex;
  align-items: center;
}

.toolform {
  /*margin-left: 1%;*/
  height: 90%;
  padding: 0;
  width: 100%;
}

.toolform-item-filter {
  /*margin-top: 1%;*/
  height: 30%;
  margin-left: 2%;
  /*margin-right: 2%;*/
  /*margin-left: 2%;*/
  display: flex;
  justify-content: space-between;

  align-items: center;
}

.toolform-item {
  /*margin-top: 1%;*/
  height: 35%;
  /*margin-right: 2%;*/
  /*margin-left: 2%;*/
  display: flex;
  justify-content: space-between;

  align-items: center;
}

.toolform-input {
  background-color: transparent;
  border: solid 1px #6495ed;
  height: 70%;
  width: 300px;
  border-radius: 10px;
  text-align: center;
}

.toolform-line {
  height: 50px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
}

:deep(.report-tabs.el-tabs--border-card) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.report-tabs.el-tabs--border-card > .el-tabs__header) {
  border-radius: 12px 12px 0 0;
}

:deep(.report-tabs.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
  border-radius: 10px 10px 0 0;
}

:deep(.report-tabs .el-table) {
  border-radius: 12px;
  overflow: hidden;
}

.el-select .el-input_icon {
  font-size: 20px;
  transform: scale(1.5);
  border: 0;
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
}

.reportInfoForm {
  height: 100%;
}

.reportInfo-table {
  height: 100%;
  text-align: center;
}

.el-table .el-table_body-rapper {
  width: 100%;
  height: calc(100% - 23px);
}


.toolbarName {
  color: black;
}

.currency-tabs {
  margin-left: 1%;
}

</style>
