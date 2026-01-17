<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
import merchantReport from "@/views/pages/MerchantReport.vue";
import '@/assets/base.css'
import {getFormateTimeByTimeBystamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">{{$t('route.merchantInfo')}}</div>
  <!-- 统计数据展示 -->
  <div class="statistics-container">
    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>总账户金额:</span>
          <textarea v-model="merchantReport.merchantAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>提现总金额:</span>
          <textarea v-model="merchantReport.merchantWithdrawlAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash-freeze" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>冻结总金额:</span>
          <textarea v-model="merchantReport.merchantFreezeAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>
  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 2%;">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏
        </span>
      </template>
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
                  placeholder="select agent"
              >
              </el-cascader>
            </div>
          </div>
        </form>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="merchantInfos">
    <form id="merchantInfoForm" class="merchantInfoFormT">
      <el-button @click="addMerchant()" style="width:60px;display: flex; flex-direction: row;justify-content: center;cursor: pointer;align-items: center;float: right;margin-right: 3%">
        <SvgIcon height="20px" width="20px" name="add" style="margin: 0"/>
        <div style="color: black">新增</div>
      </el-button>
      <el-table
          border :data="merchantInfoFormData"
          class="merchantInfos-table"
          style="width: 97%;height: auto;"
          height="500px"
      >
        <el-table-column
            label="商户账号"
            v-slot="{row}"
            align="center"
            width="100px"
            fixed="left"
        >
          <div>
            {{row.userId}}
          </div>
        </el-table-column>
        <el-table-column
            prop="商户名称"
            label="商户名称"
            v-slot="{row}"
            align="center"
            width="150px"
            fixed="left"
        >
          <div>
            {{row.merchantName}}
          </div>
        </el-table-column>
        <el-table-column
            prop="merchantLabel"
            label="商户代码"
            v-slot="{row}"
            align="center"
            width="100px"
            fixed="left"
        >
          <div>
            {{row.userId}}
          </div>
        </el-table-column>
        <el-table-column
            prop="payingCommisson"
            label="商户代理"
            v-slot="{row}"
            align="center"
            width="300px"
        >
          <div v-for="item in row.agentInfos">
            <div style="background-color: darkgrey;margin-top: 2px">
              <div>代理名称: {{item.agentName}}</div>
              <div>代理账号: {{item.accountName}}</div>
              <div v-if="row.channelDtoList" style="background-color: lightgreen">
                <div style="display: flex;align-items: center">
                  <div style="height:100%;width:150px;align-items: center;justify-items: center;text-align: center;">支付渠道：</div>
                  <div style="width: 150px;border-left: solid 1px black">
                    <div style="flex: 2;width: 130px;" v-for="item in item.channelDtoList">
                      {{item.channelName}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                :inactive-value="0"
                :active-value="1"
                disabled
            >
            ></el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="currencyType"
            label="交易币种"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.currencyList ? row.currencyList.toLocaleString() : '-'}}
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
            prop="loginIPs"
            label="登陆提现IP白名单"
            v-slot="{row}"
            align="center"
            width="300px"
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
            width="300px"
        >
          <div>
            {{row.payWhiteIps}}
          </div>
        </el-table-column>
        <el-table-column
            prop="collectingIPWhiteList"
            label="代收IP白名单"
            v-slot="{row}"
            align="center"
            width="300px"
        >
          <div>
            {{row.colWhiteIps}}
          </div>
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.createTime? getFormateTimeByTimeBystamp(row.createTime) : '-'}}
          </div>
        </el-table-column>
        <el-table-column
            label="操作"
            v-slot="{row}"
            align="center"
            width="100px"
            fixed="right"
        >
          <div>
