<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import { Loading } from "@element-plus/icons-vue";
import {getCallBackStatus, getOrderStatus, getOrderStatusOptions, getTimeFromTimestamp, getTodayStartTimestamp} from "@/api/common.js";
</script>

<template>
  <div style="width: 100%; height: auto; overflow-y: visible;">
    <div class="main-title">{{ $t('payingOrder.title') }}</div>
    <el-collapse v-model="activeTool">
      <el-collapse-item name="1">
        <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
        </template>
        <div class="main-toolbar" style="height: auto; width: 97%;">
          <el-form
              class="main-toolform paying-order-toolform"
              style="height: 100%;"
              ref="filterboxForm"
              :model="filterbox"
              label-width="150px"
              label-position="right"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item :label="$t('payingOrder.filter.orderStatus')" label-width="150px" prop="orderStatus">
                  <el-select
                      :options="getOrderStatusOptions()"
                      v-model="filterbox.orderStatus"
                      style="width: 200px"
                      clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('payingOrder.filter.merchantOrderNo')" label-width="150px" prop="merchantOrderNo">
                  <el-input v-model="filterbox.merchantOrderNo" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('payingOrder.filter.channel')" label-width="150px" prop="channelId">
                  <el-select
                      :options="channelOptions"
                      :props="channelProps"
                      v-model="filterbox.channelId"
                      style="width: 200px;"
                      clearable
                      filterable
                      :placeholder="$t('payingOrder.placeholder.channel')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('payingOrder.filter.merchant')" label-width="150px" prop="merchantUserId">
                  <el-select
                      :options="merchantOptions"
                      :props="merchantInfoProps"
                      v-model="filterbox.merchantUserId"
                      :placeholder="$t('payingOrder.placeholder.merchant')"
                      style="width: 200px"
                      clearable
                      :disabled="filterAvaiable"
                  />
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
                      clearable
                      style="width:200px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('payingOrder.filter.orderType')" label-width="150px" prop="orderType">
                <el-select
                    v-model="filterbox.orderType"
                    style="width: 200px"
                    clearable
                >
                  <el-option :value="1" :label="$t('payingOrder.orderType.system')"></el-option>
                  <el-option :value="2" :label="$t('payingOrder.orderType.manual')"></el-option>
                  <el-option :value="3" :label="$t('payingOrder.orderType.test')"></el-option>
                  <el-option :value="4" :label="$t('payingOrder.orderType.halfTest')"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('payingOrder.filter.transactionNo')" label-width="150px" prop="transactionNo">
                  <el-input v-model="filterbox.transactionNo" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('payingOrder.filter.merchantAgent')" label-width="150px" prop="merchantAgent">
                  <el-input v-model="filterbox.merchantAgent" style="width: 200px"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>

              <el-col :span="6">
                <el-form-item :label="$t('payingOrder.filter.amount')" label-width="150px">
                  <el-input type="number" v-model="filterbox.amount" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('payingOrder.filter.createTime')" label-width="150px">
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
            <div
                style="display: flex; flex-direction: column;width: 80%;margin-left: 2%;justify-content: space-between;">
              <span class="statics-title">{{ $t('orderCommon.stats.availableAmount') }}</span>
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
          <el-button v-if="isAdmin" @click="createPathChannel()" class="filterButton">
            <SvgIcon class="filterButtonSvg" name="createOrder"/>
            <div>{{ $t('orderCommon.action.createOrder') }}</div>
          </el-button>
        </div>
        <el-table
            border
            :data="payingOrderTableInfo"
            class="merchantInfos-table"
            style="width: 100%;height: auto"
            :key="tableKey"
            max-height="90vh"
        >
          <el-table-column
              prop="orderId"
              :label="$t('payingOrder.column.orderId')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.transactionNo }}</div>
          </el-table-column>
          <el-table-column
              prop="merchantOrderId"
              :label="$t('payingOrder.column.merchantOrderNo')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.merchantOrderNo }}</div>
          </el-table-column>
          <el-table-column
              prop="merchantName"
              :label="$t('payingOrder.column.merchantName')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ merchantMaps[row.merchantUserId] }}</div>
          </el-table-column>
          <el-table-column
              prop="currencyType"
              :label="$t('payingOrder.column.currency')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.currencyType }}</div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              :label="$t('payingOrder.column.status')"
              v-slot="{row}"
              align="center"
          >
            <div class="status-cell">
              <span :class="['status-dot', getOrderStatusClass(row.orderStatus)]"></span>
              <span>{{ getOrderStatus(row.orderStatus) }}</span>
            </div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              :label="$t('payingOrder.column.orderType')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ getOrderTypeLabel(row.orderType) }}</div>
          </el-table-column>
          <el-table-column
              prop="orderAmount"
              :label="$t('payingOrder.column.amount')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.amount }}</div>
          </el-table-column>
          <el-table-column
              prop="channelId"
              :label="$t('payingOrder.column.channel')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ channelMaps[row.channelId] }}</div>
          </el-table-column>
          <el-table-column
              prop="paymentNo"
              :label="$t('payingOrder.column.paymentNo')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ row.paymentNo }}</div>
          </el-table-column>
          <el-table-column
              prop="callbackStatus"
              :label="$t('payingOrder.column.callbackStatus')"
              v-slot="{row}"
              align="center"
          >
            <div class="status-cell">
              <span :class="['status-dot', getCallbackStatusClass(row)]"></span>
              <span>{{ getCallbackStatusText(row) }}</span>
            </div>
          </el-table-column>
          <el-table-column
              prop="createTime"
              :label="$t('payingOrder.column.createTime')"
              v-slot="{row}"
              align="center"
          >
            <div>{{ getTimeFromTimestamp(row.requestTime) }}</div>
          </el-table-column>
          <el-table-column
              width="100"
              :label="$t('common.operation')"
              align="center"
              v-slot="{row}"
              fixed="right"
              v-if="isAdmin"
          >
            <el-dropdown v-if="shouldShowActionMenu(row)" trigger="click" :hide-on-click="false">
              <SvgIcon name="more" width="30" height="30"/>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openOrderDetail(row)">{{ $t('common.detail') }}</el-dropdown-item>
                  <el-dropdown-item v-if="row.orderStatus === 1" @click="startUser(row)">{{ $t('payingOrder.action.review') }}</el-dropdown-item>
                  <!--                  <el-dropdown-item @click="editUser(row)">编辑</el-dropdown-item>-->
                  <el-dropdown-item v-if="shouldShowCallbackAction(row)" @click="callback(row)">{{ $t('payingOrder.action.callback') }}</el-dropdown-item>
                  <el-dropdown-item
                    v-if="shouldShowOrderFlowLogAction(row)"
                    :disabled="isOrderFlowLoading(row)"
                    @click="viewOrderFlowLogs(row)"
                  >
                    <el-icon v-if="isOrderFlowLoading(row)" class="is-loading">
                      <Loading />
                    </el-icon>
                    <span v-else>{{ $t('log.operation.title') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="shouldShowReverseAction(row)" @click="reverseOrder(row)">{{ $t('common.reverse') }}</el-dropdown-item>
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
  <el-dialog v-model="createOrderDialogVisible" :title="$t('orderCommon.dialog.createTitle')" width="520px">
    <el-form ref="createOrderFormRef" :model="createOrderForm" :rules="createOrderRules" label-width="110px" class="create-order-form">
      <el-form-item :label="$t('orderCommon.form.merchant')" prop="merchantId">
        <el-select
          :options="merchantOptions"
          :props="merchantInfoProps"
          v-model="createOrderForm.merchantId"
          :placeholder="$t('payingOrder.placeholder.merchant')"
          style="width: 200px"
          clearable
          filterable
          @change="handleCreateOrderMerchantChange"
        />
      </el-form-item>
      <el-form-item :label="$t('orderCommon.form.merchantOrderNo')" prop="merchantOrderNo">
        <el-input v-model="createOrderForm.merchantOrderNo" style="width: 200px" />
      </el-form-item>
      <el-form-item :label="$t('orderCommon.form.channelName')" prop="paymentNo">
        <el-select
          v-model="createOrderForm.paymentNo"
          style="width: 200px"
          clearable
          filterable
          :disabled="!createOrderForm.merchantId"
          @change="handleCreateOrderPaymentChange"
        >
          <el-option
            v-for="item in createPaymentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="!!item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('orderCommon.form.amount')" prop="amount">
        <el-input v-model="createOrderForm.amount" type="number" style="width: 200px" />
        <div v-if="getCreateOrderAmountRangeHint()" class="create-order-amount-hint">
          <span class="hint-icon">!</span>
          <span>{{ getCreateOrderAmountRangeHint() }}</span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('common.currency')">
        <div class="create-order-currency-value">{{ getCreateOrderCurrencyName() }}</div>
      </el-form-item>
      <el-form-item :label="$t('orderCommon.form.notificationUrl')" prop="notificationUrl">
        <el-input v-model="createOrderForm.notificationUrl" style="width: 200px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeCreateOrderDialog">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitCreateOrder">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="createGoogleConfirmVisible" :title="$t('common.googleCode')" width="420px"
      align-center>
    <el-form ref="createGoogleConfirmFormRef" :model="createGoogleConfirmForm" :rules="createGoogleConfirmRules" label-width="110px">
      <el-form-item :label="$t('common.googleCode')" prop="googleCode">
        <el-input v-model="createGoogleConfirmForm.googleCode" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeCreateGoogleConfirm">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="confirmCreateOrder">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="callbackDialogVisible" :title="$t('orderCommon.dialog.callbackTitle')" width="420px">
    <el-form ref="callbackFormRef" :model="callbackForm" :rules="callbackRules" label-width="110px">
      <el-form-item :label="$t('orderCommon.form.merchantOrderNo')" prop="transactionNo">
        <el-input v-model="callbackForm.transactionNo" />
      </el-form-item>
      <el-form-item :label="$t('orderCommon.form.merchantId')" prop="merchantNo">
        <el-input v-model="callbackForm.merchantNo" />
      </el-form-item>
      <el-form-item :label="$t('orderCommon.form.orderStatus')" prop="status">
        <el-select v-model="callbackForm.status" style="width: 100%">
          <el-option :label="$t('orderCommon.option.success')" value="2" />
          <el-option :label="$t('orderCommon.option.failed')" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('withdrawlAccount.form.remark')" prop="remark">
        <el-input v-model="callbackForm.remark" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="callbackDialogVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitCallback">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="googleConfirmVisible" :title="$t('common.googleCode')" width="420px"
      align-center>
    <el-form ref="googleConfirmFormRef" :model="googleConfirmForm" :rules="googleConfirmRules" label-width="110px">
      <el-form-item :label="$t('common.googleCode')" prop="googleCode">
        <el-input v-model="googleConfirmForm.googleCode" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeGoogleConfirm">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="confirmCallback">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="reverseRemarkVisible" :title="$t('common.reverse')" width="420px"
      align-center>
    <el-form ref="reverseRemarkFormRef" :model="reverseRemarkForm" :rules="reverseRemarkRules" label-width="110px">
      <el-form-item :label="$t('withdrawlAccount.form.remark')" prop="remark">
        <el-input v-model="reverseRemarkForm.remark" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeReverseRemark">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitReverseRemark">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="reverseGoogleConfirmVisible" :title="$t('common.googleCode')" width="420px"
      align-center>
    <el-form ref="reverseGoogleConfirmFormRef" :model="reverseGoogleConfirmForm" :rules="reverseGoogleConfirmRules" label-width="110px">
      <el-form-item :label="$t('common.googleCode')" prop="googleCode">
        <el-input v-model="reverseGoogleConfirmForm.googleCode" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeReverseGoogleConfirm">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="confirmReverseOrder">{{ $t('common.confirm') }}</el-button>
    </template>
  </el-dialog>
  <el-drawer
    v-model="orderFlowLogVisible"
    :title="$t('log.operation.title')"
    direction="rtl"
    size="720px"
    :append-to-body="true"
    :modal="false"
    @open="bindOrderFlowOutsideClose"
    @closed="unbindOrderFlowOutsideClose"
  >
    <div class="order-flow-log-body">
      <div class="order-flow-log-header">订单号：{{ orderFlowTransactionNo || '-' }}</div>
      <div class="order-flow-log-subtitle">操作记录：</div>
      <div v-if="orderFlowLogTables.length">
        <div
          v-for="(tableRows, index) in orderFlowLogTables"
          :key="index"
          :class="['order-flow-log-table-wrap', { 'order-flow-log-table-failed': isOrderFlowFailed(tableRows) }]"
        >
          <el-table :data="tableRows" border :show-header="false" class="order-flow-log-table">
            <el-table-column prop="field" width="220" />
            <el-table-column prop="value">
              <template #default="{ row }">
                <span class="order-flow-log-value">{{ formatOrderFlowCell(row.value) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-input
        v-else
        v-model="orderFlowLogText"
        type="textarea"
        :rows="10"
        readonly
      />
    </div>
    <template #footer>
      <el-button @click="orderFlowLogVisible = false">{{ $t('common.close') }}</el-button>
    </template>
  </el-drawer>
  <el-dialog v-model="orderDetailVisible" :title="$t('common.detail')" width="760px">
    <el-descriptions :column="2" border>
      <el-descriptions-item :label="$t('payingOrder.column.orderId')">{{ orderDetailData.transactionNo || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.merchantOrderNo')">{{ orderDetailData.merchantOrderNo || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.merchantName')">{{ orderDetailData.merchantName || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.currency')">{{ orderDetailData.currencyType || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.status')">{{ orderDetailData.orderStatusText || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.orderType')">{{ orderDetailData.orderTypeText || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.amount')">{{ orderDetailData.amount ?? '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.channel')">{{ orderDetailData.channelName || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.paymentNo')">{{ orderDetailData.paymentNo || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.callbackStatus')">{{ orderDetailData.callbackStatusText || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.createTime')">{{ orderDetailData.createTime || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.completeTime')">{{ orderDetailData.completeTime || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('payingOrder.column.requestIp')">{{ orderDetailData.requestIp || '-' }}</el-descriptions-item>
      <el-descriptions-item :label="$t('withdrawlAccount.form.remark')">{{ orderDetailData.remark || '-' }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="orderDetailVisible = false">{{ $t('common.close') }}</el-button>
    </template>
  </el-dialog>
</template>
<script>
import {
  getAllCurrencyType,
  getChannelInfo,
  getCollectionOrder,
  getMerchantInfo, getPayingOrder, manualCreatePayOutOrder, manualNotifyPayOutOrder, manualReverseOrder, queryMerchantAvailableChannels, queryOpsOrderCardInfo, queryOrderFlowLogs
} from "@/api/interface/backendInterface.js";
import { getTimeZoneOffsetMinutes } from "@/util/timezoneOptions.js";

export default {
  data() {
    return {
      filterAvaiable: false,
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
      channelOptions: [],
      channelProps: {
        value: 'channelId',
        label: 'channelName',
      },
      channelMaps: {},
      createPaymentOptions: [],
      createPaymentMetaMap: {},
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
      payingOrderTableInfo: [],
      createOrderDialogVisible: false,
      createGoogleConfirmVisible: false,
      createOrderForm: {
        merchantId: '',
        merchantOrderNo: '',
        paymentNo: '',
        amount: '',
        currency: '',
        notificationUrl: ''
      },
      createGoogleConfirmForm: {
        googleCode: ''
      },
      createOrderRules: {
        merchantId: [{ required: true, message: this.$t('orderCommon.validation.merchantIdRequired'), trigger: 'blur' }],
        merchantOrderNo: [{ required: true, message: this.$t('orderCommon.validation.merchantOrderNoRequired'), trigger: 'blur' }],
        paymentNo: [{ required: true, message: this.$t('orderCommon.validation.channelNameRequired'), trigger: 'change' }],
        amount: [{ required: true, message: this.$t('orderCommon.validation.amountRequired'), trigger: 'blur' }],
        notificationUrl: [{ required: true, message: this.$t('orderCommon.validation.notificationUrlRequired'), trigger: 'blur' }]
      },
      createGoogleConfirmRules: {
        googleCode: [{ required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }]
      },
      callbackDialogVisible: false,
      callbackForm: {
        transactionNo: '',
        merchantNo: '',
        status: '2',
        remark: ''
      },
      googleConfirmVisible: false,
      googleConfirmForm: {
        googleCode: ''
      },
      reverseGoogleConfirmVisible: false,
      reverseGoogleConfirmForm: {
        googleCode: ''
      },
      reverseRemarkVisible: false,
      reverseRemarkForm: {
        remark: ''
      },
      reverseOrderPayload: null,
      orderFlowLogVisible: false,
      orderDetailVisible: false,
      orderDetailData: {},
      orderFlowTransactionNo: '',
      orderFlowLogText: '',
      orderFlowLogTables: [],
      orderFlowOutsideCloseHandler: null,
      orderFlowLoadingMap: {},
      callbackRules: {
        transactionNo: [{ required: true, message: this.$t('orderCommon.validation.merchantOrderNoRequired'), trigger: 'blur' }],
        merchantNo: [{ required: true, message: this.$t('orderCommon.validation.merchantIdRequired'), trigger: 'blur' }],
        status: [{ required: true, message: this.$t('orderCommon.validation.orderStatusRequired'), trigger: 'change' }],
        remark: [{ required: true, message: this.$t('withdrawlAccount.validation.remarkRequired'), trigger: 'blur' }]
      },
      googleConfirmRules: {
        googleCode: [{ required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }]
      },
      reverseGoogleConfirmRules: {
        googleCode: [{ required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }]
      },
      reverseRemarkRules: {
        remark: [{ required: true, message: this.$t('withdrawlAccount.validation.remarkRequired'), trigger: 'blur' }]
      },
      callbackLoadingMap: {},
      isAdmin: false,
    }
  },
  methods: {
    applyRouteQueryFilters() {
      const query = this.$route?.query || {}
      const orderNo = query.orderNo || query.id || query.transactionNo
      if (orderNo) {
        this.filterbox.transactionNo = String(orderNo)
      }
      if (query.merchantOrderNo) {
        this.filterbox.merchantOrderNo = String(query.merchantOrderNo)
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
      return [dayStart, dayStart]
    },
    createPathChannel() {
      if (!this.isAdmin) return
      this.createPaymentOptions = []
      this.createPaymentMetaMap = {}
      this.createOrderForm.paymentNo = ''
      this.createOrderForm.currency = ''
      this.createOrderDialogVisible = true
      this.$nextTick(() => {
        this.$refs.createOrderFormRef?.clearValidate()
      })
    },
    closeCreateOrderDialog() {
      this.createOrderDialogVisible = false
      this.$refs.createOrderFormRef?.resetFields()
      this.createPaymentOptions = []
      this.createPaymentMetaMap = {}
      this.closeCreateGoogleConfirm()
    },
    parseAvailableChannelItem(item) {
      if (typeof item === 'string') {
        const [value, ...labelParts] = item.split(':')
        const baseLabel = labelParts.join(':') || value
        return {
          value: String(value || ''),
          label: baseLabel,
          supportType: null,
          min: null,
          max: null,
          enableTimePeriod: '',
          currency: ''
        }
      }
      if (item && typeof item === 'object') {
        const dynamicPaymentNoKey = Object.keys(item).find((k) => String(k || '').toLowerCase() === 'paymentno')
        const dynamicPaymentIdKey = Object.keys(item).find((k) => String(k || '').toLowerCase() === 'paymentid')
        const value = item.paymentNo || item.value || item.paymentId || item.id || (dynamicPaymentNoKey ? item[dynamicPaymentNoKey] : '') || (dynamicPaymentIdKey ? item[dynamicPaymentIdKey] : '') || ''
        if (!value) return null
        const baseLabel = item.channelName || item.paymentName || item.label || item.name || String(value || '')
        const enableTimePeriod = String(item.enableTimePeriod || '').trim()
        const dynamicCurrencyKey = Object.keys(item).find((k) => String(k || '').toLowerCase().includes('currency') && String(item[k] || '').trim())
        const resolvedCurrency = item.currency
          || item.currencyType
          || item.currencyCode
          || item.currencyNo
          || (dynamicCurrencyKey ? item[dynamicCurrencyKey] : '')
          || (Array.isArray(item.currencyList) ? item.currencyList.find((v) => String(v || '').trim()) : '')
          || (Array.isArray(item.supportCurrencyList) ? item.supportCurrencyList.find((v) => String(v || '').trim()) : '')
          || (typeof item.supportCurrency === 'string' ? String(item.supportCurrency).split(',')[0] : '')
          || ''
        const label = enableTimePeriod ? `${baseLabel} [${enableTimePeriod}]` : baseLabel
        return {
          value: String(value),
          label,
          supportType: item.supportType ?? null,
          min: item.paymentMinAmount ?? null,
          max: item.paymentMaxAmount ?? null,
          enableTimePeriod,
          currency: String(resolvedCurrency || '').trim(),
          paymentId: item.paymentId ?? null,
          raw: item
        }
      }
      return null
    },
    extractAvailableChannelList(rawData) {
      let source = rawData
      if (typeof source === 'string') {
        try {
          source = JSON.parse(source)
        } catch (_) {
          return []
        }
      }
      const isChannelArray = (arr) => {
        if (!Array.isArray(arr) || !arr.length) return false
        return arr.some((item) => {
          if (item && typeof item === 'object') {
            return (
              Object.prototype.hasOwnProperty.call(item, 'paymentNo')
              || Object.prototype.hasOwnProperty.call(item, 'paymentId')
              || Object.prototype.hasOwnProperty.call(item, 'paymentName')
              || Object.prototype.hasOwnProperty.call(item, 'channelName')
              || Object.prototype.hasOwnProperty.call(item, 'supportType')
              || Object.prototype.hasOwnProperty.call(item, 'enableTimePeriod')
            )
          }
          return typeof item === 'string' && item.includes(':')
        })
      }
      if (Array.isArray(source)) {
        return isChannelArray(source) ? source : []
      }
      if (!source || typeof source !== 'object') {
        return []
      }
      if (isChannelArray(source.list)) return source.list
      if (isChannelArray(source.paymentDtoList)) return source.paymentDtoList
      const queue = [source]
      const visited = new Set()
      while (queue.length) {
        const current = queue.shift()
        if (!current || typeof current !== 'object') continue
        if (visited.has(current)) continue
        visited.add(current)
        for (const val of Object.values(current)) {
          if (isChannelArray(val)) return val
          if (val && typeof val === 'object') queue.push(val)
        }
      }
      return []
    },
    resolveCreateOrderPaymentMeta(paymentNo) {
      const selectedOption = this.getCreatePaymentOptionByValue(paymentNo)
      if (selectedOption) {
        const optionCurrency = String(selectedOption.currency || '').trim()
        if (optionCurrency) {
          return {
            min: selectedOption.min ?? null,
            max: selectedOption.max ?? null,
            enableTimePeriod: String(selectedOption.enableTimePeriod || '').trim(),
            currency: optionCurrency
          }
        }
      }
      if (paymentNo && typeof paymentNo === 'object') {
        const objectCurrency = String(paymentNo.currency || '').trim()
        if (objectCurrency) {
          return {
            min: paymentNo.min ?? null,
            max: paymentNo.max ?? null,
            enableTimePeriod: String(paymentNo.enableTimePeriod || '').trim(),
            currency: objectCurrency
          }
        }
      }
      const keys = []
      if (paymentNo && typeof paymentNo === 'object') {
        keys.push(paymentNo.value, paymentNo.paymentNo, paymentNo.paymentId, paymentNo.id)
      } else {
        keys.push(paymentNo)
      }
      for (const key of keys) {
        const meta = this.getCreatePaymentMetaByKey(key)
        if (meta) return meta
      }
      const selectedValue = String((paymentNo && typeof paymentNo === 'object')
        ? (paymentNo.value ?? paymentNo.paymentNo ?? paymentNo.paymentId ?? paymentNo.id ?? '')
        : (paymentNo || '')).trim()
      if (!selectedValue) return null
      const option = (this.createPaymentOptions || []).find((item) => String(item?.value || '').trim() === selectedValue)
      if (!option) return null
      return {
        min: option.min ?? null,
        max: option.max ?? null,
        enableTimePeriod: String(option.enableTimePeriod || '').trim(),
        currency: String(option.currency || '').trim()
      }
    },
    getCreatePaymentOptionByValue(paymentNo) {
      const selectedValue = String((paymentNo && typeof paymentNo === 'object')
        ? (paymentNo.value ?? paymentNo.paymentNo ?? paymentNo.paymentId ?? paymentNo.id ?? '')
        : (paymentNo || '')).trim()
      if (!selectedValue) return null
      return (this.createPaymentOptions || []).find((item) => {
        const value = String(item?.value || '').trim()
        const paymentId = String(item?.paymentId || '').trim()
        return value === selectedValue || paymentId === selectedValue
      }) || null
    },
    resolveCurrencyFromOption(option) {
      if (!option || typeof option !== 'object') return ''
      const direct = String(option.currency || option.currencyType || option.currencyCode || option.currencyNo || '').trim()
      if (direct) return direct
      const raw = option.raw && typeof option.raw === 'object' ? option.raw : {}
      const rawDirect = String(raw.currency || raw.currencyType || raw.currencyCode || raw.currencyNo || '').trim()
      if (rawDirect) return rawDirect
      const key = Object.keys(raw).find((k) => String(k || '').toLowerCase().includes('currency') && String(raw[k] || '').trim())
      return key ? String(raw[key] || '').trim() : ''
    },
    handleCreateOrderPaymentChange(paymentNo) {
      const selectedOption = this.getCreatePaymentOptionByValue(paymentNo)
      const optionCurrency = this.resolveCurrencyFromOption(selectedOption)
      if (optionCurrency) {
        this.createOrderForm.currency = optionCurrency
        return
      }
      const meta = this.resolveCreateOrderPaymentMeta(paymentNo)
      if (String(meta?.currency || '').trim()) {
        this.createOrderForm.currency = String(meta.currency).trim()
        return
      }
      const fallbackCurrency = String(this.filterbox?.currency || this.filterbox?.currencyType || '').trim()
      this.createOrderForm.currency = fallbackCurrency
    },
    getCreatePaymentMetaByKey(key) {
      const normalized = String(key || '').trim()
      if (!normalized) return null
      if (this.createPaymentMetaMap[normalized]) return this.createPaymentMetaMap[normalized]
      const entries = Object.entries(this.createPaymentMetaMap || {})
      const matched = entries.find(([k]) => String(k || '').trim() === normalized)
      return matched ? matched[1] : null
    },
    getSelectedPaymentCurrency() {
      const optionCurrency = this.resolveCurrencyFromOption(this.getCreatePaymentOptionByValue(this.createOrderForm.paymentNo))
      if (optionCurrency) return optionCurrency
      const meta = this.resolveCreateOrderPaymentMeta(this.createOrderForm.paymentNo)
      if (String(meta?.currency || '').trim()) return String(meta.currency).trim()
      return String(this.filterbox?.currency || this.filterbox?.currencyType || '').trim()
    },
    getCreateOrderCurrencyName() {
      const code = String(this.createOrderForm.currency || this.getSelectedPaymentCurrency() || '').trim()
      if (!code) return ''
      const list = this.currencyOptions || []
      const upperCode = code.toUpperCase()
      let found = list.find((item) => String(item?.currencyType || '').toUpperCase() === upperCode)
      if (!found) {
        found = list.find((item) => {
          const ct = String(item?.currencyType || '').toUpperCase()
          return ct.startsWith(upperCode) || upperCode.startsWith(ct)
        })
      }
      return found?.name || code
    },
    isWithinEnableTimePeriod(enableTimePeriod) {
      const range = String(enableTimePeriod || '').trim()
      if (!range) return true
      const parts = range.split(',')
      if (parts.length !== 2) return true
      const toSecond = (text) => {
        const t = String(text || '').trim().split(':').map(Number)
        if (t.length !== 3 || t.some((n) => !Number.isFinite(n))) return null
        return t[0] * 3600 + t[1] * 60 + t[2]
      }
      const start = toSecond(parts[0])
      const end = toSecond(parts[1])
      if (start === null || end === null) return true
      if (start === end) return true
      const now = new Date()
      const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
      if (start < end) {
        return nowSec >= start && nowSec <= end
      }
      return nowSec >= start || nowSec <= end
    },
    getCreateOrderAmountRangeHint() {
      const meta = this.resolveCreateOrderPaymentMeta(this.createOrderForm.paymentNo)
      if (!meta || meta.min === null || meta.max === null) return ''
      return this.$t('orderCommon.form.amountRangeHint', { min: meta.min, max: meta.max })
    },
    validateCreateOrderAmountRange() {
      const meta = this.resolveCreateOrderPaymentMeta(this.createOrderForm.paymentNo)
      if (!meta || meta.min === null || meta.max === null) return true
      const amount = Number(this.createOrderForm.amount)
      const min = Number(meta.min)
      const max = Number(meta.max)
      if (!Number.isFinite(amount) || amount < min || amount > max) {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          duration: 3000,
          message: this.$t('orderCommon.validation.amountRangeInvalid', { min: meta.min, max: meta.max })
        })
        return false
      }
      return true
    },
    validateCreateOrderEnableTimePeriod() {
      const meta = this.resolveCreateOrderPaymentMeta(this.createOrderForm.paymentNo)
      const period = String(meta?.enableTimePeriod || '').trim()
      if (!period) return true
      if (!this.isWithinEnableTimePeriod(period)) {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          duration: 3000,
          message: this.$t('orderCommon.validation.enableTimePeriodInvalid', { period })
        })
        return false
      }
      return true
    },
    validateCreateOrderCurrency() {
      if (!String(this.createOrderForm.currency || '').trim()) {
        this.createOrderForm.currency = this.getSelectedPaymentCurrency()
      }
      if (String(this.createOrderForm.currency || '').trim()) return true
      this.$notify({
        title: this.$t('common.error'),
        type: 'error',
        duration: 3000,
        message: this.$t('orderCommon.validation.currencyRequired')
      })
      return false
    },
    resolveCreateOrderPayUrl(rawData) {
      let source = rawData
      if (typeof source === 'string') {
        try {
          source = JSON.parse(source)
        } catch (_) {
          return ''
        }
      }
      if (!source || typeof source !== 'object') return ''
      const direct = source.payUrl || source.payURL || source.payurl
      if (typeof direct === 'string' && direct.trim()) return direct.trim()
      for (const [key, value] of Object.entries(source)) {
        if (String(key || '').toLowerCase() === 'payurl' && typeof value === 'string' && value.trim()) {
          return value.trim()
        }
      }
      return ''
    },
    handleCreateOrderMerchantChange(merchantId) {
      this.createOrderForm.paymentNo = ''
      this.createPaymentOptions = []
      this.createPaymentMetaMap = {}
      this.createOrderForm.currency = ''
      if (!merchantId) {
        return
      }
      queryMerchantAvailableChannels({ merchantId }).then((res) => {
        if (res.status !== 200 || res.data.code !== 0) {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            duration: 3000,
            message: res.data?.message || this.$t('common.requestFailed')
          })
          return
        }
        const rawData = res.data?.data
        const list = this.extractAvailableChannelList(rawData)
        const parsedOptions = list
          .map((item) => this.parseAvailableChannelItem(item))
          .filter(Boolean)
          .filter((item) => {
            if (item.supportType === null || item.supportType === undefined || item.supportType === '') return true
            const supportType = Number(item.supportType)
            return supportType === 1 || supportType === 2
          })
        if (String(this.createOrderForm.merchantId || '') !== String(merchantId || '')) return
        this.createPaymentOptions = parsedOptions.map((item) => ({
          ...item,
          disabled: String(item.enableTimePeriod || '').trim()
            ? !this.isWithinEnableTimePeriod(item.enableTimePeriod)
            : false
        }))
        this.createPaymentMetaMap = {}
        parsedOptions.forEach((item) => {
          const meta = { min: item.min, max: item.max, enableTimePeriod: item.enableTimePeriod, currency: item.currency || '' }
          this.createPaymentMetaMap[item.value] = meta
          if (item.paymentId !== null && item.paymentId !== undefined && item.paymentId !== '') {
            this.createPaymentMetaMap[String(item.paymentId)] = meta
          }
        })
        this.handleCreateOrderPaymentChange(this.createOrderForm.paymentNo)
      }).catch((err) => {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          duration: 3000,
          message: err.message || this.$t('common.requestFailed')
        })
      })
    },
    submitCreateOrder() {
      this.$refs.createOrderFormRef.validate((valid) => {
        if (!valid) return
        if (!this.validateCreateOrderAmountRange()) return
        if (!this.validateCreateOrderCurrency()) return
        this.createGoogleConfirmVisible = true
        this.$nextTick(() => {
          this.$refs.createGoogleConfirmFormRef?.clearValidate()
        })
      })
    },
    closeCreateGoogleConfirm() {
      this.createGoogleConfirmVisible = false
      this.createGoogleConfirmForm.googleCode = ''
      this.$refs.createGoogleConfirmFormRef?.resetFields()
    },
    confirmCreateOrder() {
      this.$refs.createGoogleConfirmFormRef.validate((valid) => {
        if (!valid) return
        if (!this.validateCreateOrderAmountRange()) return
        if (!this.validateCreateOrderCurrency()) return
        const payWindow = window.open('', '_blank')
        const payload = {
          ...this.createOrderForm,
          googleCode: this.createGoogleConfirmForm.googleCode
        }
        manualCreatePayOutOrder(payload).then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            const payUrl = this.resolveCreateOrderPayUrl(res.data?.data)
            this.$notify({
              title: this.$t('common.success'),
              type: 'success',
              duration: 3000,
              message: res.data.message || this.$t('orderCommon.message.createSuccess')
            })
            if (payUrl) {
              if (payWindow && !payWindow.closed) {
                payWindow.location.replace(payUrl)
              } else {
                window.open(payUrl, '_blank', 'noopener,noreferrer')
              }
            } else if (payWindow && !payWindow.closed) {
              payWindow.close()
            }
            this.closeCreateOrderDialog()
            this.search()
            return
          }
          if (payWindow && !payWindow.closed) {
            payWindow.close()
          }
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            duration: 3000,
            message: res.data?.message || this.$t('common.requestFailed')
          })
        }).catch((err) => {
          if (payWindow && !payWindow.closed) {
            payWindow.close()
          }
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            duration: 3000,
            message: err.message || this.$t('common.requestFailed')
          })
        })
      })
    },
    callback(row) {
      if (!this.isAdmin) return
      this.callbackForm = {
        transactionNo: row?.transactionNo || row?.merchantOrderNo || '',
        merchantNo: row?.merchantNo || row?.merchantUserId || '',
        status: '2',
        remark: ''
      }
      this.googleConfirmForm.googleCode = ''
      this.callbackDialogVisible = true
      this.$nextTick(() => {
        this.$refs.callbackFormRef?.clearValidate()
      })
    },
    submitCallback() {
      if (!this.isAdmin) return
      this.$refs.callbackFormRef.validate((valid) => {
        if (!valid) return
        this.googleConfirmVisible = true
        this.$nextTick(() => {
          this.$refs.googleConfirmFormRef?.clearValidate()
        })
      })
    },
    closeGoogleConfirm() {
      this.googleConfirmVisible = false
      this.googleConfirmForm.googleCode = ''
      this.$refs.googleConfirmFormRef?.resetFields()
    },
    confirmCallback() {
      if (!this.isAdmin) return
      this.$refs.googleConfirmFormRef.validate((valid) => {
        if (!valid) return
        const payload = {
          ...this.callbackForm,
          googleCode: this.googleConfirmForm.googleCode
        }
        const callbackKey = this.buildCallbackLoadingKey(payload)
        this.setCallbackLoading(callbackKey, true)
        manualNotifyPayOutOrder(payload).then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            this.$notify({
              title: this.$t('common.success'),
              type: 'success',
              duration: 3000,
              message: res.data.message || this.$t('orderCommon.message.callbackSuccess')
            })
            this.googleConfirmVisible = false
            this.callbackDialogVisible = false
            this.googleConfirmForm.googleCode = ''
            return this.search()
          }
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            duration: 3000,
            message: res.data?.message || this.$t('common.requestFailed')
          })
        }).catch((err) => {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            duration: 3000,
            message: err.message || this.$t('common.requestFailed')
          })
        }).finally(() => {
          this.setCallbackLoading(callbackKey, false)
        })
      })
    },
    buildCallbackLoadingKey(payloadOrRow) {
      const key = payloadOrRow?.transactionNo || payloadOrRow?.merchantOrderNo || payloadOrRow?.orderId || ''
      return String(key || '').trim()
    },
    setCallbackLoading(key, loading) {
      if (!key) return
      if (loading) {
        this.callbackLoadingMap = { ...this.callbackLoadingMap, [key]: true }
        return
      }
      const nextMap = { ...this.callbackLoadingMap }
      delete nextMap[key]
      this.callbackLoadingMap = nextMap
    },
    isCallbackLoading(row) {
      const key = this.buildCallbackLoadingKey(row)
      return !!(key && this.callbackLoadingMap[key])
    },
    getCallbackStatusText(row) {
      if (this.isCallbackLoading(row)) {
        return this.$t('orderCommon.status.processing')
      }
      return getCallBackStatus(row?.callbackStatus)
    },
    getCallbackStatusClass(row) {
      if (this.isCallbackLoading(row)) return 'status-processing';
      const callbackStatus = String(row?.callbackStatus ?? '').trim();
      if (callbackStatus === '0') return 'status-pending';
      if (callbackStatus === '1') return 'status-fail';
      if (callbackStatus === '2') return 'status-success';
      return 'status-other';
    },
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
        orderType: 1
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
        return '0.00%';
      }
      return `${(num * 100).toFixed(2)}%`;
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
    isCallbackPending(callbackStatus) {
      return String(callbackStatus ?? '').trim() === '0';
    },
    isTestOrderType(orderType) {
      const value = String(orderType ?? '').trim();
      return value === '3' || value === '4';
    },
    getOrderTypeLabel(orderType) {
      const value = String(orderType ?? '').trim();
      if (value === '1') return this.$t('payingOrder.orderType.system');
      if (value === '2') return this.$t('payingOrder.orderType.manual');
      if (value === '3') return this.$t('payingOrder.orderType.test');
      if (value === '4') return this.$t('payingOrder.orderType.halfTest');
      return '-';
    },
    shouldShowCallbackAction(row) {
      if (!this.isAdmin) return false;
      if (this.isCallbackLoading(row)) return false;
      const orderStatus = String(row?.orderStatus ?? '').trim();
      const callbackStatus = String(row?.callbackStatus ?? '').trim();
      if (orderStatus === '3') return false;
      return (orderStatus === '4' && callbackStatus === '0')
        || (orderStatus === '2' && callbackStatus === '1');
    },
    shouldShowReverseAction(row) {
      if (!this.isAdmin) return false;
      const orderStatus = String(row?.orderStatus ?? '').trim();
      const orderType = String(row?.orderType ?? '').trim();
      return orderStatus === '2' && (orderType === '3' || orderType === '4');
    },
    shouldShowOrderFlowLogAction(row) {
      if (!this.isAdmin) return false;
      return !!String(row?.transactionNo || '').trim();
    },
    shouldShowActionMenu(row) {
      if (!this.isAdmin) return false;
      return !!row
        || row?.orderStatus === 1
        || this.shouldShowCallbackAction(row)
        || this.shouldShowReverseAction(row)
        || this.shouldShowOrderFlowLogAction(row);
    },
    openOrderDetail(row) {
      this.orderDetailData = {
        transactionNo: row?.transactionNo || '',
        merchantOrderNo: row?.merchantOrderNo || '',
        merchantName: this.merchantMaps[row?.merchantUserId] || row?.merchantName || '',
        currencyType: row?.currencyType || '',
        orderStatusText: getOrderStatus(row?.orderStatus),
        orderTypeText: this.getOrderTypeLabel(row?.orderType),
        amount: row?.amount,
        channelName: this.channelMaps[row?.channelId] || '',
        paymentNo: row?.paymentNo || '',
        callbackStatusText: this.getCallbackStatusText(row || {}),
        createTime: getTimeFromTimestamp(row?.requestTime),
        completeTime: getTimeFromTimestamp(row?.successCallbackTime),
        requestIp: row?.requestIp || '',
        remark: row?.remark || ''
      };
      this.orderDetailVisible = true;
    },
    viewOrderFlowLogs(row) {
      const transactionNo = String(row?.transactionNo || '').trim();
      if (!transactionNo) {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          duration: 3000,
          position: 'bottom-right',
          message: this.$t('common.requestFailed')
        });
        return;
      }
      const loadingKey = this.buildOrderFlowLoadingKey(row);
      this.setOrderFlowLoading(loadingKey, true);
      queryOrderFlowLogs({ transactionNo }).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.orderFlowLogTables = [];
          this.orderFlowTransactionNo = transactionNo;
          this.orderFlowLogText = '';
          let payload = res.data?.data;
          if (typeof payload === 'string') {
            try {
              payload = JSON.parse(payload);
            } catch (e) {
              // keep original string
            }
          }
          const normalized = this.normalizeOrderFlowPayload(payload, transactionNo);
          this.orderFlowTransactionNo = normalized.transactionNo || transactionNo;
          this.orderFlowLogTables = normalized.flowLogs.map((item) => this.mapFlowLogItemToTableRows(item));
          if (!this.orderFlowLogTables.length) {
            this.orderFlowLogText = typeof payload === 'string'
              ? payload
              : JSON.stringify(payload ?? {}, null, 2);
          }
          this.closeActionDropdowns();
          this.orderFlowLogVisible = true;
          return;
        }
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          duration: 3000,
          position: 'bottom-right',
          message: res.data?.message || this.$t('common.requestFailed')
        });
      }).catch((err) => {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          duration: 3000,
          position: 'bottom-right',
          message: err.message || this.$t('common.requestFailed')
        });
      }).finally(() => {
        this.setOrderFlowLoading(loadingKey, false);
      });
    },
    buildOrderFlowLoadingKey(payloadOrRow) {
      const key = payloadOrRow?.transactionNo || payloadOrRow?.merchantOrderNo || payloadOrRow?.orderId || '';
      return String(key || '').trim();
    },
    setOrderFlowLoading(key, loading) {
      if (!key) return;
      if (loading) {
        this.orderFlowLoadingMap = { ...this.orderFlowLoadingMap, [key]: true };
        return;
      }
      const nextMap = { ...this.orderFlowLoadingMap };
      delete nextMap[key];
      this.orderFlowLoadingMap = nextMap;
    },
    isOrderFlowLoading(row) {
      const key = this.buildOrderFlowLoadingKey(row);
      return !!(key && this.orderFlowLoadingMap[key]);
    },
    closeActionDropdowns() {
      if (typeof document === 'undefined') return;
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    },
    normalizeOrderFlowPayload(payload, defaultTransactionNo) {
      const result = { transactionNo: defaultTransactionNo || '', flowLogs: [] };
      if (Array.isArray(payload)) {
        result.flowLogs = payload;
        return result;
      }
      if (payload && typeof payload === 'object') {
        result.transactionNo = String(
          payload.transactionNo || payload.orderNo || payload.platformOrderNo || defaultTransactionNo || ''
        ).trim();
        if (Array.isArray(payload.flowLogs)) {
          result.flowLogs = payload.flowLogs;
          return result;
        }
        if (Array.isArray(payload.orderFlowLogs)) {
          result.flowLogs = payload.orderFlowLogs;
          return result;
        }
        const firstArray = Object.values(payload).find((v) => Array.isArray(v));
        if (Array.isArray(firstArray)) {
          result.flowLogs = firstArray;
          return result;
        }
        result.flowLogs = [payload];
        return result;
      }
      return result;
    },
    mapFlowLogItemToTableRows(item) {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const keys = Object.keys(item).filter((key) => !['id', 'stepCode', 'transactionNo'].includes(key));
        const orderedKeys = this.sortOrderFlowKeys(keys);
        return orderedKeys
          .map((key) => ({
            field: this.getOrderFlowFieldLabel(key),
            value: this.normalizeOrderFlowFieldValue(key, item[key])
          }));
      }
      return [{ field: this.getOrderFlowFieldLabel('value'), value: item }];
    },
    sortOrderFlowKeys(keys) {
      const priority = ['stepSeq', 'stepName', 'eventTime', 'createTime', 'payload', 'success', 'traceId'];
      return [...keys].sort((a, b) => {
        const ai = priority.indexOf(a);
        const bi = priority.indexOf(b);
        const pa = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
        const pb = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
        if (pa !== pb) return pa - pb;
        return String(a).localeCompare(String(b));
      });
    },
    getOrderFlowFieldLabel(field) {
      const map = {
        createTime: this.$t('orderFlow.field.createTime'),
        eventTime: this.$t('orderFlow.field.eventTime'),
        payload: this.$t('orderFlow.field.payload'),
        stepName: this.$t('orderFlow.field.stepName'),
        stepSeq: this.$t('orderFlow.field.stepSeq'),
        success: this.$t('orderFlow.field.success'),
        traceId: this.$t('orderFlow.field.traceId'),
        value: this.$t('orderFlow.field.value')
      };
      return map[field] || field;
    },
    normalizeOrderFlowFieldValue(field, value) {
      if ((field === 'createTime' || field === 'eventTime') && value !== null && value !== undefined && value !== '') {
        return getTimeFromTimestamp(value);
      }
      if (field === 'payload') {
        if (typeof value === 'string') {
          try {
            return JSON.stringify(JSON.parse(value), null, 2);
          } catch (e) {
            return value;
          }
        }
        if (value && typeof value === 'object') {
          try {
            return JSON.stringify(value, null, 2);
          } catch (e) {
            return String(value);
          }
        }
      }
      if (field === 'success') {
        const text = String(value ?? '').trim().toLowerCase();
        if (text === '1' || text === 'true' || text === 'success' || text === 'yes') return this.$t('common.yes');
        if (text === '0' || text === 'false' || text === 'fail' || text === 'no') return this.$t('common.no');
      }
      return value;
    },
    formatOrderFlowCell(value) {
      if (value === null || value === undefined || value === '') return '-';
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value);
        } catch (e) {
          return String(value);
        }
      }
      return String(value);
    },
    isOrderFlowFailed(tableRows) {
      if (!Array.isArray(tableRows)) return false;
      const successLabel = this.getOrderFlowFieldLabel('success');
      const successRow = tableRows.find((row) => row?.field === successLabel || row?.field === 'success');
      if (!successRow) return false;
      const raw = String(successRow.value ?? '').trim().toLowerCase();
      const noText = String(this.$t('common.no') || '').trim().toLowerCase();
      return raw === '0'
        || raw === 'false'
        || raw === 'fail'
        || raw === 'failed'
        || raw === 'no'
        || (noText && raw === noText);
    },
    bindOrderFlowOutsideClose() {
      if (this.orderFlowOutsideCloseHandler) return;
      this.orderFlowOutsideCloseHandler = (event) => {
        if (!this.orderFlowLogVisible) return;
        const target = event.target;
        const drawerEl = document.querySelector('.el-drawer');
        if (!drawerEl) return;
        if (target instanceof Node && !drawerEl.contains(target)) {
          this.orderFlowLogVisible = false;
        }
      };
      document.addEventListener('click', this.orderFlowOutsideCloseHandler, true);
    },
    unbindOrderFlowOutsideClose() {
      if (!this.orderFlowOutsideCloseHandler) return;
      document.removeEventListener('click', this.orderFlowOutsideCloseHandler, true);
      this.orderFlowOutsideCloseHandler = null;
    },
    reverseOrder(row) {
      this.reverseOrderPayload = {
        transactionNo: row?.transactionNo || '',
        bizType: 1
      }
      this.reverseRemarkForm.remark = ''
      this.reverseRemarkVisible = true
      this.$nextTick(() => {
        this.$refs.reverseRemarkFormRef?.clearValidate()
      })
    },
    closeReverseRemark() {
      this.reverseRemarkVisible = false
      this.reverseRemarkForm.remark = ''
      this.reverseOrderPayload = null
      this.$refs.reverseRemarkFormRef?.resetFields()
    },
    submitReverseRemark() {
      if (!this.reverseOrderPayload) return
      this.$refs.reverseRemarkFormRef.validate((valid) => {
        if (!valid) return
        this.reverseRemarkVisible = false
        this.reverseGoogleConfirmForm.googleCode = ''
        this.reverseGoogleConfirmVisible = true
        this.$nextTick(() => {
          this.$refs.reverseGoogleConfirmFormRef?.clearValidate()
        })
      })
    },
    closeReverseFlow() {
      this.reverseGoogleConfirmForm.googleCode = ''
      this.reverseRemarkForm.remark = ''
      this.reverseGoogleConfirmVisible = false
      this.reverseRemarkVisible = false
      this.reverseOrderPayload = null
      this.$refs.reverseGoogleConfirmFormRef?.resetFields()
      this.$refs.reverseRemarkFormRef?.resetFields()
    },
    closeReverseGoogleConfirm() {
      this.closeReverseFlow()
    },
    confirmReverseOrder() {
      if (!this.reverseOrderPayload) return
      this.$refs.reverseGoogleConfirmFormRef.validate((valid) => {
        if (!valid) return
        const payload = {
          ...this.reverseOrderPayload,
          remark: this.reverseRemarkForm.remark,
          googleCode: this.reverseGoogleConfirmForm.googleCode
        }
        manualReverseOrder(payload).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.$notify({
            title: this.$t('common.success'),
            type: 'success',
            duration: 3000,
            position: 'bottom-right',
            message: res.data.message || this.$t('common.updateSuccess')
          });
          this.closeReverseFlow()
          this.search();
          return;
        }
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          duration: 3000,
          position: 'bottom-right',
          message: res.data?.message || this.$t('common.requestFailed')
        });
      }).catch((err) => {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          duration: 3000,
          position: 'bottom-right',
          message: err.message || this.$t('common.requestFailed')
        });
      });
      })
    },
    reset(form) {
      this.$refs[form].resetFields();
      this.filterbox.filterDateRangeUtc = []
      this.filterbox.startTime = null
      this.filterbox.endTime = null
    },
    search() {
      this.ensureQueryTimeRange()
      return getPayingOrder(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.payingOrderTableInfo = allData.payOrderDtoList || []
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
    ensureQueryTimeRange() {
      let range = (this.filterbox.filterDateRangeUtc && this.filterbox.filterDateRangeUtc.length === 2)
          ? this.filterbox.filterDateRangeUtc
          : this.filterbox.filterDateRange
      const validRange = Array.isArray(range) &&
          range.length === 2 &&
          Number.isFinite(Number(range[0])) &&
          Number.isFinite(Number(range[1]))
      if (!validRange) {
        const startMs = getTodayStartTimestamp() * 1000
        const endMs = startMs + 86399 * 1000
        const fallback = [startMs, endMs]
        this.filterbox.filterDateRange = fallback
        this.filterbox.filterDateRangeUtc = this.toUtcRange(fallback, this.timeZoneKey)
        this.filterbox.filterDateRangeLast = [...this.filterbox.filterDateRange]
        this.filterbox.filterDateRangeUtcLast = [...this.filterbox.filterDateRangeUtc]
        range = this.filterbox.filterDateRangeUtc
      }
      this.filterbox.startTime = Math.floor(Number(range[0]) / 1000)
      this.filterbox.endTime = Math.floor(Number(range[1]) / 1000) + 86399
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
    handleDateRangeChange(val) {
      if (!val || val.length !== 2) {
        this.filterbox.filterDateRangeUtc = [];
        return;
      }
      const normalized = this.clampRangeWithinSixMonths(val[0], val[1]);
      this.filterbox.filterDateRange = [...normalized];
      this.filterbox.filterDateRangeUtc = this.toUtcRange(normalized, this.timeZoneKey);
      this.filterbox.startTime = Number(this.filterbox.filterDateRangeUtc[0]) / 1000;
      this.filterbox.endTime = Number(this.filterbox.filterDateRangeUtc[1]) / 1000 + 86399;
      this.filterbox.filterDateRangeLast = [...normalized];
      this.filterbox.filterDateRangeUtcLast = [...this.filterbox.filterDateRangeUtc];
    },
    clampRangeWithinSixMonths(startMs, endMs) {
      const start = new Date(Number(startMs));
      const limit = new Date(start.getTime());
      limit.setMonth(limit.getMonth() + 6);
      const maxEndMs = limit.getTime() - 86399 * 1000;
      const safeEnd = Math.min(Number(endMs), maxEndMs);
      return [Number(startMs), Math.max(Number(startMs), safeEnd)];
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
      this.currentPage = currentPage;
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.pageSize
    this.search()
    this.fetchCardInfo();
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
          this.staticsData.currencyType = this.currencyOptions[0].currencyType;
          this.filterbox.currencyType = this.currencyOptions[0].currencyType;
          this.currencyIcons = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon;
          });
          this.currencyIcon = this.currencyIcons[this.currency] || '';
          this.fetchCardInfo();
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
    this.isAdmin = roleName === 'admin'
    if (roleName && roleName !== 'admin') {
      this.filterbox.merchantUserId = localStorage.getItem('userId');
      this.filterAvaiable = true
    }
    const startMs = getTodayStartTimestamp() * 1000;
    const endMs = startMs + 86399 * 1000;
    if (!this.filterbox.filterDateRange || this.filterbox.filterDateRange.length !== 2) {
      this.filterbox.filterDateRange = [startMs, endMs];
      this.filterbox.filterDateRangeUtc = this.toUtcRange([startMs, endMs], this.timeZoneKey);
    }
    this.filterbox.filterDateRangeLast = [...this.filterbox.filterDateRange];
    this.filterbox.filterDateRangeUtcLast = [...this.filterbox.filterDateRangeUtc];

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
    this.applyRouteQueryFilters()
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
    this.unbindOrderFlowOutsideClose();
  },
  watch: {
    'createOrderForm.paymentNo'(val) {
      this.handleCreateOrderPaymentChange(val)
    },
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

.status-processing {
  background-color: #3b82f6;
}

.status-success {
  background-color: #16a34a;
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

.create-order-form {
  width: 340px;
  margin: 0 auto;
}

.create-order-currency-value {
  width: 200px;
  min-height: 32px;
  line-height: 32px;
  padding: 0 11px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #606266;
  background-color: #f5f7fa;
  box-sizing: border-box;
}

.create-order-amount-hint {
  width: 200px;
  font-size: 12px;
  line-height: 1.4;
  color: #dc2626;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.create-order-amount-hint .hint-icon {
  width: 14px;
  height: 14px;
  min-width: 14px;
  border-radius: 50%;
  background-color: #dc2626;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

:deep(.main-toolbar .main-toolform.paying-order-toolform > .el-row) {
  justify-content: flex-start !important;
}

:deep(.main-toolbar .main-toolform.paying-order-toolform > .el-row > .el-col) {
  justify-content: flex-start !important;
}

.order-flow-log-body {
  height: calc(100vh - 140px);
  overflow-y: auto;
  padding-right: 4px;
}

.order-flow-log-header {
  margin-bottom: 12px;
}

.order-flow-log-subtitle {
  margin-bottom: 10px;
}

.order-flow-log-table-wrap {
  margin-bottom: 12px;
  border: 2px solid #303133;
  border-radius: 4px;
  padding: 6px;
}

.order-flow-log-table {
  width: 100%;
}

.order-flow-log-value {
  white-space: pre-wrap;
  word-break: break-all;
}

.order-flow-log-table-failed :deep(.el-table__cell .cell) {
  color: #f56c6c !important;
}

</style>
<style>


</style>
