<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getTimeFromTimestamp, getTodayStartTimestamp} from "@/api/common.js";
</script>

<template>
  <div style="width: 100%; height: auto; overflow-y: visible;">
    <div class="main-title">{{ $t('withdrawlOrder.title') }}</div>
    <!-- 工具栏 -->
    <el-collapse v-model="activeTool">
      <el-collapse-item name="1">
        <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
        </template>
        <div class="main-toolbar" style="height: auto; width: 97%;">
          <el-form class="main-toolform withdrawl-order-toolform" style="height: 100%;" ref="filterboxForm" :model="filterbox">
            <el-row class="withdrawl-order-main-row">
              <el-col :span="6">
                <el-form-item :label="$t('withdrawlOrder.filter.orderId')" label-width="150px" prop="id">
                  <el-input v-model="filterbox.id" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="150px" :label="$t('withdrawlOrder.filter.userType')" prop="userType">
                  <el-radio-group :disabled="filterAvaiable" v-model="filterbox.userType" style="display: flex; flex-direction: row;">
                    <el-radio :label="$t('withdrawlOrder.userType.merchant')" :value="1"></el-radio>
                    <el-radio :label="$t('withdrawlOrder.userType.agent')" :value="2"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="filterbox.userType === 1" :span="6">
                <el-form-item :label="$t('withdrawlOrder.filter.merchant')" label-width="150px" prop="userId">
                  <el-select
                    :options="merchantOptions"
                    :props="merchantInfoProps"
                    v-model="filterbox.userId"
                    :disabled="filterAvaiable"
                    style="width: 200px"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="filterbox.userType === 2" :span="6">
                <el-form-item :label="$t('withdrawlOrder.filter.agent')" label-width="150px" prop="userId">
                  <el-select
                      :options="agentOptions"
                      :props="agentProps"
                      v-model="filterbox.userId"
                      :disabled="filterAvaiable"
                      style="width: 200px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="withdrawl-order-time-row">
              <el-col :span="12">
                <el-form-item :label="$t('withdrawlOrder.filter.createTime')" label-width="150px" prop="filterDateRange">
                  <!--                  <el-input v-model="filterbox.requestTime"style="width: 200px"/>-->
                  <DateTimeRangeSplit
                      v-model="filterbox.filterDateRange"
                      :clearable="false"
                      picker-type="datetime"
                      format="YYYY/MM/DD HH:mm:ss"
                      value-format="x"
                      picker-width="200px"
                      @change="handleDateRangeChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6" class="withdrawl-order-time-placeholder"></el-col>
            </el-row>
            <div class="toolbar-action-row">
              <el-button @click="search()" class="filterButton">
                <SvgIcon class="filterButtonSvg" name="search"/>
                <div>{{ $t('common.query') }}</div>
              </el-button>
              <el-button @click="reset('filterboxForm')" class="filterButton">
                <SvgIcon class="filterButtonSvg" name="reset"/>
                <div>{{ $t('common.reset') }}</div>
              </el-button>
            </div>
          </el-form>
        </div>
      </el-collapse-item>
