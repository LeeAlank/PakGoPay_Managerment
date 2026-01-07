<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">商户账号</div>
  <div class="main-toolbar">
    <el-form class="main-toolform">
<!--      <div class="main-toolform-item">
        <div class="main-toolform-line" style="justify-content: right;margin-right: 4%;">
          <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="reset"/>
            <div style="width: 50px;color: white">重置</div>
          </div>
          <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="search"/>
            <div style="width: 50px;color: white">查询</div>
          </div>
        </div>
      </div>-->
<!--      <div class="main-toolform-item">
        <div class="main-toolform-line">商户账号：<input v-model="filterbox.merchantAccount"  type="text" class="main-toolform-input" placeholder="商户账号"/></div>
        <div class="main-toolform-line">提现账号：<input v-model="filterbox.withdrawlAccount"  type="text" class="main-toolform-input" placeholder="提现账号"/></div>
      </div>-->
      <el-row style="display: flex;justify-content: space-around;">
        <el-form-item label="商户账号" label-width="150px">
          <el-input style="width: 200px" v-model="filterbox.merchantName"/>
        </el-form-item>
        <el-form-item label="收款账号" label-width="150px">
          <el-input style="width: 200px" v-model="filterbox.withdrawlAccount"/>
        </el-form-item>
        <el-form-item label="录入时间" label-width="150px">
          <el-date-picker
              v-model="filterDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY/MM/DD"
              value-format="x"
          >
          </el-date-picker>
          <div style="display: flex;flex-direction: row;">
            <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
              <SvgIcon height="30px" width="30px" name="reset"/>
              <div style="width: 50px;color: white">重置</div>
            </div>
            <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
              <SvgIcon height="30px" width="30px" name="search"/>
              <div style="width: 50px;color: white">查询</div>
            </div>
          </div>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
  <div style="display: flex;height: 12vh;justify-content: space-between;margin-right: 10%;margin-left: 10%;">
    <el-card style="width: 30%;height: 100%;margin-top: 1%;">
      <div style="display: flex;">
        <SvgIcon name="cash" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>总账户金额:</span>
          <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
    <el-card style="width: 30%;height: 100%;margin-top: 1%;">
        <div style="display: flex;">
          <SvgIcon name="cash-freeze" width="100px" height="100px"/>
          <div style="display: flex; flex-direction: column;width: 80%;">
            <span>冻结总金额:</span>
            <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
          </div>
        </div>
    </el-card>
    <el-card style="width: 30%;height: 100%;margin-top: 1%;">
      <div style="display: flex;">
        <SvgIcon name="tixian" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>提现总金额:</span>
          <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>
  <div class="main-views-container" style="height: 550px;margin-top: 3%;">
    <!--
     商户展示为一条 提现账户展示多条
     客服/管理员展示所有商户下的所有账号
     -->
    <form class="main-views-form" style="height: 600px;width: 97%;">
      <div style="display: flex;flex-direction: row;float: right">
        <el-button v-on:click="exportStatements()" style="width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
          <SvgIcon height="30px" width="30px" name="export"/>
          <div style="width: 50px;color: black">导出</div>
        </el-button>
        <el-button v-on:click="addWithdrawlAccount()" style="width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
          <SvgIcon height="30px" width="30px" name="add"/>
          <div style="width: 50px;color: black">新增</div>
        </el-button>
      </div>
      <el-table
          border :data="withdrawAccountFormData"
          class="merchantInfos-table"
          style="width: 100%;height: 100%;"
      >
        <el-table-column
            prop="商户名称"
            label="商户名称"
            v-slot="{row}"
            align="center"
            style="height: 100%;"
        >
          <div>
            {{row.merchantName}}
          </div>
        </el-table-column>
        <el-table-column
            label="商户账号"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.merchantAccount}}
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantWithdrawAccount"
            label="商户提现账户"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.merchantWithdrawAccountr}}
          </div>
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="录入时间"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.createTime}}
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
                v-model="row.withdrawlAccountStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                disabled>
            </el-switch>
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
              <el-button style="background-color: mediumseagreen" @click.prevent="editMerchantInfo(row)">编辑</el-button>
              <el-popconfirm
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
              </el-popconfirm>
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
          style="position: sticky; bottom: 0px;float: right;right: 40px"
      >
      </el-pagination>
    </form>
  </div>


  <el-dialog
      :title="dialogTitle"
      v-model="dialogFormVisible"
      class="dialog"
      center="true"
      width="70%"
      height="50%"
  >
    <!--
      客服：各列信息由后端返回列表，前端页面下拉选择
      商户：后端返回单列表，下拉结果回显
     -->
    <el-form ref="form" :model="withdrawAccountInfo" label-width="100%" class="form">
          <div class="el-form-line">
            <el-form-item label="商户名称:" label-width="150px" size="medium" style="width: 400px;">
