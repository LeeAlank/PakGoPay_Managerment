<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {
  getCallBackStatus,
  getOrderStatus, getOrderStatusOptions, getTimeFromTimestamp,
} from "@/api/common.js";
</script>

<template>
  <div style="width: 100%; height: auto; overflow-y: visible;">
    <div class="main-title">{{ $t('collectingOrder.title') }}</div>
    <el-collapse v-model="activeTool">
      <el-collapse-item name="1">
        <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
        </template>
        <div class="main-toolbar" style="height: 230px;width: 97%;">
          <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
            <el-row>
              <el-col :offset="18" :span="6">
                <div class="toolbar-action-row" style="margin-right: 180px;">
                  <el-button @click="search()" class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>{{ $t('common.query') }}</div>
                  </el-button>
                  <el-button @click="reset('filterboxForm')" class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="reset"/>
                    <div>{{ $t('common.reset') }}</div>
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.orderStatus')" label-width="150px" prop="orderStatus">
<!--                  <el-input v-model="filterbox.orderStatus" style="width: 200px"/>-->
                  <el-select
                    :options="getOrderStatusOptions()"
                    v-model="filterbox.orderStatus"
                    style="width: 200px"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.merchantOrderNo')" label-width="150px" prop="merchantOrderNo">
                  <el-input v-model="filterbox.merchantOrderNo" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.channel')" label-width="150px" prop="channelId">
<!--                  <el-input v-model="filterbox.channelId" style="width: 200px"/>-->
                  <el-select
                    :options="channelOptions"
                    :props="channelProps"
                    v-model="filterbox.channelId"
                    style="width: 200px"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.merchant')" label-width="150px" prop="merchantUserId">
<!--                  <el-input v-model="filterbox.merchantUserId" style="width: 200px"/>-->
                  <el-select
                    :options="merchantOptions"
                    :props="merchantInfoProps"
                    v-model="filterbox.merchantUserId"
                    :placeholder="$t('collectingOrder.placeholder.merchant')"
                    style="width: 200px"
                    clearable
                    :disabled="filterAvaiable"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.transactionNo')" label-width="150px" prop="transactionNo">
                  <el-input v-model="filterbox.transactionNo" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.orderType')" label-width="150px" >
<!--                  <el-input v-model="filterbox.orderType" style="width: 200px"/>-->
                  <el-select
                    v-model="filterbox.orderType"
                    style="width: 200px"
                    clearable
                  >
                    <el-option :value="1" :label="$t('collectingOrder.orderType.system')"></el-option>
                    <el-option :value="2" :label="$t('collectingOrder.orderType.manual')"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.amount')" label-width="150px" prop="amount">
                  <el-input v-model="filterbox.amount" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.merchantAgent')" label-width="150px" >
                  <el-input v-model="filterbox.merchantAgent" style="width: 200px"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item :label="$t('common.currency')" label-width="150px" prop="currency">
                  <el-select
                      :options="currencyOptions"
                      :props="currencyProps"
                      v-model="filterbox.currency"
                      :placeholder="$t('collectingOrder.placeholder.currency')"
                      style="width: 200px"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('collectingOrder.filter.createTime')" label-width="150px" prop="filterDateRange">
