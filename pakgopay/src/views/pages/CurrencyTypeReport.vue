<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate} from "@/api/common.js";
</script>

<template>
 <div class="main-title">币种报表</div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="toolbar" style="width: 96%">
        <el-form class="main-toolform" ref="filterForm" :model="filterbox">
          <el-row>
            <el-col :offset="16" :span="8">
              <div style="display: flex; flex-direction: row;float: right">
                <el-button @click="reset('filterForm')" class="filterButton"><SvgIcon class="filterButtonSvg" name="reset"/>重置</el-button>
                <el-button @click="filterSearch" class="filterButton"><SvgIcon class="filterButtonSvg" name="search"/>搜索</el-button>
                <el-button @click="exportCurrencyInfo" class="filterButton"><SvgIcon class="filterButtonSvg" name="export"/>导出</el-button>
<!--                <el-button @click="openAddDialog" class="filterButton"><SvgIcon class="filterButtonSvg" name="add"/>新增</el-button>-->
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="4" :span="8">
              <el-form-item label="币种:" label-width="150px" prop="currency">
                <el-select
                    v-model="filterbox.currency"
                    placeholder="请选择币种"

                    style="width: 200px;"
                    :options="currencyOptions"
                    :props="currencyProps"
                >
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="150px" label="日期:" prop="filterDateRange">
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
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>
    </el-collapse-item>
  </el-collapse>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
    <div style="display: flex;flex-direction: column;gap: 6px;margin-left: 2%;width: 96%;">
      <span style="color: black;font-size: small;">统计币种:</span>
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



  <div class="reportInfo">
    <el-tabs @tab-click="handleTabClick" v-model="activeTabPane">
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
            <div>{{row.orderQuantity===0 ? 0 : ((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%</div>
          </el-table-column>

          <el-table-column
              label="订单总金额"
              prop="orderBalance"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.orderBalance}}</div>
          </el-table-column>
          <el-table-column
              label="代收商户手续费"
              prop="merchantFee"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.merchantFee}}</div>
          </el-table-column>
          <el-table-column
              label="平台手续费"
              prop="orderProfit"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.orderProfit}}</div>
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
        <el-pagination class="pageTool"
            background
            layout="sizes, prev, pager, next, jumper, total"
            :total="tab1TotalCount"
            v-model:current-page="tab1CurrentPage"
            v-model:page-size="tab1PageSize"
            :page-sizes="pageSizes"
            @current-change="handleTab1CurrentChange"
            @size-change="handleTab1PageSizeChange"
           
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
            <div>{{row.successQuantity}}</div>
          </el-table-column>
          <el-table-column
              label="代付失败订单数"
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
            <div>{{row.orderQuantity === 0 ? 0 : ((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%</div>
          </el-table-column>
          <el-table-column
              label="订单总金额"
              prop="orderBalance"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.orderBalance}}</div>
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
              label="平台手续费"
              prop="orderProfit"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.orderProfit}}</div>
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
        <el-pagination class="pageTool"
            background
            layout="sizes, prev, pager, next, jumper, total"
            :total="tab2TotalCount"
            v-model:current-page="tab2CurrentPage"
            v-model:page-size="tab2PageSize"
            :page-sizes="pageSizes"
            @current-change="handleTab2CurrentChange"
            @size-change="handleTab2PageSizeChange"
           
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>

  <el-dialog
      v-model="addDialogVisible"
      title="新增币种"
      class="dialog"
      center
      width="60%"
  >
    <el-form ref="addFormRef" :model="addCurrencyForm" :rules="addRules" class="form">
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item label="币种英文简称:" label-width="150px" prop="currencyType">
            <el-input v-model="addCurrencyForm.currencyType" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item label="币种名称:" label-width="150px" prop="name">
            <el-input v-model="addCurrencyForm.name" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item label="币种符号:" label-width="150px" prop="icon">
            <el-input v-model="addCurrencyForm.icon" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item label="币种最小单位:" label-width="150px" prop="currencyAccuracy">
            <el-input type="number" v-model="addCurrencyForm.currencyAccuracy" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item label="对USDT汇率模式:" label-width="150px" prop="isRate">
            <el-select v-model="addCurrencyForm.isRate" style="width: 200px;text-align: center">
              <el-option
                  v-for="item in exchangeRateOptions"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="addCurrencyForm.isRate === 2">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item label="对USDT汇率:" label-width="150px" prop="exchangeRate">
            <el-input type="number" v-model="addCurrencyForm.exchangeRate" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelAddDialog">取 消</el-button>
      <el-button type="primary" @click="submitAddCurrency">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog
      v-model="googleDialogVisible"
      title="谷歌验证"
      class="dialog"
      center
      width="30%"
      height="200px"
  >
    <el-form ref="googleFormRef" :rules="googleRule" :model="googleForm" style="height:100px;margin-top: 20px">
      <el-row>
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;">
          <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
            <el-input v-model="googleForm.googleCode" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-right: 3%;height: 30px;">
      <el-button @click="cancelGoogleDialog">取 消</el-button>
      <el-button type="primary" @click="confirmAddCurrency">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {ref} from "vue";
