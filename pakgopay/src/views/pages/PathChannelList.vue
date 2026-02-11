<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateTime, getFormateTimeByTimeBystamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">{{ $t('pathChannelList.title') }}</div>

  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="main-toolbar" style="height: auto;">
        <el-form style="width: 100%" ref="filterboxForm" :model="filterbox">
          <el-row style="width: 100%;">
            <el-col :span="24">
              <div style="display: flex;flex-direction: row;justify-content: right;">
                <el-button @click="search()" class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="search"/>
                  <div>{{ $t('common.query') }}</div>
                </el-button>
                <el-button @click="reset('filterboxForm')" class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="reset"/>
                  <div>{{ $t('common.reset') }}</div>
                </el-button>
                <el-button @click="exportPathChannelInfos" class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="export"/>
                  <div>{{ $t('common.export') }}</div>
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row style="width: 100%;margin-top:10px">
            <div style="display: flex;flex-direction: row;width: 100%">
              <el-col :span="5">
                <el-form-item :label="$t('pathChannelList.filter.channelName')" label-width="150px" prop="paymentName">
                  <el-select
                    v-model="filterbox.paymentName"
                    filterable
                    remote
                    clearable
                    :remote-method="handlePaymentNameSearch"
                    :loading="paymentNameLoading"
                    :placeholder="$t('pathChannelList.placeholder.channelName')"
                    popper-class="pathchannel-name-select-dropdown"
                    @visible-change="handlePaymentNameDropdownVisible"
                    style="width: 200px;height: 100%"
                  >
                    <el-option
                      v-for="item in paymentNameOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('pathChannelList.filter.supportType')" label-width="150px" prop="supportType">
                  <el-select v-model="filterbox.supportType"  :placeholder="$t('pathChannelList.placeholder.supportType')"
                             :options="supportTypeOptions"
                             style="width: 200px;height: 100%"
                             clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="$t('pathChannelList.filter.paymentType')" label-width="150px" prop="paymentType">
                  <el-select v-model="filterbox.paymentType" :placeholder="$t('pathChannelList.placeholder.paymentType')"
                             :options="paymentTypeOptions" style="width: 200px;height: 100%"
                             clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item :label="$t('pathChannelList.filter.status')" label-width="150px" prop="status">
                  <el-select v-model="filterbox.status"
                     :options="paymentStatusOptions"
                      :placeholder="$t('pathChannelList.placeholder.status')"
                      clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item :label="$t('common.currency')" label-width="100px" prop="currency">
                  <el-select
                      style="width: 200px;align-items: center;text-align: center;"
                      :options="currencyOptions"
                      :props="currencyProps"
                      default-first-option
                      v-model="filterbox.currency"
                      filterable
                  />
                </el-form-item>
              </el-col>
            </div>

          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="reportInfo">
    <div class="main-views-form" style="height: 100%">
      <div style="width: 100%">
        <el-button @click="createPathChannel" style="float: right">
          <svgIcon height="25px" width="25px" name="add"/>
          <div>{{ $t('common.operate.add') }}</div>
        </el-button>
      </div>

      <el-table
          border :data="PathChannelTableInfo"
          class="paymentList"
          style="height:auto;"
          :key="tableKey"
      >
        <el-table-column
            prop="paymentNo"
            :label="$t('pathChannelList.column.channelNo')"
            v-slot="{row}"
            align="center"
            fixed="left"
            width="100px"
        >
          <div>
            {{ row.paymentNo }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentName"
            :label="$t('pathChannelList.column.channelName')"
            v-slot="{row}"
            align="center"
            fixed="left"
            width="200px;"
        >
          <div>
            {{ row.paymentName }}
          </div>
        </el-table-column>
        <el-table-column
            prop="status"
            :label="$t('pathChannelList.column.status')"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.disable')"
                :active-value="1"
                :inactive-value="0"
                disabled
            ></el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="isThird"
            :label="$t('pathChannelList.column.isThird')"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            {{ isThirdLabel(row.isThird) }}
          </div>
        </el-table-column>
        <el-table-column
            prop="supportType"
            :label="$t('pathChannelList.column.supportType')"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div>
            {{ supportTypeLabel(row.supportType) }}
          </div>
        </el-table-column>
        <el-table-column
            prop="enableTimePeriod"
            :label="$t('pathChannelList.column.enableTimePeriod')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
<!--            {{row.enableTimePeriod}}-->
<!--            {{
              !row.enableTimePeriod ? 'all' : getFormateTimeByTimeBystamp(row.enableTimePeriod ? row.enableTimePeriod.toLocaleString().split(',')[0] : '') + '-' + getFormateTimeByTimeBystamp(row.enableTimePeriod ? row.enableTimePeriod.toLocaleString().split(',')[1] : '')
            }}-->
            {{!row.enableTimePeriod ? $t('pathChannelList.label.allTime') : row.enableTimePeriod}}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentType"
            :label="$t('pathChannelList.column.paymentType')"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          {{ paymentTypeLabel(row.paymentType) }}
        </el-table-column>
        <el-table-column
            prop="isCheckoutCounter"
            :label="$t('pathChannelList.column.checkoutCounter')"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <el-switch
              :model-value="row.isCheckoutCounter"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="$t('common.enable')"
              :inactive-text="$t('common.disable')"
              :active-value="1"
              :inactive-value="0"
          />
        </el-table-column>
        <el-table-column
            prop="collectionDailyLimit"
            :label="$t('pathChannelList.column.collectionDailyLimit')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.collectionDailyLimit }}
          </div>
        </el-table-column>
        <el-table-column
            prop="collectionMonthlyLimit"
            :label="$t('pathChannelList.column.collectionMonthlyLimit')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.collectionMonthlyLimit }}
          </div>
        </el-table-column>
        <el-table-column
            prop="payDailyLimit"
            :label="$t('pathChannelList.column.payDailyLimit')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.payDailyLimit }}
          </div>
        </el-table-column>
        <el-table-column
            prop="payMonthlyLimit"
            :label="$t('pathChannelList.column.payMonthlyLimit')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.payMonthlyLimit }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentRequestPayUrl"
            :label="$t('pathChannelList.column.paymentRequestPayUrl')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentRequestPayUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentRequestCollectionUrl"
            :label="$t('pathChannelList.column.paymentRequestCollectionUrl')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentRequestCollectionUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentCollectionRate"
            :label="$t('pathChannelList.column.paymentCollectionRate')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentCollectionRate }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentPayRate"
            :label="$t('pathChannelList.column.paymentPayRate')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentPayRate }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentCheckPayUrl"
            :label="$t('pathChannelList.column.paymentCheckPayUrl')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentCheckPayUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentCheckCollectionUrl"
            :label="$t('pathChannelList.column.paymentCheckCollectionUrl')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentCheckCollectionUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="collectionCallbackAddr"
            :label="$t('pathChannelList.column.collectionCallbackAddr')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.collectionCallbackAddr }}
          </div>
        </el-table-column>
        <el-table-column
            prop="payCallbackAddr"
            :label="$t('pathChannelList.column.payCallbackAddr')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.payCallbackAddr }}
          </div>
        </el-table-column>
        <el-table-column
            prop="checkoutCounterUrl"
            :label="$t('pathChannelList.column.checkoutCounterUrl')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.checkoutCounterUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathEachLimit"
            :label="$t('common.currency')"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
<!--          <el-select
            :options="currencyOptions"
            :props="currencyProps"
            :v-model="row.currency"
          >

          </el-select>-->
          {{currencyMaps[row.currency]}}
<!--          <div>
            {{ row.currency }}
          </div>-->
        </el-table-column>
        <!--        <el-table-column
                    prop="pathChannelOpenTime"
                    label="通道开启时间"
                    v-slot="{row}"
                    align="center"
                    width="150px;"
                >
                  <div>
                    {{row.pathChannelOpenTime}}
                  </div>
                </el-table-column>
                <el-table-column
                    prop="pathChannelCloseTime"
                    label="通道关闭时间"
                    v-slot="{row}"
                    align="center"
                    width="150px"
                >
                  <div>
                    {{row.pathChannelCloseTime}}
                  </div>
                </el-table-column>
                <el-table-column
                    prop="pathChannelSpending"
                    label="通道支出"
                    v-slot="{row}"
                    align="center"
                    width="200px"
                >
                  <div>
                    {{row.pathChannelSpending}}
                  </div>
                </el-table-column>
                <el-table-column
                    prop="pathChannelCurrencyType"
                    label="通道币种"
                    v-slot="{row}"
                    align="center"
                    width="100px"
                >
                  <div>
                    {{row.pathChannelCurrencyType}}
                  </div>
                </el-table-column>
                <el-table-column
                    prop="pathChannelRate"
                    label="通道费率"
                    v-slot="{row}"
                    align="center"
                    width="80px"
                >
                  <div>
                    {{row.pathChannelRate}}
                  </div>
                </el-table-column>
                <el-table-column
                    prop="pathChannelType"
                    label="通道类型"
                    v-slot="{row}"
                    align="center"
                    width="150px"
                >
                  <div>
        &lt;!&ndash;            {{row.pathChannelType}}&ndash;&gt;
                    <el-select
                      v-model="row.pathChannelType"
                      style="width: 100px;"
                      suffix-icon=""
                      disabled
                    >
                      <el-option
                        v-for="item in pathChannelTypeOptions"
                        :label="item.label"
                        :key="item.key"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </el-table-column>-->
        <el-table-column
            prop="operate"
            :label="$t('common.operation')"
            align="center"
            fixed="right"
            v-slot="{row}"
        >
          <el-dropdown trigger="click">
            <SvgIcon name="more" width="30" height="30"/>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editPathChannelInfo(row)">{{ $t('common.edit') }}</el-dropdown-item>
                <el-dropdown-item @click="PathChannelDetailInfo(row)">{{ $t('common.detail') }}</el-dropdown-item>
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
         
          @current-change="handleCurrentPageChange"
          @size-change="handleSizeChange"
      >

      </el-pagination>
    </div>
  </div>

  <el-dialog
    :title="paymentDetailDialogTitle"
    v-model="paymentDetailVisible"
    class="dialog"
    center="true"
    width="90%"
    style="height: 600px;align-content: center"
  >
    <el-form
        style="margin-top: 10px;width: 100%;margin-left: 2%;"
        :model="paymentDetailInfo"
    >
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.channelNo')"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentNo}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.channelName')"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentName}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.status')"
              label-width="150px"
          >
            <el-switch
                :model-value="paymentDetailInfo.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.disable')"
                :active-value = "1"
                :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.isThird')"
              label-width="150px"
          >
            {{ isThirdLabel(paymentDetailInfo.isThird) }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.supportType')"
              label-width="150px"
          >
            {{ supportTypeLabel(paymentDetailInfo.supportType) }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.enableTimePeriod')"
              label-width="150px"
          >
            {{
              !paymentDetailInfo.enableTimePeriod ? $t('pathChannelList.label.allTime') : getFormateTimeByTimeBystamp(paymentDetailInfo.enableTimePeriod ? paymentDetailInfo.enableTimePeriod.split(',')[0] : '') + '-' + getFormateTimeByTimeBystamp(paymentDetailInfo.enableTimePeriod ? paymentDetailInfo.enableTimePeriod.split(',')[1] : '')
            }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentType')"
              label-width="150px"
          >
            {{ paymentTypeLabel(paymentDetailInfo.paymentType) }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.checkoutCounter')"
              prop="isCheckoutCounter"
              label-width="150px"
          >
            <el-switch
                :model-value="paymentDetailInfo.isCheckoutCounter"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.disable')"
                :active-value = "1"
                :inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.singleLimit')"
              label-width="150px"
          >
            [{{paymentDetailInfo.paymentMinAmount}},{{paymentDetailInfo.paymentMaxAmount}}]
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.collectionDailyLimit')"
              label-width="150px"
          >
            {{paymentDetailInfo.collectionDailyLimit}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.collectionMonthlyLimit')"
              label-width="150px"
          >
            {{paymentDetailInfo.collectionMonthlyLimit}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.payDailyLimit')"
              label-width="150px"
          >
            {{paymentDetailInfo.payDailyLimit}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.payMonthlyLimit')"
              label-width="150px"
          >
            {{paymentDetailInfo.payMonthlyLimit}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentRequestPayUrl')"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentRequestCollectionUrl}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentRequestCollectionUrl')"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentRequestCollectionUrl}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentCollectionRate')"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentCollectionRate}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentPayRate')"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentPayRate}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentCheckPayUrl')"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentCheckPayUrl}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentCheckCollectionUrl')"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentCheckCollectionUrl}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.collectionCallbackAddr')"
              label-width="150px"
          >
            {{paymentDetailInfo.collectionCallbackAddr}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.payCallbackAddr')"
              label-width="150px"
          >
            {{paymentDetailInfo.payCallbackAddr}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.collectionInterfaceParam')"
              label-width="150px"
          >
            {{paymentDetailInfo.collectionInterfaceParam}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.payInterfaceParam')"
              label-width="150px"
          >
            {{paymentDetailInfo.payInterfaceParam}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.bankName')"
              label-width="150px"
          >
            {{paymentDetailInfo.bankName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.bankAccount')"
              label-width="150px"
          >
            {{paymentDetailInfo.bankAccount}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.bankUserName')"
              label-width="150px"
          >
            {{paymentDetailInfo.bankUserName}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('common.currency')"
              label-width="150px"
          >
            {{paymentDetailInfo.currency}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
  <el-dialog
      :title="pathChannelDialogTitle"
      v-model="dialogFormVisible"
      class="dialog"
      center="true"
      width="90%"
      style="height: 600px;align-content: center"
  >
    <el-form style="margin-top: 50px;width: 100%" ref="createPaymentForm" :rules="createPaymentInfoRules" :model="createPathChannelInfo">
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.channelNo')"
              label-width="150px"
              prop="paymentNo"
          >
            <el-input v-model="createPathChannelInfo.paymentNo" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.channelName')"
              label-width="150px"
              prop="paymentName"
          >
            <el-input v-model="createPathChannelInfo.paymentName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.status')"
              label-width="150px"
              prop="status"
          >
            <el-radio-group
                v-model="createPathChannelInfo.status"

            >
              <el-radio :label="0">{{ $t('common.disable') }}</el-radio>
              <el-radio :label="1">{{ $t('common.enable') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.isThird')"
              label-width="150px"
              prop="isThird"
          >
            <el-radio-group v-model="createPathChannelInfo.isThird">
              <el-radio value="0">{{ $t('pathChannelList.label.systemPay') }}</el-radio>
              <el-radio value="1">{{ $t('pathChannelList.label.thirdPay') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.supportType')"
              label-width="150px"
              prop="supportType"
          >
            <el-select
                :options="supportTypeOptions"
                v-model="createPathChannelInfo.supportType"
                style="width: 200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.enableTimePeriod')"
              label-width="150px"
              prop="enableTimePeriod"
          >
            <el-time-picker
            type="time"
            v-model="createPathChannelInfo.enableTimePeriod1"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
            is-range
            range-separator="-"
            @change="timeChange"
            style="width: 200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentType')"
              label-width="150px"
              prop="paymentType"
          >
            <el-select
              :options="paymentTypeOptions"
              :props="paymentTypeOptions"
              v-model="createPathChannelInfo.paymentType"
              style="width: 200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.checkoutCounter')"
              prop="isCheckoutCounter"
              label-width="150px"
          >
            <el-radio-group
                v-model="createPathChannelInfo.isCheckoutCounter"
            >
              <el-radio :value="0">{{ $t('common.no') }}</el-radio>
              <el-radio :value="1">{{ $t('common.yes') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6" v-if="createPathChannelInfo.isCheckoutCounter===1">
          <el-form-item
            :label="$t('pathChannelList.form.checkoutCounterUrl')"
            label-width="150px"
            prop="checkoutCounterUrl"
          >
            <el-input style="width: 200px" v-model="createPathChannelInfo.checkoutCounterUrl"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentMinAmount')"
              label-width="150px"
              prop="paymentMinAmount"
          >
            <el-input type="number" v-model.number="createPathChannelInfo.paymentMinAmount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentMaxAmount')"
              label-width="150px"
              prop="paymentMaxAmount"
          >
            <el-input type="number" v-model.number="createPathChannelInfo.paymentMaxAmount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('common.currency')"
              label-width="150px"
              prop="currency"
          >
            <el-select
              :options="currencyOptions"
              :props="currencyProps"
              v-model="createPathChannelInfo.currency"
              style="width: 200px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%" v-if="createPathChannelInfo.supportType === 0 || createPathChannelInfo.supportType === 2">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.collectionDailyLimit')"
              label-width="150px"
              prop="collectionDailyLimit"
          >
            <el-input v-model.number="createPathChannelInfo.collectionDailyLimit" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.collectionMonthlyLimit')"
              label-width="150px"
              prop="collectionMonthlyLimit"
          >
            <el-input v-model.number="createPathChannelInfo.collectionMonthlyLimit" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentRequestCollectionUrl')"
              label-width="150px"
              prop="paymentRequestCollectionUrl"
          >
            <el-input v-model="createPathChannelInfo.paymentRequestCollectionUrl" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentCollectionRate')"
              label-width="150px"
              prop="paymentCollectionRate"
          >
            <el-input v-model="createPathChannelInfo.paymentCollectionRate" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%" v-if="createPathChannelInfo.supportType === 0 || createPathChannelInfo.supportType === 2">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentCheckCollectionUrl')"
              label-width="150px"
              prop="paymentCheckCollectionUrl"
          >
            <el-input v-model="createPathChannelInfo.paymentCheckCollectionUrl" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.collectionCallbackAddr')"
              label-width="150px"
              prop="collectionCallbackAddr"
          >
            <el-input v-model="createPathChannelInfo.collectionCallbackAddr" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.collectionInterfaceParam')"
              label-width="150px"
              prop="collectionInterfaceParam"
          >
            <el-input v-model="createPathChannelInfo.collectionInterfaceParam" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%" v-if="createPathChannelInfo.supportType === 1 || createPathChannelInfo.supportType === 2">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.payDailyLimit')"
              label-width="150px"
              prop="payDailyLimit"
          >
            <el-input v-model.number="createPathChannelInfo.payDailyLimit" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.payMonthlyLimit')"
              label-width="150px"
              prop="payMonthlyLimit"
          >
            <el-input v-model.number.number="createPathChannelInfo.payMonthlyLimit" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentRequestPayUrl')"
              label-width="150px"
              prop="paymentRequestPayUrl"
          >
            <el-input v-model="createPathChannelInfo.paymentRequestPayUrl" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentPayRate')"
              label-width="150px"
              prop="paymentPayRate"
          >
            <el-input v-model="createPathChannelInfo.paymentPayRate" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%" v-if="createPathChannelInfo.supportType === 1 || createPathChannelInfo.supportType === 2">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.paymentCheckPayUrl')"
              label-width="150px"
              prop="paymentCheckPayUrl"
          >
            <el-input v-model="createPathChannelInfo.paymentCheckPayUrl" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.payCallbackAddr')"
              label-width="150px"
              prop="payCallbackAddr"
          >
            <el-input v-model="createPathChannelInfo.payCallbackAddr" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.payInterfaceParam')"
              label-width="150px"
              prop="payInterfaceParam"
          >
            <el-input v-model="createPathChannelInfo.payInterfaceParam" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%" v-if="createPathChannelInfo.paymentType === '2'">
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.bankName')"
              label-width="150px"
              prop="bankName"
          >
            <el-input v-model="createPathChannelInfo.bankName" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.bankAccount')"
              label-width="150px"
              prop="bankAccount"
          >
            <el-input v-model="createPathChannelInfo.bankAccount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              :label="$t('pathChannelList.form.bankUserName')"
              label-width="150px"
              prop="bankUserName"
          >
            <el-input v-model="createPathChannelInfo.bankUserName" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="float: right;">
      <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitCreatePaymentInfo(submitType)">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
  <el-dialog
    :title="confirmDialogTitle"
    v-model="confirmDialogVisible"
    class="dialog"
    center
    width="30%"
    height="200px"
  >
    <el-form ref="confirmDataForm" :rules="confirmRule" :model="confirmData" style="height:100px;margin-top: 20px">
      <el-row>
        <el-col :span="24" style="display: flex;justify-content: center;justify-items: center;align-items: center;">
          <div>
            <el-form-item :label="$t('common.googleCode')" label-width="150px" prop="googleCode">
              <el-input v-model="confirmData.googleCode" style="width: 200px"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-right: 3%;height: 30px;">
      <el-button @click="cancelConfirmDialog('confirmDataForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitConfirm('confirmDataForm')">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createPaymentInfo,
  editPaymentInfo, exportMerchantReport, exportPayment,
  getAllCurrencyType,
  getPaymentInfo
} from "@/api/interface/backendInterface.js";
import {exportExcel, getAgentAccountTitle, getFormateTime, getPaymentListTitle, loadingBody} from "@/api/common.js";
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const PATH_CHANNEL_DRAFT_KEY = 'draft:PathChannelList:form';
export default {
  name: "PathChannelList",
  data() {
    const validateCollection = (rule, value, callback) => {
      if (this.createPathChannelInfo.supportType === '1' || this.createPathChannelInfo.supportType === '3') {
         // if support type is 1 or 3 then should verify some data about collection
        if (value == '' || value === undefined) {
          callback(new Error(this.$t('pathChannelList.validation.required')))
        }
        callback();
      } else {
         callback();
      }
    };

    const validatePay = (rule, value, callback) => {
      if (this.createPathChannelInfo.supportType === '2' || this.createPathChannelInfo.supportType === '3') {
        // if support type is 1 or 3 then should verify some data about collection
        if (value == '' || value === undefined) {
          callback(new Error(this.$t('pathChannelList.validation.required')))
        }
        callback()
      } else {
        callback();
      }
    };

    const validBank = (rule, value, callback) => {
      if (this.createPathChannelInfo.paymentType === '2') {
        if (value == '' || value === undefined) {
          callback(new Error(this.$t('pathChannelList.validation.required')))
        }
        callback();
      } else {
        callback();
      }
    }

    const validateCheckoutCounterUrl = (rule, value, callback) => {
      if (this.createPathChannelInfo.isCheckoutCounter == 1) {
        if (value == '' || value === undefined) {
          callback(new Error(this.$t('pathChannelList.validation.checkoutCounterUrl')))
          return;
        }
      }
      callback();
    }

    return {
      activeTool: '1',
      createPaymentInfoRules : {
        paymentNo: {
          required: true, messages: this.$t('pathChannelList.validation.paymentNo'), trigger: 'blur'
        },
        paymentName: {
          required: true, messages: this.$t('pathChannelList.validation.paymentName'), trigger: 'blur'
        },
        status: {
          required: true, type: 'number', messages: this.$t('pathChannelList.validation.status'), trigger: 'blur'
        },
        isThird: {
          required: true, messages: this.$t('pathChannelList.validation.isThird'), trigger: 'blur'
        },
        supportType: {
          required: true, type: 'number', messages: this.$t('pathChannelList.validation.supportType'), trigger: 'blur'
        },
        /*enableTimePeriod: {
          required: true, messages: 'you need to input enableTimePeriod', trigger: 'blur'
        },*/
        paymentType: {
          required: true, messages: this.$t('pathChannelList.validation.paymentType'), trigger: 'blur'
        },
        isCheckoutCounter: {
          required: true, type: 'number', messages: this.$t('pathChannelList.validation.checkoutCounter'), trigger: 'blur'
        },
        checkoutCounterUrl: {
          validator: validateCheckoutCounterUrl, trigger: 'blur'
        },
        paymentMinAmount: {
          required: true, type: 'number', messages: this.$t('pathChannelList.validation.paymentMinAmount'), trigger: 'blur'
        },
        paymentMaxAmount: {
          required: true, type: 'number', messages: this.$t('pathChannelList.validation.paymentMaxAmount'), trigger: 'blur'
        },
        collectionDailyLimit: {
          required: true,validator: validateCollection, messages: this.$t('pathChannelList.validation.collectionDailyLimit'), trigger: 'blur'
        },
        collectionMonthlyLimit: {
          required: true,validator: validateCollection, messages: this.$t('pathChannelList.validation.collectionMonthlyLimit'), trigger: 'blur'
        },
        payDailyLimit: {
          required: true,validator: validatePay, messages: this.$t('pathChannelList.validation.payDailyLimit'), trigger: 'blur'
        },
        payMonthlyLimit: {
          required: true,validator: validatePay, messages: this.$t('pathChannelList.validation.payMonthlyLimit'), trigger: 'blur'
        },
        paymentRequestCollectionUrl: {
          required: true,validator: validateCollection, messages: this.$t('pathChannelList.validation.paymentRequestCollectionUrl'), trigger: 'blur'
        },
        paymentRequestPayUrl: {
          required: true,validator: validatePay, messages: this.$t('pathChannelList.validation.paymentRequestPayUrl'), trigger: 'blur'
        },
        paymentCollectionRate: {
          required: true,validator: validateCollection, messages: this.$t('pathChannelList.validation.paymentCollectionRate'), trigger: 'blur'
        },
        paymentPayRate: {
          required: true,validator: validatePay, messages: this.$t('pathChannelList.validation.paymentPayRate'), trigger: 'blur'
        },
        paymentCheckPayUrl: {
          required: true,validator: validatePay, messages: this.$t('pathChannelList.validation.paymentCheckPayUrl'), trigger: 'blur'
        },
        paymentCheckCollectionUrl: {
          required: true,validator: validateCollection, messages: this.$t('pathChannelList.validation.paymentCheckCollectionUrl'), trigger: 'blur'
        },
        collectionCallbackAddr: {
          required: true,validator: validateCollection, messages: this.$t('pathChannelList.validation.collectionCallbackAddr'), trigger: 'blur'
        },
        payCallbackAddr: {
          required: true,validator: validatePay, messages: this.$t('pathChannelList.validation.payCallbackAddr'),trigger: 'blur'
        },
        collectionInterfaceParam: {
          required: true,validator: validateCollection, messages: this.$t('pathChannelList.validation.collectionInterfaceParam'),trigger: 'blur'
        },
        payInterfaceParam: {
          required: true,validator: validatePay, messages: this.$t('pathChannelList.validation.payInterfaceParam'),trigger: 'blur'
        },
        bankName: {
          required: true,validator: validBank, messages: this.$t('pathChannelList.validation.bankName'),trigger: 'blur'
        },
        bankAccount: {
          required: true,validator: validBank, messages: this.$t('pathChannelList.validation.bankAccount'),trigger: 'blur'
        },
        bankUserName: {
          required: true,validator: validBank, messages: this.$t('pathChannelList.validation.bankUserName'),trigger: 'blur'
        },
        currency: {
          required: true, messages: this.$t('pathChannelList.validation.currency'),trigger: 'blur'
        },
      },
      submitType: "",
      currencyMaps: {},
      paymentDetailInfo:{},
      paymentDetailDialogTitle: '',
      paymentDetailVisible: false,
      showURL: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100, 200],
      tableKey: 0,
      toolbarIsVisible: true,
      pathChannelDialogTitle: "",
      dialogFormVisible: false,
      confirmDialogVisible: false,
      confirmDialogTitle: '',
      confirmData: {
        googleCode: ''
      },
      confirmRule: {
        googleCode: {
          required: true,
          message: this.$t('common.googleCodeRequired'),
          trigger: 'blur',
        }
      },
      pendingSubmitType: '',
      paymentStatusOptions: [],
      pathChannelCurrencyTypeOptions: [],
      supportTypeOptions: [],
      paymentTypeOptions: [],
      paymentNameOptions: [],
      paymentNameLoading: false,
      paymentNameHasMore: true,
      paymentNamePageNo: 1,
      paymentNamePageSize: 20,
      paymentNameQuery: '',
      paymentNameScrollBound: false,
      currency: '',
      currencyIcon: '',
      currencyIcons: [],
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      filterbox: {
        //status: 1,

      },
      PathChannelTableInfo: [

      ],
      PathChannelFormInfo: [

        ],

      createPathChannelInfo: {},
    }
  },
  watch: {
    dialogFormVisible(visible) {
      if (visible) {
        this.loadPathChannelDraft();
      }
    },
    createPathChannelInfo: {
      deep: true,
      handler() {
        this.savePathChannelDraft();
      }
    },
    submitType() {
      this.savePathChannelDraft();
    }
  },
  methods: {
    savePathChannelDraft() {
      if (!this.dialogFormVisible) return;
      const mode = this.submitType || '';
      const recordId = this.createPathChannelInfo?.paymentNo || this.createPathChannelInfo?.paymentId || '';
      saveDraft(PATH_CHANNEL_DRAFT_KEY, {
        mode,
        recordId,
        data: this.createPathChannelInfo || {}
      });
    },
    loadPathChannelDraft() {
      const draft = loadDraft(PATH_CHANNEL_DRAFT_KEY);
      if (!draft || !draft.data) return;
      const mode = this.submitType || '';
      if (draft.mode && mode && draft.mode !== mode) return;
      if (mode === 'edit') {
        const recordId = this.createPathChannelInfo?.paymentNo || this.createPathChannelInfo?.paymentId || '';
        if (draft.recordId && recordId && draft.recordId !== recordId) return;
      }
      this.createPathChannelInfo = Object.assign({}, draft.data || {});
    },
    clearPathChannelDraft() {
      clearDraft(PATH_CHANNEL_DRAFT_KEY);
    },
    handlePaymentNameDropdownVisible(visible) {
      if (!visible) return;
      if (!this.paymentNameOptions.length) {
        this.resetPaymentNameOptions();
        this.fetchPaymentNameOptions(false);
      }
      this.attachPaymentNameScroll();
    },
    handlePaymentNameSearch(query) {
      this.paymentNameQuery = query || '';
      this.resetPaymentNameOptions();
      this.fetchPaymentNameOptions(false);
    },
    resetPaymentNameOptions() {
      this.paymentNamePageNo = 1;
      this.paymentNameHasMore = true;
      this.paymentNameOptions = [];
    },
    fetchPaymentNameOptions(append) {
      if (this.paymentNameLoading || !this.paymentNameHasMore) return;
      this.paymentNameLoading = true;
      const payload = {
        pageNo: this.paymentNamePageNo,
        pageSize: this.paymentNamePageSize
      };
      if (this.paymentNameQuery) {
        payload.paymentName = this.paymentNameQuery;
      }
      getPaymentInfo(payload).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const allData = JSON.parse(res.data.data);
          const list = allData.paymentDtoList || [];
          const mapped = list.map(item => ({
            value: item.paymentName,
            label: item.paymentName
          }));
          this.paymentNameOptions = append
            ? this.paymentNameOptions.concat(mapped)
            : mapped;
          if (list.length < this.paymentNamePageSize) {
            this.paymentNameHasMore = false;
          } else {
            this.paymentNamePageNo += 1;
          }
        } else {
          this.paymentNameHasMore = false;
        }
      }).finally(() => {
        this.paymentNameLoading = false;
      });
    },
    attachPaymentNameScroll() {
      this.$nextTick(() => {
        const wrap = document.querySelector(".pathchannel-name-select-dropdown .el-select-dropdown__wrap");
        if (!wrap || this.paymentNameScrollBound) return;
        wrap.addEventListener("scroll", this.handlePaymentNameScroll);
        this.paymentNameScrollBound = true;
      });
    },
    handlePaymentNameScroll(event) {
      const el = event.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        this.fetchPaymentNameOptions(true);
      }
    },
    refreshOptions() {
      this.paymentStatusOptions = [
        { value: 0, label: this.$t('common.disable') },
        { value: 1, label: this.$t('common.enable') }
      ]
      this.pathChannelCurrencyTypeOptions = [
        { value: 1, label: this.$t('pathChannelList.label.currencyOption1') },
        { value: 2, label: this.$t('pathChannelList.label.currencyOption2') }
      ]
      this.supportTypeOptions = [
        { value: 0, label: this.$t('pathChannelList.label.collection') },
        { value: 1, label: this.$t('pathChannelList.label.payout') },
        { value: 2, label: this.$t('pathChannelList.label.collectionPayout') }
      ]
      this.paymentTypeOptions = [
        { value: '1', label: this.$t('pathChannelList.label.appPay') },
        { value: '2', label: this.$t('pathChannelList.label.bankCardPay') }
      ]
      if (!this.paymentDetailDialogTitle) {
        this.paymentDetailDialogTitle = this.$t('pathChannelList.dialog.detail')
      }
    },
    supportTypeLabel(value) {
      if (value === 0 || value === '0') return this.$t('pathChannelList.label.collection')
      if (value === 1 || value === '1') return this.$t('pathChannelList.label.payout')
      if (value === 2 || value === '2') return this.$t('pathChannelList.label.collectionPayout')
      return '-'
    },
    paymentTypeLabel(value) {
      if (value === '1' || value === 1) return this.$t('pathChannelList.label.appPay')
      if (value === '2' || value === 2) return this.$t('pathChannelList.label.bankCardPay')
      return this.$t('common.invalid')
    },
    isThirdLabel(value) {
      return value === '0' || value === 0 ? this.$t('pathChannelList.label.systemPay') : this.$t('pathChannelList.label.thirdPay')
    },
    exportPathChannelInfos() {
     /* exportPayment(this.filterbox).then(async res => {
        const fileName = this.$t('exportPaymentListName') + getFormateTime()
        await exportExcel(res, fileName, this)
      })*/
      this.filterbox.columns = getPaymentListTitle(this)
      exportPayment(this.filterbox).then(async res => {
        const fileName = this.$t('exportPaymentListName') + getFormateTime()
        await exportExcel(res, fileName, this)
        /*if (res.status === 200) {
          if (res.data.type === 'application/json') {
            const blobData = res.data;
            const jsonData = JSON.parse(await blobData.text())
            if (jsonData.code !== 0) {
              this.$notify({
                title: 'Failed',
                message: jsonData.message,
                duration: 3000,
                type: 'error',
                position: 'bottom-right',
              })
            }
          } else {
            const blob = new Blob([res.data], {type: "application/vnd.ms-excel;charset=UTF-8"});
            console.log('blob---'+ blob.size)
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, fileName)
            } else {
              const downLoadElement = document.createElement('a');
              const href = window.URL.createObjectURL(blob);
              downLoadElement.href = href;
              downLoadElement.download = fileName;
              document.body.appendChild(downLoadElement);
              downLoadElement.click();
              document.body.removeChild(downLoadElement);
              window.URL.revokeObjectURL(href);
            }
            this.$notify({
              title: 'Success',
              message: 'export data success',
              duration: 3000,
              type: 'success',
              position: 'bottom-right',
            })
          }
        } else {
          if (res.data.type === 'application/json') {
            const blobData = res.data;
            const jsonData = JSON.parse(await blobData.text())
            this.$notify({
              title: 'Error',
              message: jsonData.message,
              duration: 3000,
              type: 'error',
              position: 'bottom-right',
            })
          }

        }
        this.filterbox.orderType = '0'*/
      }).catch(err => {
        console.log(err)
      })
    },
    timeChange(val) {
      this.createPathChannelInfo.enableTimePeriod = val.toLocaleString()
    },
    reset(form) {
      this.$refs[form].resetFields();
    },
    search() {
      const loadingInstance = loadingBody(this, 'paymentList')
      if (this.filterbox.paymentName) {
        this.filterbox.paymentName = new String(this.filterbox.paymentName).trim()
      }
      if(this.filterbox.paymentName === "") {
        delete this.filterbox.paymentName
      }
      getPaymentInfo(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const allData = JSON.parse(res.data.data);
          this.PathChannelTableInfo = allData.paymentDtoList
          this.currentPage = allData.pageNo
          this.totalCount = allData.totalNumber
          this.pageSize = allData.pageSize
          this.tableKey++
        } else {
          this.$notify({
            title: this.$t('common.error'),
            message:res.data.message,
            duration:3000,
            type: 'error'
          })
        }
        loadingInstance.close()
      }).catch(err => {
        console.log(err)
        loadingInstance.close()
      })

    },
    editPathChannelInfo(row) {
      console.log('editInfo----'+JSON.stringify(row))
      this.createPathChannelInfo = row
      if (row && row.enableTimePeriod) {
        this.createPathChannelInfo.enableTimePeriod1 = row.enableTimePeriod.split(',')
      } else {
        this.createPathChannelInfo.enableTimePeriod1 = ''
      }
      this.dialogFormVisible = true
      this.pathChannelDialogTitle = this.$t('pathChannelList.dialog.edit')
      this.submitType='edit'
    },
    PathChannelDetailInfo(row) {
      console.log(JSON.stringify(row));
      this.paymentDetailVisible = true;
      this.paymentDetailDialogTitle = this.$t('pathChannelList.dialog.detail');
      //this.paymentDetailInfo.push(row)
      this.paymentDetailInfo = {}
      this.paymentDetailInfo = row;
    },
    changeToolBar() {
      this.toolbarIsVisible = !this.toolbarIsVisible;
    },
    handleCurrentPageChange(currentPage) {
      this.filterbox.pageNo = currentPage;
      this.filterbox.pageSize = this.pageSize;
      this.PathChannelTableInfo = []
      this.search()

    },
    handleSizeChange(pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.handleCurrentPageChange(1)
    },
    cancelDialog() {
      this.dialogFormVisible = false
      if (this.createPathChannelInfo && this.createPathChannelInfo.googleCode) {
        this.createPathChannelInfo.googleCode = ''
      }
      if (this.createPathChannelInfo) {
        this.createPathChannelInfo.enableTimePeriod1 = ''
        this.createPathChannelInfo.enableTimePeriod = ''
      }
      this.createPathChannelInfo = {}
      this.pathChannelDialogTitle = ''
      this.$refs['createPaymentForm'].resetFields()
      this.clearPathChannelDraft()
    },
    createPathChannel() {
      this.dialogFormVisible = true
      this.pathChannelDialogTitle = this.$t('pathChannelList.dialog.create')
      // set default status
      this.createPathChannelInfo.status = 1
      // set default supportType
      this.createPathChannelInfo.isThird = '0'
      // set default checkout counter
      this.createPathChannelInfo.isCheckoutCounter = 0
      this.createPathChannelInfo.enableTimePeriod1 = ''
      this.createPathChannelInfo.enableTimePeriod = ''
      this.submitType = "create"
    },
    handlePayingTypeChange(val) {
      if (val === '2') {
        this.showURL = true;
      }
    },
    handlePaymentResponse(res, successMessage) {
      if (res.status === 200 && res.data.code === 0) {
        this.$notify({
          title: this.$t('common.success'),
          message: successMessage,
          duration:3000,
          type: 'success',
          position: 'bottom-right'
        })
        this.dialogFormVisible = false
        this.pathChannelDialogTitle = ''
        this.$refs['createPaymentForm'].resetFields()
        if (this.createPathChannelInfo) {
          this.createPathChannelInfo.enableTimePeriod1 = ''
          this.createPathChannelInfo.enableTimePeriod = ''
        }
        this.clearPathChannelDraft()
      } else if (res.status === 200 && res.data.code !== 0) {
        this.$notify({
          title: this.$t('common.error'),
          message:res.data.message,
          duration:3000,
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$notify({
          title: this.$t('common.error'),
          message: this.$t('common.requestFailed'),
          duration:3000,
          type: 'error',
          position: 'bottom-right'
        })
      }
      this.search()
      if (this.createPathChannelInfo && this.createPathChannelInfo.googleCode) {
        this.createPathChannelInfo.googleCode = ''
      }
    },
    submitCreatePaymentInfo(type) {
      console.log('submitCreatePaymentInfo'+ JSON.stringify(this.createPathChannelInfo))
      if (type === 'create') {
        this.$refs['createPaymentForm'].validate(valid => {
          if (valid) {
            this.pendingSubmitType = 'create'
            this.confirmDialogTitle = this.$t('common.prompt')
            this.confirmDialogVisible = true
          }
        })
      } else {
        this.$refs['createPaymentForm'].validate(valid => {
          if (valid) {
            this.pendingSubmitType = 'edit'
            this.confirmDialogTitle = this.$t('common.prompt')
            this.confirmDialogVisible = true
          }
        })
      }
    },
    submitConfirm(form) {
      this.$refs[form].validate(valid => {
        if (!valid) return
        this.createPathChannelInfo.googleCode = this.confirmData.googleCode
        this.confirmDialogVisible = false
        this.confirmDialogTitle = ''
        if (this.pendingSubmitType === 'create') {
          createPaymentInfo(this.createPathChannelInfo).then(res => {
            this.handlePaymentResponse(res, this.$t('pathChannelList.message.createSuccess'))
            this.confirmData.googleCode = ''
            this.pendingSubmitType = ''
          })
        } else if (this.pendingSubmitType === 'edit') {
          editPaymentInfo(this.createPathChannelInfo).then(res => {
            this.handlePaymentResponse(res, this.$t('pathChannelList.message.editSuccess'))
            this.confirmData.googleCode = ''
            this.pendingSubmitType = ''
          })
        }
      })
    },
    cancelConfirmDialog(form) {
      this.confirmDialogVisible = false
      this.confirmDialogTitle = ''
      this.confirmData.googleCode = ''
      this.pendingSubmitType = ''
      if (this.createPathChannelInfo && this.createPathChannelInfo.googleCode) {
        this.createPathChannelInfo.googleCode = ''
      }
      if (this.$refs[form]) {
        this.$refs[form].resetFields()
      }
    }
  },
  async mounted() {
    this.refreshOptions();
    await getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
        if (this.currencyOptions.length > 0) {
          this.currency = this.currencyOptions[0].currencyType
          //this.filterbox.currency = this.currencyOptions[0].currencyType
          this.currencyIcons = {};
          this.currencyMaps = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon
            this.currencyMaps[currency.currencyType] = currency.name
          })
          let iconKey = this.currency;
          this.currencyIcon = this.currencyIcons[iconKey]
        }
        return;
      }
      if (res.status !== 200 || res.data.code !== 0) {
        this.$notify({
          title: this.$t('common.failed'),
          message: this.$t('currencyTypeList.message.getFailed'),
          duration: 3000,
          type: 'error',
          position: 'bottom-right'
        })
      }
    })
    this.search()
  }
  ,
  watch: {
    '$i18n.locale'() {
      this.refreshOptions();
    }
  }
}
</script>
<style scoped>
@import "@/assets/base.css";
@import "@/api/common.css";
</style>
<style>
.dialog-footer {
  display: flex;
  justify-content: right;
  float: right;
}

.main-toolbar .el-input__inner,
.main-toolbar .el-input__wrapper,
.main-toolbar .el-select__input,
.main-toolbar .el-select__placeholder,
.main-toolbar .main-toolform-input {
  text-align: center;
}

.main-toolbar .el-input__inner::placeholder,
.main-toolbar .el-select__input::placeholder {
  text-align: center;
}

:deep().el-table th.is-leaf {

  background-color: lightskyblue;
  color: white;
  font-weight: bold;
  font-size: larger;
}
</style>
