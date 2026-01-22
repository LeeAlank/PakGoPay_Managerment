<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
import merchantReport from "@/views/pages/MerchantReport.vue";
import '@/assets/base.css'
import {getFormateDate} from "@/api/common.js";
</script>

<template>
  <div class="main-title">{{$t('route.merchantInfo')}}</div>
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
  <!-- 统计数据展示 -->
<!--  <div class="statistics-container">
    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>总账户金额:</span>
          <textarea v-model="statisticsInfo.total" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>提现总金额:</span>
          <textarea v-model="statisticsInfo.withdraw" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>

    <el-card id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash-freeze" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>冻结总金额:</span>
          <textarea v-model="statisticsInfo.frozen" disabled class="cash-text-area"></textarea>
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
      <!-- 工具栏 -->
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <div class="main-toolform-item">
            <div class="main-toolform-line" style="justify-content: right;">
              <el-button @click="reset('filterboxForm')">
                <SvgIcon class="filterButtonSvg" name="reset"/>
                <div>重置</div>
              </el-button>
              <el-button @click="search()">
                <SvgIcon class="filterButtonSvg" name="search"/>
                <div>查询</div>
              </el-button>
            </div>
          </div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="商户账号:" label-width="150px" prop="merchantUserName">
                 <el-input :disabled="filterAvaiable"  v-model="filterbox.merchantUserName"  type="text" placeholder="商户账号" style="width: 200px"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="商户名称:" label-width="150px" prop="merchantName">
                  <el-input :disabled="filterAvaiable"   v-model="filterbox.merchantName"  type="text" placeholder="商户名称" style="width: 200px"/>
                </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商户状态:" label-width="150px" prop="status">
<!--                <el-switch
                    v-model="filterbox.status"
                    active-text="启用"
                    inactive-text="停用"
                    :active-value="1"
                    :inactive-value="0"
                ></el-switch>-->
                <el-select v-model="filterbox.status" clearable>
                  <el-option label="启用" :value="1">启用</el-option>
                  <el-option label="停用" :value="0">停用</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属代理:" label-width="150px" prop="accountName">
                <el-select
                    v-model="filterbox.accountName"
                    :options="agentOptions"
                    :props="agentProps"
                    placeholder="select agent"
                >
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="reportInfo">
    <form id="merchantInfoForm" class="merchantInfoFormT" style="height: auto">
      <el-button v-if="isAdmin" @click="addMerchant()" class="filterButton" style="float: right">
        <SvgIcon name="add" class="filterButtonSvg"/>
        <div>新增</div>
      </el-button>
      <el-table
          border :data="merchantInfoFormData"
          class="merchantInfos-table"
          height="auto"
          :key="tableKey"
      >
        <el-table-column
            label="商户账号"
            v-slot="{row}"
            align="center"
            width="100px"
            fixed="left"
        >
          <div>
            {{row.accountName}}
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
            <div class="agent-info-card">
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
            width="100px"
        >
          <div>
            <el-switch
                v-model="row.status"
                active-color="#07c160"
                inactive-color="#c0c4cc"
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
            prop="merchantLabel"
            label="商户渠道"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div v-for="item in row.channelIds ? row.channelIds.toLocaleString().split(',') : ''">
            <div>{{channelMaps[item]}}</div>
          </div>
        </el-table-column>
        <el-table-column
            prop="currencyType"
            label="交易币种"
            v-slot="{row}"
            align="center"
            width="100px"
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
            <div class="account-info-row account-total">账户总金额: <div class="account-info-value">{{row.merchantAccountInfo? row.merchantAccountInfo.totalAmount: '-'}}</div></div>
            <div class="account-info-row account-usable">账户可用金额: <div class="account-info-value">{{row.merchantAccountInfo? rowmerchantAccountInfo.toUseAmount: '-'}}</div></div>
            <div class="account-info-row account-frozen">冻结金额: <div class="account-info-value">{{row.merchantAccountInfo? row.merchantAccountInfo.freezeAmount : '-'}}</div></div>
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
            {{row.loginIps}}
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
            width="200px"
        >
          <div>
            {{row.createTime? getFormateDate(row.createTime) : '-'}}
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
          @size-change="handleSizeChange"
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
          <el-form-item label="商户名称:" label-width="150px"  prop="merchantName">
            <el-input :disabled="dialogFlag === 'edit'" v-model="merchantAddInfo.merchantName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户账号:" label-width="150px"  prop="accountName">
            <el-input :disabled="dialogFlag === 'edit'" v-model="merchantAddInfo.accountName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label="登陆密码:" label-width="150px"  prop="accountPwd">
            <el-input v-model="merchantAddInfo.accountPwd" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label="确认密码:" label-width="150px"  prop="accountConfirmPwd">
            <el-input v-model="merchantAddInfo.accountConfirmPwd" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label-width="150px" label="联系人:" prop="contactName">
            <el-input v-model="merchantAddInfo.contactName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label-width="150px" label="邮箱:" prop="contactEmail">
            <el-input v-model="merchantAddInfo.contactEmail" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label-width="150px" label="手机号:" prop="contactPhone">
            <el-input v-model="merchantAddInfo.contactPhone" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label="登陆提现IP白名单:" label-width="150px" prop="loginIps">
            <el-input v-model="merchantAddInfo.loginIps" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="启用状态:" label-width="150px" prop="status">
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
        <el-col :span="6" v-if="dialogFlag !== 'edit'">
          <el-form-item label="启用代理" label-width="150px">
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
        <el-col v-if="merchantAddInfo.useAgent === 0 && dialogFlag !== 'edit'" :span="6">
          <el-form-item label="渠道:" label-width="150px" prop="channelIds">
            <el-select
              :options="channelOptions"
              :props="channelProps"
              v-model="merchantAddInfo.channelIds"
              placeholder="请选择渠道"
              style="width: 200px"
              multiple
            ></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="merchantAddInfo.useAgent===1 && dialogFlag !== 'edit'">
          <el-form-item label="所属代理:" label-width="150px" prop="parentId">
            <el-select
                :options="agentOptions"
                :props="agentProps"
                v-model="merchantAddInfo.parentId"
                placeholder="请选择代理"
                style="width: 200px"
            ></el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否开启代付:" label-width="150px"  prop="supportPaying">
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
          <el-form-item label="代付最小金额:" label-width="150px" prop="payMinFee">
            <el-input v-model="merchantAddInfo.payMinFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="代付最大金额:" label-width="150px" prop="payMaxFee">
            <el-input v-model="merchantAddInfo.payMaxFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
        <el-form-item label="代付IP白名单:" label-width="150px"  prop="payWhiteIps">
          <el-input v-model="merchantAddInfo.payWhiteIps" style="width: 200px"/>
        </el-form-item>
        </el-col>
