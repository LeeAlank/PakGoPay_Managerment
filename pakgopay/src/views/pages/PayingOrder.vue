<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getOrderStatus, getOrderStatusOptions, getTimeFromTimestamp} from "@/api/common.js";
</script>

<template>
  <div style="width: 100%;height: 110%; overflow-y: scroll;">
    <div class="main-title">代付订单</div>
    <el-collapse v-model="activeTool">
      <el-collapse-item name="1">
        <template #title>
        <span class="toolbarName">
          工具栏
        </span>
        </template>
        <div class="main-toolbar" style="height: 230px;width: 97%;">
          <el-form class="main-toolform" style="height: 100%;" ref="filterboxForm" :model="filterbox">
            <el-row>
              <el-col :offset="18" :span="6">
                <div class="toolbar-action-row">
                  <el-button @click="search()" class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>查询</div>
                  </el-button>
                  <el-button @click="reset('filterboxForm')" class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="reset"/>
                    <div>重置</div>
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单状态：" label-width="150px" prop="orderStatus">
                  <el-select
                      :options="getOrderStatusOptions()"
                      v-model="filterbox.orderStatus"
                      style="width: 200px"
                      clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商户订单号：" label-width="150px" prop="merchantOrderNo">
                  <el-input v-model="filterbox.merchantOrderNo" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单渠道：" label-width="150px" prop="channelId">
                  <el-select
                      :options="channelOptions"
                      :props="channelProps"
                      v-model="filterbox.channelId"
                      style="width: 200px;"
                      clearable
                      filterable
                      placeholder="请选择渠道"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商户：" label-width="150px" prop="merchantUserId">
                  <el-select
                      :options="merchantOptions"
                      :props="merchantInfoProps"
                      v-model="filterbox.merchantUserId"
                      placeholder="请选择商户"
                      style="width: 200px"
                      clearable
                      :disabled="filterAvaiable"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="币种：" label-width="150px" prop="currency">
                  <el-select
                      :options="currencyOptions"
                      :props="currencyProps"
                      v-model="filterbox.currency"
                      clearable
                      style="width:200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单类型：" label-width="150px" prop="orderType">
                  <el-select
                      v-model="filterbox.orderType"
                      style="width: 200px"
                      clearable
                  >
                    <el-option :value="1" label="系统订单"></el-option>
                    <el-option :value="2" label="手工订单"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="平台订单号：" label-width="150px" prop="transactionNo">
                  <el-input v-model="filterbox.transactionNo" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商户代理：" label-width="150px" prop="merchantAgent">
                  <el-input v-model="filterbox.merchantAgent" style="width: 200px"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="6">
                <el-form-item label="订单金额：" label-width="150px">
                  <el-input type="number" v-model="filterbox.amount" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="创建时间：" label-width="150px">
                  <el-date-picker
                      v-model="filterbox.filterDateRange"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
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
        <span class="currency-tabs-label">统计币种:</span>
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

    <!-- <div v-on:click="createPathChannel()" style="background-color: limegreen;width:100px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="22px" name="add"/>
                    <div style="width: 60px;height:30px;color: white;display: flex;align-items: center">创建订单</div>
                  </div>
                  <div v-on:click="createPathChannel()" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="22px" name="add"/>
                    <div style="width: 50px;height:30px;color: white;display: flex;align-items: center">批量回调</div>
                  </div> -->
    <!-- 卡片信息 -->
    <div>
      <div style="display: flex; justify-content: space-between;">
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-left: 3%;">
          <div style="display: flex;">
            <SvgIcon name="orderNum" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">订单总数:</span>
              <textarea v-model="staticsData.orderTotalCount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;">
          <div style="display: flex;">
            <SvgIcon name="merchantCommission" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">商户手续费:</span>
              <textarea v-model="staticsData.merchantCommission" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-right: 4%;">
          <div style="display: flex;">
            <SvgIcon name="freezeAmount" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">冻结金额:</span>
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
              <span class="statics-title">订单成功率:</span>
              <textarea v-model="staticsData.ordereSuccessRate" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;">
          <div style="display: flex;">
            <SvgIcon name="effectiveCommission" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">商户有效手续费:</span>
              <textarea v-model="staticsData.merchantEffectiveCommission" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-right: 4%;">
          <div style="display: flex;justify-content: space-between">
            <SvgIcon name="accountBalance" width="100px" height="100px"/>
            <div
                style="display: flex; flex-direction: column;width: 80%;margin-left: 2%;justify-content: space-between;">
              <span class="statics-title">可用金额:</span>
              <textarea v-model="staticsData.merchantAvaiableAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="reportInfo">
      <div class="main-views-form" style="width: auto;height:60%;overflow-y: auto">
        <div style="display: flex; float: right">
          <el-button @click="createPathChannel()" class="filterButton">
            <SvgIcon class="filterButtonSvg" name="createOrder"/>
            <div>创建订单</div>
          </el-button>
        </div>
        <el-table
            border
            :data="payingOrderTableInfo"
            class="merchantInfos-table"
            style="width: 100%;"
            :key="tableKey"
            max-height="520"
        >
          <el-table-column
              prop="orderId"
              label="订单号"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.transactionNo }}</div>
          </el-table-column>
          <el-table-column
              prop="merchantOrderId"
              label="商户订单号"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.merchantOrderNo }}</div>
          </el-table-column>
          <el-table-column
              prop="merchantAccount"
              label="商户号"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.merchantUserId }}</div>
          </el-table-column>
          <el-table-column
              prop="merchantName"
              label="商户名称"
              v-slot="{row}"
              align="center"
          >
            <div>{{ merchantMaps[row.merchantUserId] }}</div>
          </el-table-column>
          <el-table-column
              prop="currencyType"
              label="币种"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.currencyType }}</div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              label="订单状态"
              v-slot="{row}"
              align="center"
          >
            <div>{{ getOrderStatus(row.orderStatus) }}</div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              label="订单类型"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.orderType === 1 ? '系统订单':'手动订单' }}</div>
          </el-table-column>
          <el-table-column
              prop="orderAmount"
              label="订单金额"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.amount }}</div>
          </el-table-column>
          <el-table-column
              prop="channelId"
              label="订单渠道"
              v-slot="{row}"
              align="center"
          >
            <div>{{ channelMaps[row.channelId] }}</div>
          </el-table-column>
          <el-table-column
              prop="callBackStatus"
              label="回调状态"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.callBackStatus }}</div>
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              v-slot="{row}"
              align="center"
          >
            <div>{{ getTimeFromTimestamp(row.requestTime) }}</div>
          </el-table-column>
          <el-table-column
              prop="orderId"
              label="请求IP"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.requestIP }}</div>
          </el-table-column>
          <el-table-column
              width="100"
              label="操作"
              align="center"
              v-slot="{row}"
              fixed="right"
          >
            <el-dropdown trigger="click">
              <SvgIcon name="more" width="30" height="30"/>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="row.orderStatus === 1" @click="startUser(row)">审核</el-dropdown-item>
                  <!--                  <el-dropdown-item @click="editUser(row)">编辑</el-dropdown-item>-->
                  <el-dropdown-item @click="callback(row)">回调</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAllCurrencyType,
  getChannelInfo,
  getCollectionOrder,
  getMerchantInfo, getPayingOrder
} from "@/api/interface/backendInterface.js";