</el-collapse>

    <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
      <div class="currency-tabs">
        <span class="currency-tabs-label">{{ $t('orderCommon.currencyStats') }}</span>
        <el-tabs
            v-model="staticsData.currencyType"
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

    <!-- 订单列表 -->
    <div class="reportInfo">
      <div class="main-views-form" style="width: auto;height:100%;">
        <el-table
            border :data="withdrawlOrderTableInfo"
            class="merchantInfos-table reportInfo-table1"
            style="height: auto;"
            :key="tableKey"
            max-height="90vh"
        >
          <el-table-column
              prop="orderId"
              :label="$t('withdrawlOrder.column.orderId')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.withdrawNo || row.serialNo || row.id }}</div>
          </el-table-column>
          <el-table-column
              prop="merchantAgentName"
              :label="$t('withdrawlOrder.column.userName')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ formatOrderUserName(row) }}</div>
          </el-table-column>
          <el-table-column
              prop="amount"
              :label="$t('withdrawlOrder.column.amount')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ formatWithdrawAmount(row) }}</div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              :label="$t('withdrawlOrder.column.status')"
              v-slot="{row}"
              align="center"
          >
            <div class="status-cell">
              <span :class="['status-dot', getOrderStatusClass(row.status)]"></span>
              <span>{{ formatOrderStatus(row.status) }}</span>
            </div>
          </el-table-column>
          <el-table-column
              prop="walletAddr"
              :label="$t('withdrawlOrder.column.walletAddr')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.walletAddr}}</div>
          </el-table-column>
          <el-table-column
              prop="createTime"
              :label="$t('withdrawlOrder.column.createTime')"
              v-slot="{row}"
              align="center"
          >
            <div>{{getTimeFromTimestamp(row.createTime)}}</div>
          </el-table-column>
          <el-table-column
              prop="applyer"
              :label="$t('withdrawlOrder.column.applyer')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.createBy}}</div>
          </el-table-column>
          <el-table-column
              prop="applyerIp"
              :label="$t('withdrawlOrder.column.applyerIp')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.requestIp}}</div>
          </el-table-column>
          <el-table-column
              prop="remark"
              :label="$t('withdrawlOrder.column.remark')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.remark || '-' }}</div>
          </el-table-column>
          <el-table-column
              v-slot="{row}"
              :label="$t('common.operation')"
              align="center"
              v-if="isAdmin"
          >
            <el-dropdown trigger="click">
              <SvgIcon name="more" width="30" height="30"/>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :disabled="row.status !== 0" @click="rejectWithdrawOrder(row)">{{ $t('withdrawlOrder.action.reject') }}</el-dropdown-item>
                  <el-dropdown-item :disabled="row.status !== 0" @click="approveWithdrawOrder(row)">{{ $t('withdrawlOrder.action.approve') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-table-column>
        </el-table>
        <el-pagination class="pageTool"
            background
            layout="sizes, prev, pager, next, jumper, total"
            :total="totalCount"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="pageSizes"
           
            @current-change="handleChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>

  <el-dialog
      v-model="approvalDialogVisible"
      :title="approvalDialogTitle"
      class="withdrawl-order-google-dialog"
      align-center
      width="420px"
  >
    <el-form
        ref="approvalFormRef"
        :model="approvalForm"
        :rules="approvalRules"
        label-width="110px"
        class="withdrawl-order-google-form"
    >
      <el-form-item :label="$t('common.googleCode')" prop="googleCode" class="withdrawl-order-google-code-item">
        <el-input v-model="approvalForm.googleCode" type="number" style="width: 200px" />
      </el-form-item>
      <el-form-item :label="$t('withdrawlOrder.form.remark')" prop="remark">
        <el-input
            v-model="approvalForm.remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('withdrawlOrder.placeholder.remark')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="approvalDialogVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="confirmApproval">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import {
  auditWithdrawOrder,
  getWithdrawOrderPage,
  getAgentInfo,
  getAllCurrencyType,
  getMerchantInfo
} from "@/api/interface/backendInterface.js";
import {loadingBody} from "@/api/common.js";
import { getTimeZoneOffsetMinutes } from "@/util/timezoneOptions.js";

export default {
  name: "WithdrawlOrder",
  data() {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 200],
      tableKey: 0,
      activeTool: "1",
      filterbox: {
        id: '',
        withdrawNo: '',
        userType: 1,
        userId: '',
        status: null,
        requestIp: '',
        pageNo: 1,
        pageSize: 10,
        orderStatus: '',
        orderId: '',
        orderChannel: '',
        merchantAccount: '',
        merchantName: '',
        orderType: '',
        createTime: '',
        merchantAgent: '',
        currency: '',
        orderAmount: '',
        platformOrderId: '',
        filterDateRange: [],
        filterDateRangeUtc: [],
        filterDateRangeLast: [],
        filterDateRangeUtcLast: [],
      },
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      merchantOptions: [],
      merchantInfoProps: {
        value: 'userId',
        label: 'accountName',
      },
      merchantMaps: {},
      agentOptions: [],
      agentProps: {
        value: "userId",
        label: "agentName"
      },
      filterAvaiable: false,
      isAdmin: false,
      agentMaps: {},
      approvalDialogVisible: false,
      approvalDialogTitle: '',
      approvalForm: {
        googleCode: '',
        remark: '',
        isAgree: true,
        withdrawNo: null,
        type: ''
      },
      approvalRules: {
        googleCode: [
          { required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }
        ],
        remark: [
          { validator: (rule, value, callback) => this.validateRequiredText(value, this.$t('withdrawlOrder.validation.remarkRequired'), callback), trigger: 'blur' }
        ]
      },
      staticsData: {
        orderTotalCount: 10000,
        ordereSuccessRate: '99.9%',
        merchantCommission: '',
        merchantEffectiveCommission: '',
        merchantFreezeAmount: '',
        merchantAvaiableAmount: '',
      },
      staticsRawData: {
        merchantCommission: 100000,
        merchantEffectiveCommission: 99990,
        merchantFreezeAmount: 1000,
        merchantAvaiableAmount: 99000,
      },
      withdrawlOrderTableInfo: [],
      withdrawlOrderFormInfo: []
    }
  },
  methods: {
    validateRequiredText(value, message, callback) {
      if (value === undefined || value === null || String(value).trim() === '') {
        callback(new Error(message));
        return;
      }
      callback();
    },
    applyRouteQueryFilters() {
      const query = this.$route?.query || {}
      const orderNo = query.orderNo
      if (orderNo) {
        this.filterbox.id = String(orderNo)
        this.filterbox.withdrawNo = String(orderNo)
      }
      const range = this.buildDayRangeFromTimestamp(query.timestamp)
      if (range) {
        this.filterbox.filterDateRange = range
        this.filterbox.filterDateRangeUtc = this.toUtcRange(range, this.timeZoneKey)
        this.filterbox.filterDateRangeLast = [...this.filterbox.filterDateRange]
        this.filterbox.filterDateRangeUtcLast = [...this.filterbox.filterDateRangeUtc]
      }
    },
    buildDayRangeFromTimestamp(rawTimestamp) {
      const ts = Number(rawTimestamp)
      if (!Number.isFinite(ts)) {
        return null
      }
      const normalized = String(Math.trunc(ts)).length === 10 ? ts * 1000 : ts
      const date = new Date(normalized)
      if (Number.isNaN(date.getTime())) {
        return null
      }
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime()
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0).getTime()
      return [dayStart, dayEnd]
    },
    getOrderStatusClass(status) {
      const map = {
        0: 'status-pending',
        1: 'status-fail',
        2: 'status-success'
      };
      return map[status] || 'status-other';
    },
    reset(form) {
      this.$refs[form].resetFields();
      this.filterbox.filterDateRangeUtc = []
      this.filterbox.startTime = null
      this.filterbox.endTime = null
      const roleName = localStorage.getItem('roleName');
      const userId = localStorage.getItem('userId') || '';
      if (roleName === 'agent') {
        this.filterbox.userType = 2;
        this.filterbox.userId = userId;
      } else if (roleName === 'merchant') {
        this.filterbox.userType = 1;
        this.filterbox.userId = userId;
      } else {
        this.filterbox.userType = 1;
      }
    },
    search() {
      const query = this.buildWithdrawOrderQuery()
      const range = (this.filterbox.filterDateRangeUtc && this.filterbox.filterDateRangeUtc.length === 2)
          ? this.filterbox.filterDateRangeUtc
          : this.filterbox.filterDateRange;
      if (range && range.length === 2) {
        query.startTime = Number(range[0]) / 1000;
        query.endTime = Number(range[1]) / 1000;
      }
      const loadingInstance = loadingBody(this, 'reportInfo-table1')
      getWithdrawOrderPage(query).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.withdrawlOrderTableInfo = allData.withdrawOrderDtoList || []
          this.totalCount = allData.totalNumber
          this.pageSize = allData.pageSize
          this.currentPage = allData.pageNo
        } else {
          this.$notify({
            title: this.$t('common.error'),
            message: res.data?.message || this.$t('common.requestFailed'),
            duration: 3000,
            type: 'error',
            position: 'bottom-right'
          })
        }
        loadingInstance.close()
      }).catch(error => {
        loadingInstance.close()
        this.$notify({
          title: this.$t('common.error'),
          message: error.message || this.$t('common.requestFailed'),
          duration: 3000,
          type: 'error',
          position: 'bottom-right'
        })
      })
    },
    buildWithdrawOrderQuery() {
      return {
        withdrawNo: this.filterbox.withdrawNo || this.filterbox.id || undefined,
        merchantAgentId: this.filterbox.userId || undefined,
        userRole: this.filterbox.userType === 1 ? 2 : this.filterbox.userType === 2 ? 4 : undefined,
        currency: this.filterbox.currency || undefined,
        status: this.filterbox.status ?? undefined,
        requestIp: this.filterbox.requestIp || undefined,
        pageNo: this.filterbox.pageNo,
        pageSize: this.filterbox.pageSize
      };
    },
    handleDateRangeChange(val) {
      if (!val || val.length !== 2) {
        this.filterbox.filterDateRangeUtc = [];
        return;
      }
      const normalized = this.clampRangeWithinSixMonths(val[0], val[1]);
      this.filterbox.filterDateRange = [...normalized];
      this.filterbox.filterDateRangeUtc = this.toUtcRange(normalized, this.timeZoneKey);
      this.filterbox.startTime = Number(this.filterbox.filterDateRangeUtc[0]) / 1000;
      this.filterbox.endTime = Number(this.filterbox.filterDateRangeUtc[1]) / 1000;
      this.filterbox.filterDateRangeLast = [...normalized];
      this.filterbox.filterDateRangeUtcLast = [...this.filterbox.filterDateRangeUtc];
    },
    clampRangeWithinSixMonths(startMs, endMs) {
      const start = new Date(Number(startMs));
      const limit = new Date(start.getTime());
      limit.setMonth(limit.getMonth() + 6);
      const safeEnd = Math.min(Number(endMs), limit.getTime());
      return [Number(startMs), Math.max(Number(startMs), safeEnd)];
    },
    parseOffsetMinutes(tz, referenceMs) {
      return getTimeZoneOffsetMinutes(tz, referenceMs);
    },
    toUtcRange(displayRange, tz) {
      return displayRange.map((ms) => {
        const offset = this.parseOffsetMinutes(tz, Number(ms));
        if (offset === null) return Number(ms);
        const localOffset = new Date(Number(ms)).getTimezoneOffset();
        return Number(ms) - localOffset * 60000 - offset * 60000;
      });
    },
    toDisplayRange(utcRange, tz) {
      return utcRange.map((ms) => {
        const offset = this.parseOffsetMinutes(tz, Number(ms));
        if (offset === null) return Number(ms);
        const localOffset = new Date(Number(ms)).getTimezoneOffset();
        return Number(ms) + offset * 60000 + localOffset * 60000;
      });
    },
    formatOrderStatus(status) {
      const statusMap = {
        0: this.$t('withdrawlOrder.status.pending'),
        1: this.$t('withdrawlOrder.status.rejected'),
        2: this.$t('withdrawlOrder.status.approved')
      };
      return statusMap[status] || status;
    },
    formatWithdrawAmount(row) {
      const rawAmount = row ? row.amount : null;
      if (rawAmount === null || rawAmount === undefined || rawAmount === '') {
        return rawAmount;
      }
      const currencyType = row.currencyType || row.currency || this.currency || this.filterbox.currencyType;
      const icon = this.currencyIcons[currencyType] || this.currencyIcon || '';
      return icon ? `${icon}${rawAmount}` : rawAmount;
    },
    formatOrderUserName(row) {
      if (!row) return '-';
      if (row.name) return row.name;
      if (row.userRole === 2 || row.userRole === '2') return this.merchantMaps[row.userId] || '-';
      if (row.userRole === 4 || row.userRole === '4') return this.agentMaps[row.userId] || '-';
      if (this.filterbox.userType === 1) return this.merchantMaps[row.userId] || '-';
      if (this.filterbox.userType === 2) return this.agentMaps[row.userId] || '-';
      return this.merchantMaps[row.userId] || this.agentMaps[row.userId] || '-';
    },
    approveWithdrawOrder(row) {
      if (!this.isAdmin) return
      this.openApprovalDialog(true, row)
    },
    openApprovalDialog(isAgree, row) {
      if (!this.isAdmin) return
      this.approvalDialogTitle = isAgree ? this.$t('withdrawlOrder.dialog.approveTitle') : this.$t('withdrawlOrder.dialog.rejectTitle');
      this.approvalForm = {
        googleCode: '',
        remark: '',
        isAgree,
        withdrawNo: row?.withdrawNo || row?.serialNo || row?.id,
        type: isAgree ? 'approve' : 'reject'
      };
      this.approvalDialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.approvalFormRef) {
          this.$refs.approvalFormRef.clearValidate();
        }
      });
    },
    confirmApproval() {
      this.$refs.approvalFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        const info = {
          withdrawNo: this.approvalForm.withdrawNo,
          status: this.approvalForm.isAgree ? 2 : 1,
          failReason: this.approvalForm.isAgree ? '' : this.approvalForm.remark,
          googleCode: this.approvalForm.googleCode,
          remark: this.approvalForm.remark,
          type: this.approvalForm.type
        };
        this.submit(info);
      });
    },
    resetApprovalForm() {
      this.approvalDialogVisible = false;
      this.approvalForm = {
        googleCode: '',
        remark: '',
        isAgree: true,
        withdrawNo: null,
        type: ''
      };
      this.$nextTick(() => {
        if (this.$refs.approvalFormRef) {
          this.$refs.approvalFormRef.clearValidate();
        }
      });
    },
    submit(info) {
      if (!this.isAdmin) return
      auditWithdrawOrder(info).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.$notify({
            title: this.$t('common.success'),
            type: 'success',
            duration: 3000,
            message: this.$t('withdrawlOrder.message.approveSuccess', { action: info.type })
          })
          this.search()
          this.resetApprovalForm()
        } else {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            duration: 3000,
            message: this.$t('withdrawlOrder.message.approveFailed', { action: info.type })
          })
        }

      })
    },
    rejectWithdrawOrder(row) {
      if (!this.isAdmin) return
      this.openApprovalDialog(false, row)
    },
    handleCurrencyChange(tab) {
      if (tab && tab.paneName !== undefined) {
        this.filterbox.currency = tab.paneName;
      }
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency] || '';
      this.currentPage = 1;
      this.filterbox.pageNo = 1;
      this.search();
    },
    handleChange(currentPage) {
      this.currentPage = currentPage;
      this.filterbox.pageNo = currentPage;
      this.filterbox.pageSize = this.pageSize
      this.search();
    },
    handleSizeChange(currentPageSize) {
      this.pageSize = currentPageSize;
      this.filterbox.pageSize = currentPageSize;
      this.filterbox.pageNo = 1
      this.currentPage = 1
      this.search();
    },
  },
  async mounted() {
    let roleName = localStorage.getItem('roleName');
    this.isAdmin = roleName === 'admin'
    let userName = localStorage.getItem('userId');
    if (roleName &&  roleName === 'agent') {
      this.filterbox.userType = 2
      this.filterAvaiable = true
      this.filterbox.userId = userName
    } else if (roleName &&  roleName === 'merchant') {
      this.filterbox.userType = 1
      this.filterAvaiable = true
      this.filterbox.userId = userName
    } else if (roleName &&  roleName === 'admin') {
      this.filterbox.userType = 1
    }
    const startMs = getTodayStartTimestamp() * 1000;
    const endMs = startMs + 86399 * 1000;
    if (!this.filterbox.filterDateRange || this.filterbox.filterDateRange.length !== 2) {
      this.filterbox.filterDateRange = [startMs, endMs];
      this.filterbox.filterDateRangeUtc = this.toUtcRange([startMs, endMs], this.timeZoneKey);
    }
    this.filterbox.filterDateRangeLast = [...this.filterbox.filterDateRange];
    this.filterbox.filterDateRangeUtcLast = [...this.filterbox.filterDateRangeUtc];
    this._timeZoneListener = (event) => {
      const nextZone = event.detail || localStorage.getItem("timeZone") || "UTC+8";
      const prevZone = this.timeZoneKey;
      let utcRange = this.filterbox.filterDateRangeUtc;
      if ((!utcRange || utcRange.length !== 2) && this.filterbox.filterDateRange?.length === 2) {
        utcRange = this.toUtcRange(this.filterbox.filterDateRange, prevZone);
      }
      this.timeZoneKey = nextZone;
      if (utcRange && utcRange.length === 2) {
        this.filterbox.filterDateRangeUtc = utcRange;
        this.filterbox.filterDateRange = this.toDisplayRange(utcRange, nextZone);
      }
      this.tableKey++;
    };
    window.addEventListener("timezone-change", this._timeZoneListener);
    await getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList;
        if (this.currencyOptions.length > 0) {
          this.currency = this.currencyOptions[0].currencyType;
          this.staticsData.currencyType = this.currencyOptions[0].currencyType;
          this.filterbox.currency = this.currencyOptions[0].currencyType;
          this.currencyIcons = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon;
          });
          this.currencyIcon = this.currencyIcons[this.currency] || '';
        }
      } else if (res.status !== 200 || res.data.code !== 0) {
        this.$notify({
          title: this.$t('common.failed'),
          type: 'error',
          duration: 3000,
          message: this.$t('currencyTypeList.message.getFailed')
        })
      }
    });
    await getMerchantInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.merchantOptions = JSON.parse(res.data.data).merchantInfoDtoList
        this.merchantOptions.forEach(merchant => {
          this.merchantMaps[merchant.userId] = merchant.accountName
        })
      }
    })

    getAgentInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.agentOptions = JSON.parse(res.data.data).agentInfoDtoList
        this.agentOptions.forEach(agent => {
          this.agentMaps[agent.userId] = agent.agentName
        })
      }
    })

    this.applyRouteQueryFilters()
    this.search()

   /* this.totalCount = this.withdrawlOrderTableInfo.length;
    if (this.totalCount===0) {
      return;
    }*/
    this.handleChange(this.currentPage);
    this.tableKey++
  },

  beforeUnmount() {
    if (this._timeZoneListener) {
      window.removeEventListener("timezone-change", this._timeZoneListener);
    }
  }
  ,
  watch: {
    '$route.query': {
      deep: true,
      handler() {
        this.applyRouteQueryFilters()
        this.search()
      }
    }
  }
}
</script>
<style scoped>
@import "@/assets/base.css";
.status-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-pending {
  background-color: #f5a623;
}

