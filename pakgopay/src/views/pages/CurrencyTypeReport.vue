<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate} from "@/api/common.js";
</script>

<template>
 <div class="main-title">{{ $t('currencyTypeReport.title') }}</div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="toolbar" style="width: 96%">
        <el-form class="main-toolform" ref="filterForm" :model="filterbox">
          <el-row>
            <el-col :offset="16" :span="8">
              <div style="display: flex; flex-direction: row;float: right">
                <el-button @click="reset('filterForm')" class="filterButton"><SvgIcon class="filterButtonSvg" name="reset"/>{{ $t('common.reset') }}</el-button>
                <el-button @click="filterSearch" class="filterButton"><SvgIcon class="filterButtonSvg" name="search"/>{{ $t('common.search') }}</el-button>
                <el-button @click="exportCurrencyInfo" class="filterButton"><SvgIcon class="filterButtonSvg" name="export"/>{{ $t('common.export') }}</el-button>
<!--                <el-button @click="openAddDialog" class="filterButton"><SvgIcon class="filterButtonSvg" name="add"/>新增</el-button>-->
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="4" :span="8">
              <el-form-item :label="$t('currencyTypeReport.filter.currency')" label-width="150px" prop="currency">
                <el-select
                    v-model="filterbox.currency"
                    :placeholder="$t('currencyTypeReport.placeholder.currency')"

                    style="width: 200px;"
                    :options="currencyOptions"
                    :props="currencyProps"
                >
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="150px" :label="$t('currencyTypeReport.filter.date')" prop="filterDateRange">
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
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>
    </el-collapse-item>
  </el-collapse>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
    <div style="display: flex;flex-direction: column;gap: 6px;margin-left: 2%;width: 96%;">
      <span style="color: black;font-size: small;">{{ $t('currencyTypeReport.currencyLabel') }}</span>
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
          <span style="text-align: left;font-size: x-large">{{ $t('currencyTypeReport.statistics.collectionAmount') }}</span>
          <textarea v-model="statisticsInfo.collectionCurrencyAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form" v-if="statisticsInfo.payingCard">
      <div class="statistics-form-item">
        <SvgIcon name="paying" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span style="text-align: left;font-size: x-large">{{ $t('currencyTypeReport.statistics.payoutAmount') }}</span>
          <textarea v-model="statisticsInfo.payingCurrencyAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>



  <div class="reportInfo">
    <el-tabs @tab-click="handleTabClick" v-model="activeTabPane">
      <el-tab-pane :label="$t('currencyTypeReport.tab.collection')" class="tabTable" style="width: 100%">
        <el-table
          :data="collectionCurrencyInfo"
          height="auto"
          border
          style="width: 100%"
          class="reportInfo-table1"
        >
          <el-table-column
            :label="$t('currencyTypeReport.column.currency')"
            prop="currencyType"
            align="center"
            v-slot="{row}"
          >
            <div>{{row.currency}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.collectionOrderTotal')"
              prop="orderQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.collectionSuccess')"
              prop="successQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.successQuantity}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.collectionFailed')"
              prop="failureQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity-row.successQuantity}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.successRate')"
              prop="successRate"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity===0 ? 0 : ((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%</div>
          </el-table-column>

          <el-table-column
              :label="$t('currencyTypeReport.column.orderAmount')"
              prop="orderBalance"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.orderBalance}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.collectionMerchantFee')"
              prop="merchantFee"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.merchantFee}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.platformFee')"
              prop="orderProfit"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.orderProfit}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.recordDate')"
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
      <el-tab-pane :label="$t('currencyTypeReport.tab.payout')" class="tabTable" style="width: 100%">
        <el-table
          :data="payingCurrencyInfo"
          height="auto"
          border
          class="reportInfo-table2"
        >
          <el-table-column
              :label="$t('currencyTypeReport.column.currency')"
              prop="currency"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.currency}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.payoutOrderTotal')"
              prop="orderQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.payoutSuccess')"
              prop="successQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.successQuantity}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.payoutFailed')"
              prop="failureQuantity"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity-row.successQuantity}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.successRate')"
              prop="successRate"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderQuantity === 0 ? 0 : ((row.successQuantity/row.orderQuantity)*100).toFixed(2)}}%</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.orderAmount')"
              prop="orderBalance"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.orderBalance}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.payoutMerchantFee')"
              prop="merchantFee"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.merchantFee}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.platformFee')"
              prop="orderProfit"
              align="center"
              v-slot="{row}"
          >
            <div>{{currencyIcon + row.orderProfit}}</div>
          </el-table-column>
          <el-table-column
              :label="$t('currencyTypeReport.column.recordDate')"
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
      :title="$t('currencyTypeReport.dialog.addTitle')"
      class="dialog"
      center
      width="60%"
      @closed="handleAddDialogClosed"
  >
    <el-form ref="addFormRef" :model="addCurrencyForm" :rules="addRules" class="form">
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item :label="$t('currencyTypeReport.form.currencyCode')" label-width="150px" prop="currencyType">
            <el-input v-model="addCurrencyForm.currencyType" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item :label="$t('currencyTypeReport.form.currencyName')" label-width="150px" prop="name">
            <el-input v-model="addCurrencyForm.name" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item :label="$t('currencyTypeReport.form.currencySymbol')" label-width="150px" prop="icon">
            <el-input v-model="addCurrencyForm.icon" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item :label="$t('currencyTypeReport.form.currencyAccuracy')" label-width="150px" prop="currencyAccuracy">
            <el-input type="number" v-model="addCurrencyForm.currencyAccuracy" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display: flex;justify-content: center;">
        <el-col :span="24" style="display: flex;justify-content: center;">
          <el-form-item :label="$t('currencyTypeReport.form.rateMode')" label-width="150px" prop="isRate">
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
          <el-form-item :label="$t('currencyTypeReport.form.exchangeRate')" label-width="150px" prop="exchangeRate">
            <el-input type="number" v-model="addCurrencyForm.exchangeRate" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelAddDialog">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitAddCurrency">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>

  <el-dialog
      v-model="googleDialogVisible"
      :title="$t('currencyTypeReport.dialog.googleTitle')"
      class="dialog"
      center
      width="30%"
      height="200px"
  >
    <el-form ref="googleFormRef" :rules="googleRule" :model="googleForm" style="height:100px;margin-top: 20px">
      <el-row>
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;">
          <el-form-item :label="$t('common.googleCode')" label-width="150px" prop="googleCode">
            <el-input v-model="googleForm.googleCode" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-right: 3%;height: 30px;">
      <el-button @click="cancelGoogleDialog">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="confirmAddCurrency">{{ $t('common.confirm') }}</el-button>
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
import { clearDraft, loadDraft, saveDraft } from "@/util/draft.js";

