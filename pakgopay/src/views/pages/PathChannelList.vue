<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateTime, getFormateTimeByTimeBystamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">通道列表</div>

  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="main-toolbar" style="height: auto;">
        <el-form style="width: 100%" ref="filterboxForm" :model="filterbox">
          <el-row style="width: 100%;">
            <el-col :span="24">
              <div style="display: flex;flex-direction: row;justify-content: right;">
                <el-button @click="search()" class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="search"/>
                  <div>查询</div>
                </el-button>
                <el-button @click="reset('filterboxForm')" class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="reset"/>
                  <div>重置</div>
                </el-button>
                <el-button @click="exportPathChannelInfos" class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="export"/>
                  <div>导出</div>
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row style="width: 100%;margin-top:10px">
            <div style="display: flex;flex-direction: row;width: 100%">
              <el-col :span="5">
                <el-form-item label="通道名称:" label-width="150px" prop="paymentName">
                  <el-input v-model="filterbox.paymentName" type="text"
                         placeholder="通道名称" style="width: 200px;height: 100%"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="支付类型:" label-width="150px" prop="supportType">
                  <el-select v-model="filterbox.supportType"  placeholder="支付方式"
                             :options="supportTypeOptions"
                             style="width: 200px;height: 100%"
                             clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通道类型:" label-width="150px" prop="paymentType">
                  <el-select v-model="filterbox.paymentType" placeholder="通道类型"
                             :options="paymentTypeOptions" style="width: 200px;height: 100%"
                             clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="通道状态:" label-width="150px" prop="status">
                  <el-select v-model="filterbox.status"
                     :options="paymentStatusOptions"
                      placeholder="select paymentStatus"
                      clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="币种:" label-width="100px" prop="currency">
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
          <div>新增</div>
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
            label="通道编号"
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
            label="通道名称"
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
            label="通道状态"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                :active-value="1"
                :inactive-value="0"
                disabled
            ></el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="isThird"
            label="是否三方"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            {{ row.isThird === '0' ? '系统支付' : '三方支付' }}
          </div>
        </el-table-column>
        <el-table-column
            prop="supportType"
            label="支付类型"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div>
            {{ (row.supportType === 0) ? '代收' : (row.supportType === 1) ? '代付' : (row.supportType === 2) ? '代收/代付' : '-' }}
          </div>
        </el-table-column>
        <el-table-column
            prop="enableTimePeriod"
            label="通道可用时间段"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
