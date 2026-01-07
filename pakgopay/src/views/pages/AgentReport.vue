<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">代理报表</div>
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
              <el-form-item label="时间范围:" label-width="150px" prop="timeRange">
                <div style="display: flex; flex-direction: row;">
                  <el-date-picker
                      v-model="filterTimeRange"
                      type="datetimerange"
                      :shortcuts="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="YYYY/MM/DD"
                      value-format="YYYY-MM-DD"
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
      <div class="statistics-container" style="justify-content: space-around">
        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="tixian" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;justify-items: right">
              <span style="text-align: left;font-size: x-large">代收总金额:</span>
              <textarea v-model="totalbox.income" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>

        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="paying" width="90px" height="90px"/>
            <div style="display: flex; flex-direction: column;width: 80%;">
              <span style="text-align: left;font-size: x-large">代付总金额:</span>
              <textarea v-model="totalbox.withdraw" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
    </el-collapse-item>
  </el-collapse>


  <div class="reportInfo" style="margin-left: 1%;margin-right: 3%;margin-top: 1%;width: 95%;">
    <el-button @click="exportMerchantInfo" style="margin:0;float: right">
      <SvgIcon height="20px" width="20px" name="export"/>
      <div style="color: black">导出</div>
    </el-button>
    <el-table
        border
        :data="agentReportData"
        class="merchantInfos-table"
        style="width: 100%;height: auto;"
        :key="tableKey"
    >
      <el-table-column
          prop="agentName"
          label="代理名称"
          v-slot="{row}"
          align="center"
          >
        <div>{{row.agentName}}</div>
      </el-table-column>
      <el-table-column
          prop="collectionOrderSuccessNumber"
          label="代收成功订单数"
          v-slot="{row}"
          align="center"
          >
        <div>{{row.collectionOrderSuccessNumber}}</div>
      </el-table-column>
      <el-table-column
          prop="collectionCommission"
          label="代收佣金"
          v-slot="{row}"
          align="center"
          >
        <div>{{row.collectionCommission}}</div>
      </el-table-column>
      <el-table-column
          prop="payingOrderSuccessNumber"
          label="代理名称"
          v-slot="{row}"
          align="center"
          >
        <div>{{row.payingOrderSuccessNumber}}</div>
      </el-table-column>
      <el-table-column
          prop=" payingOrderCommission"
          label="代理名称"
          v-slot="{row}"
          align="center"
      >
        <div>{{row.payingOrderCommission}}</div>
      </el-table-column>
      <el-table-column
          prop="time"
          label="时间"
          v-slot="{row}"
          align="center">
        <div>{{row.time}}</div>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="sizes, prev, pager, next, jumper, total"
        :total="totalCount"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        style="float:right; margin-right: 5%;"
        @current-change="handleChange"
        @size-change="handleSizeChange"
    >

    </el-pagination>
