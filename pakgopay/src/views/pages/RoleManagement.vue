<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
import {getTimeFromTimestamp} from "@/api/common.js";
</script>

<template>
 <div class="main-title">
   {{ $t('roleManagement.title') }}
 </div>

 <div class="main-views-container">
   <div class="toolbar role-management-toolbar" style="width: 96%; margin-left: 1%;">
     <el-row class="role-management-toolbar-row" style="display: flex;justify-content: flex-start;">
       <el-form-item class="role-management-filter-item" label-width="120px">
         <template #label>
           <span>{{ $t('roleManagement.filter.roleName') }}</span>
         </template>
         <el-input v-model="filterBox.roleName" :placeholder="$t('roleManagement.placeholder.roleName')">
           <template #append>
             <el-button @click="getRoleInfoByRoleName">
               <SvgIcon name="search"/>{{ $t('common.search') }}
             </el-button>
           </template>
         </el-input>
       </el-form-item>
     </el-row>
   </div>

   <div class="reportInfo">
     <div class="role-management-table-actions">
       <el-button @click="createRole"><SvgIcon name="add"/>{{ $t('common.operate.add') }}</el-button>
     </div>
     <el-form>
       <el-table
           :key="tableKey"
           border :data="roleInfoTableData"
           class="merchantInfos-table"
           style="width: 100%"
           height="auto"
       >
         <el-table-column
             prop="roleId"
             :label="$t('roleManagement.column.id')"
             v-slot="{row}"
             align="center"
         >
           <div>
             {{row.roleId}}
           </div>
         </el-table-column>
        <el-table-column
            prop="roleName"
            :label="$t('roleManagement.column.roleName')"
            v-slot="{row}"
            align="center"
         >
           <div>
             {{row.roleName}}
           </div>
         </el-table-column>
         <el-table-column
             prop="createTime"
             :label="$t('roleManagement.column.createTime')"
             v-slot="{row}"
             align="center"
         >
           <div>
             {{getTimeFromTimestamp(row.createTime)}}
           </div>
         </el-table-column>
        <el-table-column
            prop="updateTime"
            :label="$t('roleManagement.column.updateTime')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{getTimeFromTimestamp(row.updateTime)}}
          </div>
        </el-table-column>
        <el-table-column
            prop="remark"
            :label="$t('roleManagement.column.roleFlag')"
            v-slot="{row}"
            align="center"
        >
          <div>
            {{row.remark}}
          </div>
        </el-table-column>
        <el-table-column
            :label="$t('common.operation')"
            v-slot="{row}"
            align="center"
         >
           <div>
             <el-dropdown trigger="click">
               <SvgIcon name="more" width="30" height="30" />
               <template #dropdown>
                 <el-dropdown-menu>
                   <el-dropdown-item @click="editRoleInfo(row)">{{ $t('common.edit') }}</el-dropdown-item>
                   <el-dropdown-item @click="deleteRoleInfo(row)">{{ $t('common.operate.delete') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
             </el-dropdown>
           </div>
         </el-table-column>
       </el-table>
     </el-form>
     <div style="display:flex;float: right;margin-right: 5%;height: 5%;margin-top: 2%;">
       <el-pagination class="pageTool"
           background
           layout="sizes, prev, pager, next, jumper, total"
           :total="totalCount"
           v-model:current-page="currentPage"
           v-model:page-size="pageSize"
           :page-sizes="pageSizes"
          
           @current-change="handleChange"
           @size-change="handleSizeChange"
       >
       </el-pagination>
     </div>
   </div>
  <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      class="dialog role-edit-dialog"
      center="true"
      width="40%"
      style="height: 600px;border:solid 1px lightseagreen;position: relative;"
  >
     <el-form style="margin-top: 50px" :model="roleInfo" :rules="editRoleRule" ref="roleInfo">
       <div class="el-form-line">
         <el-form-item :label="$t('roleManagement.form.roleName')" label-width="150px"  prop="roleName">
           <el-input type="text" v-model="roleInfo.roleName" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item :label="$t('roleManagement.form.roleFlag')" label-width="150px"  prop="remark">
           <el-input type="text" v-model="roleInfo.remark" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item :label="$t('common.googleCode')" label-width="150px"  prop="googleCode">
           <el-input type="text" v-model="roleInfo.googleCode" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item  style="">
           <template #label>
             <span style="color: skyblue;width: 150px;">{{ $t('roleManagement.form.menu') }}</span>
           </template>
            <el-tree
              :data="menuData"
              show-checkbox
              node-key="menuId"
              :props="defaultProps"
              style="margin-top: 4px;"
              ref="treeRef"
            />
         </el-form-item>
       </div>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
       <el-button type="primary" @click="submit('roleInfo')">{{ $t('common.confirm') }}</el-button>
     </div>
   </el-dialog>
  <el-dialog
      :title="dialogTitle2"
      v-model="dialogVisible2"
      class="dialog role-edit-dialog"
      center="true"
      width="40%"
      style="height: 600px;border:solid 1px lightseagreen;position: relative;"
  >
     <el-form style="margin-top: 50px" :model="roleInfo" :rules="addRoleRule" ref="roleInfo">
       <div class="el-form-line">
       <el-form-item :label="$t('roleManagement.form.roleName')" label-width="150px"  prop="roleName">
         <el-input disabled type="text" v-model="roleInfo.roleName" style="width: 200px"></el-input>
       </el-form-item>
     </div>
     <div class="el-form-line">
       <el-form-item :label="$t('roleManagement.form.roleFlag')" label-width="150px"  prop="remark">
         <el-input type="text" v-model="roleInfo.remark" style="width: 200px"></el-input>
       </el-form-item>
     </div>
       <div class="el-form-line">
         <el-form-item  style="">
           <template #label>
             <span style="color: skyblue;width: 150px;">{{ $t('roleManagement.form.menu') }}</span>
           </template>
           <el-tree
               :data="menuData"
               show-checkbox
               node-key="menuId"
               :props="defaultProps"
               style="margin-top: 4px;"
               ref="treeRef2"
               default-expand-all= true
           />
         </el-form-item>
       </div>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="cancelDialog2">{{ $t('common.cancel') }}</el-button>
       <el-button type="primary" @click="submit2('roleInfo')">{{ $t('common.confirm') }}</el-button>
     </div>
   </el-dialog>

   <el-dialog
       :title="$t('roleManagement.dialog.googleVerify')"
       v-model="googleVerifyVisible"
       class="dialog role-google-confirm-dialog"
       center
       width="420px"
      align-center>
     <el-form ref="googleVerifyForm" :model="googleVerifyForm" class="role-google-confirm-form">
       <el-form-item
           :label="`${$t('common.googleCode')}:`"
           label-width="150px"
           prop="googleCode"
           class="role-google-confirm-item"
           required
       >
         <el-input
           type="number"
           v-model.trim="googleVerifyForm.googleCode"
           style="width: 200px"
           :placeholder="$t('common.placeholder.googleCode')"
         />
       </el-form-item>
     </el-form>
     <template #footer>
       <div class="dialog-footer role-google-confirm-footer">
         <el-button @click="cancelGoogleVerify">{{ $t('common.cancel') }}</el-button>
         <el-button type="primary" @click="submitGoogleVerify">{{ $t('common.confirm') }}</el-button>
       </div>
     </template>
   </el-dialog>

   <el-dialog
       :title="dialogTitle3"
       v-model="dialogVisible3"
       class="dialog"
       center="true"
       width="40%"
       style="height: 400px;border:solid 1px lightseagreen;overflow:scroll;position: relative;"
   >

     <el-form style="margin-top: 20%;width: 100%"
              :model="roleInfo"
     >
       <el-row style="width: 100%;" class="dialog-row">
         <el-col :span="24">
         <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
             <el-form-item :label="$t('roleManagement.form.roleName')" label-width="150px"  prop="roleName">
               <el-input readonly autocomplete="new-password" type="text" v-model.trim="roleInfo.roleName" style="width: 200px;font-weight: bold;"></el-input>
             </el-form-item>
           </div>
         </el-col>
       </el-row>
       <el-row style="width: 100%;" class="dialog-row">
         <el-col :span="24">
           <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
             <el-form-item label-width="150px"  prop="googleCode">
               <template #label>
                 <div style="display: flex;justify-content: center;align-items: center;">
                   <SvgIcon name="must"/>
                   <div>{{ $t('common.googleCode') }}</div>
                 </div>
               </template>
               <el-input autocomplete="new-password" type="number" v-model.trim="roleInfo.googleCode" style="width: 200px"></el-input>
             </el-form-item>
           </div>
         </el-col>
       </el-row>
     </el-form>
     <div slot="footer" class="dialog-footer" style="position: absolute; bottom: 3%;float: right;">
       <el-button @click="cancelDialog3">{{ $t('common.cancel') }}</el-button>
       <el-button type="primary" @click="submit3('roleInfo')">{{ $t('common.confirm') }}</el-button>
     </div>
   </el-dialog>
 </div>
</template>

<script>
import {
  addRole,
  deleteRole,
  getRoleInfoByRoleId,
  menu,
  modifyRoleInfo,
  roleListPage
} from "@/api/interface/backendInterface.js";
import {nextTick, ref} from "vue";
import {saveDraft, loadDraft, clearDraft} from "@/util/draft.js";

const ROLE_DRAFT_KEY = 'draft:RoleManagement:form';

const treeRef = ref();
const treeRef2 = ref();
export default {
  name: "RoleManagement",
  data() {
    return {
      menuList: [],
      filterBox: {},
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [5, 10, 15, 20],
      dialogVisible: false,
      dialogTitle: '',
      dialogVisible2: false,
      dialogTitle2: '',
      dialogMode: '',
      googleVerifyVisible: false,
      googleVerifyForm: {
        googleCode: ''
      },
      pendingRoleInfo: null,
      originalEditRoleInfo: null,
      dialogVisible3: false,
      dialogTitle3: '',
      roleInfoFormData: [],
      roleInfoTableData: [],
      tableKey: 0,
      timeZoneKey: localStorage.getItem("timeZone") || "UTC+8",
      addRoleInfoData:[],
      defaultRoleInfo: {
        roleId: '',
        remark: '',
        menuList: [],
        roleName: '',
        googleCode: '',
      },
      roleInfo:{
        roleId: '',
        remark: '',
        menuList: [],
        roleName: '',
        googleCode: '',
      },
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      menuData: [

      ],
      addRoleRule: {
        roleName: [
          { required: true, message: this.$t('roleManagement.validation.roleNameRequired'), trigger: "blur" }
        ],
        remark: [
            { validator: (rule, value, callback) => this.validateRequiredText(value, this.$t('roleManagement.validation.roleFlagRequired'), callback), trigger: "blur" }
        ],
        googleCode: [
            { required: true, message: this.$t('common.googleCodeRequired'), trigger: "blur" }
        ]
      },
      editRoleRule: {
        roleName: [
          { required: true, message: this.$t('roleManagement.validation.roleNameRequired'), trigger: "blur" }
        ],
        remark: [
          { validator: (rule, value, callback) => this.validateRequiredText(value, this.$t('roleManagement.validation.roleFlagRequired'), callback), trigger: "blur" }
        ]
      }
    }
  },
  watch: {
    dialogVisible(visible) {
      if (visible) {
        this.loadRoleDraft();
      }
    },
    dialogVisible2(visible) {
      if (visible) {
        this.loadRoleDraft();
      }
    },
    roleInfo: {
      deep: true,
      handler() {
        this.saveRoleDraft();
      }
    },
    dialogMode() {
      this.saveRoleDraft();
    }
  },
  methods: {
    validateRequiredText(value, message, callback) {
      if (value === undefined || value === null || String(value).trim() === '') {
        callback(new Error(message));
        return;
      }
      callback();
    },
    saveRoleDraft() {
      if (!this.dialogVisible && !this.dialogVisible2) return;
      const mode = this.dialogMode || '';
      const recordId = this.roleInfo?.roleId || this.roleInfo?.roleName || '';
      saveDraft(ROLE_DRAFT_KEY, { mode, recordId, data: this.roleInfo || {} });
    },
    loadRoleDraft() {
      const draft = loadDraft(ROLE_DRAFT_KEY);
      if (!draft || !draft.data) return;
      const mode = this.dialogMode || '';
      if (draft.mode && mode && draft.mode !== mode) return;
      if (mode === 'edit') {
        const recordId = this.roleInfo?.roleId || this.roleInfo?.roleName || '';
        if (draft.recordId && recordId && draft.recordId !== recordId) return;
      }
      Object.assign(this.roleInfo, this.defaultRoleInfo, draft.data || {});
    },
    clearRoleDraft() {
      clearDraft(ROLE_DRAFT_KEY);
    },
    normalizeRoleMenuList(menuList) {
      return [...new Set((menuList || []).filter(Boolean).map(String))].sort();
    },
    hasEditRoleChanges() {
      if (!this.originalEditRoleInfo) {
        return true;
      }
      const currentMenuList = this.normalizeRoleMenuList(this.roleInfo.menuList);
      const originalMenuList = this.normalizeRoleMenuList(this.originalEditRoleInfo.menuList);
      return JSON.stringify(currentMenuList) !== JSON.stringify(originalMenuList);
    },
    getRoleInfo() {
      roleListPage({
        roleName: this.filterBox.roleName,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          const data = JSON.parse(res.data.data)
          this.roleInfoTableData = data.roles || []
          this.totalCount = data.totalNumber || 0
          this.currentPage = data.pageNo || this.currentPage
          this.pageSize = data.pageSize || this.pageSize
        }
      })
    },

    getRoleInfoByRoleName() {
      this.currentPage = 1
      roleListPage({
        roleName: this.filterBox.roleName,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res.status === 200) {
          const data = JSON.parse(res.data.data);
          this.roleInfoTableData = data.roles || [];
          this.totalCount = data.totalNumber || 0;
          this.currentPage = data.pageNo || this.currentPage;
          this.pageSize = data.pageSize || this.pageSize;
        } else if (res.status === 401) {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('roleManagement.message.sessionExpired'),
            type: 'error',
            position: 'center',
          })
        } else {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('roleManagement.message.getFailed'),
            type: 'error',
            position: 'center',
          })
        }
      })
    },

    async editRoleInfo(row) {
      await getRoleInfoByRoleId(row.roleId).then(res => {
        if (res.status !== 200) {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('roleManagement.message.getFailedRetry'),
            type: 'error',
            position: 'center',
          })
          return;
        }
        this.menuList = JSON.parse(res.data.data).menuList;
      })
      this.dialogTitle2 = this.$t('roleManagement.dialog.editTitle')
      this.dialogVisible2 = true
      this.dialogMode = 'edit'
      this.roleInfo = {
        ...this.defaultRoleInfo,
        roleId: row.roleId,
        roleName: row.roleName
      }
      this.loadRoleDraft()
      await nextTick(() => {
        treeRef2.value.setCheckedKeys(this.menuList, true);
        this.originalEditRoleInfo = {
          roleName: row.roleName || '',
          remark: '',
          menuList: this.normalizeRoleMenuList(
            treeRef2.value.getCheckedKeys(false, false).concat(treeRef2.value.getHalfCheckedKeys(false, false))
          )
        }
      })
    },
    deleteRoleInfo(row) {

      this.roleInfo = {
        ...this.defaultRoleInfo,
        roleId: row.roleId,
        roleName: row.roleName,
        remark: row.remark
      }
      this.dialogVisible3 = true
      this.dialogTitle3 = this.$t('roleManagement.dialog.deleteTitle')
    },
    createRole() {
      this.dialogVisible = true;
      this.dialogTitle = this.$t('roleManagement.dialog.addTitle')
      this.dialogMode = 'create'
      Object.assign(this.roleInfo, this.defaultRoleInfo)
      this.loadRoleDraft()
      this.menuData = []
      menu().then(res => {
        this.menuData = JSON.parse(res.data.data)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getRoleInfo();
    },
    handleChange(val) {
      this.currentPage = val;
      this.getRoleInfo();
    },
    cancelDialog() {
      this.dialogVisible = false;
      this.dialogTitle = '';
      this.resetAddForm();
      this.clearRoleDraft();
      this.dialogMode = '';
    },
    cancelDialog2() {
      this.dialogVisible2 = false;
      this.dialogTitle2 = '';
      this.resetEditForm();
      this.clearRoleDraft();
      this.originalEditRoleInfo = null;
      this.dialogMode = '';
    },
    cancelGoogleVerify() {
      this.googleVerifyVisible = false;
      this.googleVerifyForm.googleCode = '';
      this.pendingRoleInfo = null;
    },
    cancelDialog3() {
      this.dialogVisible3 = false;
      this.dialogTitle3 = '';
      this.resetDeleteForm();
    },
    submit(formName) {

      let nodes = []
      nodes = treeRef.value.getCheckedNodes(false,false);
      // 选中的节点key
      let keys = []
      keys = treeRef.value.getCheckedKeys(false,false);
      // 针对未全选子节点的情况下 需要获取到父节点key
      let halfKeys = []
      halfKeys = treeRef.value.getHalfCheckedKeys(false,false);
      this.addRoleInfoData.push(this.roleInfo)
      this.roleInfo.menuList = keys.concat(halfKeys)
      if (!this.roleInfo.menuList) {
        this.$notify({
          title: this.$t('roleManagement.notice.warning'),
          message: this.$t('roleManagement.message.menuRequired'),
          type: 'warning',
          position: 'bottom-right'
        });
        return
      }
      //调用后端接口写入数据即可
      //后端存角色表 角色-菜单表
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addRole(this.roleInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.dialogTitle = ''
              this.dialogVisible = false
              this.resetAddForm()
              this.clearRoleDraft()
              this.dialogMode = ''
              this.$notify({
                title: this.$t('common.success'),
                message: this.$t('roleManagement.message.addSuccess'),
                type: 'success',
                position: 'bottom-right'
              });
              this.getRoleInfo()
            } else if (res.data.code !== 0) {
              this.$notify({
                title: this.$t('common.error'),
                message: res.data.message,
                type: 'error',
                position: 'bottom-right'
              });
            } else if (res.status === 401) {
              this.$notify({
                title: this.$t('common.error'),
                message: this.$t('roleManagement.message.sessionExpired'),
                type: 'error',
                position: 'bottom-right'
              });
            } else {
              this.$notify({
                title: this.$t('common.error'),
                message: res.data.message,
                type: 'error',
                position: 'bottom-right'
              });
            }
          })
        } else {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('roleManagement.message.checkForm'),
            type: 'error',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    submit2(formName) {

      let nodes = []
      nodes = treeRef2.value.getCheckedNodes(false,false);
      // 选中的节点key
      let keys = []
      keys = treeRef2.value.getCheckedKeys(false,false);
      // 针对未全选子节点的情况下 需要获取到父节点key
      let halfKeys = []
      halfKeys = treeRef2.value.getHalfCheckedKeys(false,false);
      //this.addRoleInfoData.push(this.roleInfo)
      this.roleInfo.menuList = keys.concat(halfKeys)
      if (!this.roleInfo.menuList) {
        this.$notify({
          title: this.$t('roleManagement.notice.warning'),
          message: this.$t('roleManagement.message.menuRequired'),
          type: 'warning',
          position: 'bottom-right'
        });
        return
      }
      //调用后端接口写入数据即可
      //后端存角色表 角色-菜单表
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.hasEditRoleChanges()) {
            this.$notify({
              title: this.$t('roleManagement.notice.warning'),
              message: this.$t('roleManagement.message.noChange'),
              type: 'warning',
              position: 'bottom-right'
            });
            return false;
          }
          this.pendingRoleInfo = Object.assign({}, that.roleInfo)
          this.dialogVisible2 = false
          this.dialogTitle2 = ''
          this.googleVerifyForm.googleCode = ''
          this.googleVerifyVisible = true

        } else {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('roleManagement.message.checkForm'),
            type: 'error',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    submitGoogleVerify() {
      if (!this.googleVerifyForm.googleCode) {
        this.$notify({
          title: this.$t('common.error'),
          message: this.$t('common.googleCodeRequired'),
          type: 'error',
          position: 'bottom-right'
        })
        return
      }
      if (!this.pendingRoleInfo) {
        this.googleVerifyVisible = false
        return
      }
      const submitInfo = Object.assign({}, this.pendingRoleInfo, {
        googleCode: this.googleVerifyForm.googleCode
      })
      modifyRoleInfo(submitInfo).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          this.googleVerifyVisible = false
          this.googleVerifyForm.googleCode = ''
          this.pendingRoleInfo = null
          this.resetEditForm()
          this.clearRoleDraft()
          this.originalEditRoleInfo = null
          this.dialogMode = ''
          this.getRoleInfo()
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('roleManagement.message.updateSuccess'),
            type: 'success',
            position: 'bottom-right'
          });
        } else if (res.data.code !== 0) {
          this.$notify({
            title: this.$t('common.error'),
            message: res.data.message,
            type: 'error',
            position: 'bottom-right'
          });
        } else if (res.status === 401) {
          this.$notify({
            title: this.$t('common.error'),
            message: this.$t('roleManagement.message.sessionExpired'),
            type: 'error',
            position: 'bottom-right'
          });
        } else {
          this.$notify({
            title: this.$t('common.error'),
            message: res.data.message,
            type: 'error',
            position: 'bottom-right'
          });
        }
      })
    },
    submit3(formName) {
      this.$confirm(this.$t('roleManagement.message.deleteConfirm', {name: this.roleInfo.roleName}), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning',
      }).then(() => {
          deleteRole(this.roleInfo).then(res => {
            if (res.status === 200) {
              if (res.data.code === 0) {
                this.$notify({
                  title: this.$t('common.success'),
                  message: this.$t('roleManagement.message.deleteSuccess'),
                  type: 'success',
                  position: 'bottom-right'
                })
                this.getRoleInfo()
              } else {
                this.$notify({
                  title: this.$t('common.failed'),
                  message: this.$t('roleManagement.message.deleteFailed'),
                  type: 'error',
                  position: 'bottom-right'
                })
              }

            } else {
              this.$notify({
                title: this.$t('common.error'),
                message: this.$t('roleManagement.message.deleteFailed'),
                type: 'error',
                position: 'bottom-right'
              })
            }
            this.dialogVisible3 = false;
            this.dialogTitle3 = ''
            this.resetDeleteForm()
          })
      })

    }
    ,
    resetAddForm() {
      Object.assign(this.roleInfo, this.defaultRoleInfo)
      this.addRoleInfoData = []
      if (this.$refs.roleInfo) {
        this.$refs.roleInfo.resetFields()
      }
      if (treeRef.value) {
        treeRef.value.setCheckedKeys([])
      }
    },
    resetEditForm() {
      Object.assign(this.roleInfo, this.defaultRoleInfo)
      this.originalEditRoleInfo = null
      if (this.$refs.roleInfo) {
        this.$refs.roleInfo.resetFields()
      }
      if (treeRef2.value) {
        treeRef2.value.setCheckedKeys([])
      }
    },
    resetDeleteForm() {
      Object.assign(this.roleInfo, this.defaultRoleInfo)
      if (this.$refs.roleInfo) {
        this.$refs.roleInfo.resetFields()
      }
    }
  },
  mounted() {
    this._timeZoneListener = (event) => {
      this.timeZoneKey = event.detail || localStorage.getItem("timeZone") || "UTC+8";
      this.tableKey++;
    };
    window.addEventListener("timezone-change", this._timeZoneListener);
  },
  created() {
    this.getRoleInfo();
    menu().then(res => {
      this.menuData = JSON.parse(res.data.data)
    })
  },
  beforeUnmount() {
    if (this._timeZoneListener) {
      window.removeEventListener("timezone-change", this._timeZoneListener);
    }
  }
}
</script>
<style scoped>
@import "@/assets/base.css";

