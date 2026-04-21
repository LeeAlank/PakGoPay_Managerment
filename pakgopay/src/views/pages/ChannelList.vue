<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import { ArrowDownBold } from "@element-plus/icons-vue";
import {getTimeFromTimestamp} from "@/api/common.js";
</script>

<template>
<div class="main-title">{{ $t('channelList.title') }}</div>

  <el-collapse v-model="activeTool">
    <el-collapse-item name="1">
      <template #title>
        <span class="toolbarName">{{ $t('common.toolbar') }}</span>
      </template>
      <div class="main-toolbar" style="height: auto;">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <el-row class="channel-list-filter-row" :gutter="24" style="width: 100%;margin-top:10px">
              <el-col :span="6" class="channel-list-filter-col">
                <el-form-item :label="$t('channelList.filter.channel')" label-width="150px" prop="paymentId">
                  <el-select
                    v-model="filterbox.paymentId"
                    filterable
                    remote
                    clearable
                    :remote-method="handlePaymentSearch"
                    :loading="paymentLoading"
                    :placeholder="$t('channelList.filter.channel')"
                    popper-class="channel-payment-select-dropdown"
                    @visible-change="handlePaymentDropdownVisible"
                    style="height: 100%;width: 200px"
                  >
                    <el-option
                      v-for="item in paymentFilterOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="channel-list-filter-col">
                <el-form-item :label="$t('channelList.filter.channelName')" label-width="150px" prop="channelName">
                  <el-input v-model="filterbox.channelName" :placeholder="$t('channelList.placeholder.channelName')" style="width: 200px;height: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="6" class="channel-list-filter-col">
                <el-form-item :label="$t('channelList.filter.status')" label-width="150px" prop="status">
                  <el-select v-model="filterbox.status" :placeholder="$t('channelList.placeholder.status')"
                             style="width: 200px;height: 100%"
                             clearable
                             :options="channelStatusOptions"
                  >
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="channel-list-filter-col">
                <el-form-item :label="$t('channelList.filter.currency')" label-width="150px" prop="currency">
                  <el-select v-model="filterbox.currency" :placeholder="$t('common.currency')"
                             style="width: 200px;height: 100%"
                             clearable
                             :options="currencyOptions"
                             :props="currencyProps"
                  />
                </el-form-item>
              </el-col>
          </el-row>
          <div class="toolbar-action-row">
            <el-button @click="search()" class="filterButton">
              <SvgIcon class="filterButtonSvg" name="search"/>
              <div>{{ $t('common.query') }}</div>
            </el-button>
            <el-button @click="reset('filterboxForm')" class="filterButton">
              <SvgIcon class="filterButtonSvg" name="reset"/>
              <div>{{ $t('common.reset') }}</div>
            </el-button>
            <el-button @click="exportPathChannelInfos" class="filterButton">
              <SvgIcon class="filterButtonSvg" name="export"/>
              <div>{{ $t('common.export') }}</div>
            </el-button>
          </div>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="reportInfo">
    <div class="main-views-form" style="height: 700px">
      <div style="float: right;display: flex;">
        <el-button @click="createNewChannel"><SvgIcon name="add" style="width: 20px;height: 20px"/>{{ $t('channelList.action.add') }}</el-button>
      </div>
      <el-table
          border :data="channelTableInfo"
          class="channelTable"
          style="height: 100%"
          :key="tableKey"
      >
        <el-table-column
            prop="channelName"
            :label="$t('channelList.column.channelName')"
            v-slot="{row}"
            align="center"
            fixed="left"
        >
          <div>
            {{row.channelName}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelList"
            :label="$t('channelList.column.collectionList')"
            v-slot="{row}"
            align="center"
        >
          <div>
            <el-card
              v-for="(item, index) in getVisibleCollectionCards(row)"
              :key="item.paymentNo"
              class="merchantInfos-table channel-card"
              :class="index % 2 === 0 ? 'channel-card-collect' : 'channel-card-collect-alt'"
            >
              <div>{{ $t('channelList.card.paymentNo') }}{{ item.paymentNo }}</div>
              <div>{{ $t('channelList.card.paymentName') }}{{ item.paymentName }}</div>
            </el-card>
            <div
              v-if="hasMoreCollectionCards(row)"
              class="channel-card-more"
              @click="expandCollectionCards(row)"
            >
              <el-icon><ArrowDownBold /></el-icon>
            </div>
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelList"
            :label="$t('channelList.column.payoutList')"
            v-slot="{row}"
            align="center"
        >
          <div>
            <el-card
              v-for="(item, index) in getVisiblePayCards(row)"
              :key="item.paymentNo"
              class="merchantInfos-table channel-card"
              :class="index % 2 === 0 ? 'channel-card-pay' : 'channel-card-pay-alt'"
            >
              <div>{{ $t('channelList.card.paymentNo') }}{{ item.paymentNo }}</div>
              <div>{{ $t('channelList.card.paymentName') }}{{ item.paymentName }}</div>
            </el-card>
            <div
              v-if="hasMorePayCards(row)"
              class="channel-card-more"
              @click="expandPayCards(row)"
            >
              <el-icon><ArrowDownBold /></el-icon>
            </div>
          </div>
        </el-table-column>
        <el-table-column
            prop="status"
            :label="$t('channelList.column.status')"
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
              :active-value="1"
              :inactive-value="0"
              disabled
            >
            </el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="supportCurrencyType"
            :label="$t('channelList.column.currency')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.currency}}
          </div>
        </el-table-column>
        <el-table-column
            prop="channelAccountBalance"
            :label="$t('channelList.column.createTime')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{getTimeFromTimestamp(row.createTime)}}
          </div>
        </el-table-column>
        <el-table-column
            prop="operation"
            :label="$t('common.operation')"
            v-slot="{row}"
            align="center"
            fixed="right"
            width="200px"
        >
          <div>
            <el-dropdown trigger="click">
              <SvgIcon name="more" width="30" height="30" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editChannel(row)">{{ $t('common.edit') }}</el-dropdown-item>
                  <el-dropdown-item v-if="row.status === 1" @click="stopChannel(row)">{{ $t('common.disable') }}</el-dropdown-item>
                  <el-dropdown-item v-if="row.status === 0" @click="startChannel(row)">{{ $t('common.enable') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
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
    </div>
  </div>
  <el-dialog
      :title="channelDialogTitle"
      v-model="dialogFormVisible"
      class="dialog channel-edit-dialog"
      width="760px"
  >
    <el-form style="margin-top: 16px;width: 100%" ref="editChannelForm" :rules="editChannelRules" :model="editChannelInfo">
<!--      <el-row style="width: 100%">-->
        <el-col :span="24">
          <div class="el-form-line" style="display: flex;justify-content: center;">
            <el-form-item :label="$t('channelList.filter.channelName')" label-width="150px" prop="channelName">
              <el-input type="text" v-model="editChannelInfo.channelName" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="el-form-line" style="display: flex;justify-content: center;">
            <el-form-item :label="$t('channelList.filter.channel')" label-width="150px" prop="paymentIds">
              <el-select
                  v-model="editChannelInfo.paymentIds"
                  :options="paymentOptions"
                  :props="paymentProps"
                  @change="handleChange"
                  multiple
                  style="width: 200px"
                  filterable
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="el-form-line" style="display: flex;justify-content: center;">
            <el-form-item :label="$t('channelList.filter.status')" label-width="150px" prop="status">
              <el-switch
                  v-model="editChannelInfo.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-text="$t('common.enable')"
                  :inactive-text="$t('common.disable')"
                  :inactive-value="0"
                  :active-value="1"
                  style="width: 200px"
              ></el-switch>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="el-form-line" style="display: flex;justify-content: center;">
          </div>
        </el-col>
    </el-form>
    <div slot="footer" class="dialog-footer" style="float: right;">
      <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm('editChannelForm', submitType)">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
  <el-dialog
      :title="stopDialogTitle"
      v-model="stopDialogVisible"
      class="dialog"
      center="true"
      width="50%"
      style="height: auto;align-content: center;position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%)"
  >
   <el-form
     ref="stopForm"
     :rules = 'editChannelRules'
     :model = 'editChannelInfo'
     style="margin-top: 50px;width: 100%"
   >
     <el-col :span="24">
       <div class="el-form-line" style="display: flex;justify-content: center;">
       </div>
     </el-col>
   </el-form>
    <div slot="footer" class="dialog-footer" style="float: right;">
      <el-button @click="cancelStopDialog('stopForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm('stopForm', 'edit')">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
  <el-dialog
      :title="confirmDialogTitle"
      v-model="confirmDialogVisible"
      class="dialog channel-google-confirm-dialog"
      center
      align-center
      width="420px"
  >
    <el-form ref="confirmDataForm" :rules="confirmRule" :model="confirmData" class="channel-google-confirm-form">
      <el-row class="confirm-row">
        <el-col :span="24" class="confirm-col">
          <div class="confirm-item">
            <el-form-item :label="$t('common.googleCode')" prop="googleCode" class="confirm-input-item confirm-input-item--labeled">
              <el-input v-model="confirmData.googleCode" style="width: 200px"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer channel-google-confirm-footer">
      <el-button @click="cancelConfirmDialog('confirmDataForm')">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="submitConfirm('confirmDataForm')">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>


<script>
import {
  createChannelInfo, exportChannelList, exportPayment,
  getAllCurrencyType,
  getChannelInfo,
  getPaymentInfo,
  modifyChannelInfo
} from "@/api/interface/backendInterface.js";
import {
  exportExcel,
  getChannelListTitle,
  getFormateTime,
  loadingBody
} from "@/api/common.js";
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const CHANNEL_DRAFT_KEY = 'draft:ChannelList:form';

export default {
  name: 'ChannelList',
  data() {
    return {
      activeTool: '1',
      submitType: "",
      currency: '',
      currencyIcon: '',
      currencyIcons: [],
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      currencyMaps: {},
      paymentOptions: [],
      paymentFilterOptions: [],
      paymentLoading: false,
      paymentHasMore: true,
      paymentPageNo: 1,
      paymentPageSize: 20,
      paymentQuery: '',
      paymentScrollBound: false,
      channelStatusOptions: [],
      paymentProps: {
        value: 'paymentId',
        label: 'paymentName'
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100, 200],
      filterbox: {
        channelName: '',
        channelID: '',
        channelStatus: '',
      },
      /** 此下拉菜单选项需要调用接口从后端实时获取 */
      pathChannelListOptions: [

      ],
      channelTableInfo: [
      ],
      collectionCardExpandMap: {},
      payCardExpandMap: {},
      channelFormInfo: [],
      createChannelInfo: {},
      editChannelInfo: {},
      tableKey: 0,
      timeZoneKey: localStorage.getItem("timeZone") || "UTC+8",
      dialogFormVisible: false,
      channelDialogTitle: '',
      stopDialogVisible: false,
      stopDialogTitle: '',
      editChannelRules: {},
      confirmDialogVisible: false,
      confirmDialogTitle: '',
      confirmData: {
        googleCode: ''
      },
      confirmRule: {
        googleCode: {
          required: true,
          message: this.$t('common.googleCodeRequired'),
          trigger: 'blur',
        }
      },
      pendingSubmitType: ''
    }
  },
  methods: {
    getChannelRowKey(row) {
      return String(row?.channelId || row?.channelName || '');
    },
    isCollectionCardsExpanded(row) {
      const key = this.getChannelRowKey(row);
      if (!key) return false;
      return !!this.collectionCardExpandMap[key];
    },
    isPayCardsExpanded(row) {
      const key = this.getChannelRowKey(row);
      if (!key) return false;
      return !!this.payCardExpandMap[key];
    },
    getVisibleCollectionCards(row) {
      const cards = row?.collectionSupportPayment || [];
      if (cards.length <= 1 || this.isCollectionCardsExpanded(row)) {
        return cards;
      }
      return cards.slice(0, 1);
    },
    hasMoreCollectionCards(row) {
      const cards = row?.collectionSupportPayment || [];
      return cards.length > 1 && !this.isCollectionCardsExpanded(row);
    },
    expandCollectionCards(row) {
      const key = this.getChannelRowKey(row);
      if (!key) return;
      this.collectionCardExpandMap = {
        [key]: true
      };
    },
    getVisiblePayCards(row) {
      const cards = row?.paySupportPayment || [];
      if (cards.length <= 1 || this.isPayCardsExpanded(row)) {
        return cards;
      }
      return cards.slice(0, 1);
    },
    hasMorePayCards(row) {
      const cards = row?.paySupportPayment || [];
      return cards.length > 1 && !this.isPayCardsExpanded(row);
    },
    expandPayCards(row) {
      const key = this.getChannelRowKey(row);
      if (!key) return;
      this.payCardExpandMap = {
        [key]: true
      };
    },
    saveChannelDraft() {
      if (!this.dialogFormVisible) return;
      const mode = this.submitType || '';
      const recordId = this.editChannelInfo?.channelId || this.editChannelInfo?.id || '';
      saveDraft(CHANNEL_DRAFT_KEY, { mode, recordId, data: this.editChannelInfo || {} });
    },
    loadChannelDraft() {
      const draft = loadDraft(CHANNEL_DRAFT_KEY);
      if (!draft || !draft.data) return;
      const mode = this.submitType || '';
      if (draft.mode && mode && draft.mode !== mode) return;
      if (mode === 'edit') {
        const recordId = this.editChannelInfo?.channelId || this.editChannelInfo?.id || '';
        if (draft.recordId && recordId && draft.recordId !== recordId) return;
      }
      this.editChannelInfo = Object.assign({}, draft.data || {});
    },
    clearChannelDraft() {
      clearDraft(CHANNEL_DRAFT_KEY);
    },
    handlePaymentDropdownVisible(visible) {
      if (!visible) return;
      if (!this.paymentFilterOptions.length) {
        this.resetPaymentOptions();
        this.fetchPaymentOptions(false);
      }
      this.attachPaymentScroll();
    },
    handlePaymentSearch(query) {
      this.paymentQuery = query || '';
      this.resetPaymentOptions();
      this.fetchPaymentOptions(false);
    },
    resetPaymentOptions() {
      this.paymentPageNo = 1;
      this.paymentHasMore = true;
      this.paymentFilterOptions = [];
    },
    fetchPaymentOptions(append) {
      if (this.paymentLoading || !this.paymentHasMore) return;
      this.paymentLoading = true;
      const payload = {
        pageNo: this.paymentPageNo,
        pageSize: this.paymentPageSize
      };
      if (this.paymentQuery) {
        payload.paymentName = this.paymentQuery;
      }
      getPaymentInfo(payload).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const allData = JSON.parse(res.data.data);
          const list = allData.paymentDtoList || [];
          const mapped = list.map(item => ({
            value: item.paymentId,
            label: item.paymentName
          }));
          this.paymentFilterOptions = append
            ? this.paymentFilterOptions.concat(mapped)
            : mapped;
          if (list.length < this.paymentPageSize) {
            this.paymentHasMore = false;
          } else {
            this.paymentPageNo += 1;
          }
        } else {
          this.paymentHasMore = false;
        }
      }).finally(() => {
        this.paymentLoading = false;
      });
    },
    attachPaymentScroll() {
      this.$nextTick(() => {
        const wrap = document.querySelector(".channel-payment-select-dropdown .el-select-dropdown__wrap");
        if (!wrap || this.paymentScrollBound) return;
        wrap.addEventListener("scroll", this.handlePaymentScroll);
        this.paymentScrollBound = true;
      });
    },
    handlePaymentScroll(event) {
      const el = event.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        this.fetchPaymentOptions(true);
      }
    },
    exportPathChannelInfos() {
      this.filterbox.columns = getChannelListTitle(this)
      exportChannelList(this.filterbox).then(async res => {
        /*const fileName = this.$t('exportPaymentListName') + getFormateTime()*/
        const fileName = this.$t('channelList.exportName') + getFormateTime()
        await exportExcel(res, fileName, this)
        /*if (res.status === 200) {
          if (res.data.type === 'application/json') {
            const blobData = res.data;
            const jsonData = JSON.parse(await blobData.text())
            if (jsonData.code !== 0) {
              this.$notify({
                title: 'Failed',
                message: jsonData.message,
                duration: 3000,
                type: 'error',
                position: 'bottom-right',
              })
            }
          } else {
            const blob = new Blob([res.data], {type: "application/vnd.ms-excel;charset=UTF-8"});
            console.log('blob---'+ blob.size)
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, fileName)
            } else {
              const downLoadElement = document.createElement('a');
              const href = window.URL.createObjectURL(blob);
              downLoadElement.href = href;
              downLoadElement.download = fileName;
              document.body.appendChild(downLoadElement);
              downLoadElement.click();
              document.body.removeChild(downLoadElement);
              window.URL.revokeObjectURL(href);
            }
            this.$notify({
              title: 'Success',
              message: 'export data success',
              duration: 3000,
              type: 'success',
              position: 'bottom-right',
            })
          }
        } else {
          if (res.data.type === 'application/json') {
            const blobData = res.data;
            const jsonData = JSON.parse(await blobData.text())
            this.$notify({
              title: 'Error',
              message: jsonData.message,
              duration: 3000,
              type: 'error',
              position: 'bottom-right',
            })
          }

        }
        this.filterbox.orderType = '0'*/
      }).catch(err => {
        console.log(err)
      })
    },
    reset(form) {
      this.$refs[form].resetFields();
    },
    search() {
      const loadingInstance = loadingBody(this, 'channelTable')
      getChannelInfo(this.filterbox).then(response => {
        if (response.status === 200 && response.data.code === 0) {
          const allData = JSON.parse(response.data.data)
          this.totalCount = allData.totalNumber
          this.collectionCardExpandMap = {}
          this.payCardExpandMap = {}
          this.channelTableInfo = allData.channelDtoList
          this.channelTableInfo.forEach(item => {
            let currencyList = []
            let collectionSupportPamentList = []
            let paySupportPamentList = []
            let paymentIds = []
            item.paymentDtoList.forEach(paymentItem => {
              paymentIds.push(paymentItem.paymentId)
              if (!currencyList.includes(paymentItem.currency)) {
                currencyList.push(this.currencyMaps[paymentItem.currency])
              }
              if (paymentItem.supportType === 0 ) {
                collectionSupportPamentList.push(paymentItem)
              } else if (paymentItem.supportType === 1) {
                paySupportPamentList.push(paymentItem)
              } else if (paymentItem.supportType === 2) {
                collectionSupportPamentList.push(paymentItem)
                paySupportPamentList.push(paymentItem)
              }
            })
            item.currency = currencyList.toLocaleString()
            item.collectionSupportPayment = collectionSupportPamentList
            item.paySupportPayment = paySupportPamentList
            item.paymentIds = paymentIds
          })
          loadingInstance.close()
        }
      }).catch(error => {
        loadingInstance.close()
        this.$notify({
          title: this.$t('common.error'),
          message: error.message,
          duration: 5000,
          type: 'error',
          position: 'bottom-right'
        })
      })
    },
    submitForm(form, submitType) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.pendingSubmitType = submitType
          this.confirmDialogTitle = this.$t('common.prompt')
          this.confirmDialogVisible = true
        }
      })
    },
    submitConfirm(form) {
      this.$refs[form].validate(valid => {
        if (!valid) return
        this.editChannelInfo.googleCode = this.confirmData.googleCode
        this.confirmDialogVisible = false
        this.confirmDialogTitle = ''
        if (this.pendingSubmitType === 'edit') {
          modifyChannelInfo(this.editChannelInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('channelList.notify.modifySuccess', { name: this.editChannelInfo.channelName }),
                duration: 3000,
                type: 'success',
                position:'bottom-right'
              })
            } else if (res.status === 200 && res.data.code !== 0) {
              this.$notify({
                title: this.$t('common.error'),
                message:res.data.message,
                duration: 3000,
                type: 'error',
                position: 'bottom-right'
              })
            } else {
              this.$notify({
                title: this.$t('common.error'),
                message: this.$t('common.requestFailed'),
                duration: 3000,
                type: 'error',
                position: 'bottom-right'
              })
            }
            this.dialogFormVisible = false;
            this.channelDialogTitle = ''
            this.stopDialogTitle = ''
            this.stopDialogVisible = false
            this.clearChannelDraft()
            this.search()
            if (this.editChannelInfo?.googleCode) {
              this.editChannelInfo.googleCode = ''
            }
            this.confirmData.googleCode = ''
            this.pendingSubmitType = ''
          }).catch( err => {
            this.$notify({
              title: this.$t('common.error'),
              message:err.message,
              duration: 3000,
              type: 'error',
              position: 'bottom-right'
            })
            this.dialogFormVisible = false;
            this.channelDialogTitle = ''
            this.clearChannelDraft()
            this.search()
            if (this.editChannelInfo?.googleCode) {
              this.editChannelInfo.googleCode = ''
            }
            this.confirmData.googleCode = ''
            this.pendingSubmitType = ''
          })
        } else if (this.pendingSubmitType === 'create') {
          createChannelInfo(this.editChannelInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('channelList.notify.createSuccess'),
                duration: 3000,
                type: 'success',
                position:'bottom-right'
              })
              this.search()
            } else if (res.status === 200 && res.data.code !== 0) {
              this.$notify({
                title: this.$t('common.error'),
                message:res.data.message,
                duration: 3000,
                type: 'error',
                position: 'bottom-right'
              })
            } else {
              this.$notify({
                title: this.$t('common.error'),
                message: this.$t('common.requestFailed'),
                duration: 3000,
                type: 'error',
                position: 'bottom-right'
              })
            }
            this.dialogFormVisible = false;
            this.channelDialogTitle = ''
            this.clearChannelDraft()
            if (this.editChannelInfo?.googleCode) {
              this.editChannelInfo.googleCode = ''
            }
            this.confirmData.googleCode = ''
            this.pendingSubmitType = ''
          }).catch( err => {
            this.$notify({
              title: this.$t('common.error'),
              message:err.message,
              duration: 3000,
              type: 'error',
              position: 'bottom-right'
            })
            this.dialogFormVisible = false;
            this.channelDialogTitle = ''
            this.clearChannelDraft()
            if (this.editChannelInfo?.googleCode) {
              this.editChannelInfo.googleCode = ''
            }
            this.confirmData.googleCode = ''
            this.pendingSubmitType = ''
          })
        }
      })
    },
    cancelConfirmDialog(form) {
      this.confirmDialogVisible = false
      this.confirmDialogTitle = ''
      this.confirmData.googleCode = ''
      this.pendingSubmitType = ''
      if (this.editChannelInfo?.googleCode) {
        this.editChannelInfo.googleCode = ''
      }
      if (this.$refs[form]) {
        this.$refs[form].resetFields()
      }
    },
    createNewChannel() {
      this.editChannelInfo = {}
      this.dialogFormVisible = true
      this.channelDialogTitle = this.$t('channelList.dialog.add')
      this.submitType = 'create'
    },
    handleCurrentPageChange(currentPage) {
      this.filterbox.pageNo = currentPage;
      this.filterbox.pageSize = this.pageSize;
      this.PathChannelTableInfo = []
      this.search()

    },
    handleSizeChange(pageSize) {
      this.currentPage = 1
      this.pageSize = pageSize
      this.handleCurrentPageChange(1)
    },
    editChannel(row) {
      //this.editChannelInfo = row;
      this.editChannelInfo.channelName = row.channelName;
      this.editChannelInfo.channelId = row.channelId;
      this.editChannelInfo.paymentIds = row.paymentIds;
      this.editChannelInfo.status = row.status;
      this.dialogFormVisible = true;
      this.channelDialogTitle = this.$t('channelList.dialog.edit')
      this.submitType = 'edit'
      this.tableKey++
    },
    stopChannel(row) {
      this.stopDialogVisible = true
      this.channelDialogTitle = this.$t('channelList.dialog.disable')
      this.editChannelInfo = row
      this.editChannelInfo.status = 0;
    },
    startChannel(row) {
      this.stopDialogVisible = true
      this.stopDialogTitle = this.$t('channelList.dialog.enable')
      this.editChannelInfo = row
      this.editChannelInfo.status = 1;
    },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.createChannelInfo = {}
      this.channelDialogTitle = ''
      this.clearChannelDraft()
      if (this.editChannelInfo?.googleCode) {
        this.editChannelInfo.googleCode = ''
      }
    },
    cancelStopDialog(form) {
      this.stopDialogVisible = false
      this.stopDialogTitle = ''
      this.$refs[form].resetFields()
      if (this.editChannelInfo?.googleCode) {
        this.editChannelInfo.googleCode = ''
      }
    },
    applyChannelNameFromRoute() {
      let channelName = this.$route?.query?.["filterbox.channelName"]
      if (Array.isArray(channelName)) {
        channelName = channelName[0]
      }
      if (typeof channelName === "string" && channelName.trim() !== "") {
        this.filterbox.channelName = channelName
      }
    }
  },
  watch: {
    dialogFormVisible(visible) {
      if (visible) {
        this.loadChannelDraft();
      }
    },
    editChannelInfo: {
      deep: true,
      handler() {
        this.saveChannelDraft();
      }
    },
    submitType() {
      this.saveChannelDraft();
    },
    "$route.query"(newQuery, oldQuery) {
      if (newQuery?.["filterbox.channelName"] === oldQuery?.["filterbox.channelName"]) {
        return
      }
      this.applyChannelNameFromRoute()
      this.search()
    }
  },
  async mounted() {
    this.channelStatusOptions = [
      { value: 1, label: this.$t('common.enable') },
      { value: 0, label: this.$t('common.disable') }
    ];
    this._timeZoneListener = (event) => {
      this.timeZoneKey = event.detail || localStorage.getItem("timeZone") || "UTC+8";
      this.tableKey++;
    };
    window.addEventListener("timezone-change", this._timeZoneListener);

    this.applyChannelNameFromRoute()

    await getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
        if (this.currencyOptions.length > 0) {
          this.currency = this.currencyOptions[0].currencyType
          //this.filterbox.currency = this.currencyOptions[0].currencyType
          this.currencyIcons = {};
          this.currencyMaps = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon
            this.currencyMaps[currency.currencyType] = currency.name
          })
          let iconKey = this.currency;
          this.currencyIcon = this.currencyIcons[iconKey]
        }
        return;
      }
      if (res.status !== 200 || res.data.code !== 0) {
        this.$notify({
          title: this.$t('common.failed'),
          message: this.$t('currencyTypeList.message.getFailed'),
          duration: 3000,
          type: 'error',
          position: 'bottom-right'
        })
      }
    })

    await getPaymentInfo({pageSize: 1000}).then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          const allData = JSON.parse(res.data.data);
          this.paymentOptions = allData.paymentDtoList
        }
      }
    })

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

.channel-list-filter-row{
  width: 100%;
}

.channel-list-filter-col{
  display: flex;
  justify-content: center;
}

.channel-list-filter-col .el-form-item{
  width: 350px;
}

.channel-card {
  margin-bottom: 8px;
}

.channel-card-more{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #2563eb;
  font-size: 16px;
}

.channel-card-collect {
  background-color: #e8f2ff;
}

.channel-card-collect-alt {
  background-color: #f0f6ff;
}

.channel-card-pay {
  background-color: #e9f6ee;
}

.channel-card-pay-alt {
  background-color: #f1faf4;
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

.toolbarName {
  color: #667eea;
}

.channel-google-confirm-form {
  margin-top: 20px;
  min-height: 90px;
}

.channel-google-confirm-footer {
  margin-top: 12px;
  padding-bottom: 4px;
}

</style>
