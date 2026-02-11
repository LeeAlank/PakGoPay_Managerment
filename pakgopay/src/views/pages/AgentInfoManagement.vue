<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">{{ $t('agentInfo.title') }}</div>
  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="main-toolbar" style="height: 100px;">
        <el-form class="main-toolform" style="display: grid;align-items: center;width: 100%;" ref="filterboxForm" :model="filterbox">
          <el-row style="width: 100%;">
            <el-col :span="8">
              <div>
                <el-form-item :label="$t('agentInfo.filter.agentName')" label-width="150px" prop="agentName">
                  <el-select
                    v-model="filterbox.agentName"
                    filterable
                    remote
                    clearable
                    :remote-method="handleAgentNameSearch"
                    :loading="agentNameLoading"
                    :placeholder="$t('agentInfo.filter.agentName')"
                    popper-class="agent-name-select-dropdown"
                    @visible-change="handleAgentNameDropdownVisible"
                    style="width: 200px;"
                    :disabled="filterAvaiable"
                  >
                    <el-option
                      v-for="item in agentNameOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item :label="$t('agentInfo.filter.accountName')" label-width="150px" prop="accountName">
                  <el-input v-model="filterbox.accountName" style="width: 200px;"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-form-item :label="$t('agentInfo.filter.status')" label-width="150px" prop="status">
                  <el-select
                    style="width: 200px;"
                    :placeholder="$t('agentInfo.placeholder.status')"
                    v-model="filterbox.status"
                  >
                    <el-option :label="$t('common.disable')" :value="0">{{ $t('common.disable') }}</el-option>
                    <el-option :label="$t('common.enable')" :value="1">{{ $t('common.enable') }}</el-option>
                  </el-select>
                  <div style="display: flex; flex-direction: row;">
                    <el-button @click="reset('filterboxForm')" class="filterButton">
                      <SvgIcon class="filterButtonSvg" name="reset"/>
                      <div>{{ $t('common.reset') }}</div>
                    </el-button>&nbsp;
                    <el-button @click="search()"
                               class="filterButton">
                      <SvgIcon class="filterButtonSvg" name="search"/>
                      <div>{{ $t('common.query') }}</div>
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
          <div>{{ $t('agentInfo.action.addFirstLevel') }}</div>
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
            :label="$t('agentInfo.column.agentInfo')"
            v-slot="{row}"
            align="center"
            width="300px"
            style="height: 95%;"
            fixed="left"
        >
          <div style="height: auto;display: flex; justify-content: center;width: 100%;">
            <el-card class="box-card" style="width: 100%">
              <div class="agent-card-row agent-card-account">{{ $t('agentInfo.card.account') }}{{ row.accountName }}</div>
              <div class="agent-card-row agent-card-name">{{ $t('agentInfo.card.name') }}{{ row.agentName }}</div>
              <div v-if="row.channelDtoList" class="agent-card-row agent-card-channel">
                <div style="display: flex;align-items: center">
                  <div style="height:100%;width:150px;align-items: center;justify-items: center;text-align: center;">{{ $t('agentInfo.card.channel') }}</div>
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
            :label="$t('agentInfo.column.parentAgent')"
            v-slot="{row}"
            align="center"
            width="300px"
            fixed="left"
        >
          <div style="height: auto;display: flex; justify-content: center;width: 100%;">
            <el-card v-if="row.parentUserName" class="box-card" style="width: 100%">
              <div class="agent-card-row agent-card-account">{{ $t('agentInfo.card.account') }}{{ row.parentUserName }}</div>
              <div class="agent-card-row agent-card-name">{{ $t('agentInfo.card.name') }}{{ row.parentAgentName }}</div>
              <div class="agent-card-row agent-card-channel">
                <div style="display: flex;align-items: center">
                  <div style="height:100%;width:150px;align-items: center;justify-items: center;text-align: center;">{{ $t('agentInfo.card.channel') }}</div>
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
            :label="$t('agentInfo.column.level')"
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
            :label="$t('agentInfo.column.status')"
            v-slot="{row}"
            align="center"
        >
          <div>
            <el-switch
                v-model="row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-text="$t('common.enable')"
                :inactive-text="$t('common.disable')"
                :inactive-value="0"
                :active-value="1"
                disabled
            ></el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="agentLevel"
            :label="$t('agentInfo.column.rate')"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            {{ $t('agentInfo.rate.collection') }}{{row.collectionRate ? row.collectionRate : 0 }}% + {{row.collectionFixedFee? row.collectionFixedFee : 0}}
          </div>
          <div>
            {{ $t('agentInfo.rate.payout') }}{{row.payRate? row.payRate : 0}}% + {{row.payFixedFee? row.payFixedFee : 0}}
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
            :label="$t('agentInfo.column.loginWhitelist')"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>{{ row.loginIps }}</div>
        </el-table-column>
        <el-table-column
            :label="$t('agentInfo.column.withdrawWhitelist')"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>{{ row.withdrawIps }}</div>
        </el-table-column>
        <el-table-column
            :label="$t('agentInfo.column.accountInfo')"
            v-slot="{row}"
            align="center"
            width="300px"
        >
          <div class="account-info-wrap">
            <!-- 返回的是json对象 包含总金额、可用金额、冻结金额 -->
            <div class="account-info-card" v-for="(value, key, index) in row.balanceInfo" :key="key">
              <div class="account-info-row account-info-key">{{key}}:</div>
              <div class="account-info-row account-total">{{ $t('agentInfo.account.total') }} <div class="account-info-value">{{value.total ? value.total: '-'}}</div></div>
              <div class="account-info-row account-usable">{{ $t('agentInfo.account.available') }} <div class="account-info-value">{{value.available? value.available: '-'}}</div></div>
              <div class="account-info-row account-frozen">{{ $t('agentInfo.account.frozen') }} <div class="account-info-value">{{value.frozen? value.frozen : '-'}}</div></div>
            </div>
          </div>
        </el-table-column>
        <el-table-column
          :label="$t('agentInfo.column.contactInfo')"
          v-slot="{row}"
          align="center"
          width="300px"
        >
            <div class="agent-card-row agent-card-account">
              {{ $t('agentInfo.contact.name') }} {{row.contactName? row.contactName : '-'}}
            </div>
          <div class="agent-card-row agent-card-name">
            {{ $t('agentInfo.contact.phone') }} {{row.contactPhone ? row.contactPhone: '-'}}
          </div>
          <div class="agent-card-row agent-card-channel">
            {{ $t('agentInfo.contact.email') }} {{row.contactEmail ? row.contactEmail: '-'}}
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
            :label="$t('common.operation')"
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
                <el-dropdown-item @click="editAgentInfo(row)">{{ $t('common.edit') }}</el-dropdown-item>
