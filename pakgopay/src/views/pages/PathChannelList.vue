<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">通道列表</div>

  <div class="main-toolbar" style="height: 120px;">
    <form class="main-toolform">
      <div class="main-toolform-item">
<!--        <div class="main-toolform-line" style="justify-content: left; margin-left: 4%;cursor: pointer;background-color: lightskyblue;width: 5%;height: 30px;">
          <el-button @click="changeToolBar">关闭搜索</el-button>
        </div>-->
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
      <div v-if="toolbarIsVisible" class="main-toolform-item">
        <div class="main-toolform-line" style="display:flex;justify-content: space-between;margin-right: 4%;margin-top: 50px;margin-left: 4%;">
          <div style="height: 100%;">通道名称：<input v-model="filterbox.pathChannelName"  type="text"  class="main-toolform-input" placeholder="通道名称"/></div>
          <div style="height: 100%;">通道编号：<input v-model="filterbox.pathChannelNO"  type="text" class="main-toolform-input" placeholder="通道编号"/></div>
          <div style="height: 100%;">
            启用状态:
            <el-select v-model="filterbox.pathChannelStatus" style="width: 180px;" placeholder="select path status">
              <el-option v-for="item in filterbox.pathChannelStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
      </div>
    </form>
  </div>

  <div class="main-views-container" style="height: auto">
    <div class="main-views-form" style="height: 100%">
      <el-table
          border :data="PathChannelTableInfo"
          class="merchantInfos-table"
          style="width: 97%;height: 100%;"
          :key="tableKey"
      >
        <el-table-column
            prop="pathChannelID"
            label="通道编号"
            v-slot="{row}"
            align="center"
            fixed="left"
            width="200px"
        >
          <div>
            {{row.pathChannelID}}
          </div>
        </el-table-column>
        <el-table-column
          prop="pathChannelName"
          label="通道名称"
          v-slot="{row}"
          align="center"
          fixed="left"
          width="200px;"
        >
          <div>
            {{row.pathChannelName}}
          </div>
        </el-table-column>
        <el-table-column
          prop="pathChannelIncome"
          label="通道收益"
          v-slot="{row}"
          align="center"
          width="200px"
        >
          <div>
            {{row.pathChannelIncome}}
          </div>
        </el-table-column>
        <el-table-column
            prop="payingType"
            label="支付方式"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
