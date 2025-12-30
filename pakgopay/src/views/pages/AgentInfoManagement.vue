<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">代理信息管理</div>
  <div class="main-toolbar" style="height: 100px;">
    <form class="main-toolform" style="display: grid;align-items: center;">
      <div style="display: flex; align-items: center;">
        <div class="main-toolform-line" style="justify-content: left;margin-left: 3%;">
          代理名称：<input v-model="filterbox.agentName"  type="text" class="main-toolform-input" style="width: 150px;" placeholder="代理名称"/>&nbsp;
          <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="reset"/>
            <div style="width: 50px;color: white;font-size: 13px;">重置</div>
          </div>&nbsp;
          <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="search"/>
            <div style="width: 50px;color: white;font-size: 13px;">查询</div>
          </div>&nbsp;
        </div>
        <div class="main-toolform-line" style="justify-content: right;margin-right: 0.5%">
          <div v-on:click="addFistLevelAgent" style="background-color: deepskyblue;width:100px;display: flex; flex-direction: row;justify-content: center;cursor: pointer;align-items: center;color: greenyellow;">
            <SvgIcon height="30px" width="30px" name="add"/>
            <div style="width: 120px;color: white;font-size: 13px;">新增一级代理</div>
          </div>
          <div v-on:click="exportAgentInfo" style="background-color:forestgreen;width:50px;display: flex; flex-direction: row;justify-content: center;cursor: pointer;align-items: center;color: greenyellow;">
            <SvgIcon height="30px" width="70px" name="export"/>
            <div style="width: 120px;color: white;font-size: 13px;">导出</div>
          </div>
        </div>
      </div>
    </form>
  </div>

  <div class="main-views-container" style="height: 85%;overflow: visible">
    <form class="main-views-form" style="height: 100%;overflow: visible;">
      <el-table
          border :data="agentInfoTableData"
          class="merchantInfos-table"
          style="width: 97%;height: 100%;"
          :key="tablekey"
      >
        <el-table-column
            prop="agentNO"
            label="编号"
            v-slot="{row}"
            align="center"
            width="60px"
        >
          <div>
            {{row.agentNO}}
          </div>
        </el-table-column>
        <el-table-column
            prop="firstLevelAgent"
            label="代理信息"
            v-slot="{row}"
            align="center"
            style="height: 100px;"
        >
          <div style="height: auto;display: flex; justify-content: center;width: auto;">
              <el-card class="box-card">
                <div style="background-color: darkgrey">账号：{{row.agentAccount}}</div>
                <div style="background-color: lightblue">名称：{{row.agentName}}</div>
                <div style="background-color: lightgreen">支付渠道：{{row.payingChannel}}</div>
              </el-card>
          </div>
        </el-table-column>
        <el-table-column
            prop="secondLevelAgent"
            label="上级代理"
            v-slot="{row}"
            align="center"
        >
          <div style="height: auto;display: flex; justify-content: center;width: auto;">
            <el-card v-if="row.parentAgentInfo" class="box-card">
              <div style="background-color: darkgrey">账号：{{row.parentAgentInfo.agentAccount}}</div>
              <div style="background-color: lightblue">名称：{{row.parentAgentInfo.agentName}}</div>
              <div style="background-color: lightgreen">支付渠道：{{row.parentAgentInfo.payingChannel}}</div>
            </el-card>
          </div>
        </el-table-column>
        <el-table-column
          prop="agentLevel"
          label="层级"
          v-slot="{row}"
          align="center"
          width="100px"
        >
          <div>
            {{row.agentLevel}}
          </div>
        </el-table-column>
        <el-table-column
          prop="agentStatus"
          label="状态"
          v-slot="{row}"
          align="center"
        >
          <div>
            <el-switch
                v-model="row.agentStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                disabled
            ></el-switch>
          </div>
        </el-table-column>
        <el-table-column
          label="登陆IP"
          v-slot="{row}"
          align="center"
        >
          <div>{{row.loginIP}}</div>
        </el-table-column>
        <el-table-column
            label="登陆IP白名单"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.loginIPWhiteList}}</div>
        </el-table-column>
        <el-table-column
          label="最近登陆时间"
          v-slot="{row}"
          align="center"
        >
          <div>{{row.lastLoginTime}}</div>
        </el-table-column>
        <el-table-column
            label="创建时间"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.createTime}}</div>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          v-slot="{row}"
          width="100px"
          style="overflow: auto"
        >
