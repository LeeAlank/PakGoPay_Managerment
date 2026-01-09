
<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getDateFromTimestamp, getFormateDate, getTimeFromTimestamp} from "@/api/common.js";

</script>
<script>
import '@/api/common.css'
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
import '@/api/common.css'
import {ref} from "vue";
import {getAllCurrencyType, getMerchantReport} from "@/api/interface/backendInterface.js";
import {getTodayStartTimestamp, loadingBody} from "@/api/common.js";
export default {
  components: {
  },
  data() {
    return {
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      loadingInstance: null, // 用于存储loading实例
      activeTabPane: 0,
      starttingTime: '',
      endingTime: '',
      value:'',
      statisticsInfo:{},
      timeRange:'',
      filterbox: {
      },
      reportTitle : '代收订单订单总数｜代收订单成功率｜代收订单成功数｜代付订单总数｜代收订单成功率｜代收订单成功数｜代收/付商户手续费｜一二三级代理佣金｜代收/付总利润',
      tab1CurrentPage: 1,
      tab1TotalCount: 2,
      pageSizes: [1,5,10,15,30,50,100],
      tab1PageSize: 1,
      tab2CurrentPage: 1,
      tab2TotalCount: 2,
      tab2PageSize: 1,
      collectingReportInfoData: [

      ],
      payingReportInfoData: [

      ],
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
          merchantAccount: '测试商户'
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
          merchantAccount: '测试商户'
        }
      ],
    }
  },
  methods: {
    handleCurrencyChange() {
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency]
      this.filtersearch()
    },
    exportMerchantInfo() {
      //导出报表方法
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
      this.collectingReportInfoData = []
      this.payingReportInfoData = []
      this.activeTabPane = '0'
      this.search(0)
      this.filterbox.isNeeded = true
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
            this.statisticsInfo.totalAmount = this.currencyIcon+cardInfo.total;
            this.statisticsInfo.totalWithdrawlAmount = this.currencyIcon+cardInfo.withdraw;
            this.statisticsInfo.totalFreezeAmount = this.currencyIcon+cardInfo.frozen;
        } else if (res.status === 200 && res.data.code !== 0) {
          this.$notify({
            title: 'Error',
            message: res.data.message,
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
    /*loadingBody(loadingClassName) {
      this.loadingInstance = this.$loading({
        lock: true,       // 设置进入加载
        text: 'loading...',           // 加载文字
        // spinner: 'el-icon-loading',
        // background: 'rgba(255, 255, 255, 0.7)',
        target: document.querySelector('.'+loadingClassName).querySelector('.el-table__body') // 指定加载动画覆盖的DOM节点

      })
    },*/
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
  <div class="main-title" style="display: flex;flex-direction: row; align-items: center;">
      商户报表
  </div>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0" >
    <el-form-item style="margin-left: 2%;">
      <template #label>
          <span style="color: black;font-size: small;align-items: center">
            统计币种:
          </span>
      </template>
      <el-select
          style="width: 100px;align-items: center"
          :options="currencyOptions"
          :props="currencyProps"
          default-first-option
          v-model="filterbox.currency"
          @change="handleCurrencyChange"
          filterable
      />
    </el-form-item>
  </div>
  <!-- 统计数据展示 -->
  <div class="statistics-container" style="width: 95%;margin-right: 3%; padding: 0;margin-left: 0">
    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">总账户金额:</span>
          <textarea v-model="statisticsInfo.totalAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">提现总金额:</span>
          <textarea v-model="statisticsInfo.totalWithdrawlAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash-freeze" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">冻结总金额:</span>
          <textarea v-model="statisticsInfo.totalFreezeAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>
  <el-collapse style="margin-top: 1%; width: 95%;margin-left: 1%;margin-right: 3%">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="toolbar" style="height: auto">
        <el-form class="toolform" :model="filterbox" ref="filterForm">
          <el-row class="toolform-item">
            <el-col :span="8" class="toolform-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item label="商户名称:" label-width="150px" prop="merchantAccount">
                <el-input v-model="filterbox.merchantName" type="text" style="width: 200px;display: flex;text-align: center" placeholder="商户账号"/>
              </el-form-item>
            </el-col>
            <el-col :span="16" class="toolform-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item label="时间范围:" label-width="150px" prop="filterDateRange">
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
                <div style="display: flex;flex-direction: row">
                  <div v-on:click="reset('filterForm')" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="30px" name="reset"/>
                    <div style="width: 50px;color: white">重置</div>
                  </div>
                  <div v-on:click="filtersearch" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="30px" name="search"/>
                    <div style="width: 50px;color: white">查询</div>
                  </div>
                  <div v-on:click="exportMerchantInfo" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="30px" name="export"/>
                    <div style="width: 50px;color: white">导出</div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="reportInfo" style="margin-left: 1%;margin-right: 3%;margin-top: 1%;width: 95%;">
    <el-tabs type="border-card" style="width: 100%" @tab-click="handleTabClick" v-model="activeTabPane">
      <el-tab-pane label="代收报表" style="width: 100%">
        <form id="reportInfo" class="reportInfoForm" style="height: auto">
          <el-table
              border :data="collectingReportInfoData"
              class="reportInfo-table1"
              style="width: 100%"
              height="auto"
          >
            <el-table-column
                label="商户名称"
                v-slot="{row}"
                align="center"
                width="150px"
            >
              <div>
                {{row.merchantName}}
              </div>
            </el-table-column>
            <el-table-column
                prop="orderQuantity"
                label="代收订单总数"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.orderQuantity}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dsOrderSuccessRate"
                label="代收订单成功率"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%
              </div>
            </el-table-column>
            <el-table-column
                prop="successQuantity"
                label="代收订单成功数"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.successQuantity}}
              </div>
            </el-table-column>
            <el-table-column
                prop="merchantFee"
                label="代收商户手续费"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.merchantFee}}
              </div>
            </el-table-column>
            <el-table-column
                prop="agent1Fee"
                label="一级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.agent1Fee}}
              </div>
            </el-table-column>
            <el-table-column
                prop="agent2Fee"
                label="二级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.agent2Fee}}
              </div>
            </el-table-column>
            <el-table-column
                prop="agent3Fee"
                label="三级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.agent3Fee}}
              </div>
            </el-table-column>
            <el-table-column
                prop="orderProfit"
                label="代收总利润"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.orderProfit}}
              </div>
            </el-table-column>
            <el-table-column
                prop="recordDate"
                label="时间"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{(getFormateDate(row.recordDate))}}
              </div>
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
      <el-tab-pane label="代付报表"  style="width: 100%">
        <form id="reportInfo" class="reportInfoForm" style="height: auto">
          <el-table
              border :data="payingReportInfoData"
              class="reportInfo-table2"
              style="width: 100%"
              height="auto"
          >
            <el-table-column
                label="商户名称"
                v-slot="{row}"
                align="center"
                width="150px"
            >
              <div>
                {{row.merchantName}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderNumber"
                label="代付订单总数"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.orderQuantity}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderSuccessRate"
                label="代付订单成功率"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderSuccessNumber"
                label="代付订单成功数"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.successQuantity}}
              </div>
            </el-table-column>
            <el-table-column
                prop="commission"
                label="代付商户手续费"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.merchantFee}}
              </div>
            </el-table-column>
            <el-table-column
                prop="firstLevelAgentCommission"
                label="一级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.agent1Fee}}
              </div>
            </el-table-column>
            <el-table-column
                prop="secondLevelAgentCommission"
                label="二级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.agent2Fee}}
              </div>
            </el-table-column>
            <el-table-column
                prop="thirdLevelAgentCommission"
                label="三级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.agent3Fee}}
              </div>
            </el-table-column>
            <el-table-column
                prop="totalProfit"
                label="代付总利润"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{this.currencyIcon+row.orderProfit}}
              </div>
            </el-table-column>
            <el-table-column
                prop="time"
                label="代收总利润"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{(getFormateDate(row.recordDate))}}
              </div>
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
        </form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scoped>
  .title{
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

  .toolbar{
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

  .toolform{
    /*margin-left: 1%;*/
    height: 90%;
    padding: 0;
    width: 100%;
  }

  .toolform-item-filter{
    /*margin-top: 1%;*/
    height: 30%;
    margin-left: 2%;
    /*margin-right: 2%;*/
    /*margin-left: 2%;*/
    display: flex;
    justify-content: space-between;

    align-items: center;
  }

  .toolform-item{
    /*margin-top: 1%;*/
    height: 35%;
    /*margin-right: 2%;*/
    /*margin-left: 2%;*/
    display: flex;
    justify-content: space-between;

    align-items: center;
  }

  .toolform-input{
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

  .el-select .el-input_icon {
    font-size: 20px;
    transform: scale(1.5);
    border: 0;
  }
  .statistics-form{
    margin-left: 2%;
    margin-top: 1%;
    background-color: white;
    height: 150px;
    width: 500px;
    display: flex;
    align-items: center;
    border-radius: 20px;
  }

  .statistics-container{
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
     margin-left: 30px;
     margin-right: 50px;
  }

  .statistics-form-item{
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

  .reportInfo{
    margin-top: 1%;
    height: 60%;
    margin-left: 2%;
  }

  .reportInfoForm {
    height: 100%;
  }

  .reportInfo-table{
    height: 100%;
    text-align: center;
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