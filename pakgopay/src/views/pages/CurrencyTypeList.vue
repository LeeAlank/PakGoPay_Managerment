<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
 <div class="main-title">{{ $t('route.currencyTypeList') }}</div>


 <div class="toolbar" style="width: 96%">
      <el-row style="display: flex;justify-content: space-between;">
        <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
          <template #label>
            <span>{{ $t('currencyTypeList.filter.currency') }}</span>
          </template>
          <el-select
              v-model="filterbox.id"
              :placeholder="$t('currencyTypeList.placeholder.currency')"
              style="width: 150px;"
              clearable
              :props="currencyProps"
              :options="currencyOptions"
              filterable
          >
          </el-select>
          <el-button @click="search" style="color: dodgerblue">{{ $t('common.search') }}</el-button>
        </el-form-item>
      </el-row>
    </div>

  <div class="reportInfo">
    <div style="display:flex;justify-content: right;">
      <el-button @click="createNewCurrency"><SvgIcon name="add"/>{{ $t('common.operate.add') }}</el-button>
    </div>
    <el-form style="height: 650px">
      <el-table
        :data="currencyTypeData"
        border
        style="height: auto;"
        :key="tableKey"
      >
        <el-table-column
          :label="$t('currencyTypeList.column.name')"
          align="center"
          v-slot="{row}">
          <div>{{row.name}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('currencyTypeList.column.code')"
            align="center"
            v-slot="{row}">
          <div>{{row.currencyType}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('currencyTypeList.column.icon')"
            align="center"
            v-slot="{row}">
          <div>{{row.icon}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('currencyTypeList.column.accuracy')"
            align="center"
            v-slot="{row}">
          <div>{{row.currencyAccuracy}}</div>
        </el-table-column>
        <el-table-column
            :label="$t('currencyTypeList.column.exchangeRate')"
            align="center"
            v-slot="{row}">
          <div>{{row.exchangeRate}}</div>
        </el-table-column>
      </el-table>
      <el-pagination class="pageTool"
          background
          layout="sizes, prev, pager, next, jumper, total"
          :total="totalCount"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
         
      >
      </el-pagination>
    </el-form>
    <el-dialog
        :title="dialogTitle"
        v-model="dialogFormVisible"
        class="dialog"
        center="true"
        width="40%"
        style="height: 440px;"
        @closed="cancelDialog"
    >
      <el-form style="margin-top: 25px;" :model="addCurrencyTypeInfo" :rules="rules" ref="addCurrencyTypeInfo">
        <div class="el-form-line">
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.code')" label-width="150px"  prop="currencyType">
                <el-input style="width: 200px;" v-model="addCurrencyTypeInfo.currencyType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.name')" label-width="150px"  prop="name">
                <el-input style="width: 200px;" v-model="addCurrencyTypeInfo.name"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.icon')" label-width="150px"  prop="icon">
                <el-input v-model="addCurrencyTypeInfo.icon" style="width: 200px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.accuracy')" label-width="150px"  prop="currencyAccuracy" style="display: flex;flex-direction: row;">
                <div style="display: grid;align-items: center;justify-content: center;">
                  <el-input type="number" v-model="addCurrencyTypeInfo.currencyAccuracy" style="width: 200px;">
                  </el-input>
                  <div style="color: red;display: flex;flex-direction: row;width: 150px;align-items: center;height: 12px">
                    <SvgIcon style="width: 12px;height: 12px;" name="notice2"/>
                    <div style="font-size:12px">
                      {{ $t('currencyTypeList.tip.accuracy') }}
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: center;">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.rateMode')" label-width="150px"  prop="exchangeRate" style="display: flex;flex-direction: row">
                <el-select v-model="addCurrencyTypeInfo.isRate" style="width: 200px;text-align: center">
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
          <el-row v-if="addCurrencyTypeInfo.isRate === 2">
            <el-col :span="24" style="display: flex;justify-content: center;">
              <el-form-item :label="$t('currencyTypeList.form.exchangeRate')" label-width="150px"  prop="exchangeRate">
                <el-input type="number" v-model="addCurrencyTypeInfo.exchangeRate" style="width: 200px"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit('addCurrencyTypeInfo')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="confirmDialogTitle"
      v-model="confirmDialogVisible"
      class="dialog confirm-dialog"
      center
      width="40%"
      height="200px"
      style="min-width: 420px;"
    >
      <el-form ref="confirmDataForm" :rules="confirmRule" :model="confirmData" style="height:100px;margin-top: 20px">
        <el-row class="confirm-row">
          <el-col :span="24" style="display: flex;justify-content: center;justify-items: center;align-items: center;">
            <div>
              <el-form-item :label="$t('common.googleCode')" label-width="150px" prop="googleCode" class="confirm-item">
                <el-input v-model="confirmData.googleCode" style="width: 240px"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 3%;height: 30px;">
        <el-button @click="cancelConfirmDialog('confirmDataForm')">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitConfirm('confirmDataForm')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addCurrencyType, getAllCurrencyType,
  getCurrencyTypeByPage
} from "@/api/interface/backendInterface.js";
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const CURRENCY_TYPE_DRAFT_KEY = 'draft:CurrencyTypeList:add';
const buildEmptyCurrencyTypeInfo = () => ({
  currencyType: '',
  name: '',
  icon: '',
  currencyAccuracy: '',
  isRate: 2,
  exchangeRate: '',
  googleCode: ''
});

export default {
  name: 'CurrencyTypeList',
  data() {
    const validateExchangeRate = (rule, value, callback) => {
      if (this.addCurrencyTypeInfo.exchangeRate === 2 && (value === '' || value === undefined)) {
        callback(new Error(this.$t('currencyTypeList.validation.exchangeRateRequired')))
      } else {
        callback()
      }
    };
    return {
      tableKey: 0,
      dialogFormVisible: false,
      dialogTitle: '',
      addCurrencyTypeInfo: buildEmptyCurrencyTypeInfo(),
      currencyTypeData: [
        /*{createTime: 1767082270000,currencyType:"US",exchangeRate:0.900000,icon:"$",id:1,isRate:1,name:"美金"}*/
      ],
      currencyOptions: [
        /*{
          value: 1,
          label: '马币'
        },
        {
          value: 2,
          label: '美元'
        }*/
      ],
      currencyProps: {
        value: 'id',
        label: 'name'
      },
      filterbox: {

      },
      exchangeRateOptions: [
        {
          value: 1,
          label: this.$t('currencyTypeList.rateMode.live')
        },
        {
          value: 2,
          label: this.$t('currencyTypeList.rateMode.fixed')
        }
      ],
      rules: {
        currencyType: [
          { required: true, message: this.$t('currencyTypeList.validation.codeRequired'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('currencyTypeList.validation.nameRequired'), trigger: 'blur' }
        ],
        icon: [
          { required: true, message: this.$t('currencyTypeList.validation.iconRequired'), trigger: 'blur' }
        ],
        currencyAccuracy: [
          { required: true, message: this.$t('currencyTypeList.validation.accuracyRequired'), trigger: 'blur' }
        ],
        exchangeRate: [
          { validator: validateExchangeRate, message: this.$t('currencyTypeList.validation.exchangeRateRequired'), trigger: 'blur', }
        ]
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [10, 20, 30, 40],
      confirmDialogVisible: false,
      confirmDialogTitle: '',
      confirmData: {
        googleCode: ''
      },
      confirmRule: {
        googleCode: [
          { required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    saveCurrencyTypeDraft() {
      if (!this.dialogFormVisible) return;
      saveDraft(CURRENCY_TYPE_DRAFT_KEY, { data: this.addCurrencyTypeInfo || {} });
    },
    loadCurrencyTypeDraft() {
      const draft = loadDraft(CURRENCY_TYPE_DRAFT_KEY);
      if (!draft || !draft.data) return;
      this.addCurrencyTypeInfo = Object.assign(buildEmptyCurrencyTypeInfo(), draft.data);
    },
    clearCurrencyTypeDraft() {
      clearDraft(CURRENCY_TYPE_DRAFT_KEY);
    },
    getCurrencyTypeList() {
      getCurrencyTypeByPage(this.filterbox).then(res => {
        if (res.status === 200) {
           if (res.data.code === 0) {
             let allData =  JSON.parse(res.data.data)
             this.currencyTypeData = allData.currencyTypeDTOList
             this.currentPage = allData.pageNo
             this.pageSize = allData.pageSize
             this.totalCount = allData.totalNumber
           } else {
            this.$notify({
              title: this.$t('common.error'),
              message: res.data.message,
              duration: 3000,
              type: 'error',
              position: "bottom-right"
            })
           }
        } else {
          this.$notify({
            title: this.$t('common.failed'),
            message: this.$t('currencyTypeList.message.getFailed'),
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
    },
    search() {
        this.filterbox.pageNo = this.currentPage
        this.filterbox.pageSize = this.pageSize
        this.getCurrencyTypeList()
    },
    createNewCurrency() {
      this.resetDialogForm();
      this.dialogFormVisible = true;
      this.dialogTitle = this.$t('currencyTypeList.dialog.add')
    },
    handleCurrentChange(val) {

    },
    handlePageSizeChange(val) {

    },
    cancelDialog() {
      this.resetDialogForm();
      this.dialogTitle = '';
      this.dialogFormVisible = false;
      this.clearCurrencyTypeDraft();
    },
    resetDialogForm() {
      this.addCurrencyTypeInfo = buildEmptyCurrencyTypeInfo();
      if (this.$refs.addCurrencyTypeInfo) {
        this.$refs.addCurrencyTypeInfo.resetFields();
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.confirmDialogTitle = this.$t('common.prompt')
          this.confirmDialogVisible = true
        }
      })
    },
    submitConfirm(form) {
      this.$refs[form].validate(valid => {
        if (!valid) return
        this.addCurrencyTypeInfo.googleCode = this.confirmData.googleCode
        this.confirmDialogVisible = false
        this.confirmDialogTitle = ''
        addCurrencyType(this.addCurrencyTypeInfo).then(res => {
          if (res.status === 200) {
            if (res.data.code !== 0) {
              this.$notify({
                title: this.$t('common.failed'),
                message: res.data.message,
                type: 'error',
                position: 'bottom-right'
              })
            } else {
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('currencyTypeList.message.addSuccess'),
                type: 'success',
                position: 'bottom-right'
              })
              this.getCurrencyTypeList()
              this.dialogFormVisible = false;
              this.resetDialogForm();
              this.clearCurrencyTypeDraft();
            }
          }
          this.confirmData.googleCode = ''
        }).catch(() => {
          this.confirmData.googleCode = ''
        })
      })
    },
    cancelConfirmDialog(form) {
      this.confirmDialogVisible = false
      this.confirmDialogTitle = ''
      this.confirmData.googleCode = ''
      if (this.$refs[form]) {
        this.$refs[form].resetFields()
      }
    }
  },
  watch: {
    dialogFormVisible(visible) {
      if (visible) {
        this.loadCurrencyTypeDraft();
      }
    },
    addCurrencyTypeInfo: {
      deep: true,
      handler() {
        this.saveCurrencyTypeDraft();
      }
    }
  },
  mounted() {
    getAllCurrencyType().then(res => {
      if (res.status === 200 && res.data.code === 0) {
        this.currencyOptions = JSON.parse(res.data.data).currencyTypeDTOList
        return;
      }
      if (res.status !== 200 || res.data.code !== 0) {
        this.$notify({
          title: this.$t('common.failed'),
          message: this.$t('currencyTypeList.message.getFailed'),
          type: 'error',
          position: 'bottom-right'
        })
      }
    })
    this.getCurrencyTypeList();
  }
}
</script>
<style scoped>
@import "@/assets/base.css";
.toolbar {
  margin-left: 2%;
  margin-top: 1%;
}

.confirm-row {
  display: flex;
  justify-content: center;
}

.confirm-item {
  margin: 0 auto;
}

.confirm-item :deep(.el-form-item__content) {
  margin-left: 0;
}
</style>
