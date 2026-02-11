<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">{{ $t('withdrawlHistory.title') }}</div>
  <!--  <div style="display: flex;height: 12vh;justify-content: space-between;margin-right: 10%;margin-left: 10%;">
      <el-card style="width: 30%;height: 100%;margin-top: 2%;">
        <div style="display: flex;">
          <SvgIcon name="cash" width="100px" height="100px"/>
          <div style="display: flex; flex-direction: column;width: 80%;">
            <span class="reportLabel">总账户金额:</span>
            <textarea v-model="agentTotalAmount" disabled class="cash-text-area" style="text-align: right"></textarea>
          </div>
        </div>
      </el-card>
      <el-card style="width: 30%;height: 100%;margin-top: 2%;">
        <div style="display: flex;">
          <SvgIcon name="cash-freeze" width="100px" height="100px"/>
          <div style="display: flex; flex-direction: column;width: 80%;">
            <span class="reportLabel">冻结总金额:</span>
            <textarea v-model="agentFreezeAmount" disabled class="cash-text-area" style="text-align: right"></textarea>
          </div>
        </div>
      </el-card>
      <el-card style="width: 30%;height: 100%;margin-top: 2%;">
        <div style="display: flex;">
          <SvgIcon name="tixian" width="90px" height="90px"/>
          <div style="display: flex; flex-direction: column;width: 80%;">
            <span class="reportLabel">可用余额:</span>
            <textarea v-model="agentAvailableBalance" disabled class="cash-text-area" style="text-align: right"></textarea>
          </div>
        </div>
      </el-card>
    </div>-->
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
         <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="main-toolbar" style="height: auto;">
        <el-form class="main-toolform" style="height: 100%;display:flex;margin-left:3%" ref="filteboxForm"
                 :model="filterbox">
          <el-row>
            <el-col :span="7">
              <el-form-item :label="$t('withdrawlHistory.filter.createTime')" label-width="150px" prop="filterDateRange">
                <el-date-picker
                    v-model="filterbox.filterDateRange"
                    type="daterange"
                    :range-separator="$t('common.rangeSeparator')"
                    :start-placeholder="$t('common.startDate')"
                    :end-placeholder="$t('common.endDate')"
                    format="YYYY/MM/DD"
                    value-format="x"
                    clearable
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('withdrawlHistory.filter.walletAddr')" label-width="150px" prop="walletAddr">
                <el-input style="width: 200px" v-model="filterbox.walletAddr" :placeholder="$t('withdrawlHistory.placeholder.walletAddr')"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('withdrawlHistory.filter.agentName')" label-width="150px" prop="name">
                <div style="display: flex;flex-direction: row">
                  <el-input v-model="filterbox.name" clearable type="text" :placeholder="$t('withdrawlHistory.placeholder.agentName')" style="width:300px">
                  </el-input>
                  <el-button class="filterButton" @click="reset('filteboxForm')">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>{{ $t('common.reset') }}</div>
                  </el-button>
                  <el-button class="filterButton" @click="search">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>{{ $t('common.search') }}</div>
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
<!--          <div class="main-toolform-item" style="height: 100%;display: flex;justify-content: space-around;width: 100%">
            <div class="main-toolform-line">创建时间:
              <el-date-picker
                  v-model="filterbox.filterDateRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY/MM/DD HH:mm:ss"
                  value-format="x"
                  clearable
                  style="width: 100px;height: 70%"
                  class="main-toolform-input"
              >
              </el-date-picker>
            </div>
            <div class="main-toolform-line">收款账号地址:
              <el-input v-model="filterbox.walletAddr" placeholder="收款账号地址" class="main-toolform-input"/>
            </div>
            <div class="main-toolform-line">代理名称:
              <el-input v-model="filterbox.name" clearable type="text" class="main-toolform-input"
                        placeholder="代理名称">
                <template #append>
                  <el-button class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>搜索</div>
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>-->
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="reportInfo">
    <div style="display: flex;justify-content: right;">
