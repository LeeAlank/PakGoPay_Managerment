<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">代理信息管理</div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="main-toolbar" style="height: 100px;">
        <el-form class="main-toolform" style="display: grid;align-items: center;width: 100%;" ref="filterboxForm" :model="filterbox">
          <el-row style="width: 100%;">
            <el-col :span="8">
              <div>
                <el-form-item label="代理名称:" label-width="150px" prop="agentName">
                  <el-input v-model="filterbox.agentName" style="width: 200px;" />
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="代理账号:" label-width="150px" prop="accountName">
                  <el-input v-model="filterbox.accountName" style="width: 200px;"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item label="状态:" label-width="150px" prop="status">
                  <el-select
                    style="width: 200px;"
                    placeholder="代理状态"
                    v-model="filterbox.status"
                  >
                    <el-option label="停用" :value="0">停用</el-option>
                    <el-option label="启用" :value="1">启用</el-option>
                  </el-select>
                  <div style="display: flex; flex-direction: row;">
                    <el-button @click="reset('filterboxForm')" class="filterButton">
                      <SvgIcon class="filterButtonSvg" name="reset"/>
                      <div>重置</div>
                    </el-button>&nbsp;
                    <el-button @click="search()"
                               class="filterButton">
                      <SvgIcon class="filterButtonSvg" name="search"/>
                      <div>查询</div>
                    </el-button>&nbsp;
                  </div>
                </el-form-item>
              </div>
            </el-col>
<!--            <el-col :span="6">
              <el-form-item>
                <div style="display: flex; flex-direction: row;">
                  <el-button @click="reset('filterboxForm')" class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="reset"/>
                    <div>重置</div>
                  </el-button>&nbsp;
                  <el-button @click="search()"
                             class="filterButton">
                    <SvgIcon class="filterButtonSvg" name="search"/>
                    <div>查询</div>
                  </el-button>&nbsp;
                </div>
              </el-form-item>
            </el-col>-->
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="reportInfo">
    <form class="main-views-form" style="height: 100%;overflow: visible;">
      <div style="display: flex;flex-direction: row;justify-content: right;margin-left: 0">
        <el-button @click="addFistLevelAgent" class="filterButton">
          <SvgIcon class="filterButtonSvg" name="add"/>
          <div>新增一级代理</div>
        </el-button>
<!--        <el-button @click="exportAgent" style="margin:0">
          <SvgIcon height="20px" width="20px" name="export"/>
          <div style="color: black;font-size: 13px;">导出</div>
        </el-button>-->
      </div>
      <el-table
          border :data="agentInfoTableData"
          class="agentInfoTable"
          style="height: auto;"
          :key="tablekey"
      >
        <el-table-column
            prop="firstLevelAgent"
            label="代理信息"
            v-slot="{row}"
            align="center"
            width="300px"
            style="height: 95%;"
            fixed="left"
        >
          <div style="height: auto;display: flex; justify-content: center;width: 100%;">
            <el-card class="box-card" style="width: 100%">
              <div class="agent-card-row agent-card-account">账号：{{ row.accountName }}</div>
              <div class="agent-card-row agent-card-name">名称：{{ row.agentName }}</div>
              <div v-if="row.channelDtoList" class="agent-card-row agent-card-channel">
                <div style="display: flex;align-items: center">
                  <div style="height:100%;width:150px;align-items: center;justify-items: center;text-align: center;">支付渠道：</div>
                  <div style="width: 150px;border-left: solid 1px black">
                    <div style="flex: 2;width: 130px;" v-for="item in row.channelDtoList">
                      {{item.channelName}}
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-table-column>
        <el-table-column
            prop="secondLevelAgent"
            label="上级代理"
            v-slot="{row}"
            align="center"
            width="300px"
            fixed="left"
        >
          <div style="height: auto;display: flex; justify-content: center;width: 100%;">
            <el-card v-if="row.parentUserName" class="box-card" style="width: 100%">
              <div class="agent-card-row agent-card-account">账号：{{ row.parentUserName }}</div>
              <div class="agent-card-row agent-card-name">名称：{{ row.parentAgentName }}</div>
              <div class="agent-card-row agent-card-channel">
                <div style="display: flex;align-items: center">
                  <div style="height:100%;width:150px;align-items: center;justify-items: center;text-align: center;">支付渠道：</div>
                  <div style="width: 150px;border-left: solid 1px black">
                    <div style="flex: 2;width: 130px;" v-for="item in row.parentChannelDtoList">
                      {{item.channelName}}
                    </div>
                  </div>
                </div>
              </div>
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
            {{ row.level }}
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
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                :inactive-value="0"
                :active-value="1"
                disabled
            ></el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="agentLevel"
            label="费率"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            代收费率:{{row.collectionRate ? row.collectionRate : 0 }}% + {{row.collectionFixedFee? row.collectionFixedFee : 0}}
          </div>
          <div>
            代付费率:{{row.payRate? row.payRate : 0}}% + {{row.payFixedFee? row.payFixedFee : 0}}
          </div>
        </el-table-column>