<!--                <el-dropdown-item @click="deleteAgentInfo(row)">删除</el-dropdown-item>-->
                <el-dropdown-item v-if="row.level !== 3" @click="addNextLevelAgent(row)">{{ $t('agentInfo.action.addNextLevel') }}
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
              <el-form-item :label="$t('agentInfo.form.agentName')" label-width="150px" prop="agentName">
                <el-input type="text" v-model="agentInfo.agentName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.accountName')" label-width="150px" prop="accountName">
                <el-input autocomplete="new-password" type="text" v-model="agentInfo.accountName"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.level')" label-width="150px" prop="level">
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
              <el-form-item :label="$t('agentInfo.form.contactName')" label-width="150px" prop="contactName">
                <el-input v-model.number="agentInfo.contactName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.contactPhone')" label-width="150px" prop="contactPhone">
                <el-input v-model.number="agentInfo.contactPhone" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.contactEmail')" label-width="150px" prop="contactEmail">
                <el-input v-model="agentInfo.contactEmail" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.collectionFixedFee')" label-width="150px" prop="collectionFixedFee">
                <el-input type="number" v-model.number="agentInfo.collectionFixedFee" style="width: 200px" @blur="handleCollectionFeeBlur"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.collectionRate')" label-width="150px" prop="collectionRate">
                <el-input type="number" v-model.number="agentInfo.collectionRate" style="width: 200px" @blur="handleCollectionFeeBlur"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.payFixedFee')" label-width="150px" prop="payFixedFee">
                <el-input type="number" v-model.number="agentInfo.payFixedFee" style="width: 200px" @blur="handlePayFeeBlur"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.payRate')" label-width="150px" prop="payRate">
                <el-input type="number" v-model.number="agentInfo.payRate" style="width: 200px" @blur="handlePayFeeBlur"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.channelConfig')" label-width="150px" prop="channelIdList">
                <el-select
                    v-model="agentInfo.channelIdList"
                    style="width: 200px" :placeholder="$t('agentInfo.placeholder.channelConfig')"
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
              <el-form-item :label="$t('agentInfo.form.status')" label-width="150px" style="width: 350px;" prop="status">
                <el-switch
                    v-model="agentInfo.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-text="$t('common.enable')"
                    :inactive-text="$t('common.disable')"
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
                <el-form-item :label="$t('agentInfo.form.loginWhitelist')" label-width="150px" prop="loginIps">
                  <el-input autocomplete="new-password" v-model="agentInfo.loginIps"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item :label="$t('agentInfo.form.withdrawWhitelist')" label-width="150px" prop="withdrawalIps">
                  <el-input autocomplete="new-password" v-model="agentInfo.withdrawalIps"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item :label="$t('agentInfo.form.collectionMaxFee')" label-width="150px" prop="collectionMaxFee">
                  <el-input autocomplete="new-password" v-model="agentInfo.collectionMaxFee"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item :label="$t('agentInfo.form.collectionMinFee')" label-width="150px" prop="collectionMaxFee">
                  <el-input autocomplete="new-password" v-model="agentInfo.collectionMinFee"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item :label="$t('agentInfo.form.payMaxFee')" label-width="150px" prop="payMaxFee">
                  <el-input autocomplete="new-password" v-model="agentInfo.payMaxFee"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="el-form-line">
                <el-form-item :label="$t('agentInfo.form.payMinFee')" label-width="150px" prop="payMinFee">
                  <el-input autocomplete="new-password" v-model="agentInfo.payMinFee"
                            style="width: 200px"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
          <el-col :span="8" v-if="modifyType !== 'edit'">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.accountPwd')" label-width="150px" prop="accountPwd">
                <el-input autocomplete="new-password" type="password" v-model="agentInfo.accountPwd"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" v-if="modifyType !== 'edit'">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.confirmPwd')" label-width="150px" prop="accountConfirmPwd">
                <el-input type="password" v-model="agentInfo.accountConfirmPwd" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <!-- google code moved to second confirm dialog -->
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog('createAgentForm')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit('createAgentForm')">{{ $t('common.confirm') }}</el-button>
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
              <el-form-item :label="$t('agentInfo.parent.agentName')" label-width="150px" >
                <el-input disabled type="text" v-model="nextLevelAgentInfo.parentAgentName"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.parent.accountName')" label-width="150px" >
                <el-input disabled type="text" v-model="nextLevelAgentInfo.parentAgentAccount"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.agentName')" label-width="150px" >
                <el-input type="text" v-model="nextLevelAgentInfo.agentName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.accountName')" label-width="150px" >
                <el-input autocomplete="new-password" type="text" v-model="nextLevelAgentInfo.agentAccount"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.accountPwd')" label-width="150px" >
                <el-input autocomplete="new-password" type="password" v-model="nextLevelAgentInfo.agentPassword"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.confirmPwd')" label-width="150px" >
                <el-input type="password" v-model="nextLevelAgentInfo.agentConfirmPassword"
                          style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.status')" label-width="150px"  style="width: 350px;">
                <el-switch
                    v-model="nextLevelAgentInfo.agentStatus"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-text="$t('common.enable')"
                    :inactive-text="$t('common.disable')"
                >
                </el-switch>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.channelRate')" label-width="150px" >
                <el-input type="number" v-model="nextLevelAgentInfo.channelRate" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.channelConfig')" label-width="150px" >
                <el-select v-model="nextLevelAgentInfo.channelConfig" style="width: 200px" :placeholder="$t('agentInfo.placeholder.channelConfig')">
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
              <el-form-item :label="$t('agentInfo.form.agentRate')" label-width="150px" >
                <el-input type="number" v-model="nextLevelAgentInfo.agentRate" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <!-- google code moved to second confirm dialog -->
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-bottom:10px;display: flex;padding:0;">
        <el-button @click="calcelParentDialog">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!-- Google code confirm dialog -->
    <el-dialog
        :title="googleConfirmTitle"
        v-model="googleConfirmVisible"
        class="dialog"
        center
        width="30%"
        height="200px"
    >
      <el-form ref="googleConfirmForm" :rules="googleConfirmRule" :model="googleConfirmData" style="height:100px;margin-top: 20px">
        <el-row>
          <el-col :span="24" style="display: flex;justify-content: center;align-items: center;">
            <el-form-item :label="$t('common.googleCode')" label-width="150px" prop="googleCode">
              <el-input v-model="googleConfirmData.googleCode" style="width: 200px"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 3%;height: 30px;">
        <el-button @click="cancelGoogleConfirm('googleConfirmForm')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitGoogleConfirm('googleConfirmForm')">{{ $t('common.confirm') }}</el-button>
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
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const AGENT_DRAFT_KEY = 'agentInfoDraft';
const buildEmptyAgentInfo = () => ({
  agentName: '',
  accountName: '',
  level: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  collectionFixedFee: '',
  collectionRate: '',
  payFixedFee: '',
  payRate: '',
  channelIdList: [],
  status: 1,
  loginIps: '',
  withdrawalIps: '',
  collectionMaxFee: '',
  collectionMinFee: '',
  payMaxFee: '',
  payMinFee: '',
  accountPwd: '',
  accountConfirmPwd: '',
  parentId: '',
  topAgentId: '',
  parentChannelDtoList: [],
});

