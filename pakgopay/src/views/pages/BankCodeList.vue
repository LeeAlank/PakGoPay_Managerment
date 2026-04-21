<script setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">{{ $t('route.bankCodeList') }}</div>

  <el-collapse class="main-toolbar-collapse" v-model="activeToolbars" style="width: 97%;">
    <el-collapse-item name="toolbar">
      <template #title>
        <span class="toolbarName">
          {{ $t('common.toolbar') }}
        </span>
      </template>
      <div class="main-toolbar" style="height: auto; width: 97%; margin-left: 0;">
        <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
          <el-row>
            <el-col :span="8" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('bankCodeList.filter.bankCode')" prop="bankCode">
                <el-select
                  v-model="filterbox.bankCode"
                  filterable
                  remote
                  clearable
                  :remote-method="handleBankCodeSearch"
                  :loading="bankCodeOptionLoading"
                  :placeholder="$t('bankCodeList.placeholder.bankCode')"
                  popper-class="bank-code-select-dropdown"
                  @visible-change="handleBankCodeDropdownVisible"
                  style="width: 180px"
                >
                  <el-option
                    v-for="item in bankCodeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('bankCodeList.filter.bankName')" prop="bankName">
                <el-select
                  v-model="filterbox.bankName"
                  filterable
                  remote
                  clearable
                  :remote-method="handleBankNameSearch"
                  :loading="bankNameOptionLoading"
                  :placeholder="$t('bankCodeList.placeholder.bankName')"
                  popper-class="bank-name-select-dropdown"
                  @visible-change="handleBankNameDropdownVisible"
                  style="width: 220px"
                >
                  <el-option
                    v-for="item in bankNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('bankCodeList.filter.currency')" prop="currencyCode">
                <el-select
                  v-model="filterbox.currencyCode"
                  :placeholder="$t('bankCodeList.placeholder.currency')"
                  clearable
                  filterable
                  style="width: 180px"
                  :options="currencyOptions"
                  :props="currencyProps"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="toolbar-action-row">
            <el-button class="filterButton" @click="reset('filterboxForm')">
              <SvgIcon class="filterButtonSvg" name="reset"/>
              <div>{{ $t('common.reset') }}</div>
            </el-button>
            <el-button class="filterButton" @click="search">
              <SvgIcon class="filterButtonSvg" name="search"/>
              <div>{{ $t('common.query') }}</div>
            </el-button>
          </div>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="reportInfo">
    <div style="display:flex;justify-content: right;">
      <el-button @click="openSyncConfirm"><SvgIcon name="reset"/>{{ $t('bankCodeList.action.sync') }}</el-button>
    </div>
    <div class="currency-sync-tip">
      <SvgIcon name="notice2" class="currency-sync-tip-icon"/>
      <span>{{ $t('bankCodeList.tip.syncSource') }}</span>
    </div>
    <el-form style="height: 650px">
      <el-table
        :data="bankCodeData"
        border
        style="height: auto;"
        :key="tableKey"
        header-cell-class-name="bank-code-table-header"
      >
        <el-table-column :label="$t('bankCodeList.column.bankCode')" align="center" v-slot="{ row }">
          <div>{{ row.bankCode || '-' }}</div>
        </el-table-column>
        <el-table-column :label="$t('bankCodeList.column.bankName')" align="center" v-slot="{ row }">
          <div>{{ row.bankName || '-' }}</div>
        </el-table-column>
        <el-table-column :label="$t('bankCodeList.column.currencyCode')" align="center" v-slot="{ row }">
          <div>{{ row.currencyCode || '-' }}</div>
        </el-table-column>
        <el-table-column :label="$t('bankCodeList.column.currencyName')" align="center" v-slot="{ row }">
          <div>{{ row.currencyName || '-' }}</div>
        </el-table-column>
        <el-table-column :label="$t('bankCodeList.column.country')" align="center" v-slot="{ row }">
          <div>{{ row.country || '-' }}</div>
        </el-table-column>
        <el-table-column :label="$t('bankCodeList.column.createTime')" align="center" v-slot="{ row }">
          <div>{{ row.createTime ? formatTime(row.createTime) : '-' }}</div>
        </el-table-column>
        <el-table-column :label="$t('bankCodeList.column.updateTime')" align="center" v-slot="{ row }">
          <div>{{ row.updateTime ? formatTime(row.updateTime) : '-' }}</div>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageTool"
        background
        layout="sizes, prev, pager, next, jumper, total"
        :total="totalCount"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </el-form>
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
        <el-button :disabled="syncSubmitting" @click="cancelConfirmDialog('confirmDataForm')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="syncSubmitting" @click="submitConfirm('confirmDataForm')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllCurrencyType, queryBankCode, syncCurrencyType } from "@/api/interface/backendInterface.js";

