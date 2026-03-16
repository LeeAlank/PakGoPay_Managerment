<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
import {ArrowDownBold} from "@element-plus/icons-vue";
import '@/assets/base.css'
</script>

<template>
  <div class="main-title">{{$t('route.merchantInfo')}}</div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <!-- 工具栏 -->
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <div class="main-toolform-item">
            <div class="main-toolform-line" style="justify-content: right;">
              <el-button @click="reset('filterboxForm')">
                <SvgIcon class="filterButtonSvg" name="reset"/>
                <div>{{ $t('common.reset') }}</div>
              </el-button>
              <el-button @click="search()">
                <SvgIcon class="filterButtonSvg" name="search"/>
                <div>{{ $t('common.query') }}</div>
              </el-button>
            </div>
          </div>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('merchantInfo.filter.account')" label-width="150px" prop="merchantUserName">
                <el-select
                  v-model="filterbox.merchantUserName"
                  filterable
                  remote
                  clearable
                  :remote-method="handleMerchantAccountSearch"
                  :loading="merchantAccountLoading"
                  :placeholder="$t('merchantInfo.placeholder.account')"
                  popper-class="merchant-account-select-dropdown"
                  @visible-change="handleMerchantAccountDropdownVisible"
                  style="width: 200px"
                  :disabled="filterAvaiable"
                >
                  <el-option
                    v-for="item in merchantAccountOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item :label="$t('merchantInfo.filter.name')" label-width="150px" prop="merchantName">
                  <el-input :disabled="filterAvaiable"   v-model="filterbox.merchantName"  type="text" :placeholder="$t('merchantInfo.placeholder.name')" style="width: 200px"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('merchantInfo.filter.status')" label-width="150px" prop="status">