export default {
  name: 'ChannelList',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error(this.$t('agentInfo.validation.passwordRequired')))
      } else {
        if (this.agentInfo.accountConfirmPwd !== '' && this.agentInfo.accountConfirmPwd !== 'undefined') {
          this.$refs.createAgentForm.validateField('accountConfirmPwd');
        }
        callback()
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error(this.$t('agentInfo.validation.passwordAgainRequired')))
      } else if (value !== this.agentInfo.accountPwd) {
        callback(new Error(this.$t('agentInfo.validation.passwordMismatch')))
      } else {
        callback()
      }
    };

    const validCollectionFee = (rule, value, callback) => {
      if ( !value && !this.agentInfo.collectionRate) {
        callback(new Error(this.$t('agentInfo.validation.feeRequired')))
      } else {
        callback()
      }
    };

    const validCollectionRate = (rule, value, callback) => {
      if ( !value && !this.agentInfo.collectionFixedFee) {
        callback(new Error(this.$t('agentInfo.validation.feeRequired')))
      } else {
        callback()
      }
    };

    const validPayFee = (rule, value, callback) => {
      if ( !value && !this.agentInfo.payRate) {
        callback(new Error(this.$t('agentInfo.validation.feeRequired')))
      } else {
        callback()
      }
    };

    const validPayRate = (rule, value, callback) => {
      if ( !value && !this.agentInfo.payFixedFee) {
        callback(new Error(this.$t('agentInfo.validation.feeRequired')))
      } else {
        callback()
      }
    }
    return {
      activeTool: '1',
      createType: '',
      modifyType: '',
      tablekey: 0,
      isAdmin: false,
      filterAvaiable: false,
      agentNameOptions: [],
      agentNameLoading: false,
      agentNameHasMore: true,
      agentNamePageNo: 1,
      agentNamePageSize: 20,
      agentNameQuery: '',
      agentNameScrollBound: false,
      filterbox: {
      },
      dialogFormVisible: false,
      parentDialogTitle: '',
      parentDialogVisible: false,
      googleConfirmTitle: this.$t('agentInfo.dialog.googleVerify'),
      googleConfirmVisible: false,
      googleConfirmData: {
        googleCode: ''
      },
      channelOptions: [],
      channelProps: {
        value: 'channelId',
        label: 'channelName'
      },
      dialogTitle: '',
      agentInfo: buildEmptyAgentInfo(),
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
        parentChannelDtoList: [],
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
      googleConfirmRule: {
        googleCode: {
          required: true,
          message: this.$t('common.googleCodeRequired'),
          trigger: 'blur'
        }
      },
      totalCount: 100,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 200],
      currentPage: 1,
      pendingSubmitAction: '',
    }
  },
  watch: {
    dialogFormVisible(visible) {
      if (visible) {
        this.loadAgentDraft();
      }
    },
    agentInfo: {
      deep: true,
      handler() {
        this.saveAgentDraft();
      }
    },
    createType() {
      this.saveAgentDraft();
    }
  },
  async mounted() {
    this.agentInfoTableData = this.agentInfoFormData
    this.totalCount = this.agentInfoTableData.length
    const roleName = localStorage.getItem('roleName')
    this.isAdmin = roleName === 'admin'
    if (roleName === 'agent') {
      this.filterbox.agentName = localStorage.getItem('userName')
      this.filterAvaiable = true
      if (this.filterbox.agentName) {
        this.agentNameOptions = [{
          value: this.filterbox.agentName,
          label: this.filterbox.agentName
        }]
      }
    }
    // get paymentInfos
    await getChannelInfo({pageSize: 1000}).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        this.channelOptions = JSON.parse(res.data.data).channelDtoList
      }
    })

    this.search()
  },
  methods: {
    saveAgentDraft() {
      if (!this.dialogFormVisible) return;
      const isEdit = this.modifyType === 'edit';
      const isCreate = this.createType === 'firstLevel' || this.createType === 'nextLevel';
      if (!isEdit && !isCreate) return;
      const recordId = isEdit ? (this.agentInfo?.userId || this.agentInfo?.id || this.agentInfo?.agentId || '') : '';
      const payload = {
        mode: isEdit ? 'edit' : 'create',
        createType: this.createType,
        recordId,
        parentId: this.agentInfo?.parentId || '',
        topAgentId: this.agentInfo?.topAgentId || '',
        data: this.agentInfo || {}
      };
      saveDraft(AGENT_DRAFT_KEY, payload);
    },
    loadAgentDraft() {
      const draft = loadDraft(AGENT_DRAFT_KEY);
      if (!draft) return;
      const isEdit = this.modifyType === 'edit';
      if (isEdit) {
        const recordId = this.agentInfo?.userId || this.agentInfo?.id || this.agentInfo?.agentId || '';
        if (!recordId || draft.recordId !== recordId || draft.mode !== 'edit') return;
      } else {
        if (this.createType !== 'firstLevel' && this.createType !== 'nextLevel') return;
        if (draft.mode !== 'create' || draft.createType !== this.createType) return;
        if (this.createType === 'nextLevel') {
          const currentParentId = this.agentInfo?.parentId || '';
          if (draft.parentId && currentParentId && draft.parentId !== currentParentId) {
            return;
          }
        }
      }
      this.agentInfo = Object.assign(buildEmptyAgentInfo(), draft.data || {});
    },
    clearAgentDraft() {
      clearDraft(AGENT_DRAFT_KEY);
    },
    handleAgentNameDropdownVisible(visible) {
      if (!visible || this.filterAvaiable) return;
      if (!this.agentNameOptions.length) {
        this.resetAgentNameOptions();
        this.fetchAgentNameOptions(false);
      }
      this.attachAgentNameScroll();
    },
    handleAgentNameSearch(query) {
      if (this.filterAvaiable) return;
      this.agentNameQuery = query || '';
      this.resetAgentNameOptions();
      this.fetchAgentNameOptions(false);
    },
    resetAgentNameOptions() {
      this.agentNamePageNo = 1;
      this.agentNameHasMore = true;
      this.agentNameOptions = [];
    },
    fetchAgentNameOptions(append) {
      if (this.agentNameLoading || !this.agentNameHasMore) return;
      this.agentNameLoading = true;
      const payload = {
        pageNo: this.agentNamePageNo,
        pageSize: this.agentNamePageSize,
        isNeedCardData: false
      };
      if (this.agentNameQuery) {
        payload.agentName = this.agentNameQuery;
      }
      getAgentInfo(payload).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const all = JSON.parse(res.data.data);
          const list = all.agentInfoDtoList || [];
          const mapped = list.map(item => ({
            value: item.agentName,
            label: item.agentName
          }));
          this.agentNameOptions = append
            ? this.agentNameOptions.concat(mapped)
            : mapped;
          if (list.length < this.agentNamePageSize) {
            this.agentNameHasMore = false;
          } else {
            this.agentNamePageNo += 1;
          }
        } else {
          this.agentNameHasMore = false;
        }
      }).finally(() => {
        this.agentNameLoading = false;
      });
    },
    attachAgentNameScroll() {
      this.$nextTick(() => {
        const wrap = document.querySelector(".agent-name-select-dropdown .el-select-dropdown__wrap");
        if (!wrap || this.agentNameScrollBound) return;
        wrap.addEventListener("scroll", this.handleAgentNameScroll);
        this.agentNameScrollBound = true;
      });
    },
    handleAgentNameScroll(event) {
      const el = event.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        this.fetchAgentNameOptions(true);
      }
    },
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
        const fileName = this.$t('agentInfo.exportFileName') + getFormateTime()
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
            title: this.$t('common.error'),
            type: 'error',
            duration: 5000,
            message: res.data.message,
            position: 'bottom-right'
          })
        } else {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            duration: 5000,
            position: 'bottom-right',
            message: this.$t('common.requestFailed')
          })
        }
        loadingInstance.close()
      }).catch((err) => {
        loadingInstance.close()
        this.$notify({
          title: this.$t('common.error'),
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
          this.pendingSubmitAction = this.modifyType === 'edit' ? 'edit' : 'create'
          this.googleConfirmTitle = this.$t('agentInfo.dialog.googleVerify')
          this.googleConfirmVisible = true
        }
      })
    },
    cancelGoogleConfirm(form) {
      if (this.$refs[form]) {
        this.$refs[form].resetFields()
      }
      this.googleConfirmData.googleCode = ''
      if (this.agentInfo) {
        this.agentInfo.googleCode = ''
      }
      this.googleConfirmVisible = false
      this.pendingSubmitAction = ''
    },
    submitGoogleConfirm(form) {
      this.$refs[form].validate(valid => {
        if (!valid) return
        this.agentInfo.channelIds = this.agentInfo.channelIdList
        this.agentInfo.googleCode = this.googleConfirmData.googleCode
        const isEdit = this.pendingSubmitAction === 'edit'
        const request = isEdit ? modifyAgentInfo(this.agentInfo) : createAgentInfo(this.agentInfo)
        request.then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            this.search()
            this.dialogFormVisible = false
            this.dialogTitle = ''
            this.$notify({
              title: this.$t('common.success'),
              type: 'success',
              duration: 5000,
              position: 'bottom-right',
              message: isEdit ? this.$t('agentInfo.message.modifySuccess') : this.$t('agentInfo.message.createSuccess')
            })
            this.cancelGoogleConfirm(form)
            this.modifyType = ''
            this.createType = ''
            this.clearAgentDraft()
            this.agentInfo = buildEmptyAgentInfo()
          } else if (res.status === 200 && res.data.code !== 0) {
            this.$notify({
              title: this.$t('common.error'),
              type: 'error',
              duration: 5000,
              position: 'bottom-right',
              message: res.data.message,
            })
          } else {
            this.$notify({
              title: this.$t('common.error'),
              type: 'error',
              duration: 5000,
              position: 'bottom-right',
              message: this.$t('common.requestFailed')
            })
          }
        })
      })
    },
    addFistLevelAgent() {
      this.modifyType = ''
      this.agentInfo = buildEmptyAgentInfo()
      this.dialogFormVisible = true;
      this.dialogTitle = this.$t('agentInfo.dialog.addFirstLevel')
      this.agentInfo.level = 1
      this.createType = 'firstLevel'
      this.loadAgentDraft()
    },
    cancelDialog(form) {
      this.modifyType = ''
      this.createType = ''
      this.$refs[form].resetFields()
      this.dialogFormVisible = false;
      this.dialogTitle = ''
      this.agentInfo = buildEmptyAgentInfo()
      this.clearAgentDraft()
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
      this.dialogTitle = this.$t('agentInfo.dialog.edit')
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
      this.agentInfo = buildEmptyAgentInfo()
      this.agentInfo.parentId = val.userId
      this.agentInfo.topAgentId = val.topAgentId
      this.agentInfo.parentChannelDtoList = val.channelDtoList
      this.agentInfo.level = val.level + 1
      this.dialogTitle = this.$t('agentInfo.dialog.addNextLevel')
      this.dialogFormVisible = true;
      this.loadAgentDraft()
    },
    handlePayFeeBlur() {
      if (this.$refs.createAgentForm) {
        this.$refs.createAgentForm.validateField('payFixedFee')
        this.$refs.createAgentForm.validateField('payRate')
      }
    },
    handleCollectionFeeBlur() {
      if (this.$refs.createAgentForm) {
        this.$refs.createAgentForm.validateField('collectionFixedFee')
        this.$refs.createAgentForm.validateField('collectionRate')
      }
    },
    deleteAgentInfo() {
      this.$confirm(this.$t('agentInfo.confirm.deleteMessage'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning',
      }).then(() => {
        //直行删除
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('agentInfo.confirm.deleteCanceled')
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
