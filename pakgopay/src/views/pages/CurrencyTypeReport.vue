<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
 <div class="main-title" style="margin-top: 0">币种报表</div>
  <div class="toolbar" style="width: 96%">
    <el-row style="display: flex;justify-content: space-between;">
      <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
        <template #label>
          <span>币种:</span>
        </template>
        <el-select
            v-model="filterbox.selectedCurrency"
            placeholder="请选择币种"
            size="medium"
            style="width: 150px;"
        >
           <el-option
             v-for="item in currencyOptions"
             :key="item.value"
             :value="item.value"
             :label="item.label"
           />
        </el-select>
        <el-button @click="search" style="color: deepskyblue">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="exportData" style="color: deepskyblue"><SvgIcon name="export"/>导出</el-button>
      </el-form-item>
    </el-row>
  </div>

  <div class="main-views-container" style="height: 900px">
    <el-tabs style="height: 100%">
      <el-tab-pane label="代收" class="tabTable">
        <el-table
          :data="collectingData"
          height="800px"
          border
        >
          <el-table-column
            label="币种"
            prop="currencyType"
            align="center"
            v-slot="{row}"
          >
            <div>{{row.currencyType}}</div>
          </el-table-column>
          <el-table-column
              label="订单数量"
              prop="orderAmount"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderAmount}}</div>
          </el-table-column>
          <el-table-column
              label="币种"
              prop="currencyType"
              align="center"
              v-slot="{row}"
          >
            <div>row.currencyType</div>
          </el-table-column>
          <el-table-column
              label="成功率"
              prop="successRate"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.successRate}}</div>
          </el-table-column>
          <el-table-column
              label="金额"
              prop="amount"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.amount}}</div>
          </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="sizes, prev, pager, next, jumper, total"
            :total="tab1TotalCount"
            v-model:current-page="tab1CurrentPage"
            v-model:page-size="tab1PageSize"
            :page-sizes="pageSizes"
            @current-change="handleTab1CurrentChange"
            @size-change="handleTab1PageSizeChange"
            style="float:right; margin-right: 5%;"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="代付" class="tabTable">
        <el-table
          :data="payingData"
          height="800px"
          border
        >
          <el-table-column
              label="币种"
              prop="currencyType"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.currencyType}}</div>
          </el-table-column>
          <el-table-column
              label="订单数量"
              prop="orderAmount"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.orderAmount}}</div>
          </el-table-column>
          <el-table-column
              label="币种"
              prop="currencyType"
              align="center"
              v-slot="{row}"
          >
            <div>row.currencyType</div>
          </el-table-column>
          <el-table-column
              label="成功率"
              prop="successRate"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.successRate}}</div>
          </el-table-column>
          <el-table-column
              label="金额"
              prop="amount"
              align="center"
              v-slot="{row}"
          >
            <div>{{row.amount}}</div>
          </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="sizes, prev, pager, next, jumper, total"
            :total="tab2TotalCount"
            v-model:current-page="tab2CurrentPage"
            v-model:page-size="tab2PageSize"
            :page-sizes="pageSizes"
            @current-change="handleTab2CurrentChange"
            @size-change="handleTab2PageSizeChange"
            style="float:right; margin-right: 5%;"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'CurrencyTypeReport',
  data() {
    return {
      tab1TotalCount: 0,
      tab2TotalCount: 0,
      tab1CurrentPage: 1,
      tab2CurrentPage: 1,
      pageSizes: [10, 20, 30, 40],
      tab1PageSize:10,
      tab2PageSize:10,
      filterbox: {},
      currencyOptions: [
        {
          value: 1,
          label: '马币'
        },
        {
          value: 2,
          label: '美元'
        }
      ]
    }
  },
  methods: {
    exportData() {
    },
    search() {

    },
    handleTab1CurrentChange(val) {

    },
    handleTab2CurrentChange(val) {

    },
    handleTab1PageSizeChange(val) {

    },
    handleTab2PageSizeChange(val) {

    }
  }
}
</script>
<style scoped>
.toolbar {
  margin-left: 2%;
  margin-top: 1%;
}

.tabTable {
  height: 700px;
  width: 97%;
}
</style>