<!--        <el-col :span="6">
          <el-form-item label="代付渠道:" label-width="150px"  prop="payingChannel">
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
          <el-form-item label="代付渠道选中模式:" label-width="150px">
            <el-select disabled v-model="merchantAddInfo.payingChannelModel"
            >
              <el-option key="1" value="1">随机</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportPaying === 1">
<!--        <el-col :span="6">
          <el-form-item label="代付计费模式:" label-width="150px" >
            <el-radio-group v-model="merchantAddInfo.payingChargingModel" size="small">
              <el-radio :value="1">比例</el-radio>
              <el-radio :value="2">固定</el-radio>
              <el-radio :value="3">混合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>-->
<!--        <el-col :span="6" v-if="merchantAddInfo.payingChargingModel === 2 || merchantAddInfo.payingChargingModel === 3">-->
        <el-col :span="6">
          <el-form-item label="代付固定费用:" label-width="150px" prop="payFixedFee">
            <el-input v-model="merchantAddInfo.payFixedFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6" v-if="merchantAddInfo.payingChargingModel===1 || merchantAddInfo.payingChargingModel === 3">-->
        <el-col :span="6">
          <el-form-item label="代付比例费率:" label-width="150px" prop="payRate">
            <el-input v-model="merchantAddInfo.payRate" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否开启代收:" label-width="150px" prop="supportCollection">
            <el-switch
                v-model="merchantAddInfo.supportCollection"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="支持"
                inactive-text="关闭"
                :inactive-value="0"
                :active-value="1"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportCollection === 1">
        <el-col :span="6">
          <el-form-item label="代收最小金额:" label-width="150px" prop="collectionMinFee">
            <el-input v-model="merchantAddInfo.collectionMinFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="代收最大金额:" label-width="150px" prop="collectionMaxFee">
            <el-input v-model="merchantAddInfo.collectionMaxFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="代收IP白名单:" label-width="150px" prop="colWhiteIps">
            <el-input v-model="merchantAddInfo.colWhiteIps" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="display: flex;flex-wrap: wrap;">
          <el-form-item label="金额浮动模式:" label-width="150px" prop="isFloat">
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
        <el-col v-if="merchantAddInfo.isFloat" :span="6">
          <el-form-item  label="浮动金额:" label-width="150px"  prop="floatRange">
            <el-input v-model="merchantAddInfo.floatRange" style="width: 200px;" type="number" placeholder="请输入浮动范围"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="6">
          <el-form-item label="代收渠道选中模式:" label-width="150px">
            <el-select disabled v-model="merchantAddInfo.collectionChannelModel"
            >
              <el-option key="1" value="1">随机</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="merchantAddInfo.supportCollection === 1">
