<script setup>
import '@/api/common.css'
import SvgIcon from "@/components/SvgIcon/index.vue";
import merchantReport from "@/views/pages/MerchantReport.vue";

</script>
<script>
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
import '@/api/common.css'
import {ref} from "vue";
const filterTimeRange = ref('')
export default {
  name: "ChannelReport",
  components: {
    ElPagination,
  },
  data() {
    return {
      statistics: {},
      channelOptions: [
        {
          channelId: 1,
          channelName: '渠道一'
        },
        {
          channelId: 2,
          channelName: '渠道二'
        }
      ],
      channelProps: {
        value: 'channelId',
        label: 'channelName'
      },
      currentPage: 1,
      totalCount: 2,
      pageSizes: [1,5,10,15,30,50,100],
      pageSize: 1,
      filterbox: {
      }
    }
  },
  methods: {
    exportMerchantInfo() {
      //导出报表方法
    },
    // 改变每页显示条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.handleCurrentChange(1)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      let pageSize = this.pageSize
      // 清空table绑定数据
      this.reportInfoData = []
      // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
      this.reportInfoData = this.allReportInfoData.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))
    },
    reset(form) {
      this.$refs[form].resetFields()
    }
  }
}
</script>
<template>
  <div class="main-title">渠道报表</div>

  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 2%;">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏&统计数据
        </span>
      </template>
      <div class="main-toolbar">
        <el-form class="main-toolform" ref="filterForm" :model="filterbox">
          <el-row style="display: flex;justify-content: center;align-items: center;">
            <el-col :span="8">
              <el-form-item label="渠道:" label-width="150px" prop="channelId">
                <el-select
                  :options="channelOptions"
                  :props="channelProps"
                  placeholder="请选择渠道"
                  v-model="filterbox.channelId"
                  style="width: 250px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间范围:" label-width="150px" prop="timeRange">
                <div style="display: flex; flex-direction: row;">
                  <el-date-picker
                      v-model="filterTimeRange"
                      type="datetimerange"
                      :shortcuts="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="YYYY/MM/DD"
                      value-format="YYYY-MM-DD"
                  >
                  </el-date-picker>
                  <el-button @click="reset('filterForm')">
                    <SvgIcon height="20px" width="20px" name="reset"/>
                    <div style="color: black">重置</div>
                  </el-button>
                  <el-button type="primary" @click="search()" style="margin:0">
                    <SvgIcon height="20px" width="20px" name="search"/>
                    <div style="color: black">查询</div>
                  </el-button>
                  <el-button @click="exportMerchantInfo" style="margin:0">
                    <SvgIcon height="20px" width="20px" name="export"/>
                    <div style="color: black">导出</div>
                  </el-button>
                </div>

              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="statistics-container"  style="flex-direction: row;justify-content: space-around">
        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="tixian" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;">
              <span style="text-align: left;font-size: x-large">代收金额:</span>
              <textarea v-model="statistics.collectionChannelAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>

        <el-card id="statistics" class="statistics-form">
          <div class="statistics-form-item">
            <SvgIcon name="paying" width="90px" height="90px"/>
            <div style="display: flex; flex-direction: column;width: 80%;">
              <span style="text-align: left;font-size: x-large">代付总金额:</span>
              <textarea v-model="statistics.payingChannelAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="reportInfo" style="width: 95%;margin-left: 2%;">
    <el-tabs>
      <el-tab-pane label="代付">
        <form id="reportInfoTable" class="reportInfoForm">
          <el-table style="width: 100%; height: 100%;" border :data="payingChannelInfo" class="reportInfo-table">
            <el-table-column
                prop="channelName"
                label="渠道名称"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.channelName}}</div>
            </el-table-column>
            <el-table-column
                prop="payingChannelOrderNumber"
                label="代付订单总数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.payingChannelOrderNumber}}</div>
            </el-table-column>
            <el-table-column
                prop="payingChannelFailureOrderNumber"
                label="代付失败订单数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.payingChannelFailureOrderNumber}}</div>
            </el-table-column>
            <el-table-column
                prop="payingChannelSuccessOrderNumber"
                label="代付成功订单数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.payingChannelSuccessOrderNumber}}</div>
            </el-table-column>
            <el-table-column
                prop="payingChannelSuccessRate"
                label="代收订单成功率"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.payingChannelSuccessRate}}</div>
            </el-table-column>
            <el-table-column
                prop="payingChannelMerchantCommission"
                label="代付商户手续费"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.payingChannelMerchantCommission}}</div>
            </el-table-column>
            <el-table-column
                prop="payingChannelProfit"
                label="代付净利润"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.payingChannelProfit}}</div>
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
              align="center"
              v-slot="{row}"
            >
              {{getTimeFromTimestamp(row.time)}}
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
              style="float:right; margin-right: 5%;"
          >
          </el-pagination>
        </form>
      </el-tab-pane>
      <el-tab-pane label="代收">
        <form id="reportInfoTable" class="reportInfoForm">
          <el-table style="width: 100%; height: 100%;" border :data="collectionChannelInfo" class="reportInfo-table">
            <el-table-column
                prop="channelName"
                label="渠道名称"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.channelName}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelOrderNumber"
                label="代收订单总数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.collectionChannelOrderNumber}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelFailureOrderNumber"
                label="代收失败订单数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.collectionChannelFailureOrderNumber}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelSuccessOrderNumber"
                label="代收成功订单数"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.collectionChannelSuccessOrderNumber}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelSuccessRate"
                label="代收订单成功率"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.collectionChannelSuccessRate}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelMerchantCommission"
                label="代收商户手续费"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.collectionChannelMerchantCommission}}</div>
            </el-table-column>
            <el-table-column
                prop="collectionChannelProfit"
                label="代收净利润"
                align="center"
                v-slot="{row}"
            >
              <div>{{row.collectionChannelProfit}}</div>
            </el-table-column>
            <el-table-column
                prop="time"
                label="时间"
                align="center"
                v-slot="{row}"
            >
              {{getTimeFromTimestamp(row.time)}}
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
              style="float:right; margin-right: 5%;"
          >
          </el-pagination>
        </form>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<style scoped>
.reportInfo{
  margin-top: 20px;
}

.el-table .el-table_body-rapper{
  width: 100%;
  height: calc(100% - 23px);
}

:deep().el-table th.is-leaf {

  background-color: lightskyblue;
  color: white;
  font-weight: bold;
  font-size: larger;
}

.toolbarName{
  color: black;
}
:deep() .el-collapse-item__header {
  background-color: deepskyblue;
}
</style>