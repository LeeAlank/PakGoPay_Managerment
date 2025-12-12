<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-views-container">
    <div class="main-title">
      提现订单
    </div>
    <!-- 工具栏 -->
    <el-collapse style="margin-top: 20px; width: 95%;margin-left: 2%;">
      <el-collapse-item>
        <template #title>
        <span class="toolbarName">
          工具栏
        </span>
        </template>
        <div class="main-toolbar" style="height: 150px;width: 97%;">
          <el-form class="main-toolform" style="height: 100%;">
            <!--          <el-row style="margin-right: 1%">
                        <el-col :span="24">
                          <div class="main-toolform-item">
                            &lt;!&ndash;        <div class="main-toolform-line" style="justify-content: left; margin-left: 4%;cursor: pointer;background-color: lightskyblue;width: 5%;height: 30px;">
                                      <el-button @click="changeToolBar">关闭搜索</el-button>
                                    </div>&ndash;&gt;
                            <div class="main-toolform-line" style="justify-content: right;margin-right: 4%;">
                              <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                                <SvgIcon height="30px" width="30px" name="search"/>
                                <div style="width: 50px;color: white">查询</div>
                              </div>
                              <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                                <SvgIcon height="30px" width="30px" name="reset"/>
                                <div style="width: 50px;color: white">重置</div>
                              </div>
                              <div v-on:click="exportPathChannelInfos()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
                                <SvgIcon height="30px" width="30px" name="export"/>
                                <div style="width: 50px;color: white">导出</div>
                              </div>
                              <div v-on:click="createPathChannel()" style="background-color: limegreen;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
                                <SvgIcon height="30px" width="30px" name="add"/>
                                <div style="width: 50px;color: white">新增</div>
                              </div>
                            </div>
                          </div>
                        </el-col>
                      </el-row>-->
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单状态：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.orderStatus" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单编号：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.orderId" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单渠道：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.orderChannel" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商户编号：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.merchantAccount" style="width: 200px"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="商户名称：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.merchantName" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单类型：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.orderType" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.createTime"style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="商户代理：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.merchantAgent" style="width: 200px"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="币种：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.currencyType" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="订单金额：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.orderAmount" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="平台订单号：" label-width="150px" size="medium">
                  <el-input v-model="filterbox.platformOrderId" style="width: 200px"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div style="width: auto; display: flex; flex-direction: row;justify-content: center">
                  <div v-on:click="search()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="30px" name="search"/>
                    <div style="width: 50px;color: white">查询</div>
                  </div>
                  <div v-on:click="reset()" style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="30px" name="reset"/>
                    <div style="width: 50px;color: white">重置</div>
                  </div>
                  <div v-on:click="exportPathChannelInfos()" style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="30px" name="export"/>
                    <div style="width: 50px;color: white">导出</div>
                  </div>
                  <div v-on:click="exportPathChannelInfos()" style="width:100px;background-color: deepskyblue;width:90px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
                    <SvgIcon height="30px" width="22px" name="export"/>
                    <div style="width: 60px;height:30px;color: white;display: flex;justify-content: center;align-items: center">导出历史</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 统计信息 -->
    <div>
      <div style="display: flex; justify-content: space-between;">
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-left: 3%;">
          <div style="display: flex;">
            <SvgIcon name="orderNum" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">订单总数:</span>
              <textarea v-model="staticsData.orderTotalCount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;">
          <div style="display: flex;">
            <SvgIcon name="merchantCommission" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">商户手续费:</span>
              <textarea v-model="staticsData.merchantCommission" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-right: 4%;">
          <div style="display: flex;">
            <SvgIcon name="freezeAmount" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">冻结金额:</span>
              <textarea v-model="staticsData.merchantFreezeAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-left: 3%;">
          <div style="display: flex;">
            <SvgIcon name="orderSuccessRate" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">订单成功率:</span>
              <textarea v-model="staticsData.ordereSuccessRate" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;">
          <div style="display: flex;">
            <SvgIcon name="effectiveCommission" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%">
              <span class="statics-title">商户有效手续费:</span>
              <textarea v-model="staticsData.merchantEffectiveCommission" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
        <el-card style="width: 28%;height: 100%;margin-top: 1%;margin-right: 4%;">
          <div style="display: flex;justify-content: space-between">
            <SvgIcon name="accountBalance" width="100px" height="100px"/>
            <div style="display: flex; flex-direction: column;width: 80%;margin-left: 2%;justify-content: space-between;">
              <span class="statics-title">可用金额:</span>
              <textarea v-model="staticsData.merchantAvaiableAmount" disabled class="cash-text-area"></textarea>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="main-views-container" style="width:auto;height: auto;">
      <div class="main-views-form" style="width: auto;height:100%;">
        <div style="display: flex; align-items: center;justify-content: right;margin-right: 3%;margin-bottom: 5px;">
          <div v-on:click="createPathChannel()" style="background-color: deepskyblue;width:100px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="22px" name="createOrder"/>
            <div style="width: 80px;height:30px;color: white;display: flex;align-items: center">创建订单</div>
          </div>
          <div v-on:click="createPathChannel()" style="background-color: limegreen;width:100px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
            <SvgIcon height="30px" width="22px" name="callBack"/>
            <div style="width: 80px;height:30px;color: white;display: flex;align-items: center">批量回调</div>
          </div>
        </div>
        <el-table
            border :data="withdrawlOrderTableInfo"
            class="merchantInfos-table"
            style="width: 97%;height: 95%;"
            :key="tableKey"
        >
          <el-table-column
              prop="orderId"
              label="订单号"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.orderId}}</div>
          </el-table-column>
          <el-table-column
              prop="orderStatus"
              label="订单状态"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.orderStatus}}</div>
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.createTime}}</div>
          </el-table-column>
          <el-table-column
              prop="applyer"
              label="申请人"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.applyer}}</div>
          </el-table-column>
          <el-table-column
              prop="currencyType"
              label="处理状态"
              v-slot="{row}"
              align="center"
          >
            <div>{{row.resolveStatus}}</div>
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
            @current-change="handleChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WithdrawlOrder",
  data() {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40],
      tableKey: 0,
      filterbox: {
        orderStatus: '',
        orderId: '',
        orderChannel: '',
        merchantAccount: '',
        merchantName: '',
        orderType: '',
        createTime: '',
        merchantAgent: '',
        currencyType: '',
        orderAmount: '',
        platformOrderId: '',
      },
      staticsData: {
        orderTotalCount: 10000,
        ordereSuccessRate: '99.9%',
        merchantCommission: 100000,
        merchantEffectiveCommission: 99990,
        merchantFreezeAmount: 1000,
        merchantAvaiableAmount: 99000,
      },
      withdrawlOrderTableInfo: [],
      withdrawlOrderFormInfo: []
    }
  },
  methods: {
    handleChange(currentPage) {
      this.collectingOrderTableInfo = []
      let startNum = (currentPage - 1) * this.pageSize;
      let endNum = (startNum + this.pageSize) <= this.totalCount ? (this.pageSize + startNum) : this.totalCount
      for (let i = startNum; i < endNum; i++) {
        this.collectingOrderTableInfo.push(this.collectingOrderFormInfo[i])
      }
    },
    handleSizeChange(currentPageSize) {
      this.collectingOrderTableInfo = []
      let startNum = (this.currentPage - 1) * currentPageSize;
      let endNum = (startNum + currentPageSize) <= this.totalCount ? (currentPageSize + startNum) : this.totalCount
      for (let i = startNum; i < endNum; i++) {
        this.collectingOrderTableInfo.push(this.collectingOrderFormInfo[i])
      }
    },
  },
  mounted() {
    this.withdrawlOrderTableInfo = this.withdrawlOrderFormInfo;
    this.totalCount = this.withdrawlOrderTableInfo.length;
    if (this.totalCount===0) {
      return;
    }
    this.handleChange(this.currentPage);
    this.tableKey++
  }
}
</script>
<style scoped>

</style>