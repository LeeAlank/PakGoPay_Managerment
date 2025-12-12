<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">提现记录</div>
  <div class="main-toolbar" style="height: 100px;">
    <form class="main-toolform" style="height: 100%">
      <div class="main-toolform-item" style="height: 100%;">
        <div class="main-toolform-line">代理名称：<input v-model="filterbox.agentName"  type="text" class="main-toolform-input" placeholder="代理名称"/>
          <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
          <SvgIcon height="30px" width="30px" name="search"/>
          <div style="width: 50px;color: white">查询</div>
        </div>
          <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="reset"/>
            <div style="width: 50px;color: white">重置</div>
          </div>
          <div v-on:click="exportStatements()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="export"/>
            <div style="width: 50px;color: white">导出</div>
          </div>
          <div v-on:click="addWithdrawlAccount()" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="30px" name="add"/>
            <div style="width: 50px;color: white">新增</div>
          </div>
          <div v-on:click="createWithdrawlApply" style="width:100px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;background-color: deepskyblue">
            <SvgIcon height="30px" width="30px" name="withdrawl"/>
            <div style="width: 100px;color: white">提现申请</div>
          </div>
        </div>
      </div>
    </form>
  </div>

  <div style="display: flex;height: 12vh;justify-content: space-between;margin-right: 10%;margin-left: 10%;">
    <el-card style="width: 30%;height: 100%;margin-top: 1%;">
      <div style="display: flex;">
        <SvgIcon name="cash" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span class="reportLabel">总账户金额:</span>
          <textarea v-model="agentTotalAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
    <el-card style="width: 30%;height: 100%;margin-top: 1%;">
      <div style="display: flex;">
        <SvgIcon name="cash-freeze" width="100px" height="100px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span class="reportLabel">冻结总金额:</span>
          <textarea v-model="agentFreezeAmount" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
    <el-card style="width: 30%;height: 100%;margin-top: 1%;">
      <div style="display: flex;">
        <SvgIcon name="tixian" width="90px" height="90px"/>
        <div style="display: flex; flex-direction: column;width: 80%;">
          <span class="reportLabel">可用余额:</span>
          <textarea v-model="agentAvailableBalance" disabled class="cash-text-area"></textarea>
        </div>
      </div>
    </el-card>
  </div>

  <div class="main-views-container" style="height:70%">
    <form class="main-views-form" style="height: 100%">
      <el-table
          border :data="withdrawHistoryTableData"
          class="merchantInfos-table"
          style="width: 97%;height: 100%;"
      >
        <el-table-column
          v-slot="{row}"
          label="代理名称"
          align="center"
        >
          <div>{{row.agentName}}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="代理账号"
            align="center"
        >
          <div>{{row.agentAccount}}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="代理提现账户"
            align="center"
        >
          <div>{{row.agentWithdrawlAccount}}</div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="账号启用状态"
            align="center"
        >
          <div>
            <el-switch
              v-model="row.agentStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用"
              disabled
            />
          </div>
        </el-table-column>
        <el-table-column
            v-slot="{row}"
            label="录入时间"
            align="center"
        >
          <div>{{row.createTime}}</div>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          style="float:right; margin-right: 5%;"
      >

      </el-pagination>
    </form>
  </div>
</template>

<script>
export default {
  name: 'WithdrawlHistory',
  data() {
    return {
      filterbox: {
        agentName: '',
      },
      agentTotalAmount: '10',
      agentAvailableBalance: '0.1',
      agentFreezeAmount: '9.9',
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [5, 10, 15, 20],
    }
  }
}
</script>
<style scoped>
.cash-text-area {
  width: 90%;
  height: 100%;
  background-color: transparent;
  border: none;
  resize: none;
  font-size: xxx-large;
}

.reportLabel {
  font-size: xx-large;
}
</style>