<!--                  <el-input v-model="filterbox.requestTime"style="width: 200px"/>-->
                  <el-date-picker
                      v-model="filterbox.filterDateRange"
                      type="datetimerange"
                      :range-separator="$t('common.rangeSeparator')"
                      :start-placeholder="$t('common.startDate')"
                      :end-placeholder="$t('common.endDate')"
                      format="YYYY/MM/DD HH:mm:ss"
                      value-format="x"
                      @change="handleDateRangeChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
      <div class="currency-tabs">
        <span class="currency-tabs-label">{{ $t('orderCommon.currencyStats') }}</span>
        <el-tabs
            v-model="filterbox.currencyType"
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
    <!-- 卡片信息 -->
    <div>
      <div style="display: flex; justify-content: space-between;">
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-left: 3%;">
          <div style="display: flex;">
            <SvgIcon name="orderNum" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">{{ $t('orderCommon.stats.totalOrders') }}</span>
              <textarea v-model="staticsData.orderTotalCount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;">
          <div style="display: flex;">
            <SvgIcon name="merchantCommission" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">{{ $t('orderCommon.stats.merchantFee') }}</span>
              <textarea v-model="staticsData.merchantCommission" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-right: 4%;">
          <div style="display: flex;">
            <SvgIcon name="freezeAmount" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">{{ $t('orderCommon.stats.frozenAmount') }}</span>
              <textarea v-model="staticsData.merchantFreezeAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-left: 3%;">
          <div style="display: flex;">
            <SvgIcon name="orderSuccessRate" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">{{ $t('orderCommon.stats.successRate') }}</span>
              <textarea v-model="staticsData.ordereSuccessRate" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;">
          <div style="display: flex;">
            <SvgIcon name="effectiveCommission" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">{{ $t('orderCommon.stats.effectiveFee') }}</span>
              <textarea v-model="staticsData.merchantEffectiveCommission" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-right: 4%;">
          <div style="display: flex;justify-content: space-between">
            <SvgIcon name="accountBalance" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%;justify-content: space-between;">
              <span class="statics-title">{{ $t('orderCommon.stats.availableAmount') }}</span>
              <textarea v-model="staticsData.merchantAvaiableAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="reportInfo">
      <div class="main-views-form" style="width: auto;height:100%;">
        <div style="display: flex; float: right">
          <el-button @click="createPathChannel()" class="filterButton">
            <SvgIcon class="filterButtonSvg" name="createOrder"/>
            <div>{{ $t('orderCommon.action.createOrder') }}</div>
          </el-button>
<!--          <div v-on:click="createPathChannel()" style="background-color: limegreen;width:100px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="22px" name="callBack"/>
            <div style="width: 80px;height:30px;color: white;display: flex;align-items: center">批量回调</div>
          </div>-->
        </div>
        <el-table
            border
            :data="collectingOrderTableInfo"
            class="merchantInfos-table"
            style="width: 100%;height: auto"
            :key="tableKey"
            max-height="90vh"
        >
          <el-table-column
              prop="orderId"
              :label="$t('collectingOrder.column.orderId')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.transactionNo}}</div>
          </el-table-column>
          <el-table-column
              prop="merchantOrderId"
              :label="$t('collectingOrder.column.merchantOrderNo')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.merchantOrderNo}}</div>
          </el-table-column>
          <el-table-column
              prop="merchantAccount"
              :label="$t('collectingOrder.column.merchantNo')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.merchantUserId}}</div>
          </el-table-column>
          <el-table-column
              prop="merchantName"
              :label="$t('collectingOrder.column.merchantName')"
              v-slot="{row}"
              align="center"
          >
            <div>{{merchantMaps[row.merchantUserId]}}</div>
          </el-table-column>
          <el-table-column
              prop="currencyType"
              :label="$t('collectingOrder.column.currency')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.currencyType}}</div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              :label="$t('collectingOrder.column.status')"
              v-slot="{row}"
              align="center"
          >
            <div class="status-cell">
              <span :class="['status-dot', getOrderStatusClass(row.orderStatus)]"></span>
              <span>{{getOrderStatus(row.orderStatus)}}</span>
            </div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              :label="$t('collectingOrder.column.orderType')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.orderType === 1 ? $t('collectingOrder.orderType.system') : $t('collectingOrder.orderType.manual') }}</div>
          </el-table-column>
          <el-table-column
              prop="orderAmount"
              :label="$t('collectingOrder.column.amount')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.amount}}</div>
          </el-table-column>
          <el-table-column
              prop="channelId"
              :label="$t('collectingOrder.column.channel')"
              v-slot="{row}"
              align="center"
          >
            <div>{{channelMaps[row.channelId]}}</div>
          </el-table-column>
          <el-table-column
              prop="paymentNo"
              :label="$t('collectingOrder.column.paymentNo')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.paymentNo}}</div>
          </el-table-column>
          <el-table-column
              prop="callBackStatus"
              :label="$t('collectingOrder.column.callbackStatus')"
              v-slot="{row}"
              align="center"
          >
            <div>{{getCallBackStatus(row.callBackStatus)}}</div>
          </el-table-column>
          <el-table-column
              prop="createTime"
              :label="$t('collectingOrder.column.createTime')"
              v-slot="{row}"
              align="center"
          >
            <div>{{getTimeFromTimestamp(row.requestTime)}}</div>
          </el-table-column>
          <el-table-column
              prop="orderId"
              :label="$t('collectingOrder.column.requestIp')"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.requestIP}}</div>
          </el-table-column>
          <el-table-column
              width="100"
              :label="$t('common.operation')"
              align="center"
              v-slot="{row}"
              fixed="right"
          >
            <el-dropdown v-if="row.orderStatus !== '2' && row.orderStatus !== '3'" trigger="click">
              <SvgIcon name="more" width="30" height="30" />
              <template #dropdown>
                <el-dropdown-menu>
