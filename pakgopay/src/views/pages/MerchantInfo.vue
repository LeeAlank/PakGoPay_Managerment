<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">商户信息</div>
  <!-- 工具栏 -->
  <div class="main-toolbar">
    <form class="main-toolform">
      <div class="main-toolform-item">
        <div class="main-toolform-line" style="justify-content: right;margin-right: 3%;">
          <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="reset"/>
            <div style="width: 50px;color: white">重置</div>
          </div>
          <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="search"/>
            <div style="width: 50px;color: white">查询</div>
          </div>
          <div v-on:click="addMerchant()" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="add"/>
            <div style="width: 50px;color: white">新增</div>
          </div>
        </div>
      </div>
      <div class="main-toolform-item">
        <div class="main-toolform-line">商户账号：<input v-model="filterbox.merchantAccount"  type="text" class="main-toolform-input" placeholder="商户账号"/></div>
        <div class="main-toolform-line">商户名称：<input v-model="filterbox.merchantName"  type="text" class="main-toolform-input" placeholder="商户名称"/></div>
        <div class="main-toolform-line">启用状态：
          <el-switch
              v-model="filterbox.isInUse"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用"
          ></el-switch>
        </div>
        <div class="main-toolform-line">支持币种：<input v-model="filterbox.supportCurrency" type="text" class="main-toolform-input" placeholder="支持币种"/></div>
        <div class="main-toolform-line">所属代理：<!--<input style="width: 150px;" v-model="filterbox.belongAgent" type="text" class="main-toolform-input" placeholder="所属代理"/>-->
            <el-cascader
                v-model="filterbox.belongAgent"
                :options="agentOptions"
                @change="handleAgentChange"
            >

            </el-cascader>
        </div>
      </div>
    </form>
  </div>

  <div class="merchantInfos">
    <form id="merchantInfoForm" class="merchantInfoFormT">
      <el-table
          border :data="merchantInfoFormData"
          class="merchantInfos-table"
          style="width: 97%"
          height="500px"
      >
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
            prop="商户名称"
            label="商户名称"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.merchantName}}
          </div>
        </el-table-column>
        <el-table-column
            prop="payingCommisson"
            label="商户代理"
            v-slot="{row}"
            align="center"
        >
          <div>
            <div style="display: flex;">一级代理：<div>{{row.merchantAgent.label}}</div></div>
            <div style="display: flex;" v-if="row.merchantAgent.hasOwnProperty('children')">二级代理：<div>{{row.merchantAgent.children[0].label}}</div></div>
            <div style="display: flex;" v-if="row.merchantAgent.hasOwnProperty('children') && row.merchantAgent.children[0].hasOwnProperty('children')">三级代理：<div>{{row.merchantAgent.children[0].children[0].label}}</div></div>
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantStatus"
            label="商户状态"
            v-slot="{row}"
            align="center"
        >
          <div>
            <el-switch
                v-model="row.merchantStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                disabled
            >
            ></el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="loginIPWhiteList"
            label="登陆提现IP白名单"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.loginIPWhiteList}}
          </div>
        </el-table-column>
        <el-table-column
            prop="payingIPWhiteList"
            label="代付IP白名单"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.payingIPWhiteList}}
          </div>
        </el-table-column>
        <el-table-column
            prop="collectingIPWhiteList"
            label="代收IP白名单"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.collectingIPWhiteList}}
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantAccountInfo"
            label="账户信息"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div style="width: 100%;">
            <!-- 返回的是json对象 包含总金额、可用金额、冻结金额 -->
            <div style="background-color: yellow;font-size: 15px;display: flex;width: 100%;justify-content: space-between">账户总金额: <div style="font-size: 20px;float: right">{{row.merchantAccountInfo.totalAmount}}</div></div>
            <div style="background-color: limegreen;width: 100%;display: flex;justify-content: space-between">账户可用金额: <div style="font-size: 20px;float: right">{{row.merchantAccountInfo.toUseAmount}}</div></div>
            <div style="background-color: lightgrey;width: 100%;display: flex;justify-content: space-between">冻结金额: <div style="font-size: 20px;float: right">{{row.merchantAccountInfo.freezeAmount}}</div></div>
          </div>
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.createTime}}
          </div>
        </el-table-column>
        <el-table-column
            prop="currencyType"
            label="交易币种"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.currencyType}}
          </div>
        </el-table-column>
        <el-table-column
            label="操作"
            v-slot="{row}"
            align="center"
        >
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
          style="float:right; margin-right: 5%;"
      >
      </el-pagination>
    </form>
  </div>

  <!-- 新增/修改弹出页面 -->
  <el-dialog
      :title="dialogTitle"
      v-model="dialogFormVisible"
      class="dialog"
      center="true"
      width="70%"
      height="50%"
  >
    <el-form ref="form" :model="merchantInfo" label-width="100%" class="form">
      <el-row>
        <el-col :span="6">
          <el-form-item label="商户账号:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.merchantAccount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户名称:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.merchantName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登陆密码:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.merchantPassword" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="确认密码:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.merchantConfirmPassword" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="所属代理:" label-width="150px" size="medium">
