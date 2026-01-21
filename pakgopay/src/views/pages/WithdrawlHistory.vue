<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateDate} from "@/api/common.js";
</script>

<template>
  <div class="main-title">代理账号</div>
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
      <el-button @click="exportAgentStatement()" class="filterButton">
        <SvgIcon class="filterButtonSvg" name="export"/>
        导出
      </el-button>
      <el-button @click="addWithdrawlAccount" class="filterButton">
        <SvgIcon name="add" class="filterButtonSvg"/>
        新增
      </el-button>
      <el-button @click="createWithdrawlApply" class="filterButton">
        <SvgIcon name="withdrawl" class="filterButtonSvg"/>
        提现申请
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
            label="代理提现账户"
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
          <div>{{ getFormateDate(row.createTime) }}</div>
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
      <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          style="float:right; margin-right: 5%; position: sticky;display: flex;"
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
</template>

<script>
import {
  createAgentAccountInfo, exportAgentAccount, exportMerchantAccount,
  getAgentAccountInfo, getAgentInfo,
  getAllCurrencyType, modifyAgentAccountInfo,
  modifyAgentInfo
} from "@/api/interface/backendInterface.js";
import {exportExcel, getAgentAccountTitle, getFormateTime, getMerchantAccountTitle, loadingBody} from "@/api/common.js";

export default {
  name: 'WithdrawlHistory',
  data() {
    return {
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
      pageSizes: [5, 10, 15, 20],
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
      }
    }
  },
  methods: {
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
    handleAgentChange(val) {
      this.createAgentAccountModel.name = val;
    },
    search() {
      this.filterbox.isNeedCardData = true
      if(this.filterbox.filterDateRange) {
        this.filterbox.startTime = this.filterbox.filterDateRange[0]/1000
        this.filterbox.endTime = this.filterbox.filterDateRange[1]/1000
      }
      const loadingInstance = loadingBody(this, 'agentAccountTable')
      getAgentAccountInfo(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let allData = JSON.parse(res.data.data)
          this.withdrawAccountData = allData.withdrawalAccountsDtoList;
          this.totalCount = allData.totalNumber
          this.pageNo = allData.pageNo
          this.pageSize = allData.pageSize
          this.tableKey++

          /*if(allData.cardInfo) {
            const cardInfo = allData.cardInfo[this.filterbox.currency]
            this.agentTotalAmount = cardInfo.total
            this.agentFreezeAmount = cardInfo.frozen
            this.agentAvailableBalance = cardInfo.withdraw
          } else {
            this.agentTotalAmount =  this.currencyIcons[this.currency] + 0
            this.agentFreezeAmount = this.currencyIcons[this.currency] + 0
            this.agentAvailableBalance = this.currencyIcons[this.currency] + 0
          }*/

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
      })
    },
    addWithdrawlAccount() {
      this.createAccountVisible = true
      this.createAccountTitle = '新增代理账号'
      this.dialogType = 'create'
      this.submitType = 'create'
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
    handleCurrencyChange() {
      this.currency = this.filterbox.currency;
      this.currencyIcon = this.currencyIcons[this.currency]
      this.search()
    },
  },
  async mounted() {
    await getAllCurrencyType().then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data)
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

    getAgentInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.agentOptions = JSON.parse(res.data.data).agentInfoDtoList
      }
    })
    this.search()
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

.addDialog {
  display: flex;
  justify-content: center;
  justify-items: center;
}

.dialog-footer {
  display: flex;
  float: right;
  margin-right: 5%;
}
</style>