<!--                  <el-dropdown-item v-if="row.orderStatus === 1" @click="startUser(row)">{{ $t('collectingOrder.action.review') }}</el-dropdown-item>-->
<!--                  <el-dropdown-item @click="editUser(row)">编辑</el-dropdown-item>-->
                  <el-dropdown-item @click="callback(row)">{{ $t('collectingOrder.action.callback') }}</el-dropdown-item>
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
</template>
<script>
import {
  getAllCurrencyType,
  getChannelInfo,
  getCollectionOrder,
  getMerchantInfo,
  queryOpsOrderCardInfo
} from "@/api/interface/backendInterface.js";

export default {
  data() {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 200],
      activeToolBar: true,
      tableKey: 0,
      timeZoneKey: localStorage.getItem("timeZone") || "UTC+8",
      activeNames: '',
      activeTool: "1",
      checked: false,
      checkAll: false,
      filterAvaiable: false,
      filterbox: {
        filterDateRange: [],
        filterDateRangeUtc: [],
      },
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      channelOptions: [],
      channelProps: {
        value: 'channelId',
        label: 'channelName',
      },
      channelMaps:{},
      merchantOptions: [],
      merchantMaps: {},
      merchantInfoProps: {
        value: 'userId',
        label: 'accountName',
      },
      staticsData: {
        orderTotalCount: '',
        ordereSuccessRate: '',
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
      collectingOrderTableInfo: [],
      /*collectingOrderFormInfo: [
        {
          orderId: 'DF001',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '1000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        },
        {
          orderId: 'DF002',
          merchantOrderId: 'SN002',
          merchantAccount: 'lee01',
          merchantName: '商户一',
          currencyType: '马币',
          orderStatus: 1,
          orderAmount: '10000',
          callBackStatus: '1',
          createTime: '2025-12-12',
          requestIP: '127.0.0.1',
        }
      ],*/
    }
  },
  methods: {
    buildCardQueryPayload() {
      const roleName = localStorage.getItem('roleName');
      let scopeType = 0;
      if (roleName === 'merchant') scopeType = 1;
      if (roleName === 'agent') scopeType = 2;
      const scopeId = scopeType === 0 ? 0 : (localStorage.getItem('userId') || 0);
      const currency = this.filterbox.currencyType || this.currency || this.filterbox.currency || '';
      return {
        currency,
        scopeType,
        scopeId,
        orderType: 0
      };
    },
    fetchCardInfo() {
      const payload = this.buildCardQueryPayload();
      return queryOpsOrderCardInfo(payload).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const card = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data;
          this.staticsRawData = {
            merchantCommission: card?.merchantFee ?? 0,
            merchantEffectiveCommission: card?.validMerchantFee ?? 0,
            merchantFreezeAmount: card?.frozenAmount ?? 0,
            merchantAvaiableAmount: card?.availableAmount ?? 0,
          };
          this.staticsData.orderTotalCount = (card?.orderQuantity ?? 0);
          this.staticsData.ordereSuccessRate = this.formatSuccessRate(card?.successRate);
          this.applyCurrencyToStatics();
        } else {
          this.staticsRawData = {
            merchantCommission: 0,
            merchantEffectiveCommission: 0,
            merchantFreezeAmount: 0,
            merchantAvaiableAmount: 0,
          };
          this.staticsData.orderTotalCount = 0;
          this.staticsData.ordereSuccessRate = this.formatSuccessRate(0);
          this.applyCurrencyToStatics();
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('orderCommon.message.cardFetchFailed'),
            duration: 3000,
            position: 'bottom-right',
            type: 'error',
          })
        }
      }).catch(() => {
        this.staticsRawData = {
          merchantCommission: 0,
          merchantEffectiveCommission: 0,
          merchantFreezeAmount: 0,
          merchantAvaiableAmount: 0,
        };
        this.staticsData.orderTotalCount = 0;
        this.staticsData.ordereSuccessRate = this.formatSuccessRate(0);
        this.applyCurrencyToStatics();
        this.$notify({
          title: this.$t('common.error'),
          message: this.$t('orderCommon.message.cardFetchFailed'),
          duration: 3000,
          position: 'bottom-right',
          type: 'error',
        })
      });
    },
    formatSuccessRate(value) {
      const num = Number(value);
      if (!Number.isFinite(num)) {
        return '0.0%';
      }
      return `${(num * 100).toFixed(1)}%`;
    },
    getOrderStatusClass(status) {
      const map = {
        '0': 'status-pending',
        '1': 'status-processing',
        '2': 'status-success',
        '3': 'status-fail',
        '4': 'status-timeout',
        '5': 'status-cancel'
      };
      return map[String(status)] || 'status-other';
    },
    handleDateRangeChange(val) {
      if (!val || val.length !== 2) {
        this.filterbox.filterDateRangeUtc = [];
        return;
      }
      this.filterbox.filterDateRangeUtc = this.toUtcRange(val, this.timeZoneKey);
    },
    parseOffsetMinutes(tz) {
      const match = String(tz || '').match(/UTC\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?/i);
      if (!match) {
        return null;
      }
      const sign = match[1] === '-' ? -1 : 1;
      const hours = parseInt(match[2], 10);
      const minutes = match[3] ? parseInt(match[3], 10) : 0;
      return sign * (hours * 60 + minutes);
    },
    toUtcRange(displayRange, tz) {
      const offset = this.parseOffsetMinutes(tz);
      if (offset === null) {
        return displayRange;
      }
      return displayRange.map((ms) => {
        const localOffset = new Date(Number(ms)).getTimezoneOffset();
        return Number(ms) - localOffset * 60000 - offset * 60000;
      });
    },
    toDisplayRange(utcRange, tz) {
      const offset = this.parseOffsetMinutes(tz);
      if (offset === null) {
        return utcRange;
      }
      return utcRange.map((ms) => {
        const localOffset = new Date(Number(ms)).getTimezoneOffset();
        return Number(ms) + offset * 60000 + localOffset * 60000;
      });
    },
    search() {
      const range = (this.filterbox.filterDateRangeUtc && this.filterbox.filterDateRangeUtc.length === 2)
        ? this.filterbox.filterDateRangeUtc
        : this.filterbox.filterDateRange;
      if (range && range.length === 2) {
        this.filterbox.startTime = Number(range[0]) / 1000;
        this.filterbox.endTime = Number(range[1]) / 1000 + 86399;
      }
      getCollectionOrder(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
           let allData = JSON.parse(res.data.data)
           this.collectingOrderTableInfo = allData.collectionOrderDtoList
           this.totalCount = allData.totalNumber
           this.pageSize = allData.pageSize
           this.fetchCardInfo();
        } else if (res.status === 200 && res.data.code !== 0) {
          this.$notify({
            title: this.$t('common.error'),
            message: res.data.message,
            duration: 3000,
            position: 'bottom-right',
            type: 'error',
          })
        } else {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('common.requestFailed'),
            duration: 3000,
            position: 'bottom-right',
            type: 'error',
          })
        }
      })
    },
    reset(form) {
      this.$refs[form].resetFields();
      this.filterbox.filterDateRangeUtc = []
      this.filterbox.startTime = null
      this.filterbox.endTime = null
    },
    applyCurrencyToStatics() {
      const icon = this.currencyIcon || '';
      this.staticsData.merchantCommission = icon + this.staticsRawData.merchantCommission;
      this.staticsData.merchantEffectiveCommission = icon + this.staticsRawData.merchantEffectiveCommission;
      this.staticsData.merchantFreezeAmount = icon + this.staticsRawData.merchantFreezeAmount;
      this.staticsData.merchantAvaiableAmount = icon + this.staticsRawData.merchantAvaiableAmount;
    },
    handleCurrencyChange(tab) {
      if (tab && tab.paneName !== undefined) {
        this.filterbox.currencyType = tab.paneName;
      }
      this.currency = this.filterbox.currencyType;
      this.currencyIcon = this.currencyIcons[this.currency] || '';
      this.applyCurrencyToStatics();
      this.fetchCardInfo();
    },
    handleChange(currentPage) {
      /*this.collectingOrderTableInfo = []
      let startNum = (currentPage - 1) * this.pageSize;
      let endNum = (startNum + this.pageSize) <= this.totalCount ? (this.pageSize + startNum) : this.totalCount
      for (let i = startNum; i < endNum; i++) {
      //  this.collectingOrderTableInfo.push(this.collectingOrderFormInfo[i])
      }*/
      this.currentPage = currentPage;
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.pageSize
      this.search()
    },
    handleSizeChange(currentPageSize) {
      this.filterbox.pageSize = currentPageSize;
      this.filterbox.pageNo = 1
      this.currentPage = 1
      this.search()
    },
  },
  async mounted() {
    this.activeNames = this.$t('orderCommon.filterTitle');
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
          this.filterbox.currencyType = this.currencyOptions[0].currencyType;
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
    let roleName = localStorage.getItem('roleName');
    if (roleName &&  roleName !== 'admin') {
      this.filterbox.merchantUserId = localStorage.getItem('userId');
      this.filterAvaiable = true
    }

    await getMerchantInfo(this.filterbox).then(res => {
      if (res.status === 200 && res.data.code === 0) {
         this.merchantOptions = JSON.parse(res.data.data).merchantInfoDtoList
         this.merchantOptions.forEach(merchantInfo => {
            this.merchantMaps[merchantInfo.userId] = merchantInfo.accountName
         })

      }
    })
    await getChannelInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        let allData = JSON.parse(res.data.data);
        this.channelOptions = allData.channelDtoList
        this.channelOptions.forEach(channel =>{
          this.channelMaps[channel.channelId] = channel.channelName
        })
      }
    })
    this.search()
  },
  beforeUnmount() {
    if (this._timeZoneListener) {
      window.removeEventListener("timezone-change", this._timeZoneListener);
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

.status-processing {
  background-color: #3b82f6;
}

.status-fail {
  background-color: #ff4d4f;
}

.status-timeout {
  background-color: #9ca3af;
}

.status-cancel {
  background-color: #6b7280;
}

.status-other {
  background-color: #9ca3af;
}
</style>
<style>


/*.el-table__header .el-table-column--selection .cell .el-checkbox:after {
  content: "全选";
  margin-left: 12px;
}*/

/*.el-table .el-table__header th {
  font-size: larger;
  !*background-color: deepskyblue !important;*!
  color: white;
}*/
</style>
