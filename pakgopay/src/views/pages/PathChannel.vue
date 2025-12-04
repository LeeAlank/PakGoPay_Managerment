<script setup>
import '@/api/common.css'
import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">代理报表</div>
  <div class="main-toolbar">
    <form class="main-toolform">
      <div class="main-toolform-item-filter">
        <div class="main-toolform-line" style="justify-content: right;margin-right:3%;">
          <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="reset"/>
            <div style="width: 50px;color: white">重置</div>
          </div>
          <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="search"/>
            <div style="width:50px;color: white">查询</div>
          </div>
          <div v-on:click="exportMerchantInfo" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="export"/>
            <div style="width: 50px;color: white">导出</div>
          </div>
        </div>
      </div>
      <div class="main-toolform-item">
        <div class="main-toolform-line">渠道名称：<input v-model="filterbox.pathChannelName" type="text" class="main-toolform-input" placeholder="通道名称"/></div>
        <div class="main-toolform-line">渠道别名：<input v-model="filterbox.pathChannelLabelName" type="text" class="main-toolform-input" placeholder="通道别名"/></div>
        <div class="main-toolform-line">开始时间：<input v-model="filterbox.startTime" type="date"  style="width: 150px;" class="main-toolform-input" placeholder="开始时间"/>&nbsp;~&nbsp;
          <input v-model="filterbox.endTime" style="width: 150px;" type="date" class="main-toolform-input" placeholder="结束时间"/>
        </div>
      </div>
    </form>
  </div>
  <div class="statistics-container">
    <form id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>总收益金额:</span>
          <textarea v-model="totalbox.income" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </form>

    <form id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="tixian" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>提现总金额:</span>
          <textarea v-model="totalbox.withdraw" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </form>

    <form id="statistics" class="statistics-form">
      <div class="statistics-form-item">
        <SvgIcon name="cash-freeze" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span>冻结总金额:</span>
          <textarea v-model="totalbox.freeze" disabled class="cash-text-area"></textarea>
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
            label="代理"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.agentAccount}}
          </div>
        </el-table-column>
        <el-table-column
            prop="dsOrderNumber"
            label="代理成功订单数量"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.agentOrderSuccessNum}}
          </div>
        </el-table-column>
        <el-table-column
            prop="payingCommisson"
            label="代收佣金"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.payingCommission}}
          </div>
        </el-table-column>
        <el-table-column
            prop="collectionCommission"
            label="到付佣金"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.collectionCommission}}
          </div>
        </el-table-column>
        <el-table-column
            prop="withdrawAmount"
            label="提现金额"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.withdrawAmount}}
          </div>
        </el-table-column>
        <el-table-column
            prop="freezeAmount"
            label="冻结金额"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.freezeAmount}}
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

<script>
  export default {
    data() {
      return {
        currentPage: 1,
        totalCount: 2,
        pageSizes: [1,5,10,15,30,50,100],
        pageSize: 1,
        filterbox: {
          pathChannelName: '',
          pathChannelLabelName: '',
          startTime: '',
          endTime: '',
        },
        totalbox: {
          income: "$10000000",
          withdraw: "$900",
          freeze: "$900",
        },
        reportInfoData: [
          {
            agentAccount: '代理商1',
            agentOrderSuccessNum: '1',
            payingCommission: '$10000000',
            collectionCommission: '$10000000',
            withdrawAmount: '$900',
            freezeAmount: '$900',
          }
        ],
        reportInfoData2: [
          {
            agentAccount: '代理商1',
            agentOrderSuccessNum: '1',
            payingCommission: '$10000000',
            collectionCommission: '$10000000',
            withdrawAmount: '$900',
            freezeAmount: '$900',
          },
          {
            agentAccount: '代理商2',
            agentOrderSuccessNum: '1',
            payingCommission: '$10000000',
            collectionCommission: '$10000000',
            withdrawAmount: '$900',
            freezeAmount: '$900',
          }
        ]
      }
    },
    methods: {
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        let pageSize = this.pageSize
        // 清空table绑定数据
        this.reportInfoData = []
        // 获取当前页数数据范围 。(当前页-1)*每页数据 - 当前页*每页数据
        this.reportInfoData = this.reportInfoData2.slice((((currentPage -1)*pageSize)), ((currentPage)*pageSize))
      },
    }
  }
</script>
<style scoped>
  .main-toolform-input {
    text-align: center;
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
    font-size: 40px;
    font-weight: bold;
    margin-left: 30px;
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
</style>