<!--            <el-button style="background-color: mediumseagreen" @click.prevent="editMerchantInfo(row)">编辑</el-button>
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
            </el-popconfirm>-->
            <!--<el-button style="background-color: orangered" @click.prevent="delete(row.merchantAccount)">删除</el-button>-->
            <el-dropdown trigger="click">
              <SvgIcon name="more" width="30" height="30" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editMerchantInfo(row)">编辑</el-dropdown-item>
                  <el-dropdown-item @click="deleteMerchant(row.merchantAccount)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
      :title="dialogAddTitle"
      v-model="dialogAddFormVisible"
      class="dialog"
      center
      width="70%"
      height="900px"
      style="max-width: 70%; overflow-x: auto"
      @open="handleOpen('merchantAddInfo')"
  >
    <el-form ref="merchantAddInfo" style="height: 500px" :model="merchantAddInfo" label-width="100%" class="form" :rules="merchantInfoAddRule" >
      <el-row>
        <el-col :span="6">
          <el-form-item label="商户名称:" label-width="150px" size="medium" prop="merchantName">
            <el-input v-model="merchantAddInfo.merchantName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户账号:" label-width="150px" size="medium" prop="accountName">
            <el-input v-model="merchantAddInfo.userId" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登陆密码:" label-width="150px" size="medium" prop="accountPwd">
            <el-input v-model="merchantAddInfo.accountPwd" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="确认密码:" label-width="150px" size="medium" prop="accountConfirmPwd">
            <el-input v-model="merchantAddInfo.accountConfirmPwd" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label-width="150px" label="联系人:">
            <el-input v-model="merchantAddInfo.contactName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="150px" label="邮箱:">
            <el-input v-model="merchantAddInfo.contactEmail" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="150px" label="手机号:">
            <el-input v-model="merchantAddInfo.contactPhone" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登陆提现IP白名单:" label-width="150px" size="medium" prop="loginIpWhiteList">
            <el-input v-model="merchantAddInfo.loginIpWhiteList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="启用状态:" label-width="150px" size="medium">
            <el-switch
                v-model="merchantAddInfo.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用"
                :inactive-value="0"
                :active-value="1"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="启用代理" label-width="150px" size="medium">
            <el-switch
                v-model="merchantAddInfo.useAgent"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="关闭"
                :active-value="1"
                :inactive-value="0"
                @change="handleAgentChange"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="merchantAddInfo.useAgent === 0" :span="6">
          <el-form-item label="渠道:" label-width="150px" size="medium">
            <el-select
              :options="channelOptions"
              :props="channelProps"
              v-model="merchantInfo.channelIds"
              placeholder="请选择渠道"
              style="width: 200px"
              multiple
            ></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="merchantAddInfo.useAgent===1">
          <el-form-item label="所属代理:" label-width="150px" size="medium" prop="merchantAgent">
            <el-cascader
              v-model="merchantAddInfo.agentList"
              :options="agentOptions"
              style="width: 200px"
              :props="{ checkStrictly: true }"
              placeholder="请选择代理"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否开启代付:" label-width="150px" size="medium" prop="supportPaying">
            <el-switch
                v-model="merchantAddInfo.supportPaying"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="支持"
                inactive-text="关闭"
                :inactive-value="0"
                :active-value="1"
                @change="handlePayChange"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportPaying === 1">
        <el-col :span="6">
          <el-form-item label="代付最大金额:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.payMaxFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-form-item label="代付IP白名单:" label-width="150px" size="medium" prop="payWhiteIps">
          <el-input v-model="merchantAddInfo.payWhiteIps" style="width: 200px"/>
        </el-form-item>
        </el-col>
<!--        <el-col :span="6">
          <el-form-item label="代付渠道:" label-width="150px" size="medium" prop="payingChannel">
            <el-select v-model="merchantInfo.payingChannel"
                       :props="channelProps"
                       :options="payingChannelOptions"
                       placeholder="请选择代付渠道"
                       style="width: 200px"
            >
