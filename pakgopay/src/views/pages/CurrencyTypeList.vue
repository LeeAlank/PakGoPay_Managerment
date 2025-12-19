<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
 <div class="main-title">{{ this.$t('route.currencyTypeList') }}</div>


 <div class="toolbar" style="width: 96%">
      <el-row style="display: flex;justify-content: space-between;">
        <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
          <template #label>
            <span>币种:</span>
          </template>
          <el-select
              v-model="filterbox.selectedCurrency"
              placeholder="请选择币种"
              size="medium"
              style="width: 150px;"
          >
            <el-option
                v-for="item in currencyOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
            />
          </el-select>
          <el-button @click="search" style="color: deepskyblue">搜索</el-button>
        </el-form-item>
      </el-row>
    </div>

  <div class="main-views-container">
    <div style="width: 96%;display:flex;justify-content: right;">
      <el-button @click="createNewCurrency"><SvgIcon name="add"/>新增</el-button>
    </div>
    <el-form>
      <el-table
        :data="currencyTypeData"
        border
        style="height: 800px;width: 96%"
      >
        <el-table-column
          label="币种名称"
          align="center"
          v-slot="{row}">
          <div>{{row.currencyEnName}}</div>
        </el-table-column>
        <el-table-column
            label="币种符号"
            align="center"
            v-slot="{row}">
          <div>{{row.currencyIcon}}</div>
        </el-table-column>
        <el-table-column
            label="币种单位"
            align="center"
            v-slot="{row}">
          <div>{{row.currencyAccuracy}}</div>
        </el-table-column>
        <el-table-column
            label="对USDT汇率"
            align="center"
            v-slot="{row}">
          <div>{{row.exchangeRateForUSTD}}</div>
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
          @size-change="handlePageSizeChange"
          style="float:right; margin-right: 5%;"
      >
      </el-pagination>
    </el-form>
    <el-dialog
        :title="dialogTitle"
        v-model="dialogFormVisible"
        class="dialog"
        center="true"
        width="40%"
        style="height: 450px;"
        @closed="cancelDialog"
    >
      <el-form style="margin-top: 50px;" :model="addCurrencyTypeInfo" :rules="rules" ref="addCurrencyTypeInfo">
        <div class="el-form-line">
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item label="币种简称:" label-width="150px" size="medium" prop="currencyEnName">
                <el-input style="width: 200px;" v-model="addCurrencyTypeInfo.currencyEnName"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item label="币种符号:" label-width="150px" size="medium" prop="currencyIcon">
                <el-input type="number" v-model="addCurrencyTypeInfo.currencyIcon" style="width: 200px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item label="币种最小单位:" label-width="150px" size="medium" prop="currencyAccuracy" style="display: flex;flex-direction: row;">
                <div style="display: grid;align-items: center;justify-content: center;">
                  <el-input type="number" v-model="addCurrencyTypeInfo.currencyAccuracy" style="width: 200px;">
                  </el-input>
                  <div style="color: red;display: flex;flex-direction: row;width: 150px;align-items: center;height: 12px">
                    <SvgIcon style="width: 12px;height: 12px;" name="notice2"/>
                    <div style="font-size:12px">
                      输入提示:0.xxxx
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item label="对USDT汇率模式:" label-width="150px" size="medium" prop="exchangeRateForUSDTType" style="display: flex;flex-direction: row">
                <el-select v-model="addCurrencyTypeInfo.exchangeRateForUSDTType" style="width: 200px;text-align: center">
                  <el-option
                    v-for="item in exchangeRateOptions"
                    :label="item.label"
                    :key="item.value"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="addCurrencyTypeInfo.exchangeRateForUSDTType === 2">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item label="对USDT汇率:" label-width="150px" size="medium" prop="exchangeRateForUSDT">
                <el-input type="number" v-model="addCurrencyTypeInfo.exchangeRateForUSDT" style="width: 200px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item label="谷歌验证码:" label-width="150px" size="medium" prop="googleCode">
                <el-input oninput="if(value.length>6)value=value.slice(0,6)" type="number" v-model="addCurrencyTypeInfo.googleCode" placeholder="input google verify code" style="width: 200px"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="submit('addCurrencyTypeInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CurrencyTypeList',
  data() {

    const validateExchangeRate = (rule, value, callback) => {
      if (this.addCurrencyTypeInfo.exchangeRateForUSDTType === 2 && (value === '' || value === undefined)) {
        callback(new Error('固定汇率模式下对USTD汇率为必填项'))
      } else {
        callback()
      }
    };
    return {
      dialogFormVisible: false,
      dialogTitle: '',
      addCurrencyTypeInfo: {},
      currencyOptions: [
        {
          value: 1,
          label: '马币'
        },
        {
          value: 2,
          label: '美元'
        }
      ],
      filterbox: {

      },
      exchangeRateOptions: [
        {
          value: 1,
          label: '实时汇率'
        },
        {
          value: 2,
          label: '固定汇率'
        }
      ],
      rules: {
        currencyEnName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        currencyIcon: [
          { required: true, message: '请输入币种符号', trigger: 'blur' }
        ],
        currencyAccuracy: [
          { required: true, message: '请输入币种最小单位', trigger: 'blur' }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' }
        ],
        exchangeRateForUSDT: [
          { validator: validateExchangeRate, message: '请输入对USDT汇率', trigger: 'blur', }
        ]
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
    }
  },
  methods: {
    search() {

    },
    createNewCurrency() {
      this.addCurrencyTypeInfo.exchangeRateForUSDTType = 1
      this.dialogFormVisible = true;
      this.dialogTitle = "新增币种"
    },
    handleCurrentChange(val) {

    },
    handlePageSizeChange(val) {

    },
    cancelDialog() {
      this.addCurrencyTypeInfo = {

      };
      this.dialogTitle = '';
      this.dialogFormVisible = false;
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

        }
      })
    }
  }
}
</script>
<style scoped>
.toolbar {
  margin-left: 2%;
  margin-top: 1%;
}
</style>