<!--        <el-table-column
            label="登陆IP"
            v-slot="{row}"
            align="center"
        >
          <div>{{ row.loginIP }}</div>
        </el-table-column>-->
        <el-table-column
            label="登陆IP白名单"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>{{ row.loginIps }}</div>
        </el-table-column>
        <el-table-column
            label="提现IP白名单"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>{{ row.withdrawIps }}</div>
        </el-table-column>
        <el-table-column
            label="代理账户信息"
            v-slot="{row}"
            align="center"
            width="300px"
        >
          <div class="account-info-wrap">
            <!-- 返回的是json对象 包含总金额、可用金额、冻结金额 -->
            <div class="account-info-card" v-for="(value, key, index) in row.balanceInfo" :key="key">
              <div class="account-info-row account-info-key">{{key}}:</div>
              <div class="account-info-row account-total">账户总金额: <div class="account-info-value">{{value.total ? value.total: '-'}}</div></div>
              <div class="account-info-row account-usable">账户可用金额: <div class="account-info-value">{{value.available? value.available: '-'}}</div></div>
              <div class="account-info-row account-frozen">冻结金额: <div class="account-info-value">{{value.frozen? value.frozen : '-'}}</div></div>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          label="联系人信息"
          v-slot="{row}"
          align="center"
          width="300px"
        >
            <div class="agent-card-row agent-card-account">
              联系人: {{row.contactName? row.contactName : '-'}}
            </div>
          <div class="agent-card-row agent-card-name">
            手机号: {{row.contactPhone ? row.contactPhone: '-'}}
          </div>
          <div class="agent-card-row agent-card-channel">
            邮箱: {{row.contactEmail ? row.contactEmail: '-'}}
          </div>
        </el-table-column>
<!--        <el-table-column
            label="最近登陆时间"
            v-slot="{row}"
            align="center"
        >
          <div>{{ row.lastLoginTime }}</div>
        </el-table-column>
        <el-table-column
            label="创建时间"
            v-slot="{row}"
            align="center"
        >
          <div>{{ row.createTime }}</div>
        </el-table-column>-->
        <el-table-column
            label="操作"
            align="center"
            v-slot="{row}"
            width="100px"
            style="overflow: auto"
            fixed="right"
        >
          <el-dropdown trigger="click">
            <SvgIcon name="more" width="30" height="30"/>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editAgentInfo(row)">编辑</el-dropdown-item>