export default {
  data() {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 50, 100],
      activeToolBar: true,
      tableKey: 0,
      activeNames: '筛选',
      activeTool: "1",
      checked: false,
      checkAll: false,
      filterbox: {
        orderStatus: '',
        orderId: '',
        orderChannel: '',
        merchantAccount: '',
        merchantName: '',
        orderType: '',
        createTime: '',
        merchantAgent: '',
        currencyType: '',
        orderAmount: '',
        platformOrderId: '',
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
      channelMaps: {},
      merchantOptions: [],
      merchantMaps: {},
      merchantInfoProps: {
        value: 'userId',
        label: 'accountName',
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
      payingOrderTableInfo: [],
    }
  },
  methods: {
    reset(form) {
      this.$refs[form].resetFields();
      this.filterbox.filterDateRangeUtc = []
      this.filterbox.startTime = null
      this.filterbox.endTime = null
    },
    search() {
      const range = (this.filterbox.filterDateRangeUtc && this.filterbox.filterDateRangeUtc.length === 2)
          ? this.filterbox.filterDateRangeUtc
          : this.filterbox.filterDateRange;
      if (range && range.length === 2) {
        this.filterbox.startTime = Number(range[0]) / 1000;
        this.filterbox.endTime = Number(range[1]) / 1000 + 86399;
      }
      getPayingOrder(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.payingOrderTableInfo = allData.payOrderDtoList
          this.totalCount = allData.totalNumber
          this.pageSize = allData.pageSize
        } else if (res.status === 200 && res.data.code !== 0) {
          this.$notify({
            title: 'Failed',
            message: res.data.message,
            duration: 3000,
            position: 'bottom-right',
            type: 'error',
          })
        } else {
          this.$notify({
            title: 'Failed',
            message: 'something went wrong, try again!',
            duration: 3000,
            position: 'bottom-right',
            type: 'error',
          })
        }
      })
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
    handleDateRangeChange(val) {
      if (!val || val.length !== 2) {
        this.filterbox.filterDateRangeUtc = [];
        return;
      }
      this.filterbox.filterDateRangeUtc = this.toUtcRange(val, this.timeZoneKey);
    },
    applyCurrencyToStatics() {
      const icon = this.currencyIcon || '';
      this.staticsData.merchantCommission = icon + this.staticsRawData.merchantCommission;
      this.staticsData.merchantEffectiveCommission = icon + this.staticsRawData.merchantEffectiveCommission;
      this.staticsData.merchantFreezeAmount = icon + this.staticsRawData.merchantFreezeAmount;
      this.staticsData.merchantAvaiableAmount = icon + this.staticsRawData.merchantAvaiableAmount;
    },
    handleCurrencyChange(tab) {
      /*if (tab && tab.paneName !== undefined) {
        //this.filterbox.currencyType = tab.paneName;
      }*/
      //this.currency = this.filterbox.currencyType;
      //this.currencyIcon = this.currencyIcons[this.currency] || '';
      //this.applyCurrencyToStatics();
    },
    handleChange(currentPage) {
      this.currentPage = currentPage;
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.pageSize
      this.search()
    },
    handleSizeChange(currentPageSize) {
      this.pageSize = currentPageSize;
      this.filterbox.pageSize = currentPageSize;
      this.filterbox.pageNo = 1
      this.currentPage = 1
      this.search()
    },
  },
  async mounted() {
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
        this.currencyOptions = JSON.parse(res.data.data);
        if (this.currencyOptions.length > 0) {
          //this.currency = this.currencyOptions[0].currencyType;
          //this.filterbox.currencyType = this.currencyOptions[0].currencyType;
          this.currencyIcons = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon;
          });
          this.currencyIcon = this.currencyIcons[this.currency] || '';
        }
      }
    });

    let roleName = localStorage.getItem('roleName');
    if (roleName && roleName !== 'admin') {
      this.filterbox.merchantUserId = localStorage.getItem('userName');
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
        this.channelOptions.forEach(channel => {

          this.channelMaps[channel.channelId] = channel.channelName
        })
      }
    })
    this.search()
    //this.applyCurrencyToStatics();
    /*this.collectingOrderTableInfo = this.collectingOrderFormInfo;
    this.totalCount = this.collectingOrderTableInfo.length;
    this.handleChange(this.currentPage);
    this.tableKey++*/
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
</style>
<style>


</style>
