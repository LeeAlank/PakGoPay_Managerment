<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate, getFormateTimeByTimeBystamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">商户账号</div>
  <div style="display: flex;align-items: inherit;margin-top: 1%;margin-bottom:0">
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
  </div>
  <div class="statistics-container"
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
  </div>
  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 1%;margin-right: 3%;">
    <el-collapse-item>
      <template #title>
         <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <el-row style="display: flex;justify-content: space-around;">
            <el-form-item label="商户账号" label-width="150px" prop="name">
              <el-input style="width: 200px" v-model="filterbox.name"/>
            </el-form-item>
            <el-form-item label="收款账号" label-width="150px" prop="walletAddr">
              <el-input style="width: 200px" v-model="filterbox.walletAddr"/>
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
                <div v-on:click="reset('filterboxForm')"
                     style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                  <SvgIcon height="30px" width="30px" name="reset"/>
                  <div style="width: 50px;color: white">重置</div>
                </div>
                <div v-on:click="search()"
                     style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                  <SvgIcon height="30px" width="30px" name="search"/>
                  <div style="width: 50px;color: white">查询</div>
                </div>
              </div>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="reportInfo" style="margin-left: 1%;margin-right: 3%;margin-top: 1%;width: 95%;">
    <!--
     商户展示为一条 提现账户展示多条
     客服/管理员展示所有商户下的所有账号
     -->
    <form class="main-views-form" style="height: auto;width: 100%;">
      <div style="display: flex;flex-direction: row;float: right">
        <el-button @click="exportStatements()">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon style="height: 25px;width: 25px" name="export"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">导出</div>
        </el-button>
        <el-button @click="addWithdrawlAccount()" style="margin: 0">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon style="height: 25px;width: 25px" name="add"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">新增</div>
        </el-button>
        <el-button @click="createWithdrawOrder" style="margin: 0">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon style="height: 25px;width: 25px" name="withdrawl"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">提现</div>
        </el-button>
        <el-button @click="createRechargeOrder" style="margin: 0">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon style="height: 25px;width: 25px" name="recharge"/>
            </div>
          </template>
          <div style="color: black;margin-left: 8px">充值</div>
        </el-button>
        <el-button @click="createManualAccountAdjustment" style="margin: 0">
          <template #icon>
            <div style="width: 100%">
              <SvgIcon height="50px" width="50px" name="manualaccountadjustment" style="height: 25px;width: 25px"/>
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
            label="商户提现账户"
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
        >
          <div>
            <div>
              <el-button style="background-color: mediumseagreen" @click.prevent="editMerchantInfo(row)">编辑
              </el-button>
              <!--              <el-popconfirm
                                title="Are you sure deleting this data?"
                                confirm-button-text="确认"
                                icon-color="red"
                                cancel-button-text="取消"
                                @confirm="deleteMerchant(row.merchantAccount)"
                                type="warning"
                                width="100px;"
                            >
                              <template #reference>
                                <el-button style="background-color: orangered">删除</el-button>
                              </template>
                            </el-popconfirm>-->
              <!--<el-button style="background-color: orangered" @click.prevent="delete(row.merchantAccount)">删除</el-button>-->
            </div>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          style="float:right; margin-right: 5%;"
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
                     :options="merchantAccountOptions"
                     :props="merchantAccountProps"
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
      <div class="el-form-line">
        <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
          <el-input type="number" v-model="withdrawAccountInfo.googleCode" style="width: 200px"
                    @mousewheel.native.prevent/>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog('createMerchantAccountForm')">取 消</el-button>
      <el-button type="primary" @click="submitMerchantAccount('createMerchantAccountForm')">确 定</el-button>
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
    <el-form :model="withdrawOrderInfo" label-width="100%" class="form" ref="withdrawOrderInfoForm" :rules="withdrawOrderRule">
      <div class="el-form-line">
        <el-form-item label="商户名称:" label-width="150px" prop="merchantUserId">
          <el-select
              :options="merchantAccountOptions"
              :props="merchantAccountProps"
              style="width: 200px"
              v-model="withdrawOrderInfo.merchantAgentId"
              @change="handleMerchantChange"
          >
          </el-select>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="可用余额:" label-width="150px" prop="availableAmount">
          <el-input v-model="withdrawOrderInfo.amount" style="width: 200px"></el-input>
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
        <el-form-item label="提现金额:" label-width="150px" prop="withdrawAmount">
          <el-input type="number" v-model="withdrawOrderInfo.withdrawAmount" style="width: 200px"/>
        </el-form-item>
      </div>
      <div class="el-form-line">
        <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
          <el-input v-model="withdrawOrderInfo.googleCode" style="width: 200px"/>
        </el-form-item>
      </div>
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
            :options="merchantAccountOptions"
            :props = "merchantAccountProps"
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
      <div class="el-form-line">
        <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
          <el-input v-model="rechargeOrderInfo.googleCode" style="width: 200px"/>
        </el-form-item>
      </div>
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
        <el-form-item label="商户:" label-width="150px" prop="merchantUserId">
          <el-select
              :options="merchantAccountOptions"
              :props = "merchantAccountProps"
              v-model="manualAccountAdjustmentOrderInfo.merchantUserId"
              style="width: 200px"
          >
          </el-select>
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
              :active-value = "1"
              :inactive-value="0"
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
      <div class="el-form-line">
        <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
          <el-input v-model="manualAccountAdjustmentOrderInfo.googleCode" style="width: 200px"/>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-right: 3%">
      <el-button @click="cancelManualAccountAdjustment('manualAccountAdjustmentOrderInfoForm')">取 消</el-button>
      <el-button type="primary" @click="submitManualAccountAdjustment('manualAccountAdjustmentOrderInfoForm')">确 定</el-button>
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
    return {
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
      statisticsInfo: {},
      dialogFormVisible: false,
      dialogTitle: '',
      selectedMerchentName: '',
      selectAccountVisible: true,
      merchantAccountOptions: [],
      merchantAccountProps: {
        value: 'merchantAgentId',
        label: 'name',
      },
      merchantWalletProps: {
        value: 'walletAddr',
        label: 'walletName',
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
        merchantAccount: '',
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
        googleCode: '',
      },
      filterbox: {
        merchantAccount: "",
        withdrawlAccount: "",
      },
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
        },
        googleCode: {
          required: true, trigger: 'blur'
        }
      },
      withdrawOrderRule: {
        merchantUserId: {
          required: true, trigger: 'blur',
        },
        walletAddr: {
          required: true, trigger: 'blur'
        },
        withdrawAmount: {
          required: true, trigger: 'blur'
        },
        googleCode: {
          required: true, trigger: 'blur'
        }
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
        merchantUserId: {
          required: true, trigger: 'blur',message: 'you need to select merchant'
        },
        amount: {
          required: true, trigger: 'blur', message: 'type amount'
        },
        googleCode: {
          required: true, trigger: 'blur', message: 'you need to select googleCode'
        }
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [1, 5, 10, 15, 20],
    }
  },
  methods: {
    handleMerchantChange(value) {
      let opt= {};
      opt= this.merchantAccountOptions.find((item)=>{
        return item.merchantAgentId === value;
      });
      this.withdrawOrderInfo.mercahntAgentName = opt.name;
    },
    handleRechargeMerchantChange(value) {
      let opt= {};
      opt= this.merchantAccountOptions.find((item)=>{
        return item.merchantAgentId === value;
      });
      this.rechargeOrderInfo.merchantAgentName = opt.name;
    },
    exportStatements() {
      this.filterbox.columns = getMerchantAccountTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
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
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
      }
      getMerchantAccount(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const all = JSON.parse(res.data.data)
          const allData = all.withdrawalAccountsDtoList
          this.merchantAccountOptions = allData
          const allCardData = all.cardInfo
          if (allCardData) {
            const cardInfo = allCardData[this.currency]
            this.statisticsInfo.total = cardInfo.total
            this.statisticsInfo.frozen = cardInfo.frozen
            this.statisticsInfo.withdraw = cardInfo.withdraw
          } else {
            this.statisticsInfo.total = this.currencyIcons[this.currency] + 0
            this.statisticsInfo.frozen = this.currencyIcons[this.currency] + 0
            this.statisticsInfo.withdraw = this.currencyIcons[this.currency] + 0
          }
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
        loadingInstance.close()
      }).catch(err => {
        loadingInstance.close()
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
    },
    submitMerchantAccount(form) {

      this.$refs[form].validate(validate => {
        if (validate) {
          if (this.filterbox.submitType === 'create') {
            createMerchantAccount(this.withdrawAccountInfo).then(res => {
              if (res.status === 200 && res.data.code === 0) {
                this.$refs[form].resetFields()
                this.$notify({
                  title: 'Success',
                  type: 'success',
                  message: 'Create New Merchant Account Successfully.',
                  duration: 3000,
                  position: 'bottom-right'
                })
                this.dialogTitle = ''
                this.dialogFormVisible = false
                this.$refs[form].resetFields()
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
          } else if (this.filterbox.submitType === 'edit') {
            modifyMerchantAccount(this.withdrawAccountInfo).then(res => {
              if (res.status === 200 && res.data.code === 0) {
                this.$notify({
                  title: 'Success',
                  type: 'success',
                  message: 'Modify Merchant Account Successfully.',
                  duration: 3000,
                  position: 'bottom-right'
                })
                this.search()
                this.dialogTitle = ''
                this.dialogFormVisible = false
                this.$refs[form].resetFields()
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
          }
        } else {

        }
      })
      this.submitType = ''
    },
    createWithdrawOrder() {
      // set withdraw merchant
      const merchantInfo = this.merchantAccountOptions[0]
      this.withdrawOrderInfo.merchantUserId = merchantInfo.merchantAgentId
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
    },
    cancelWithdraw(form) {
      this.$refs[form].resetFields()
      this.dialogWithdrawTitle = ''
      this.dialogWithdrawVisible = false
    },
    submitWithdraw(form) {
      this.$refs[form].validate(validate => {
        if (validate) {
          createStatementeOrderApply(this.withdrawOrderInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.dialogWithdrawVisible = false
              this.dialogWithdrawTitle = ''
              this.$refs[form].resetFields()
              this.$notify({
                title: 'Success',
                type: 'success',
                message: 'Create Withdraw Order Successfully.',
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
          createStatementeOrderApply(this.rechargeOrderInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.dialogRechargeVisible = false
              this.dialogRechargeTitle = ''
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
          })
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
          createStatementeOrderApply(this.manualAccountAdjustmentOrderInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.dialogManualAccountAdjustmentVisible = false
              this.dialogManualAccountAdjustmentTitle = ''
              this.$refs[form].resetFields()
              this.$notify({
                title: 'Success',
                type: 'success',
                message: 'Create Manual Account Successfully.',
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
          })
        }
      })
    }
  },
  mounted() {

    // get all merchant info

    getAllCurrencyType().then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data)
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

:deep().el-table th.is-leaf {

  background-color: lightskyblue;
  color: white;
  font-weight: bold;
  font-size: larger;
}
</style>