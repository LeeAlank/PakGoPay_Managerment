<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">
    {{ $t('accountManagement.title') }}
  </div>

  <div class="toolbar" style="width: 94%;margin-left: 2%;margin-top: 10px;">
    <el-row style="display: flex;justify-content: space-between;">
      <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
        <template #label>
          <span>{{ $t('accountManagement.filter.userName') }}</span>
        </template>
        <el-input v-model="filterbox.loginName" :placeholder="$t('accountManagement.placeholder.userName')">
          <template #append>
            <el-button @click="search">
              <SvgIcon name="search"/>{{ $t('common.search') }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="createUser"><SvgIcon name="add"/>{{ $t('common.operate.add') }}</el-button>
      </el-form-item>
    </el-row>
  </div>

  <div class="main-views-form" style="width: 97%;margin-left: 2%;">
    <el-table

      ref="loginUserTable"
      :element-loading-text="$t('common.loading')"
      :data="allUserInfo"
      style="width: 97%;height: 70vh;"
      :key="tablekey"
      class="user-table"
      border
    >
      <el-table-column
        :label="$t('accountManagement.column.userId')"
        v-slot="{row}"
        align="center"
      >
        <div>
          {{row.userId}}
        </div>
      </el-table-column>
      <el-table-column
          :label="$t('accountManagement.column.userName')"
          v-slot="{row}"
          align="center"
      >
        <div>
          {{row.loginName}}
        </div>
      </el-table-column>
      <el-table-column
          :label="$t('accountManagement.column.userRole')"
          v-slot="{row}"
          align="center"
      >
        <div>
          {{row.roleName}}
        </div>
      </el-table-column>
      <el-table-column
          :label="$t('accountManagement.column.status')"
          v-slot="{row}"
          align="center"
      >
        <div>
          <el-switch
              :model-value="row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="$t('common.enable')"
              :inactive-text="$t('common.disable')"
              :active-value = "1"
              :inactive-value="0"
          />
        </div>
      </el-table-column>
      <el-table-column
          width="100"
          :label="$t('common.operation')"
          align="center"
          v-slot="{row}"
          fixed="right"
      >
        <el-dropdown trigger="click">
          <SvgIcon name="more" width="30" height="30" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="row.status === 1" @click="stopUser(row)">{{ $t('accountManagement.action.disable') }}</el-dropdown-item>
              <el-dropdown-item v-if="row.status === 0" @click="startUser(row)">{{ $t('accountManagement.action.enable') }}</el-dropdown-item>
              <el-dropdown-item @click="editUser(row)">{{ $t('common.edit') }}</el-dropdown-item>
              <el-dropdown-item @click="deleteUser(row)">{{ $t('common.operate.delete') }}</el-dropdown-item>
              <el-dropdown-item @click="resetGoogleSecretKey(row)">{{ $t('accountManagement.action.resetGoogleKey') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
        @size-change="handleSizeChange"
       
    >
    </el-pagination>
  </div>
  <div style="display: flex; justify-content: center;width: 60%;">
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      class="dialog"
      width="70%"
      style="height: 600px;align-content: center"
      >
      <el-form :model="createUserInfo" style="margin-top: 50px;width: 100%" :rules="rules" ref="createUserInfo">
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('accountManagement.form.userName')" label-width="150px"  prop="loginName">
                <el-input auto-complete="new-password" type="text" v-model.trim="createUserInfo.loginName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('accountManagement.form.password')" label-width="150px"  prop="password">
                <el-input autocomplete="new-password" type="password" v-model.trim="createUserInfo.password" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('accountManagement.form.confirmPassword')" label-width="150px"  prop="confirmPassword">
                <el-input type="password" v-model.trim="createUserInfo.confirmPassword" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('accountManagement.form.role')" label-width="150px"  prop="roleId">
                <el-select
                  v-model.trim="createUserInfo.roleId"
                  :placeholder="$t('accountManagement.placeholder.role')"
                  filterable
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in roleInfoOptions"
                    :key="item.roleId"
                    :value="item.roleId"
                    :label="item.roleName"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('accountManagement.form.status')" label-width="150px" >
                <el-switch
                    v-model="createUserInfo.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-text="$t('common.enable')"
                    :inactive-text="$t('common.disable')"
                    :active-value="1"
                    :inactive-value="0"
                >
                </el-switch>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item :label="$t('common.googleCode')" label-width="150px"  prop="googleCode">
                <el-input autocomplete="new-password" type="number" v-model.trim="createUserInfo.googleCode" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
<!--        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item style="display: flex;justify-content: space-between;border: solid 1px red;">
                <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
                <el-button type="primary" @click="submit('createUserInfo')">{{ $t('common.confirm') }}</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submit('createUserInfo')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
        :title="dialogTitle2"
        v-model="dialogVisible2"
        class="dialog"
        width="40%"
        style="height: 250px;align-content: center"
    >
      <el-form style="margin-top: 20px;width: 100%"
               :model="stopUserInfo"
      >
        <el-row style="width: 100%;" class="dialog-row">
          <el-col :span="24">
            <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item :label="$t('accountManagement.form.disableUserName')" label-width="150px"  prop="googleCode">
                <el-input readonly autocomplete="new-password" type="text" v-model.trim="stopUserInfo.loginName" style="width: 200px;font-weight: bold;"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%;" class="dialog-row">
          <el-col :span="24">
            <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item :label="$t('common.googleCode')" label-width="150px"  prop="googleCode">
                <el-input autocomplete="new-password" type="number" v-model.trim="stopUserInfo.googleCode" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog2">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit2('createUserInfo')">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
        :title="$t('accountManagement.dialog.resetGoogleKey')"
        v-model="resetGoogleVisible"
        class="dialog"
        center
        width="40%"
        style="height: 320px;align-content: center"
    >
      <el-form
        ref="resetGoogleForm"
        style="margin-top: 20px;width: 100%"
        :model="resetGoogleForm"
        :rules="resetGoogleRules"
      >
        <el-row style="width: 100%;" class="dialog-row">
          <el-col :span="24">
            <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item :label="$t('accountManagement.form.userName')" label-width="150px">
                <el-input
                  readonly
                  disabled
                  autocomplete="new-password"
                  type="text"
                  v-model.trim="resetGoogleForm.loginName"
                  style="width: 200px;font-weight: bold;"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%;" class="dialog-row">
          <el-col :span="24">
            <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item :label="$t('common.googleCode')" label-width="150px" prop="googleCode">
                <el-input autocomplete="new-password" type="number" v-model.trim="resetGoogleForm.googleCode" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="resetGoogleResult.qrCode || resetGoogleResult.secretKey" style="width: 100%;" class="dialog-row">
          <el-col :span="24">
            <div class="el-form-line" style="display: flex;justify-content: center;align-items: center; flex-direction: column; gap: 8px;">
              <img
                v-if="resetGoogleResult.qrCode"
                :src="resetGoogleResult.qrCode"
                alt="qr-code"
                style="width: 160px;height: 160px;object-fit: contain;"
              />
              <div v-if="resetGoogleResult.secretKey" style="font-weight: bold;">
                {{ $t('accountManagement.label.secretKey') }}{{ resetGoogleResult.secretKey }}
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelResetGoogleDialog">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitResetGoogleKey">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
        :title="$t('accountManagement.dialog.googleQrTitle')"
        v-model="googleQrVisible"
        class="dialog"
        center
        width="30%"
        style="align-content: center"
    >
      <div style="display: flex;flex-direction: column;align-items: center;gap: 12px;">
        <img
          v-if="googleQrCodeUrl"
          :src="googleQrCodeUrl"
          alt="qr-code"
          style="width: 180px;height: 180px;object-fit: contain;"
        />
        <div v-if="googleSecretKey" style="font-weight: bold;">
          {{ $t('accountManagement.label.secretKey') }}{{ googleSecretKey }}
        </div>
        <el-button v-if="googleSecretKey" size="small" @click="copyGoogleSecretKey">{{ $t('accountManagement.action.copySecretKey') }}</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="googleQrVisible = false">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addNewLoginUser,
  loginUserList,
  refreshAccessToken,
  roleList,
  manageLoginUserStatus, deleteLoginUser, loginUserByLoginName, resetGoogleKey
} from "@/api/interface/backendInterface.js";
import {loadingBody} from "@/api/common.js";
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const ACCOUNT_DRAFT_KEY = 'draft:AccountManagement:form';
const buildEmptyCreateUserInfo = () => ({
  loginName: '',
  password: '',
  confirmPassword: '',
  roleId: '',
  status: 1,
  googleCode: ''
});

export default {

  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error(this.$t('accountManagement.validation.passwordRequired')))
      } else {
        if (this.createUserInfo.confirmPassword !== '' && this.createUserInfo.confirmPassword !== 'undefined') {
          this.$refs.createUserInfo.validateField('confirmPassword');
        }
        callback()
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error(this.$t('accountManagement.validation.confirmPasswordRequired')))
      } else if (value !== this.createUserInfo.password) {
        callback(new Error(this.$t('accountManagement.validation.passwordMismatch')))
      } else {
        callback()
      }
    };
  /*  const loadingInstance = this.$loading({
      lock: true,
      text: 'Loading...',
      target: this.$el.querySelector('el-table__body-wrapper')
    })*/
    return {
      filterbox: {},
      loading: true,
      dialogVisible2: false,
      dialogTitle2: '',
      googleCode: '',
      tablekey: 0,
      stopUserInfo: {},
      allUserInfo: [],
      allUserInfoFromDababase: [
        /*{
            userId: '001',
            userName: '预置登陆用户',
            roleId: '001',
            userStatus: true,
        }*/
      ],
      splitPageUserInfo: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 50, 100, 200],
      dialogVisible: false,
      dialogTitle: '',
      createUserInfo: buildEmptyCreateUserInfo(),
      dialogMode: '',
      resetGoogleVisible: false,
      resetGoogleForm: {},
      resetGoogleResult: {
        qrCode: '',
        secretKey: ''
      },
      googleQrVisible: false,
      googleQrCodeUrl: '',
      googleSecretKey: '',
      roleInfoOptions: [
        /*{
          id: '001',
          roleName: '超级管理员'
        },
        {
          id: '002',
          roleName: '客服'
        }*/
      ],
      passwordmatch: true,
      rules: {
        loginName: [
          { required: true, message: this.$t('accountManagement.validation.userNameRequired'), trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: this.$t('accountManagement.validation.roleRequired'), trigger: 'blur' }
        ],
        googleCode: [
          { required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }
        ]
      },
      resetGoogleRules: {
        googleCode: [
          { required: true, message: this.$t('common.googleCodeRequired'), trigger: 'blur' }
        ]
      }

    }
  },
  watch: {
    dialogVisible(visible) {
      if (visible) {
        this.loadAccountDraft();
      }
    },
    createUserInfo: {
      deep: true,
      handler() {
        this.saveAccountDraft();
      }
    },
    dialogMode() {
      this.saveAccountDraft();
    }
  },
  methods: {
    saveAccountDraft() {
      if (!this.dialogVisible) return;
      const mode = this.dialogMode || '';
      const recordId = this.createUserInfo?.userId || this.createUserInfo?.id || '';
      saveDraft(ACCOUNT_DRAFT_KEY, { mode, recordId, data: this.createUserInfo || {} });
    },
    loadAccountDraft() {
      const draft = loadDraft(ACCOUNT_DRAFT_KEY);
      if (!draft || !draft.data) return;
      const mode = this.dialogMode || '';
      if (draft.mode && mode && draft.mode !== mode) return;
      if (mode === 'edit') {
        const recordId = this.createUserInfo?.userId || this.createUserInfo?.id || '';
        if (draft.recordId && recordId && draft.recordId !== recordId) return;
      }
      this.createUserInfo = Object.assign(buildEmptyCreateUserInfo(), draft.data || {});
    },
    clearAccountDraft() {
      clearDraft(ACCOUNT_DRAFT_KEY);
    },
    createUser() {
      this.dialogVisible = true;
      this.dialogTitle = this.$t('accountManagement.dialog.createTitle')
      this.dialogMode = 'create'
      this.createUserInfo = buildEmptyCreateUserInfo()
      this.loadAccountDraft()
    },
    search() {
      this.loadData()
    },
    editUser(row) {
      this.createUserInfo = row;
      const filterInfo = this.roleInfoOptions.filter(roleInfo => (roleInfo.roleName === row.roleName))
      this.createUserInfo.roleId = filterInfo ? filterInfo[0].roleId : ''
      this.dialogVisible = true;
      this.dialogTitle = this.$t('accountManagement.dialog.editTitle')
      this.dialogMode = 'edit'
      this.loadAccountDraft()
    },
    deleteUser(row) {
      this.dialogVisible2 = true;
      this.dialogTitle2 = this.$t('accountManagement.dialog.deleteTitle')
      this.stopUserInfo = row
      this.stopUserInfo.type = 'delete'
    },
    stopUser(row) {
      this.dialogVisible2 = true;
      this.dialogTitle2 = this.$t('accountManagement.dialog.disableTitle')
      this.stopUserInfo = row
      this.stopUserInfo.status = 0
    },
    startUser(row) {
      this.dialogVisible2 = true;
      this.dialogTitle2 = this.$t('accountManagement.dialog.enableTitle')
      this.stopUserInfo = row
      this.stopUserInfo.status = 1
    },
    handleCurrentChange(currentPage) {
        this.filterbox.pageSize = this.pageSize
        this.filterbox.pageNo = currentPage
        this.loadData()
    },
    handleSizeChange(pageSize) {
        this.filterbox.pageNo = 1
        this.filterbox.pageSize = pageSize
        this.loadData()
    },
    cancelDialog() {
      this.dialogVisible = false;
      this.dialogTitle = ''
      this.passwordmatch = true
      this.createUserInfo = buildEmptyCreateUserInfo()
      this.clearAccountDraft()
      this.dialogMode = ''
    },
    cancelDialog2() {
      this.dialogVisible2 = false
      this.dialogTitle2 = ''
      this.stopUserInfo = {}
      this.googleCode = ''
      this.loadData()
    },
    cancelResetGoogleDialog() {
      this.resetGoogleVisible = false
      this.resetGoogleForm = {}
      this.resetGoogleResult = {
        qrCode: '',
        secretKey: ''
      }
      this.googleQrVisible = false
      this.googleQrCodeUrl = ''
      this.googleSecretKey = ''
      this.$refs.resetGoogleForm?.resetFields();
    },
    submitResetGoogleKey() {
      this.$refs.resetGoogleForm.validate(valid => {
        if (!valid) {
          return;
        }
        resetGoogleKey(this.resetGoogleForm.userId, this.resetGoogleForm.googleCode, this.resetGoogleForm.loginName).then(response => {
          if (response.status === 200 && response.data.code === 0) {
            const data = this.parseResetGooglePayload(response.data.data);
            const qrCode = this.normalizeQrCode(data.qrCode);
            this.resetGoogleResult = { qrCode, secretKey: data.secretKey || '' };
            this.resetGoogleVisible = false;
            this.googleQrCodeUrl = qrCode;
            this.googleSecretKey = data.secretKey || '';
            this.googleQrVisible = true;
            this.$notify({
              title: this.$t('common.success'),
              message: response.data.message || this.$t('accountManagement.message.resetGoogleSuccess'),
              type: 'success',
              position: 'bottom-right',
            })
          } else {
            this.$notify({
              title: this.$t('common.error'),
              message: response.data.message || this.$t('accountManagement.message.resetGoogleFailed'),
              type: 'error',
              position: 'bottom-right',
            })
          }
        })
      })
    },
    copyGoogleSecretKey() {
      if (!this.googleSecretKey) {
        return;
      }
      const text = String(this.googleSecretKey);
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('accountManagement.message.copySecretSuccess'),
            type: 'success',
            position: 'bottom-right',
          })
        }).catch(() => {
          this.fallbackCopySecretKey(text);
        });
        return;
      }
      this.fallbackCopySecretKey(text);
    },
    fallbackCopySecretKey(text) {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        this.$notify({
          title: this.$t('common.success'),
          message: this.$t('accountManagement.message.copySecretSuccess'),
          type: 'success',
          position: 'bottom-right',
        })
      } catch (error) {
        this.$notify({
          title: this.$t('common.error'),
          message: this.$t('accountManagement.message.copySecretFailed'),
          type: 'error',
          position: 'bottom-right',
        })
      } finally {
        document.body.removeChild(input);
      }
    },
    parseResetGooglePayload(payload) {
      if (!payload) {
        return {};
      }
      if (typeof payload === "string") {
        try {
          return JSON.parse(payload);
        } catch (error) {
          return {};
        }
      }
      return payload;
    },
    normalizeQrCode(qrCode) {
      if (!qrCode) {
        return '';
      }
      const trimmed = String(qrCode).trim();
      if (trimmed.startsWith('data:image')) {
        return trimmed;
      }
      if (trimmed.startsWith('http')) {
        return trimmed;
      }
      return `data:image/png;base64,${trimmed}`;
    },
    submit2(formName) {
      if (this.stopUserInfo.googleCode ==='defined' || this.stopUserInfo.googleCode === '' || this.stopUserInfo.googleCode === null) {
        this.$notify({
          title: this.$t('common.error'),
          message: this.$t('accountManagement.message.googleCodeRequired'),
          type: 'error',
          position: 'bottom-right',
        })
      }
      if (this.stopUserInfo.type === 'delete') {
        this.$confirm(this.$t('accountManagement.message.deleteConfirm', {name: this.stopUserInfo.loginName}), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.yes'),
          cancelButtonText: this.$t('common.no'),
          type: 'warning',
        }).then(() => {
          deleteLoginUser(this.stopUserInfo.userId, this.stopUserInfo.googleCode).then(response => {
              if (response.status === 200 && response.data.code === 0) {
                this.dialogVisible2 = false
                this.dialogTitle2 = ""
                this.loadData()
                this.$notify({
                  title: this.$t('common.success'),
                  message: response.data.message,
                  type: 'success',
                  position: 'bottom-right',
                })
              } else if (response.status === 401) {
                this.$notify({
                  title: this.$t('common.prompt'),
                  message: this.$t('accountManagement.message.sessionExpired'),
                  type: 'info',
                  position: 'bottom-right',
                })
              } else {
                this.$notify({
                  title: this.$t('common.error'),
                  message: response.data.message,
                  type: 'error',
                  position: 'bottom-right',
                })
              }
          })
        })
      } else {
        manageLoginUserStatus(this.stopUserInfo.userId, this.stopUserInfo.status, this.stopUserInfo.googleCode).then(response => {
          if (response.status === 200 && response.data.code === 0) {
            this.dialogVisible2 = false
            this.dialogTitle2 = ""
            this.loadData()
            this.$notify({
              title: this.$t('common.success'),
              message: this.stopUserInfo.status === 1
                ? this.$t('accountManagement.message.enableSuccess')
                : this.$t('accountManagement.message.disableSuccess'),
              type: 'success',
              position: 'bottom-right',
            })
          }
        })
      }


    },
    submit(createUserInfo) {
      this.$refs[createUserInfo].validate((valid) => {
        if (valid) {
          this.createUserInfo.operatorId = localStorage.getItem("userId")
          addNewLoginUser(this.createUserInfo).then(response => {
            if (response.status !== 200) {
              this.$notify({
                title: this.$t('common.failed'),
                message: this.$t('accountManagement.message.createFailed'),
                type: 'error',
                position: 'bottom-right'
              });
            }
            if (response.data.code === 0) {
              this.dialogVisible = false
              this.dialogTitle = ""
              this.clearAccountDraft()
              this.dialogMode = ''
              this.createUserInfo = buildEmptyCreateUserInfo()
              this.loadData()
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('accountManagement.message.createSuccess'),
                type: 'success',
                position: 'bottom-right'
              });
            }
            if (response.data.code === 1) {
              this.$notify({
                title: this.$t('common.failed'),
                message: response.data.message,
                type: 'error',
                position: 'bottom-right'
              })
            }
          })
        } else {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('accountManagement.message.checkForm'),
            type: 'error',
            position: 'bottom-right'
          });
          return false;
        }
      });
      this.tablekey++
    },
    checkPassword() {
      if (this.createUserInfo.userPassword === null || this.createUserInfo.userPassword == undefined) {
        return
      }
      if (this.createUserInfo.confirmPassword !== this.createUserInfo.userPassword) {
          this.passwordmatch = false
      } else {
          this.passwordmatch = true
      }
    },
    async loadData() {
      const loadingInstance = loadingBody(this, 'user-table')
      await loginUserList(this.filterbox).then(response => {
        if (response.status === 401) {
          refreshAccessToken(localStorage.getItem("refreshToken"));
        } else if (response.status !== 200 && response.status !== 401) {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('accountManagement.message.getRoleFailed'),
            type: 'error',
            position: 'top-right',
          })
        } else if (response.status === 200) {
          if (response.data.code === 0 && response.data.data.length > 0) {
            let allData = JSON.parse(response.data.data)
            this.allUserInfo = Object.assign([], allData.loginUsers)
            this.totalCount = allData.totalNumber
            this.currentPage = allData.pageNo
            this.pageSize = allData.pageSize
          }
        }
        loadingInstance.close()
      })
    },
    resetGoogleSecretKey(row) {
      this.resetGoogleForm = {
        userId: row.userId,
        loginName: row.loginName,
        googleCode: ''
      };
      this.resetGoogleResult = {
        qrCode: '',
        secretKey: ''
      };
      this.resetGoogleVisible = true;
    }
  },
  async mounted() {

    await roleList(null).then(response => {
      if (response.status === 401) {
        refreshAccessToken(localStorage.getItem("refreshToken"));
      } else if (response.status !== 200 && response.status !== 401) {
        this.$notify({
          title: this.$t('common.error'),
          message: this.$t('accountManagement.message.getRoleFailed'),
          type: 'error',
          position: 'top-right',
        })
      } else if (response.status === 200) {
        if (response.data.code === 0 && response.data.data.length > 0) {
          this.roleInfoOptions = JSON.parse(response.data.data)
        }
      }
    })

    this.loadData()




  }
}
</script>
<style scoped>
.dialog-row {
  display: flex;
  justify-content: center;
}

.dialog-footer {
  bottom: 0;
  position: sticky;
  position: -webkit-sticky;
  right: 2%;
}

.notice {
  border: solid 1px red;
}

.el-table .el-loading-mask {
  z-index: -1; /* 根据需要调整，确保它低于表头 */
}

</style>