<!--            <el-input v-model="merchantInfo.belongAgent" style="width: 200px"></el-input>-->
<!--            <el-select v-model="selectedAgent1" placeholder="请选择代理商" style="width: 300px" @change="handleChange">
              <el-option
                v-for="item in agentOptions"
                :key="item.value"
                :label="item.label"
                :value="{value:item.value,label:item.label}"
              >
              </el-option>
            </el-select>
            <el-select v-if="agent2isVisiable" v-model="selectedAgent2" placeholder="请选择代理商" style="width: 300px" @change="handleChange2">
              <el-option
                  v-for="item in agentOptions2"
                  :key="item.value"
                  :label="item.label"
                  :value="{value:item.value,label:item.label}"
              >
              </el-option>
            </el-select>
            <el-select v-if="agent3isVisiable" v-model="selectedAgent3" placeholder="请选择代理商" style="width: 300px">
              <el-option
                  v-for="item in agentOptions3"
                  :key="item.value"
                  :label="item.label"
                  :value="{value:item.value,label:item.label}"
              >
              </el-option>
            </el-select>-->
            <el-cascader
              v-model="selectedAgent"
              :options="agentOptions"
              @change="handleAgentChange"
              style="width: 200px"
              :props="{ checkStrictly: true }"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="代收白名单:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.collectingWhiteList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登陆提现IP白名单:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.loginIpList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"><el-form-item label="代付白名单:" label-width="150px" size="medium">
          <el-input v-model="merchantInfo.payingWhiteList" style="width: 200px"></el-input>
        </el-form-item></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="金额浮动模式:" label-width="150px" size="medium">
            <el-switch
                v-model="merchantInfo.cashFloatModel"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="关闭"
                @change="handleFloatChange"
            >
            </el-switch>
            <el-input v-if="merchantInfo.cashFloatModel" v-model="merchantInfo.cashFloatNum" style="width: 200px;" placeholder="请输入浮动范围"></el-input>
