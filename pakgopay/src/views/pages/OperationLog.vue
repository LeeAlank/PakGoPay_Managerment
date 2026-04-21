<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">
    {{ $t('log.operation.title') }}
  </div>

  <div class="main-views-container">
    <el-collapse class="main-toolbar-collapse" v-model="activeToolbars" style="width: 97%;">
      <el-collapse-item name="toolbar">
        <template #title>
          <span class="toolbarName">
            {{ $t('common.toolbar') }}
          </span>
        </template>
        <div class="main-toolbar" style="height: auto; width: 97%; margin-left: 0;">
          <el-form class="main-toolform" ref="filterboxForm" :model="filterbox">
            <el-row style="display: flex;justify-content: space-between;">
              <el-col :span="8">
                <el-form-item style="width: 300px;" prop="operateUserName">
                  <template #label>
                    <span>{{ $t('log.operation.operator') }}</span>
                  </template>
                  <el-input
                      v-model="filterbox.operateUserName"
                      :placeholder="$t('common.placeholder.userName')"
                      clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" style="display: flex;justify-content: center;">
                <el-form-item style="width: 300px;" prop="operateType">
                  <template #label>
                    <span>{{ $t('log.operation.typeSelect') }}</span>
                  </template>
                  <el-select
                      v-model="filterbox.operateType"
                      clearable
                  >
                    <el-option
                        v-for="item in operationTypeOptions"
                        :key="item.operate"
                        :value="item.operate"
                        :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="display: flex;justify-content: center;">
                <el-form-item style="width: 300px;" prop="filterDateRange">
                  <template #label>
                    <span>{{ $t('common.timeRange') }}</span>
                  </template>
                  <DateTimeRangeSplit
                      v-model="filterbox.filterDateRange"
                      picker-type="date"
                      format="YYYY/MM/DD"
                      value-format="x"
                      :clearable="true"
                      picker-width="140px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div class="toolbar-action-row">
              <el-button class="filterButton" @click="reset('filterboxForm')">
                <SvgIcon class="filterButtonSvg" name="reset"/>
                <div>{{ $t('common.reset') }}</div>
              </el-button>
              <el-button class="filterButton" @click="searchData">
                <SvgIcon class="filterButtonSvg" name="search"/>
                <div>{{ $t('common.search') }}</div>
              </el-button>
            </div>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>

    <div class="main-views-form">
      <el-table
          border :data="operationLogInfo"
          class="operation-log-table"
          style="width: 97%;"
          height="auto"
          :key="tablekey"
      >
        <el-table-column
            label="ID"
            width="100"
            min-width="100"
            v-slot="{row}"
            align="center"
        >
          <div>{{ row.id ?? '-' }}</div>
        </el-table-column>
        <el-table-column
            :label="$t('log.operation.column.type')"
            v-slot="{row}"
            align="center"
        >
          <div>{{ getOperateTypeDisplay(row.operateType) }}</div>
        </el-table-column>
        <el-table-column
            label="操作名称"
            v-slot="{row}"
            align="center"
        >
          <div>{{ row.operateName || '-' }}</div>
        </el-table-column>
        <el-table-column
            :label="$t('log.operation.column.content')"
            v-slot="{row, $index}"
            align="center"
        >
          <div
              class="operate-content-cell"
              :class="{ 'collapsed-3-lines': !isOperateContentExpanded(row, $index) }"
          >
            {{ formatOperateParams(row.operateParams) }}
          </div>
          <el-button
              v-if="shouldShowContentToggle(formatOperateParams(row.operateParams))"
              type="primary"
              text
              class="operate-content-toggle"
              @click="toggleOperateContent(row, $index)"
          >
            {{ isOperateContentExpanded(row, $index) ? $t('log.operation.collapse') : $t('log.operation.expand') }}
          </el-button>
        </el-table-column>
        <el-table-column
            :label="$t('log.operation.column.operator')"
            v-slot="{row}"
            align="center"
        >
          <div>{{ row.operateUserName || '-' }}</div>
        </el-table-column>
        <el-table-column
            :label="$t('log.operation.column.time')"
            v-slot="{row}"
            align="center"
        >
          <div>{{ getTimeFromTimestamp(row.createTime) }}</div>
        </el-table-column>
      </el-table>
      <el-pagination class="pageTool"
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
         
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getTimeFromTimestamp, loadingBody} from "@/api/common.js";
import {operateLogList, refreshAccessToken} from "@/api/interface/backendInterface.js";