&lt;!&ndash;               <el-option
                v-for="item in payingChannelOptions"
                :key="item.channelId"
                :value="item.channelId"
                :label="item.channelName"
               />&ndash;&gt;
            </el-select>
          </el-form-item>
        </el-col>-->
        <el-col v-if="false" :span="6">
          <el-form-item label="代付渠道选中模式:" label-width="150px" size="medium">
            <el-select disabled v-model="merchantAddInfo.payingChannelModel"
            >
              <el-option key="1" value="1">随机</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportPaying === 1">
        <el-col :span="6">
          <el-form-item label="代付计费模式:" label-width="150px" size="medium">
            <el-radio-group v-model="merchantAddInfo.payingChargingModel" size="small">
              <el-radio :value="1">比例</el-radio>
              <el-radio :value="2">固定</el-radio>
              <el-radio :value="3">混合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="merchantAddInfo.payingChargingModel === 2 || merchantAddInfo.payingChargingModel === 3">
          <el-form-item label="固定费用:" label-width="150px" size="medium">
            <el-input v-model="merchantAddInfo.payFixedFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="merchantAddInfo.payingChargingModel===1 || merchantAddInfo.payingChargingModel === 3">
          <el-form-item label="比例费率:" label-width="150px" size="medium">
            <el-input v-model="merchantInfo.payRate" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否开启代收:" label-width="150px" size="medium" prop="supportCollection">
            <el-switch
                v-model="merchantAddInfo.supportCollection"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="支持"
                inactive-text="关闭"
                :inactive-value="0"
                :active-value="1"
                @change="handleCollectionChange"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportCollection === 1">
        <el-col :span="6">
          <el-form-item label="代收最大金额:" label-width="150px" size="medium">
            <el-input v-model="merchantAddInfo.collectionMaxFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="代收IP白名单:" label-width="150px" size="medium">
            <el-input v-model="merchantAddInfo.colWhiteIps" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="display: flex;flex-wrap: wrap;">
          <el-form-item label="金额浮动模式:" label-width="150px" size="medium" prop="cashFloatModel">
            <el-switch
                v-model="merchantAddInfo.isFloat"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="关闭"
                :inactive-value="0"
                :active-value="1"
                @change="handleFloatChange"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col v-if="merchantAddInfo.cashFloatModel" :span="6">
          <el-form-item  label="浮动金额:" label-width="150px" size="medium" prop="cashFloatNum">
            <el-input v-model="merchantAddInfo.cashFloatNum" style="width: 200px;" type="number" placeholder="请输入浮动范围"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="6">
          <el-form-item label="代收渠道选中模式:" label-width="150px" size="medium">
            <el-select disabled v-model="merchantAddInfo.collectionChannelModel"
            >
              <el-option key="1" value="1">随机</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportCollection === 1">
        <el-col :span="6">
          <el-form-item label="代收计费模式:" label-width="150px" size="medium">
            <el-radio-group v-model="merchantAddInfo.collectionChargingModel" size="small">
              <el-radio :value="1">比例</el-radio>
              <el-radio :value="2">固定</el-radio>
              <el-radio :value="3">混合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="merchantAddInfo.collectionChargingModel === 2 || merchantAddInfo.collectionChargingModel === 3">
          <el-form-item label="固定费用:" label-width="150px" size="medium">
            <el-input v-model="merchantAddInfo.collectionFixed" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="merchantAddInfo.collectionChargingModel===1 || merchantAddInfo.collectionChargingModel === 3">
          <el-form-item label="比例费率:" label-width="150px" size="medium">
            <el-input v-model="merchantAddInfo.collectionRate" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="谷歌验证码:" label-width="150px" size="medium" prop="googleCode">
            <el-input type="number" maxlength="6" minlength="6" v-model="merchantAddInfo.googleCode" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddDialog">取 消</el-button>
          <el-button type="primary" @click="submitAddInfo('merchantAddInfo')">确 定</el-button>
        </div>
    </el-form>
  </el-dialog>
  <el-dialog
      :title="dialogTitle"
      v-model="dialogFormVisible"
      class="dialog"
      center
      width="70%"
      height="50%"
      @open="handleOpen('merchantEditInfo')"
  >
    <el-form ref="merchantEditInfo" :model="merchantInfo" label-width="100%" class="form" :rules="merchantInfoRule" >
      <el-row>
        <el-col :span="6">
          <el-form-item label="商户账号:" label-width="150px" size="medium">
            <el-input disabled v-model="merchantInfo.merchantAccount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户名称:" label-width="150px" size="medium" prop="merchantName">
            <el-input v-model="merchantInfo.merchantName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登陆密码:" label-width="150px" size="medium" prop="merchantPassword">
            <el-input v-model="merchantInfo.merchantPassword" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="确认密码:" label-width="150px" size="medium" prop="merchantConfirmPassword">
            <el-input v-model="merchantInfo.merchantConfirmPassword" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="所属代理:" label-width="150px" size="medium" prop="merchantAgent">
            <el-cascader
                v-model="merchantInfo.merchantAgent"
                :options="agentOptions"
                @change="handleAgentChange"
                style="width: 200px"
                :props="{ checkStrictly: true }"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="代收白名单:" label-width="150px" size="medium" prop="collectingWhiteList">
            <el-input v-model="merchantInfo.collectingWhiteList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登陆提现IP白名单:" label-width="150px" size="medium" prop="loginIpWhiteList">
            <el-input v-model="merchantInfo.loginIpWhiteList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"><el-form-item label="代付白名单:" label-width="150px" size="medium" prop="payingWhiteList">
          <el-input v-model="merchantInfo.payingWhiteList" style="width: 200px"></el-input>
        </el-form-item></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="金额浮动模式:" label-width="150px" size="medium" prop="cashFloatModel">
            <el-switch
                v-model="merchantInfo.cashFloatModel"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="关闭"
                @change="handleFloatChange"
            >
            </el-switch>
            <!--            <el-input v-model="merchantInfo.cashFloatModel" style="width: 200px"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="支付通道:" label-width="150px" size="medium" prop="payingChannel">
            <el-input v-model="merchantInfo.payingChannel" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="启用状态:" label-width="150px" size="medium">
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
          <el-form-item label="谷歌验证码:" label-width="150px" size="medium" prop="googleCode">
            <el-input type="number" maxlength="6" minlength="6" v-model="merchantInfo.googleCode" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantInfo.cashFloatModel">
        <el-col :span="6">
          <el-form-item label-width="150px" size="medium" label="浮动金额:" prop="cashFloatNum">
            <el-input v-model="merchantInfo.cashFloatNum" style="width: 200px;" placeholder="请输入浮动范围"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="submit('merchantEditInfo')">确 定</el-button>
      </div>
    </el-form>
  </el-dialog>

  <el-dialog
      :title="dialogDeleteTitle"
      v-model="dialogDeleteVisible"
      class="dialog"
      center
      width="70%"
      height="60%"
  >
    <el-form style="height: 120px">
      <el-row style="display: flex;justify-items: center;">
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;height: 50px;">
          <el-form-item label="谷歌验证码" label-width="150px" size="medium" >
            <el-input type="number" maxlength="6" v-model="deleteMerchantInfo.verifyCode" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="position: absolute;bottom: 5px;right: 3%">
      <el-button @click="cancelDeleteDialog">取 消</el-button>
      <el-button type="primary" @click="submitDelete">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {isValidIP} from "@/api/common.js";