<!--    <el-tabs type="border-card">
      <el-tab-pane label="代收">
        <el-form style="width: 100%;">
          <el-table
              border
              :data="collectingReportInfoData"
              class="reportInfo-table"
              style="width: 100%"
              height="470"
          >
            <el-table-column
              label="代理名称"
              v-slot="{row}"
              align="center"
              prop="agentName"
            >
              <div>{{row.agentName}}</div>
            </el-table-column>
            <el-table-column
                label="代收订单总数"
                v-slot="{row}"
                align="center"
                prop="collectingOrderAmount"
            >
              <div>{{row.collectingOrderAmount}}</div>
            </el-table-column>
            <el-table-column
                label="代收订单佣金"
                v-slot="{row}"
                align="center"
                prop="collectingOrderCommission"
            >
              <div>{{row.collectingOrderCommission}}</div>
            </el-table-column>
            <el-table-column
                label="代收订单成功数"
                v-slot="{row}"
                align="center"
                prop="collectingOrderSuccessAmount"
            >
              <div>{{row.collectingOrderSuccessAmount}}</div>
            </el-table-column>
            <el-table-column
                label="代收订单失败数"
                v-slot="{row}"
                align="center"
                prop="collectingOrderFailureAmount"
            >
              <div>{{row.collectingOrderFailureAmount}}</div>
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
      <el-tab-pane label="代付">
        <el-form style="width: 100%;">
          <el-table
              border
              :data="payingReportInfoData"
              class="reportInfo-table"
              style="width: 100%"
              height="470"
          >
            <el-table-column
                label="代理名称"
                v-slot="{row}"
                align="center"
                prop="agentName"
            >
              <div>{{row.agentName}}</div>
            </el-table-column>
            <el-table-column
                label="代付订单总数"
                v-slot="{row}"
                align="center"
                prop="payingOrderAmount"
            >
              <div>{{row.payingOrderAmount}}</div>
            </el-table-column>
            <el-table-column
                label="代付订单佣金"
                v-slot="{row}"
                align="center"
                prop="collectingOrderCommission"
            >
              <div>{{row.payingOrderCommission}}</div>
            </el-table-column>
            <el-table-column
                label="代付订单成功数"
                v-slot="{row}"
                align="center"
                prop="payingOrderSuccessAmount"
            >
              <div>{{row.payingOrderSuccessAmount}}</div>
            </el-table-column>
            <el-table-column
                label="代收订单失败数"
                v-slot="{row}"
                align="center"
                prop="payingOrderFailureAmount"
            >
              <div>{{row.payingOrderFailureAmount}}</div>
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
      <el-tab-pane label="商户数据">
        <el-form style="width: 100%;">
          <el-table
              border
              :data="merchantReportInfoData"
              class="reportInfo-table"
              style="width: 100%"
              height="470"
              :span-method="aggregationRow"
          >
            <el-table-column
              label="代理名称"
              align="center"
              prop="agentName"
              v-slot="{row}"
            >
              <div>{{row.agentName}}</div>
            </el-table-column>
            <el-table-column
              label="商户名称"
              align="center"
              prop="merchantName"
              v-slot="{row}"
            >
              <div>{{row.merchantName}}</div>
            </el-table-column>
            <el-table-column
                label="商户代收订单总数"
                align="center"
                prop="merchantCollectingOrderAmount"
                v-slot="{row}"
            >
              <div>{{row.merchantCollectingOrderAmount}}</div>
            </el-table-column>
            <el-table-column
                label="商户代付订单总数"
                align="center"
                prop="merchantPayingOrderAmount"
                v-slot="{row}"
            >
              <div>{{row.merchantPayingOrderAmount}}</div>
            </el-table-column>
            <el-table-column
                label="商户代付订单成功率"
                align="center"
                prop="merchantPayingOrderSuccessRate"
                v-slot="{row}"
            >
              <div>{{row.merchantPayingOrderSuccessRate}}</div>
            </el-table-column>
            <el-table-column
                label="商户代收订单成功率"
                align="center"
                prop="merchantCollectingOrderSuccessRate"
                v-slot="{row}"
            >
              <div>{{row.merchantCollectingOrderSuccessRate}}</div>
            </el-table-column>
            <el-table-column
                label="商户代理佣金"
                align="center"
                prop="merchantAgentCommission"
                v-slot="{row}"
            >
              <div>{{row.merchantAgentCommission}}</div>
            </el-table-column>
          </el-table>
          <el-pagination
              background
              layout="sizes, prev, pager, next, jumper, total"
              :total="tab3TotalCount"
              v-model:current-page="tab3CurrentPage"
              v-model:page-size="tab3PageSize"
              :page-sizes="pageSizes"
              @current-change="handleTab3CurrentChange"
              @size-change="handleTab3SizeChange"
              style="float:right; margin-right: 5%;"
          >
          </el-pagination>
        </el-form>
      </el-tab-pane>
    </el-tabs>-->
  </div>
</template>