:deep(.role-edit-dialog .el-dialog__body) {
  max-height: 420px;
  overflow: auto;
}

:deep(.role-edit-dialog .el-dialog__footer) {
  position: sticky;
  bottom: 0;
  background: #ffffff;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 1;
}

:deep(.role-google-confirm-dialog .el-dialog__body) {
  padding-top: 20px;
  padding-bottom: 28px;
}

:deep(.role-google-confirm-dialog .el-dialog__footer) {
  border-top: 1px solid #ebeef5;
  padding-top: 22px;
  padding-bottom: 18px;
}

.role-google-confirm-form {
  margin-top: 8px;
  padding-bottom: 20px;
}

.role-google-confirm-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.role-google-confirm-item {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  margin-bottom: 0;
}

.role-google-confirm-item :deep(.el-form-item__label) {
  justify-content: flex-end;
}

.role-google-confirm-item :deep(.el-form-item__content) {
  justify-content: flex-start;
}

.role-management-toolbar-row {
  width: 100%;
  margin-left: 0;
}

.role-management-toolbar {
  margin-top: 12px;
}

.role-management-table-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.role-management-filter-item {
  margin-left: 0;
  margin-bottom: 0;
  padding-left: 0;
  display: flex;
  align-items: center;
}

.role-management-filter-item :deep(.el-form-item__label) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  line-height: 32px;
}

.role-management-filter-item :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
