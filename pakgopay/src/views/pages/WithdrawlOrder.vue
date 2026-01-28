<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div style="width: 100%;height: 110%; overflow-y: scroll;">
    <div class="main-title">提现订单</div>
    <!-- 工具栏 -->
    <el-collapse v-model="activeTool">
      <el-collapse-item name="1">
        <template #title>
        <span class="toolbarName">
          工具栏
        </span>
        </template>
        <div class="main-toolbar" style="height: 150px;width: 97%;">
          <el-form class="main-toolform" style="height: 100%;">
            <el-row>
              <el-col :offset="18" :span="6">
                <div class="toolbar-action-row">
                  <el-button @click="search()" class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>查询</div>
                  </el-button>
                  <el-button @click="reset()" class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="reset"/>
                    <div>重置</div>
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单编号：" label-width="150px" prop="id">
                  <el-input v-model="filterbox.id" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="150px" label="用户类型:">
                  <el-radio-group v-model="filterbox.userType" style="display: flex; flex-direction: row;">
                    <el-radio label="商户" :value="1"></el-radio>
                    <el-radio label="代理" :value="2"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="filterbox.userType === 1" :span="6">
                <el-form-item label="商户：" label-width="150px" prop="userId">
                  <el-select
                    :options="merchantOptions"
                    :props="merchantInfoProps"
                    v-model="filterbox.userId"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="filterbox.userType === 2" :span="6">
                <el-form-item label="代理：" label-width="150px" prop="userId">
                  <el-select
                      :options="agentOptions"
                      :props="agentProps"
                      v-model="filterbox.userId"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间：" label-width="150px" prop="filterDateRange">
                  <!--                  <el-input v-model="filterbox.requestTime"style="width: 200px"/>-->
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

    <!-- 统计信息 -->
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
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%;justify-content: space-between;">
              <span class="statics-title">可用金额:</span>
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
            <div>创建订单</div>
          </el-button>
          <el-button @click="createPathChannel()" class="filterButton">
            <SvgIcon class="filterButtonSvg" name="callBack"/>
            <div>批量回调</div>
          </el-button>
        </div>
        <el-table
            border :data="withdrawlOrderTableInfo"
            class="merchantInfos-table"
            style="height: auto;"
            :key="tableKey"
        >
          <el-table-column
              prop="orderId"
              label="订单号"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.orderId}}</div>
          </el-table-column>
          <el-table-column
              prop="amount"
              label="提现金额"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.amount}}</div>
          </el-table-column>
          <el-table-column
              prop="merchantAgentName"
              label="商户/代理名称"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.merchantAgentName}}</div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              label="订单状态"
              v-slot="{row}"
              align="center"
          >
            <div>{{ formatOrderStatus(row.orderStatus) }}</div>
          </el-table-column>
          <el-table-column
              prop="walletAddr"
              label="提现账号"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.walletAddr}}</div>
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.createTime}}</div>
          </el-table-column>
          <el-table-column
              prop="applyer"
              label="申请人"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.applyer}}</div>
          </el-table-column>
          <el-table-column
              prop="applyerIp"
              label="申请人IP"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.applyerIp}}</div>
          </el-table-column>
          <el-table-column
              v-slot="{row}"
              label="操作"
              align="center"
          >
            <el-dropdown trigger="click">
              <SvgIcon name="more" width="30" height="30"/>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :disabled="row.orderStatus !== 0" @click="rejectWithdrawOrder(row)">驳回</el-dropdown-item>
                  <el-dropdown-item :disabled="row.orderStatus !== 0" @click="approveWithdrawOrder(row)">通过</el-dropdown-item>
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
  getAgentInfo,
  getAllCurrencyType,
  getMerchantInfo,
  getWithdrawStatementeOrder
} from "@/api/interface/backendInterface.js";

export default {
  name: "WithdrawlOrder",
  data() {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      tableKey: 0,
      activeTool: "1",
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
      merchantOptions: [],
      merchantInfoProps: {
        value: 'userId',
        label: 'accountName',
      },
      agentOptions: [],
      agentProps: {
        value: "userId",
        label: "agentName"
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
    search() {
      getWithdrawStatementeOrder(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.withdrawlOrderTableInfo = allData.accountStatementsDtoList
          this.totalCount = allData.totalNumber
          this.pageSize = allData.pageSize
          this.currentPage = allData.pageNo
        }
      })
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
    formatOrderStatus(status) {
      const statusMap = {
        0: "待处理",
        1: "已通过",
        2: "已驳回"
      };
      return statusMap[status] || status;
    },
    approveWithdrawOrder() {},
    rejectWithdrawOrder() {},
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
    },
    handleChange(currentPage) {
      this.collectingOrderTableInfo = []
      let startNum = (currentPage - 1) * this.pageSize;
      let endNum = (startNum + this.pageSize) <= this.totalCount ? (this.pageSize + startNum) : this.totalCount
      for (let i = startNum; i < endNum; i++) {
        this.collectingOrderTableInfo.push(this.collectingOrderFormInfo[i])
      }
    },
    handleSizeChange(currentPageSize) {
      this.collectingOrderTableInfo = []
      let startNum = (this.currentPage - 1) * currentPageSize;
      let endNum = (startNum + currentPageSize) <= this.totalCount ? (currentPageSize + startNum) : this.totalCount
      for (let i = startNum; i < endNum; i++) {
        this.collectingOrderTableInfo.push(this.collectingOrderFormInfo[i])
      }
    },
  },
  async mounted() {
    await getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.currencyOptions = JSON.parse(res.data.data);
        if (this.currencyOptions.length > 0) {
          this.currency = this.currencyOptions[0].currencyType;
          //this.filterbox.currencyType = this.currencyOptions[0].currencyType;
          this.currencyIcons = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon;
          });
          this.currencyIcon = this.currencyIcons[this.currency] || '';
        }
      }
    });
    this.filterbox.userType = 1
    await getMerchantInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.merchantOptions = JSON.parse(res.data.data).merchantInfoDtoList
      }
    })

    getAgentInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.agentOptions = JSON.parse(res.data.data).agentInfoDtoList
      }
    })

    this.search()

   /* this.totalCount = this.withdrawlOrderTableInfo.length;
    if (this.totalCount===0) {
      return;
    }*/
    this.handleChange(this.currentPage);
    this.tableKey++
  }
}
</script>
<style scoped>
@import "@/assets/base.css";
</style>
<style>


</style>