export default {
  name: "BankCodeList",
  data() {
    return {
      activeToolbars: ["toolbar"],
      tableKey: 0,
      confirmDialogVisible: false,
      confirmDialogTitle: '',
      confirmData: {
        googleCode: ''
      },
      syncSubmitting: false,
      confirmRule: {
        googleCode: [
          { required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }
        ]
      },
      pendingAction: '',
      bankCodeData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 200],
      currencyOptions: [],
      bankCodeOptions: [],
      bankCodeOptionLoading: false,
      bankCodeAppending: false,
      bankCodeHasMore: true,
      bankCodePageNo: 1,
      bankCodePageSize: 20,
      bankCodeQuery: '',
      bankCodeLoadedQuery: null,
      bankCodeScrollBound: false,
      bankNameOptions: [],
      bankNameOptionLoading: false,
      bankNameAppending: false,
      bankNameHasMore: true,
      bankNamePageNo: 1,
      bankNamePageSize: 20,
      bankNameQuery: '',
      bankNameLoadedQuery: null,
      bankNameScrollBound: false,
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
      filterbox: {
        bankCode: '',
        bankName: '',
        currencyCode: '',
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    mapBankCodeOptions(list) {
      return (list || []).map(item => ({
        value: item.bankCode,
        label: item.bankCode
      }))
    },
    mapBankNameOptions(list) {
      return (list || []).map(item => ({
        value: item.bankName,
        label: item.bankName
      }))
    },
    dedupeOptions(options) {
      const seen = new Set();
      return (options || []).filter(item => {
        const key = String(item?.value || '');
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    },
    resetBankCodeOptions() {
      this.bankCodePageNo = 1;
      this.bankCodeHasMore = true;
      this.bankCodeLoadedQuery = null;
      this.bankCodeOptions = [];
    },
    resetBankNameOptions() {
      this.bankNamePageNo = 1;
      this.bankNameHasMore = true;
      this.bankNameLoadedQuery = null;
      this.bankNameOptions = [];
    },
    fetchBankCodeOptions(append) {
      if (this.bankCodeOptionLoading || this.bankCodeAppending || !this.bankCodeHasMore) return;
      if (append) {
        this.bankCodeAppending = true;
      } else {
        this.bankCodeOptionLoading = true;
      }
      const query = this.bankCodeQuery || '';
      queryBankCode({
        pageNo: this.bankCodePageNo,
        pageSize: this.bankCodePageSize,
        bankCode: query || undefined
      }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const data = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data;
          const list = data?.bankCodeDictDtoList || [];
          const nextOptions = this.mapBankCodeOptions(list);
          this.bankCodeOptions = this.dedupeOptions(
            append ? this.bankCodeOptions.concat(nextOptions) : nextOptions
          );
          if (list.length < this.bankCodePageSize) {
            this.bankCodeHasMore = false;
          } else {
            this.bankCodePageNo += 1;
          }
          this.bankCodeLoadedQuery = query;
        } else {
          this.bankCodeHasMore = false;
        }
      }).finally(() => {
        if (append) {
          this.bankCodeAppending = false;
        } else {
          this.bankCodeOptionLoading = false;
        }
      });
    },
    fetchBankNameOptions(append) {
      if (this.bankNameOptionLoading || this.bankNameAppending || !this.bankNameHasMore) return;
      if (append) {
        this.bankNameAppending = true;
      } else {
        this.bankNameOptionLoading = true;
      }
      const query = this.bankNameQuery || '';
      queryBankCode({
        pageNo: this.bankNamePageNo,
        pageSize: this.bankNamePageSize,
        bankName: query || undefined
      }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const data = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data;
          const list = data?.bankCodeDictDtoList || [];
          const nextOptions = this.mapBankNameOptions(list);
          this.bankNameOptions = this.dedupeOptions(
            append ? this.bankNameOptions.concat(nextOptions) : nextOptions
          );
          if (list.length < this.bankNamePageSize) {
            this.bankNameHasMore = false;
          } else {
            this.bankNamePageNo += 1;
          }
          this.bankNameLoadedQuery = query;
        } else {
          this.bankNameHasMore = false;
        }
      }).finally(() => {
        if (append) {
          this.bankNameAppending = false;
        } else {
          this.bankNameOptionLoading = false;
        }
      });
    },
    handleBankCodeSearch(query) {
      const normalizedQuery = query || '';
      if (this.bankCodeLoadedQuery === normalizedQuery && this.bankCodeOptions.length > 0) return;
      this.bankCodeQuery = normalizedQuery;
      this.resetBankCodeOptions();
      this.fetchBankCodeOptions(false);
    },
    handleBankNameSearch(query) {
      const normalizedQuery = query || '';
      if (this.bankNameLoadedQuery === normalizedQuery && this.bankNameOptions.length > 0) return;
      this.bankNameQuery = normalizedQuery;
      this.resetBankNameOptions();
      this.fetchBankNameOptions(false);
    },
    handleBankCodeDropdownVisible(visible) {
      if (!visible) return;
      if (!this.bankCodeOptions.length) {
        this.resetBankCodeOptions();
        this.fetchBankCodeOptions(false);
      }
      this.attachBankCodeScroll();
    },
    handleBankNameDropdownVisible(visible) {
      if (!visible) return;
      if (!this.bankNameOptions.length) {
        this.resetBankNameOptions();
        this.fetchBankNameOptions(false);
      }
      this.attachBankNameScroll();
    },
    attachBankCodeScroll() {
      this.$nextTick(() => {
        const wrap = document.querySelector(".bank-code-select-dropdown .el-select-dropdown__wrap");
        if (!wrap || this.bankCodeScrollBound) return;
        wrap.addEventListener("scroll", this.handleBankCodeScroll);
        this.bankCodeScrollBound = true;
      });
    },
    attachBankNameScroll() {
      this.$nextTick(() => {
        const wrap = document.querySelector(".bank-name-select-dropdown .el-select-dropdown__wrap");
        if (!wrap || this.bankNameScrollBound) return;
        wrap.addEventListener("scroll", this.handleBankNameScroll);
        this.bankNameScrollBound = true;
      });
    },
    handleBankCodeScroll(event) {
      const el = event.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        this.fetchBankCodeOptions(true);
      }
    },
    handleBankNameScroll(event) {
      const el = event.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) {
        this.fetchBankNameOptions(true);
      }
    },
    search() {
      this.filterbox.pageNo = this.currentPage;
      this.filterbox.pageSize = this.pageSize;
      queryBankCode(this.filterbox).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const data = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data;
          this.bankCodeData = data?.bankCodeDictDtoList || [];
          this.totalCount = data?.totalNumber || 0;
          this.tableKey += 1;
          return;
        }
        this.notifyError(res?.data?.message);
      }).catch(() => {
        this.notifyError();
      });
    },
    reset(form) {
      this.currentPage = 1;
      this.pageSize = 10;
      this.filterbox = {
        bankCode: '',
        bankName: '',
        currencyCode: '',
        pageNo: 1,
        pageSize: 10
      };
      this.$refs[form]?.resetFields();
      this.search();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.search();
    },
    handlePageSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.search();
    },
    openSyncConfirm() {
      if (this.syncSubmitting) return;
      this.pendingAction = 'sync';
      this.confirmDialogTitle = this.$t('bankCodeList.dialog.sync');
      this.confirmDialogVisible = true;
    },
    submitConfirm(form) {
      if (this.syncSubmitting) return;
      this.$refs[form].validate(valid => {
        if (!valid) return;
        this.syncSubmitting = true;
        syncCurrencyType({
          syncType: 2,
          googleCode: this.confirmData.googleCode
        }).then(res => {
          if (res.status === 200 && res.data.code === 0) {
            const syncResult = res.data.data ? (typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data) : null;
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('bankCodeList.message.syncSuccess', {
                inserted: syncResult?.insertedCount ?? 0,
                skipped: syncResult?.skippedExistingCount ?? 0,
                invalid: syncResult?.invalidRowCount ?? 0
              }),
              type: 'success',
              position: 'bottom-right'
            });
            this.search();
          } else {
            this.$notify({
              title: this.$t('common.failed'),
              message: this.resolveSyncErrorMessage(res?.data?.code, res?.data?.message),
              type: 'error',
              position: 'bottom-right'
            });
          }
        }).catch(() => {
          this.$notify({
            title: this.$t('common.failed'),
            message: this.$t('common.requestFailed'),
            type: 'error',
            position: 'bottom-right'
          });
        }).finally(() => {
          this.syncSubmitting = false;
          this.cancelConfirmDialog(form);
        });
      });
    },
    cancelConfirmDialog(form) {
      if (this.syncSubmitting) return;
      this.confirmDialogVisible = false;
      this.confirmDialogTitle = '';
      this.confirmData.googleCode = '';
      this.pendingAction = '';
      if (this.$refs[form]) {
        this.$refs[form].resetFields();
      }
    },
    resolveSyncErrorMessage(code, fallbackMessage) {
      if (code === 100119) {
        return this.$t('bankCodeList.message.syncFileInvalid');
      }
      return fallbackMessage || this.$t('common.requestFailed');
    },
    notifyError(message) {
      this.$notify({
        title: this.$t('common.error'),
        message: message || this.$t('bankCodeList.message.getFailed'),
        duration: 3000,
        type: 'error',
        position: 'bottom-right'
      });
    },
    formatTime(timestamp) {
      const date = new Date(Number(timestamp) * 1000);
      if (Number.isNaN(date.getTime())) return '-';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const second = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  },
  mounted() {
    getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        const data = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data;
        this.currencyOptions = data?.currencyTypeDTOList || [];
      }
    }).finally(() => {
      this.search();
    });
  }
}
</script>

<style scoped>
@import "@/assets/base.css";

.main-toolbar-collapse {
  margin-bottom: 12px;
}

:deep(.bank-code-table-header) {
  color: #111827;
  font-weight: 700;
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

:deep(.bank-code-select-dropdown .el-select-dropdown__wrap),
:deep(.bank-name-select-dropdown .el-select-dropdown__wrap) {
  max-height: 274px;
}
</style>
