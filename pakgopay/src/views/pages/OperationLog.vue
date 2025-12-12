<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">
    操作日志
  </div>

  <div class="main-views-container">
    <div class="toolbar" style="width: 96%">
      <el-form>
        <el-row>
          <el-col :span="24" style="display: flex;justify-content: right;justify-items: center;">
            <el-form-item style="display: flex;justify-items: center;height: 100%;margin-right: 4%">
              <el-button><SvgIcon name="search"/>查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex;justify-content: space-between;">
          <el-col :span="6">
            <el-form-item style="width: 300px;">
              <template #label>
                <span>操作员:</span>
              </template>
              <el-autocomplete
                  v-model="filterbox.operatorName"
                  placeholder="输入用户名称"
                  :fetch-suggestions="getOperators"
                  @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display: flex;justify-content: center;">
            <el-form-item style="width: 300px;">
              <template #label>
                <span>选择操作类型:</span>
              </template>
              <el-select
                  v-model="filterbox.operateType"
              >
                <el-option
                    v-for="item in operationTypeOptions"
                    :key="item.operate"
                    :value="item.operate"
                    :label="item.operateName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display: flex;justify-content: center;">
            <el-form-item style="width: 300px;">
              <template #label>
                <span>开始时间:</span>
              </template>
              <el-input v-model="filterbox.startTime" type="date" placeholder="输入开始时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display: flex;justify-content: center;">
            <el-form-item style="width: 300px;">
              <template #label>
                <span>结束时间:</span>
              </template>
              <el-input v-model="filterbox.endTime" type="date" placeholder="输入截止时间"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </div>

    <div class="main-views-form">
      <el-table
          border :data="operationLogInfo"
          class="operation-log-table"
          style="width: 97%;height: 100%;"
          :key="tablekey"
      >
        <el-table-column
            label="操作人"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.operator}}</div>
        </el-table-column>
        <el-table-column
            label="操作类型"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.operateType}}</div>
        </el-table-column>
        <el-table-column
            label="操作内容"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.operateInfo}}</div>
        </el-table-column>
        <el-table-column
            label="操作时间"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.operateTime}}</div>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperationLog',
  data() {
    return {
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [5, 10, 15, 20],
      tablekey: '',
      operationLogInfo: [],
      timeout: null,
      operators: [],
      operationTypeOptions: [
        {
          operate: 'add',
          operateName: '新增',
        },
        {
          operate: 'edit',
          operateName: '修改'
        },
        {
          operate: 'delete',
          operateName: '删除'
        }
      ],
      filterbox: {
        operateType: '',
        operator: '',
        startTime: '',
        endTime: '',
        operatorName: '',
      }
    }
  },
  methods: {
    loadAllOperators() {
      return [
        {
          "value": "张三", 'id': '001'
        },
        {
          "value": '赵四', 'id': '002'
        },
        {
          'value': '王二麻子', 'id': '003'
        }
      ]
    },
    getOperators(queryString, cb) {
      const operators = this.operators
      const result = queryString ? operators.filter(this.createNameFilter(queryString)) : operators
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(result)
      }, 3000*Math.random())
    },
    createNameFilter(queryString) {
      return (operatorName) => {
        return (operatorName.value.toLowerCase().indexOf(queryString.toLowerCase())===0)
      }
    },
    handleSelect() {

    },
    handleSizeChange(val) {

    },
    handleCurrentChange(val) {

    }
  },
  mounted() {
    this.operators = this.loadAllOperators()
  }
}
</script>
<style scoped>

</style>