<!--            {{row.payingType === '1' ? '系统支付' : '三方支付'}}-->
            <el-select
              v-model="row.payingType"
              style="width: 100px;background-color: white;"
              suffix-icon=""
              disabled
            >
              <el-option
                v-for="item in payingTypeOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </div>
        </el-table-column>
        <el-table-column
            prop="pathDayLimit"
            label="通道日限额"
            v-slot="{row}"
            align="center"
            width="80px;"
        >
          <div>
            {{row.pathDayLimit}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathMonthLimit"
            label="通道月限额"
            v-slot="{row}"
            align="center"
            width="150px;"
        >
          <div>
            {{row.pathMonthLimit}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathEachLimit"
            label="通道单笔上下限制"
            v-slot="{row}"
            align="center"
            width="150px;"
        >
          <div>
            {{row.pathEachLimit}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelStatus"
            label="通道状态"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            <el-switch
              v-model="row.pathChannelStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用"
              disabled
            ></el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelOpenTime"
            label="通道开启时间"
            v-slot="{row}"
            align="center"
            width="150px;"
        >
          <div>
            {{row.pathChannelOpenTime}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelCloseTime"
            label="通道关闭时间"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
            {{row.pathChannelCloseTime}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelSpending"
            label="通道支出"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            {{row.pathChannelSpending}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelCurrencyType"
            label="通道币种"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div>
            {{row.pathChannelCurrencyType}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelRate"
            label="通道费率"
            v-slot="{row}"
            align="center"
            width="80px"
        >
          <div>
            {{row.pathChannelRate}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelType"
            label="通道类型"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          <div>
<!--            {{row.pathChannelType}}-->
            <el-select
              v-model="row.pathChannelType"
              style="width: 100px;"
              suffix-icon=""
              disabled
            >
              <el-option
                v-for="item in pathChannelTypeOptions"
                :label="item.label"
                :key="item.key"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-table-column>
        <el-table-column
            prop="operate"
            label="操作"
            align="center"
            fixed="right"
            v-slot="{row}"
        >
          <el-dropdown trigger="click">
            <SvgIcon name="more" width="30" height="30" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="editPathChannelInfo(row)">编辑</el-dropdown-item>
                <el-dropdown-item @click="PathChannelDetailInfo(row)">详情</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

  <el-dialog
      :title="pathChannelDialogTitle"
      v-model="dialogFormVisible"
      class="dialog"
      center="true"
      width="90%"
      style="height: 600px;align-content: center"
  >
    <el-form style="margin-top: 50px;width: 100%">
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道名称:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathChannelName" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="支付方式:" label-width="150px" size="medium">
              <el-select v-model="createPathChannelInfo.payingType"
                style="width: 200px" placeholder="select payingType"
                @change="handlePayingTypeChange"
              >
                <el-option
                  v-for="item in payingTypeOptions"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                /></el-select>
              <el-input style="width: 200px" v-if="createPathChannelInfo.payingType=== '三方支付' || showURL" :model-value="createPathChannelInfo.payingURL" type="text" placeholder="input URL"/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道日限额:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathDayLimit" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道月限额:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathMonthLimit" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道单笔下限:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathEachMin" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道单笔上限:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathEachMax" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="是否启用通道:" label-width="150px" size="medium">
              <el-switch
                  v-model="createPathChannelInfo.pathChannelStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="启用"
                  inactive-text="停用"
              >
              </el-switch>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道币种:" label-width="150px" size="medium">
              <el-select
                  v-model="createPathChannelInfo.pathChannelCurrencyType"
                  style="width: 200px"
                  placeholder="select currency type"
              >
                <el-option
                    v-for="item in pathChannelCurrencyTypeOptions"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道费率:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathChannelRate" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道类型:" label-width="150px" size="medium">
              <el-select
                  v-model="createPathChannelInfo.pathChannelType"
                  style="width: 200px"
                  placeholder="select path type"
              >
                <el-option
                    v-for="item in pathChannelTypeOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="支付频率/min:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathChannelRate" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道回调地址:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathReturnUrl" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道余额查询地址:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathBalanceQueryUrl" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col v-if="createPathChannelInfo.pathChannelType==='2' || createPathChannelInfo.pathChannelType === '3'"  :span="8">
          <div class="el-form-line">
            <el-form-item label="通道代付查询地址:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathPayingQueryUrl" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col v-if="createPathChannelInfo.pathChannelType==='1' || createPathChannelInfo.pathChannelType === '3'" :span="8">
          <div  class="el-form-line">
            <el-form-item label="通道代收查询地址:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathCollectingQueryUrl" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="谷歌验证码:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.googleCode" style="width: 200px"/>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" style="float: right;">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "PathChannelList",
  data() {
    return {
      showURL: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [1, 10, 20, 30, 40],
      tableKey: 0,
      toolbarIsVisible: true,
      pathChannelDialogTitle: "",
      dialogFormVisible: false,
      pathChannelTypeOptions: [
        {
          value: '1',
          label: '代收'
        },
        {
          value: '2',
          label: '代付'
        },
        {
          value: '3',
          label: '代收/代付'
        }
      ],
      pathChannelCurrencyTypeOptions: [
        {
          value: 1,
          label: '脚盆鸡币'
        },
        {
          value: 2,
          label: '大不列颠币'
        }
      ],
      payingTypeOptions: [
        {
          value: '1',
          label: '系统支付'
        },
        {
          value: '2',
          label: '三方支付'
        }
      ],
      filterbox: {
        pathChannelNO: '',
        pathChannelName: '',
        pathChannelStatus: '',
        pathChannelStatusOptions: [
          {
            value: '1',
            label: '已启用'
          },
          {
            value: '0',
            label: '未启用'
          }
        ]
      },
      PathChannelTableInfo: [{
        pathChannelID: '',
        pathChannelName: '',
        pathChannelIncome: '',
        payingType: '',
        pathDayLimit: '',
        pathMonthLimit: '',
        pathEachLimit: '',
        pathChannelStatus: '',
        pathChannelOpenTime: '',
        pathChannelCloseTime: '',
        pathChannelSpending: '',
        pathChannelCurrencyType: '',
        pathChannelRate: '',
        pathChannelType: '',
      }],
      PathChannelFormInfo: [{
        pathChannelID: '1234',
        pathChannelName: '预置通道一',
        pathChannelIncome: '200000000',
        payingType: '1',
        pathDayLimit: '1000',
        pathMonthLimit: '30000',
        pathEachLimit: '300,1000',
        pathChannelStatus: true,
        pathChannelOpenTime: '2025-12-01',
        pathChannelCloseTime: '2025-12-11',
        pathChannelSpending: '1000',
        pathChannelCurrencyType: 'HK',
        pathChannelRate: '0.2%',
        pathChannelType: '2',
      },
        {
          pathChannelID: '1234567',
          pathChannelName: '预置通道二',
          pathChannelIncome: '9999999',
          payingType: '2',
          pathDayLimit: '10000',
          pathMonthLimit: '300000',
          pathEachLimit: '3000,10000',
          pathChannelStatus: true,
          pathChannelOpenTime: '2025-12-01',
          pathChannelCloseTime: '2025-12-21',
          pathChannelSpending: '999',
          pathChannelCurrencyType: 'US',
          pathChannelRate: '0.1%',
          pathChannelType: '1',
        },
        {
          pathChannelID: '9527',
          pathChannelName: '预置通道三',
          pathChannelIncome: '120000000',
          payingType: '2',
          pathDayLimit: '10000',
          pathMonthLimit: '300000',
          pathEachLimit: '3000,10000',
          pathChannelStatus: true,
          pathChannelOpenTime: '2025-12-01',
          pathChannelCloseTime: '2025-12-21',
          pathChannelSpending: '999',
          pathChannelCurrencyType: 'US',
          pathChannelRate: '0.1%',
          pathChannelType: '3',
        }],

      createPathChannelInfo: [],
    }
  },
  methods: {
    editPathChannelInfo(row) {
      this.createPathChannelInfo = []
      this.createPathChannelInfo = row
      this.createPathChannelInfo.pathEachMin = row.pathEachLimit.split(',')[0]
      this.createPathChannelInfo.pathEachMax = row.pathEachLimit.split(',')[1]
      this.dialogFormVisible = true
      this.pathChannelDialogTitle = '编辑通道信息'
      if(row.payingType === '1') {
        this.createPathChannelInfo.payingType = '系统支付'
      } else if(row.payingType === '2') {
        this.createPathChannelInfo.payingType = '三方支付'
      }
    },
    PathChannelDetailInfo(row) {

    },
    changeToolBar() {
      this.toolbarIsVisible = !this.toolbarIsVisible;
    },
    handleChange() {

      let startNum = (this.currentPage-1) * this.pageSize
      let endNum = startNum + this.pageSize
      if (this.PathChannelFormInfo.length <= endNum) {
        endNum = this.PathChannelFormInfo.length
      }
      this.PathChannelTableInfo = []
      for (let i = startNum; i < endNum; i++) {
        this.PathChannelTableInfo.push(this.PathChannelFormInfo[i])
      }
      this.tablekey++
    },
    handleSizeChange() {
      this.currentPage = 1
      this.PathChannelTableInfo = []
      let circleSize = this.pageSize > this.PathChannelFormInfo.length ? this.PathChannelFormInfo.length : this.pageSize
      for (let i = 0; i < circleSize; i++) {
        this.PathChannelTableInfo.push(this.PathChannelFormInfo[i])
      }

      this.tablekey++;
    },
    cancelDialog() {
      this.dialogFormVisible = false
      this.createPathChannelInfo = []
      this.pathChannelDialogTitle = ''
    },
    createPathChannel() {
      this.dialogFormVisible = true
      this.pathChannelDialogTitle = '创建通道'
    },
    handlePayingTypeChange(val) {
      if (val === '2') {
        this.showURL = true;
      }
    }
  },
  mounted() {
    let beforeData = [
      {
        pathChannelID: '1234',
        pathChannelName: '预置通道一',
        pathChannelIncome: '200000000',
        payingType: '系统支付',
        pathDayLimit: '1000',
        pathMonthLimit: '30000',
        pathEachLimit: '300',
        pathChannelStatus: true,
        pathChannelOpenTime: '2025-12-01',
        pathChannelCloseTime: '2025-12-11',
        pathChannelSpending: '1000',
        pathChannelCurrencyType: 'HK',
        pathChannelRate: '0.2%',
        pathChannelType: '代付',
      }
    ]
    this.PathChannelTableInfo = this.PathChannelFormInfo;
    this.totalCount = this.PathChannelTableInfo.length;
    this.tableKey++;
  }
}
</script>
<style scoped>

</style>
<style>
.dialog-footer{
  display: flex;
  justify-content: right;
  float: right;
}

</style>