<script>
  import {ref} from "vue";

  const filterTimeRange = ref('')
  export default {
    data() {
      return {
        agentReportData: [],
        tableKey: 0,
        currentPage: 1,
        totalCount: 2,
        pageSizes: [5,10,15,30,50,100],
        pageSize: 5,
        filterbox: {
          pathChannelName: '',
          pathChannelLabelName: '',
          startTime: '',
          endTime: '',
        },
        totalbox: {
          income: "$10000000",
          withdraw: "$900",
          freeze: "$900",
        },
        /*reportInfoData: [
          {
            agentAccount: '代理商1',
            agentOrderSuccessNum: '1',
            payingCommission: '$10000000',
            collectionCommission: '$10000000',
            withdrawAmount: '$900',
            freezeAmount: '$900',
          }
        ],
        reportInfoData2: [
          {
            agentAccount: '代理商1',
            agentOrderSuccessNum: '1',
            payingCommission: '$10000000',
            collectionCommission: '$10000000',
            withdrawAmount: '$900',
            freezeAmount: '$900',
          },
          {
            agentAccount: '代理商2',
            agentOrderSuccessNum: '1',
            payingCommission: '$10000000',
            collectionCommission: '$10000000',
            withdrawAmount: '$900',
            freezeAmount: '$900',
          }
        ]*/
        collectingReportInfoData: [],
        collectingReportInfoDataTestData:[],
        payingReportInfoData: [],
        payingReportInfoDataTestData: [],
        merchantReportInfoData: [],
        merchantReportInfoDataTestData: [
          {
            agentName: '代理商一',
            merchantName: '商户一',
            merchantCollectingOrderAmount: 100,
            merchantPayingOrderAmount: 10,
            merchantPayingOrderSuccessRate: '99%',
            merchantCollectingOrderSuccessRate: '100%',
            merchantAgentCommission: '$1000000',
          },
          {
            agentName: '代理商一',
            merchantName: '商户二',
            merchantCollectingOrderAmount: 100,
            merchantPayingOrderAmount: 10,
            merchantPayingOrderSuccessRate: '90%',
            merchantCollectingOrderSuccessRate: '99.9%',
            merchantAgentCommission: '$999',
          },
          {
            agentName: "代理商二",
            merchantName: '商户三',
            merchantCollectingOrderAmount: 100,
            merchantPayingOrderAmount: 10,
            merchantPayingOrderSuccessRate: '85%',
            merchantCollectingOrderSuccessRate: '89%',
            merchantAgentCommission: '$1200108',
          },
          {
            agentName: '代理商三',
            merchantName: '商户四',
            merchantCollectingOrderAmount: 100,
            merchantPayingOrderAmount: 10,
            merchantPayingOrderSuccessRate: '97.1%',
            merchantCollectingOrderSuccessRate: '98.2%',
            merchantAgentCommission: '$2100910',
          },
          {
            agentName: '代理商三',
            merchantName: '商户五',
            merchantCollectingOrderAmount: 100,
            merchantPayingOrderAmount: 10,
            merchantPayingOrderSuccessRate: '99.9%',
            merchantCollectingOrderSuccessRate: '88.1%',
            merchantAgentCommission: '$2001000',
          },
        ],
      }
    },
    methods: {
      handleCurrentChange(currentPage) {

      },
      handleTab1CurrentChange(currentPage) {
        this.tab1CurrentPage = currentPage
        let pageSize = this.tab1PageSize
        // 清空table绑定数据
        this.collectingReportInfoData = []
        // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
        this.collectingReportInfoData = this.collectingReportInfoDataTestData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))
      },
      handleTab1SizeChange(currentPage) {

      },
      handleTab2CurrentChange(currentPage) {

      },
      handleTab2SizeChange(currentPage) {

      },
      handleTab3CurrentChange(currentPage) {

      },
      handleTab3SizeChange(currentPage) {

      },
      aggregationRow({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return {
            rowspan: row.rowspan,
            colspan: 1
            }
          }
        },
      setrowspans(data) {
        // 先给所有的数据都加一个v.rowspan = 1
        data.forEach(v => {
          v.rowspan = 1
        })
        // 双层循环
        for (let i = 0; i < data.length; i++) {
          // 内层循环，上面已经给所有的行都加了v.rowspan = 1
          // 这里进行判断
          // 如果当前行的id和下一行的id相等
          // 就把当前v.rowspan + 1
          // 下一行的v.rowspan - 1
          for (let j = i + 1; j < data.length; j++) {
            if (data[i].agentName === data[j].agentName) {
              data[i].rowspan++
              data[j].rowspan--
            }
          }
          // 这里跳过已经重复的数据
          i = i + data[i].rowspan - 1
        }
        this.collectingReportInfoData = []
        this.collectingReportInfoDataTestData =data
      }

    },
    mounted() {
      this.merchantReportInfoData = this.merchantReportInfoDataTestData
      this.setrowspans(this.merchantReportInfoData)
    }


  }
</script>
<style scoped>
@import "@/assets/base.css";
@import '@/api/common.css';

  .main-toolform-input {
    text-align: center;
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
    font-size: 30px;
    font-weight: bold;
    margin-left: 30px;
    text-align: left;
  }

  .reportInfo{
    margin-top: 1%;
    height: 60%;
    margin-left: 3%;
  }

  .reportInfoForm {
    height: 100%;
  }

  .reportInfo-table{
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