<script setup>
import '@/api/common.css'
import SvgIcon from "@/components/SvgIcon/index.vue";

</script>
<script>
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
import {ref} from "vue";
const filterDateRange = ref('')
export default {
  name: "ChannelReport",
  components: {
    ElPagination,
  },
  data() {
    return {
      totalbox: {},
      pathChannelOptions: [
        {
          channelId: 1,
          channelName: '通道一'
        },
        {
          channelId: 2,
          channelName: '通道二'
        }
      ],
      pathChannelProps: {
        value: 'channelId',
        label: 'channelName'
      },
      currentPage: 1,
      totalCount: 2,
      pageSizes: [1,5,10,15,30,50,100],
      pageSize: 1,
      filterbox: {
        pathChannelName: '',
        pathChannelLabelName: '',
        startTime: '',
        endTime: '',
      }
    }
  },
  methods: {
    exportPathChannelInfo() {
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
  }
}
</script>
<template>
  <div class="main-title">{{$t('route.pathChannelReport')}}</div>
  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 1%;margin-right: 3%;">
    <el-collapse-item>
      <template #title>
         <span class="toolbarName">
          工具栏&统计数据
        </span>
      </template>
      <div class="main-toolbar">
        <el-form style="width: 96%;">
          <el-row style="display: flex;justify-content: space-around;">
            <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
              <template #label>
                <span style="width: 150px;">通道:</span>
              </template>
              <el-select
                  :options="pathChannelOptions"
                  :props="pathChannelProps"
                  v-model="filterbox.pathChannelName"
                  style="width: 200px"
              />
            </el-form-item>


            <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
              <template #label>
                <span style="width: 150px">时间范围:</span>
              </template>
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
              <el-button type="primary" plain @click="reset">
                <template #icon>
                  <SvgIcon name="reset"/>
                </template>
                <span style="color: black">重置</span>
              </el-button>
              <el-button type="success" @click="search" style="margin: 0">
                <template #icon>
                  <div style="width: 100%">
                    <SvgIcon name="search" style="width: 20px;height: 20px" />
                  </div>
                </template>
                <div style="color: black">查询</div>
              </el-button>
            </el-form-item>
          </el-row>
        </el-form>
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
    <form id="reportInfoTable" class="reportInfoForm">
      <el-button @click="exportPathChannelInfo" style="margin: 0;float: right;">
        <template #icon>
          <div style="width: 100%">
            <SvgIcon name="export" style="width: 20px;height: 20px" />
          </div>
        </template>
        <div style="color: black">导出</div>
      </el-button>
      <el-table style="width: 100%; height: 100%;" border :data="channelInfo" class="reportInfo-table">
        <el-table-column
            prop="channelName"
            label="通道名称"
            align="center"
        />
        <el-table-column
            prop="channelLabelName"
            label="通道代号"
            align="center"
        />
        <el-table-column
            prop="channelCollectingTotalAccount"
            label="通道代收总金额"
            align="center"
        />
        <el-table-column
            prop="channelPayingTotalAccount"
            label="通道代付总金额"
            align="center"
        />
        <el-table-column
            prop="channelRate"
            label="通道费率"
            align="center"
        />
        <el-table-column
            prop="chennelNP"
            label="通道净利润"
            align="center"
        />
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
  </div>
</template>

<style scoped>
@import "@/assets/base.css";
@import "@/api/common.css";
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
</style>