<!--            {{row.enableTimePeriod}}-->
<!--            {{
              !row.enableTimePeriod ? 'all' : getFormateTimeByTimeBystamp(row.enableTimePeriod ? row.enableTimePeriod.toLocaleString().split(',')[0] : '') + '-' + getFormateTimeByTimeBystamp(row.enableTimePeriod ? row.enableTimePeriod.toLocaleString().split(',')[1] : '')
            }}-->
            {{!row.enableTimePeriod ? '*' : row.enableTimePeriod}}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentType"
            label="通道类型"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          {{ row.paymentType === '1' ? 'app支付' : row.paymentType === '2' ? '银行卡支付' : 'invalid' }}
        </el-table-column>
        <el-table-column
            prop="isCheckoutCounter"
            label="是否支持收银台"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <el-switch
              :model-value="row.isCheckoutCounter"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="支持"
              inactive-text="不支持"
              :active-value="1"
              :inactive-value="0"
          />
        </el-table-column>
        <el-table-column
            prop="collectionDailyLimit"
            label="通道代收日限额"
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
            label="通道代收月限额"
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
            label="通道代付日限额"
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
            label="通道代付月限额"
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
            label="代付api地址"
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
            label="代收api地址"
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
            label="代收费率"
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
            label="代付费率"
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
            label="代付订单校验地址"
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
            label="代收订单校验地址"
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
            label="代收回调地址"
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
            label="代付回调地址"
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
            label="收银台地址"
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
            label="币种"
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
          {{this.currencyMaps[row.currency]}}
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
            label="操作"
            align="center"
            fixed="right"
            v-slot="{row}"
        >
          <el-dropdown trigger="click">
            <SvgIcon name="more" width="30" height="30"/>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editPathChannelInfo(row)">编辑</el-dropdown-item>
                <el-dropdown-item @click="PathChannelDetailInfo(row)">详情</el-dropdown-item>
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
              label="通道编号:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentNo}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道名称:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentName}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道状态:"
              label-width="150px"
          >
            <el-switch
                :model-value="paymentDetailInfo.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                :active-value = "1"
                :inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="是否三方:"
              label-width="150px"
          >
            {{paymentDetailInfo.isThird === '0' ? '系统支付' : '三方支付'}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="支付类型:"
              label-width="150px"
          >
            {{ (paymentDetailInfo.supportType === 0) ? '代收' : (paymentDetailInfo.supportType === 1) ? '代付' : '代收/代付' }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道可用时间段:"
              label-width="150px"
          >
            {{
              !paymentDetailInfo.enableTimePeriod ? 'all' : getFormateTimeByTimeBystamp(paymentDetailInfo.enableTimePeriod ? paymentDetailInfo.enableTimePeriod.split(',')[0] : '') + '-' + getFormateTimeByTimeBystamp(paymentDetailInfo.enableTimePeriod ? paymentDetailInfo.enableTimePeriod.split(',')[1] : '')
            }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道类型:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentType === '1' ? 'app支付':'银行卡支付'}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="是否支持收银台:"
              prop="isCheckoutCounter"
              label-width="150px"
          >
            <el-switch
                :model-value="paymentDetailInfo.isCheckoutCounter"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                :active-value = "1"
                :inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="通道单笔限额:"
              label-width="150px"
          >
            [{{paymentDetailInfo.paymentMinAmount}},{{paymentDetailInfo.paymentMaxAmount}}]
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道代收日限额:"
              label-width="150px"
          >
            {{paymentDetailInfo.collectionDailyLimit}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道代收月限额:"
              label-width="150px"
          >
            {{paymentDetailInfo.collectionMonthlyLimit}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道代付日限额:"
              label-width="150px"
          >
            {{paymentDetailInfo.payDailyLimit}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="通道代付月限额:"
              label-width="150px"
          >
            {{paymentDetailInfo.payMonthlyLimit}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代付API地址:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentRequestCollectionUrl}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收API地址:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentRequestCollectionUrl}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收费率:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentCollectionRate}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="代付费率:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentPayRate}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代付订单校验地址:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentCheckPayUrl}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收订单校验地址:"
              label-width="150px"
          >
            {{paymentDetailInfo.paymentCheckCollectionUrl}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收回调地址:"
              label-width="150px"
          >
            {{paymentDetailInfo.collectionCallbackAddr}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="代付回调地址:"
              label-width="150px"
          >
            {{paymentDetailInfo.payCallbackAddr}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收接口参数:"
              label-width="150px"
          >
            {{paymentDetailInfo.collectionInterfaceParam}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代付接口参数:"
              label-width="150px"
          >
            {{paymentDetailInfo.payInterfaceParam}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="银行名称:"
              label-width="150px"
          >
            {{paymentDetailInfo.bankName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="银行账号:"
              label-width="150px"
          >
            {{paymentDetailInfo.bankAccount}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="银行用户名:"
              label-width="150px"
          >
            {{paymentDetailInfo.bankUserName}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="币种:"
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
              label="通道编号:"
              label-width="150px"
              prop="paymentNo"
          >
            <el-input v-model="createPathChannelInfo.paymentNo" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道名称:"
              label-width="150px"
              prop="paymentName"
          >
            <el-input v-model="createPathChannelInfo.paymentName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道状态:"
              label-width="150px"
              prop="status"
          >
            <el-radio-group
                v-model="createPathChannelInfo.status"

            >
              <el-radio :label="0">停用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="是否三方:"
              label-width="150px"
              prop="isThird"
          >
            <el-radio-group v-model="createPathChannelInfo.isThird">
              <el-radio value="0">系统支付</el-radio>
              <el-radio value="1">三方支付</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="支付类型:"
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
              label="通道可用时间段:"
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
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道类型:"
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
              label="是否支持收银台:"
              prop="isCheckoutCounter"
              label-width="150px"
          >
            <el-radio-group
                v-model="createPathChannelInfo.isCheckoutCounter"
            >
              <el-radio :value="0">否</el-radio>
              <el-radio :value="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="通道单笔最低限额:"
              label-width="150px"
              prop="paymentMinAmount"
          >
            <el-input type="number" v-model.number="createPathChannelInfo.paymentMinAmount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道单笔最高限额:"
              label-width="150px"
              prop="paymentMaxAmount"
          >
            <el-input type="number" v-model.number="createPathChannelInfo.paymentMaxAmount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="币种:"
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
              label="通道代收日限额:"
              label-width="150px"
              prop="collectionDailyLimit"
          >
            <el-input v-model.number="createPathChannelInfo.collectionDailyLimit" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道代收月限额:"
              label-width="150px"
              prop="collectionMonthlyLimit"
          >
            <el-input v-model.number="createPathChannelInfo.collectionMonthlyLimit" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收API地址:"
              label-width="150px"
              prop="paymentRequestCollectionUrl"
          >
            <el-input v-model="createPathChannelInfo.paymentRequestCollectionUrl" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收费率:"
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
              label="代收订单校验地址:"
              label-width="150px"
              prop="paymentCheckCollectionUrl"
          >
            <el-input v-model="createPathChannelInfo.paymentCheckCollectionUrl" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收回调地址:"
              label-width="150px"
              prop="collectionCallbackAddr"
          >
            <el-input v-model="createPathChannelInfo.collectionCallbackAddr" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代收接口参数:"
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
              label="通道代付日限额:"
              label-width="150px"
              prop="payDailyLimit"
          >
            <el-input v-model.number="createPathChannelInfo.payDailyLimit" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="通道代付月限额:"
              label-width="150px"
              prop="payMonthlyLimit"
          >
            <el-input v-model.number.number="createPathChannelInfo.payMonthlyLimit" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代付API地址:"
              label-width="150px"
              prop="paymentRequestCollectionUrl"
          >
            <el-input v-model="createPathChannelInfo.paymentRequestCollectionUrl" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代付费率:"
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
              label="代付订单校验地址:"
              label-width="150px"
              prop="paymentCheckPayUrl"
          >
            <el-input v-model="createPathChannelInfo.paymentCheckPayUrl" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代付回调地址:"
              label-width="150px"
              prop="payCallbackAddr"
          >
            <el-input v-model="createPathChannelInfo.payCallbackAddr" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="代付接口参数:"
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
              label="银行名称:"
              label-width="150px"
              prop="bankName"
          >
            <el-input v-model="createPathChannelInfo.bankName" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="银行账号:"
              label-width="150px"
              prop="bankAccount"
          >
            <el-input v-model="createPathChannelInfo.bankAccount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
              label="银行用户名:"
              label-width="150px"
              prop="bankUserName"
          >
            <el-input v-model="createPathChannelInfo.bankUserName" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="6">
          <el-form-item
              label="谷歌验证码:"
              label-width="150px"
              prop="googleCode"
          >
            <el-input v-model="createPathChannelInfo.googleCode" type="number" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="float: right;">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="submitCreatePaymentInfo(submitType)">确 定</el-button>
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
export default {
  name: "PathChannelList",
  data() {
    const validateCollection = (rule, value, callback) => {
      if (this.createPathChannelInfo.supportType === '1' || this.createPathChannelInfo.supportType === '3') {
         // if support type is 1 or 3 then should verify some data about collection
        if (value == '' || value === undefined) {
          callback(new Error('please check must form data!'))
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
          callback(new Error('please check must form data!'))
        }
        callback()
      } else {
        callback();
      }
    };

    const validBank = (rule, value, callback) => {
      if (this.createPathChannelInfo.paymentType === '2') {
        if (value == '' || value === undefined) {
          callback(new Error('please check must form data!'))
        }
        callback();
      } else {
        callback();
      }
    }

    return {
      activeTool: '1',
      createPaymentInfoRules : {
        paymentNo: {
          required: true, messages: 'you need to input paymentNo', trigger: 'blur'
        },
        paymentName: {
          required: true, messages: 'you need to input paymentName', trigger: 'blur'
        },
        status: {
          required: true, type: 'number', messages: 'you need to input status', trigger: 'blur'
        },
        isThird: {
          required: true, messages: 'you need to input whther is third', trigger: 'blur'
        },
        supportType: {
          required: true, type: 'number', messages: 'you need to input support type', trigger: 'blur'
        },
        /*enableTimePeriod: {
          required: true, messages: 'you need to input enableTimePeriod', trigger: 'blur'
        },*/
        paymentType: {
          required: true, messages: 'you need to input paymentType', trigger: 'blur'
        },
        isCheckoutCounter: {
          required: true, type: 'number', messages: 'you need to input where need checkout counter', trigger: 'blur'
        },
        paymentMinAmount: {
          required: true, type: 'number', messages: 'you need to input payment min acount', trigger: 'blur'
        },
        paymentMaxAmount: {
          required: true, type: 'number', messages: 'you need to input payment max acount', trigger: 'blur'
        },
        collectionDailyLimit: {
          required: true,validator: validateCollection, messages: 'you need to input collection daily limit', trigger: 'blur'
        },
        collectionMonthlyLimit: {
          required: true,validator: validateCollection, messages: 'you need to input collection monthly limit', trigger: 'blur'
        },
        payDailyLimit: {
          required: true,validator: validatePay, messages: 'you need to input collection daily limit', trigger: 'blur'
        },
        payMonthlyLimit: {
          required: true,validator: validatePay, messages: 'you need to input collection monthly limit', trigger: 'blur'
        },
        paymentRequestCollectionUrl: {
          required: true,validator: validateCollection, messages: 'you need to input collection requestCollectionUrl', trigger: 'blur'
        },
        paymentRequestPayUrl: {
          required: true,validator: validatePay, messages: 'you need to input collection rrequestPayUrl', trigger: 'blur'
        },
        paymentCollectionRate: {
          required: true,validator: validateCollection, messages: 'you need to input collection rate', trigger: 'blur'
        },
        paymentPayRate: {
          required: true,validator: validatePay, messages: 'you need to input pay rate', trigger: 'blur'
        },
        paymentCheckPayUrl: {
          required: true,validator: validatePay, messages: 'you need to input checkPayUrl', trigger: 'blur'
        },
        paymentCheckCollectionUrl: {
          required: true,validator: validateCollection, messages: 'you need to input checkCollectionUrl', trigger: 'blur'
        },
        collectionCallbackAddr: {
          required: true,validator: validateCollection, messages: 'you need to input collectionCallbackAddr', trigger: 'blur'
        },
        payCallbackAddr: {
          required: true,validator: validatePay, messages: 'you need to input collectionCallbackAddr',trigger: 'blur'
        },
        collectionInterfaceParam: {
          required: true,validator: validateCollection, messages: 'you need to input collectionInterfaceParam',trigger: 'blur'
        },
        payInterfaceParam: {
          required: true,validator: validatePay, messages: 'you need to input collectionInterfaceParam',trigger: 'blur'
        },
        bankName: {
          required: true,validator: validBank, messages: 'you need to input bankName',trigger: 'blur'
        },
        bankAccount: {
          required: true,validator: validBank, messages: 'you need to input bankAccount',trigger: 'blur'
        },
        bankUserName: {
          required: true,validator: validBank, messages: 'you need to input bankUserName',trigger: 'blur'
        },
        currency: {
          required: true, messages: 'you need to input currency',trigger: 'blur'
        },
        googleCode: {
          required: true, messages: 'you need to input googleCode',trigger: 'blur'
        }
      },
      submitType: "",
      currencyMaps: {},
      paymentDetailInfo:{},
      paymentDetailDialogTitle: '详情',
      paymentDetailVisible: false,
      showURL: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [1, 10, 20, 30, 40],
      tableKey: 0,
      toolbarIsVisible: true,
      pathChannelDialogTitle: "",
      dialogFormVisible: false,
      paymentStatusOptions: [
        {
          value: 0,
          label: '停用'
        },
        {
          value: 1,
          label: '启用'
        }
      ],
      pathChannelCurrencyTypeOptions: [
        {
          value: 1,
          label: '脚盆鸡币'
        },
        {
          value: 2,
          label: '大不列颠币'
        }
      ],
      supportTypeOptions: [
        {
          value: 0,
          label: '代收'
        },
        {
          value: 1,
          label: '代付'
        },
        {
          value: 2,
          label: '代收/代付'
        }
      ],
      paymentTypeOptions: [
        {
          value: '1',
          label: 'app支付'
        },
        {
          value: '2',
          label: '银行卡支付'
        }
      ],
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
  methods: {
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
            title:'Error',
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
      this.dialogFormVisible = true
      this.pathChannelDialogTitle = '修改'
      this.submitType='edit'
    },
    PathChannelDetailInfo(row) {
      console.log(JSON.stringify(row));
      this.paymentDetailVisible = true;
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
      this.createPathChannelInfo = []
      this.pathChannelDialogTitle = ''
      this.$refs['createPaymentForm'].resetFields()
    },
    createPathChannel() {
      this.dialogFormVisible = true
      this.pathChannelDialogTitle = '创建通道'
      // set default status
      this.createPathChannelInfo.status = 1
      // set default supportType
      this.createPathChannelInfo.isThird = '0'
      // set default checkout counter
      this.createPathChannelInfo.isCheckoutCounter = 0
      this.submitType = "create"
    },
    handlePayingTypeChange(val) {
      if (val === '2') {
        this.showURL = true;
      }
    },
    submitCreatePaymentInfo(type) {
      console.log('submitCreatePaymentInfo'+ JSON.stringify(this.createPathChannelInfo))
      if (type === 'create') {
        this.$refs['createPaymentForm'].validate(valid => {
          if (valid) {
            // reuqest interface to create
            createPaymentInfo(this.createPathChannelInfo).then(res => {
              if (res.status === 200 && res.data.code === 0) {
                this.$notify({
                  title:'Success',
                  message:'create payment info successfully',
                  duration:3000,
                  type: 'success',
                  position: 'bottom-right'
                })
              } else if (res.status === 200 && res.data.code !== 0) {
                this.$notify({
                  title:'Error',
                  message:res.data.message,
                  duration:3000,
                  type: 'error',
                  position: 'bottom-right'
                })
              } else {
                this.$notify({
                  title:'Error',
                  message:'some error occurred.',
                  duration:3000,
                  type: 'error',
                  position: 'bottom-right'
                })
              }
              this.dialogFormVisible = false
              this.pathChannelDialogTitle = ''
              this.$refs['createPaymentForm'].resetFields()
              this.search()
            })
          }
        })
      } else {
        this.$refs['createPaymentForm'].validate(valid => {
          if (valid) {
            // request interface to edit
            editPaymentInfo(this.createPathChannelInfo).then(res => {
                if (res.status === 200 && res.data.code === 0) {
                   this.$notify({
                     title:'Success',
                     message:'create payment info successfully',
                     duration:3000,
                     type: 'success',
                     position: 'bottom-right'
                   })
                } else if (res.status === 200 && res.data.code !== 0) {
                  this.$notify({
                    title:'Error',
                    message:res.data.message,
                    duration:3000,
                    type: 'error',
                    position: 'bottom-right'
                  })
                } else {
                  this.$notify({
                    title:'Error',
                    message:'some error occurred.',
                    duration:3000,
                    type: 'error',
                    position: 'bottom-right'
                  })
                }
                this.dialogFormVisible = false
                this.pathChannelDialogTitle = ''
                this.$refs['createPaymentForm'].resetFields()
                this.search()
            })
          }
        })
      }
    }
  },
  async mounted() {
    await getAllCurrencyType().then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data)
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
      }
    })
    this.search()
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