<!--              <el-input v-model="withdrawAccountInfo.merchantAccount" style="width: 200px"/>-->
              <el-select v-model="selectedMerchentName"
                         @change="handleChange"
                         placeholder="请选择商户"
              >
                <el-option
                  v-for = "item in merchantAccountOptions"
                  :key = "item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="selectAccountVisible"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="el-form-line">
            <el-form-item label="商户账号:" label-width="150px" size="medium" style="width: 400px;">
              <el-input disabled v-model="withdrawAccountInfo.merchantAccount" style="width: 200px"></el-input>
            </el-form-item>
          </div>
          <div class="el-form-line">
            <el-form-item label="可用余额:" label-width="150px" size="medium" style="width: 400px;">
              <el-input disabled v-model="withdrawAccountInfo.balance" style="width: 200px"></el-input>
            </el-form-item>
          </div>
          <div class="el-form-line">
            <el-form-item label="收款账号:" label-width="150px" size="medium" style="width: 400px;">
              <el-select
                  v-model="withdrawAccountInfo.withdrawlAccount"
                  multiple
                  placeholder="请选择收款账号"
                  style="width: 200px"
              >
                <el-option
                    v-for="item in withdrawAccountInfo.withdrawlAccountOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="el-form-line">
            <el-form-item label="谷歌验证码:" label-width="150px" size="medium" style="width: 400px;">
              <el-input type="number" v-model="withdrawAccountInfo.googleCode" style="width: 200px" @mousewheel.native.prevent/>
            </el-form-item>
          </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary">确 定</el-button>
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

const filterDateRange = ref('')
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: '',
      selectedMerchentName: '',
      selectAccountVisible: true,
      merchantAccountOptions: [],
      allMerchantInfo: [
        {
          merchantName:'123',
          merchantAccount:'123123',
          balance:'11',
        },
        {
          merchantName:'狗几把',
          merchantAccount:'leealank4@gmail.com',
          balance:'100000',
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
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [1, 5, 10, 15, 20],
    }
  },
  methods: {
    addWithdrawlAccount() {
      this.dialogFormVisible = true;
      this.dialogTitle = '新增收款账号'

      /**
       *  客服点击新增后,页面选择商户后，根据商户账号获取该账户可用余额自动填充
       *  商户点击新增后，直接填充
       * */
      // 商户处理方案：
      //填充新增页面商户账号值
      /*if (localStorage.getItem('role') === '006') {
        this.selectedMerchentAccount = this.allMerchantInfo[0].merchantAccount;
      this.withdrawAccountInfo.balance = this.allMerchantInfo[0].balance;
      this.withdrawAccountInfo.merchantName = this.allMerchantInfo[0].merchantName;
      }*/
      //客服处理方案 下拉用户，在此之前需要先对商户账号/商户名称/可用余额进行关联处理
      //生成可显示的option
      let options = [];
      this.allMerchantInfo.forEach(item => {
          let option = {
            value: item.merchantAccount,
            label: item.merchantName
          }
          options.push(option)
      });
      this.merchantAccountOptions = options;
      this.selectAccountVisible = false;

    },
    handleChange(val) {
      //选择商户后自动填充商户账号
      this.allMerchantInfo.forEach(item => {
        if (item.merchantAccount === val) {
          this.withdrawAccountInfo.merchantAccount = item.merchantAccount;
          this.withdrawAccountInfo.balance = item.balance;
          return
        }
      })
    },
    cancelDialog() {
      this.dialogFormVisible = false;
    }
  }
}
</script>
<style scoped>
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
.form{
  margin-top: 3%;
  height: 300px;
}
.el-form-line {
  display: flex;
  justify-content: center;
}

input::-webkit-inner-spin-button{
  -webkit-appearance: none !important;
}

:deep().el-table th.is-leaf {

  background-color: lightskyblue;
  color: white;
  font-weight: bold;
  font-size: larger;
}
</style>