<!--                <el-dropdown-item @click="deleteAgentInfo(row)">删除</el-dropdown-item>-->
                <el-dropdown-item v-if="row.level !== 3" @click="addNextLevelAgent(row)">增加下一级代理
                </el-dropdown-item>
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
         
          @current-change="handleCurrentPageChange"
          @size-change="handleSizeChange"
      >

      </el-pagination>
    </form>


    <!-- 新增一级代理弹窗内容 -->
    <el-dialog
        :title="dialogTitle"
        v-model="dialogFormVisible"
        class="dialog"
        center="true"
        width="70%"
        style="height: 500px;overflow: auto;"
    >
      <el-form style="margin-top: 50px" ref="createAgentForm" :rules="createAgentRule" :model="agentInfo">
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理名称:" label-width="150px" prop="agentName">
                <el-input type="text" v-model="agentInfo.agentName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理账号:" label-width="150px" prop="accountName">
                <el-input autocomplete="new-password" type="text" v-model="agentInfo.accountName"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理层级:" label-width="150px" prop="level">
                <el-input autocomplete="new-password" type="text" v-model="agentInfo.level"
                          disabled
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="联系人:" label-width="150px" prop="contactName">
                <el-input v-model.number="agentInfo.contactName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="手机号:" label-width="150px" prop="contactPhone">
                <el-input v-model.number="agentInfo.contactPhone" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="邮箱:" label-width="150px" prop="contactEmail">
                <el-input v-model="agentInfo.contactEmail" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代收固定费率:" label-width="150px" prop="collectionFixedFee">
                <el-input type="number" v-model.number="agentInfo.collectionFixedFee" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代收百分比费率:" label-width="150px" prop="collectionRate">
                <el-input type="number" v-model.number="agentInfo.collectionRate" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代付固定费率:" label-width="150px" prop="payFixedFee">
                <el-input type="number" v-model.number="agentInfo.payFixedFee" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代付百分比费率:" label-width="150px" prop="payRate">
                <el-input type="number" v-model.number="agentInfo.payRate" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="渠道配置:" label-width="150px" prop="channelIdList">
                <el-select
                    v-model="agentInfo.channelIdList"
                    style="width: 200px" placeholder="请选择渠道"
                    :options="createType === 'firstLevel' ? channelOptions : agentInfo.parentChannelDtoList"
                    :props="channelProps"
                    multiple
                >
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理状态:" label-width="150px" style="width: 350px;" prop="status">
                <el-switch
                    v-model="agentInfo.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="启用"
                    inactive-text="停用"
                    :active-value="1"
                    :inactive-value="0"
                >
                </el-switch>
              </el-form-item>
            </div>
          </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item label="登陆ip白名单:" label-width="150px" prop="loginIps">
                  <el-input autocomplete="new-password" v-model="agentInfo.loginIps"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item label="提现ip白名单:" label-width="150px" prop="withdrawalIps">
                  <el-input autocomplete="new-password" v-model="agentInfo.withdrawalIps"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item label="代收单笔最大费用:" label-width="150px" prop="collectionMaxFee">
                  <el-input autocomplete="new-password" v-model="agentInfo.collectionMaxFee"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item label="代收单笔最小费用:" label-width="150px" prop="collectionMaxFee">
                  <el-input autocomplete="new-password" v-model="agentInfo.collectionMinFee"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item label="代付单笔最大费用:" label-width="150px" prop="payMaxFee">
                  <el-input autocomplete="new-password" v-model="agentInfo.payMaxFee"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item label="代付单笔最小费用:" label-width="150px" prop="payMinFee">
                  <el-input autocomplete="new-password" v-model="agentInfo.payMinFee"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
          <el-col :span="8" v-if="modifyType !== 'edit'">
            <div class="el-form-line">
              <el-form-item label="代理账号密码:" label-width="150px" prop="accountPwd">
                <el-input autocomplete="new-password" type="password" v-model="agentInfo.accountPwd"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" v-if="modifyType !== 'edit'">
            <div class="el-form-line">
              <el-form-item label="确认密码:" label-width="150px" prop="accountConfirmPwd">
                <el-input type="password" v-model="agentInfo.accountConfirmPwd" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="谷歌验证码:" label-width="150px" prop="googleCode">
                <el-input type="number" v-model="agentInfo.googleCode" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog('createAgentForm')">取 消</el-button>
        <el-button type="primary" @click="submit('createAgentForm')">确 定</el-button>
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
              <el-form-item label="上级代理名称:" label-width="150px" >
                <el-input disabled type="text" v-model="nextLevelAgentInfo.parentAgentName"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="上级代理账号:" label-width="150px" >
                <el-input disabled type="text" v-model="nextLevelAgentInfo.parentAgentAccount"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理名称:" label-width="150px" >
                <el-input type="text" v-model="nextLevelAgentInfo.agentName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理账号:" label-width="150px" >
                <el-input autocomplete="new-password" type="text" v-model="nextLevelAgentInfo.agentAccount"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理账号密码:" label-width="150px" >
                <el-input autocomplete="new-password" type="password" v-model="nextLevelAgentInfo.agentPassword"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="确认密码:" label-width="150px" >
                <el-input type="password" v-model="nextLevelAgentInfo.agentConfirmPassword"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="代理状态:" label-width="150px"  style="width: 350px;">
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
              <el-form-item label="渠道费率:" label-width="150px" >
                <el-input type="number" v-model="nextLevelAgentInfo.channelRate" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="渠道配置:" label-width="150px" >
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
              <el-form-item label="代理费率:" label-width="150px" >
                <el-input type="number" v-model="nextLevelAgentInfo.agentRate" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="谷歌验证码:" label-width="150px" >
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
<!--  <div style="display:flex;float: right;margin-right: 5%;height: 5%">
    <el-pagination class="pageTool"
        background
        layout="sizes, prev, pager, next, jumper, total"
        :total="totalCount"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
       
        @current-change="handleChange"
        @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>-->
