<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate, getFormateTimeByTimeBystamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">{{ $t('withdrawlAccount.title') }}</div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
         <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <el-row style="display: flex;justify-content: space-around;">
            <el-form-item :label="$t('withdrawlAccount.filter.account')" label-width="150px" prop="name">
              <el-input style="width: 200px" v-model="filterbox.name" :placeholder="$t('withdrawlAccount.placeholder.account')" :disabled="filterAvaiable"/>
<!--              <el-select
                :option="merchantAccountOptions"
                :props="merchantAccountProps"
                v-model="filterbox.name"
                filterable
                clearable/>-->
            </el-form-item>
            <el-form-item :label="$t('withdrawlAccount.filter.walletName')" label-width="150px" prop="walletAddr">
<!--              <el-input style="width: 200px" v-model="filterbox.walletAddr" placeholder="收款账号"/>-->
              <el-select
                :options="merchantAccountOptions"
                :props="merchantWalletProps"
                v-model="filterbox.walletAddr"
                style="width: 200px"
                clearable
                filterable
              >

              </el-select>
            </el-form-item>
            <el-form-item :label="$t('withdrawlAccount.filter.createTime')" label-width="150px" prop="filterDateRange">
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
              <div style="display: flex;flex-direction: row;">
                <el-button @click="reset('filterboxForm')"
                     class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="reset"/>
                  <div>{{ $t('common.reset') }}</div>
                </el-button>
                <el-button @click="search()"
                     class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="search"/>
                  <div>{{ $t('common.query') }}</div>
                </el-button>
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="reportInfo">
    <!--
     商户展示为一条 提现账户展示多条
     客服/管理员展示所有商户下的所有账号
     -->
    <form>
      <div style="display: flex;flex-direction: row;float: right">
        <el-button @click="addWithdrawlAccount()" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="add"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">{{ $t('common.operate.add') }}</div>
        </el-button>
        <el-button @click="createWithdrawOrder" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="withdrawl"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">{{ $t('withdrawlAccount.action.withdraw') }}</div>
        </el-button>
        <el-button @click="createRechargeOrder" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="recharge"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">{{ $t('withdrawlAccount.action.recharge') }}</div>
        </el-button>
        <el-button v-if="roleName=== 'admin'" @click="createManualAccountAdjustment" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="manualaccountadjustment"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">{{ $t('withdrawlAccount.action.manualAdjust') }}</div>
        </el-button>
      </div>
      <el-table
          border :data="withdrawAccountFormData"
          class="merchantInfos-table"
          style="width: 100%;height: 60%;"
      >
        <el-table-column
            prop="商户名称"
            :label="$t('withdrawlAccount.column.merchantName')"
            v-slot="{row}"
            align="center"
            style="height: 100%;"
        >
          <div>
            {{ row.name }}
          </div>
        </el-table-column>
        <el-table-column
            :label="$t('withdrawlAccount.column.merchantAccount')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ row.userName }}
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantWithdrawAccount"
            :label="$t('withdrawlAccount.column.walletName')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ row.walletName }}
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantWithdrawAccount"
            :label="$t('withdrawlAccount.column.walletAddr')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ row.walletAddr }}
          </div>
        </el-table-column>
        <el-table-column
            prop="createTime"
            :label="$t('withdrawlAccount.column.createTime')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ getFormateDate(row.createTime) }}
          </div>
        </el-table-column>
        <el-table-column
            prop="accountUseTime"
            :label="$t('withdrawlAccount.column.status')"
            v-slot="{row}"
            align="center"
        >
          <div>
            <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.disable')"
                :inactive-value="0"
                :active-value="1"
                disabled>
            </el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="createBy"
            :label="$t('withdrawlAccount.column.creator')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ row.createBy }}
          </div>
        </el-table-column>
        <el-table-column
            prop="operate"
            :label="$t('common.operation')"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div style="display: flex;align-items: center;justify-content: center;">
            <el-button class="filterButton" @click.prevent="editMerchantInfo(row)">{{ $t('common.edit') }}</el-button>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination class="pageTool"
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


  <el-dialog
      :title="dialogTitle"
      v-model="dialogFormVisible"
      class="dialog"
      center
      width="40%"
      height="50%"
  >
    <!--
      客服：各列信息由后端返回列表，前端页面下拉选择
      商户：后端返回单列表，下拉结果回显
     -->
    <el-form :model="withdrawAccountInfo" label-width="100%" class="form" ref="createMerchantAccountForm"
             :rules="merchantAccountRule">
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.merchantName')" label-width="150px" prop="merchantAgentId">
          <!--              <el-input v-model="withdrawAccountInfo.merchantAccount" style="width: 200px"/>-->
          <el-select v-model="withdrawAccountInfo.merchantAgentId"
                     @change="handleChange"
                     :placeholder="$t('withdrawlAccount.placeholder.merchantSelect')"
                     style="width: 200px"
                     :options="merchantInfo"
                     :props="merchantInfoProps"
                     :disabled="selectAccountVisible"
          >
          </el-select>
        </el-form-item>
      </div>
      <!--      <div class="el-form-line">
              <el-form-item label="商户账号:" label-width="150px" prop="userName">
                <el-input disabled v-model="withdrawAccountInfo.userName" style="width: 200px"></el-input>
              </el-form-item>
            </div>-->
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.walletName')" label-width="150px" prop="walletName">
          <el-input v-model="withdrawAccountInfo.walletName" style="width: 200px"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.status')" label-width="150px" prop="status">
          <el-switch
              v-model="withdrawAccountInfo.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="$t('common.enable')"
              :inactive-text="$t('common.disable')"
              :active-value="1"
              :inactive-value="0"
              style="width: 200px"
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.walletAddr')" label-width="150px" prop="walletAddr">
          <el-input v-model="withdrawAccountInfo.walletAddr" style="width: 200px"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog('createMerchantAccountForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitMerchantAccount('createMerchantAccountForm')">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>

  <el-dialog
      :title="merchantGoogleTitle"
      v-model="merchantGoogleVisible"
      class="dialog"
      center
      width="40%"
      height="30%"
  >
    <el-form ref="merchantGoogleForm" :model="merchantGoogleInfo" :rules="merchantGoogleRule" class="form">
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.googleCode')" label-width="150px" prop="googleCode">
          <el-input v-model="merchantGoogleInfo.googleCode" style="width: 200px"/>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelMerchantGoogle">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitMerchantGoogle">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>

  <!-- withdraw dialog -->
  <el-dialog
      :title="dialogWithdrawTitle"
      v-model="dialogWithdrawVisible"
      class="dialog"
      center
      width="40%"
      height="50%"
  >
    <el-form :model="withdrawOrderInfo" label-width="100%" class="form" ref="withdrawOrderInfoForm"
             :rules="withdrawOrderRule">
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.merchantName')" label-width="150px" prop="merchantAgentId">
          <el-select
              :options="merchantInfo"
              :props="merchantInfoProps"
              style="width: 200px"
              v-model="withdrawOrderInfo.merchantAgentId"
              @change="handleMerchantChange"
              :disabled="filterAvaiable"
          >
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.currency')" label-width="150px" prop="availableAmount">
          <el-select v-model="withdrawOrderInfo.currency" style="width: 200px"
             :options="currencyOptions"
             :props="currencyProps"
             @change="handleWithdrawCurrencyChange"
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.availableAmount')" label-width="150px" prop="availableAmount">
          <el-input disabled v-model="withdrawOrderInfo.availableAmount" style="width: 200px"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.walletAddrSelect')" label-width="150px" prop="walletAddr">
          <el-select
              v-model="withdrawOrderInfo.walletAddr"
              style="width: 200px"
              :options="selectedMerchantOptions"
              :props="merchantWalletProps"
              filterable
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.amount')" label-width="150px" prop="amount">
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
      :title="dialogRechargeTitle"
      v-model="dialogRechargeVisible"
      class="dialog"
      center
      width="40%"
      height="50%"
  >
    <el-form ref="rechargeOrderInfoForm" :model="rechargeOrderInfo" class="form" :rules="rechargeOrderRule">
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.rechargeMerchant')" label-width="150px" prop="merchantAgentId">
          <el-select
              :options="merchantInfo"
              :props="merchantInfoProps"
              v-model="rechargeOrderInfo.merchantAgentId"
              style="width: 200px"
              @change="handleRechargeMerchantChange"
          >
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.rechargeCurrency')" label-width="150px" prop="currency">
          <el-select
              :options="currencyOptions"
              :props="currencyProps"
              v-model="rechargeOrderInfo.currency"
              style="width: 200px"
          >
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.rechargeAmount')" label-width="150px" prop="amount">
          <el-input type="number" v-model="rechargeOrderInfo.amount" style="width: 200px"/>
        </el-form-item>
      </div>
<!--      <div class="el-form-line">
        <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
          <el-input v-model="rechargeOrderInfo.googleCode" style="width: 200px"/>
        </el-form-item>
      </div>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelRecharge('rechargeOrderInfoForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitRecharge('rechargeOrderInfoForm')">{{ $t('common.confirm') }}</el-button>
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
        <el-form-item :label="$t('withdrawlAccount.form.merchant')" label-width="150px" prop="merchantAgentId">
          <el-select
              :options="cacheMerchantAccountOptions"
              :props="merchantAccountProps"
              v-model="manualAccountAdjustmentOrderInfo.merchantAgentId"
              @change="handleAjustMentMerchantChange"
              style="width: 200px"
          >
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item :label="$t('withdrawlAccount.form.currency')" label-width="150px" prop="currency">
          <el-select v-model="manualAccountAdjustmentOrderInfo.currency" style="width: 200px"
                     :options="currencyOptions"
                     :props="currencyProps"
                     @change="handleAjustmentCurrencyChange"
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
    <div slot="footer" class="dialog-footer" style="margin-right: 3%">
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
            <el-form-item :label="$t('withdrawlAccount.form.googleCode')" label-width="150px" prop="googleCode">
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
<!--
 此页面需要根据用户角色进行数据预处理
 商户只能看到自己的账户信息。
 代理不显示商户信息 只看报表
 -->
<script>
import {ref} from "vue";
import {
  createMerchantAccount, createStatementeOrderApply,
  exportMerchantAccount, getAllCurrencyType, getMerchantAccount,
  getMerchantInfo, modifyMerchantAccount,
} from "@/api/interface/backendInterface.js";
import {
  exportExcel,
  getFormateTime,
  getMerchantAccountTitle,
  loadingBody
} from "@/api/common.js";

const filterDateRange = ref('')
export default {
  data() {
    const amountValidate = (rule, value, callback) => {
      if (!value || value === 0) {
        callback(new Error(this.$t('withdrawlAccount.validation.amountRequired')));
      } else if (value > this.withdrawOrderInfo.availableAmount) {
        callback(new Error(this.$t('withdrawlAccount.validation.amountExceed')));
      } else {
        callback();
      }
    }
    return {
      selectedMerchantOptions: [],
      selectedMerchantBalance: {},
      filterAvaiable: false,
      roleName: '',
      merchantInfo: [],
      amountInfo: {},
      confirmDialogVisible: false,
      confirmDialogTitle: "",
      confirmData: {},
      activeTool: '1',
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      currencyMaps: {},
      submitType: '',
      /*  statisticsInfo: {},*/
      dialogFormVisible: false,
      dialogTitle: '',
      selectedMerchentName: '',
      selectAccountVisible: true,
      merchantAccountOptions: [],
      cacheMerchantAccountOptions: [],
      merchantInfoProps: {
        value: 'userId',
        label: 'accountName',
      },
      merchantAccountProps: {
        value: 'merchantAgentId',
        label: 'name',
      },
      merchantWalletProps: {
        value: 'walletAddr',
        label: 'walletAddr',
      },
      withdrawAccountFormData: [],
      allMerchantInfo: [], /** 客服登陆 后端返回所有商户信息包括 商户名 商户账号 可用余额 。商户进入该页面，后端返回该商户单条信息 */
      withdrawAccountInfo: {
        /*merchantAccount: '',
        merchantName: '',
        balance: '',
        withdrawlAccount: [],
        withdrawlAccountOptions: [
          {
            value: 1,
            label: '收款账号1'
          },
          {
            value: 2,
            label: '收款账号2'
          }
        ],
        googleCode: '',*/
      },
      filterbox: {
        merchantAccount: "",
        withdrawlAccount: "",
      },
      confirmRule: {
        googleCode: {
          required: true, trigger: 'blur', message: this.$t('common.googleCodeRequired')
        }
      },
      merchantGoogleVisible: false,
      merchantGoogleTitle: this.$t('withdrawlAccount.dialog.googleVerify'),
      merchantGoogleInfo: {
        googleCode: ''
      },
      merchantGoogleRule: {
        googleCode: {
          required: true, trigger: 'blur', message: this.$t('common.googleCodeRequired')
        }
      },
      pendingMerchantAction: '',
      merchantAccountRule: {
        merchantAgentId: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.merchantRequired')
        },
        userName: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.merchantAccountRequired')
        },
        walletName: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.walletNameRequired')
        },
        walletAddr: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.walletAddrRequired')
        }
      },
      withdrawOrderRule: {
        merchantAgentId: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.merchantRequired')
        },
        walletAddr: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.walletAddrSelectRequired')
        },
        amount: {
          required: true, trigger: 'blur', validator: amountValidate
        },
        availableAmount: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.availableAmountRequired')
        }
       /* googleCode: {
          required: true, trigger: 'blur'
        }*/
      },
      withdrawOrderInfo: {},
      dialogWithdrawVisible: false,
      dialogWithdrawTitle: '',
      rechargeOrderInfo: {},
      dialogRechargeVisible: false,
      dialogRechargeTitle: '',
      rechargeOrderRule: {
        merchantAgentId: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.merchantRequired')
        },
        amount: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.rechargeAmountRequired')
        },
        currency: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.currencyRequired')
        }
      },
      dialogManualAccountAdjustmentVisible: false,
      dialogManualAccountAdjustmentTitle: '',
      manualAccountAdjustmentOrderInfo: {},
      dialogManualAccountAdjustmentRule: {
        merchantAgentId: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.merchantRequired')
        },
        amount: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.amountRequired')
        },
        currency: {
          required: true, trigger: 'blur', message: this.$t('withdrawlAccount.validation.currencyRequired')
        }
       /* googleCode: {
          required: true, trigger: 'blur', message: 'you need to select googleCode'
        }*/
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100, 200],
    }
  },
  methods: {
    cancelConfirmDialog(form) {
      this.$refs[form].resetFields();
      this.confirmDialogVisible = false
      this.confirmDialogTitle = ''
    },
    handleMerchantChange(value) {
      this.withdrawOrderInfo.currency = null;
      this.withdrawOrderInfo.availableAmount = null;
      this.withdrawOrderInfo.walletAddr = null;
      this.withdrawOrderInfo.amount = null;
      let opt = [];
      this.merchantAccountOptions.find((item) => {
        //return item.merchantAgentId === value;
        if (item.merchantAgentId === value) {
          opt.push(item);
        }
      });
      this.withdrawOrderInfo.merchantAgentName = opt.length >0 ? opt[0].name : null;
      //this.withdrawOrderInfo.walletAddr = opt.walletAddr;
      //this.merchantAccountOptions = Object.assign([], opt)
      this.selectedMerchantBalance = this.amountInfo[value]
      this.merchantAccountOptions.forEach(item => {
        if (item.merchantAgentId === value) {
          this.selectedMerchantOptions.push(item);
        }
      })
    },
    handleAjustMentMerchantChange(value) {
      this.manualAccountAdjustmentOrderInfo.currency = null
      this.manualAccountAdjustmentOrderInfo.availableAmount = null
      this.manualAccountAdjustmentOrderInfo.total = null
      let opt = [];
      this.merchantAccountOptions.find((item) => {
        //return item.merchantAgentId === value;
        if (item.merchantAgentId === value) {
          opt.push(item);
        }
      });
      this.manualAccountAdjustmentOrderInfo.merchantAgentName = opt.length >0 ? opt[0].name : null;
      this.manualAccountAdjustmentOrderInfo.merchantAgentId = opt[0].merchantAgentId;
      //this.withdrawOrderInfo.walletAddr = opt.walletAddr;
      //this.cacheMerchantAccountOptions = Object.assign([], opt)
      this.selectedMerchantBalance = this.amountInfo[value]
      /*this.merchantAccountOptions.forEach(item => {
        if (item.merchantAgentId === value) {
          this.selectedMerchantOptions.push(item);
        }
      })*/
    },
    handleRechargeMerchantChange(value) {
      let opt = {};
      opt = this.merchantInfo.find((item) => {
        return item.userId === value;
      });
      this.rechargeOrderInfo.merchantAgentName = opt.accountName;
    },
    exportStatements() {
      this.filterbox.columns = getMerchantAccountTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
      } else {
        this.filterbox.startTime = null
        this.filterbox.endTime = null
      }
      exportMerchantAccount(this.filterbox).then(async res => {
        //const fileName = this.$t('exportPaymentReportName') + getFormateTime()
        const fileName = this.$t('withdrawlAccount.exportName') + getFormateTime()
        await exportExcel(res, fileName, this)
      })
    },
    reset(form) {
      this.$refs[form].resetFields()
    },
    search() {
      const loadingInstance = loadingBody(this, 'merchantInfos-table')
      let timeRange = null;
      this.filterbox.isNeedCardData = true
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000 + 86399
      } else {
        this.filterbox.startTime = null
        this.filterbox.endTime = null
      }
      this.updateMerchantAccount(loadingInstance)
    },
    updateMerchantAccount(loadingInstance) {
      getMerchantAccount(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const all = JSON.parse(res.data.data)
          const allData = all.withdrawalAccountsDtoList
          this.merchantAccountOptions = allData
          /*if (this.merchantAccountOptions.length === 0) {
            this.merchantAccountOptions = allData
          }*/
          /*const allCardData = all.cardInfo
          if (allCardData) {
            const cardInfo = allCardData[this.currency]
            this.statisticsInfo.total = cardInfo.total
            this.statisticsInfo.frozen = cardInfo.frozen
            this.statisticsInfo.withdraw = cardInfo.withdraw
          } else {
            this.statisticsInfo.total = this.currencyIcons[this.currency] + 0
            this.statisticsInfo.frozen = this.currencyIcons[this.currency] + 0
            this.statisticsInfo.withdraw = this.currencyIcons[this.currency] + 0
          }*/
          this.totalCount = all.totalNumber
          this.withdrawAccountFormData = allData
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
    handleCurrencyChange() {
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency]
      this.search()
    },
    addWithdrawlAccount() {
      this.dialogFormVisible = true;
      this.dialogTitle = this.$t('withdrawlAccount.dialog.addTitle')
      this.selectAccountVisible = false;
      this.filterbox.submitType = 'create'
    },
    editMerchantInfo(row) {
      this.withdrawAccountInfo = row
      this.dialogFormVisible = true;
      this.dialogTitle = this.$t('withdrawlAccount.dialog.editTitle')
      this.selectAccountVisible = true;
      this.filterbox.submitType = 'edit'
    },
    handleChange(val) {
      //选择商户后自动填充商户账号
      /*this.allMerchantInfo.forEach(item => {
        if (item.merchantAccount === val) {
          this.withdrawAccountInfo.merchantAccount = item.merchantAccount;
          this.withdrawAccountInfo.balance = item.balance;
          return
        }
      })*/
      this.withdrawAccountInfo.userName = val
    },
    handleCurrentChange(currentPage) {
      this.filterbox.pageNo = currentPage
      this.filterbox.pageSize = this.pageSize
      this.search()
    },
    handleSizeChange(pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.filterbox.pageSize = pageSize
      this.filterbox.pageNo = 1
      this.handleCurrentChange()
    },
    cancelDialog(form) {
      this.dialogFormVisible = false;
      this.dialogTitle = ''
      this.$refs[form].resetFields()
      this.updateMerchantAccount()
    },
    cancelMerchantGoogle() {
      this.merchantGoogleVisible = false;
      this.merchantGoogleInfo.googleCode = '';
      this.pendingMerchantAction = '';
    },
    submitMerchantAccount(form) {

      this.$refs[form].validate(validate => {
        if (validate) {
          this.pendingMerchantAction = this.filterbox.submitType;
          this.merchantGoogleVisible = true;
        } else {

        }
      })
      this.submitType = ''
    },
    submitMerchantGoogle() {
      this.$refs.merchantGoogleForm.validate(validate => {
        if (!validate) {
          return;
        }
        this.withdrawAccountInfo.googleCode = this.merchantGoogleInfo.googleCode;
        const request = this.pendingMerchantAction === 'edit'
          ? modifyMerchantAccount(this.withdrawAccountInfo)
          : createMerchantAccount(this.withdrawAccountInfo);
        request.then(res => {
          if (res.status === 200 && res.data.code === 0) {
            this.$notify({
              title: this.$t('common.success'),
              type: 'success',
              message: this.pendingMerchantAction === 'edit'
                ? this.$t('withdrawlAccount.message.updateSuccess')
                : this.$t('withdrawlAccount.message.createSuccess'),
              duration: 3000,
              position: 'bottom-right'
            })
            this.dialogTitle = ''
            this.dialogFormVisible = false
            this.merchantGoogleVisible = false
            this.merchantGoogleInfo.googleCode = ''
            this.pendingMerchantAction = ''
            this.$refs.createMerchantAccountForm.resetFields()
            this.search()
          } else if (res.status === 200 && res.data.code !== 0) {
            this.$notify({
              title: this.$t('common.failed'),
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
      })
    },
    createWithdrawOrder() {
      // set withdraw merchant
      if(this.roleName === 'merchant') {
        const merchantInfo = this.merchantAccountOptions[0]
        this.withdrawOrderInfo.merchantAgentId = merchantInfo.merchantAgentId
        this.handleMerchantChange(this.withdrawOrderInfo.merchantAgentId)
      }


      //this.withdrawOrderInfo.availableAmount = merchantInfo.availableAmount


      this.dialogWithdrawVisible = true
      this.dialogWithdrawTitle = this.$t('withdrawlAccount.dialog.withdrawTitle')
      this.withdrawOrderInfo.orderType = 2
    },
    createRechargeOrder() {
      this.dialogRechargeVisible = true
      this.dialogRechargeTitle = this.$t('withdrawlAccount.dialog.rechargeTitle')
      this.rechargeOrderInfo.orderType = 1
    },
    createManualAccountAdjustment() {
      this.dialogManualAccountAdjustmentVisible = true
      this.dialogManualAccountAdjustmentTitle = this.$t('withdrawlAccount.dialog.manualAdjustTitle')
      this.manualAccountAdjustmentOrderInfo.orderType = 3
      this.cacheMerchantAccountOptions = Object.assign({}, this.merchantAccountOptions)
    },
    cancelWithdraw(form) {
      this.$refs[form].resetFields()
      this.dialogWithdrawTitle = ''
      this.dialogWithdrawVisible = false
      this.updateMerchantAccount(null)
    },
    submitWithdraw(form) {
      this.$refs[form].validate(validate => {
        if (validate) {
          this.dialogWithdrawVisible = false
          this.dialogWithdrawTitle = ''
          this.confirmData =  Object.assign({}, this.withdrawOrderInfo)
          this.confirmDialogTitle = this.$t('withdrawlAccount.dialog.confirmTitle')
          this.confirmDialogVisible = true
          this.$refs[form].resetFields()
        }
      })
    },
    submitConfirm(form) {
      const orderMessageKey = this.confirmData.orderType === 1
        ? 'withdrawlAccount.orderType.recharge'
        : this.confirmData.orderType === 2
          ? 'withdrawlAccount.orderType.withdraw'
          : 'withdrawlAccount.orderType.manualAdjust'
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
              }
              this.$notify({
                title: this.$t('common.success'),
                type: 'success',
                message: this.$t('withdrawlAccount.message.orderCreateSuccess', {type: orderMessage}),
                duration: 3000,
                position: 'bottom-right'
              })
              this.search()
              this.getNewstMerchantInfo()
            } else if (res.status === 200 && res.data.code !== 0) {
              this.$notify({
                title: this.$t('common.failed'),
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

    cancelRecharge(form) {
      this.dialogRechargeVisible = false
      this.dialogRechargeTitle = ''
      this.$refs[form].resetFields()
    },
    submitRecharge(form) {
      this.$refs[form].validate(validate => {
        if (validate) {
          this.dialogRechargeVisible = false
          this.dialogRechargeTitle = ''
          this.confirmData = {}
          this.confirmData = Object.assign({},this.rechargeOrderInfo)
          this.confirmDialogTitle = this.$t('withdrawlAccount.dialog.confirmTitle')
          this.confirmDialogVisible = true
          this.$refs[form].resetFields()
        }
      })
    },
    cancelManualAccountAdjustment(form) {
      this.$refs[form].resetFields()
      this.dialogManualAccountAdjustmentVisible = false
      this.dialogManualAccountAdjustmentTitle = ''
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
          this.confirmData =  Object.assign({}, this.manualAccountAdjustmentOrderInfo)
          this.confirmDialogTitle = this.$t('withdrawlAccount.dialog.confirmTitle')
          this.confirmDialogVisible = true
        }
      })
    },
    handleWithdrawCurrencyChange(val) {
      const opt = this.selectedMerchantBalance?.[val] ?? {};
      if(opt) {
        this.withdrawOrderInfo.availableAmount = opt.available ? opt.available : 0;
      } else {
        this.withdrawOrderInfo.availableAmount = 0
      }
      //opt ? this.withdrawOrderInfo.availableAmount = opt.available : this.withdrawOrderInfo.availableAmount = 0
    },
    handleAjustmentCurrencyChange(val) {
      const opt = this.selectedMerchantBalance?.[val] ?? {};
      //opt = this.amountInfo[val]
      //opt ? this.manualAccountAdjustmentOrderInfo.total = this.currencyIcons[val] + opt.available : this.manualAccountAdjustmentOrderInfo.total = this.currencyIcons[val] + 0
      if(opt) {
        this.manualAccountAdjustmentOrderInfo.total = opt.available ? opt.available : 0;
      } else {
        this.manualAccountAdjustmentOrderInfo.total = 0
      }
    },
    getNewstMerchantInfo() {
      getMerchantInfo({merchantUserName: this.filterbox.name, isNeedCardData: true}).then(res => {
        if (res.status === 200) {
          if (res.data.code === 0) {
            let allData = JSON.parse(res.data.data)
            this.merchantInfo = allData.merchantInfoDtoList
            this.amountInfo = allData.cardInfo
            this.merchantInfo.forEach(item => {
              this.amountInfo[item.userId]= item.balanceInfo
            })
          }
        }
      })
    }
  },
  mounted() {

    // get all merchant info
    this.roleName = localStorage.getItem("roleName")
    this.filterbox.name = this.roleName=== 'merchant'? localStorage.getItem('userName') : null
    this.filterAvaiable = this.roleName === 'merchant'? true : false
        getAllCurrencyType().then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
          this.currency = this.currencyOptions[0].currencyType
          this.filterbox.currency = this.currencyOptions[0].currencyType
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
      this.search()
      this.getNewstMerchantInfo()
    })

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
}

.dialog-footer {
  display: flex;
  justify-content: right;
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