import {
  addCurrencyType,
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
    const validateExchangeRate = (rule, value, callback) => {
      if (this.addCurrencyForm.isRate === 2 && (value === '' || value === undefined)) {
        callback(new Error('固定汇率模式下对USDT汇率为必填项'))
      } else {
        callback()
      }
    };
    return {
      orderType: 0,
      activeTool: "1",
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
      pageSizes: [10, 20, 50, 100, 200],
      tab1PageSize:10,
      tab2PageSize:10,
      filterbox: {},
      addDialogVisible: false,
      googleDialogVisible: false,
      addCurrencyForm: {
        currencyType: '',
        name: '',
        icon: '',
        currencyAccuracy: '',
        isRate: 1,
        exchangeRate: ''
      },
      addRules: {
        currencyType: [
          { required: true, message: '请输入币种英文简称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入币种名称', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入币种符号', trigger: 'blur' }
        ],
        currencyAccuracy: [
          { required: true, message: '请输入币种最小单位', trigger: 'blur' }
        ],
        exchangeRate: [
          { validator: validateExchangeRate, message: '请输入对USDT汇率', trigger: 'blur' }
        ]
      },
      googleForm: {
        googleCode: ''
      },
      googleRule: {
        googleCode: {
          required: true, trigger: 'blur', message: 'googleCode is required'
        }
      },
      exchangeRateOptions: [
        {
          value: 1,
          label: '实时汇率'
        },
        {
          value: 2,
          label: '固定汇率'
        }
      ],
    }
  },
  methods: {
    reset(form){
      this.$refs[form].resetFields();
    },
    async refreshCurrencyOptions() {

    },
    openAddDialog() {
      this.addDialogVisible = true;
    },
    cancelAddDialog() {
      this.addDialogVisible = false;
      this.$refs.addFormRef?.resetFields();
    },
    submitAddCurrency() {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          this.googleDialogVisible = true;
        }
      })
    },
    cancelGoogleDialog() {
      this.googleDialogVisible = false;
      this.$refs.googleFormRef?.resetFields();
    },
    confirmAddCurrency() {
      this.$refs.googleFormRef.validate(valid => {
        if (!valid) {
          return;
        }
        const payload = Object.assign({}, this.addCurrencyForm, this.googleForm)
        addCurrencyType(payload).then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.googleDialogVisible = false;
            this.addDialogVisible = false;
            this.$refs.googleFormRef?.resetFields();
            this.$refs.addFormRef?.resetFields();
            this.refreshCurrencyOptions();
            this.$notify({
              title: 'Success',
              type: 'success',
              message: '新增币种成功',
              duration: 3000,
              position: 'bottom-right'
            })
          } else {
            this.$notify({
              title: 'Failed',
              type: 'error',
              message: res.data.message || '新增币种失败',
              duration: 3000,
              position: 'bottom-right'
            })
          }
        })
      })
    },
    handleCurrencyChange(tab) {
      if (tab && tab.paneName !== undefined) {
        this.filterbox.currency = tab.paneName
      }
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
        this.orderType = 0;
        this.search(0, tab.paneName)
      } else if (tab.paneName === '1') {
        this.orderType = 1;
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
        this.filterbox.endTime = getTodayStartTimestamp() + 86399
      } else {
        this.filterbox.startTime = timeRange.split(',')[0]/1000
        this.filterbox.endTime = timeRange.split(',')[1]/1000 + 86399
      }
      if (!orderType) {
        this.filterbox.orderType = 0;
        this.orderType = 0
      } else {
        this.filterbox.orderType = orderType
      }

      getCurrencyReport(this.filterbox).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          let resData = JSON.parse(response.data.data)
          const cardInfo = resData.cardInfo[this.filterbox.currency]
          if (orderType === 0) {
            this.collectionCurrencyInfo = resData.currencyReportDtoList
            this.tab1CurrentPage = resData.pageNo
            this.tab1TotalCount = resData.totalNumber
            this.tab1PageSize = resData.pageSize
            this.statisticsInfo.collectionCurrencyAmount = this.currencyIcon + cardInfo.total
            this.statisticsInfo.collectionCard = true
            this.statisticsInfo.payingCard = false
          } else if (orderType === 1) {
            this.payingCurrencyInfo = resData.currencyReportDtoList
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
        this.filterbox.endTime = timeRange.split(',')[1] / 1000 + 86399
      } else {
        this.filterbox.startTime = getTodayStartTimestamp()
        this.filterbox.endTime = getTodayStartTimestamp() + 86399
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
      this.filterbox.pageNo =  1
      this.filterbox.pageSize = pageSize
      this.search(this.orderType)
      //this.handleTab1CurrentChange(1)
    },
    handleTab2PageSizeChange(pageSize) {
      this.tab2PageSize = pageSize
      this.tab2CurrentPage = 1
      this.filterbox.pageNo =  1
      this.filterbox.pageSize = pageSize
      this.search(this.orderType)
    }
  },
  async mounted() {

    getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
        if (!this.filterbox.currency && this.currencyOptions.length > 0) {
          this.currency = this.currencyOptions[0].currencyType
          this.filterbox.currency = this.currencyOptions[0].currencyType
        }
        this.currencyIcons = {};
        this.currencyOptions.forEach(currency => {
          this.currencyIcons[currency.currencyType] = currency.icon
        })
        let iconKey = this.currency;
        this.currencyIcon = this.currencyIcons[iconKey] || ''
        this.statisticsInfo.collectionCurrencyAmount = (this.currencyIcon || '') + 0;
        this.statisticsInfo.payingCurrencyAmount = (this.currencyIcon || '') + 0;

        this.startTime = getTodayStartTimestamp()
        this.endTime = getTodayStartTimestamp()+86399
        this.filterbox.isNeedCardData = true
        this.activeTabPane = '0'
        this.search(0, '0')
      } else {
      }
    })
  }
}
</script>
<style scoped>
@import "@/assets/base.css";

.toolbar {
  margin-left: 2%;
  margin-top: 1%;
}

.tabTable {
  height: 700px;
  width: 97%;
}
</style>
