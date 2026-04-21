<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
 <div class="main-title">{{ $t('route.currencyTypeList') }}</div>


 <div class="toolbar" style="width: 96%">
      <el-row style="display: flex;justify-content: space-between;">
        <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
          <template #label>
            <span>{{ $t('currencyTypeList.filter.currency') }}</span>
          </template>
          <el-select
              v-model="filterbox.id"
              :placeholder="$t('currencyTypeList.placeholder.currency')"
              style="width: 150px;"
              clearable
              :props="currencyProps"
              :options="currencyOptions"
              filterable
          >
          </el-select>
          <el-button @click="search" style="color: #ffffff">{{ $t('common.query') }}</el-button>
        </el-form-item>
      </el-row>
    </div>

  <div class="reportInfo">
    <div style="display:flex;justify-content: right;">
      <el-button @click="openSyncConfirm"><SvgIcon name="reset"/>{{ $t('currencyTypeList.action.sync') }}</el-button>
    </div>
    <div class="currency-sync-tip">
      <SvgIcon name="notice2" class="currency-sync-tip-icon"/>
      <span>{{ $t('currencyTypeList.tip.syncSource') }}</span>
    </div>
    <el-form style="height: 650px">
      <el-table
        :data="currencyTypeData"
        border
        style="height: auto;"
        :key="tableKey"
      >
        <el-table-column
          :label="$t('currencyTypeList.column.name')"
          align="center"
          v-slot="{row}">
          <div>{{row.name}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('currencyTypeList.column.code')"
            align="center"
            v-slot="{row}">
          <div>{{row.currencyType}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('currencyTypeList.column.icon')"
            align="center"
            v-slot="{row}">
          <div>{{row.icon}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('currencyTypeList.column.accuracy')"
            align="center"
            v-slot="{row}">
          <div>{{row.currencyAccuracy}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('currencyTypeList.column.timezone')"
            align="center"
            v-slot="{row}">
          <div>{{ row.timezone || '-' }}</div>
        </el-table-column>
<!--        <el-table-column
            :label="$t('currencyTypeList.column.exchangeRate')"
            align="center"
            v-slot="{row}">
          <div>{{row.exchangeRate}}</div>
        </el-table-column>-->
      </el-table>
      <el-pagination class="pageTool"
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
         
      >
      </el-pagination>
    </el-form>
    <el-dialog
        :title="dialogTitle"
        v-model="dialogFormVisible"
        class="dialog"
        center="true"
        width="40%"
        style="height: 440px;"
        @closed="cancelDialog"
    >
      <el-form style="margin-top: 25px;" :model="addCurrencyTypeInfo" :rules="rules" ref="addCurrencyTypeInfo">
        <div class="el-form-line">
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.code')" label-width="150px"  prop="currencyType">
                <el-input style="width: 200px;" v-model="addCurrencyTypeInfo.currencyType" :disabled="isEditing"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.name')" label-width="150px"  prop="name">
                <el-input style="width: 200px;" v-model="addCurrencyTypeInfo.name" :disabled="isEditing"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.icon')" label-width="150px"  prop="icon">
                <el-input v-model="addCurrencyTypeInfo.icon" style="width: 200px" :disabled="isEditing"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.timezone')" label-width="150px" prop="timezone">
                <el-select
                  v-model="addCurrencyTypeInfo.timezone"
                  style="width: 200px;"
                  :placeholder="$t('currencyTypeList.placeholder.timezone')"
                  filterable
                >
                  <el-option
                    v-for="item in timeZoneOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.accuracy')" label-width="150px"  prop="currencyAccuracy" style="display: flex;flex-direction: row;">
                <div style="display: grid;align-items: center;justify-content: center;">
                  <el-input type="number" v-model="addCurrencyTypeInfo.currencyAccuracy" style="width: 200px;">
                  </el-input>
                  <div style="color: red;display: flex;flex-direction: row;width: 150px;align-items: center;height: 12px">
                    <SvgIcon style="width: 12px;height: 12px;" name="notice2"/>
                    <div style="font-size:12px">
                      {{ $t('currencyTypeList.tip.accuracy') }}
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
<!--          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.rateMode')" label-width="150px"  prop="exchangeRate" style="display: flex;flex-direction: row">
                <el-select v-model="addCurrencyTypeInfo.isRate" style="width: 200px;text-align: center">
                  <el-option
                    v-for="item in exchangeRateOptions"
                    :label="item.label"
                    :key="item.value"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>-->
<!--          <el-row v-if="addCurrencyTypeInfo.isRate === 2">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.exchangeRate')" label-width="150px"  prop="exchangeRate">
                <el-input type="number" v-model="addCurrencyTypeInfo.exchangeRate" style="width: 200px"/>
              </el-form-item>
            </el-col>
          </el-row>-->
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit('addCurrencyTypeInfo')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="confirmDialogTitle"
      v-model="confirmDialogVisible"
      class="dialog confirm-dialog"
      center
      align-center
      width="420px"
    >
      <el-form ref="confirmDataForm" :rules="confirmRule" :model="confirmData" class="currency-sync-confirm-form">
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
      <div slot="footer" class="dialog-footer currency-sync-confirm-footer">
        <el-button @click="cancelConfirmDialog('confirmDataForm')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitConfirm('confirmDataForm')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCurrencyType,
  getAllCurrencyType,
  getCurrencyTypeByPage,
  syncCurrencyType,
  updateCurrencyType
} from "@/api/interface/backendInterface.js";
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";
import { buildFullTimeZoneOptions } from "@/util/timezoneOptions.js";

const CURRENCY_TYPE_DRAFT_KEY = 'draft:CurrencyTypeList:add';
const buildEmptyCurrencyTypeInfo = () => ({
  id: null,
  currencyType: '',
  name: '',
  icon: '',
  timezone: '',
  currencyAccuracy: '',
  isRate: 2,
  exchangeRate: '',
  googleCode: ''
});

export default {
  name: 'CurrencyTypeList',
  data() {
    const validateExchangeRate = (rule, value, callback) => {
      if (this.addCurrencyTypeInfo.exchangeRate === 2 && (value === '' || value === undefined)) {
        callback(new Error(this.$t('currencyTypeList.validation.exchangeRateRequired')))
      } else {
        callback()
      }
    };
    return {
      tableKey: 0,
      dialogFormVisible: false,
      dialogTitle: '',
      addCurrencyTypeInfo: buildEmptyCurrencyTypeInfo(),
      currencyTypeData: [
        /*{createTime: 1767082270000,currencyType:"US",exchangeRate:0.900000,icon:"$",id:1,isRate:1,name:"美金"}*/
      ],
      currencyOptions: [
        /*{
          value: 1,
          label: '马币'
        },
        {
          value: 2,
          label: '美元'
        }*/
      ],
      currencyProps: {
        value: 'id',
        label: 'name'
      },
      filterbox: {

      },
      exchangeRateOptions: [
        {
          value: 1,
          label: this.$t('currencyTypeList.rateMode.live')
        },
        {
          value: 2,
          label: this.$t('currencyTypeList.rateMode.fixed')
        }
      ],
      timeZoneOptions: [],
      rules: {
        currencyType: [
          { required: true, message: this.$t('currencyTypeList.validation.codeRequired'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('currencyTypeList.validation.nameRequired'), trigger: 'blur' }
        ],
        icon: [
          { required: true, message: this.$t('currencyTypeList.validation.iconRequired'), trigger: 'blur' }
        ],
        timezone: [
          { required: true, message: this.$t('currencyTypeList.validation.timezoneRequired'), trigger: 'change' }
        ],
        currencyAccuracy: [
          { required: true, message: this.$t('currencyTypeList.validation.accuracyRequired'), trigger: 'blur' }
        ],
        exchangeRate: [
          { validator: validateExchangeRate, message: this.$t('currencyTypeList.validation.exchangeRateRequired'), trigger: 'blur', }
        ]
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      confirmDialogVisible: false,
      confirmDialogTitle: '',
      confirmData: {
        googleCode: ''
      },
      confirmRule: {
        googleCode: [
          { required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }
        ]
      },
      isEditing: false,
      pendingAction: '',
    }
  },
  methods: {
    buildTimeZoneOptions() {
      return buildFullTimeZoneOptions();
    },
    ensureTimeZoneOption(value) {
      if (!value) return;
      const exists = this.timeZoneOptions.some(item => item.value === value);
      if (!exists) {
        this.timeZoneOptions.unshift({ value, label: value });
      }
    },
    saveCurrencyTypeDraft() {
      if (!this.dialogFormVisible || this.isEditing) return;
      saveDraft(CURRENCY_TYPE_DRAFT_KEY, { data: this.addCurrencyTypeInfo || {} });
    },
    loadCurrencyTypeDraft() {
      if (this.isEditing) return;
      const draft = loadDraft(CURRENCY_TYPE_DRAFT_KEY);
      if (!draft || !draft.data) return;
      this.addCurrencyTypeInfo = Object.assign(buildEmptyCurrencyTypeInfo(), draft.data);
      if (!this.addCurrencyTypeInfo.timezone && this.addCurrencyTypeInfo.timeZone) {
        this.addCurrencyTypeInfo.timezone = this.addCurrencyTypeInfo.timeZone;
      }
      this.ensureTimeZoneOption(this.addCurrencyTypeInfo.timezone);
    },
    clearCurrencyTypeDraft() {
      clearDraft(CURRENCY_TYPE_DRAFT_KEY);
    },
    getCurrencyTypeList() {
      getCurrencyTypeByPage(this.filterbox).then(res => {
        if (res.status === 200) {
           if (res.data.code === 0) {
             let allData =  JSON.parse(res.data.data)
             this.currencyTypeData = (allData.currencyTypeDTOList || []).map(item => ({
               ...item,
               timezone: item.timezone || item.timeZone || ''
             }))
             this.currentPage = allData.pageNo
             this.pageSize = allData.pageSize
             this.totalCount = allData.totalNumber
           } else {
            this.$notify({
              title: this.$t('common.error'),
              message: res.data.message,
              duration: 3000,
              type: 'error',
              position: "bottom-right"
            })
           }
        } else {
          this.$notify({
            title: this.$t('common.failed'),
            message: this.$t('currencyTypeList.message.getFailed'),
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
    },
    search() {
        this.filterbox.pageNo = this.currentPage
        this.filterbox.pageSize = this.pageSize
        this.getCurrencyTypeList()
    },
    createNewCurrency() {
      this.resetDialogForm();
      this.isEditing = false;
      this.dialogFormVisible = true;
      this.dialogTitle = this.$t('currencyTypeList.dialog.add')
    },
    openSyncConfirm() {
      this.pendingAction = 'sync';
      this.confirmDialogTitle = this.$t('currencyTypeList.dialog.sync');
      this.confirmDialogVisible = true;
    },
    editCurrency(row) {
      this.resetDialogForm();
      this.isEditing = true;
      this.pendingAction = 'edit';
      this.dialogFormVisible = true;
      this.dialogTitle = this.$t('currencyTypeList.dialog.edit');
      this.addCurrencyTypeInfo = Object.assign(buildEmptyCurrencyTypeInfo(), row);
      if (!this.addCurrencyTypeInfo.timezone && this.addCurrencyTypeInfo.timeZone) {
        this.addCurrencyTypeInfo.timezone = this.addCurrencyTypeInfo.timeZone;
      }
      this.ensureTimeZoneOption(this.addCurrencyTypeInfo.timezone);
    },
    handleCurrentChange(val) {

    },
    handlePageSizeChange(val) {

    },
    cancelDialog() {
      this.resetDialogForm();
      this.dialogTitle = '';
      this.dialogFormVisible = false;
      this.isEditing = false;
      this.clearCurrencyTypeDraft();
    },
    resetDialogForm() {
      this.addCurrencyTypeInfo = buildEmptyCurrencyTypeInfo();
      if (this.$refs.addCurrencyTypeInfo) {
        this.$refs.addCurrencyTypeInfo.resetFields();
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.pendingAction = this.isEditing ? 'edit' : 'add';
          this.confirmDialogTitle = this.$t('common.prompt')
          this.confirmDialogVisible = true
        }
      })
    },
    submitConfirm(form) {
      this.$refs[form].validate(valid => {
        if (!valid) return
        this.addCurrencyTypeInfo.googleCode = this.confirmData.googleCode
        this.confirmDialogVisible = false
        this.confirmDialogTitle = ''
        let request
        if (this.pendingAction === 'sync') {
          request = syncCurrencyType({
            syncType: 1,
            googleCode: this.confirmData.googleCode
          })
        } else {
          const submitPayload = {
            ...this.addCurrencyTypeInfo,
            timeZone: this.addCurrencyTypeInfo.timezone
          };
          request = this.isEditing
            ? updateCurrencyType(submitPayload)
            : addCurrencyType(submitPayload);
        }
        request.then(res => {
          if (res.status === 200) {
            if (res.data.code !== 0) {
              const syncErrorMessage = this.pendingAction === 'sync'
                ? this.resolveSyncErrorMessage(res.data.code, res.data.message)
                : res.data.message
              this.$notify({
                title: this.$t('common.failed'),
                message: syncErrorMessage,
                type: 'error',
                position: 'bottom-right'
              })
            } else {
              const syncResult = this.pendingAction === 'sync' && res.data.data
                ? JSON.parse(res.data.data)
                : null
              this.$notify({
                title: this.$t('common.success'),
                message: this.pendingAction === 'sync'
                  ? this.$t('currencyTypeList.message.syncSuccess', {
                    inserted: syncResult?.insertedCount ?? 0,
                    skipped: syncResult?.skippedExistingCount ?? 0,
                    invalid: syncResult?.invalidRowCount ?? 0
                  })
                  : this.isEditing
                    ? this.$t('currencyTypeList.message.editSuccess')
                    : this.$t('currencyTypeList.message.addSuccess'),
                type: 'success',
                position: 'bottom-right'
              })
              this.getCurrencyTypeList()
              if (this.pendingAction !== 'sync') {
                this.dialogFormVisible = false;
                this.resetDialogForm();
                this.isEditing = false;
                this.clearCurrencyTypeDraft();
              }
            }
          }
          this.confirmData.googleCode = ''
          this.pendingAction = ''
        }).catch(() => {
          this.confirmData.googleCode = ''
          this.pendingAction = ''
        })
      })
    },
    cancelConfirmDialog(form) {
      this.confirmDialogVisible = false
      this.confirmDialogTitle = ''
      this.confirmData.googleCode = ''
      this.pendingAction = ''
      if (this.$refs[form]) {
        this.$refs[form].resetFields()
      }
    },
    resolveSyncErrorMessage(code, fallbackMessage) {
      if (code === 100119) {
        return this.$t('currencyTypeList.message.syncFileInvalid')
      }
      return fallbackMessage
    }
  },
  watch: {
    dialogFormVisible(visible) {
      if (visible) {
        this.loadCurrencyTypeDraft();
      }
    },
    addCurrencyTypeInfo: {
      deep: true,
      handler() {
        this.saveCurrencyTypeDraft();
      }
    }
  },
  mounted() {
    this.timeZoneOptions = this.buildTimeZoneOptions();
    getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
        return;
      }
      if (res.status !== 200 || res.data.code !== 0) {
        this.$notify({
          title: this.$t('common.failed'),
          message: this.$t('currencyTypeList.message.getFailed'),
          type: 'error',
          position: 'bottom-right'
        })
      }
    })
    this.getCurrencyTypeList();
  }
}
</script>
<style scoped>
@import "@/assets/base.css";
.toolbar {
  margin-left: 2%;
  margin-top: 1%;
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

.currency-sync-confirm-form {
  margin-top: 20px;
  min-height: 90px;
}

.currency-sync-confirm-footer {
  margin-top: 12px;
  padding-bottom: 4px;
}

.currency-sync-tip {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin: 8px 0 12px;
  color: #f56c6c;
  font-size: 12px;
}

.currency-sync-tip-icon {
  width: 12px;
  height: 12px;
}
</style>
