<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">
    登陆日志
  </div>

  <div class="main-views-container">
    <div class="toolbar" style="width: 96%">
      <el-row style="display: flex;justify-content: space-between;">
        <el-col :span="8" style="display: flex;justify-content: center;">
          <el-form-item style="width: 300px;">
            <template #label>
              <span>开始时间:</span>
            </template>
            <el-input v-model="filterbox.startTime" type="date" placeholder="输入开始时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="display: flex;justify-content: center;">
          <el-form-item style="width: 300px;">
            <template #label>
              <span>结束时间:</span>
            </template>
            <el-input v-model="filterbox.endTime" type="date" placeholder="输入截止时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="display: flex;justify-content: center;">
          <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
            <template #label>
              <span>用户名称:</span>
            </template>
            <el-input placeholder="输入用户名称">
              <template #append>
                <el-button @click="createUser">
                  <SvgIcon name="search"/>搜索
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </div>

    <div class="main-views-form">
      <el-table
          border :data="loginLogInfo"
          class="login-log-table"
          style="width: 97%;height: 100%;"
          :key="tablekey"
      >
        <el-table-column
            label="登陆账号"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.userAccount}}</div>
        </el-table-column>
        <el-table-column
            label="账号名称"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.userName}}</div>
        </el-table-column>
        <el-table-column
            label="登陆时间"
            v-slot="{row}"
            align="center"
        >
          <div>{{row.loginTime}}</div>
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
      loginLogInfo: [],
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