<!--                <el-switch
                    v-model="filterbox.status"
                    active-text="启用"
                    inactive-text="停用"
                    :active-value="1"
                    :inactive-value="0"
                ></el-switch>-->
                <el-select v-model="filterbox.status" clearable style="width: 200px">
                  <el-option :label="$t('common.enable')" :value="1">{{ $t('common.enable') }}</el-option>
                  <el-option :label="$t('common.disable')" :value="0">{{ $t('common.disable') }}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('merchantInfo.filter.agent')" label-width="150px" prop="parentAgentId">
                <el-select
                    v-model="filterbox.parentAgentId"
                    :options="agentOptions"
                    :props="agentProps"
                    :placeholder="$t('merchantInfo.placeholder.agent')"
                    style="width: 200px"
                >
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="reportInfo merchant-info-report">
    <form id="merchantInfoForm" class="merchantInfoFormT merchant-info-form" style="height: 88%">
      <el-button v-if="isAdmin" @click="addMerchant()" class="filterButton merchant-info-add" style="float: right">
        <SvgIcon name="add" class="filterButtonSvg"/>
        <div>{{ $t('common.operate.add') }}</div>
      </el-button>
      <div class="merchant-info-table-wrapper">
        <el-table
            border
            :data="merchantInfoFormData"
            class="merchantInfos-table"
            height="100%"
            :key="tableKey"
        >
        <el-table-column
            :label="$t('merchantInfo.column.basicInfo')"
            v-slot="{row}"
            align="center"
            width="380px"
            fixed="left"
        >
          <div class="merchant-basic-cell">
            <div class="merchant-basic-row merchant-basic-account">{{ $t('merchantInfo.column.account') }}: {{ row.accountName || '-' }}</div>
            <div class="merchant-basic-row merchant-basic-name">{{ $t('merchantInfo.column.name') }}: {{ row.merchantName || '-' }}</div>
            <div class="merchant-basic-row merchant-basic-code">{{ $t('merchantInfo.column.code') }}: {{ row.userId || '-' }}</div>
          </div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantInfo.column.merchantKey')"
            v-slot="{row}"
            align="center"
            width="280px"
        >
          <div class="secret-cell">
            <div class="secret-row">
              <span class="secret-label">apiKey:</span>
              <span class="secret-value">{{ maskSecret(row.apiKey) }}</span>
            </div>
            <div class="secret-row">
              <span class="secret-label">signKey:</span>
              <span class="secret-value">{{ maskSecret(row.signKey) }}</span>
            </div>
          </div>
        </el-table-column>
        <el-table-column
            prop="payingCommisson"
            :label="$t('merchantInfo.column.agent')"
            v-slot="{row}"
            align="center"
            width="300px"
            v-if="isAdmin"
        >
          <div v-for="(item, index) in row.agentInfos" :key="`${row.userId || row.accountName}-agent-${index}`">
            <div class="agent-info-card" :style="{ backgroundColor: agentCardColors[index % agentCardColors.length] }">
              <div>{{ $t('merchantInfo.agent.name') }} {{item.agentName}}</div>
              <div>{{ $t('merchantInfo.agent.account') }} {{item.accountName}}</div>
              <div v-if="row.channelDtoList" style="background-color: lightgreen">
                <div style="display: flex;align-items: center">
                  <div style="height:100%;width:150px;align-items: center;justify-items: center;text-align: center;">{{ $t('merchantInfo.agent.channel') }}</div>
                  <div style="width: 150px;border-left: solid 1px black">
                    <div style="flex: 2;width: 130px;" v-for="item in item.channelDtoList">
                      {{item.channelName}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantStatus"
            :label="$t('merchantInfo.column.status')"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? $t('common.enable') : $t('common.disable') }}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantLabel"
            :label="$t('merchantInfo.column.channel')"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div v-for="item in row.channelIds ? row.channelIds.toLocaleString().split(',') : ''">
            <div>{{channelMaps[item]}}</div>
          </div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantInfo.column.fee')"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div class="merchant-fee-card">
            <div class="merchant-fee-row">
              <div class="merchant-fee-title">{{ $t('merchantInfo.fee.collection') }}:</div>
              <div class="merchant-fee-value">{{ formatRatePair(row.collectionFixedFee, row.collectionRate) }}</div>
            </div>
            <div class="merchant-fee-row">
              <div class="merchant-fee-title">{{ $t('merchantInfo.fee.pay') }}:</div>
              <div class="merchant-fee-value">{{ formatRatePair(row.payFixedFee, row.payRate) }}</div>
            </div>
          </div>
        </el-table-column>
        <el-table-column
            prop="currencyType"
            :label="$t('merchantInfo.column.currency')"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div>
            {{row.currencyList ? row.currencyList.toLocaleString() : '-'}}
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantAccountInfo"
            :label="$t('merchantInfo.column.accountInfo')"
            v-slot="{row}"
            align="center"
            width="300px;"
        >
          <div class="account-info-wrap">
            <div
              class="account-info-card"
              v-for="item in getVisibleBalanceEntries(row)"
              :key="item.key"
            >
              <div class="account-info-row account-info-key">{{ item.key }}:</div>
              <div class="account-info-row account-total">{{ $t('merchantInfo.account.total') }} <div class="account-info-value">{{ item.value.total ? item.value.total: '-' }}</div></div>
              <div class="account-info-row account-usable">{{ $t('merchantInfo.account.available') }} <div class="account-info-value">{{ item.value.available ? item.value.available: '-' }}</div></div>
              <div class="account-info-row account-frozen">{{ $t('merchantInfo.account.frozen') }} <div class="account-info-value">{{ item.value.frozen ? item.value.frozen : '-' }}</div></div>
            </div>
            <div
              v-if="hasMoreBalanceEntries(row)"
              class="account-info-more"
              @click="expandAccountInfo(row)"
            >
              <el-icon class="account-info-more-icon">
                <ArrowDownBold />
              </el-icon>
            </div>
          </div>
        </el-table-column>
        <el-table-column
            prop="loginIPs"
            :label="$t('merchantInfo.column.ipWhitelist')"
            v-slot="{row}"
            align="center"
            width="300px"
        >
          <div class="ip-whitelist-stack">
            <div
              v-for="card in getVisibleIpCards(row)"
              :key="card.key"
              class="ip-whitelist-card"
            >
              <div class="ip-whitelist-title">{{ card.title }}</div>
              <div class="ip-whitelist-value">
                <div
                  v-for="line in card.lines"
                  :key="line.key"
                  class="ip-whitelist-line"
                >
                  <span v-if="line.label" class="ip-label">{{ line.label }}</span>
                  <div class="ip-list">
                    <div v-for="(ip, index) in line.values" :key="`${line.key}-${index}`">{{ ip }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="hasMoreIpCards(row)"
              class="account-info-more"
              @click="expandIpInfo(row)"
            >
              <el-icon class="account-info-more-icon">
                <ArrowDownBold />
              </el-icon>
            </div>
          </div>
        </el-table-column>
        <el-table-column
            :label="$t('merchantInfo.column.contactInfo')"
            v-slot="{row}"
            align="center"
            width="300px"
        >
          <div class="agent-card-row agent-card-account">
            {{ $t('merchantInfo.contact.name') }} {{row.contactName? row.contactName : '-'}}
          </div>
          <div class="agent-card-row agent-card-name">
            {{ $t('merchantInfo.contact.phone') }} {{row.contactPhone ? row.contactPhone: '-'}}
          </div>
          <div class="agent-card-row agent-card-channel">
            {{ $t('merchantInfo.contact.email') }} {{row.contactEmail ? row.contactEmail: '-'}}
          </div>
        </el-table-column>
        <el-table-column
            prop="createTime"
            :label="$t('merchantInfo.column.createTime')"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            {{row.createTime ? formatTimeByZone(row.createTime) : '-'}}
          </div>
        </el-table-column>
        <el-table-column
            :label="$t('common.operation')"
            v-slot="{row}"
            align="center"
            width="100px"
            fixed="right"
        >
          <div>
            <el-dropdown trigger="click">
              <SvgIcon name="more" width="30" height="30" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editMerchantInfo(row)">{{ $t('common.edit') }}</el-dropdown-item>
                  <el-dropdown-item @click="deleteMerchant(row.merchantAccount)">{{ $t('common.operate.delete') }}</el-dropdown-item>
                  <el-dropdown-item @click="showPlainSecret(row)">{{ $t('merchantInfo.action.viewPlain') }}</el-dropdown-item>
                  <el-dropdown-item @click="showResetSignKey(row)">{{ $t('merchantInfo.action.resetSignKey') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-table-column>
        </el-table>
      </div>
      <el-pagination class="pageTool merchant-info-pagination"
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
         
      >
      </el-pagination>
    </form>
  </div>

  <!-- 新增/修改弹出页面 -->
  <el-dialog
      :title="dialogAddTitle"
      v-model="dialogAddFormVisible"
      class="dialog"
      center
      width="70%"
      height="900px"
      style="max-width: 70%; overflow-x: auto"
      @open="handleOpen('merchantAddInfo')"
      @close="cancelAddDialog('merchantAddInfo')"
  >
    <el-form ref="merchantAddInfo" :key="merchantAddFormKey" style="height: 500px" :model="merchantAddInfo" label-width="100%" class="form" :rules="merchantInfoAddRule" >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.name')" label-width="150px"  prop="merchantName">
            <el-input :disabled="dialogFlag === 'edit'" v-model="merchantAddInfo.merchantName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.account')" label-width="150px"  prop="accountName">
            <el-input :disabled="dialogFlag === 'edit'" v-model="merchantAddInfo.accountName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item :label="$t('merchantInfo.form.password')" label-width="150px"  prop="accountPwd">
            <el-input type="password" v-model="merchantAddInfo.accountPwd" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item :label="$t('merchantInfo.form.confirmPassword')" label-width="150px"  prop="accountConfirmPwd">
            <el-input type="password" v-model="merchantAddInfo.accountConfirmPwd" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label-width="150px" :label="$t('merchantInfo.form.contactName')" prop="contactName">
            <el-input v-model="merchantAddInfo.contactName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label-width="150px" :label="$t('merchantInfo.form.contactEmail')" prop="contactEmail">
            <el-input v-model="merchantAddInfo.contactEmail" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label-width="150px" :label="$t('merchantInfo.form.contactPhone')" prop="contactPhone">
            <el-input v-model="merchantAddInfo.contactPhone" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item :label="$t('merchantInfo.form.loginWhitelist')" label-width="150px" prop="loginIps">
            <el-input v-model="merchantAddInfo.loginIps" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item :label="$t('merchantInfo.form.withdrawWhitelist')" label-width="150px" prop="withdrawalIps">
            <el-input v-model="merchantAddInfo.withdrawalIps" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.status')" label-width="150px" prop="status">
            <el-switch
                v-model="merchantAddInfo.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.disable')"
                :inactive-value="0"
                :active-value="1"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item :label="$t('merchantInfo.form.useAgent')" label-width="150px">
            <el-switch
                v-model="merchantAddInfo.useAgent"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.close')"
                :active-value="1"
                :inactive-value="0"
                @change="handleAgentChange"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="merchantAddInfo.useAgent === 0 && dialogFlag !== 'edit'" :span="6">
          <el-form-item :label="$t('merchantInfo.form.channel')" label-width="150px" prop="channelIds">
            <el-select
              :options="channelOptions"
              :props="channelProps"
              v-model="merchantAddInfo.channelIds"
              :placeholder="$t('merchantInfo.placeholder.channel')"
              style="width: 200px"
              multiple
            ></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="merchantAddInfo.useAgent===1 && dialogFlag !== 'edit'">
          <el-form-item :label="$t('merchantInfo.form.parentAgent')" label-width="150px" prop="parentId">
            <el-select
                :options="agentOptions"
                :props="agentProps"
                v-model="merchantAddInfo.parentId"
                :placeholder="$t('merchantInfo.placeholder.agent')"
                style="width: 200px"
            ></el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.supportPaying')" label-width="150px"  prop="supportPaying">
            <el-switch
                v-model="merchantAddInfo.supportPaying"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.support')"
                :inactive-text="$t('common.close')"
                :inactive-value="0"
                :active-value="1"
                @change="handlePayChange"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportPaying === 1">
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.payMinFee')" label-width="150px" prop="payMinFee">
            <el-input v-model="merchantAddInfo.payMinFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.payMaxFee')" label-width="150px" prop="payMaxFee">
            <el-input v-model="merchantAddInfo.payMaxFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-form-item :label="$t('merchantInfo.form.payWhitelist')" label-width="150px"  prop="payWhiteIps">
          <el-input v-model="merchantAddInfo.payWhiteIps" style="width: 200px"/>
        </el-form-item>
        </el-col>
<!--        <el-col :span="6">
          <el-form-item label="代付渠道:" label-width="150px"  prop="payingChannel">
            <el-select v-model="merchantInfo.payingChannel"
                       :props="channelProps"
                       :options="payingChannelOptions"
                       placeholder="请选择代付渠道"
                       style="width: 200px"
            >
&lt;!&ndash;               <el-option
                v-for="item in payingChannelOptions"
                :key="item.channelId"
                :value="item.channelId"
                :label="item.channelName"
               />&ndash;&gt;
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col v-if="false" :span="6">
          <el-form-item :label="$t('merchantInfo.form.payingChannelMode')" label-width="150px">
            <el-select disabled v-model="merchantAddInfo.payingChannelModel"
            >
              <el-option key="1" value="1">{{ $t('common.matchMode.random') }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportPaying === 1">
<!--        <el-col :span="6">
          <el-form-item label="代付计费模式:" label-width="150px" >
            <el-radio-group v-model="merchantAddInfo.payingChargingModel" size="small">
              <el-radio :value="1">比例</el-radio>
              <el-radio :value="2">固定</el-radio>
              <el-radio :value="3">混合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>-->
<!--        <el-col :span="6" v-if="merchantAddInfo.payingChargingModel === 2 || merchantAddInfo.payingChargingModel === 3">-->
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.payFixedFee')" label-width="150px" prop="payFixedFee">
            <el-input v-model="merchantAddInfo.payFixedFee" style="width: 200px"/>
            <div v-if="showAgentPayHint && !payFixedFeeValid" class="agent-fee-hint">
              <SvgIcon name="notice2" class="agent-fee-icon" />
              <span class="agent-fee-text">{{ $t('merchantInfo.validation.payFixedFeeMin', { value: selectedAgentPayFixedFeeDisplay }) }}</span>
            </div>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6" v-if="merchantAddInfo.payingChargingModel===1 || merchantAddInfo.payingChargingModel === 3">-->
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.payRate')" label-width="150px" prop="payRate">
            <el-input v-model="merchantAddInfo.payRate" style="width: 200px"/>
            <div v-if="showAgentPayHint && !payRateValid" class="agent-fee-hint">
              <SvgIcon name="notice2" class="agent-fee-icon" />
              <span class="agent-fee-text">{{ $t('merchantInfo.validation.payRateMin', { value: selectedAgentPayRateDisplay }) }}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.supportCollection')" label-width="150px" prop="supportCollection">
            <el-switch
                v-model="merchantAddInfo.supportCollection"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.support')"
                :inactive-text="$t('common.close')"
                :inactive-value="0"
                :active-value="1"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportCollection === 1">
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.collectionMinFee')" label-width="150px" prop="collectionMinFee">
            <el-input v-model="merchantAddInfo.collectionMinFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.collectionMaxFee')" label-width="150px" prop="collectionMaxFee">
            <el-input v-model="merchantAddInfo.collectionMaxFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.collectionWhitelist')" label-width="150px" prop="colWhiteIps">
            <el-input v-model="merchantAddInfo.colWhiteIps" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="display: flex;flex-wrap: wrap;">
          <el-form-item :label="$t('merchantInfo.form.floatMode')" label-width="150px" prop="isFloat">
            <el-switch
                v-model="merchantAddInfo.isFloat"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.close')"
                :inactive-value="0"
                :active-value="1"
                @change="handleFloatChange"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col v-if="merchantAddInfo.isFloat" :span="6">
          <el-form-item  :label="$t('merchantInfo.form.floatRange')" label-width="150px"  prop="floatRange">
            <el-input v-model="merchantAddInfo.floatRange" style="width: 200px;" type="number" :placeholder="$t('merchantInfo.placeholder.floatRange')"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="6">
          <el-form-item :label="$t('merchantInfo.form.collectionChannelMode')" label-width="150px">
            <el-select disabled v-model="merchantAddInfo.collectionChannelModel"
            >
              <el-option key="1" value="1">{{ $t('common.matchMode.random') }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportCollection === 1">
<!--        <el-col :span="6">
          <el-form-item label="代收计费模式:" label-width="150px" >
            <el-radio-group v-model="merchantAddInfo.collectionChargingModel" size="small">
              <el-radio :value="1">比例</el-radio>
              <el-radio :value="2">固定</el-radio>
              <el-radio :value="3">混合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>-->
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.collectionFixedFee')" label-width="150px" prop="collectionFixedFee">
            <el-input v-model="merchantAddInfo.collectionFixedFee" style="width: 200px"/>
            <div v-if="showAgentCollectionHint && !collectionFixedFeeValid" class="agent-fee-hint">
              <SvgIcon name="notice2" class="agent-fee-icon" />
              <span class="agent-fee-text">{{ $t('merchantInfo.validation.collectionFixedFeeMin', { value: selectedAgentCollectionFixedFeeDisplay }) }}</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.collectionRate')" label-width="150px" prop="collectionRate">
            <el-input v-model="merchantAddInfo.collectionRate" style="width: 200px"/>
            <div v-if="showAgentCollectionHint && !collectionRateValid" class="agent-fee-hint">
              <SvgIcon name="notice2" class="agent-fee-icon" />
              <span class="agent-fee-text">{{ $t('merchantInfo.validation.collectionRateMin', { value: selectedAgentCollectionRateDisplay }) }}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddDialog('merchantAddInfo')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitAddInfo('merchantAddInfo')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
  <el-dialog
      :title="$t('merchantInfo.dialog.verifyTitle')"
      v-model="editVerifyVisible"
      class="dialog"
      center
      align-center
      width="480px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-form>
      <el-row style="display: flex;justify-items: center;">
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;height: 50px;">
          <el-form-item :label="$t('common.googleCode')" label-width="150px" required>
            <el-input type="number" maxlength="6" v-model="editVerifyCode" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editVerifyVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="confirmEditSubmit">{{ $t('common.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      :title="dialogTitle"
      v-model="dialogFormVisible"
      class="dialog"
      center
      width="70%"
      height="50%"
      @open="handleOpen('merchantEditInfo')"
  >
    <el-form ref="merchantEditInfo" :model="merchantInfo" label-width="100%" class="form" :rules="merchantInfoRule" >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.account')" label-width="150px" >
            <el-input disabled v-model="merchantInfo.merchantAccount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.name')" label-width="150px"  prop="merchantName">
            <el-input v-model="merchantInfo.merchantName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.password')" label-width="150px"  prop="merchantPassword">
            <el-input v-model="merchantInfo.merchantPassword" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.confirmPassword')" label-width="150px"  prop="merchantConfirmPassword">
            <el-input v-model="merchantInfo.merchantConfirmPassword" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.parentAgent')" label-width="150px"  prop="merchantAgent">
            <el-cascader
                v-model="merchantInfo.merchantAgent"
                :options="agentOptions"
                @change="handleAgentChange"
                style="width: 200px"
                :props="{ checkStrictly: true }"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.collectWhitelist')" label-width="150px"  prop="collectingWhiteList">
            <el-input v-model="merchantInfo.collectingWhiteList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.loginWithdrawWhitelist')" label-width="150px"  prop="loginIpWhiteList">
            <el-input v-model="merchantInfo.loginIpWhiteList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"><el-form-item :label="$t('merchantInfo.form.payWhitelist')" label-width="150px"  prop="payingWhiteList">
          <el-input v-model="merchantInfo.payingWhiteList" style="width: 200px"></el-input>
        </el-form-item></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.floatMode')" label-width="150px"  prop="cashFloatModel">
            <el-switch
                v-model="merchantInfo.cashFloatModel"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.close')"
                :active-value="1"
                :inactive-value="0"
                @change="handleFloatChange"
            >
            </el-switch>
            <!--            <el-input v-model="merchantInfo.cashFloatModel" style="width: 200px"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.payChannel')" label-width="150px"  prop="payingChannel">
            <el-input v-model="merchantInfo.payingChannel" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('merchantInfo.form.status')" label-width="150px" >
            <el-switch
                v-model="merchantInfo.isInUse"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.disable')"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantInfo.cashFloatModel">
        <el-col :span="6">
          <el-form-item label-width="150px"  :label="$t('merchantInfo.form.floatRange')" prop="cashFloatNum">
            <el-input v-model="merchantInfo.cashFloatNum" style="width: 200px;" :placeholder="$t('merchantInfo.placeholder.floatRange')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit('merchantEditInfo')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
      :title="dialogDeleteTitle"
      v-model="dialogDeleteVisible"
      class="dialog"
      center
      width="70%"
      height="60%"
  >
    <el-form style="height: 120px">
      <el-row style="display: flex;justify-items: center;">
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;height: 50px;">
          <el-form-item :label="$t('common.googleCode')" label-width="150px"  >
            <el-input type="number" maxlength="6" v-model="deleteMerchantInfo.verifyCode" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="position: absolute;bottom: 5px;right: 3%">
      <el-button @click="cancelDeleteDialog">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitDelete">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
  <el-dialog
      :title="$t('merchantInfo.dialog.keyVerifyTitle')"
      v-model="plainKeyVerifyVisible"
      class="dialog"
      center
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-form>
      <el-row>
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;height: 50px;">
          <el-form-item :label="$t('merchantInfo.form.name')" label-width="150px">
            <el-select
              :model-value="pendingPlainMerchantAccount"
              disabled
              style="width: 200px"
            >
              <el-option
                :label="pendingPlainMerchantName || '-'"
                :value="pendingPlainMerchantAccount || ''"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;height: 50px;" v-if="!isAdmin">
          <el-form-item :label="$t('merchantInfo.form.password')" label-width="150px" required>
            <el-input type="password" v-model="plainKeyVerifyForm.password" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;height: 50px;">
          <el-form-item :label="$t('common.googleCode')" label-width="150px" required>
            <el-input type="number" maxlength="6" v-model="plainKeyVerifyForm.googleCode" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelPlainKeyVerify">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitPlainKeyVerify">{{ $t('common.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {isValidIP, loadingBody} from "@/api/common.js";
import { getTimeZoneOffsetMinutes } from "@/util/timezoneOptions.js";
import {
  createMerchantInfo, getAgentInfo,
  getAllCurrencyType, getChannelInfo,
  getMerchantInfo,
  getPaymentInfo, modifyMerchantInfo, queryMerchantSecretKey, resetMerchantSignKey
} from "@/api/interface/backendInterface.js";
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const MERCHANT_DRAFT_KEY = 'draft:MerchantInfo:form';
const buildEmptyMerchantAddInfo = () => ({
  merchantName: '',
  accountName: '',
  accountPwd: '',
  accountConfirmPwd: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  loginIps: '',
  withdrawalIps: '',
  status: 1,
  useAgent: 0,
  channelIds: [],
  parentId: '',
  supportPaying: 1,
  supportCollection: 1,
  payMinFee: '',
  payMaxFee: '',
  payWhiteIps: '',
  payingChannelModel: '随机',
  payingChargingModel: 1,
  payFixedFee: 0,
  payRate: 0,
  collectionMinFee: '',
  collectionMaxFee: '',
  colWhiteIps: '',
  isFloat: 0,
  floatRange: '',
  collectionChannelModel: '随机',
  collectionChargingModel: 1,
  collectionFixedFee: 0,
  collectionRate: 0
});
export default {
  name: "MerchantInfo",
  computed: {
    selectedAgentInfo() {
      if (this.merchantAddInfo.useAgent !== 1 || !this.merchantAddInfo.parentId) {
        return null;
      }
      return this.agentOptions.find(item => item.userId === this.merchantAddInfo.parentId) || null;
    },
    selectedAgentPayFixedFeeDisplay() {
      const value = this.selectedAgentInfo?.payFixedFee;
      return value === undefined || value === null ? '-' : value;
    },
    selectedAgentPayRateDisplay() {
      const value = this.selectedAgentInfo?.payRate;
      return value === undefined || value === null ? '-' : value;
    },
    selectedAgentCollectionFixedFeeDisplay() {
      const value = this.selectedAgentInfo?.collectionFixedFee;
      return value === undefined || value === null ? '-' : value;
    },
    selectedAgentCollectionRateDisplay() {
      const value = this.selectedAgentInfo?.collectionRate;
      return value === undefined || value === null ? '-' : value;
    },
    showAgentPayHint() {
      return this.merchantAddInfo.supportPaying === 1 && this.merchantAddInfo.useAgent === 1 && !!this.merchantAddInfo.parentId;
    },
    showAgentCollectionHint() {
      return this.merchantAddInfo.supportCollection === 1 && this.merchantAddInfo.useAgent === 1 && !!this.merchantAddInfo.parentId;
    }
  },
  watch: {
    dialogAddFormVisible(visible) {
      if (visible) {
        this.loadMerchantDraft();
      }
    },
    merchantAddInfo: {
      deep: true,
      handler() {
        this.saveMerchantDraft();
      }
    },
    dialogFlag() {
      this.saveMerchantDraft();
    },
    "merchantAddInfo.payFixedFee"() {
      this.payFixedFeeValid = false;
    },
    "merchantAddInfo.payRate"() {
      this.payRateValid = false;
    },
    "merchantAddInfo.parentId"() {
      this.payFixedFeeValid = false;
      this.payRateValid = false;
      this.collectionFixedFeeValid = false;
      this.collectionRateValid = false;
    },
    "merchantAddInfo.useAgent"(value) {
      this.payFixedFeeValid = false;
      this.payRateValid = false;
      this.collectionFixedFeeValid = false;
      this.collectionRateValid = false;
      if (value === 1) {
        this.merchantAddInfo.channelIds = [];
      } else if (value === 0) {
        this.merchantAddInfo.parentId = '';
      }
    },
    "merchantAddInfo.supportPaying"() {
      this.payFixedFeeValid = false;
      this.payRateValid = false;
    },
    "merchantAddInfo.collectionFixedFee"() {
      this.collectionFixedFeeValid = false;
    },
    "merchantAddInfo.collectionRate"() {
      this.collectionRateValid = false;
    },
    "merchantAddInfo.supportCollection"() {
      this.collectionFixedFeeValid = false;
      this.collectionRateValid = false;
    }
  },
  data() {
    const cashFloatNumValidate = (rule, value, callback) => {
      if (this.merchantAddInfo.isFloat === 1 && !value) {
        callback(new Error(this.$t('merchantInfo.validation.floatRangeRequired')))
      } else {
        callback()
      }
    };
    const validateAddGoogleCode = (rule, value, callback) => {
      if (this.dialogFlag === 'edit') {
        callback()
        return
      }
      if (!value) {
        callback(new Error(this.$t('common.googleCodeRequired')))
        return
      }
      callback()
    };
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('merchantInfo.validation.passwordRequired')));
      } else {
        callback()
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error(this.$t('merchantInfo.validation.passwordAgainRequired')))
      } else if (value !== this.merchantAddInfo.accountPwd) {
        callback(new Error(this.$t('merchantInfo.validation.passwordMismatch')))
      } else {
        callback()
      }
    };

    const ipValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('merchantInfo.validation.ipRequired')));
      } else if (!isValidIP(value)) {
        callback(new Error(this.$t('merchantInfo.validation.ipInvalid')));
      } else {
        callback()
      }
    };

    const validAgent = (rule, value, callback) => {
      if (this.merchantAddInfo.useAagent === 1) {
        //use agent channel is null and parentId is not null
        if(!value) {
          callback(new Error(this.$t('merchantInfo.validation.agentRequired')));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validateChannel = (rule, value, callback) => {
      if (this.merchantAddInfo.useAgent === 0) {
        if(!value) {
          callback(new Error(this.$t('merchantInfo.validation.channelRequired')));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validPay = (rule, value, callback) => {
      if (this.merchantAddInfo.supportPaying === 1) {
        // support pay
        if(!value) {
          callback(new Error(this.$t('merchantInfo.validation.payRequired')));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const getAgentPayLimits = () => {
      if (this.merchantAddInfo.useAgent !== 1 || !this.merchantAddInfo.parentId) {
        return { payFixedFee: null, payRate: null };
      }
      const agent = this.agentOptions.find(item => item.userId === this.merchantAddInfo.parentId);
      if (!agent) {
        return { payFixedFee: null, payRate: null };
      }
      return {
        payFixedFee: agent.payFixedFee ?? null,
        payRate: agent.payRate ?? null
      };
    };
    const getAgentCollectionLimits = () => {
      if (this.merchantAddInfo.useAgent !== 1 || !this.merchantAddInfo.parentId) {
        return { collectionFixedFee: null, collectionRate: null };
      }
      const agent = this.agentOptions.find(item => item.userId === this.merchantAddInfo.parentId);
      if (!agent) {
        return { collectionFixedFee: null, collectionRate: null };
      }
      return {
        collectionFixedFee: agent.collectionFixedFee ?? null,
        collectionRate: agent.collectionRate ?? null
      };
    };
    const parseNum = (val) => {
      if (val === '' || val === null || val === undefined) return 0;
      const num = Number(val);
      return Number.isNaN(num) ? 0 : num;
    };
    const hasPayValue = (val) => parseNum(val) > 0;
    const validPayFixedFee = (rule, value, callback) => {
      if (this.merchantAddInfo.supportPaying !== 1) {
        this.payFixedFeeValid = true;
        callback();
        return;
      }
      const payFixedFee = parseNum(value);
      const payRate = parseNum(this.merchantAddInfo.payRate);
      const fixedHasValue = payFixedFee > 0;
      const rateHasValue = payRate > 0;
      if (!fixedHasValue && !rateHasValue) {
        this.payFixedFeeValid = false;
        callback(new Error(this.$t('merchantInfo.validation.payFeeRequired')));
        return;
      }
      const { payFixedFee: minFixed } = getAgentPayLimits();
      if (minFixed !== null) {
        if (fixedHasValue) {
          if (payFixedFee < Number(minFixed)) {
            this.payFixedFeeValid = false;
            callback(new Error(this.$t('merchantInfo.validation.payFixedFeeMin', { value: minFixed })));
            return;
          }
        } else if (rateHasValue && payFixedFee > 0) {
          if (payFixedFee < Number(minFixed)) {
            this.payFixedFeeValid = false;
            callback(new Error(this.$t('merchantInfo.validation.payFixedFeeMin', { value: minFixed })));
            return;
          }
        }
      }
      this.payFixedFeeValid = true;
      callback();
    };
    const validPayRate = (rule, value, callback) => {
      if (this.merchantAddInfo.supportPaying !== 1) {
        this.payRateValid = true;
        callback();
        return;
      }
      const payRate = parseNum(value);
      const payFixedFee = parseNum(this.merchantAddInfo.payFixedFee);
      const rateHasValue = payRate > 0;
      const fixedHasValue = payFixedFee > 0;
      if (!rateHasValue && !fixedHasValue) {
        this.payRateValid = false;
        callback(new Error(this.$t('merchantInfo.validation.payFeeRequired')));
        return;
      }
      const { payRate: minRate } = getAgentPayLimits();
      if (minRate !== null) {
        if (rateHasValue) {
          if (payRate < Number(minRate)) {
            this.payRateValid = false;
            callback(new Error(this.$t('merchantInfo.validation.payRateMin', { value: minRate })));
            return;
          }
        } else if (fixedHasValue && payRate > 0) {
          if (payRate < Number(minRate)) {
            this.payRateValid = false;
            callback(new Error(this.$t('merchantInfo.validation.payRateMin', { value: minRate })));
            return;
          }
        }
      }
      this.payRateValid = true;
      callback();
    };
    const validCollection = (rule, value, callback) => {
      if (this.merchantAddInfo.supportCollection === 1) {
        // support pay
        if(!value) {
          callback(new Error(this.$t('merchantInfo.validation.collectionRequired')));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validCollectionFixedFee = (rule, value, callback) => {
      if (this.merchantAddInfo.supportCollection !== 1) {
        this.collectionFixedFeeValid = true;
        callback();
        return;
      }
      const collectionFixedFee = parseNum(value);
      const collectionRate = parseNum(this.merchantAddInfo.collectionRate);
      const fixedHasValue = collectionFixedFee > 0;
      const rateHasValue = collectionRate > 0;
      if (!fixedHasValue && !rateHasValue) {
        this.collectionFixedFeeValid = false;
        callback(new Error(this.$t('merchantInfo.validation.collectionFeeRequired')));
        return;
      }
      const { collectionFixedFee: minFixed } = getAgentCollectionLimits();
      if (minFixed !== null) {
        if (fixedHasValue) {
          if (collectionFixedFee < Number(minFixed)) {
            this.collectionFixedFeeValid = false;
            callback(new Error(this.$t('merchantInfo.validation.collectionFixedFeeMin', { value: minFixed })));
            return;
          }
        } else if (rateHasValue && collectionFixedFee > 0) {
          if (collectionFixedFee < Number(minFixed)) {
            this.collectionFixedFeeValid = false;
            callback(new Error(this.$t('merchantInfo.validation.collectionFixedFeeMin', { value: minFixed })));
            return;
          }
        }
      }
      this.collectionFixedFeeValid = true;
      callback();
    };
    const validCollectionRate = (rule, value, callback) => {
      if (this.merchantAddInfo.supportCollection !== 1) {
        this.collectionRateValid = true;
        callback();
        return;
      }
      const collectionRate = parseNum(value);
      const collectionFixedFee = parseNum(this.merchantAddInfo.collectionFixedFee);
      const rateHasValue = collectionRate > 0;
      const fixedHasValue = collectionFixedFee > 0;
      if (!rateHasValue && !fixedHasValue) {
        this.collectionRateValid = false;
        callback(new Error(this.$t('merchantInfo.validation.collectionFeeRequired')));
        return;
      }
      const { collectionRate: minRate } = getAgentCollectionLimits();
      if (minRate !== null) {
        if (rateHasValue) {
          if (collectionRate < Number(minRate)) {
            this.collectionRateValid = false;
            callback(new Error(this.$t('merchantInfo.validation.collectionRateMin', { value: minRate })));
            return;
          }
        } else if (fixedHasValue && collectionRate > 0) {
          if (collectionRate < Number(minRate)) {
            this.collectionRateValid = false;
            callback(new Error(this.$t('merchantInfo.validation.collectionRateMin', { value: minRate })));
            return;
          }
        }
      }
      this.collectionRateValid = true;
      callback();
    };
    return {
      isAdmin: false,
      filterAvaiable: false,
      merchantAccountOptions: [],
      merchantAccountLoading: false,
      merchantAccountHasMore: true,
      merchantAccountPageNo: 1,
      merchantAccountPageSize: 20,
      merchantAccountQuery: '',
      merchantAccountScrollBound: false,
      tableKey: 0,
      activeTool: "1",
      currency: '',
      timeZoneKey: localStorage.getItem("timeZone") || "UTC+8",
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      currencyMaps: {},
      channelMaps: {},
      agentMaps: {},
      statisticsInfo: {},
      merchantReport: {},
      merchantInfoAddRule: {
        merchantName: [
          {required: true, message: this.$t('merchantInfo.validation.nameRequired'), trigger: 'blur'},
        ],
        /*merchantAgent: [
          {required: true, validator: validateAgent, trigger: 'blur'},
        ],*/
        accountName: [
          {
            required: true, message: this.$t('merchantInfo.validation.accountRequired'), trigger: 'blur'
          }
        ],
        accountPwd: [
          {
            required: true, validator: validatePass, trigger: 'blur'
          }
        ],
        accountConfirmPwd: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ],
        contactName: [
            {required: true, message: this.$t('merchantInfo.validation.contactNameRequired'), trigger: 'blur'}
        ],
        contactEmail: [
            {required: true, message: this.$t('merchantInfo.validation.contactEmailRequired'), trigger: 'blur'}
        ],
        contactPhone: [
            {required: true, message: this.$t('merchantInfo.validation.contactPhoneRequired'), trigger: 'blur'}
        ],
        loginIps: [
            {required: true, message: this.$t('merchantInfo.validation.loginIpRequired'), trigger: 'blur'}
        ],
        withdrawalIps: [
            {required: true, message: this.$t('merchantInfo.validation.withdrawalIpRequired'), trigger: 'blur'}
        ],
        channelIds: [
          {
            required: true, validator: validateChannel, trigger: 'blur'
          }
        ],
        parentId: [{
          required: true,validator: validAgent, trigger: 'blur'
        }],
        payMinFee: [{
          required: true, message: this.$t('merchantInfo.validation.payMinFeeRequired'), trigger: 'blur'
        }],
        payMaxFee: [{
          required: true, message: this.$t('merchantInfo.validation.payMaxFeeRequired'), trigger: 'blur'
        }],
        payWhiteIps: [
            {required: true, validator: validPay, trigger: 'blur'}
        ],
        payFixedFee: [
            { validator: validPayFixedFee, trigger: 'blur' }
        ],
        payRate: [
          { validator: validPayRate, trigger: 'blur' }
        ],
        collectionMinFee: [
            {required: true, message: this.$t('merchantInfo.validation.collectionMinFeeRequired'), trigger: 'blur'}
        ],
        collectionMaxFee: [
            {required: true, message: this.$t('merchantInfo.validation.collectionMaxFeeRequired'), trigger: 'blur'}
        ],
        colWhiteIps: [
            {required: true, validator: validCollection, trigger: 'blur'}
        ],
        collectionFixedFee: [
            {required: true, validator: validCollectionFixedFee, trigger: 'blur'}
        ],
        collectionRate: [
            {required: true, validator: validCollectionRate, trigger: 'blur'}
        ],
        googleCode: [],
        floatRange: [
          {required: true, validator: cashFloatNumValidate, trigger: 'blur'},
        ],
      },
      merchantInfoRule: {
        merchantName: [
          {required: true, message: this.$t('merchantInfo.validation.nameRequired'), trigger: 'blur'},
        ],
        merchantAgent: [
            {required: true, message: this.$t('merchantInfo.validation.agentRequired'), trigger: 'blur'},
        ],
        collectingWhiteList: [
            {required: true, message: this.$t('merchantInfo.validation.collectWhitelistRequired'), trigger: 'blur'},
        ],

        loginIpWhiteList: [
            {required: true, message: this.$t('merchantInfo.validation.loginIpRequired'), trigger: 'blur'},
        ],
        payingWhiteList: [
            {required: true, message: this.$t('merchantInfo.validation.payWhitelistRequired'), trigger: 'blur'},
        ],
       /* cashFloatModel: [
            {required: true, message: 'cashFloatModel is required', trigger: 'blur'},
        ],*/
        payingChannel: [
         {required: true, message: this.$t('merchantInfo.validation.payChannelRequired'), trigger: 'blur'},
     ],
        googleCode: [
            {required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur'},
        ],
        cashFloatNum: [
          {required: true, validator: cashFloatNumValidate, trigger: 'blur'},
        ],
        merchantPassword: [
          {required: true, validator: validatePass, trigger: 'blur'},
        ],
        merchantConfirmPassword: [
          {required: true, validator: validatePass2, trigger: 'blur'},
        ]
      },
      dialogAddTitle: "",
      dialogAddFormVisible: false,
      merchantAddFormKey: 0,
      editVerifyVisible: false,
      editVerifyCode: '',
      verifyAction: '',
      plainKeyVerifyVisible: false,
      plainKeyVerifyForm: {
        password: '',
        googleCode: ''
      },
      plainKeyAction: 'view',
      pendingPlainMerchantAccount: '',
      pendingPlainMerchantName: '',
      pendingPlainKeyUserId: '',
      accountInfoExpandMap: {},
      ipInfoExpandMap: {},
      deleteMerchantInfo: {},
      dialogDeleteVisible: false,
      dialogDeleteTitle: "",
      totalCount: 1,
      currentPage: 1,
      pageSize: 1,
      pageSizes: [,10, 20, 50, 100, 200],
      filterbox: {

      },
      isUse: [{
        value: true,
        label: 'use'
      },
        {
          value: false,
          label: 'unuse'
        }],
      value: '',
      dialogFlag: '',
      merchantInfoFormData: [
      ],
      merchantAddInfo: buildEmptyMerchantAddInfo(),
      payFixedFeeValid: false,
      payRateValid: false,
      collectionFixedFeeValid: false,
      collectionRateValid: false,
      merchantInfo: {
      },
      dialogTitle: '',
      dialogFormVisible: false,
      selectedAgent: [],
      agentOptions: [
      ],
      agentProps: {
        value: 'userId',
        label: 'agentName'
      },
      channelOptions: [
        /*{
          channelId: 1,
          channelName: '渠道一'
        },
        {
          channelId: 2,
          channelName: '渠道二'
        }*/
      ],
      channelProps: {
        value: 'channelId',
        label: 'channelName'
      },
      agentCardColors: ['#e8f2ff', '#e9f6ee', '#f0f2f5']
    }
  },
  methods: {
    getMerchantRowKey(row) {
      return String(row?.userId || row?.accountName || '');
    },
    getBalanceEntries(balanceInfo) {
      if (!balanceInfo || typeof balanceInfo !== 'object') {
        return [];
      }
      return Object.keys(balanceInfo).map((key) => ({
        key,
        value: balanceInfo[key] || {}
      }));
    },
    isAccountInfoExpanded(row) {
      const key = this.getMerchantRowKey(row);
      if (!key) return false;
      return !!this.accountInfoExpandMap[key];
    },
    isIpInfoExpanded(row) {
      const key = this.getMerchantRowKey(row);
      if (!key) return false;
      return !!this.ipInfoExpandMap[key];
    },
    getVisibleBalanceEntries(row) {
      const entries = this.getBalanceEntries(row?.balanceInfo);
      if (entries.length <= 1 || this.isAccountInfoExpanded(row)) {
        return entries;
      }
      return entries.slice(0, 1);
    },
    hasMoreBalanceEntries(row) {
      const entries = this.getBalanceEntries(row?.balanceInfo);
      return entries.length > 1 && !this.isAccountInfoExpanded(row);
    },
    expandAccountInfo(row) {
      const key = this.getMerchantRowKey(row);
      if (!key) return;
      this.accountInfoExpandMap = {
        [key]: true
      };
    },
    getIpCards(row) {
      return [
        {
          key: 'login-withdraw',
          title: this.$t('merchantInfo.ip.loginWithdraw'),
          lines: [
            {
              key: 'login',
              label: this.$t('merchantInfo.ip.login'),
              values: this.formatIpLines(row?.loginIps)
            },
            {
              key: 'withdraw',
              label: this.$t('merchantInfo.ip.withdraw'),
              values: this.formatIpLines(row?.withdrawalIps)
            }
          ]
        },
        {
          key: 'paying',
          title: this.$t('merchantInfo.ip.paying'),
          lines: [
            {
              key: 'paying',
              label: '',
              values: this.formatIpLines(row?.payWhiteIps)
            }
          ]
        },
        {
          key: 'collecting',
          title: this.$t('merchantInfo.ip.collecting'),
          lines: [
            {
              key: 'collecting',
              label: '',
              values: this.formatIpLines(row?.colWhiteIps)
            }
          ]
        }
      ];
    },
    getVisibleIpCards(row) {
      const cards = this.getIpCards(row);
      if (cards.length <= 1 || this.isIpInfoExpanded(row)) {
        return cards;
      }
      return cards.slice(0, 1);
    },
    hasMoreIpCards(row) {
      const cards = this.getIpCards(row);
      return cards.length > 1 && !this.isIpInfoExpanded(row);
    },
    expandIpInfo(row) {
      const key = this.getMerchantRowKey(row);
      if (!key) return;
      this.ipInfoExpandMap = {
        [key]: true
      };
    },
    maskSecret(value) {
      const str = String(value || '').trim();
      if (!str) return '-';
      if (str.length <= 8) return '****';
      return `${str.slice(0, 4)}****${str.slice(-4)}`;
    },
    showPlainSecret(row) {
      this.pendingPlainMerchantAccount = row?.accountName || '';
      this.pendingPlainMerchantName = row?.merchantName || '';
      this.pendingPlainKeyUserId = row?.userId || '';
      this.plainKeyAction = 'view';
      this.plainKeyVerifyForm.password = '';
      this.plainKeyVerifyForm.googleCode = '';
      this.plainKeyVerifyVisible = true;
    },
    showResetSignKey(row) {
      this.pendingPlainMerchantAccount = row?.accountName || '';
      this.pendingPlainMerchantName = row?.merchantName || '';
      this.pendingPlainKeyUserId = row?.userId || '';
      this.plainKeyAction = 'resetSignKey';
      this.plainKeyVerifyForm.password = '';
      this.plainKeyVerifyForm.googleCode = '';
      this.plainKeyVerifyVisible = true;
    },
    cancelPlainKeyVerify() {
      this.plainKeyVerifyVisible = false;
      this.plainKeyVerifyForm.password = '';
      this.plainKeyVerifyForm.googleCode = '';
      this.plainKeyAction = 'view';
      this.pendingPlainMerchantAccount = '';
      this.pendingPlainMerchantName = '';
      this.pendingPlainKeyUserId = '';
    },
    submitPlainKeyVerify() {
      if (!this.plainKeyVerifyForm.googleCode) {
        this.$message({
          type: 'error',
          message: this.$t('common.googleCodeRequired')
        });
        return;
      }
      if (!this.isAdmin && !this.plainKeyVerifyForm.password) {
        this.$message({
          type: 'error',
          message: this.$t('merchantInfo.validation.passwordRequired')
        });
        return;
      }
      const payload = {
        merchantUserId: this.pendingPlainKeyUserId,
        googleCode: this.plainKeyVerifyForm.googleCode
      };
      if (!this.isAdmin) {
        payload.password = this.plainKeyVerifyForm.password;
      }
      const request = this.plainKeyAction === 'resetSignKey'
        ? resetMerchantSignKey(payload)
        : queryMerchantSecretKey(payload);
      request.then(res => {
        if (res.status === 200 && res.data.code === 0) {
          if (this.plainKeyAction === 'resetSignKey') {
            let signKey = '';
            try {
              const data = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data;
              signKey = (data && (data.signKey || data.sign_key || data.merchantSignKey)) || '';
            } catch (e) {
              signKey = String(res.data.data || '');
            }
            this.$alert(`signKey: ${signKey || '-'}`, this.$t('merchantInfo.dialog.signKeyResetTitle'), {
              confirmButtonText: this.$t('common.confirm'),
              dangerouslyUseHTMLString: true
            }).then(() => {
              this.search();
            });
            this.$notify({
              title: this.$t('common.success'),
              type: 'success',
              message: this.$t('merchantInfo.message.resetSignKeySuccess'),
              duration: 3000,
              position: 'bottom-right'
            });
            this.cancelPlainKeyVerify();
            return;
          }
          let apiKey = '';
          let signKey = '';
          try {
            const data = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data;
            apiKey = (data && (data.apiKey || data.api_key || data.merchantApiKey)) || '';
            signKey = (data && (data.signKey || data.sign_key || data.merchantSignKey)) || '';
          } catch (e) {
            const raw = String(res.data.data || '');
            apiKey = raw;
            signKey = '';
          }
          const plainHtml = `apiKey: ${apiKey || '-'}<br/>signKey: ${signKey || '-'}`
          this.$alert(plainHtml, this.$t('merchantInfo.dialog.merchantKeyPlainTitle'), {
            confirmButtonText: this.$t('common.confirm'),
            dangerouslyUseHTMLString: true
          });
          this.cancelPlainKeyVerify();
          return;
        }
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          message: res?.data?.message || this.$t('common.requestFailed'),
          duration: 3000,
          position: 'bottom-right'
        });
      }).catch(() => {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          message: this.$t('common.requestFailed'),
          duration: 3000,
          position: 'bottom-right'
        });
      });
    },
    formatRatePair(fixedFee, rate) {
      const fixedEmpty = fixedFee === null || fixedFee === undefined || fixedFee === '';
      const rateEmpty = rate === null || rate === undefined || rate === '';
      if (fixedEmpty && rateEmpty) {
        return '-';
      }
      const fixedDisplay = fixedEmpty ? '-' : fixedFee;
      const rateDisplay = rateEmpty ? '-' : `${rate}%`;
      return `${fixedDisplay}+${rateDisplay}`;
    },
    formatIpLines(value) {
      if (!value) return ['-'];
      const list = String(value)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
      return list.length ? list : ['-'];
    },
    formatIpLinesMerge(primary, secondary) {
      const list = []
        .concat(primary ? String(primary).split(',') : [])
        .concat(secondary ? String(secondary).split(',') : [])
        .map(item => item.trim())
        .filter(Boolean);
      if (!list.length) return ['-'];
      return Array.from(new Set(list));
    },
    saveMerchantDraft() {
      if (!this.dialogAddFormVisible) return;
      const mode = this.dialogFlag || '';
      const recordId = this.merchantAddInfo?.merchantUserId || this.merchantAddInfo?.userId || this.merchantAddInfo?.id || '';
      saveDraft(MERCHANT_DRAFT_KEY, {
        mode,
        recordId,
        data: this.merchantAddInfo || {}
      });
    },
    loadMerchantDraft() {
      const draft = loadDraft(MERCHANT_DRAFT_KEY);
      if (!draft || !draft.data) return;
      const mode = this.dialogFlag || '';
      if (draft.mode && mode && draft.mode !== mode) return;
      if (mode === 'edit') {
        const recordId = this.merchantAddInfo?.merchantUserId || this.merchantAddInfo?.userId || this.merchantAddInfo?.id || '';
        if (draft.recordId && recordId && draft.recordId !== recordId) return;
      }
      this.merchantAddInfo = Object.assign(buildEmptyMerchantAddInfo(), draft.data || {});
    },
    clearMerchantDraft() {
      clearDraft(MERCHANT_DRAFT_KEY);
    },
    handleMerchantAccountDropdownVisible(visible) {
      if (!visible || this.filterAvaiable) return;
      if (!this.merchantAccountOptions.length) {
        this.resetMerchantAccountOptions();
        this.fetchMerchantAccountOptions(false);
      }
      this.attachMerchantAccountScroll();
    },
    handleMerchantAccountSearch(query) {
      if (this.filterAvaiable) return;
      this.merchantAccountQuery = query || '';
      this.resetMerchantAccountOptions();
      this.fetchMerchantAccountOptions(false);
    },
    resetMerchantAccountOptions() {
      this.merchantAccountPageNo = 1;
      this.merchantAccountHasMore = true;
      this.merchantAccountOptions = [];
    },
    fetchMerchantAccountOptions(append) {
      if (this.merchantAccountLoading || !this.merchantAccountHasMore) return;
      this.merchantAccountLoading = true;
      const payload = {
        pageNo: this.merchantAccountPageNo,
        pageSize: this.merchantAccountPageSize,
        isNeedCardData: false
      };
      if (this.merchantAccountQuery) {
        payload.merchantUserName = this.merchantAccountQuery;
      }
      getMerchantInfo(payload).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const all = JSON.parse(res.data.data);
          const list = all.merchantInfoDtoList || [];
          const mapped = list.map(item => ({
            value: item.accountName,
            label: item.accountName
          }));
          this.merchantAccountOptions = append
            ? this.merchantAccountOptions.concat(mapped)
            : mapped;
          if (list.length < this.merchantAccountPageSize) {
            this.merchantAccountHasMore = false;
          } else {
            this.merchantAccountPageNo += 1;
          }
        } else {
          this.merchantAccountHasMore = false;
        }
      }).finally(() => {
        this.merchantAccountLoading = false;
      });
    },
    attachMerchantAccountScroll() {
      this.$nextTick(() => {
        const wrap = document.querySelector(".merchant-account-select-dropdown .el-select-dropdown__wrap");
        if (!wrap || this.merchantAccountScrollBound) return;
        wrap.addEventListener("scroll", this.handleMerchantAccountScroll);
        this.merchantAccountScrollBound = true;
      });
    },
    handleMerchantAccountScroll(event) {
      const el = event.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        this.fetchMerchantAccountOptions(true);
      }
    },
    confirmEditSubmit() {
      if (!this.editVerifyCode) {
        this.$message({
          type: 'error',
          message: this.$t('common.googleCodeRequired')
        })
        return
      }
      this.merchantAddInfo.googleCode = this.editVerifyCode
      const request = this.verifyAction === 'create'
        ? createMerchantInfo(this.merchantAddInfo)
        : modifyMerchantInfo(this.merchantAddInfo)
      request.then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.dialogAddFormVisible = false
          this.dialogTitle = ''
          if (this.verifyAction === 'create') {
            this.$refs.merchantAddInfo?.resetFields()
          }
          this.clearMerchantDraft()
          this.search()
          this.$notify({
            title: this.$t('common.success'),
            type: 'success',
            message: this.verifyAction === 'create'
              ? this.$t('merchantInfo.message.createSuccess')
              : this.$t('merchantInfo.message.updateSuccess'),
            duration: 4000,
            position: 'bottom-right'
          })
        } else if (res.status === 200 && res.data.code !== 0) {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            message: res.data.message,
            duration: 4000,
            position: 'bottom-right'
          })
        } else {
          this.$message({
            type: 'error',
            title: this.$t('common.error'),
            message: this.$t('common.requestFailed'),
            duration: 4000,
            position: 'bottom-right'
          })
        }
      }).finally(() => {
        this.editVerifyVisible = false
        this.editVerifyCode = ''
        this.verifyAction = ''
      })
    },
    search() {
      this.filterbox.isNeedCardData = true
      const loadingInstance = loadingBody(this, 'merchantInfos-table')
      getMerchantInfo(this.filterbox).then(res => {
         //this.merchantInfoFormData
        if(res.status === 200 && res.data.code === 0) {
          const all = JSON.parse(res.data.data)
          this.pageSize = all.pageSize
          this.totalCount = all.totalNumber
          const allList = all.merchantInfoDtoList
          this.accountInfoExpandMap = {}
          this.ipInfoExpandMap = {}
          this.merchantInfoFormData = null;
          this.merchantInfoFormData = Object.assign([], allList)
          if(!this.isAdmin && allList.length > 0) {
            this.filterbox.merchantName = allList[0].merchantName
            this.filterbox.merchantUserName = allList[0].accountName
            this.agentOptions = allList[0].agentInfos
            //this.channelOptions = allList[0].channelDtoList
          }
          this.tableKey++
        }
        loadingInstance.close()
      })
    },
    handleOpen(form) {
      this.$nextTick(() => {
        if (this.dialogFlag === 'edit') {
          this.$refs[form].clearValidate();
        } else {
          this.$refs[form].resetFields();
        }
      });
    },
    handleCurrentChange(currentPage) {
       this.filterbox.pageNo = currentPage;
       this.filterbox.pageSize = this.pageSize;
       this.search();
    },
    handleSizeChange(size) {
      this.filterbox.pageNo = 1
      this.currentPage = 1
      this.filterbox.pageSize = size
      this.pageSize = size
      this.handleCurrentChange()
    },
    formatTimeByZone(ts) {
      const baseMillis = ts * 1000;
      const offsetMinutes = getTimeZoneOffsetMinutes(this.timeZoneKey, baseMillis);
      if (offsetMinutes === null) {
        return getFormateDate(ts);
      }
      const zoned = new Date(baseMillis + offsetMinutes * 60000);
      const year = zoned.getFullYear();
      const month = String(zoned.getMonth() + 1).padStart(2, '0');
      const day = String(zoned.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    reset(form) {
      this.filterbox.merchantAccount = '';
      this.filterbox.isInUse = true;
      this.filterbox.supportCurrency = '';
      this.filterbox.belongAgent = [];
      this.filterbox.merchantName = '';
      this.$refs[form].resetFields();
    },
    addMerchant() {
      this.merchantInfo = [],
      this.resetMerchantAddInfo();
      this.merchantAddFormKey += 1;
      this.dialogAddFormVisible = true;
      this.dialogAddTitle = this.$t('merchantInfo.dialog.addTitle');
      this.dialogFlag = 'create'
      this.loadMerchantDraft()
    },
    handleAgentChange(val) {
      if (this.merchantInfo.useAgent === 1) {
        this.merchantInfo.channelId = []
      }
      if (this.merchantInfo.useAgent === 0) {
        this.merchantInfo.merchantAgent = []
      }
    },
    handleFloatChange(val) {
    },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.merchantInfo = {}
      this.selectedAgent = []
      this.dialogFlag = ''
    },
    cancelAddDialog(form) {
      this.dialogAddFormVisible = false;
      this.dialogAddTitle = '',
      this.resetMerchantAddInfo();
      this.merchantAddFormKey += 1;
      this.selectedAgent = []
      this.dialogFlag = ''
      this.clearMerchantDraft()
      if (this.$refs[form]) {
        this.$refs[form].resetFields();
        this.$refs[form].clearValidate();
      }
    },
    resetMerchantAddInfo() {
      this.merchantAddInfo = buildEmptyMerchantAddInfo();
    },
    cancelDeleteDialog() {
      this.dialogDeleteTitle = ''
      this.dialogDeleteVisible = false
      this.deleteMerchantInfo = {}
    },
    editMerchantInfo(rowInfo) {
      this.merchantAddInfo = Object.assign({},rowInfo)
      this.merchantAddInfo.merchantUserId = rowInfo.userId
      this.merchantAddInfo.channelIds = this.merchantAddInfo.channelIds ? this.merchantAddInfo.channelIds.split(',') : []
      if(rowInfo.agentInfos) {
        this.merchantAddInfo.useAgent = 1
      }
      if (this.merchantAddInfo.supportType === 0) {
        this.merchantAddInfo.supportCollection = 1
        this.merchantAddInfo.supportPaying = 0
      } else if(this.merchantAddInfo.supportType === 1) {
        this.merchantAddInfo.supportCollection = 0
        this.merchantAddInfo.supportPaying = 1
      } else {
        this.merchantAddInfo.supportCollection = 1
        this.merchantAddInfo.supportPaying = 1
      }
      console.log('addInfo2----'+JSON.stringify(this.merchantAddInfo))
      this.dialogFlag = 'edit';
      this.dialogAddFormVisible = true
      this.dialogAddTitle = this.$t('merchantInfo.dialog.editTitle')
      this.loadMerchantDraft()

    },
    getAllAgentId(agents) {
      agents.forEach(agent => {
        this.selectedAgent.push(agent.value)
        if (agent.hasOwnProperty('children')) {
          this.getAllAgentId(agent.children)
        }
      })
      this.merchantInfo.merchantAgent = this.selectedAgent
    },
    deleteMerchant(val) {
      this.$confirm(this.$t('merchantInfo.confirm.deleteMessage'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning',
      }).then(() => {
        //直行删除
        this.deleteMerchantInfo.merchantAccount = val
        this.dialogDeleteVisible = true;
        this.dialogDeleteTitle = this.$t('merchantInfo.dialog.deleteTitle')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('merchantInfo.message.deleteCanceled')
        })
      })
    },
    submitDelete() {
      if (!this.deleteMerchantInfo.verifyCode) {
        this.$message({
          type: 'error',
          message: this.$t('common.googleCodeRequired')
        })
        return
      }
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$message({
            type: 'success',
            message: this.$t('merchantInfo.message.validationSuccess')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('merchantInfo.message.validationFailed')
          })
        }
      })
    },
    submitAddInfo(form) {
      //if (this.dialogFlag === 'create') {
        if (this.merchantAddInfo.supportPaying === 1 && this.merchantAddInfo.supportCollection === 0) {

          this.merchantAddInfo.supportType = 1
          if(!this.merchantAddInfo.payRate) {
            this.merchantAddInfo.payRate = 0
          } else if (!this.merchantAddInfo.payFixedFee) {
            this.merchantAddInfo.payFixedFee = 0
          }
          this.merchantAddInfo.orderType = 0
        } else if (this.merchantAddInfo.supportCollection === 1 && this.merchantAddInfo.supportPaying === 0) {

          this.merchantAddInfo.supportType = 0
          if(!this.merchantAddInfo.collectionRate) {
            this.merchantAddInfo.collectionRate = 0
          } else if (!this.merchantAddInfo.collectionFixedFee) {
            this.merchantAddInfo.collectionFixedFee = 0
          }
        } else if (this.merchantAddInfo.supportCollection === 1 && this.merchantAddInfo.supportPaying === 1){

          this.merchantAddInfo.supportType = 2
          if(!this.merchantAddInfo.payRate) {
            this.merchantAddInfo.payRate = 0
          } else if (!this.merchantAddInfo.payFixedFee) {
            this.merchantAddInfo.payFixedFee = 0
          }

          if(!this.merchantAddInfo.collectionRate) {
            this.merchantAddInfo.collectionRate = 0
          } else if (!this.merchantAddInfo.payFixedFee) {
            this.merchantAddInfo.collectionFixedFee = 0
          }
        }
      //}
      this.merchantAddInfo.channelIds = this.merchantAddInfo.channelIds ? this.merchantAddInfo.channelIds : []
      this.$refs[form].validate(valid => {
        if (valid) {
          // 校验通过
          // request interface to create merchant
          if (this.dialogFlag === 'create') {
            this.editVerifyCode = ''
            this.verifyAction = 'create'
            this.editVerifyVisible = true
          } else if(this.dialogFlag === 'edit') {
            this.editVerifyCode = ''
            this.verifyAction = 'edit'
            this.editVerifyVisible = true
          }
        }
      })
    }
  },
  async mounted() {
    this._timeZoneListener = (event) => {
      this.timeZoneKey = event.detail || localStorage.getItem("timeZone") || "UTC+8";
    };
    window.addEventListener("timezone-change", this._timeZoneListener);

    await getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
        if (this.currencyOptions.length > 0) {
          this.currency = this.currencyOptions[0].currencyType
          this.filterbox.currency = this.currencyOptions[0].currencyType
          this.currencyIcons = {};
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
          title: this.$t('common.error'),
          message: this.$t('currencyTypeList.message.getFailed'),
          duration: 3000,
          type: 'error',
          position: 'bottom-right'
        })
      }
    })
    let roleName = localStorage.getItem('roleName')
    this.isAdmin = roleName === 'admin'
    if (roleName === 'merchant') {
      //filterData.merchantUserId = localStorage.getItem('userId')
      this.filterbox.merchantUserName = localStorage.getItem('userName')
      this.filterAvaiable = true
      if (this.filterbox.merchantUserName) {
        this.merchantAccountOptions = [{
          value: this.filterbox.merchantUserName,
          label: this.filterbox.merchantUserName
        }]
      }
    }
    await getAgentInfo({}).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        this.agentOptions = JSON.parse(res.data.data).agentInfoDtoList
        this.agentOptions.forEach(agent => {
          this.agentMaps[agent.agentNo] = agent.agentName
        })
      }
    })
    getChannelInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        const allData = JSON.parse(res.data.data).channelDtoList
        this.channelOptions = allData
        this.channelOptions.forEach(channel => {
          this.channelMaps[channel.channelId] = channel.channelName
        })
        this.search()
      } else {
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          message: this.$t('merchantInfo.message.getChannelFailed'),
          duration: 3000
        })
      }
    })

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
  .dialog-footer {
    display: flex;
    position: absolute;
    bottom: 5px;
    right: 10px;
  }

  .form{
    margin-top: 4%;
    height: 300px;
  }

  .main-toolform-input{
    width: 200px;
  }

  .merchantInfos{
    width: 98%;
    height: 700px;
    margin-top: 20px;
    margin-left: 2%;
  }


  .toolbarName{
    color: black;
  }

  .merchant-info-report {
    height: calc(100vh - 300px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .merchant-info-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .merchant-info-table-wrapper {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  .merchant-info-pagination {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }

  .merchant-info-add {
    align-self: flex-end;
    margin-bottom: 8px;
    padding: 4px 12px;
    height: 32px;
    line-height: 20px;
  }

  .account-info-wrap {
    text-align: left;
  }

  .account-info-key {
    background-color: #eef2ff;
    border-radius: 6px;
    padding: 2px 6px;
    display: inline-block;
    text-align: left;
  }

  .account-info-card {
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 8px 10px;
    margin-bottom: 8px;
  }

  .account-info-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 8px;
    border-radius: 6px;
    background-color: #eef2ff;
    color: #1f2937;
    font-weight: 700;
    cursor: pointer;
    user-select: none;
    width: fit-content;
    margin: 0 auto;
  }

  .account-info-more-icon{
    color: #1f2937;
    font-size: 14px;
  }

  .agent-info-card{
    margin-top: 6px;
    border-radius: 6px;
    padding: 4px 6px;
    box-shadow: 0 3px 8px rgba(24, 24, 24, 0.18);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    will-change: transform;
  }

  .agent-info-card:hover{
    transform: scale(1.03);
    box-shadow: 0 6px 16px rgba(24, 24, 24, 0.24);
  }

  .ip-whitelist-stack{
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
  }

  .ip-whitelist-card{
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 6px 8px;
    text-align: left;
    box-shadow: 0 2px 6px rgba(24, 24, 24, 0.08);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    will-change: transform;
  }

  .ip-whitelist-card:hover{
    transform: scale(1.03);
    box-shadow: 0 6px 14px rgba(24, 24, 24, 0.18);
  }

  .ip-whitelist-title{
    font-size: 12px;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 4px;
  }

  .ip-whitelist-value{
    font-size: 12px;
    color: #111827;
    line-height: 1.3;
    word-break: break-all;
  }

  .ip-whitelist-line{
    display: flex;
    gap: 6px;
    align-items: flex-start;
    margin-bottom: 4px;
  }

  .ip-whitelist-line:last-child{
    margin-bottom: 0;
  }

  .ip-label{
    color: #374151;
    white-space: nowrap;
  }

  .ip-list{
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .account-info-row{
    font-size: 15px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 4px;
  }

  .account-info-value{
    font-size: 20px;
  }

  .account-total{
    background-color: #e8f2ff;
  }

  .account-usable{
    background-color: #e9f6ee;
  }

  .account-frozen{
    background-color: #f0f2f5;
  }

  .secret-cell{
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    text-align: center;
  }

  .secret-row{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .secret-label{
    color: #374151;
    min-width: 56px;
    font-weight: 600;
  }

  .secret-value{
    color: #111827;
    flex: 1;
    word-break: break-all;
  }

  .merchant-basic-cell{
    text-align: left;
    line-height: 1.6;
    padding: 0 6px;
    word-break: normal;
  }

  .merchant-basic-row{
    padding: 4px 8px;
    border-radius: 4px;
    margin-top: 4px;
  }

  .merchant-basic-account{
    background-color: #e8f2ff;
  }

  .merchant-basic-name{
    background-color: #e9f6ee;
  }

  .merchant-basic-code{
    background-color: #f0f2f5;
    white-space: nowrap;
  }

  :deep(.el-switch.is-disabled .el-switch__core){
    background-color: #c0c4cc;
    border-color: #c0c4cc;
  }

  :deep(.el-switch.is-disabled.is-checked .el-switch__core){
    background-color: #07c160;
    border-color: #07c160;
  }

.agent-card-row{
  padding: 4px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.agent-card-account{
  background-color: #e8f2ff;
}

.agent-card-name{
  background-color: #e9f6ee;
}

.agent-card-channel{
  background-color: #f0f2f5;
}

.agent-fee-hint{
  margin-top: 6px;
  color: #b91c1c;
  font-size: 12px;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.agent-fee-icon{
  width: 12px;
  height: 12px;
  display: inline-block;
  vertical-align: middle;
  transform: translateY(-1px);
}

.agent-fee-text{
  display: inline-block;
  transform: translateY(1px);
}

.merchant-fee-card{
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 6px 8px;
  background: #f8fafc;
  text-align: left;
}

.merchant-fee-title{
  font-size: 12px;
  color: #606266;
  margin-right: 6px;
}

.merchant-fee-value{
  font-weight: 600;
  color: #303133;
  font-size: 13px;
}

.merchant-fee-row{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
}

.merchant-fee-row + .merchant-fee-row{
  margin-top: 6px;
}

</style>
