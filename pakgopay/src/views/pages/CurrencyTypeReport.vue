<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
 <div class="main-title" style="margin-top: 0">币种报表</div>
  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 1%;margin-right: 3%;">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏&统计数据
        </span>
      </template>
      <div class="toolbar" style="width: 96%">
        <el-row style="display: flex;justify-content: space-around;">
          <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
            <template #label>
              <span>币种:</span>
            </template>
            <el-select
                v-model="filterbox.selectedCurrency"
                placeholder="请选择币种"
                size="medium"
                style="width: 150px;"
                clearable
            >
              <el-option
                  v-for="item in currencyOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
                v-model="filterDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY/MM/DD"
                value-format="x"
            >
            </el-date-picker>
            <el-button @click="search" style="color: deepskyblue">搜索</el-button>
            <el-button @click="exportData" style="color: deepskyblue;margin: 0"><SvgIcon name="export"/>导出</el-button>
          </el-form-item>
        </el-row>
      </div>
      <div class="statistics-container" style="justify-content: space-around">
        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="tixian" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;justify-items: right">
              <span style="text-align: left;font-size: x-large">代收总金额:</span>
              <textarea v-model="totalbox.collectionAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>

        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="paying" width="90px" height="90px"/>
            <div style="display: flex; flex-direction: column;width: 80%;">
              <span style="text-align: left;font-size: x-large">代付总金额:</span>
              <textarea v-model="totalbox.payingAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
    </el-collapse-item>
  </el-collapse>


  <div class="reportInfo" style="margin-left: 1%;margin-right: 3%;margin-top: 1%;width: 95%;">
    <el-tabs style="height: 100%;width: 100%">
      <el-tab-pane label="代收" class="tabTable" style="width: 100%">
        <el-table
          :data="collectingData"
          height="auto"
          border
          style="width: 100%"
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
      <el-tab-pane label="代付" class="tabTable" style="width: 100%">
        <el-table
          :data="payingData"
          height="auto"
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
import {ref} from "vue";

const filterDateRange = ref('')
export default {
  name: 'CurrencyTypeReport',
  data() {
    return {
      totalbox: {},
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
@import "@/assets/base.css";
@import "@/api/common.css";
.toolbar {
  margin-left: 2%;
  margin-top: 1%;
}

.tabTable {
  height: 700px;
  width: 97%;
}
</style>