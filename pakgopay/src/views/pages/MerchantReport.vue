
<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getTimeFromTimestamp} from "@/api/common.js";

</script>
<script>
import '@/api/common.css'
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
import '@/api/common.css'
import {ref} from "vue";
const filterDateRange = ref('')
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
]
export default {
  components: {
    ElPagination
  },
  data() {
    return {
      value:'',
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
        {
          dsOrderNumber: '100000000000',
          dsOrderSuccessRate: '98%',
          dsOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: '测试商户'
        },
        {
          dsOrderNumber: '100000000000',
          dsOrderSuccessRate: '98%',
          dsOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: '测试商户2'
        }
      ],
      payingReportInfoData: [
        {
          dfOrderNumber: '99',
          dfOrderSuccessRate: '98%',
          dfOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: '测试商户'
        },
        {
          dfOrderNumber: '77',
          dfOrderSuccessRate: '98%',
          dfOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: '测试商户2'
        }
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
      this.tab1CurrentPage = currentPage
      let pageSize = this.pageSize
      // 清空table绑定数据
      this.collectingReportInfoData = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      this.collectingReportInfoData = this.allCollectingReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))
    },
    handleTab2SizeChange(pageSize) {
      this.tab2PageSize = pageSize
      this.tab2CurrentPage = 1
      this.handleTab2CurrentChange(1)
    },
    handleTab2CurrentChange(currentPage) {
      this.tab2CurrentPage = currentPage
      let pageSize = this.tab2PageSize
      // 清空table绑定数据
      this.payingReportInfoData = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      this.payingReportInfoData = this.allPayingReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))
    },
    getAllReportInfoData() {
      //获取所有数据
    },
    search() {

    }
  },
  mounted() {
    this.tab1TotalCount = this.collectingReportInfoData.length
    this.tab1TotalCount = this.collectingReportInfoData.length
    this.tab2TotalCount = this.payingReportInfoData.length
  }
}
</script>
<template>
  <div class="title">
    商户报表
  </div>
  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 2%;">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏&统计数据
        </span>
      </template>
      <div class="toolbar" style="height: auto">
        <el-form class="toolform">
          <el-row>
            <el-col :span="8" :offset="15" class="toolform-line" style="justify-content: right;margin-right:5%;">
              <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                <SvgIcon height="30px" width="30px" name="reset"/>
                <div style="width: 50px;color: white">重置</div>
              </div>
              <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                <SvgIcon height="30px" width="30px" name="search"/>
                <div style="width: 50px;color: white">查询</div>
              </div>
              <div v-on:click="exportMerchantInfo" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                <SvgIcon height="30px" width="30px" name="export"/>
                <div style="width: 50px;color: white">导出</div>
              </div>
            </el-col>
          </el-row>
          <el-row class="toolform-item">
<!--            <el-col :span="8"  style="display: flex;justify-content: center;align-items: center;">
              <el-form-item label="商户编号:" label-width="150px">
                <el-input v-model="filterbox.merchantNum" type="text" style="width: 200px;display: flex;text-align: center" placeholder="商户编号"/>
              </el-form-item>
            </el-col>-->
            <el-col :span="8" class="toolform-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item label="商户名称:" label-width="150px">
                <el-input v-model="filterbox.merchantAccount" type="text" style="width: 200px;display: flex;text-align: center" placeholder="商户账号"/>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="toolform-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item label="时间范围:" label-width="150px">
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
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 统计数据展示 -->
      <div class="statistics-container">
        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="cash" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;">
              <span style="text-align: left;font-size: x-large">总账户金额:</span>
              <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>

        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="tixian" width="90px" height="90px"/>
            <div style="display: flex; flex-direction: column;width: 80%;">
              <span style="text-align: left;font-size: x-large">提现总金额:</span>
              <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>

        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="cash-freeze" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;">
              <span style="text-align: left;font-size: x-large">冻结总金额:</span>
              <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="reportInfo" style="margin-right: 3%">
    <el-tabs type="border-card" style="width: 100%">
      <el-tab-pane label="代收报表" style="width: 100%">
        <form id="reportInfo" class="reportInfoForm">
          <el-table
              border :data="collectingReportInfoData"
              class="reportInfo-table"
              style="width: 100%"
              height="470"
          >
            <el-table-column
                label="商户名称"
                v-slot="{row}"
                align="center"
                width="150px"
            >
              <div>
                {{row.merchantAccount}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dsOrderNumber"
                label="代收订单总数"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.dsOrderNumber}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dsOrderSuccessRate"
                label="代收订单成功率"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.dsOrderSuccessRate}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dsOrderSuccessNumber"
                label="代收订单成功数"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.dsOrderSuccessNumber}}
              </div>
            </el-table-column>
            <el-table-column
                prop="commission"
                label="代收商户手续费"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.commission}}
              </div>
            </el-table-column>
            <el-table-column
                prop="firstAgentCommission"
                label="一级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.firstLevelAgentCommission}}
              </div>
            </el-table-column>
            <el-table-column
                prop="secondLevelAgentCommission"
                label="二级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.secondLevelAgentCommission}}
              </div>
            </el-table-column>
            <el-table-column
                prop="thirdLevelAgentCommission"
                label="三级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.thirdLevelAgentCommission}}
              </div>
            </el-table-column>
            <el-table-column
                prop="totalProfit"
                label="代收总利润"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.totalProfit}}
              </div>
            </el-table-column>
            <el-table-column
                prop="time"
                label="时间"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{getTimeFromTimestamp(row.time)}}
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
      <el-tab-pane label="代付报表">
        <form id="reportInfo" class="reportInfoForm">
          <el-table
              border :data="payingReportInfoData"
              class="reportInfo-table"
              style="width: 97%"
              height="470"
          >
            <el-table-column
                label="商户名称"
                v-slot="{row}"
                align="center"
                width="150px"
            >
              <div>
                {{row.merchantAccount}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderNumber"
                label="代付订单总数"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.dfOrderNumber}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderSuccessRate"
                label="代付订单成功率"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.dfOrderSuccessRate}}
              </div>
            </el-table-column>
            <el-table-column
                prop="dfOrderSuccessNumber"
                label="代付订单成功数"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.dfOrderSuccessNumber}}
              </div>
            </el-table-column>
            <el-table-column
                prop="commission"
                label="代付商户手续费"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.commission}}
              </div>
            </el-table-column>
            <el-table-column
                prop="firstLevelAgentCommission"
                label="一级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.firstLevelAgentCommission}}
              </div>
            </el-table-column>
            <el-table-column
                prop="secondLevelAgentCommission"
                label="二级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.secondLevelAgentCommission}}
              </div>
            </el-table-column>
            <el-table-column
                prop="thirdLevelAgentCommission"
                label="三级代理佣金"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.thirdLevelAgentCommission}}
              </div>
            </el-table-column>
            <el-table-column
                prop="totalProfit"
                label="代付总利润"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{row.totalProfit}}
              </div>
            </el-table-column>
            <el-table-column
                prop="time"
                label="代收总利润"
                v-slot="{row}"
                align="center"
            >
              <div>
                {{getTimeFromTimestamp(row.time)}}
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