const filterDateRange = ref('')
const DRAFT_KEY_ADD = 'draft:CurrencyTypeReport:add'
export default {
  name: 'CurrencyTypeReport',
  data() {
    const validateExchangeRate = (rule, value, callback) => {
      if (this.addCurrencyForm.isRate === 2 && (value === '' || value === undefined)) {
        callback(new Error(this.$t('currencyTypeReport.validation.exchangeRateRequired')))
      } else {
        callback()
      }
    };
    const buildEmptyAddCurrencyForm = () => ({
      currencyType: '',
      name: '',
      icon: '',
      currencyAccuracy: '',
      isRate: 1,
      exchangeRate: ''
    })
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
      addCurrencyForm: buildEmptyAddCurrencyForm(),
      buildEmptyAddCurrencyForm,
      addRules: {
        currencyType: [
          { required: true, message: this.$t('currencyTypeReport.validation.currencyCodeRequired'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('currencyTypeReport.validation.currencyNameRequired'), trigger: 'blur' }
        ],
        icon: [
          { required: true, message: this.$t('currencyTypeReport.validation.currencySymbolRequired'), trigger: 'blur' }
        ],
        currencyAccuracy: [
          { required: true, message: this.$t('currencyTypeReport.validation.currencyAccuracyRequired'), trigger: 'blur' }
        ],
        exchangeRate: [
          { validator: validateExchangeRate, message: this.$t('currencyTypeReport.validation.exchangeRateRequired'), trigger: 'blur' }
        ]
      },
      googleForm: {
        googleCode: ''
      },
      googleRule: {
        googleCode: {
          required: true, trigger: 'blur', message: this.$t('common.googleCodeRequired')
        }
      },
      exchangeRateOptions: [
        {
          value: 1,
          label: this.$t('currencyTypeReport.rateMode.live')
        },
        {
          value: 2,
          label: this.$t('currencyTypeReport.rateMode.fixed')
        }
      ],
    }
  },
  watch: {
    addDialogVisible(visible) {
      if (visible) {
        this.loadAddDraft();
      }
    },
    addCurrencyForm: {
      handler() {
        if (!this.addDialogVisible) return;
        this.saveAddDraft();
      },
      deep: true
    }
  },
  methods: {
    saveAddDraft() {
      saveDraft(DRAFT_KEY_ADD, {
        addCurrencyForm: this.addCurrencyForm
      });
    },
    loadAddDraft() {
      const draft = loadDraft(DRAFT_KEY_ADD);
      if (draft && draft.addCurrencyForm) {
        this.addCurrencyForm = Object.assign(this.buildEmptyAddCurrencyForm(), draft.addCurrencyForm);
        this.$nextTick(() => {
          this.$refs.addFormRef?.clearValidate();
        });
      }
    },
    clearAddDraft() {
      clearDraft(DRAFT_KEY_ADD);
    },
    handleAddDialogClosed() {
      this.clearAddDraft();
      this.addCurrencyForm = this.buildEmptyAddCurrencyForm();
      this.$refs.addFormRef?.resetFields();
    },
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
      this.clearAddDraft();
      this.addCurrencyForm = this.buildEmptyAddCurrencyForm();
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
            this.clearAddDraft();
            this.$refs.googleFormRef?.resetFields();
            this.addCurrencyForm = this.buildEmptyAddCurrencyForm();
            this.$refs.addFormRef?.resetFields();
            this.refreshCurrencyOptions();
            this.$notify({
              title: this.$t('common.success'),
              type: 'success',
              message: this.$t('currencyTypeReport.message.addSuccess'),
              duration: 3000,
              position: 'bottom-right'
            })
          } else {
            this.$notify({
              title: this.$t('common.failed'),
              type: 'error',
              message: res.data.message || this.$t('currencyTypeReport.message.addFailed'),
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
      if (this.currencyOptions.length === 0) {
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
            title: this.$t('common.error'),
            message: response.data.message,
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
          const fileName = this.$t('exportCurrencyReportName') + getFormateTime()
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
      } else if (res.status !== 200 || res.data.code !== 0) {
        this.$notify({
          title: this.$t('common.failed'),
          type: 'error',
          duration: 3000,
          message: this.$t('currencyTypeList.message.getFailed')
        })
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