.status-success {
  background-color: #16a34a;
}

.status-fail {
  background-color: #ff4d4f;
}

.status-other {
  background-color: #9ca3af;
}

:deep(.main-toolbar .main-toolform.withdrawl-order-toolform > .withdrawl-order-main-row) {
  justify-content: center !important;
}

:deep(.main-toolbar .main-toolform.withdrawl-order-toolform > .withdrawl-order-main-row > .el-col) {
  justify-content: flex-start !important;
}

:deep(.main-toolbar .main-toolform.withdrawl-order-toolform > .withdrawl-order-time-row) {
  justify-content: center !important;
}

:deep(.main-toolbar .main-toolform.withdrawl-order-toolform > .withdrawl-order-time-row > .el-col) {
  display: flex;
  justify-content: flex-start !important;
}

:deep(.main-toolbar .main-toolform.withdrawl-order-toolform > .withdrawl-order-time-row > .withdrawl-order-time-placeholder) {
  display: block;
}

.withdrawl-order-google-form {
  margin-top: 8px;
}

.withdrawl-order-google-code-item {
  width: 310px;
  margin-left: auto;
  margin-right: auto;
}

.withdrawl-order-google-code-item :deep(.el-form-item__label-wrap) {
  flex: 0 0 auto;
}

.withdrawl-order-google-code-item :deep(.el-form-item__label) {
  width: 110px;
  justify-content: flex-end;
}

.withdrawl-order-google-code-item :deep(.el-form-item__content) {
  flex: 0 0 200px;
  max-width: 200px;
}

</style>
<style>


</style>
