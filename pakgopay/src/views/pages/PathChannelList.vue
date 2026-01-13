<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getFormateTime, getFormateTimeByTimeBystamp} from "@/api/common.js";
</script>

<template>
  <div class="main-title">通道列表</div>

  <el-collapse style="margin-top: 20px; width: 95%;margin-left: 2%;">
    <el-collapse-item>
      <template #title>
        <span class="toolbarName">
          工具栏
        </span>
      </template>
      <div class="main-toolbar" style="height: auto;">
        <el-form style="width: 100%">
          <el-row style="width: 100%;">
            <el-col :span="24">
              <div style="display: flex;flex-direction: row;justify-content: right;margin-right:20px">
                <div v-on:click="search()"
                     style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                  <SvgIcon height="30px" width="30px" name="search"/>
                  <div style="width: 50px;color: white">查询</div>
                </div>
                <div v-on:click="reset()"
                     style="background-color: red;width:60px;display: flex; flex-direction: row;justify-content: center;color: lightskyblue;cursor: pointer;align-items: center;">
                  <SvgIcon height="30px" width="30px" name="reset"/>
                  <div style="width: 50px;color: white">重置</div>
                </div>
                <div v-on:click="exportPathChannelInfos()"
                     style="background-color: deepskyblue;width:60px;display: flex; flex-direction: row;justify-content: center;cor: lightskyblue;cursor: pointer;align-items: center;">
                  <SvgIcon height="30px" width="30px" name="export"/>
                  <div style="width: 50px;color: white">导出</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row style="width: 100%;margin-top:10px">
            <div style="display: flex;flex-direction: row;width: 100%">
              <el-col :span="5">
                <el-form-item label="通道名称:" label-width="150px">
                  <input v-model="filterbox.pathChannelName" type="text" class="main-toolform-input"
                         placeholder="通道名称" style="width: 200px;height: 100%"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="支付类型:" label-width="150px">
                  <el-select v-model="filterbox.supportType" class="main-toolform-input" placeholder="支付方式"
                             :options="supportTypeOptions" style="width: 200px;height: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="通道类型:" label-width="150px">
                  <el-select v-model="filterbox.paymentType" class="main-toolform-input" placeholder="通道类型"
                             :options="paymentTypeOptions" style="width: 200px;height: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="通道状态:" label-width="150px">
                  <el-switch v-model="filterbox.status" placeholder="支付方式"
                             style="width: 200px;height: 100%"
                             active-color="#13ce66"
                             inactive-color="#ff4949"
                             active-text="启用"
                             inactive-text="停用"
                             :active-value="1"
                             :inactive-value="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="币种:" label-width="100px">
                  <el-select
                      style="width: 100px;align-items: center;text-align: center;"
                      :options="currencyOptions"
                      :props="currencyProps"
                      default-first-option
                      v-model="filterbox.currency"
                      filterable
                  />
                </el-form-item>
              </el-col>
            </div>

          </el-row>
        </el-form>
      </div>
    </el-collapse-item>
  </el-collapse>

  <div class="main-views-container" style="height: auto">
    <div class="main-views-form" style="height: 100%">
      <el-table
          border :data="PathChannelTableInfo"
          class="merchantInfos-table"
          style="width: 97%;height: 100%;"
          :key="tableKey"
      >
        <el-table-column
            prop="paymentNo"
            label="通道编号"
            v-slot="{row}"
            align="center"
            fixed="left"
            width="100px"
        >
          <div>
            {{ row.paymentNo }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentName"
            label="通道名称"
            v-slot="{row}"
            align="center"
            fixed="left"
            width="200px;"
        >
          <div>
            {{ row.paymentName }}
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
            prop="isThird"
            label="是否三方"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <div>
            {{ row.isThird === '0' ? '系统支付' : '三方支付' }}
          </div>
        </el-table-column>
        <el-table-column
            prop="supportType"
            label="支付类型"
            v-slot="{row}"
            align="center"
            width="100px"
        >
          <div>
            {{ (row.supportType === '0') ? '代收' : (row.supportType === '1') ? '代付' : '代收/代付' }}
          </div>
        </el-table-column>
        <el-table-column
            prop="enableTimePeriod"
            label="通道可用时间段"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
<!--            {{row.enableTimePeriod}}-->
            {{
              !row.enableTimePeriod ? 'all' : getFormateTimeByTimeBystamp(row.enableTimePeriod ? row.enableTimePeriod.split('/')[0] : '') + '-' + getFormateTimeByTimeBystamp(row.enableTimePeriod ? row.enableTimePeriod.split('/')[1] : '')
            }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentType"
            label="通道类型"
            v-slot="{row}"
            align="center"
            width="150px"
        >
          {{ row.paymentType === 1 ? 'app支付' : '银行卡支付' }}
        </el-table-column>
        <el-table-column
            prop="isCheckoutCounter"
            label="是否支持收银台"
            v-slot="{row}"
            align="center"
            width="200px"
        >
          <el-switch
              :model-value="row.isCheckoutCounter"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="支持"
              inactive-text="不支持"
              :active-value="1"
              :inactive-value="0"
          />
        </el-table-column>
        <el-table-column
            prop="collectionDailyLimit"
            label="通道代收日限额"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.collectionDailyLimit }}
          </div>
        </el-table-column>
        <el-table-column
            prop="collectionMonthlyLimit"
            label="通道代收月限额"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.collectionMonthlyLimit }}
          </div>
        </el-table-column>
        <el-table-column
            prop="payDailyLimit"
            label="通道代付日限额"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.payDailyLimit }}
          </div>
        </el-table-column>
        <el-table-column
            prop="payMonthlyLimit"
            label="通道代付月限额"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.payMonthlyLimit }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentRequestPayUrl"
            label="代付api地址"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentRequestPayUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentRequestCollectionUrl"
            label="代收api地址"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentRequestCollectionUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentCollectionRate"
            label="代收费率"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentCollectionRate }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentPayRate"
            label="代付费率"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentPayRate }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentCheckPayUrl"
            label="代付订单校验地址"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentCheckPayUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="paymentCheckCollectionUrl"
            label="代收订单校验地址"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.paymentCheckCollectionUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="collectionCallbackAddr"
            label="代收回调地址"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.collectionCallbackAddr }}
          </div>
        </el-table-column>
        <el-table-column
            prop="payCallbackAddr"
            label="代付回调地址"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.payCallbackAddr }}
          </div>
        </el-table-column>
        <el-table-column
            prop="checkoutCounterUrl"
            label="收银台地址"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
          <div>
            {{ row.checkoutCounterUrl }}
          </div>
        </el-table-column>
        <el-table-column
            prop="pathEachLimit"
            label="币种"
            v-slot="{row}"
            align="center"
            width="200px;"
        >