<!--        <el-col :span="6">
          <el-form-item label="代收计费模式:" label-width="150px" >
            <el-radio-group v-model="merchantAddInfo.collectionChargingModel" size="small">
              <el-radio :value="1">比例</el-radio>
              <el-radio :value="2">固定</el-radio>
              <el-radio :value="3">混合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>-->
        <el-col :span="6">
          <el-form-item label="固定费用:" label-width="150px" prop="collectionFixedFee">
            <el-input v-model="merchantAddInfo.collectionFixedFee" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="比例费率:" label-width="150px" prop="collectionRate">
            <el-input v-model="merchantAddInfo.collectionRate" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddDialog('merchantAddInfo')">取 消</el-button>
        <el-button type="primary" @click="submitAddInfo('merchantAddInfo')">确 定</el-button>
      </div>
    </el-form>
  </el-dialog>
  <el-dialog
      title="谷歌验证码"
      v-model="editVerifyVisible"
      class="dialog"
      center
      align-center
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <el-form>
      <el-row style="display: flex;justify-items: center;">
        <el-col :span="24" style="display: flex;justify-content: center;align-items: center;height: 50px;">
          <el-form-item label="谷歌验证码:" label-width="150px" required>
            <el-input type="number" maxlength="6" v-model="editVerifyCode" style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editVerifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditSubmit">确 定</el-button>
      </div>
    </template>
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
          <el-form-item label="商户账号:" label-width="150px" >
            <el-input disabled v-model="merchantInfo.merchantAccount" style="width: 200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商户名称:" label-width="150px"  prop="merchantName">
            <el-input v-model="merchantInfo.merchantName" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登陆密码:" label-width="150px"  prop="merchantPassword">
            <el-input v-model="merchantInfo.merchantPassword" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="确认密码:" label-width="150px"  prop="merchantConfirmPassword">
            <el-input v-model="merchantInfo.merchantConfirmPassword" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="所属代理:" label-width="150px"  prop="merchantAgent">
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
          <el-form-item label="代收白名单:" label-width="150px"  prop="collectingWhiteList">
            <el-input v-model="merchantInfo.collectingWhiteList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登陆提现IP白名单:" label-width="150px"  prop="loginIpWhiteList">
            <el-input v-model="merchantInfo.loginIpWhiteList" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"><el-form-item label="代付白名单:" label-width="150px"  prop="payingWhiteList">
          <el-input v-model="merchantInfo.payingWhiteList" style="width: 200px"></el-input>
        </el-form-item></el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="金额浮动模式:" label-width="150px"  prop="cashFloatModel">
            <el-switch
                v-model="merchantInfo.cashFloatModel"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="关闭"
                :active-value="1"
                :inactive-value="0"
                @change="handleFloatChange"
            >
            </el-switch>
            <!--            <el-input v-model="merchantInfo.cashFloatModel" style="width: 200px"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="支付通道:" label-width="150px"  prop="payingChannel">
            <el-input v-model="merchantInfo.payingChannel" style="width: 200px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="启用状态:" label-width="150px" >
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
      </el-row>
      <el-row v-if="merchantInfo.cashFloatModel">
        <el-col :span="6">
          <el-form-item label-width="150px"  label="浮动金额:" prop="cashFloatNum">
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
          <el-form-item label="谷歌验证码" label-width="150px"  >
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
import {isValidIP, loadingBody} from "@/api/common.js";
import {
  createMerchantInfo, getAgentInfo,
  getAllCurrencyType, getChannelInfo,
  getMerchantInfo,
  getPaymentInfo, modifyMerchantInfo
} from "@/api/interface/backendInterface.js";
export default {
  name: "MerchantInfo",
  data() {
    const cashFloatNumValidate = (rule, value, callback) => {
      if (this.merchantAddInfo.isFloat === 1 && !value) {
        callback(new Error('输入浮动金额'))
      } else {
        callback()
      }
    };
    const validateAddGoogleCode = (rule, value, callback) => {
      if (this.dialogFlag === 'edit') {
        callback()
        return
      }
      if (!value) {
        callback(new Error('googleCode is required'))
        return
      }
      callback()
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
      } else if (value !== this.merchantAddInfo.accountPwd) {
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

    const validAgent = (rule, value, callback) => {
      if (this.merchantAddInfo.useAagent === 1) {
        //use agent channel is null and parentId is not null
        if(!value) {
          callback(new Err('agent is required'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validateChannel = (rule, value, callback) => {
      if (this.merchantAddInfo.useAgent === 0) {
        if(!value) {
          callback(new Error('agent is required'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validPay = (rule, value, callback) => {
      if (this.merchantAddInfo.supportPaying === 1) {
        // support pay
        if(!value) {
          callback(new Error('pay is required'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validPayFixedFee = (rule, value, callback) => {
      if (this.merchantAddInfo.supportPaying === 1) {
        // support pay
        if(!value && !this.merchantAddInfo.payRate) {
          callback(new Error('payFixed or pay Rate need one at least'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validPayRate = (rule, value, callback) => {
      if (this.merchantAddInfo.supportPaying === 1) {
        // support pay
        if(!value && !this.merchantAddInfo.payFixedFee) {
          callback(new Error('payFixed or pay Rate need one at least'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validCollection = (rule, value, callback) => {
      if (this.merchantAddInfo.supportCollection === 1) {
        // support pay
        if(!value) {
          callback(new Error('pay is required'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validCollectionFixedFee = (rule, value, callback) => {
      if (this.merchantAddInfo.supportCollection === 1) {
        // support pay
        if(!value && !this.merchantAddInfo.collectionRate) {
          callback(new Error('collectionFixed or collection Rate need one at least'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    const validCollectionRate = (rule, value, callback) => {
      if (this.merchantAddInfo.supportCollection === 1) {
        // support pay
        if(!value && !this.merchantAddInfo.collectionFixedFee) {
          callback(new Error('collectionFixed or collection Rate need one at least'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    return {
      isAdmin: false,
      filterAvaiable: false,
      tableKey: 0,
      activeTool: "1",
      currency: '',
      currencyIcon: '',
      currencyIcons: {},
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      currencyMaps: {},
      channelMaps: {},
      agentMaps: {},
      statisticsInfo: {},
      merchantReport: {},
      merchantInfoAddRule: {
        merchantName: [
          {required: true, message: 'merchantName is required', trigger: 'blur'},
        ],
        /*merchantAgent: [
          {required: true, validator: validateAgent, trigger: 'blur'},
        ],*/
        accountName: [
          {
            required: true, message: 'accountName is required', trigger: 'blur'
          }
        ],
        accountPwd: [
          {
            required: true, validator: validatePass, trigger: 'blur'
          }
        ],
        accountConfirmPwd: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ],
        contactName: [
            {required: true, message: 'contactName is required', trigger: 'blur'}
        ],
        contactEmail: [
            {required: true, message: 'contactEmail is required', trigger: 'blur'}
        ],
        contactPhone: [
            {required: true, message: 'contactPhone is required', trigger: 'blur'}
        ],
        loginIps: [
            {required: true, message: 'loginIp is required', trigger: 'blur'}
        ],
        channelIds: [
          {
            required: true, validator: validateChannel, trigger: 'blur'
          }
        ],
        parentId: [{
          required: true,validator: validAgent, trigger: 'blur'
        }],
        payMinFee: [{
          required: true, message: 'payMinFee is required', trigger: 'blur'
        }],
        payMaxFee: [{
          required: true, message: 'payMaxFee is required', trigger: 'blur'
        }],
        payWhiteIps: [
            {required: true, validator: validPay, trigger: 'blur'}
        ],
        payFixedFee: [
            {required: true, validator: validPayFixedFee, trigger: 'blur'}
        ],
        payRate: [
          {required: true, validator: validPayRate, trigger: 'blur'}
        ],
        collectionMinFee: [
            {required: true, message: 'collectionMinFee is required', trigger: 'blur'}
        ],
        collectionMaxFee: [
            {required: true, message: 'collectionMaxFee is required', trigger: 'blur'}
        ],
        colWhiteIps: [
            {required: true, validator: validCollection, trigger: 'blur'}
        ],
        collectionFixedFee: [
            {required: true, validator: validCollectionFixedFee, trigger: 'blur'}
        ],
        collectionRate: [
            {required: true, validator: validCollectionRate, trigger: 'blur'}
        ],
        googleCode: [],
        floatRange: [
          {required: true, validator: cashFloatNumValidate, trigger: 'blur'},
        ],
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
       /* cashFloatModel: [
            {required: true, message: 'cashFloatModel is required', trigger: 'blur'},
        ],*/
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
      editVerifyVisible: false,
      editVerifyCode: '',
      verifyAction: '',
      deleteMerchantInfo: {},
      dialogDeleteVisible: false,
      dialogDeleteTitle: "",
      totalCount: 1,
      currentPage: 1,
      pageSize: 1,
      pageSizes: [1,10, 20, 30, 40],
      filterbox: {

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
      ],
      merchantAddInfo: {},
      merchantInfo: {
      },
      dialogTitle: '',
      dialogFormVisible: false,
      selectedAgent: [],
      agentOptions: [
      ],
      agentProps: {
        value: 'userId',
        label: 'agentName'
      },
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
        value: 'channelId',
        label: 'channelName'
      }
    }
  },
  methods: {
    confirmEditSubmit() {
      if (!this.editVerifyCode) {
        this.$message({
          type: 'error',
          message: 'you need to type google code'
        })
        return
      }
      this.merchantAddInfo.googleCode = this.editVerifyCode
      const request = this.verifyAction === 'create'
        ? createMerchantInfo(this.merchantAddInfo)
        : modifyMerchantInfo(this.merchantAddInfo)
      request.then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.dialogAddFormVisible = false
          this.dialogTitle = ''
          if (this.verifyAction === 'create') {
            this.$refs.merchantAddInfo?.resetFields()
          }
          this.search()
          this.$notify({
            title: 'Success',
            type: 'success',
            message: this.verifyAction === 'create'
              ? 'Create New Merchant Successfully'
              : 'Update New Merchant Successfully',
            duration: 4000,
            position: 'bottom-right'
          })
        } else if (res.status === 200 && res.data.code !== 0) {
          this.$notify({
            title: 'Failed',
            type: 'error',
            message: res.data.message,
            duration: 4000,
            position: 'bottom-right'
          })
        } else {
          this.$message({
            type: 'error',
            title: 'Error',
            message: 'some error occurred.',
            duration: 4000,
            position: 'bottom-right'
          })
        }
      }).finally(() => {
        this.editVerifyVisible = false
        this.editVerifyCode = ''
        this.verifyAction = ''
      })
    },
    search() {
      this.filterbox.isNeedCardData = true
      const loadingInstance = loadingBody(this, 'merchantInfos-table')
      getMerchantInfo(this.filterbox).then(res => {
         //this.merchantInfoFormData
        if(res.status === 200 && res.data.code === 0) {
          const all = JSON.parse(res.data.data)
          this.pageSize = all.pageSize
          this.totalCount = all.totalNumber
          const allList = all.merchantInfoDtoList
          this.merchantInfoFormData = null;
          this.merchantInfoFormData = Object.assign([], allList)
          if(!this.isAdmin) {
            this.filterbox.merchantName = allList[0].merchantName
            this.filterbox.merchantUserName = allList[0].accountName
            this.agentOptions = allList[0].agentInfos
            //this.channelOptions = allList[0].channelDtoList
          }
          this.tableKey++
        }
        loadingInstance.close()
      })
    },
    handleOpen(form) {
      this.$nextTick(() => {
        if (this.dialogFlag === 'edit') {
          this.$refs[form].clearValidate();
        } else {
          this.$refs[form].resetFields();
        }
      });
    },
    handleCurrentChange(currentPage) {
       this.filterbox.pageNo = currentPage;
       this.filterbox.pageSize = this.pageSize;
       this.search();
    },
    handleSizeChange(size) {
      this.filterbox.pageNo = 1
      this.currentPage = 1
      this.filterbox.pageSize = size
      this.pageSize = size
      this.handleCurrentChange()
    },
    reset(form) {
      this.filterbox.merchantAccount = '';
      this.filterbox.isInUse = true;
      this.filterbox.supportCurrency = '';
      this.filterbox.belongAgent = [];
      this.filterbox.merchantName = '';
      this.$refs[form].resetFields();
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
      this.dialogFlag = 'create'
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
    cancelAddDialog(form) {
      this.dialogAddFormVisible = false;
      this.dialogAddTitle = '',
      this.merchantInfo = {}
      this.selectedAgent = []
      this.dialogFlag = ''
      this.$refs[form].resetFields();
    },
    cancelDeleteDialog() {
      this.dialogDeleteTitle = ''
      this.dialogDeleteVisible = false
      this.deleteMerchantInfo = {}
    },
    editMerchantInfo(rowInfo) {
      console.log('rowInfo----'+JSON.stringify(rowInfo))
      this.merchantAddInfo = Object.assign({},rowInfo)
      console.log('addInfo----'+JSON.stringify(this.merchantAddInfo))
      this.merchantAddInfo.merchantUserId = rowInfo.userId
      this.merchantAddInfo.channelIds = this.merchantAddInfo.channelIds ? this.merchantAddInfo.channelIds.split(',') : []
      if(rowInfo.agentInfos) {
        this.merchantAddInfo.useAgent = 1
      }
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
          if(!this.merchantAddInfo.payRate) {
            this.merchantAddInfo.payRate = 0
          } else if (!this.merchantAddInfo.payFixedFee) {
            this.merchantAddInfo.payFixedFee = 0
          }
        } else if (this.merchantAddInfo.supportCollection === 1) {
          this.merchantAddInfo.supportType = 0
          if(!this.merchantAddInfo.collectionRate) {
            this.merchantAddInfo.collectionRate = 0
          } else if (!this.merchantAddInfo.collectionFixedFee) {
            this.merchantAddInfo.collectionFixedFee = 0
          }
        } else {
          this.merchantAddInfo.supportType = 2
          if(!this.merchantAddInfo.payRate) {
            this.merchantAddInfo.payRate = 0
          } else if (!this.merchantAddInfo.payFixedFee) {
            this.merchantAddInfo.payFixedFee = 0
          }

          if(!this.merchantAddInfo.collectionRate) {
            this.merchantAddInfo.collectionRate = 0
          } else if (!this.merchantAddInfo.payFixedFee) {
            this.merchantAddInfo.collectionFixedFee = 0
          }
        }
      }
      this.merchantAddInfo.channelIds = this.merchantAddInfo.channelIds ? this.merchantAddInfo.channelIds : []
      this.$refs[form].validate(valid => {
        if (valid) {
          // 校验通过
          // request interface to create merchant
          if (this.dialogFlag === 'create') {
            this.editVerifyCode = ''
            this.verifyAction = 'create'
            this.editVerifyVisible = true
          } else if(this.dialogFlag === 'edit') {
            this.editVerifyCode = ''
            this.verifyAction = 'edit'
            this.editVerifyVisible = true
          }
        }
      })
    }
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
    let roleName = localStorage.getItem('roleName')
    this.isAdmin = roleName === 'admin'
    if (roleName === 'merchant') {
      //filterData.merchantUserId = localStorage.getItem('userId')
      this.filterbox.merchantUserName = localStorage.getItem('userName')
      this.filterAvaiable = true
    }
    await getAgentInfo({}).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        this.agentOptions = JSON.parse(res.data.data).agentInfoDtoList
        this.agentOptions.forEach(agent => {
          this.agentMaps[agent.agentNo] = agent.agentName
        })
      }
    })
    getChannelInfo({pageSize: 1000}).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        const allData = JSON.parse(res.data.data).channelDtoList
        this.channelOptions = allData
        this.channelOptions.forEach(channel => {
          this.channelMaps[channel.channelId] = channel.channelName
        })
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
@import "@/assets/base.css";
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


  .toolbarName{
    color: black;
  }

  .agent-info-card{
    background-color: #f5f5f5;
    margin-top: 6px;
    border-radius: 6px;
    padding: 4px 6px;
    box-shadow: 0 3px 8px rgba(24, 24, 24, 0.18);
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

  .account-info-value{
    font-size: 20px;
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

  :deep(.el-switch.is-disabled .el-switch__core){
    background-color: #c0c4cc;
    border-color: #c0c4cc;
  }

  :deep(.el-switch.is-disabled.is-checked .el-switch__core){
    background-color: #07c160;
    border-color: #07c160;
  }

</style>