import {createMerchantInfo, getMerchantInfo, getPaymentInfo} from "@/api/interface/backendInterface.js";
export default {
  name: "MerchantInfo",
  data() {
    const cashFloatNumValidate = (rule, value, callback) => {
      if (this.merchantInfo.cashFloatModel && (value === '' || value === undefined)) {
        callback(new Error('输入浮动金额'))
      }
    };
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('password is required'));
      } else {
        callback()
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('type password again'))
      } else if (value !== this.merchantAddInfo.merchantPassword) {
        callback(new Error("twice password is different"))
      } else {
        callback()
      }
    };

    const ipValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('ip white list is required'));
      } else if (!isValidIP(value)) {
        callback(new Error('ip white list invalid'));
      } else {
        callback()
      }

    };
    return {
      merchantReport: {},
      merchantInfoAddRule: {
        merchantName: [
          {required: true, message: 'merchantName is required', trigger: 'blur'},
        ],
        merchantAgent: [
          {required: false, message: 'agentName is required', trigger: 'blur'},
        ],
        collectingWhiteList: [
          {required: true, message: 'collectingWhiteList is required', trigger: 'blur'},
        ],

        loginIpWhiteList: [
          {required: true, validator: ipValidator, trigger: 'blur'},
        ],
        payingWhiteList: [
          {required: true, message: 'payingWhiteList is required', trigger: 'blur'},
        ],
        cashFloatModel: [
          {required: false, message: 'cashFloatModel is required', trigger: 'blur'},
        ],
        payingChannel: [
          {required: false, message: 'payingChannel is required', trigger: 'blur'},
        ],
        googleCode: [
          {required: true, message: 'googleCode is required', trigger: 'blur'},
        ],
        cashFloatNum: [
          {required: true, validator: cashFloatNumValidate, trigger: 'blur'},
        ],
        merchantPassword: [
            {required: true, validator: validatePass, trigger: 'blur'},
        ],
        merchantConfirmPassword: [
            {required: true, validator: validatePass2, trigger: 'blur'},
        ]
      },
      merchantInfoRule: {
        merchantName: [
          {required: true, message: 'merchantName is required', trigger: 'blur'},
        ],
        merchantAgent: [
            {required: true, message: 'agentName is required', trigger: 'blur'},
        ],
        collectingWhiteList: [
            {required: true, message: 'collectingWhiteList is required', trigger: 'blur'},
        ],

        loginIpWhiteList: [
            {required: true, message: 'loginIpWhiteList is required', trigger: 'blur'},
        ],
        payingWhiteList: [
            {required: true, message: 'payingWhiteList is required', trigger: 'blur'},
        ],
        cashFloatModel: [
            {required: true, message: 'cashFloatModel is required', trigger: 'blur'},
        ],
        payingChannel: [
         {required: true, message: 'payingChannel is required', trigger: 'blur'},
     ],
        googleCode: [
            {required: true, message: 'googleCode is required', trigger: 'blur'},
        ],
        cashFloatNum: [
          {required: true, validator: cashFloatNumValidate, trigger: 'blur'},
        ],
        merchantPassword: [
          {required: true, validator: validatePass, trigger: 'blur'},
        ],
        merchantConfirmPassword: [
          {required: true, validator: validatePass2, trigger: 'blur'},
        ]
      },
      dialogAddTitle: "",
      dialogAddFormVisible: false,
      deleteMerchantInfo: {},
      dialogDeleteVisible: false,
      dialogDeleteTitle: "",
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
          userId: '12345678',
          merchantName: '测试商户1',
          agentList: {value: '001', label: "一级代理商1",children: [
              {
                value: '001-001',
                label: '一级代理商下的二级代理商1'
              }]},
          status: 1,
          loginIPWhiteList: '127.0.0.1',
          payWhiteIps: '192.168.1.1',
          colWhiteIps: '192.168.1.1',
          merchantAccountInfo: {
            totalAmount: 1000000,
            toUseAmount: 990000,
            freezeAmount: 10000,
          },
          createTime: '1999-01-01',
          currencyType: '$',
        }
      ],
      merchantAddInfo: {},
      merchantInfo: {
        /*merchantAccount: '',
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
        supportPaying: 1,
        supportCollection: 1*/
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
      ],
      channelOptions: [
        /*{
          channelId: 1,
          channelName: '渠道一'
        },
        {
          channelId: 2,
          channelName: '渠道二'
        }*/
      ],
      channelProps: {
        value: 'paymentNo',
        label: 'paymentName'
      }
    }
  },
  methods: {
    search() {
      getMerchantInfo(this.filterbox).then(res => {
          console.log('merchantInfo----'+JSON.stringify(res.data))
      })
    },
    handleOpen(form) {
      this.$nextTick(() => {
        /*this.$refs.form.resetFields();*/
        this.$refs[form].resetFields();
      });
    },
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
      this.dialogAddFormVisible = true;
      this.dialogAddTitle='新增商户';
      this.merchantAddInfo.payingChannelModel = '随机';
      this.merchantAddInfo.supportPaying = 1;
      this.merchantAddInfo.supportCollection = 1;
      this.merchantAddInfo.collectionChargingModel = 1;
      this.merchantAddInfo.payingChargingModel = 1;
    },
    handleAgentChange(val) {
      if (this.merchantInfo.useAgent === 1) {
        this.merchantInfo.channelId = []
      }
      if (this.merchantInfo.useAgent === 0) {
        this.merchantInfo.merchantAgent = []
      }
    },
    handleFloatChange(val) {
    },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.merchantInfo = {}
      this.selectedAgent = []
      this.dialogFlag = ''
    },
    cancelAddDialog() {
      this.dialogAddFormVisible = false;
      this.dialogAddTitle = '',
      this.merchantInfo = {}
      this.selectedAgent = []
      this.dialogFlag = ''
    },
    cancelDeleteDialog() {
      this.dialogDeleteTitle = ''
      this.dialogDeleteVisible = false
      this.deleteMerchantInfo = {}
    },
    editMerchantInfo(rowInfo) {
      this.merchantAddInfo = rowInfo

      if (this.merchantAddInfo.supportType === 0) {
        this.merchantAddInfo.supportCollection = 1
        this.merchantAddInfo.supportPaying = 0
      } else if(this.merchantAddInfo.supportType === 1) {
        this.merchantAddInfo.supportCollection = 0
        this.merchantAddInfo.supportPaying = 1
      } else {
        this.merchantAddInfo.supportCollection = 1
        this.merchantAddInfo.supportPaying = 1
      }
      this.dialogFlag = 'edit';
     /* this.merchantAddInfo.merchantName = rowInfo.merchantName;
      this.merchantAddInfo.accountName = rowInfo.accountName;
      this.merchantAddInfo.isInUse = rowInfo.isInUse;
      this.merchantAddInfo.loginIpList = rowInfo.loginIPWhiteList
      this.merchantAddInfo.payWhiteIps = rowInfo.payWhiteIps;
      this.merchantAddInfo.colWhiteIps = rowInfo.colWhiteIps*/
      let agents = rowInfo.agentList
      this.selectedAgent.push(agents.value)
      if(agents.hasOwnProperty("children")) {
        this.getAllAgentId(agents.children)
      }
      //this.selectedAgent = rowInfo.merchantAgent
      /*this.dialogFormVisible = true;
      this.dialogTitle = "修改账户信息"*/
      this.dialogAddFormVisible = true
      this.dialogAddTitle = "修改商户信息"

    },
    getAllAgentId(agents) {
      agents.forEach(agent => {
        this.selectedAgent.push(agent.value)
        if (agent.hasOwnProperty('children')) {
          this.getAllAgentId(agent.children)
        }
      })
      this.merchantInfo.merchantAgent = this.selectedAgent
    },
    deleteMerchant(val) {
      this.$confirm('are you sure deleting this data?', '提示', {
        confirmButtonText: 'yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        //直行删除
        this.deleteMerchantInfo.merchantAccount = val
        this.dialogDeleteVisible = true;
        this.dialogDeleteTitle = '删除商户'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'canceled deleting this data'
        })
      })
    },
    submitDelete() {
      if (!this.deleteMerchantInfo.verifyCode) {
        this.$message({
          type: 'error',
          message: 'you need to type google code '
        })
        return
      }
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          alert("校验通过---")
        } else {
          alert('failed')
        }
      })
    },
    submitAddInfo(form) {
      if (this.dialogFlag === 'create') {
        if (this.merchantAddInfo.supportPaying === 1) {
          this.merchantAddInfo.supportType = 1
        } else if (this.merchantAddInfo.supportCollection === 1) {
          this.merchantAddInfo.supportType = 0
        } else {
          this.merchantAddInfo.supportType = 2
        }
      }

      this.$refs[form].validate(valid => {
        if (valid) {
          // 校验通过
          // request interface to create merchant
          createMerchantInfo(this.merchantAddInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.$notify({
                title: 'Success',
                type: 'success',
                message: 'Create New Merchant Successfully',
                duration: 4000
              })
            } else if (res.status === 200 && res.data.code !== 0) {
              this.$notify({
                title: 'Failed',
                type: 'error',
                message: res.data.message,
                duration: 4000
              })
            }
          })
        }
      })
    }
  },
  mounted() {
    getPaymentInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        const allData = JSON.parse(res.data.data).paymentDtoList
        this.channelOptions = allData
        this.search()
      } else {
        this.$notify({
          title: 'Error',
          type: 'error',
          message: 'get payment failed, please fresh page',
          duration: 3000
        })
      }
    })

  }
}
</script>
<style scoped>
  .dialog-footer {
    display: flex;
    position: absolute;
    bottom: 5px;
    right: 10px;
  }

  .form{
    margin-top: 4%;
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

  :deep().el-table th.is-leaf {

    background-color: lightskyblue;
    color: white;
    font-weight: bold;
    font-size: larger;
  }
  .toolbarName{
    color: black;
  }
  :deep() .el-collapse-item__header {
    background-color: deepskyblue;
  }
</style>