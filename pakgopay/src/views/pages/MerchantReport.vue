
<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";

</script>
<script>
import '@/api/common.css'
import {ElPagination} from "element-plus";
import 'element-plus/theme-chalk/el-pagination.css'
export default {
  components: {
    ElPagination
  },
  data() {
    return {
      filterbox: {
        merchantNum: '',
        merchantAccount: '',
        startTime: '',
        endTime: '',
      },
      reportTitle : '代收订单订单总数｜代收订单成功率｜代收订单成功数｜代付订单总数｜代收订单成功率｜代收订单成功数｜代收/付商户手续费｜一二三级代理佣金｜代收/付总利润',
      currentPage: 1,
      totalCount: 2,
      pageSizes: [1,5,10,15,30,50,100],
      pageSize: 1,
      reportInfoData: [
        {
          dsOrderNumber: '100000000000',
          dsOrderSuccessRate: '98%',
          dsOrderSuccessNumber: 1000,
          dfOrderNumber: '001',
          dfOrderSuccessRate: '98%',
          dfOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: '测试商户'
        },
        {
          dsOrderNumber: '100000000000',
          dsOrderSuccessRate: '98%',
          dsOrderSuccessNumber: 1000,
          dfOrderNumber: '001',
          dfOrderSuccessRate: '98%',
          dfOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: '测试商户2'
        }
      ],
      allReportInfoData: [
        {
          dsOrderNumber: '100000000000',
          dsOrderSuccessRate: '98%',
          dsOrderSuccessNumber: 1000,
          dfOrderNumber: '001',
          dfOrderSuccessRate: '98%',
          dfOrderSuccessNumber: 1000,
          commission: 10000,
          agencyCommission: 100000000,
          totalProfit: 100000000000,
          merchantAccount: '测试商户'
        }
      ],
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
    getAllReportInfoData() {
      //获取所有数据
    },
  }
}
</script>
<template>
  <div class="title">
    商户报表
  </div>
  <div class="toolbar">
    <form class="toolform">
      <div class="toolform-item-filter">
        <div v-on:click="exportMerchantInfo" style="height:30px;justify-content: left; border: solid 1px #6495ed; width:200px;border-radius: 15px;cursor: pointer;" class="toolform-line">
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
        <div class="toolform-line" style="justify-content: right;margin-right:3%;">
          <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="reset"/>
            <div style="width: 50px;color: white">重置</div>
          </div>
          <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="search"/>
            <div style="width: 50px;color: white">查询</div>
          </div>
          <div v-on:click="exportMerchantInfo" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="export"/>
            <div style="width: 50px;color: white">导出</div>
          </div>
        </div>
      </div>
      <div class="toolform-item">
        <div class="toolform-line">商户编号：<input v-model="filterbox.merchantNum" type="text" class="toolform-input" placeholder="商户编号"/></div>
        <div class="toolform-line">商户账号：<input v-model="filterbox.merchantAccount" type="text" class="toolform-input" placeholder="商户账号"/></div>
        <div class="toolform-line">开始时间：<input v-model="filterbox.startTime" type="date"  style="width: 100px;" class="toolform-input" placeholder="开始时间"/>&nbsp;~&nbsp;
          <input v-model="filterbox.endTime" style="width: 100px;" type="date" class="toolform-input" placeholder="结束时间"/>
        </div>
      </div>
<!--      <div class="toolform-item">
        <div class="toolform-line"><input type="button" value="重置"><input type="button" value="搜索"></div>
      </div>-->
<!--      <div class="toolform-item">
        <div class="toolform-line">商户编号：<input type="text" class="toolform-input" placeholder="商户编号"/></div>
        <div class="toolform-line">商户编号：<input type="text" class="toolform-input" placeholder="商户编号"/></div>
        <div class="toolform-line">商户编号：<input type="text" class="toolform-input" placeholder="商户编号"/></div>
        <div class="toolform-line">商户编号：<input type="text" class="toolform-input" placeholder="商户编号"/></div>
      </div>-->
    </form>
  </div>
  <!-- 统计数据展示 -->
  <div class="statistics-container">
    <form id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>总账户金额:</span>
          <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </form>

    <form id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>提现总金额:</span>
          <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </form>

    <form id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash-freeze" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>冻结总金额:</span>
          <textarea v-model="filterbox.merchantAccount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </form>
  </div>
  <div class="reportInfo">
    <form id="reportInfo" class="reportInfoForm">
      <el-table
          border :data="reportInfoData"
          class="reportInfo-table"
          style="width: 97%"
          height="500"
      >
        <el-table-column
            label="商户名称"
            v-slot="{row}"
            align="center"
            fixed
            width="150px"
        >
          <div>
            {{row.merchantAccount}}
          </div>
        </el-table-column>
        <el-table-column
          prop="dsOrderNumber"
          label="代收订单总数"
          v-slot="{row}"
          align="center"
        >
          <div>
            {{row.dsOrderNumber}}
          </div>
        </el-table-column>
        <el-table-column
            prop="dsOrderSuccessRate"
            label="代收订单成功率"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            {{row.dsOrderSuccessRate}}
          </div>
        </el-table-column>
        <el-table-column
            prop="dsOrderSuccessNumber"
            label="代收订单成功数"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            {{row.dsOrderSuccessNumber}}
          </div>
        </el-table-column>
        <el-table-column
            prop="dfOrderNumber"
            label="代付订单总数"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            {{row.dfOrderNumber}}
          </div>
        </el-table-column>
        <el-table-column
            prop="dfOrderSuccessRate"
            label="代付订单成功率"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            {{row.dfOrderSuccessRate}}
          </div>
        </el-table-column>
        <el-table-column
            prop="dfOrderSuccessNumber"
            label="代付订单成功数"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            {{row.dfOrderSuccessNumber}}
          </div>
        </el-table-column>
          <el-table-column
              prop="commission"
              label="代收/付商户手续费"
              v-slot="{row}"
              align="center"
              width="150px"
          >
            <div>
              {{row.commission}}
            </div>
          </el-table-column>
            <el-table-column
                prop="agencyCommission"
                label="一二三级代理佣金"
                v-slot="{row}"
                align="center"

            >
              <div>
                {{row.agencyCommission}}
              </div>
            </el-table-column>
              <el-table-column
                  prop="totalProfit"
                  label="代收/付总利润"
                  v-slot="{row}"
                  align="center"
                  width="100px"
                  fixed="right"
              >
                <div>
                  {{row.totalProfit}}
                </div>
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
  </div>
</template>
<style scoped>
  .title{
    /*margin-top: 1%;*/
    margin-left: 2%;
    font-size: 24px;
    font-weight: bold;
    background-color: white;
    padding-left: 10px;
    border-radius: 10px;
    width: 95.5%;
  }

  .toolbar{
    margin-top: 1%;
    margin-left: 2%;
    background-color: white;
    height: 20%;
    width: 96%;
    border-radius: 15px;
    overflow: auto;
    display: flex;
    align-items: center;
  }

  .toolform{
    /*margin-left: 1%;*/
    height: 90%;
    padding: 0;
    width: 100%;
  }

  .toolform-item-filter{
    /*margin-top: 1%;*/
    height: 30%;
    margin-left: 2%;
    /*margin-right: 2%;*/
    /*margin-left: 2%;*/
    display: flex;
    justify-content: space-between;

    align-items: center;
  }

  .toolform-item{
    /*margin-top: 1%;*/
    height: 35%;
    /*margin-right: 2%;*/
    /*margin-left: 2%;*/
    display: flex;
    justify-content: space-between;

    align-items: center;
  }

  .toolform-input{
    background-color: transparent;
    border: solid 1px #6495ed;
    height: 70%;
    width: 300px;
    border-radius: 10px;
  }

  .toolform-line {
    height: 50px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  .el-select .el-input_icon {
    font-size: 20px;
    transform: scale(1.5);
    border: 0;
  }
  .statistics-form{
    margin-left: 2%;
    margin-top: 1%;
    background-color: white;
    height: 150px;
    width: 500px;
    display: flex;
    align-items: center;
    border-radius: 20px;
  }

  .statistics-container{
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     align-items: center;
     margin-left: 30px;
     margin-right: 50px;
  }

  .statistics-form-item{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 70%;
  }

  .cash-text-area {
    width: 90%;
    height: 100%;
    background-color: transparent;
    border: none;
    resize: none;
  }

  .reportInfo{
    margin-top: 1%;
    height: 60%;
    margin-left: 3%;
  }

  .reportInfoForm {
    height: 100%;
  }

  .reportInfo-table{
    height: 100%;
    text-align: center;
  }

  .el-table .el-table_body-rapper{
    width: 100%;
    height: calc(100% - 23px);
  }

 /* .reportInfo{
    margin-left: 2%;
    margin-top: 1%;
    background-color: white;
    height: 62%;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 20px;
  }
  .reportInfoForm {
    padding: 0;
    margin-top: 1%;
  }
  .reportInfo-table{
    margin-top: 0;
    padding-top: 0;
    width: 100%;
    height: 80%;
  }*/
</style>