<!--            <el-input v-model="merchantInfo.cashFloatModel" style="width: 200px"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="支付通道:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.payingChannel" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="启用状态:" label-width="150px" size="medium">
<!--            <el-select style="width: 150px;border: solid 1px #6495ed;border-radius: 8px;text-align: center;" v-model="value" placeholder="account status">
              <el-option
                  v-for="item in isUse"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>-->
            <el-switch
                v-model="merchantInfo.isInUse"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="谷歌验证码:" label-width="150px" size="medium">
            <el-input type="number" maxlength="6" minlength="6" v-model="merchantInfo.verifyCode" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "MerchantInfo",
  data() {
    return {
      totalCount: 1,
      currentPage: 1,
      pageSize: 1,
      pageSizes: [1,10, 20, 30, 40],
      filterbox: {
        merchantAccount: '',
        merchantName: '',
        supportCurrency: '',
        belongAgent: [],
        isInUse: true,
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
        {
          merchantAccount: '12345678',
          merchantName: '测试商户1',
          merchantAgent: {value: '001', label: "一级代理商1",children: [
              {
                value: '001-001',
                label: '一级代理商下的二级代理商1'
              }]},
          merchantStatus: false,
          loginIPWhiteList: '127.0.0.1',
          payingIPWhiteList: '192.168.1.1',
          collectingIPWhiteList: '192.168.1.1',
          merchantAccountInfo: {
            totalAmount: 1000000,
            toUseAmount: 990000,
            freezeAmount: 10000,
          },
          createTime: '1999-01-01',
          currencyType: '$',
        }
      ],
      merchantInfo: {
        merchantAccount: '',
        merchantName: '',
        merchantPassword: '',
        merchantConfirmPassword: '',
        isInUse: false,
        belongAgent: [],
        collectingWhiteList: '',
        loginIpList: '',
        payingWhiteList: '',
        cashFloatModel: false,
        payingChannel: '',
        withdrawlWhiteList: '',
        verifyCode: '',
        cashFloatNum: '',
      },
      dialogTitle: '',
      dialogFormVisible: false,
      selectedAgent: [],
      agentOptions: [
        {
          value: '001',
          label: '一级代理商1',
          children: [
            {
              value: '001-001',
              label: '一级代理商下的二级代理商1'
            },
            {
              value: '001-002',
              label: '一级代理商下的二级代理商2',
              children: [
                {
                  value: '001-002-001',
                  label: '一级代理商下的二级代理商2下的三级代理商1'
                },
                {
                  value: '001-002-002',
                  label: '一级代理商下的二级代理商2下的三级代理商1'
                }
              ]
            }
          ],
        },
        {
          value: '002',
          label: '一级代理商2',
          children: [
            {
              value: '002-001',
              label: '一级代理商2下的二级代理商1'
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleCurrentChange() {

    },
    reset() {
      this.filterbox.merchantAccount = '';
      this.filterbox.isInUse = true;
      this.filterbox.supportCurrency = '';
      this.filterbox.belongAgent = [];
      this.filterbox.merchantName = '';
    },
    addMerchant() {
      this.merchantInfo = [],
      this.dialogFormVisible = true;
      this.dialogTitle='新增商户';
    },
    handleAgentChange(val) {
      alert(val)
    },
    handleFloatChange(val) {
    },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.merchantInfo = {}
      this.selectedAgent = []
      this.dialogFlag = ''
    },
    editMerchantInfo(rowInfo) {
      this.dialogFlag = 'edit';
      this.merchantInfo.merchantName = rowInfo.merchantName;
      this.merchantInfo.merchantAccount = rowInfo.merchantAccount;
      this.merchantInfo.isInUse = rowInfo.isInUse;
      this.merchantInfo.loginIpList = rowInfo.loginIPWhiteList
      this.merchantInfo.payingWhiteList = rowInfo.payingIPWhiteList;
      this.merchantInfo.collectingWhiteList = rowInfo.collectingIPWhiteList
      let agents = rowInfo.merchantAgent
      this.selectedAgent.push(agents.value)
      if(agents.hasOwnProperty("children")) {
        this.getAllAgentId(agents.children)
      }
      //this.selectedAgent = rowInfo.merchantAgent
      this.dialogFormVisible = true;
      this.dialogTitle = "修改账户信息"

    },
    getAllAgentId(agents) {
      agents.forEach(agent => {
        this.selectedAgent.push(agent.value)
        if (agent.hasOwnProperty('children')) {
          this.getAllAgentId(agent.children)
        }
      })
    },
    deleteMerchant(val) {
      alert("you delete"+val)
    }
  }
}
</script>
<style scoped>
  .dialog-footer {
    display: flex;
    justify-content: right;
  }

  .form{
    margin-top: 10%;
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
</style>