<script setup>
import '@/api/common.css'
import SvgIcon from "@/components/SvgIcon/index.vue";

</script>
<script>
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
export default {
  name: "ChannelReport",
  components: {
    ElPagination,
  },
  data() {
    return {
      currentPage: 1,
      totalCount: 2,
      pageSizes: [1,5,10,15,30,50,100],
      pageSize: 1,
      filterbox: {
        channelName: '',
        channelLabelName: '',
        startTime: '',
        endTime: '',
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
  }
}
</script>
<template>
  <div class="main-title">渠道报表</div>
  <div class="main-toolbar">
    <form class="main-toolform">
      <div class="main-toolform-item-filter">
        <div v-on:click="exportMerchantInfo" style="height:30px;justify-content: left; border: solid 1px #6495ed; width:200px;border-radius: 15px;cursor: pointer;" class="main-toolform-line">
          <div style="display: flex; flex-direction: row;justify-content: center;width: 90px;align-items: center;">
            <SvgIcon height="20px" width="20px" name="filter"/>筛选
          </div>
          <!--          <input disabled type="text" style="border:none;width: 30px;">-->
          <div @click.stop="">
            <el-form-item style="height:15px;display: flex; justify-content: center;">
              <el-select
                  style="width:100px;height: 100%;border: none;"
                  placeholder="select"
              >
                <el-option>sss</el-option>
              </el-select>
            </el-form-item></div>
        </div>
        <div class="main-toolform-line" style="justify-content: right;margin-right:3%;">
          <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="reset"/>
            <div style="width: 50px;color: white">重置</div>
          </div>
          <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="search"/>
            <div style="width: 50px;color: white">查询</div>
          </div>
          <div v-on:click="exportMerchantInfo" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="export"/>
            <div style="width: 50px;color: white">导出</div>
          </div>
        </div>
      </div>
      <div class="main-toolform-item">
        <div class="main-toolform-line">渠道名称：<input v-model="filterbox.channelName" type="text" class="main-toolform-input" placeholder="渠道名称"/></div>
        <div class="main-toolform-line">渠道别名：<input v-model="filterbox.channelLabelName" type="text" class="main-toolform-input" placeholder="渠道别名"/></div>
        <div class="main-toolform-line">开始时间：<input v-model="filterbox.startTime" type="date"  style="width: 100px;" class="main-toolform-input" placeholder="开始时间"/>&nbsp;~&nbsp;
          <input v-model="filterbox.endTime" style="width: 100px;" type="date" class="main-toolform-input" placeholder="结束时间"/>
        </div>
      </div>
    </form>
  </div>

  <div class="reportInfo">
    <form id="reportInfoTable" class="reportInfoForm">
      <el-table style="width: 100%; height: 100%;" border :data="channelInfo" class="reportInfo-table">
        <el-table-column
            prop="channelName"
            label="渠道名称"
            align="center"
        />
        <el-table-column
            prop="channelLabelName"
            label="渠道代号"
            align="center"
        />
        <el-table-column
            prop="channelCollectingTotalAccount"
            label="渠道代收总金额"
            align="center"
        />
        <el-table-column
            prop="channelPayingTotalAccount"
            label="渠道代付总金额"
            align="center"
        />
        <el-table-column
            prop="channelRate"
            label="渠道费率"
            align="center"
        />
        <el-table-column
            prop="chennelNP"
            label="渠道净利润"
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
.reportInfo{
  margin-top: 20px;
}

.el-table .el-table_body-rapper{
  width: 100%;
  height: calc(100% - 23px);
}
</style>