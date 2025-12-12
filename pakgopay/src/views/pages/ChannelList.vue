<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
<div class="main-title">渠道列表</div>

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
      <div class="main-toolform-item">
        <div class="main-toolform-line" style="display:flex;justify-content: space-between;margin-right: 4%;margin-top: 50px;margin-left: 4%;">
          <div style="height: 100%;">通道名称：<input v-model="filterbox.channelName"  type="text"  class="main-toolform-input" placeholder="通道名称"/></div>
          <div style="height: 100%;">通道编号：<input v-model="filterbox.channelID"  type="text" class="main-toolform-input" placeholder="通道编号"/></div>
          <div style="height: 100%;">
            启用状态:
            <el-select v-model="filterbox.channelStatus" style="width: 180px;" placeholder="select path status">
              <el-option v-for="item in filterbox.channelStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </div>
      </div>
    </form>
  </div>

  <div class="main-views-container" style="height: auto">
    <div class="main-views-form" style="height: 80%">
      <el-table
          border :data="channelTableInfo"
          class="merchantInfos-table"
          style="width: 97%;height: 100%;"
          :key="tableKey"
      >
        <el-table-column
            prop="channelID"
            label="渠道编号"
            v-slot="{row}"
            align="center"
            fixed="left"
            width="100px"
        >
          <div>
            {{row.channelID}}
          </div>
        </el-table-column>
        <el-table-column
            prop="channelName"
            label="渠道名称"
            v-slot="{row}"
            align="center"
            fixed="left"
            width="200px"
        >
          <div>
            {{row.channelName}}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathChannelList"
            label="通道列表"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            <el-card v-for="item in row.pathChannelList" class="merchantInfos-table">
              <div>通道编号:{{item.pathChannelID}}</div>
              <div>通道名称:{{item.pathChannelName}}</div>
            </el-card>
          </div>
        </el-table-column>
        <el-table-column
            prop="channelRate"
            label="渠道费率"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div>
            {{row.channelRate}}
          </div>
        </el-table-column>
        <el-table-column
            prop="channelStatus"
            label="启用状态"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            <el-switch
              v-model="row.channelStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用"
              disabled
            >
            </el-switch>
          </div>
        </el-table-column>
        <el-table-column
            prop="channelAccountBalance"
            label="渠道账户余额"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            {{row.channelAccountBalance}}
          </div>
        </el-table-column>
        <el-table-column
            prop="supportCurrencyType"
            label="支持币种"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            <div v-for="item in row.supportCurrencyType">
              {{item}};
            </div>
          </div>
        </el-table-column>
        <el-table-column
            prop="operation"
            label="操作"
            v-slot="{row}"
            align="center"
            fixed="right"
            width="200px"
        >
          <div>
            <el-dropdown trigger="click">
              <SvgIcon name="more" width="30" height="30" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editChannelInfo(row)">编辑</el-dropdown-item>
                  <el-dropdown-item @click="stopChannel(row)">停用</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
          style="float:right; margin-right: 5%;"
          @current-change="handleChange"
          @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
  <el-dialog
      :title="channelDialogTitle"
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
            <el-form-item label="渠道名称:" label-width="150px" size="medium">
              <el-input type="text" v-model="createChannelInfo.channelName" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="通道列表:" label-width="150px" size="medium">
              <el-select
                  v-model="createChannelInfo.selectedPathChannelList"
                  @change="handleChange"
                  multiple
                  style="width: 200px"
              >
                <el-option
                  v-for="item in pathChannelListOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="渠道费率:" label-width="150px" size="medium">
              <el-input type="text" v-model="createChannelInfo.channelRate" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="启用状态:" label-width="150px" size="medium">
              <el-switch
                  v-model="createChannelInfo.channelStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="启用"
                  inactive-text="停用"
              ></el-switch>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="渠道账户余额:" label-width="150px" size="medium">
              <el-input type="text" v-model="createChannelInfo.channelAccountBalance" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="支持币种:" label-width="150px" size="medium">
              <el-input type="text" v-model="createChannelInfo.supportCurrencyType" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="el-form-line">
            <el-form-item label="谷歌验证码" label-width="150px" size="medium">
              <el-input type="text" v-model="createChannelInfo.googleCode" style="width: 200px" placeholder="input google verify code"/>
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
  name: 'ChannelList',
  data() {
    return {
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      filterbox: {
        channelName: '',
        channelID: '',
        channelStatus: '',
        channelStatusOptions: [
          {
            value: '1',
            label: '启用',
          },
          {
            value: '2',
            label: '停用'
          }
        ]
      },
      /** 此下拉菜单选项需要调用接口从后端实时获取 */
      pathChannelListOptions: [
        {
          value: '001', /** 对应通道编号 */
          label: '通道一' /** 对应通道名称 */
        },
        {
          value: '002', /** 对应通道编号 */
          label: '通道二' /** 对应通道名称 */
        }
      ],
      channelTableInfo: [
        {
          channelID: 1,
          channelName: '预置渠道一',
          pathChannelList: [{
            pathChannelID: '001',
            pathChannelName: '通道一',
          },
            {
              pathChannelID: '002',
              pathChannelName: '通道二',
            }],
          channelRate: '0.5%',
          channelStatus: true,
          channelAccountBalance: '102',
          supportCurrencyType: ['脚盆鸡','大不列颠'],
        }
      ],
      channelFormInfo: [],
      createChannelInfo: {},
      tableKey: 0,
      dialogFormVisible: false,
      channelDialogTitle: ''
    }
  },
  methods: {
    handleSizeChange(val) {

    },
    handleChange(val) {

    },
    editChannelInfo(row) {
      this.createChannelInfo = row;
      this.createChannelInfo.selectedPathChannelList = []
      row.pathChannelList.forEach(item => {
        this.createChannelInfo.selectedPathChannelList.push(item.pathChannelID)
      })
      this.dialogFormVisible = true;
      this.channelDialogTitle = '编辑渠道'
      this.tableKey++
    },
    stopChannel(row) {
    },
    createPathChannel() {
      this.dialogFormVisible = true;
      this.channelDialogTitle = '新增渠道'
    },
    cancelDialog() {
      this.dialogFormVisible = false;
      this.createChannelInfo = {}
      this.channelDialogTitle = ''
    }
  }
}
</script>
<style scoped>

</style>