<!--          <el-dropdown>
            <SvgIcon name="more" width="30px" height="30px"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>新增下一级代理</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->

          <el-dropdown trigger="click">
            <SvgIcon name="more" width="30" height="30" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editAgentInfo(row)">编辑</el-dropdown-item>
                <el-dropdown-item @click="deleteAgentInfo(row)">删除</el-dropdown-item>
                <el-dropdown-item v-if="row.agentLevel !== 3" @click="addNextLevelAgent(row)">增加下一级代理</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </el-table-column>
      </el-table>

    </form>


    <!-- 新增一级代理弹窗内容 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogFormVisible"
        class="dialog"
        center="true"
        width="40%"
        style="height: 600px;border:solid 1px lightseagreen"
    >
      <el-form style="margin-top: 50px">
        <div class="el-form-line">
          <el-form-item label="代理名称:" label-width="150px" size="medium">
            <el-input type="text" v-model="agentInfo.agentName" style="width: 200px"></el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item label="代理账号:" label-width="150px" size="medium">
            <el-input autocomplete="new-password" type="text" v-model="agentInfo.agentAccount" style="width: 200px"></el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item label="代理账号密码:" label-width="150px" size="medium">
            <el-input autocomplete="new-password" type="password" v-model="agentInfo.agentPassword" style="width: 200px"></el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item label="确认密码:" label-width="150px" size="medium">
            <el-input type="password" v-model="agentInfo.agentConfirmPassword" style="width: 200px"></el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item label="代理状态:" label-width="150px" size="medium" style="width: 350px;">
            <el-switch
                v-model="agentInfo.agentStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
            >
            </el-switch>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item label="渠道费率:" label-width="150px" size="medium">
            <el-input type="number" v-model="agentInfo.channelRate" style="width: 200px"></el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item label="渠道配置:" label-width="150px" size="medium">
            <el-select v-model="agentInfo.channelConfig" style="width: 200px" placeholder="请选择渠道">
              <el-option
                v-for="item in agentInfo.channelOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item label="代理费率:" label-width="150px" size="medium">
            <el-input type="number" v-model="agentInfo.agentRate" style="width: 200px"></el-input>
          </el-form-item>
        </div>
        <div class="el-form-line">
          <el-form-item label="谷歌验证码:" label-width="150px" size="medium">
            <el-input type="number" v-model="agentInfo.googleCode" style="width: 200px"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增下一级代理弹窗 -->
    <el-dialog
        :title="parentDialogTitle"
        v-model="parentDialogVisible"
        class="dialog"
        center="true"
        width="90%"
        style="height: 400px;border:solid 1px lightseagreen;"
    >
      <el-form style="margin-top: 50px">
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="上级代理名称:" label-width="150px" size="medium">
                <el-input disabled type="text" v-model="nextLevelAgentInfo.parentAgentName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="上级代理账号:" label-width="150px" size="medium">
                <el-input disabled type="text" v-model="nextLevelAgentInfo.parentAgentAccount" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理名称:" label-width="150px" size="medium">
                <el-input type="text" v-model="nextLevelAgentInfo.agentName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理账号:" label-width="150px" size="medium">
                <el-input autocomplete="new-password" type="text" v-model="nextLevelAgentInfo.agentAccount" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理账号密码:" label-width="150px" size="medium">
                <el-input autocomplete="new-password" type="password" v-model="nextLevelAgentInfo.agentPassword" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="确认密码:" label-width="150px" size="medium">
                <el-input type="password" v-model="nextLevelAgentInfo.agentConfirmPassword" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理状态:" label-width="150px" size="medium" style="width: 350px;">
                <el-switch
                    v-model="nextLevelAgentInfo.agentStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="启用"
                    inactive-text="停用"
                >
                </el-switch>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="渠道费率:" label-width="150px" size="medium">
                <el-input type="number" v-model="nextLevelAgentInfo.channelRate" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="渠道配置:" label-width="150px" size="medium">
                <el-select v-model="nextLevelAgentInfo.channelConfig" style="width: 200px" placeholder="请选择渠道">
                  <el-option
                      v-for="item in nextLevelAgentInfo.channelOptions"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理费率:" label-width="150px" size="medium">
                <el-input type="number" v-model="nextLevelAgentInfo.agentRate" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="谷歌验证码:" label-width="150px" size="medium">
                <el-input type="number" v-model="nextLevelAgentInfo.googleCode" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-bottom:10px;display: flex;padding:0;">
        <el-button @click="calcelParentDialog">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  <div style="display:flex;float: right;margin-right: 5%;height: 5%">
    <el-pagination
        background
        layout="sizes, prev, pager, next, jumper, total"
        :total="totalCount"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        style="float:right; margin-right: 5%;padding-bottom: 5px;height: 100%"
        @current-change="handleChange"
        @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'ChannelList',
  data() {
    return {
      tablekey: 0,
      filterbox: {
        agentName: '',
      },
      dialogFormVisible: false,
      parentDialogTitle: '',
      parentDialogVisible: false,
      dialogTitle: '',
      agentInfo: {
        agentName: '',
        agentAccount: '',
        agentPassword: '',
        agentConfirmPassword: '',
        agentStatus: false,
        loginIPWhiteList:'',
        channelRate: '',
        channelConfig: '',
        channelOptions: [
          {
            value: '1',
            label: '渠道1'
          },
          {
            value: '2',
            label: '渠道2'
          }
        ],
        agentRate: '',
        googleCode: '',
      },
      nextLevelAgentInfo: {
        parentAgentName: '',
        parentAgentAccount: '',
        agentName: '',
        agentAccount: '',
        agentPassword: '',
        agentConfirmPassword: '',
        agentStatus: false,
        loginIPWhiteList:'',
        channelRate: '',
        channelConfig: '',
        channelOptions: [
          {
            value: '1',
            label: '渠道1'
          },
          {
            value: '2',
            label: '渠道2'
          }
        ],
        agentRate: '',
        googleCode: '',
      },
      agentInfoFormData: [
        {
          agentName: '代理一',
          agentAccount: 'dali1',
          agentNO: '001',
          agentLevel: 1,
          agentStatus: true,
          loginIP: '127.0.0.1',
          loginIPWhiteList: '127.0.0.1,192.168.1.1',
          payingChannel: '支付宝'
        },
        {
          agentName: '一级代理一',
          agentAccount: 'dali11',
          agentNO: '002',
          agentLevel: 1,
          agentStatus: true,
          loginIP: '127.0.0.1',
          loginIPWhiteList: '127.0.0.1,192.168.1.1',
          payingChannel: '支付宝'
        },
        {
          agentName: '代理二',
          agentAccount: 'dalichousabo',
          agentNO: '003',
          agentLevel: 2,
          loginIP: '127.0.0.1',
          loginIPWhiteList: '127.0.0.1,192.168.0.1',
          payingChannel: '抖音月付',
          parentAgentInfo: {
            agentName: '代理一',
            agentAccount: 'dali1',
            payingChannel: '支付宝',

          },
        },
        {
          agentName: '代理三',
          agentAccount: 'dalisan',
          agentNO: '004',
          agentLevel: 2,
          payingChannel: '微信',
          parentAgentInfo: {
            agentName: '代理一',
            agentAccount: 'dali1',
            payingChannel: '支付宝',
          },
        },
        {
          agentName: '代理四',
          agentAccount: 'hualala',
          payingChannel: '京东白条',
          agentNO: '005',
          agentLevel: 3,
          parentAgentInfo: {
            agentName: '代理三',
            agentAccount: 'dalisan',
            payingChannel: '微信',
          },
        },
      ],
      agentInfoTableData: [
        /*{
          agentLevel: 0,
          agentStatus: false,
          agentNO: 0,
          loginIP:'',
          loginIPWhiteList:'',
          lastLoginTime:'',
          createTime:'',
          firstLevelAgent: {

          },
          secondLevelAgent: {

          },
          thirdLevelAgent: {

          },
        }*/

      ],
      totalCount: 100,
      pageSize: 10,
      pageSizes: [1, 5, 10, 20, 50, 100],
      currentPage: 1,
    }
  },
  mounted() {
    this.agentInfoTableData = this.agentInfoFormData
    this.totalCount = this.agentInfoTableData.length
  },
  methods: {
    search() {
      if(!this.filterbox.agentName) {
        this.agentInfoTableData = this.agentInfoFormData
        this.tablekey++
        return;
      }
      this.agentInfoTableData = []
      this.agentInfoFormData.forEach((item) => {
        /*if (item.firstLevelAgent && item.firstLevelAgent.agentName === this.filterbox.agentName) {
          this.agentInfoTableData.push(item)
        } else if(item.secondLevelAgent && item.secondLevelAgent.agentName === this.filterbox.agentName) {
          this.agentInfoTableData.push(item)
        } else if (item.thirdLevelAgent && item.thirdLevelAgent.agentName === this.filterbox.agentName) {
          this.agentInfoTableData.push(item)
        }*/
        if(item.agentName === this.filterbox.agentName) {
          this.agentInfoTableData.push(item)
        }
        this.tablekey++
      })
    },
    addFistLevelAgent() {
      this.dialogFormVisible = true;
      this.dialogTitle= '新增一级代理'
    },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.dialogTitle = ''
      this.agentInfo = []
    },
    calcelParentDialog() {
      this.parentDialogVisible = false
      this.nextLevelAgentInfo = []
    },
    handleChange() {
      let startNum = (this.currentPage-1) * this.pageSize
      let endNum = startNum + this.pageSize
      if (this.agentInfoFormData.length <= endNum) {
        endNum = this.agentInfoFormData.length
      }
      this.agentInfoTableData = []
      for (let i = startNum; i < endNum; i++) {
        this.agentInfoTableData.push(this.agentInfoFormData[i])
      }
      this.tablekey++
    },
    handleSizeChange() {
      this.currentPage = 1
      this.agentInfoTableData = []
      let circleSize = this.pageSize > this.agentInfoFormData.length ? this.agentInfoFormData.length : this.pageSize
      for (let i = 0; i < circleSize; i++) {
        this.agentInfoTableData.push(this.agentInfoFormData[i])
      }
      this.tablekey++;
    },
    editAgentInfo(val) {

      this.agentInfo.agentName = val.agentName
      this.agentInfo.agentAccount = val.agentAccount
      this.agentInfo.agentStatus = val.agentStatus
      this.agentInfo.loginIP = val.loginIP
      this.agentInfo.loginIPWhiteList = val.loginIPWhiteList
      this.dialogTitle = 'edit agentInfo'
      this.dialogFormVisible = true;
    },
    addNextLevelAgent(val) {
      this.nextLevelAgentInfo.parentAgentName    = val.agentName
      this.nextLevelAgentInfo.parentAgentAccount = val.agentAccount
      this.parentDialogVisible = true
      this.parentDialogTitle = '增加下一级代理'
    },
    deleteAgentInfo() {
      this.$confirm('are you sure deleting this data?', '提示', {
        confirmButtonText: 'yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        //直行删除
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'canceled deleting this data'
        })
      })

    }
  }
}
</script>
<style scoped>
  .dialog-footer{
    display: flex;
    justify-content: right;
  }

  .el-form-line {
    display: flex;
    justify-content: center;
  }
</style>