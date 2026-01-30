<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">代理账号</div>
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
          工具栏
        </span>
      </template>
      <div class="main-toolbar" style="height: auto;">
        <el-form class="main-toolform" style="height: 100%;display:flex;margin-left:3%" ref="filteboxForm"
                 :model="filterbox">
          <el-row>
            <el-col :span="7">
              <el-form-item label="创建时间:" label-width="150px" prop="filterDateRange">
                <el-date-picker
                    v-model="filterbox.filterDateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY/MM/DD"
                    value-format="x"
                    clearable
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="收款账号地址:" label-width="150px" prop="walletAddr">
                <el-input style="width: 200px" v-model="filterbox.walletAddr" placeholder="收款账号地址"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="代理名称:" label-width="150px" prop="name">
                <div style="display: flex;flex-direction: row">
                  <el-input v-model="filterbox.name" clearable type="text" placeholder="代理名称" style="width:300px">
                  </el-input>
                  <el-button class="filterButton" @click="reset('filteboxForm')">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>重置</div>
                  </el-button>
                  <el-button class="filterButton" @click="search">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>搜索</div>
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
        新增
      </el-button>
      <el-button @click="createWithdrawlApply" class="filterButton">
        <SvgIcon name="withdrawl" class="filterButtonSvg"/>
        提现申请
      </el-button>
      <el-button @click="createManualAccountAdjustment" class="filterButton">
        <template #icon>
          <div style="width: 100%">
            <SvgIcon class="filterButtonSvg" name="manualaccountadjustment"/>
          </div>
        </template>
        <div>手工调账</div>
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
            label="代理名称"
            align="center"
        >
          <div>{{ row.name }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="代理账号"
            align="center"
        >
          <div>{{ row.userName }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="代理钱包"
            align="center"
        >
          <div>{{ row.walletName }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="代理钱包地址"
            align="center"
        >
          <div>{{ row.walletAddr }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="账号启用状态"
            align="center"
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
            />
          </div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="录入时间"
            align="center"
        >
          <div>{{ formatTimeByZone(row.createTime) }}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="创建人"
            align="center"
        >
          <div>{{ row.createBy }}</div>
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
                <el-dropdown-item @click="editAgentAccount(row)">编辑</el-dropdown-item>
                <el-dropdown-item v-if="row.status === 0" @click="startAgentAccount(row)">启用</el-dropdown-item>
                <el-dropdown-item v-if="row.status === 1" @click="stopAgentAccount(row)">停用</el-dropdown-item>
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
            label="代理名称:"
            label-width="150px"
            prop="merchantAgentId"
        >
          <!--            <el-input style="width: 200px" v-model="createAgentAccountModel.agentName"/>-->
          <el-select
              v-model="createAgentAccountModel.merchantAgentId"
              :options="agentOptions"
              :props="agentProps"
              style="width: 200px"
              placeholder="select agent"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="dialogType !== 'start' && dialogType !== 'stop'" :span="24" class="addDialog">
        <el-form-item
            label="钱包名称:"
            label-width="150px"
            prop="walletName"
        >
          <el-input style="width: 200px" v-model="createAgentAccountModel.walletName"/>
        </el-form-item>
      </el-col>
      <el-col v-if="dialogType !== 'start' && dialogType !== 'stop'" :span="24" class="addDialog">
        <el-form-item
            label="收款账号:"
            label-width="150px"
            prop="walletAddr"
        >
          <el-input style="width: 200px" v-model="createAgentAccountModel.walletAddr"/>
        </el-form-item>
      </el-col>
      <!--      <el-col v-if="dialogType !== 'start' && dialogType !== 'stop'" :span="24" class="addDialog">
              <el-form-item
                  label="钱包名称:"
                  label-width="150px"
                  prop="walletName"
              >
                <el-input style="width: 200px" v-model="createAgentAccountModel.walletName"/>
              </el-form-item>
            </el-col>-->
      <el-col v-if="dialogType !== 'start' && dialogType !== 'stop'" :span="24" class="addDialog">
        <el-form-item
            label="是否启用:"
            label-width="150px"
            prop="walletName"
        >
          <el-switch
              v-model="createAgentAccountModel.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="关闭"
              :active-value="1"
              :inactive-value="0"
              style="width: 200px"
          >

          </el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="addDialog">
        <el-form-item
            label="谷歌验证码:"
            label-width="150px"
            prop="googleCode"
        >
          <el-input style="width: 200px" v-model="createAgentAccountModel.googleCode"/>
        </el-form-item>
      </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog('createAccountForm')">取 消</el-button>
      <el-button type="primary" @click="submit('createAccountForm')">确 定</el-button>
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
        <el-form-item label="代理名称:" label-width="150px" prop="merchantAgentId">
          <el-select
              :options="agentAccountOptions"
              :props="agentAccountProps"
              style="width: 200px"
              v-model="withdrawOrderInfo.merchantAgentId"
              @change="handleAgentChange"
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
              :options="agentAccountOptions"
              :props="agentWalletProps"
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

<script>
import {
  createAgentAccountInfo, createStatementeOrderApply, exportAgentAccount, exportMerchantAccount,
  getAgentAccountInfo, getAgentInfo,
  getAllCurrencyType, getMerchantAccount, getMerchantInfo, modifyAgentAccountInfo,
  modifyAgentInfo
} from "@/api/interface/backendInterface.js";
import {exportExcel, getAgentAccountTitle, getFormateTime, getMerchantAccountTitle, loadingBody} from "@/api/common.js";

export default {
  name: 'WithdrawlHistory',
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
      amountInfo: {},
      filterAvaiable: false,
      timeZoneKey: localStorage.getItem("timeZone") || "UTC+8",
      withdrawOrderInfo: {},
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
      createAgentAccountModel: {},
      agentTotalAmount: '10',
      agentAvailableBalance: '0.1',
      agentFreezeAmount: '9.9',
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 200],
      createAccountRules: {
        merchantAgentId: {
          required: true, messages: 'you need to select a merchant', trigger: 'blur'
        },
        walletAddr: {
          required: true, messages: 'you need to type walletAddr', trigger: 'blur'
        },
        walletName: {
          required: true, messages: 'you need to type walletAddr', trigger: 'blur'
        },
        googleCode: {
          required: true, messages: 'you need to type walletAddr', trigger: 'blur'
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
    }
  },
  methods: {
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
        const fileName = '代理账号信息表' + getFormateTime()
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
      this.agentAccountOptions = Object.assign([], opt)
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
      this.createAccountVisible = true
      this.createAccountTitle = '新增代理账号'
      this.dialogType = 'create'
      this.submitType = 'create'
    },
    createWithdrawlApply() {
// set withdraw merchant
      if(this.roleName === 'merchant') {
        const merchantInfo = this.merchantAccountOptions[0]
        this.withdrawOrderInfo.merchantAgentId = merchantInfo.merchantAgentId
        this.handleMerchantChange(this.withdrawOrderInfo.merchantAgentId)
      }
      this.dialogWithdrawVisible = true
      this.dialogWithdrawTitle = '提现'
      this.withdrawOrderInfo.orderType = 2
    },
    editAgentAccount(row) {
      this.createAgentAccountModel = {}
      this.createAgentAccountModel = row
      this.createAccountVisible = true
      this.createAccountTitle = '修改'
      this.submitType = 'edit'
    },
    startAgentAccount(row) {
      this.createAgentAccountModel = row
      this.createAgentAccountModel.status = 1
      this.dialogType = 'start'
      this.createAccountVisible = true
      this.createAccountTitle = '启用账号'
    },
    stopAgentAccount(row) {
      this.createAgentAccountModel = row
      this.createAgentAccountModel.status = 0
      this.dialogType = 'start'
      this.createAccountVisible = true
      this.createAccountTitle = '停用账号'
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
          if (this.submitType === 'create') {
            // request interface to create Account
            createAgentAccountInfo(this.createAgentAccountModel).then(res => {
              if (res.status === 200 && res.data.code === 0) {
                this.createAccountVisible = false
                this.createAccountTitle = ''
                this.dialogType = ''
                this.$refs[form].resetFields()
                this.submitType = ''
                this.search()
                this.$notify({
                  title: 'Success',
                  message: 'Create Account Successfully',
                  duration: 3000,
                  position: 'bottom-right',
                  type: 'success'
                })
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
                  message: 'Create Account Failed',
                  duration: 3000,
                  position: 'bottom-right',
                  type: 'error'
                })
              }
            })
          } else {
            modifyAgentAccountInfo(this.createAgentAccountModel).then(res => {
              if (res.status === 200 && res.data.code === 0) {
                this.createAccountVisible = false
                this.createAccountTitle = ''
                this.dialogType = ''
                this.$refs[form].resetFields()
                this.submitType = ''
                this.$notify({
                  title: 'Success',
                  message: 'Create Account Successfully',
                  duration: 3000,
                  position: 'bottom-right',
                  type: 'success'
                })
                this.search()
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
                  message: 'Create Account Failed',
                  duration: 3000,
                  position: 'bottom-right',
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },
    cancelDialog(form) {
      this.$refs[form].resetFields();
      this.createAccountVisible = false
      this.createAccountTitle = ''
      this.dialogType = ''
    },
    handleWithdrawCurrencyChange(val) {
      let opt = {}
      this.amountInfo ? opt = this.amountInfo[val] : opt = null

      opt ? this.withdrawOrderInfo.availableAmount = opt.available : this.withdrawOrderInfo.availableAmount = 0
    },
    cancelWithdraw(form) {
      this.$refs[form].resetFields()
      this.dialogWithdrawTitle = ''
      this.dialogWithdrawVisible = false
      this.updateAgentAccount(null)
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
      let orderMessage = form.orderType === 1 ? 'Recharge' : form.orderType === 2 ? 'Withdraw' : 'Manual Account Adjustment'
      this.$refs[form].validate(validate => {
        if (validate) {
          createStatementeOrderApply(this.confirmData).then(res => {
            this.confirmDialogTitle=''
            this.confirmDialogVisible = false
            if (res.status === 200 && res.data.code === 0) {
              this.$refs[form].resetFields()
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
    getNewstAgentInfo() {
      getAgentInfo({merchantUserName: this.filterbox.name, isNeedCardData: true}).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.agentOptions = allData.agentInfoDtoList
          this.amountInfo = allData.cardInfo
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
      if (res.status === 200) {
        if (res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
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
</style>