</template>

<script>
import {
  createAgentInfo, exportAgentInfo, exportMerchantAccount,
  getAgentInfo,
  getChannelInfo,
  getPaymentInfo,
  modifyAgentInfo
} from "@/api/interface/backendInterface.js";
import validator from "axios/unsafe/helpers/validator.js";
import {exportExcel, getAgentInfoTitle, getFormateTime, getMerchantAccountTitle, loadingBody} from "@/api/common.js";
import {nextTick} from "vue";

export default {
  name: 'ChannelList',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'))
      } else {
        if (this.agentInfo.accountConfirmPwd !== '' && this.agentInfo.accountConfirmPwd !== 'undefined') {
          this.$refs.createAgentForm.validateField('accountConfirmPwd');
        }
        callback()
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.agentInfo.accountPwd) {
        callback(new Error("两次输入都密码不一致"))
      } else {
        callback()
      }
    };

    const validCollectionFee = (rule, value, callback) => {
      if ( !value && !this.agentInfo.collectionRate) {
        callback(new Error('fixedFee or rate need at least one '))
      } else {
        callback()
      }
    };

    const validCollectionRate = (rule, value, callback) => {
      if ( !value && !this.agentInfo.collectionFixedFee) {
        callback(new Error('fixedFee or rate need at least one '))
      } else {
        callback()
      }
    };

    const validPayFee = (rule, value, callback) => {
      if ( !value && !this.agentInfo.payRate) {
        callback(new Error('fixedFee or rate need at least one '))
      } else {
        callback()
      }
    };

    const validPayRate = (rule, value, callback) => {
      if ( !value && !this.agentInfo.payFixedFee) {
        callback(new Error('fixedFee or rate need at least one '))
      } else {
        callback()
      }
    }
    return {
      activeTool: '1',
      createType: '',
      modifyType: '',
      tablekey: 0,
      filterbox: {
      },
      dialogFormVisible: false,
      parentDialogTitle: '',
      parentDialogVisible: false,
      channelOptions: [],
      channelProps: {
        value: 'channelId',
        label: 'channelName'
      },
      dialogTitle: '',
      agentInfo: {
      },
      nextLevelAgentInfo: {
        parentAgentName: '',
        parentAgentAccount: '',
        agentName: '',
        agentAccount: '',
        accountPwd: '',
        accountConfirmPwd: '',
        agentStatus: false,
        loginIPWhiteList: '',
        channelRate: '',
        channelConfig: '',
        parentChannelDtoList: [
          {
            channelId: '001',
            channelName: '上级代理'
          },
          {
            channelId: '002',
            channelName: '上级代理2'
          }
        ],
        channelOptions: [
          /*{
            value: '1',
            label: '渠道1'
          },
          {
            value: '2',
            label: '渠道2'
          }*/
        ],
        agentRate: '',
        googleCode: '',
      },
      agentInfoFormData: [
        /*{
          agentName: '代理一',
          accountName: 'dali1',
          agentNO: '001',
          level: 1,
          agentStatus: true,
          loginIps: '127.0.0.1',
          withdrawIps: '127.0.0.1,192.168.1.1',
          payingChannel: '支付宝',
          contactName: '花大姐',
          contactPhone: '123456789',
          contactEmail: 'test@gmail.com',
          collectionFixedFee: '6',
          collectionRate: '0.2',
          payFixedFee: '6',
          payRate: '0.1',
          channelOptions: [
            {
              channelName: '支付渠道一'
            },
            {
              channelName: '支付渠道一32'
            }
          ],
          parentChannelDtoList: [
            {
              channelId: '001',
              channelName: '上级渠道一'
            },
            {
              channelId: '002',
              channelName: '上级渠道二'
            }
          ],
          channelDtoList: [
            {
              channelId: '001',
              channelName: '上级渠道一'
            }
          ]
        },
        {
          agentName: '一级代理一',
          accountName: 'dali11',
          agentNO: '002',
          level: 1,
          agentStatus: true,
          loginIps: '127.0.0.1',
          withdrawIps: '127.0.0.1,192.168.1.1',
          payingChannel: '支付宝'
        },
        {
          agentName: '代理二',
          accountName: 'dalichousabo',
          agentNO: '003',
          level: 2,
          loginIP: '127.0.0.1',
          loginIPWhiteList: '127.0.0.1,192.168.0.1',
          payingChannel: '抖音月付',
          parentAgentName: '父代理',
          parentUserName: '父代理账号',
          parentChannelDtoList: [
            {
              channelId: 'parentChannel001',
              channelName: '父渠道一'
            },
            {
              channelId: 'parentChannel002',
              channelName: '父渠道二'
            }
          ],
          channelDtoList: [
            {
              channelId: 'parentChannel001',
              channelName: '父渠道一'
            },
            {
              channelId: 'parentChannel002',
              channelName: '父渠道二'
            }
          ]
        },
        {
          agentName: '代理三',
          accountName: 'dalisan',
          agentNO: '004',
          level: 2,
          payingChannel: '微信',
          parentAgentInfo: {
            agentName: '代理一',
            userName: 'dali1',
            payingChannel: '支付宝',
          },
        },
        {
          agentName: '代理四',
          accountName: 'hualala',
          payingChannel: '京东白条',
          agentNO: '005',
          level: 3,
          parentAgentInfo: {
            agentName: '代理三',
            userName: 'dalisan',
            payingChannel: '微信',
          },
        },*/
      ],
      agentInfoTableData: [
      ],
      createAgentRule: {
        agentName: {
          required: true, trigger: 'blur',
        },
        accountName: {
          required: true,trigger: 'blur',
        },
        level: {
          required: true,trigger: 'blur',
        },
        accountPwd: {
          required: true, validator: validatePass, trigger: 'blur',
        },
        accountConfirmPwd: {
          required: true, validator: validatePass2, trigger: 'blur',
        },
        channelIdList: {
          required: true,trigger: 'blur',
        },
        googleCode: {
          required: true,trigger: 'blur',
        },
        collectionFixedFee: {
          required: true, trigger: 'blur', validator: validCollectionFee,
        },
        collectionRate: {
          required: true, trigger: 'blur', validator: validCollectionRate
        },
        payFixedFee: {
          required: true, trigger: 'blur', validator: validPayFee,
        },
        payRate: {
          required: true, trigger: 'blur', validator: validPayRate
        },
        collectionMaxFee: {
          required: true, trigger: 'blur',
        },
        collectionMinFee: {
          required: true, trigger: 'blur',
        },
        payMaxFee: {
          required: true, trigger: 'blur',
        },
        payMinFee: {
          required: true, trigger: 'blur',
        },
        loginIps: {
          required: true, trigger: 'blur',
        },
        withdrawalIps: {
          required: true, trigger: 'blur',
        }
      },
      totalCount: 100,
      pageSize: 10,
      pageSizes: [1, 5, 10, 20, 50, 100],
      currentPage: 1,
    }
  },
  async mounted() {
    this.agentInfoTableData = this.agentInfoFormData
    this.totalCount = this.agentInfoTableData.length
    // get paymentInfos
    await getChannelInfo({pageSize: 1000}).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        this.channelOptions = JSON.parse(res.data.data).channelDtoList
      }
    })

    this.search()
  },
  methods: {
    exportAgent() {
      this.filterbox.columns = getAgentInfoTitle(this)
      let timeRange = null
      if (this.filterbox.filterDateRange) {
        timeRange = new String(this.filterbox.filterDateRange)
        this.filterbox.startTime = timeRange.split(',')[0] / 1000
        this.filterbox.endTime = timeRange.split(',')[1] / 1000
      }
      exportAgentInfo(this.filterbox).then(async res => {
        //const fileName = this.$t('exportPaymentReportName') + getFormateTime()
        const fileName = '代理信息表' + getFormateTime()
        await exportExcel(res, fileName, this)
      })
    },
    search() {
      const loadingInstance =  loadingBody(this, 'agentInfoTable')
      getAgentInfo(this.filterbox).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          const allData = JSON.parse(res.data.data)
          this.agentInfoTableData = allData.agentInfoDtoList
          this.totalCount = allData.totalNumber
        } else if (res.status === 200 && res.data.code !== 0) {
          console.log(2)
          this.$notify({
            title: 'Error',
            type: 'error',
            duration: 5000,
            message: res.data.message,
            position: 'bottom-right'
          })
        } else {
          this.$notify({
            title: 'Error',
            type: 'error',
            duration: 5000,
            position: 'bottom-right',
            message: 'some error occurred, please try again'
          })
        }
        loadingInstance.close()
      }).catch((err) => {
        loadingInstance.close()
        this.$notify({
          title: 'Error',
          type: 'error',
          duration: 5000,
          position: 'bottom-right',
          message: err.message,
        })
      })
    },
    reset(form) {
      this.$refs[form].resetFields()
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
           this.agentInfo.channelIds = this.agentInfo.channelIdList
           if (this.modifyType === 'edit') {
             // modify
             alert(JSON.stringify(this.agentInfo))
             modifyAgentInfo(this.agentInfo).then((res) => {
               if (res.status === 200 && res.data.code === 0) {
                 this.search()
                 this.dialogFormVisible = false
                 this.dialogTitle = ''
                 this.$notify({
                   title: 'Success',
                   type: 'success',
                   duration: 5000,
                   position: 'bottom-right',
                   message: 'modify agent successfully'
                 })
               } else if (res.status === 200 && res.data.code !== 0) {
                 this.$notify({
                   title: 'Error',
                   type: 'error',
                   duration: 5000,
                   position: 'bottom-right',
                   message: res.data.message,
                 })
               } else {
                 this.$notify({
                   title: 'Error',
                   type: 'error',
                   duration: 5000,
                   position: 'bottom-right',
                   message: 'some error occurred, please try again'
                 })
               }
             })
           } else {
             createAgentInfo(this.agentInfo).then((res) => {
               if (res.status === 200 && res.data.code === 0) {
                 this.search()
                 this.dialogFormVisible = false
                 this.dialogTitle = ''
                 this.$notify({
                   title: 'Success',
                   type: 'success',
                   duration: 5000,
                   position: 'bottom-right',
                   message: 'create agent successfully'
                 })
               } else if (res.status === 200 && res.data.code !== 0) {
                 this.$notify({
                   title: 'Error',
                   type: 'error',
                   duration: 5000,
                   position: 'bottom-right',
                   message: res.data.message,
                 })
               } else {
                 this.$notify({
                   title: 'Error',
                   type: 'error',
                   duration: 5000,
                   position: 'bottom-right',
                   message: 'some error occurred, please try again'
                 })
               }
               this.modifyType = ''
               this.createType = ''
             })
           }
        }
      })
    },
    addFistLevelAgent() {
      this.modifyType = ''
      this.dialogFormVisible = true;
      this.dialogTitle = '新增一级代理'
      this.agentInfo.level = 1
      this.createType = 'firstLevel'
    },
    cancelDialog(form) {
      this.modifyType = ''
      this.createType = ''
      this.$refs[form].resetFields()
      this.dialogFormVisible = false;
      this.dialogTitle = ''
      this.agentInfo = []
    },
    calcelParentDialog() {
      this.parentDialogVisible = false
      this.nextLevelAgentInfo = []
    },
    handleCurrentPageChange(currentPage) {
      this.filterbox.pageNo = currentPage;
      this.filterbox.pageSize = this.pageSize;
      this.agentInfoTableData =  []
      this.search()

    },
    handleSizeChange(pageSize) {
      this.currentPage = pageSize
      this.pageSize = pageSize
      this.handleCurrentPageChange(1)
    },
    editAgentInfo(val) {
      this.agentInfo = val
      this.dialogTitle = 'edit agentInfo'
      this.dialogFormVisible = true;
      this.modifyType = 'edit'
    },
    addNextLevelAgent(val) {
      /*this.nextLevelAgentInfo.parentAgentName = val.agentName
      this.nextLevelAgentInfo.parentAgentAccount = val.agentAccount
      this.parentDialogVisible = true
      this.parentDialogTitle = '增加下一级代理'*/
      //this.agentInfo = val
      console.log(JSON.stringify(val.channelDtoList))
      this.createType = 'nextLevel'
      this.agentInfo.parentId = val.userId
      this.agentInfo.topAgentId = val.topAgentId
      this.agentInfo.parentChannelDtoList = val.channelDtoList
      this.agentInfo.level = val.level + 1
      this.dialogTitle = '新增下级代理'
      this.dialogFormVisible = true;
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
@import "@/api/common.css";
@import "@/assets/base.css";

.dialog-footer {
  display: flex;
  justify-content: right;
}

.el-form-line {
  display: flex;
  justify-content: center;
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

.account-info-row{
  font-size: 15px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
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

.account-total{
  background-color: #e8f2ff;
}

.account-usable{
  background-color: #e9f6ee;
}

.account-frozen{
  background-color: #f0f2f5;
}
</style>
