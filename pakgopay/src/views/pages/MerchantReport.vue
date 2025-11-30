
<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>
<script>
import '@/api/common.css'
export default {
  data() {
    return {
      filterbox: {
        merchantNum: '',
        merchantAccount: '',
        startTime: '',
        endTime: '',
      },
      reportTitle : '代收订单订单总数｜代收订单成功率｜代收订单成功数｜代付订单总数｜代收订单成功率｜代收订单成功数｜代收/付商户手续费｜一二三级代理佣金｜代收/付总利润'
    }
  },
  methods: {
    exportMerchantInfo() {
      //导出报表方法
    }
  }
}
</script>
<template>
  <div class="title">
    商户报表
  </div>
  <div class="toolbar">
    <form class="toolform">
      <div style="display:flex;justify-content: right;">
        <div v-on:click="exportMerchantInfo" style="display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;border:solid 1px #6495ed;border-radius: 10px;">
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
        <div v-on:click="exportMerchantInfo" style="display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;padding-right: 80px;align-items: center;">
          <SvgIcon height="20px" width="20px" name="export"/>导出
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
      <el-table border :data="reportInfo" class="reportInfo-table">
        <el-table-column
          prop="dsOrderNumber"
          label="代收订单总数"
        >
        </el-table-column>
        <el-table-column
            prop="dsOrderNumber"
            label="代收订单总数"
        >
        </el-table-column>
        <el-table-column
            prop="dsOrderNumber"
            label="代收订单总数"
        >
        </el-table-column>
        <el-table-column
            prop="dsOrderNumber"
            label="代收订单总数"
        >
        </el-table-column>
        <el-table-column
            prop="dsOrderNumber"
            label="代收订单总数"
        >
        </el-table-column>
        <el-table-column
            prop="dsOrderNumber"
            label="代收订单总数"
        >
        </el-table-column>
          <el-table-column
              prop="dsOrderNumber"
              label="代收订单总数"
          >
          </el-table-column>
            <el-table-column
                prop="dsOrderNumber"
                label="代收订单总数"
            >
            </el-table-column>
              <el-table-column
                  prop="dsOrderNumber"
                  label="代收订单总数"
              >
              </el-table-column>
      </el-table>
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
    height: 18%;
    width: 96%;
    border-radius: 15px;
    overflow: auto;
  }

  .toolform{
    margin-left: 1%;
    padding: 10px;
  }

  .toolform-item{
    margin-top: 1%;
    margin-right: 2%;
    margin-left: 2%;
    display: flex;
    justify-content: space-between;
  }

  .toolform-input{
    background-color: transparent;
    border: solid 1px #6495ed;
    height: 30px;
    width: 300px;
    border-radius: 10px;
  }

  .toolform-line {
    height: 50px;
    display: inline;
    width: 100%;
    align-items: center;
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
     margin-left: 50px;
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
  }

  .reportInfoForm {
    height: 100%;
  }

  .reportInfo-table{
    height: 100%;
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