export default {
  name: 'OperationLog',
  data() {
    return {
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 50, 100, 200],
      activeToolbars: ['toolbar'],
      tablekey: 0,
      operationLogInfo: [],
      operationTypeOptions: [
        {
          operate: 1,
          label: this.$t('common.operate.edit'),
        },
        {
          operate: 2,
          label: this.$t('common.operate.delete'),
        },
        {
          operate: 3,
          label: this.$t('common.operate.add'),
        },
        {
          operate: 4,
          label: this.$t('common.export'),
        },
      ],
      expandedOperateContent: {},
      filterbox: {
        operateType: null,
        operateUserName: '',
        filterDateRange: null,
        pageNo: 1,
        pageSize: 10,
      }
    }
  },
  methods: {
    getTimeFromTimestamp,
    getOperateTypeLabel(operateType) {
      const mapping = {
        1: this.$t('common.operate.edit'),
        2: this.$t('common.operate.delete'),
        3: this.$t('common.operate.add'),
        4: this.$t('common.export'),
      };
      return mapping[operateType] || '-';
    },
    getOperateTypeDisplay(operateType) {
      if (operateType === null || operateType === undefined) {
        return '-';
      }
      const label = this.getOperateTypeLabel(operateType);
      return label === '-' ? String(operateType) : label;
    },
    formatOperateParams(params) {
      if (!params) {
        return '-';
      }
      if (typeof params !== 'string') {
        try {
          return JSON.stringify(params, null, 2);
        } catch (e) {
          return String(params);
        }
      }
      try {
        const parsed = JSON.parse(params);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        return params;
      }
    },
    getOperateContentKey(row, index) {
      if (row && row.id !== null && row.id !== undefined) {
        return String(row.id);
      }
      return `${this.currentPage}-${index}`;
    },
    isOperateContentExpanded(row, index) {
      return !!this.expandedOperateContent[this.getOperateContentKey(row, index)];
    },
    toggleOperateContent(row, index) {
      const key = this.getOperateContentKey(row, index);
      this.expandedOperateContent = {
        ...this.expandedOperateContent,
        [key]: !this.expandedOperateContent[key],
      };
    },
    shouldShowContentToggle(content) {
      if (!content || content === '-') {
        return false;
      }
      const text = String(content);
      const explicitLines = text.split(/\r?\n/).length;
      return explicitLines > 3 || text.length > 120;
    },
    resolveDateRangeToSeconds(range) {
      if (!range) {
        return { startTime: null, endTime: null };
      }
      let startMs;
      let endMs;
      if (Array.isArray(range) && range.length === 2) {
        [startMs, endMs] = range;
      } else {
        const arr = String(range).split(',');
        if (arr.length !== 2) {
          return { startTime: null, endTime: null };
        }
        [startMs, endMs] = arr;
      }
      const start = Math.floor(Number(startMs) / 1000);
      const end = Math.floor(Number(endMs) / 1000) + 86399;
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return { startTime: null, endTime: null };
      }
      return { startTime: start, endTime: end };
    },
    buildQuery() {
      const { startTime, endTime } = this.resolveDateRangeToSeconds(this.filterbox.filterDateRange);
      return {
        operateType: this.filterbox.operateType,
        operateUserName: this.filterbox.operateUserName || null,
        startTime,
        endTime,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
      };
    },
    parsePayload(payload) {
      if (!payload) {
        return null;
      }
      return typeof payload === 'string' ? JSON.parse(payload) : payload;
    },
    async loadData() {
      const loadingInstance = loadingBody(this, 'operation-log-table');
      try {
        const response = await operateLogList(this.buildQuery());
        if (response.status === 401) {
          await refreshAccessToken(localStorage.getItem("refreshToken"));
          return;
        }
        if (response.status !== 200) {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('common.requestFailed'),
            type: 'error',
            position: 'top-right',
          });
          return;
        }
        if (response.data.code !== 0) {
          this.$notify({
            title: this.$t('common.error'),
            message: response.data.message || this.$t('common.requestFailed'),
            type: 'error',
            position: 'top-right',
          });
          return;
        }
        const payload = this.parsePayload(response.data.data);
        this.operationLogInfo = payload?.operateLogs || [];
        this.expandedOperateContent = {};
        this.totalCount = payload?.totalNumber || 0;
        this.currentPage = payload?.pageNo || this.currentPage;
        this.pageSize = payload?.pageSize || this.pageSize;
      } catch (e) {
        this.$notify({
          title: this.$t('common.error'),
          message: this.$t('common.requestFailed'),
          type: 'error',
          position: 'top-right',
        });
      } finally {
        loadingInstance.close();
      }
    },
    async searchData() {
      this.currentPage = 1;
      await this.loadData();
    },
    async reset(form) {
      if (this.$refs[form] && this.$refs[form].resetFields) {
        this.$refs[form].resetFields();
      }
      this.filterbox.operateType = null;
      this.filterbox.operateUserName = '';
      this.filterbox.filterDateRange = null;
      this.currentPage = 1;
      this.pageSize = 10;
      await this.loadData();
    },
    async handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      await this.loadData();
    },
    async handleCurrentChange(val) {
      this.currentPage = val;
      await this.loadData();
    }
  },
  async mounted() {
    await this.loadData();
  }
}
</script>
<style scoped>
.main-toolbar-collapse {
  margin-bottom: 12px;
}

.main-views-form {
  margin-top: 0;
}

:deep(.pageTool) {
  margin-right: 90px !important;
}

.operate-content-cell {
  white-space: pre-wrap;
  word-break: break-all;
  text-align: left;
}

.collapsed-3-lines {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.operate-content-toggle {
  margin-top: 4px;
  padding: 0;
}
</style>
