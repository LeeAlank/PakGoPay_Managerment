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
                <el-form-item :label="$t('agentInfo.filter.accountName')" label-width="150px" prop="accountName">
                  <el-select
                    v-model="filterbox.accountName"
                    filterable
                    remote
                    clearable
                    :remote-method="handleAccountNameSearch"
                    :loading="accountNameLoading"
                    :placeholder="$t('agentInfo.filter.accountName')"
                    popper-class="account-name-select-dropdown"
                    @visible-change="handleAccountNameDropdownVisible"
                    style="width: 200px;"
                  >
                    <el-option
                      v-for="item in accountNameOptions"
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
                <el-form-item :label="$t('agentInfo.filter.agentName')" label-width="150px" prop="agentName">
                  <el-select
                    v-model="filterbox.agentName"
                    :filterable="roleName !== 'agent'"
                    :remote="roleName !== 'agent'"
                    :clearable="roleName !== 'agent'"
                    :disabled="roleName === 'agent'"
                    :remote-method="handleAgentNameSearch"
                    :loading="agentNameLoading"
                    :placeholder="$t('agentInfo.filter.agentName')"
                    popper-class="agent-name-select-dropdown"
                    @visible-change="handleAgentNameDropdownVisible"
                    style="width: 200px;"
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
                <el-form-item :label="$t('agentInfo.filter.status')" label-width="150px" prop="status">
                  <el-select
                    style="width: 200px;"
                    :placeholder="$t('agentInfo.placeholder.status')"
                    v-model="filterbox.status"
                  >
                    <el-option :label="$t('common.disable')" :value="0">{{ $t('common.disable') }}</el-option>
                    <el-option :label="$t('common.enable')" :value="1">{{ $t('common.enable') }}</el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div class="toolbar-action-row">
            <el-button @click="reset('filterboxForm')" class="filterButton">
              <SvgIcon class="filterButtonSvg" name="reset"/>
              <div>{{ $t('common.reset') }}</div>
            </el-button>
            <el-button @click="search()" class="filterButton">
              <SvgIcon class="filterButtonSvg" name="search"/>
              <div>{{ $t('common.query') }}</div>
            </el-button>
          </div>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="reportInfo">
    <form class="main-views-form" style="height: 100%;overflow: visible;">
      <div class="agent-add-action-row" style="display: flex;flex-direction: row;justify-content: right;margin-left: 0">
        <el-button v-if="isAdmin" @click="addFistLevelAgent" class="filterButton">
          <SvgIcon class="filterButtonSvg" name="add"/>
          <div>{{ $t('agentInfo.action.addFirstLevel') }}</div>
        </el-button>
      </div>
      <el-table
          border :data="agentInfoTableData"
          class="agentInfoTable"
          style="height: auto;"
          :key="tablekey"
          :header-cell-style="{ textAlign: 'center' }"
          :row-class-name="getRowClassName"
          row-key="userId"
          lazy
          :load="loadAgentChildren"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :indent="28"
      >
        <el-table-column
            prop="firstLevelAgent"
            :label="$t('agentInfo.column.agentInfo')"
            v-slot="{row}"
            align="left"
            width="420px"
            style="height: 95%;"
            fixed="left"
            class-name="agent-tree-cell"
        >
          <div class="agent-tree-card-wrap" :style="getAgentLevelIndentStyle(row)">
            <el-card class="box-card agent-tree-card" style="width: 100%">
              <div class="agent-card-row agent-card-account agent-main-line">
                <span class="agent-main-label">{{ $t('agentInfo.card.account') }}</span>
                <span class="agent-main-value">{{ row.accountName || '-' }}</span>
              </div>
              <div class="agent-card-row agent-card-name agent-main-line">
                <span class="agent-main-label">{{ $t('agentInfo.card.name') }}</span>
                <span class="agent-main-value">{{ row.agentName || '-' }}</span>
              </div>
              <div v-if="row.channelDtoList" class="agent-card-row agent-card-channel">
                <div class="agent-main-line">
                  <span class="agent-main-label">{{ $t('agentInfo.card.channel') }}</span>
                  <div class="agent-main-channel-values">
                    <div class="agent-main-channel-item" v-for="item in row.channelDtoList" :key="item.channelId || item.channelName">
                      {{ item.channelName }}
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </el-table-column>
        <el-table-column
            prop="agentStatus"
            :label="$t('agentInfo.column.status')"
            v-slot="{row}"
            align="center"
        >
          <div>
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? $t('common.enable') : $t('common.disable') }}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column
            prop="agentLevel"
            :label="$t('agentInfo.column.rate')"
            v-slot="{row}"
            align="center"
            width="240px"
        >
          <div class="agent-rate-line">
            <span class="agent-rate-label">{{ $t('agentInfo.rate.collection') }}</span>
            <span class="agent-rate-value">{{ row.collectionRate ? row.collectionRate : 0 }}% + {{ row.collectionFixedFee ? row.collectionFixedFee : 0 }}</span>
          </div>
          <div class="agent-rate-line">
            <span class="agent-rate-label">{{ $t('agentInfo.rate.payout') }}</span>
            <span class="agent-rate-value">{{ row.payRate ? row.payRate : 0 }}% + {{ row.payFixedFee ? row.payFixedFee : 0 }}</span>
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
            :label="$t('agentInfo.column.ipWhitelist')"
            v-slot="{row}"
            align="center"
            width="300px"
        >
          <div class="ip-whitelist-stack">
            <div class="ip-whitelist-card">
              <div class="ip-whitelist-title">{{ $t('agentInfo.ip.loginWithdraw') }}</div>
              <div class="ip-whitelist-value">
                <div class="ip-whitelist-line">
                  <span class="ip-label">{{ $t('agentInfo.ip.login') }}</span>
                  <div class="ip-list">
                    <div v-for="(ip, index) in formatIpLines(row.loginIps)" :key="`login-${index}`">{{ ip }}</div>
                  </div>
                </div>
                <div class="ip-whitelist-line">
                  <span class="ip-label">{{ $t('agentInfo.ip.withdraw') }}</span>
                  <div class="ip-list">
                    <div v-for="(ip, index) in formatIpLines(row.withdrawIps)" :key="`withdraw-${index}`">{{ ip }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <div class="agent-card-row agent-card-account agent-main-line">
            <span class="agent-main-label">{{ $t('agentInfo.contact.name') }}</span>
            <span class="agent-contact-value-inline">{{ row.contactName ? row.contactName : '-' }}</span>
          </div>
          <div class="agent-card-row agent-card-name agent-main-line">
            <span class="agent-main-label">{{ $t('agentInfo.contact.phone') }}</span>
            <span class="agent-contact-value-inline">{{ row.contactPhone ? row.contactPhone : '-' }}</span>
          </div>
          <div class="agent-card-row agent-card-channel agent-main-line">
            <span class="agent-main-label">{{ $t('agentInfo.contact.email') }}</span>
            <span class="agent-contact-value-inline">{{ row.contactEmail ? row.contactEmail : '-' }}</span>
          </div>
        </el-table-column>
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
                <el-input v-model="agentInfo.contactName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.contactPhone')" label-width="150px" prop="contactPhone">
                <el-input v-model="agentInfo.contactPhone" style="width: 200px"></el-input>
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
                <div class="agent-fee-field">
                  <el-input type="number" v-model.number="agentInfo.collectionFixedFee" style="width: 200px" @blur="handleCollectionFeeBlur"></el-input>
                  <div v-if="createType === 'nextLevel'" class="agent-fee-hint">
                    <SvgIcon class="agent-fee-icon" name="notice2" />
                    <span>{{ $t('agentInfo.hint.minParentFee', { value: formatParentFee(parentFeeLimits.collectionFixedFee) }) }}</span>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.collectionRate')" label-width="150px" prop="collectionRate">
                <div class="agent-fee-field">
                  <el-input type="number" v-model.number="agentInfo.collectionRate" style="width: 200px" @blur="handleCollectionFeeBlur"></el-input>
                  <div v-if="createType === 'nextLevel'" class="agent-fee-hint">
                    <SvgIcon class="agent-fee-icon" name="notice2" />
                    <span>{{ $t('agentInfo.hint.minParentFee', { value: formatParentFee(parentFeeLimits.collectionRate, '%') }) }}</span>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.payFixedFee')" label-width="150px" prop="payFixedFee">
                <div class="agent-fee-field">
                  <el-input type="number" v-model.number="agentInfo.payFixedFee" style="width: 200px" @blur="handlePayFeeBlur"></el-input>
                  <div v-if="createType === 'nextLevel'" class="agent-fee-hint">
                    <SvgIcon class="agent-fee-icon" name="notice2" />
                    <span>{{ $t('agentInfo.hint.minParentFee', { value: formatParentFee(parentFeeLimits.payFixedFee) }) }}</span>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.payRate')" label-width="150px" prop="payRate">
                <div class="agent-fee-field">
                  <el-input type="number" v-model.number="agentInfo.payRate" style="width: 200px" @blur="handlePayFeeBlur"></el-input>
                  <div v-if="createType === 'nextLevel'" class="agent-fee-hint">
                    <SvgIcon class="agent-fee-icon" name="notice2" />
                    <span>{{ $t('agentInfo.hint.minParentFee', { value: formatParentFee(parentFeeLimits.payRate, '%') }) }}</span>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('agentInfo.form.channelConfig')" label-width="150px" prop="channelIdList">
                <el-select
                    v-model="agentInfo.channelIdList"
                    style="width: 200px" :placeholder="$t('agentInfo.placeholder.channelConfig')"
                    multiple
                >
                  <el-option
                    v-for="item in getAgentChannelConfigOptions()"
                    :key="`agent-channel-${item.channelId}`"
                    :label="item.channelName"
                    :value="item.channelId"
                  />
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
        class="dialog agent-google-confirm-dialog"
        center
        width="420px"
    >
      <el-form ref="googleConfirmForm" :rules="googleConfirmRule" :model="googleConfirmData" class="agent-google-confirm-form">
        <el-row class="confirm-row">
          <el-col :span="24" class="confirm-col">
            <div class="confirm-item">
              <el-form-item :label="$t('common.googleCode')" prop="googleCode" class="confirm-input-item confirm-input-item--labeled">
                <el-input v-model="googleConfirmData.googleCode" style="width: 200px"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer agent-google-confirm-footer">
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
      roleName: '',
      currentAgentName: '',
      tablekey: 0,
      isAdmin: false,
      agentNameOptions: [],
      agentNameLoading: false,
      agentNameHasMore: true,
      agentNamePageNo: 1,
      agentNamePageSize: 20,
      agentNameQuery: '',
      agentNameScrollBound: false,
      accountNameOptions: [],
      accountNameLoading: false,
      accountNameHasMore: true,
      accountNamePageNo: 1,
      accountNamePageSize: 20,
      accountNameQuery: '',
      accountNameScrollBound: false,
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
      parentFeeLimits: {
        collectionFixedFee: null,
        collectionRate: null,
        payFixedFee: null,
        payRate: null
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
        contactName: {
          required: true,
          message: this.$t('agentInfo.validation.contactNameRequired'),
          trigger: 'blur',
        },
        contactPhone: {
          required: true,
          message: this.$t('agentInfo.validation.contactPhoneRequired'),
          trigger: 'blur',
        },
        contactEmail: {
          required: true,
          message: this.$t('agentInfo.validation.contactEmailRequired'),
          trigger: 'blur',
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
    this.roleName = localStorage.getItem('roleName') || ''
    this.isAdmin = this.roleName === 'admin'
    // get paymentInfos
    await getChannelInfo({pageSize: 1000}).then((res) => {
      if (res.status === 200 && res.data.code === 0) {
        this.channelOptions = this.normalizeChannelOptionList(JSON.parse(res.data.data).channelDtoList)
      }
    })

    await this.applyCurrentAgentDefaultFilter()
    this.search()
  },
  methods: {
    async applyCurrentAgentDefaultFilter() {
      if (this.roleName !== 'agent') {
        return
      }
      const loginName = localStorage.getItem('userName') || ''
      if (!loginName) {
        return
      }
      try {
        const res = await getAgentInfo({
          accountName: loginName,
          pageNo: 1,
          pageSize: 1,
          isNeedCardData: false
        })
        if (res.status === 200 && res.data.code === 0) {
          const allData = JSON.parse(res.data.data)
          const currentAgentName = allData?.agentInfoDtoList?.[0]?.agentName || loginName
          this.currentAgentName = currentAgentName
          this.filterbox.agentName = currentAgentName
          this.agentNameOptions = [{ value: currentAgentName, label: currentAgentName }]
          return
        }
      } catch (e) {
        // fallback below
      }
      this.currentAgentName = loginName
      this.filterbox.agentName = loginName
      this.agentNameOptions = [{ value: loginName, label: loginName }]
    },
    normalizeTreeRows(list) {
      if (!Array.isArray(list)) return []
      return list.map(item => ({
        ...item,
        hasChildren: item?.hasChildren === true || item?.hasChildren === 1 || item?.hasChildren === '1'
      }))
    },
    buildRootSearchPayload() {
      const payload = { ...this.filterbox }
      if (this.roleName === 'agent') {
        const lockedAgentName = this.currentAgentName || this.filterbox.agentName || localStorage.getItem('userName') || '';
        payload.agentName = lockedAgentName;
      }
      const hasFilter = Boolean(
        payload.agentName ||
        payload.accountName ||
        payload.status === 0 ||
        payload.status === 1
      )
      if (!hasFilter) {
        payload.isSearchFirstLevel = true
      } else {
        delete payload.isSearchFirstLevel
      }
      delete payload.isSearchNextLevel
      return payload
    },
    formatParentFee(value, suffix = '') {
      const normalized = value === null || value === undefined || value === '' ? 0 : value;
      return `${normalized}${suffix}`;
    },
    formatIpLines(value) {
      if (!value) return ['-'];
      const list = String(value)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
      return list.length ? list : ['-'];
    },
    formatIpLinesMerge(primary, secondary) {
      const list = []
        .concat(primary ? String(primary).split(',') : [])
        .concat(secondary ? String(secondary).split(',') : [])
        .map(item => item.trim())
        .filter(Boolean);
      if (!list.length) return ['-'];
      return Array.from(new Set(list));
    },
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
      if (this.roleName === 'agent') return;
      if (!visible) return;
      if (!this.agentNameOptions.length) {
        this.resetAgentNameOptions();
        this.fetchAgentNameOptions(false);
      }
      this.attachAgentNameScroll();
    },
    handleAgentNameSearch(query) {
      if (this.roleName === 'agent') return;
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
    handleAccountNameDropdownVisible(visible) {
      if (!visible) return;
      if (!this.accountNameOptions.length) {
        this.resetAccountNameOptions();
        this.fetchAccountNameOptions(false);
      }
      this.attachAccountNameScroll();
    },
    handleAccountNameSearch(query) {
      this.accountNameQuery = query || '';
      this.resetAccountNameOptions();
      this.fetchAccountNameOptions(false);
    },
    resetAccountNameOptions() {
      this.accountNamePageNo = 1;
      this.accountNameHasMore = true;
      this.accountNameOptions = [];
    },
    fetchAccountNameOptions(append) {
      if (this.accountNameLoading || !this.accountNameHasMore) return;
      this.accountNameLoading = true;
      const payload = {
        pageNo: this.accountNamePageNo,
        pageSize: this.accountNamePageSize,
        isNeedCardData: false
      };
      if (this.accountNameQuery) {
        payload.accountName = this.accountNameQuery;
      }
      getAgentInfo(payload).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const all = JSON.parse(res.data.data);
          const list = all.agentInfoDtoList || [];
          const mapped = list
            .filter(item => item && item.accountName)
            .map(item => ({
              value: item.accountName,
              label: item.accountName
            }));
          this.accountNameOptions = append
            ? this.accountNameOptions.concat(mapped)
            : mapped;
          if (list.length < this.accountNamePageSize) {
            this.accountNameHasMore = false;
          } else {
            this.accountNamePageNo += 1;
          }
        } else {
          this.accountNameHasMore = false;
        }
      }).finally(() => {
        this.accountNameLoading = false;
      });
    },
    attachAccountNameScroll() {
      this.$nextTick(() => {
        const wrap = document.querySelector(".account-name-select-dropdown .el-select-dropdown__wrap");
        if (!wrap || this.accountNameScrollBound) return;
        wrap.addEventListener("scroll", this.handleAccountNameScroll);
        this.accountNameScrollBound = true;
      });
    },
    handleAccountNameScroll(event) {
      const el = event.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        this.fetchAccountNameOptions(true);
      }
    },
    exportAgent() {
      this.filterbox.columns = getAgentInfoTitle(this)
      if (this.roleName === 'agent') {
        this.filterbox.agentName = this.currentAgentName || this.filterbox.agentName || localStorage.getItem('userName') || '';
      }
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
      const payload = this.buildRootSearchPayload()
      return getAgentInfo(payload).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          const allData = JSON.parse(res.data.data)
          this.agentInfoTableData = this.normalizeTreeRows(allData.agentInfoDtoList)
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
    loadAgentChildren(row, treeNode, resolve) {
      row.__childLoading = true
      const payload = {
        isSearchNextLevel: true,
        accountName: row.accountName,
        pageNo: 1,
        pageSize: 1000
      }
      getAgentInfo(payload).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          const allData = JSON.parse(res.data.data)
          resolve(this.normalizeTreeRows(allData.agentInfoDtoList))
          return
        }
        resolve([])
      }).catch(() => {
        resolve([])
      }).finally(() => {
        row.__childLoading = false
      })
    },
    getRowClassName({ row }) {
      return row && row.__childLoading ? 'agent-row-loading' : ''
    },
    getAgentLevelIndentStyle(row) {
      const level = Number(row?.level || 1)
      const base = 0
      const step = 22
      const offset = Math.max(0, level - 1) * step + base
      return {
        marginLeft: `${offset}px`
      }
    },
    reset(form) {
      this.$refs[form].resetFields()
      if (this.roleName === 'agent') {
        const lockedAgentName = this.currentAgentName || localStorage.getItem('userName') || '';
        this.filterbox.agentName = lockedAgentName;
        this.agentNameOptions = lockedAgentName ? [{ value: lockedAgentName, label: lockedAgentName }] : [];
      }
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
      this.$refs[form].validate(async valid => {
        if (!valid) return
        this.agentInfo.channelIds = this.agentInfo.channelIdList
        this.agentInfo.googleCode = this.googleConfirmData.googleCode
        const isEdit = this.pendingSubmitAction === 'edit'
        const request = isEdit ? modifyAgentInfo(this.agentInfo) : createAgentInfo(this.agentInfo)
        request.then(async (res) => {
          if (res.status === 200 && res.data.code === 0) {
            this.dialogFormVisible = false
            this.dialogTitle = ''
            this.cancelGoogleConfirm(form)
            this.modifyType = ''
            this.createType = ''
            this.clearAgentDraft()
            this.agentInfo = buildEmptyAgentInfo()
            await this.$nextTick()
            await this.search()
            this.$notify({
              title: this.$t('common.success'),
              type: 'success',
              duration: 5000,
              position: 'bottom-right',
              message: isEdit ? this.$t('agentInfo.message.modifySuccess') : this.$t('agentInfo.message.createSuccess')
            })
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
        }).catch((err) => {
          this.$notify({
            title: this.$t('common.error'),
            type: 'error',
            duration: 5000,
            position: 'bottom-right',
            message: err.message || this.$t('common.requestFailed')
          })
        })
      })
    },
    addFistLevelAgent() {
      this.modifyType = ''
      this.agentInfo = buildEmptyAgentInfo()
      this.parentFeeLimits = {
        collectionFixedFee: null,
        collectionRate: null,
        payFixedFee: null,
        payRate: null
      }
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
      this.parentFeeLimits = {
        collectionFixedFee: null,
        collectionRate: null,
        payFixedFee: null,
        payRate: null
      }
      this.clearAgentDraft()
    },
    calcelParentDialog() {
      this.parentDialogVisible = false
      this.nextLevelAgentInfo = []
      this.parentFeeLimits = {
        collectionFixedFee: null,
        collectionRate: null,
        payFixedFee: null,
        payRate: null
      }
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
    getAgentChannelConfigOptions() {
      const allOptions = this.normalizeChannelOptionList(this.channelOptions);
      const parentOptions = this.normalizeChannelOptionList(this.agentInfo?.parentChannelDtoList);
      if (this.createType === 'firstLevel') {
        return allOptions;
      }
      return parentOptions.length ? parentOptions : allOptions;
    },
    resolveChannelName(channelId, fallbackName = '') {
      const id = String(channelId ?? '').trim();
      if (!id) return fallbackName || '-';
      const match = (this.channelOptions || []).find(item => String(item?.channelId ?? '').trim() === id);
      return match?.channelName || fallbackName || id;
    },
    normalizeChannelOptionList(list) {
      if (!Array.isArray(list)) return [];
      return list
        .filter(item => item && item.channelId !== undefined && item.channelId !== null && String(item.channelId).trim() !== '')
        .map(item => ({
          channelId: String(item.channelId).trim(),
          channelName: this.resolveChannelName(item.channelId, item.channelName)
        }));
    },
    editAgentInfo(val) {
      const selectedIds = Array.isArray(val?.channelIdList) && val.channelIdList.length
        ? val.channelIdList
        : (Array.isArray(val?.channelDtoList) ? val.channelDtoList.map(item => item?.channelId).filter(Boolean) : []);
      const normalizedParentChannelList = this.normalizeChannelOptionList(val?.parentChannelDtoList);
      const normalizedSelectedIds = selectedIds
        .map(item => String(item ?? '').trim())
        .filter(Boolean);
      this.agentInfo = {
        ...buildEmptyAgentInfo(),
        ...val,
        channelIdList: normalizedSelectedIds,
        parentChannelDtoList: normalizedParentChannelList
      };
      this.parentFeeLimits = {
        collectionFixedFee: null,
        collectionRate: null,
        payFixedFee: null,
        payRate: null
      }
      this.dialogTitle = this.$t('agentInfo.dialog.edit')
      this.dialogFormVisible = true;
      this.modifyType = 'edit'
    },
    addNextLevelAgent(val) {
      this.createType = 'nextLevel'
      this.agentInfo = buildEmptyAgentInfo()
      this.agentInfo.parentId = val.userId
      this.agentInfo.topAgentId = val.topAgentId
      this.agentInfo.parentChannelDtoList = this.normalizeChannelOptionList(val.channelDtoList)
      this.agentInfo.level = val.level + 1
      this.parentFeeLimits = {
        collectionFixedFee: val.collectionFixedFee,
        collectionRate: val.collectionRate,
        payFixedFee: val.payFixedFee,
        payRate: val.payRate
      }
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

.main-toolbar {
  overflow: visible;
}

.main-toolbar .main-toolform {
  height: auto;
}

.main-toolbar .main-toolform .main-toolform-item {
  height: auto;
}

.agent-add-action-row {
  margin-bottom: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: right;
}

.el-form-line {
  display: flex;
  justify-content: center;
}

.agent-fee-field{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.agent-fee-hint{
  margin-top: 4px;
  color: #ea580c;
  font-size: 12px;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.agent-fee-icon{
  width: 12px;
  height: 12px;
  display: inline-block;
  color: currentColor;
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

.agent-main-line{
  display: flex;
  align-items: flex-start;
}

.agent-main-label{
  width: 112px;
  min-width: 112px;
  text-align: right;
  padding-right: 10px;
  color: #1f2937;
  white-space: nowrap;
}

.agent-main-value{
  flex: 1;
  border-left: solid 1px black;
  padding-left: 12px;
  word-break: break-all;
}

.agent-main-channel-values{
  flex: 1;
  border-left: solid 1px black;
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.agent-main-channel-item{
  word-break: break-all;
}

.agent-contact-value-inline{
  flex: 1;
  padding-left: 12px;
  text-align: left;
  word-break: break-all;
}

.agent-rate-line{
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.agent-rate-label{
  width: 76px;
  min-width: 76px;
  text-align: right;
  padding-right: 8px;
  color: #1f2937;
}

.agent-rate-value{
  flex: 1;
  padding-left: 6px;
  text-align: left;
  white-space: nowrap;
  word-break: break-all;
}

.agent-channel-label{
  height: 100%;
  width: 150px;
  text-align: center;
}

.agent-channel-values{
  width: 160px;
  border-left: solid 1px black;
  padding-left: 15px;
}

.agent-channel-item{
  width: 130px;
}

.ip-whitelist-stack{
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: stretch;
}

.ip-whitelist-card{
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 8px;
  text-align: left;
  box-shadow: 0 2px 6px rgba(24, 24, 24, 0.08);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  will-change: transform;
}

.ip-whitelist-card:hover{
  transform: scale(1.03);
  box-shadow: 0 6px 14px rgba(24, 24, 24, 0.18);
}

.ip-whitelist-title{
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 4px;
}

.ip-whitelist-value{
  font-size: 12px;
  color: #111827;
  line-height: 1.3;
  word-break: break-all;
}

.ip-whitelist-line{
  display: flex;
  gap: 6px;
  align-items: flex-start;
  margin-bottom: 4px;
}

.ip-whitelist-line:last-child{
  margin-bottom: 0;
}

.ip-label{
  width: 90px;
  min-width: 90px;
  text-align: right;
  padding-right: 10px;
  color: #374151;
  white-space: nowrap;
}

.ip-list{
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
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

:deep(.agentInfoTable .el-table__indent) {
  width: 28px !important;
}

:deep(.agentInfoTable .el-table__header th .cell) {
  text-align: center !important;
  justify-content: center !important;
}

:deep(.agentInfoTable .el-table__expand-icon) {
  color: #000000 !important;
  margin-right: 1px !important;
  font-size: 16px !important;
  font-weight: 900 !important;
}

:deep(.agentInfoTable .el-table__expand-icon .el-icon) {
  font-weight: 900 !important;
  stroke: currentColor;
  stroke-width: 2.8px;
}

:deep(.agentInfoTable .el-table__expand-icon .el-icon svg) {
  stroke: currentColor;
  stroke-width: 2.8px;
}

:deep(.agentInfoTable .el-table__placeholder) {
  display: inline-block;
  width: 28px !important;
  min-width: 28px !important;
  position: relative;
}

:deep(.agentInfoTable .agent-tree-cell .el-table__placeholder::before) {
  content: "";
  position: absolute;
  left: 50%;
  top: -16px;
  bottom: -16px;
  transform: translateX(-50%);
  border-left: 1px solid #d1d5db;
}

:deep(.agentInfoTable .agent-tree-cell .cell) {
  display: flex;
  align-items: center;
  padding-left: 8px !important;
}

:deep(.agentInfoTable .agent-tree-cell .el-table__expand-icon) {
  margin-left: 4px !important;
  margin-right: 8px !important;
  width: 20px !important;
  height: 20px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: scale(1.45);
  transform-origin: center;
  position: relative;
}

:deep(.agentInfoTable .agent-tree-cell .el-table__expand-icon .el-icon) {
  display: none !important;
}

:deep(.agentInfoTable .agent-tree-cell .el-table__expand-icon::before) {
  content: "";
  width: 9px;
  height: 9px;
  border-top: 2.4px solid #000;
  border-right: 2.4px solid #000;
  border-bottom: 0;
  border-left: 0;
  transform: rotate(45deg);
  display: block;
  transition: transform 0.2s ease;
}

:deep(.agentInfoTable .agent-tree-cell .el-table__expand-icon--expanded::before) {
  transform: rotate(135deg);
}

:deep(.agentInfoTable .agent-row-loading .el-table__expand-icon::before) {
  display: none !important;
}

:deep(.agentInfoTable .agent-row-loading .el-table__expand-icon::after) {
  content: "";
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.95);
  box-shadow:
    0 -7px 0 rgba(0, 0, 0, 0.95),
    5px -5px 0 rgba(0, 0, 0, 0.85),
    7px 0 0 rgba(0, 0, 0, 0.75),
    5px 5px 0 rgba(0, 0, 0, 0.65),
    0 7px 0 rgba(0, 0, 0, 0.55),
    -5px 5px 0 rgba(0, 0, 0, 0.45),
    -7px 0 0 rgba(0, 0, 0, 0.35),
    -5px -5px 0 rgba(0, 0, 0, 0.25);
  animation: agentDotRingSpin 0.8s linear infinite;
}

@keyframes agentDotRingSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.agent-tree-card-wrap {
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-left: 10px;
  position: relative;
}

.agent-tree-card {
  margin-left: 0 !important;
  width: calc(100% - 2px);
}

.agent-tree-card-wrap::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 6px;
  bottom: 6px;
  border-left: 1px dashed #cbd5e1;
  opacity: 0.8;
}

.confirm-row {
  display: flex;
  justify-content: center;
}

.confirm-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-item {
  width: 320px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  column-gap: 10px;
}

.confirm-label {
  width: 110px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #606266;
  white-space: nowrap;
}

.confirm-required {
  color: #f56c6c;
  margin-right: 4px;
}

.confirm-input-item {
  margin-bottom: 0;
}

  .confirm-input-item :deep(.el-form-item__content) {
    margin-left: 0;
  }

  .confirm-input-item--labeled {
    width: 100%;
  }

  .confirm-input-item--labeled :deep(.el-form-item__label) {
    width: 110px;
    justify-content: flex-end;
  }

.agent-google-confirm-form {
  margin-top: 20px;
  min-height: 90px;
}

.agent-google-confirm-footer {
  margin-top: 12px;
  padding-bottom: 4px;
}
</style>