<!--          <el-select
            :options="currencyOptions"
            :props="currencyProps"
            :v-model="row.currency"
          >

          </el-select>-->
          {{this.currencyMaps[row.currency]}}
<!--          <div>
            {{ row.currency }}
          </div>-->
        </el-table-column>
        <!--        <el-table-column
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
        &lt;!&ndash;            {{row.pathChannelType}}&ndash;&gt;
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
                </el-table-column>-->
        <el-table-column
            prop="operate"
            label="操作"
            align="center"
            fixed="right"
            v-slot="{row}"
        >
          <el-dropdown trigger="click">
            <SvgIcon name="more" width="30" height="30"/>
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
    :title="paymentDetailDialogTitle"
    v-model="paymentDetailVisible"
    class="dialog"
    center="true"
    width="90%"
    style="height: 600px;align-content: center"
  >
    <el-form
        style="margin-top: 50px;width: 100%"
        :model="paymentDetailInfo"
    >
      <el-row style="width: 100%">
        <el-col :span="24">
          <el-form-item
              label="通道编号:"
              v-slot="{row}"
          >
            {{row}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
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
                />
              </el-select>
              <el-input style="width: 200px" v-if="createPathChannelInfo.payingType=== '三方支付' || showURL"
                        :model-value="createPathChannelInfo.payingURL" type="text" placeholder="input URL"/>
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
        <el-col v-if="createPathChannelInfo.pathChannelType==='2' || createPathChannelInfo.pathChannelType === '3'"
                :span="8">
          <div class="el-form-line">
            <el-form-item label="通道代付查询地址:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathPayingQueryUrl" style="width: 200px"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col v-if="createPathChannelInfo.pathChannelType==='1' || createPathChannelInfo.pathChannelType === '3'"
                :span="8">
          <div class="el-form-line">
            <el-form-item label="通道代收查询地址:" label-width="150px" size="medium">
              <el-input type="text" v-model="createPathChannelInfo.pathCollectingQueryUrl"
                        style="width: 200px"></el-input>
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
import {getAllCurrencyType, getPaymentInfo} from "@/api/interface/backendInterface.js";

export default {
  name: "PathChannelList",
  data() {
    return {
      currencyMaps: {},
      paymentDetailInfo: [
        {
          paymentId: '001',
          paymentNo: '#1',
          paymentName: '测试通道一',
          supportType: '1',
          isThird: '0',
          paymentPayRate: '0.02',
          paymentCollectionRate: '0.02',
          paymentRequestPayUrl: '/pakgopay/pay/',
          paymentRequestCollectionUrl: '/pakgopay/pay/',
          payCheckPayUrl: '/pakgopay/pay/',
          payCheckCollectionUrl: '/pakgopay/pay/',
          paymentMaxAmount: '20000',
          paymentMinAmount: '200',
          collectionDailyLimit: '100',
          collectionMonthlyLimit: '3000',
          payDailyLimit: '300',
          payMonthlyLimit: '9000',
          collectionInterfaceParam: '{"key":123,"value":123"}',
          payInterfaceParam: '{"key":123,"value":123"}',
          collectionCallbackAddr: 'http://chousabi',
          payCallbackAddr: 'http://chousabi2',
          currency: 'US',
          isCheckoutCounter: '1',
          checkoutCounterUrl: 'http://pakgopay/payPage',
          paymentType: '1',
          status: '1',
          enableTimePeriod: '1768285440/1768285444',
          paymentCheckPayUrl: 'http://pakgopay/pay/check',
          paymentCheckCollectionUrl: 'http://pakgopay/pay/checkCollection',
        }
      ],
      paymentDetailDialogTitle: '详情',
      paymentDetailVisible: false,
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
      supportTypeOptions: [
        {
          value: '0',
          label: '系统支付'
        },
        {
          value: '1',
          label: '三方支付'
        }
      ],
      paymentTypeOptions: [
        {
          value: '1',
          label: 'app支付'
        },
        {
          value: '2',
          label: '银行卡支付'
        }
      ],
      currency: '',
      currencyIcon: '',
      currencyIcons: [],
      currencyOptions: [],
      currencyProps: {
        value: 'currencyType',
        label: 'name'
      },
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
      PathChannelTableInfo: [
        /*{
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
        }*/
      ],
      PathChannelFormInfo: [
        /*{
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
          supportType: '1',
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
          supportType: '0',
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
          supportType: '2',
        }*/
        ],

      createPathChannelInfo: [],
    }
  },
  methods: {
    editPathChannelInfo(row) {
      /*this.createPathChannelInfo = []
      this.createPathChannelInfo = row
      this.createPathChannelInfo.pathEachMin = row.pathEachLimit.split(',')[0]
      this.createPathChannelInfo.pathEachMax = row.pathEachLimit.split(',')[1]
      this.dialogFormVisible = true
      this.pathChannelDialogTitle = '编辑通道信息'
      if(row.payingType === '1') {
        this.createPathChannelInfo.payingType = '系统支付'
      } else if(row.payingType === '2') {
        this.createPathChannelInfo.payingType = '三方支付'
      }*/
    },
    PathChannelDetailInfo(row) {
      this.paymentDetailVisible = true;
      this.paymentDetailInfo.push(row)
    },
    changeToolBar() {
      this.toolbarIsVisible = !this.toolbarIsVisible;
    },
    handleChange() {

      let startNum = (this.currentPage - 1) * this.pageSize
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
  async mounted() {
    await getAllCurrencyType().then(res => {
      if (res.status === 200) {
        if (res.data.code === 0) {
          this.currencyOptions = JSON.parse(res.data.data)
          this.currency = this.currencyOptions[0].currencyType
          this.filterbox.currency = this.currencyOptions[0].currencyType
          this.currencyIcons = {};
          this.currencyMaps = {};
          this.currencyOptions.forEach(currency => {
            this.currencyIcons[currency.currencyType] = currency.icon
            this.currencyMaps[currency.currencyType] = currency.name
          })
          let iconKey = this.currency;
          this.currencyIcon = this.currencyIcons[iconKey]
        }
      }
    })

    await getPaymentInfo(this.filterbox).then(res => {
       console.log('payment----'+JSON.stringify(res))
    })
    this.filterbox.status = 1
    //this.PathChannelTableInfo = this.paymentDetailInfo
    this.totalCount = this.PathChannelTableInfo.length;
    this.tableKey++;
  }
}
</script>
<style scoped>
@import "@/assets/base.css";
@import "@/api/common.css";
</style>
<style>
.dialog-footer {
  display: flex;
  justify-content: right;
  float: right;
}

:deep().el-table th.is-leaf {

  background-color: lightskyblue;
  color: white;
  font-weight: bold;
  font-size: larger;
}
</style>