<!--      <el-button @click="exportAgentStatement()" class="filterButton">
        <SvgIcon class="filterButtonSvg" name="export"/>
        导出
      </el-button>-->
      <el-button @click="addWithdrawlAccount" class="filterButton">
        <SvgIcon name="add" class="filterButtonSvg"/>
        {{ $t('withdrawlHistory.action.addAccount') }}
      </el-button>
      <el-button @click="createWithdrawlApply" class="filterButton">
        <SvgIcon name="withdrawl" class="filterButtonSvg"/>
        {{ $t('withdrawlHistory.action.withdrawApply') }}
      </el-button>
      <el-button @click="createManualAccountAdjustment" class="filterButton">
        <template #icon>
          <div style="width: 100%">
            <SvgIcon class="filterButtonSvg" name="manualaccountadjustment"/>
          </div>
        </template>
        <div>{{ $t('withdrawlHistory.action.manualAdjust') }}</div>
      </el-button>
    </div>
    <form class="main-views-form" style="height: 100%">
      <el-table
          border :data="withdrawAccountData"
          class="agentAccountTable"
          style="height: auto;"
          :key="tableKey"
      >
        <el-table-column
            v-slot="{row}"
            :label="$t('withdrawlHistory.column.agentName')"
            align="center"
        >
          <div>{{ row.name }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            :label="$t('withdrawlHistory.column.agentAccount')"
            align="center"
        >
          <div>{{ row.userName }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            :label="$t('withdrawlHistory.column.walletName')"
            align="center"
        >
          <div>{{ row.walletName }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            :label="$t('withdrawlHistory.column.walletAddr')"
            align="center"
        >
          <div>{{ row.walletAddr }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            :label="$t('withdrawlHistory.column.status')"
            align="center"
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
            />
          </div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            :label="$t('withdrawlHistory.column.createTime')"
            align="center"
        >
          <div>{{ formatTimeByZone(row.createTime) }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            :label="$t('withdrawlHistory.column.creator')"
            align="center"
        >
          <div>{{ row.createBy }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            :label="$t('common.operation')"
            align="center"
        >
          <el-dropdown trigger="click">
            <SvgIcon name="more" width="30" height="30"/>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editAgentAccount(row)">{{ $t('common.edit') }}</el-dropdown-item>
                <el-dropdown-item v-if="row.status === 0" @click="startAgentAccount(row)">{{ $t('common.enable') }}</el-dropdown-item>
                <el-dropdown-item v-if="row.status === 1" @click="stopAgentAccount(row)">{{ $t('common.disable') }}</el-dropdown-item>
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
         
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      >
      </el-pagination>
    </form>
  </div>

  <el-dialog
      :title="createAccountTitle"
      v-model="createAccountVisible"
      class="dialog"
      center="true"
      width="40%"
      style="height:400px;"
  >
    <el-form ref="createAccountForm" :model="createAgentAccountModel" :rules="createAccountRules"
             style="margin-top: 8%;">
      <el-col v-if="dialogType === 'create'" :span="24" class="addDialog">
        <el-form-item
            :label="$t('withdrawlHistory.form.agentName')"
            label-width="150px"
            prop="merchantAgentId"
        >
          <!--            <el-input style="width: 200px" v-model="createAgentAccountModel.agentName"/>-->
          <el-select
              v-model="createAgentAccountModel.merchantAgentId"
              :options="agentOptions"
              :props="agentProps"
              style="width: 200px"
              :placeholder="$t('withdrawlHistory.placeholder.agentSelect')"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="dialogType !== 'start' && dialogType !== 'stop'" :span="24" class="addDialog">
        <el-form-item
            :label="$t('withdrawlHistory.form.walletName')"
            label-width="150px"
            prop="walletName"
        >
          <el-input style="width: 200px" v-model="createAgentAccountModel.walletName"/>
        </el-form-item>
      </el-col>
      <el-col v-if="dialogType !== 'start' && dialogType !== 'stop'" :span="24" class="addDialog">
        <el-form-item
            :label="$t('withdrawlHistory.form.walletAddr')"
            label-width="150px"
            prop="walletAddr"
        >
          <el-input style="width: 200px" v-model="createAgentAccountModel.walletAddr"/>
        </el-form-item>
      </el-col>
      <el-col v-if="dialogType !== 'start' && dialogType !== 'stop'" :span="24" class="addDialog">
        <el-form-item
            :label="$t('withdrawlHistory.form.status')"
            label-width="150px"
            prop="walletName"
        >
          <el-switch
              v-model="createAgentAccountModel.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="$t('common.enable')"
              :inactive-text="$t('common.close')"
              :active-value="1"
              :inactive-value="0"
              style="width: 200px"
          >

          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="addDialog"></el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog('createAccountForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submit('createAccountForm')">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
  <el-dialog
      :title="accountGoogleTitle"
      v-model="accountGoogleVisible"
      class="dialog"
      center
      width="30%"
      height="200px"
  >
    <el-form ref="accountGoogleForm" :rules="accountGoogleRule" :model="accountGoogleData" style="height:100px;margin-top: 20px">
      <el-row>
        <el-col :span="24" style="display: flex;justify-content: center;justify-items: center;align-items: center;">
          <div>
            <el-form-item :label="$t('common.googleCode')" label-width="150px" prop="googleCode">
              <el-input v-model="accountGoogleData.googleCode" style="width: 200px"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-right: 3%;height: 30px;">
      <el-button @click="cancelAccountGoogle('accountGoogleForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitAccountGoogle('accountGoogleForm')">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
  <!-- withdraw dialog -->
  <el-dialog
      :title="dialogWithdrawTitle"
      v-model="dialogWithdrawVisible"
      class="dialog"
      center
      width="50%"
      height="50%"
  >
    <el-form :model="withdrawOrderInfo" label-width="100%" class="form" ref="withdrawOrderInfoForm"
             :rules="withdrawOrderRule">
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlHistory.form.agentName')" label-width="150px" prop="merchantAgentId">
          <el-select
              :options="agentOptions"
              :props="agentProps"
              style="width: 200px"
              v-model="withdrawOrderInfo.merchantAgentId"
              @change="handleAgentChange"
              :disabled="filterAvaiable"
          >
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('common.currency')" label-width="150px" prop="availableAmount">
          <el-select v-model="withdrawOrderInfo.currency" style="width: 200px"
                     :options="currencyOptions"
                     :props="currencyProps"
                     @change="handleWithdrawCurrencyChange"
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlHistory.form.availableAmount')" label-width="150px" prop="availableAmount">
          <el-input disabled v-model="withdrawOrderInfo.availableAmount" style="width: 200px"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlHistory.form.walletAddr')" label-width="150px" prop="walletAddr">
          <el-select
              v-model="withdrawOrderInfo.walletAddr"
              style="width: 200px"
              :options="selectedAgentOptions"
              :props="agentWalletProps"
              filterable
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlHistory.form.amount')" label-width="150px" prop="amount">
          <el-input type="number" v-model="withdrawOrderInfo.amount" style="width: 200px"/>
        </el-form-item>
      </div>
      <!--      <div class="el-form-line">
              <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
                <el-input v-model="withdrawOrderInfo.googleCode" style="width: 200px"/>
              </el-form-item>
            </div>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelWithdraw('withdrawOrderInfoForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitWithdraw('withdrawOrderInfoForm')">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
  <el-dialog
      :title="dialogManualAccountAdjustmentTitle"
      v-model="dialogManualAccountAdjustmentVisible"
      class="dialog"
      center
      width="40%"
      height="50%"
  >
    <el-form
        ref="manualAccountAdjustmentOrderInfoForm"
        :model="manualAccountAdjustmentOrderInfo"
        class="form"
        :rules="dialogManualAccountAdjustmentRule"
        style="margin-right: 5%;margin-top: 60px"
    >
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlHistory.form.agentName')" label-width="150px" prop="merchantAgentId">
          <el-select
              :options="agentOptions"
              :props="agentProps"
              v-model="manualAccountAdjustmentOrderInfo.merchantAgentId"
              @change="handleAdjustAgentChange"
              style="width: 200px"
              :disabled="filterAvaiable"
          >
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.currency')" label-width="150px" prop="currency">
          <el-select v-model="manualAccountAdjustmentOrderInfo.currency" style="width: 200px"
                     :options="currencyOptions"
                     :props="currencyProps"
                     @change="handleAdjustCurrencyChange"
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.totalAmount')" label-width="150px" prop="total">
          <el-input disabled v-model="manualAccountAdjustmentOrderInfo.total" style="width: 200px"/>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.adjustMode')" label-width="150px" prop="type">
          <el-switch
              v-model="manualAccountAdjustmentOrderInfo.type"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="$t('withdrawlAccount.adjust.increase')"
              :inactive-text="$t('withdrawlAccount.adjust.decrease')"
              :active-value="1"
              :inactive-value="0"
              :class="manualAccountAdjustmentOrderInfo.type === 1 ? 'adjust-switch-inc' : 'adjust-switch-dec'"
              style="width: 200px"
          >
          </el-switch>
        </el-form-item>

      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.adjustAmount')" label-width="150px" prop="amount">
          <el-input type="number" v-model="manualAccountAdjustmentOrderInfo.amount" style="width: 200px"/>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelManualAccountAdjustment('manualAccountAdjustmentOrderInfoForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitManualAccountAdjustment('manualAccountAdjustmentOrderInfoForm')">{{ $t('common.confirm') }}
      </el-button>
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
      <el-button type="primary" @click="submitConfirm('confirmDataForm')">{{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createAgentAccountInfo, createStatementeOrderApply, exportAgentAccount, exportMerchantAccount,
  getAgentAccountInfo, getAgentInfo,
  getAllCurrencyType, getMerchantAccount, getMerchantInfo, modifyAgentAccountInfo,
  modifyAgentInfo
} from "@/api/interface/backendInterface.js";
import {exportExcel, getAgentAccountTitle, getFormateTime, getMerchantAccountTitle, loadingBody} from "@/api/common.js";
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const AGENT_ACCOUNT_DRAFT_KEY = 'draft:WithdrawlHistory:agentAccount';
const WITHDRAW_ORDER_DRAFT_KEY = 'draft:WithdrawlHistory:withdrawOrder';
const buildEmptyAgentAccountModel = () => ({
  merchantAgentId: '',
  walletAddr: '',
  walletName: '',
  status: 1,
  userName: ''
});
const buildEmptyWithdrawOrderInfo = () => ({
  merchantAgentId: '',
  currency: null,
  availableAmount: null,
  walletAddr: '',
  amount: null,
  googleCode: '',
  orderType: 2
});

export default {
  name: 'WithdrawlHistory',
  data() {

    const amountValidate = (rule, value, callback) => {
      if (!value || value === 0) {
        callback(new Error(this.$t('withdrawlHistory.validation.amountRequired')));
      } else if (value > this.withdrawOrderInfo.availableAmount) {
        callback(new Error(this.$t('withdrawlHistory.validation.amountExceed')));
      } else {
        callback();
      }
    }
    return {
      selectedAgentOptions: [],
      selectedAgentBalance: {},
      amountInfo: {},
      filterAvaiable: false,
      timeZoneKey: localStorage.getItem("timeZone") || "UTC+8",
      withdrawOrderInfo: buildEmptyWithdrawOrderInfo(),
      agentAccountOptions: [],
      agentAccountProps: {
        value: 'merchantAgentId',
        label: 'name',
      },
      agentWalletProps: {
        value: 'walletAddr',
        label: 'walletAddr',
      },
      dialogWithdrawVisible: false,
      dialogWithdrawTitle: '',
      dialogManualAccountAdjustmentVisible: false,
      dialogManualAccountAdjustmentTitle: '',
      manualAccountAdjustmentOrderInfo: {},
      tableKey: 0,
      activeTool: '1',
      agentOptions: [],
      agentProps: {
        label: 'agentName',
        value: 'userId'
      },
      submitType: '',
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      currencyMaps: {},
      dialogType: "",
      filterbox: {
        agentName: '',
      },
      createAccountTitle: '',
      createAccountVisible: false,
      withdrawAccountData: [],
      createAgentAccountModel: buildEmptyAgentAccountModel(),
      accountGoogleVisible: false,
      accountGoogleTitle: '',
      accountGoogleData: {
        googleCode: ''
      },
      confirmDialogVisible: false,
      confirmDialogTitle: '',
      confirmData: {
        googleCode: ''
      },
      accountSubmitType: '',
      agentTotalAmount: '10',
      agentAvailableBalance: '0.1',
      agentFreezeAmount: '9.9',
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 200],
      createAccountRules: {
        merchantAgentId: {
          required: true, message: this.$t('withdrawlHistory.validation.agentRequired'), trigger: 'blur'
        },
        walletAddr: {
          required: true, message: this.$t('withdrawlHistory.validation.walletAddrRequired'), trigger: 'blur'
        },
        walletName: {
          required: true, message: this.$t('withdrawlHistory.validation.walletNameRequired'), trigger: 'blur'
        }
      },
      accountGoogleRule: {
        googleCode: {
          required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur'
        }
      },
      confirmRule: {
        googleCode: {
          required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur'
        }
      },
      withdrawOrderRule: {
        merchantAgentId: {
          required: true, trigger: 'blur',
        },
        walletAddr: {
          required: true, trigger: 'blur'
        },
        amount: {
          required: true, trigger: 'blur', validator: amountValidate
        },
        availableAmount: {
          required: true, trigger: 'blur'
        }
        /* googleCode: {
           required: true, trigger: 'blur'
         }*/
      },
      dialogManualAccountAdjustmentRule: {
        merchantAgentId: {
          required: true, trigger: 'blur', message: this.$t('withdrawlHistory.validation.agentRequired')
        },
        amount: {
          required: true, trigger: 'blur', message: this.$t('withdrawlHistory.validation.amountRequired')
        },
        currency: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.currencyRequired')
        }
      },
    }
  },
  watch: {
    createAccountVisible(visible) {
      if (visible) {
        this.loadAgentAccountDraft();
      }
    },
    dialogWithdrawVisible(visible) {
      if (visible) {
        this.loadWithdrawOrderDraft();
      }
    },
    createAgentAccountModel: {
      deep: true,
      handler() {
        this.saveAgentAccountDraft();
      }
    },
    withdrawOrderInfo: {
      deep: true,
      handler() {
        this.saveWithdrawOrderDraft();
      }
    }
  },
  methods: {
    saveAgentAccountDraft() {
      if (!this.createAccountVisible) return;
      const mode = this.submitType || '';
      const recordId = this.createAgentAccountModel?.merchantAgentId || this.createAgentAccountModel?.userId || '';
      saveDraft(AGENT_ACCOUNT_DRAFT_KEY, { mode, recordId, data: this.createAgentAccountModel || {} });
    },
    loadAgentAccountDraft() {
      const draft = loadDraft(AGENT_ACCOUNT_DRAFT_KEY);
      if (!draft || !draft.data) return;
      const mode = this.submitType || '';
      if (draft.mode && mode && draft.mode !== mode) return;
      if (mode === 'edit') {
        const recordId = this.createAgentAccountModel?.merchantAgentId || this.createAgentAccountModel?.userId || '';
        if (draft.recordId && recordId && draft.recordId !== recordId) return;
      }
      this.createAgentAccountModel = Object.assign(buildEmptyAgentAccountModel(), draft.data || {});
    },
    clearAgentAccountDraft() {
      clearDraft(AGENT_ACCOUNT_DRAFT_KEY);
    },
    saveWithdrawOrderDraft() {
      if (!this.dialogWithdrawVisible) return;
      saveDraft(WITHDRAW_ORDER_DRAFT_KEY, { data: this.withdrawOrderInfo || {} });
    },
    loadWithdrawOrderDraft() {
      const draft = loadDraft(WITHDRAW_ORDER_DRAFT_KEY);
      if (!draft || !draft.data) return;
      this.withdrawOrderInfo = Object.assign(buildEmptyWithdrawOrderInfo(), draft.data || {});
    },
    clearWithdrawOrderDraft() {
      clearDraft(WITHDRAW_ORDER_DRAFT_KEY);
    },
    formatTimeByZone(ts) {
      const match = /UTC([+-])(\d{1,2})(?::(\d{2}))?/.exec(this.timeZoneKey);
      const baseMillis = ts * 1000;
      if (!match) {
        return getFormateDate(ts);
      }
      const sign = match[1] === "-" ? -1 : 1;
      const hours = Number(match[2]);
      const minutes = Number(match[3] || "0");
      const offsetMinutes = sign * (hours * 60 + minutes);
      const zoned = new Date(baseMillis + offsetMinutes * 60000);
      const year = zoned.getFullYear();
      const month = String(zoned.getMonth() + 1).padStart(2, '0');
      const day = String(zoned.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    reset(form) {
      this.$refs[form].resetFields();
    },
    resetCreateAccountForm() {
      this.createAgentAccountModel = {
        merchantAgentId: '',
        walletName: '',
        walletAddr: '',
        status: 1
      }
    },
    resetAccountGoogleForm() {
      this.accountGoogleData = {
        googleCode: ''
      }
      this.accountSubmitType = ''
    },
    exportAgentStatement() {
      this.filterbox.columns = getAgentAccountTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
      }
      exportAgentAccount(this.filterbox).then(async res => {
        //const fileName = this.$t('exportPaymentReportName') + getFormateTime()
        const fileName = this.$t('withdrawlHistory.exportName') + getFormateTime()
        await exportExcel(res, fileName, this)
      })
    },
    handleAgentChange(value) {
      let opt = [];
      this.agentAccountOptions.find((item) => {
        //return item.merchantAgentId === value;
        if (item.merchantAgentId === value) {
          opt.push(item);
        }
      });
      this.withdrawOrderInfo.merchantAgentName = opt[0].name;
      //this.withdrawOrderInfo.walletAddr = opt.walletAddr;
      //this.agentAccountOptions = Object.assign([], opt)
      this.selectedAgentBalance = this.amountInfo[value]
      this.agentAccountOptions.forEach(item => {
        if (item.merchantAgentId === value) {
          this.selectedAgentOptions.push(item);
        }
      })
    },
    search() {
      this.filterbox.isNeedCardData = true
      if(this.filterbox.filterDateRange) {
        this.filterbox.startTime = this.filterbox.filterDateRange[0]/1000
        this.filterbox.endTime = this.filterbox.filterDateRange[1]/1000
      }
      const loadingInstance = loadingBody(this, 'agentAccountTable')
      this.updateAgentAccount(loadingInstance)
      /*getAgentAccountInfo(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.withdrawAccountData = allData.withdrawalAccountsDtoList;
          this.agentAccountOptions = allData.withdrawalAccountsDtoList
          this.totalCount = allData.totalNumber
          this.pageNo = allData.pageNo
          this.pageSize = allData.pageSize
          this.tableKey++

          /!*if(allData.cardInfo) {
            const cardInfo = allData.cardInfo[this.filterbox.currency]
            this.agentTotalAmount = cardInfo.total
            this.agentFreezeAmount = cardInfo.frozen
            this.agentAvailableBalance = cardInfo.withdraw
          } else {
            this.agentTotalAmount =  this.currencyIcons[this.currency] + 0
            this.agentFreezeAmount = this.currencyIcons[this.currency] + 0
            this.agentAvailableBalance = this.currencyIcons[this.currency] + 0
          }*!/

        } else if (res.status === 200 && res.data.code !== 0) {
          this.$notify({
            title: 'Error',
            message: res.data.message,
            duration: 3000,
            position: 'bottom-right',
            type: 'error'
          })
        } else {
          this.$notify({
            title: 'Error',
            message: 'something went wrong!',
            duration: 3000,
            position: 'bottom-right',
            type: 'error'
          })
        }
        loadingInstance.close()
      }).catch((err) => {
        loadingInstance.close()
        this.$notify({
          title: 'Error',
          message: err.message,
          duration: 3000,
          position: 'bottom-right',
          type: 'error'
        })
      })*/
    },
    addWithdrawlAccount() {
      this.resetCreateAccountForm()
      this.createAccountVisible = true
      this.createAccountTitle = this.$t('withdrawlHistory.dialog.addTitle')
      this.dialogType = 'create'
      this.submitType = 'create'
      this.loadAgentAccountDraft()
    },
    createWithdrawlApply() {
// set withdraw merchant
      if(this.roleName === 'merchant') {
        const merchantInfo = this.merchantAccountOptions[0]
        this.withdrawOrderInfo.merchantAgentId = merchantInfo.merchantAgentId
        this.handleMerchantChange(this.withdrawOrderInfo.merchantAgentId)
      }
      this.dialogWithdrawVisible = true
      this.dialogWithdrawTitle = this.$t('withdrawlHistory.dialog.withdrawTitle')
      this.withdrawOrderInfo.orderType = 2
      this.loadWithdrawOrderDraft()
    },
    createManualAccountAdjustment() {
      this.manualAccountAdjustmentOrderInfo = {
        merchantAgentId: '',
        merchantAgentName: '',
        currency: null,
        total: null,
        amount: null,
        type: 1,
        orderType: 3
      }
      this.dialogManualAccountAdjustmentVisible = true
      this.dialogManualAccountAdjustmentTitle = this.$t('withdrawlAccount.dialog.manualAdjustTitle')
    },
    editAgentAccount(row) {
      this.createAgentAccountModel = Object.assign({}, row)
      this.createAccountVisible = true
      this.createAccountTitle = this.$t('withdrawlHistory.dialog.editTitle')
      this.submitType = 'edit'
      this.loadAgentAccountDraft()
    },
    startAgentAccount(row) {
      this.createAgentAccountModel = Object.assign({}, row)
      this.createAgentAccountModel.status = 1
      this.dialogType = 'start'
      this.createAccountVisible = true
      this.createAccountTitle = this.$t('withdrawlHistory.dialog.enableTitle')
      this.submitType = 'edit'
      this.loadAgentAccountDraft()
    },
    stopAgentAccount(row) {
      this.createAgentAccountModel = Object.assign({}, row)
      this.createAgentAccountModel.status = 0
      this.dialogType = 'start'
      this.createAccountVisible = true
      this.createAccountTitle = this.$t('withdrawlHistory.dialog.disableTitle')
      this.submitType = 'edit'
      this.loadAgentAccountDraft()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.filterbox.pageSize = pageSize;
      this.filterbox.pageNo = 1;
      this.search()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.pageSize;
      this.search()
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.accountSubmitType = this.submitType === 'create' ? 'create' : 'modify'
          this.createAccountVisible = false
          this.accountGoogleTitle = this.$t('withdrawlHistory.dialog.confirmTitle')
          this.accountGoogleVisible = true
        }
      })
    },
    cancelDialog(form) {
      this.$refs[form].resetFields();
      this.resetCreateAccountForm()
      this.createAccountVisible = false
      this.createAccountTitle = ''
      this.dialogType = ''
      this.submitType = ''
      this.clearAgentAccountDraft()
    },
    cancelAccountGoogle(form) {
      this.$refs[form].resetFields();
      this.resetAccountGoogleForm()
      this.resetCreateAccountForm()
      this.accountGoogleVisible = false
      this.accountGoogleTitle = ''
      this.createAccountTitle = ''
      this.dialogType = ''
      this.submitType = ''
    },
    handleWithdrawCurrencyChange(val) {
      let opt = {}
      this.selectedAgentBalance ?  opt = this.selectedAgentBalance[val] : opt = null
      opt ? this.withdrawOrderInfo.availableAmount = opt.available : this.withdrawOrderInfo.availableAmount = 0
    },
    cancelWithdraw(form) {
      this.$refs[form].resetFields()
      this.dialogWithdrawTitle = ''
      this.dialogWithdrawVisible = false
      this.updateAgentAccount(null)
      this.clearWithdrawOrderDraft()
    },
    cancelManualAccountAdjustment(form) {
      this.$refs[form].resetFields()
      this.dialogManualAccountAdjustmentVisible = false
      this.dialogManualAccountAdjustmentTitle = ''
    },
    submitWithdraw(form) {
      this.$refs[form].validate(validate => {
        if (validate) {
          this.dialogWithdrawVisible = false
          this.dialogWithdrawTitle = ''
          this.confirmData =  Object.assign({}, this.withdrawOrderInfo)
          this.confirmDialogTitle = this.$t('withdrawlHistory.dialog.confirmTitle')
          this.confirmDialogVisible = true
          this.$refs[form].resetFields()
        }
      })
    },
    submitConfirm(form) {
      const orderMessageKey = this.confirmData.orderType === 1
        ? 'withdrawlHistory.orderType.recharge'
        : this.confirmData.orderType === 2
          ? 'withdrawlHistory.orderType.withdraw'
          : 'withdrawlHistory.orderType.manualAdjust'
      const orderMessage = this.$t(orderMessageKey)
      this.$refs[form].validate(validate => {
        if (validate) {
          createStatementeOrderApply(this.confirmData).then(res => {
            this.confirmDialogTitle=''
            this.confirmDialogVisible = false
            if (res.status === 200 && res.data.code === 0) {
              this.$refs[form].resetFields()
              if (this.confirmData.orderType === 3) {
                this.$refs.manualAccountAdjustmentOrderInfoForm?.resetFields()
                this.getNewstAgentInfo()
              }
              if (this.confirmData.orderType === 2) {
                this.clearWithdrawOrderDraft()
              }
              this.$notify({
                title: this.$t('common.success'),
                type: 'success',
                message: this.$t('withdrawlHistory.message.orderCreateSuccess', { type: orderMessage }),
                duration: 3000,
                position: 'bottom-right'
              })
              this.search()
              this.getNewstMerchantInfo()
            } else if (res.status === 200 && res.data.code !== 0) {
              this.$notify({
                title: this.$t('common.error'),
                type: 'error',
                message: res.data.message,
                duration: 3000,
                position: 'bottom-right'
              })
            } else {
              this.$notify({
                title: this.$t('common.error'),
                type: 'error',
                message: this.$t('common.requestFailed'),
                duration: 3000,
                position: 'bottom-right'
              })
            }
          })
        }
      })
    },
    submitAccountGoogle(form) {
      this.$refs[form].validate(validate => {
        if (!validate) {
          return
        }
        const payload = Object.assign({}, this.createAgentAccountModel, {
          googleCode: this.accountGoogleData.googleCode
        })
        const request = this.accountSubmitType === 'create'
          ? createAgentAccountInfo(payload)
          : modifyAgentAccountInfo(payload)
        request.then(res => {
          this.accountGoogleTitle = ''
          this.accountGoogleVisible = false
          if (res.status === 200 && res.data.code === 0) {
            this.$refs[form].resetFields()
            this.resetAccountGoogleForm()
            this.resetCreateAccountForm()
            this.createAccountTitle = ''
            this.dialogType = ''
            this.submitType = ''
            this.clearAgentAccountDraft()
            this.search()
            this.$notify({
              title: this.$t('common.success'),
              message: this.accountSubmitType === 'create'
                ? this.$t('withdrawlHistory.message.createSuccess')
                : this.$t('withdrawlHistory.message.updateSuccess'),
              duration: 3000,
              position: 'bottom-right',
              type: 'success'
            })
          } else if (res.status === 200 && res.data.code !== 0) {
            this.$notify({
              title: this.$t('common.error'),
              message: res.data.message,
              duration: 3000,
              position: 'bottom-right',
              type: 'error'
            })
          } else {
            this.$notify({
              title: this.$t('common.error'),
              message: this.$t('common.requestFailed'),
              duration: 3000,
              position: 'bottom-right',
              type: 'error'
            })
          }
        })
      })
    },
    updateAgentAccount(loadingInstance) {
      getAgentAccountInfo(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.withdrawAccountData = allData.withdrawalAccountsDtoList;
          this.agentAccountOptions = allData.withdrawalAccountsDtoList
          this.totalCount = allData.totalNumber
          this.pageNo = allData.pageNo
          this.pageSize = allData.pageSize
          this.tableKey++
        } else if (res.status === 200 && res.data.code !== 0) {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            message: res.data.message,
            duration: 3000,
            position: "bottom-right"
          })
        } else {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            message: this.$t('common.requestFailed'),
            duration: 3000,
            position: "bottom-right"
          })
        }
        loadingInstance !== null ? loadingInstance.close() : ''
      }).catch(err => {
        loadingInstance !== null ? loadingInstance.close() : ''
        this.$notify({
          title: this.$t('common.error'),
          type: 'error',
          message: err.message,
          duration: 3000,
          position: "bottom-right"
        })
      })
    },
    submitManualAccountAdjustment(form) {
      this.$refs[form].validate(validate => {
        if (validate) {
          const rawAmount = Number(this.manualAccountAdjustmentOrderInfo.amount || 0)
          if (this.manualAccountAdjustmentOrderInfo.type === 0) {
            this.manualAccountAdjustmentOrderInfo.amount = rawAmount === 0 ? 0 : -Math.abs(rawAmount)
          } else {
            this.manualAccountAdjustmentOrderInfo.amount = Math.abs(rawAmount)
          }
          this.dialogManualAccountAdjustmentVisible = false
          this.dialogManualAccountAdjustmentTitle = ''
          this.confirmData = Object.assign({}, this.manualAccountAdjustmentOrderInfo)
          this.confirmDialogTitle = this.$t('withdrawlHistory.dialog.confirmTitle')
          this.confirmDialogVisible = true
        }
      })
    },
    handleAdjustAgentChange(value) {
      this.manualAccountAdjustmentOrderInfo.currency = null
      this.manualAccountAdjustmentOrderInfo.total = null
      let opt = [];
      this.agentAccountOptions.find((item) => {
        if (item.merchantAgentId === value) {
          opt.push(item);
        }
      });
      this.manualAccountAdjustmentOrderInfo.merchantAgentName = opt.length > 0 ? opt[0].name : null;
      this.manualAccountAdjustmentOrderInfo.merchantAgentId = opt.length > 0 ? opt[0].merchantAgentId : null;
      this.selectedAgentBalance = this.amountInfo[value]
    },
    handleAdjustCurrencyChange(val) {
      const opt = this.selectedAgentBalance?.[val] ?? {};
      if (opt) {
        this.manualAccountAdjustmentOrderInfo.total = opt.available ? opt.available : 0;
      } else {
        this.manualAccountAdjustmentOrderInfo.total = 0
      }
    },
    getNewstAgentInfo() {
      getAgentInfo({merchantUserName: this.filterbox.name, isNeedCardData: true}).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.agentOptions = allData.agentInfoDtoList
          console.log(JSON.stringify(this.agentOptions))
          this.agentOptions.forEach(item => {
            this.amountInfo[item.userId] = item.balanceInfo
          })
        }
      })
    }
  },
  async mounted() {
    this.roleName = localStorage.getItem("roleName")
    this.filterbox.name = this.roleName=== 'agent'? localStorage.getItem('userName') : null
    this.filterAvaiable = this.roleName === 'agent'? true : false
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
          title: this.$t('common.failed'),
          message: this.$t('currencyTypeList.message.getFailed'),
          duration: 3000,
          type: 'error',
          position: 'bottom-right'
        })
      }
    })

    this.getNewstAgentInfo()
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
@import "@/api/common.css";
@import "@/assets/base.css";

.cash-text-area {
  width: 90%;
  height: 100%;
  background-color: transparent;
  border: none;
  resize: none;
  font-size: xx-large;
}

.reportLabel {
  font-size: x-large;
  text-align: right;
}

.main-toolform-input {
  width: 300px;
  display: flex;
  align-content: center;
}

:deep() .el-input__inner {
  text-align: center;
}

:deep(.el-select .el-input__inner),
:deep(.el-select .el-select__selected-item) {
  text-align: center;
}

.addDialog {
  display: flex;
  justify-content: center;
  justify-items: center;
}

.dialog-footer {
  display: flex;
  float: right;
}

.form {
  margin-top: 3%;
  height: 300px;
}

.el-form-line {
  display: flex;
  justify-content: center;
}

input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

:deep(.adjust-switch-inc .el-switch__label--right) {
  color: #16a34a;
}

:deep(.adjust-switch-inc .el-switch__label--left) {
  color: #9ca3af;
}

:deep(.adjust-switch-dec .el-switch__label--left) {
  color: #16a34a;
}

:deep(.adjust-switch-dec .el-switch__label--right) {
  color: #9ca3af;
}
</style>
