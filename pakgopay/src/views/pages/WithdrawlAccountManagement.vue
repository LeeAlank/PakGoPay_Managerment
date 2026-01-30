<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate, getFormateTimeByTimeBystamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">商户账号</div>
<!--  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
    <el-form-item style="margin-left: 2%;">
      <template #label>
          <span style="color: black;font-size: small;align-items: center;">
            统计币种:
          </span>
      </template>
      <el-select
          style="width: 100px;align-items: center;text-align: center;"
          :options="currencyOptions"
          :props="currencyProps"
          default-first-option
          v-model="filterbox.currency"
          @change="handleCurrencyChange"
          filterable
      />
    </el-form-item>
  </div>-->
  <!--  <div class="statistics-container"
         style="display: flex;justify-content: space-around;height: auto;justify-items: center;align-items: center;margin-top:1%;">
      <el-card style="width: 30%;height: 100%;">
        <div style="display: flex;">
          <SvgIcon name="cash" width="100px" height="100px"/>
          <div style="display: flex; flex-direction: column;width: 80%;">
            <span>总账户金额:</span>
            <textarea v-model="statisticsInfo.total" disabled class="cash-text-area"></textarea>
          </div>
        </div>
      </el-card>
      <el-card style="width: 30%;height: 100%;">
        <div style="display: flex;">
          <SvgIcon name="cash-freeze" width="100px" height="100px"/>
          <div style="display: flex; flex-direction: column;width: 80%;">
            <span>冻结总金额:</span>
            <textarea v-model="statisticsInfo.frozen" disabled class="cash-text-area"></textarea>
          </div>
        </div>
      </el-card>
      <el-card style="width: 30%;height: 100%;">
        <div style="display: flex;">
          <SvgIcon name="tixian" width="90px" height="90px"/>
          <div style="display: flex; flex-direction: column;width: 80%;">
            <span>提现总金额:</span>
            <textarea v-model="statisticsInfo.withdraw" disabled class="cash-text-area"></textarea>
          </div>
        </div>
      </el-card>
    </div>-->
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
         <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <el-row style="display: flex;justify-content: space-around;">
            <el-form-item label="商户账号" label-width="150px" prop="name">
              <el-input style="width: 200px" v-model="filterbox.name" placeholder="商户账号" :disabled="filterAvaiable"/>
            </el-form-item>
            <el-form-item label="收款账号" label-width="150px" prop="walletAddr">
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
            <el-form-item label="录入时间" label-width="150px" prop="filterDateRange">
              <el-date-picker
                  v-model="filterbox.filterDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY/MM/DD"
                  value-format="x"
              >
              </el-date-picker>
              <div style="display: flex;flex-direction: row;">
                <el-button @click="reset('filterboxForm')"
                     class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="reset"/>
                  <div>重置</div>
                </el-button>
                <el-button @click="search()"
                     class="filterButton">
                  <SvgIcon class="filterButtonSvg" name="search"/>
                  <div>查询</div>
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
<!--        <el-button @click="exportStatements()" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="export"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">导出</div>
        </el-button>-->
        <el-button @click="addWithdrawlAccount()" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="add"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">新增</div>
        </el-button>
        <el-button @click="createWithdrawOrder" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="withdrawl"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">提现</div>
        </el-button>
        <el-button @click="createRechargeOrder" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="recharge"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">充值</div>
        </el-button>
        <el-button v-if="roleName=== 'admin'" @click="createManualAccountAdjustment" class="filterButton">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon class="filterButtonSvg" name="manualaccountadjustment"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">手工调账</div>
        </el-button>
      </div>
      <el-table
          border :data="withdrawAccountFormData"
          class="merchantInfos-table"
          style="width: 100%;height: 60%;"
      >
        <el-table-column
            prop="商户名称"
            label="商户名称"
            v-slot="{row}"
            align="center"
            style="height: 100%;"
        >
          <div>
            {{ row.name }}
          </div>
        </el-table-column>
        <el-table-column
            label="商户账号"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ row.userName }}
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantWithdrawAccount"
            label="商户钱包名"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ row.walletName }}
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantWithdrawAccount"
            label="商户钱包地址"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ row.walletAddr }}
          </div>
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="录入时间"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ getFormateDate(row.createTime) }}
          </div>
        </el-table-column>
        <el-table-column
            prop="accountUseTime"
            label="账号启用状态"
            v-slot="{row}"
            align="center"
        >
          <div>
            <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                :inactive-value="0"
                :active-value="1"
                disabled>
            </el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="createBy"
            label="创建人"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{ row.createBy }}
          </div>
        </el-table-column>
        <el-table-column
            prop="operate"
            label="操作"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div style="display: flex;align-items: center;justify-content: center;">
            <el-button class="filterButton" @click.prevent="editMerchantInfo(row)">编辑</el-button>
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
      width="70%"
      height="50%"
  >
    <!--
      客服：各列信息由后端返回列表，前端页面下拉选择
      商户：后端返回单列表，下拉结果回显
     -->
    <el-form :model="withdrawAccountInfo" label-width="100%" class="form" ref="createMerchantAccountForm"
             :rules="merchantAccountRule">
      <div class="el-form-line">
        <el-form-item label="商户名称:" label-width="150px" prop="merchantAgentId">
          <!--              <el-input v-model="withdrawAccountInfo.merchantAccount" style="width: 200px"/>-->
          <el-select v-model="withdrawAccountInfo.merchantAgentId"
                     @change="handleChange"
                     placeholder="请选择商户"
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
        <el-form-item label="收款账号:" label-width="150px" prop="walletName">
          <el-input v-model="withdrawAccountInfo.walletName" style="width: 200px"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="是否状态:" label-width="150px" prop="status">
          <el-switch
              v-model="withdrawAccountInfo.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用"
              :active-value="1"
              :inactive-value="0"
              style="width: 200px"
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="收款账号地址:" label-width="150px" prop="walletAddr">
          <el-input v-model="withdrawAccountInfo.walletAddr" style="width: 200px"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog('createMerchantAccountForm')">取 消</el-button>
      <el-button type="primary" @click="submitMerchantAccount('createMerchantAccountForm')">确 定</el-button>
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
        <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
          <el-input v-model="merchantGoogleInfo.googleCode" style="width: 200px"/>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelMerchantGoogle">取 消</el-button>
      <el-button type="primary" @click="submitMerchantGoogle">确 定</el-button>
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
        <el-form-item label="商户名称:" label-width="150px" prop="merchantAgentId">
          <el-select
              :options="merchantAccountOptions"
              :props="merchantAccountProps"
              style="width: 200px"
              v-model="withdrawOrderInfo.merchantAgentId"
              @change="handleMerchantChange"
              :disabled="filterAvaiable"
          >
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="币种:" label-width="150px" prop="availableAmount">
          <el-select v-model="withdrawOrderInfo.currency" style="width: 200px"
             :options="currencyOptions"
             :props="currencyProps"
             @change="handleWithdrawCurrencyChange"
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="可用余额:" label-width="150px" prop="availableAmount">
          <el-input disabled v-model="withdrawOrderInfo.availableAmount" style="width: 200px"></el-input>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="钱包地址:" label-width="150px" prop="walletAddr">
          <el-select
              v-model="withdrawOrderInfo.walletAddr"
              style="width: 200px"
              :options="merchantAccountOptions"
              :props="merchantWalletProps"
              filterable
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="提现金额:" label-width="150px" prop="amount">
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
      <el-button @click="cancelWithdraw('withdrawOrderInfoForm')">取 消</el-button>
      <el-button type="primary" @click="submitWithdraw('withdrawOrderInfoForm')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
      :title="dialogRechargeTitle"
      v-model="dialogRechargeVisible"
      class="dialog"
      center
      width="50%"
      height="50%"
  >
    <el-form ref="rechargeOrderInfoForm" :model="rechargeOrderInfo" class="form" :rules="rechargeOrderRule">
      <div class="el-form-line">
        <el-form-item label="充值商户:" label-width="150px" prop="merchantAgentId">
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
        <el-form-item label="充值币种:" label-width="150px" prop="currency">
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
        <el-form-item label="充值金额:" label-width="150px" prop="amount">
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
      <el-button @click="cancelRecharge('rechargeOrderInfoForm')">取 消</el-button>
      <el-button type="primary" @click="submitRecharge('rechargeOrderInfoForm')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
      :title="dialogManualAccountAdjustmentTitle"
      v-model="dialogManualAccountAdjustmentVisible"
      class="dialog"
      center
      width="50%"
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
        <el-form-item label="商户:" label-width="150px" prop="merchantAgentId">
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
        <el-form-item label="币种:" label-width="150px" prop="currency">
          <el-select v-model="manualAccountAdjustmentOrderInfo.currency" style="width: 200px"
                     :options="currencyOptions"
                     :props="currencyProps"
                     @change="handleAjustmentCurrencyChange"
          />
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="账户金额:" label-width="150px" prop="total">
          <el-input disabled v-model="manualAccountAdjustmentOrderInfo.total" style="width: 200px"/>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="调账模式:" label-width="150px" prop="type">
          <el-switch
              v-model="manualAccountAdjustmentOrderInfo.type"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="增加"
              inactive-text="减少"
              :active-value="1"
              :inactive-value="0"
              :class="manualAccountAdjustmentOrderInfo.type === 1 ? 'adjust-switch-inc' : 'adjust-switch-dec'"
              style="width: 200px"
          >
          </el-switch>
        </el-form-item>

      </div>
      <div class="el-form-line">
        <el-form-item label="调账金额:" label-width="150px" prop="amount">
          <el-input type="number" v-model="manualAccountAdjustmentOrderInfo.amount" style="width: 200px"/>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-right: 3%">
      <el-button @click="cancelManualAccountAdjustment('manualAccountAdjustmentOrderInfoForm')">取 消</el-button>
      <el-button type="primary" @click="submitManualAccountAdjustment('manualAccountAdjustmentOrderInfoForm')">确 定
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
            <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
                <el-input v-model="confirmData.googleCode" style="width: 200px"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-right: 3%;height: 30px;">
      <el-button @click="cancelConfirmDialog('confirmDataForm')">取 消</el-button>
      <el-button type="primary" @click="submitConfirm('confirmDataForm')">确 定
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
        callback(new Error("amount is required"));
      } else if (value > this.withdrawOrderInfo.availableAmount) {
        callback(new Error("amount is more than your available amount"));
      } else {
        callback();
      }
    }
    return {
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
      allMerchantInfo: [
        {
          merchantName: '123',
          merchantAccount: '123123',
          balance: '11',
        },
        {
          merchantName: '狗几把',
          merchantAccount: 'leealank4@gmail.com',
          balance: '100000',
        }
      ], /** 客服登陆 后端返回所有商户信息包括 商户名 商户账号 可用余额 。商户进入该页面，后端返回该商户单条信息 */
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
          required: true, trigger: 'blur', message: 'googleCode is required'
        }
      },
      merchantGoogleVisible: false,
      merchantGoogleTitle: '谷歌验证',
      merchantGoogleInfo: {
        googleCode: ''
      },
      merchantGoogleRule: {
        googleCode: {
          required: true, trigger: 'blur', message: 'googleCode is required'
        }
      },
      pendingMerchantAction: '',
      merchantAccountRule: {
        merchantAgentId: {
          required: true, trigger: 'blur'
        },
        userName: {
          required: true, trigger: 'blur'
        },
        walletName: {
          required: true, trigger: 'blur'
        },
        walletAddr: {
          required: true, trigger: 'blur'
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
      withdrawOrderInfo: {},
      dialogWithdrawVisible: false,
      dialogWithdrawTitle: '',
      rechargeOrderInfo: {},
      dialogRechargeVisible: false,
      dialogRechargeTitle: '',
      rechargeOrderRule: {
        merchantAgentId: {
          required: true, trigger: 'blur',
        },
        amount: {
          required: true, trigger: 'blur', message: 'type recharge amount'
        },
        currency: {
          required: true, trigger: 'blur', message: 'you need to select currency'
        }
      },
      dialogManualAccountAdjustmentVisible: false,
      dialogManualAccountAdjustmentTitle: '',
      manualAccountAdjustmentOrderInfo: {},
      dialogManualAccountAdjustmentRule: {
        merchantAgentId: {
          required: true, trigger: 'blur', message: 'you need to select merchant'
        },
        amount: {
          required: true, trigger: 'blur', message: 'type amount'
        },
        currency: {
          required: true, trigger: 'blur', message: 'you need to select currency'
        }
       /* googleCode: {
          required: true, trigger: 'blur', message: 'you need to select googleCode'
        }*/
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [1, 5, 10, 15, 20],
    }
  },
  methods: {
    cancelConfirmDialog(form) {
      this.$refs[form].resetFields();
      this.confirmDialogVisible = false
      this.confirmDialogTitle = ''
    },
    handleMerchantChange(value) {
      let opt = [];
      this.merchantAccountOptions.find((item) => {
        //return item.merchantAgentId === value;
        if (item.merchantAgentId === value) {
          opt.push(item);
        }
      });
      this.withdrawOrderInfo.merchantAgentName = opt[0].name;
      //this.withdrawOrderInfo.walletAddr = opt.walletAddr;
      this.merchantAccountOptions = Object.assign([], opt)
    },
    handleAjustMentMerchantChange(value) {
      let opt = [];
      this.merchantAccountOptions.find((item) => {
        //return item.merchantAgentId === value;
        if (item.merchantAgentId === value) {
          opt.push(item);
        }
      });
      this.manualAccountAdjustmentOrderInfo.merchantAgentName = opt[0].name;
      this.manualAccountAdjustmentOrderInfo.merchantAgentId = opt[0].merchantAgentId;
      //this.withdrawOrderInfo.walletAddr = opt.walletAddr;
      this.cacheMerchantAccountOptions = Object.assign([], opt)
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
        const fileName = '商户账号信息表' + getFormateTime()
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
            title: 'Error',
            type: 'error',
            message: res.data.message,
            duration: 3000,
            position: "bottom-right"
          })
        } else {
          this.$notify({
            title: 'Error',
            type: 'error',
            message: 'something wrong happened, try it again',
            duration: 3000,
            position: "bottom-right"
          })
        }
        loadingInstance !== null ? loadingInstance.close() : ''
      }).catch(err => {
        loadingInstance !== null ? loadingInstance.close() : ''
        this.$notify({
          title: 'Error',
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
      this.dialogTitle = '新增收款账号'
      this.selectAccountVisible = false;
      this.filterbox.submitType = 'create'
    },
    editMerchantInfo(row) {
      this.withdrawAccountInfo = row
      this.dialogFormVisible = true;
      this.dialogTitle = '新增收款账号'
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
              title: 'Success',
              type: 'success',
              message: this.pendingMerchantAction === 'edit'
                ? 'Modify Merchant Account Successfully.'
                : 'Create New Merchant Account Successfully.',
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
              title: 'Failed',
              type: 'error',
              message: res.data.message,
              duration: 3000,
              position: 'bottom-right'
            })
          } else {
            this.$notify({
              title: 'Error',
              type: 'error',
              message: 'somethind went wrong, try it again',
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
      this.dialogWithdrawTitle = '提现'
      this.withdrawOrderInfo.orderType = 2
    },
    createRechargeOrder() {
      this.dialogRechargeVisible = true
      this.dialogRechargeTitle = '商户充值'
      this.rechargeOrderInfo.orderType = 1
    },
    createManualAccountAdjustment() {
      this.dialogManualAccountAdjustmentVisible = true
      this.dialogManualAccountAdjustmentTitle = '手工调账'
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
          this.confirmDialogTitle = '谷歌验证'
          this.confirmDialogVisible = true
          this.$refs[form].resetFields()
        }
      })
    },
    submitConfirm(form) {
      let orderMessage = this.confirmData.orderType === 1 ? 'Recharge' : this.confirmData.orderType === 2 ? 'Withdraw' : 'Manual Account Adjustment'
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
                title: 'Success',
                type: 'success',
                message: 'Create '+orderMessage+' Order Successfully.',
                duration: 3000,
                position: 'bottom-right'
              })
              this.search()
              this.getNewstMerchantInfo()
            } else if (res.status === 200 && res.data.code !== 0) {
              this.$notify({
                title: 'Failed',
                type: 'error',
                message: res.data.message,
                duration: 3000,
                position: 'bottom-right'
              })
            } else {
              this.$notify({
                title: 'Error',
                type: 'error',
                message: 'somethind went wrong, try it again',
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
          this.confirmDialogTitle = '谷歌验证'
          this.confirmDialogVisible = true
          this.$refs[form].resetFields()
          /*createStatementeOrderApply(this.rechargeOrderInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.$refs[form].resetFields()
              this.$notify({
                title: 'Success',
                type: 'success',
                message: 'Create Recharge Order Successfully.',
                duration: 3000,
                position: 'bottom-right'
              })
            } else if (res.status === 200 && res.data.code !== 0) {
              this.$notify({
                title: 'Failed',
                type: 'error',
                message: res.data.message,
                duration: 3000,
                position: 'bottom-right'
              })
            } else {
              this.$notify({
                title: 'Error',
                type: 'error',
                message: 'somethind went wrong, try it again',
                duration: 3000,
                position: 'bottom-right'
              })
            }
          })*/
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
          this.dialogManualAccountAdjustmentVisible = false
          this.dialogManualAccountAdjustmentTitle = ''
          this.confirmData =  Object.assign({}, this.manualAccountAdjustmentOrderInfo)
          this.confirmDialogTitle = '谷歌验证'
          this.confirmDialogVisible = true
        }
      })
    },
    handleWithdrawCurrencyChange(val) {
      let opt = {}
      opt = this.amountInfo[val]
      opt ? this.withdrawOrderInfo.availableAmount = opt.available : this.withdrawOrderInfo.availableAmount = 0
    },
    handleAjustmentCurrencyChange(val) {
      let opt = {}
      opt = this.amountInfo[val]
      opt ? this.manualAccountAdjustmentOrderInfo.total = this.currencyIcons[val] + opt.available : this.manualAccountAdjustmentOrderInfo.total = this.currencyIcons[val] + 0
    },
    getNewstMerchantInfo() {
      getMerchantInfo({merchantUserName: this.filterbox.name, isNeedCardData: true}).then(res => {
        if (res.status === 200) {
          if (res.data.code === 0) {
            let allData = JSON.parse(res.data.data)
            this.merchantInfo = allData.merchantInfoDtoList
            this.amountInfo = allData.cardInfo
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
