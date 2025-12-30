<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
 <div class="main-title">
   角色管理
 </div>

 <div class="main-views-container">
   <div class="toolbar" style="width: 96%">
     <el-row style="display: flex;justify-content: space-between;">
       <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
         <template #label>
           <span>角色名称:</span>
         </template>
         <el-input v-model="filterBox.roleName" placeholder="输入角色名称">
           <template #append>
             <el-button @click="getRoleInfoByRoleName">
               <SvgIcon name="search"/>搜索
             </el-button>
           </template>
         </el-input>
       </el-form-item>
       <el-form-item>
         <el-button @click="createRole"><SvgIcon name="add"/>新增</el-button>
       </el-form-item>
     </el-row>
   </div>

   <div class="main-views-form">
     <el-form>
       <el-table
           border :data="roleInfoTableData"
           class="merchantInfos-table"
           style="width: 97%"
           height="auto"
       >
         <el-table-column
             prop="roleId"
             label="ID"
             v-slot="{row}"
             align="center"
         >
           <div>
             {{row.roleId}}
           </div>
         </el-table-column>
         <el-table-column
             prop="remark"
             label="角色标识"
             v-slot="{row}"
             align="center"
         >
           <div>
             {{row.remark}}
           </div>
         </el-table-column>
         <el-table-column
             prop="roleName"
             label="名称"
             v-slot="{row}"
             align="center"
         >
           <div>
             {{row.roleName}}
           </div>
         </el-table-column>
         <el-table-column
             prop="createTime"
             label="创建时间"
             v-slot="{row}"
             align="center"
         >
           <div>
             {{row.createTime}}
           </div>
         </el-table-column>
         <el-table-column
             prop="updateTime"
             label="更新时间"
             v-slot="{row}"
             align="center"
         >
           <div>
             {{row.updateTime}}
           </div>
         </el-table-column>
         <el-table-column
             label="操作"
             v-slot="{row}"
             align="center"
         >
           <div>
             <el-dropdown trigger="click">
               <SvgIcon name="more" width="30" height="30" />
               <template #dropdown>
                 <el-dropdown-menu>
                   <el-dropdown-item @click="editRoleInfo(row)">编辑</el-dropdown-item>
                   <el-dropdown-item @click="deleteRoleInfo(row)">删除</el-dropdown-item>
                 </el-dropdown-menu>
               </template>
             </el-dropdown>
           </div>
         </el-table-column>
       </el-table>
     </el-form>
     <div style="display:flex;float: right;margin-right: 5%;height: 5%;margin-top: 2%;">
       <el-pagination
           background
           layout="sizes, prev, pager, next, jumper, total"
           :total="totalCount"
           v-model:current-page="currentPage"
           v-model:page-size="pageSize"
           :page-sizes="pageSizes"
           style="float:right; margin-right: 5%;padding-bottom: 5px;height: 100%"
           @current-change="handleChange"
           @size-change="handleSizeChange"
       >
       </el-pagination>
     </div>
   </div>
   <el-dialog
       :title="dialogTitle"
       v-model="dialogVisible"
       class="dialog"
       center="true"
       width="40%"
       style="height: 600px;border:solid 1px lightseagreen;overflow:scroll;position: relative;"
   >
     <el-form style="margin-top: 50px" :model="roleInfo" :rules="addRoleRule" ref="roleInfo">
       <div class="el-form-line">
         <el-form-item label="名称:" label-width="150px" size="medium" prop="roleName">
           <el-input type="text" v-model="roleInfo.roleName" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item label="标识:" label-width="150px" size="medium" prop="remark">
           <el-input type="text" v-model="roleInfo.remark" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item label="谷歌验证码:" label-width="150px" size="medium" prop="googleCode">
           <el-input type="text" v-model="roleInfo.googleCode" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item size="medium" style="">
           <template #label>
             <span style="color: skyblue;width: 150px;">菜单:</span>
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
       <el-button @click="cancelDialog">取 消</el-button>
       <el-button type="primary" @click="submit('roleInfo')">确 定</el-button>
     </div>
   </el-dialog>
   <el-dialog
       :title="dialogTitle2"
       v-model="dialogVisible2"
       class="dialog"
       center="true"
       width="40%"
       style="height: 600px;border:solid 1px lightseagreen;overflow:scroll;position: relative;"
   >
     <el-form style="margin-top: 50px" :model="roleInfo" :rules="addRoleRule" ref="roleInfo">
       <div class="el-form-line">
         <el-form-item label="名称:" label-width="150px" size="medium" prop="roleName">
           <el-input type="text" v-model="roleInfo.roleName" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item label="标识:" label-width="150px" size="medium" prop="remark">
           <el-input type="text" v-model="roleInfo.remark" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item label="谷歌验证码:" label-width="150px" size="medium" prop="googleCode">
           <el-input type="text" v-model="roleInfo.googleCode" style="width: 200px"></el-input>
         </el-form-item>
       </div>
       <div class="el-form-line">
         <el-form-item size="medium" style="">
           <template #label>
             <span style="color: skyblue;width: 150px;">菜单:</span>
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
       <el-button @click="cancelDialog2">取 消</el-button>
       <el-button type="primary" @click="submit2('roleInfo')">确 定</el-button>
     </div>
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
             <el-form-item label="角色名称:" label-width="150px" size="medium" prop="roleName">
               <el-input readonly autocomplete="new-password" type="text" v-model.trim="roleInfo.roleName" style="width: 200px;font-weight: bold;"></el-input>
             </el-form-item>
           </div>
         </el-col>
       </el-row>
       <el-row style="width: 100%;" class="dialog-row">
         <el-col :span="24">
           <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
             <el-form-item label-width="150px" size="medium" prop="googleCode">
               <template #label>
                 <div style="display: flex;justify-content: center;align-items: center;">
                   <SvgIcon name="must"/>
                   <div>谷歌验证码:</div>
                 </div>
               </template>
               <el-input autocomplete="new-password" type="number" v-model.trim="roleInfo.googleCode" style="width: 200px"></el-input>
             </el-form-item>
           </div>
         </el-col>
       </el-row>
     </el-form>
     <div slot="footer" class="dialog-footer" style="position: absolute; bottom: 3%;float: right;">
       <el-button @click="cancelDialog3">取 消</el-button>
       <el-button type="primary" @click="submit3('roleInfo')">确 定</el-button>
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
  roleList
} from "@/api/interface/backendInterface.js";
import {nextTick, ref} from "vue";

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
      dialogVisible3: false,
      dialogTitle3: '',
      roleInfoFormData: [],
      roleInfoTableData: [],
      addRoleInfoData:[],
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
          { required: true, message: "you need to input roleName", trigger: "blur" }
        ],
        remark: [
            { required: false, message: "you need to input roleFlag", trigger: "blur" }
        ],
        googleCode: [
            { required: true, message: "you need to input googleCode", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    getRoleInfo() {
      roleList(null).then(res => {
        this.roleInfoTableData = JSON.parse(res.data.data);
      })
    },

    getRoleInfoByRoleName() {
      roleList(this.filterBox.roleName).then(res => {
        if (res.status === 200) {
          this.roleInfoTableData = JSON.parse(res.data.data);
        } else if (res.status === 401) {
          this.$notify({
            title:'错误',
            message: 'this page is timeout, please refresh page first',
            type: 'error',
            position: 'center',
          })
        } else {
          this.$notify({
            title:'错误',
            message: 'get role info failed',
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
            title:'错误',
            message: 'get role info failed, please try later',
            type: 'error',
            position: 'center',
          })
          return;
        }
        this.menuList = JSON.parse(res.data.data).menuList;
      })
      this.dialogTitle2 = '编辑'
      this.dialogVisible2 = true
      this.roleInfo.roleId = row.roleId
      this.roleInfo.roleName = row.roleName
      this.roleInfo.remark = row.remark
      await nextTick(() => {
        treeRef2.value.setCheckedKeys(this.menuList, true);
      })
    },
    deleteRoleInfo(row) {

      this.roleInfo = {}
      this.roleInfo = row
      this.dialogVisible3 = true
      this.dialogTitle3 = '删除角色'
    },
    createRole() {
      this.dialogVisible = true;
      this.dialogTitle = '新增角色'
      this.menuData = []
      menu().then(res => {
        this.menuData = JSON.parse(res.data.data)
      })
    },
    handleSizeChange(val) {

    },
    handleChange(val) {

    },
    cancelDialog() {
      this.dialogVisible = false;
      this.dialogTitle = '';
    },
    cancelDialog2() {
      this.dialogVisible2 = false;
      this.dialogTitle2 = '';
    },
    cancelDialog3() {
      this.dialogVisible3 = false;
      this.dialogTitle3 = '';
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
          title: 'warning',
          message: 'you need to select menu for role',
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
              this.roleInfo = {}
              this.$notify({
                title: 'Success',
                message: 'add new role success',
                type: 'success',
                position: 'bottom-right'
              });
              this.getRoleInfo()
            } else if (res.data.code !== 0) {
              this.$notify({
                title: 'Error',
                message: res.data.message,
                type: 'error',
                position: 'bottom-right'
              });
            } else if (res.status === 401) {
              this.$notify({
                title: 'Error',
                message: 'this page is timeout, please refresh page first',
                type: 'error',
                position: 'bottom-right'
              });
            } else {
              this.$notify({
                title: 'Error',
                message: res.data.message,
                type: 'error',
                position: 'bottom-right'
              });
            }
          })
        } else {
          this.$notify({
            title: '错误',
            message: 'please check your typed info',
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
          title: 'warning',
          message: 'you need to select menu for role',
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
          modifyRoleInfo(that.roleInfo).then(res => {
            if (res.status === 200 && res.data.code === 0) {
              this.dialogTitle2 = ''
              this.dialogVisible2 = false
              this.roleInfo = {}
              this.$notify({
                title: 'Success',
                message: 'modified role success',
                type: 'success',
                position: 'bottom-right'
              });
            } else if (res.data.code !== 0) {
              this.$notify({
                title: 'Error',
                message: res.data.message,
                type: 'error',
                position: 'bottom-right'
              });
            } else if (res.status === 401) {
              this.$notify({
                title: 'Error',
                message: 'this page is timeout, please refresh page first',
                type: 'error',
                position: 'bottom-right'
              });
            } else {
              this.$notify({
                title: 'Error',
                message: res.data.message,
                type: 'error',
                position: 'bottom-right'
              });
            }
          })

        } else {
          this.$notify({
            title: '错误',
            message: 'please check your typed info',
            type: 'error',
            position: 'bottom-right'
          });
          return false;
        }
      });
    },
    submit3(formName) {
      this.$confirm('are you sure deleting this role:'+this.roleInfo.roleName+'?', '提示', {
        confirmButtonText: 'yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
          deleteRole(this.roleInfo).then(res => {
            if (res.status === 200) {
              if (res.data.code === 0) {
                this.$notify({
                  title: 'Success',
                  message: 'modify role info success',
                  type: 'success',
                  position: 'bottom-right'
                })
                this.getRoleInfo()
              } else {
                this.$notify({
                  title: 'Failed',
                  message: 'delete role failed',
                  type: 'error',
                  position: 'bottom-right'
                })
              }

            } else {
              this.$notify({
                title: 'Error',
                message: 'modify role info failed',
                type: 'error',
                position: 'bottom-right'
              })
            }
            this.dialogVisible3 = false;
            this.dialogTitle3 = ''
            this.roleInfo = {}
          })
      })

    }
  },
  mounted() {

  },
  created() {
    this.getRoleInfo();
    menu().then(res => {
      this.menuData = JSON.parse(res.data.data)
    })
  }
}
</script>
<style scoped>
.dialog-footer {
  bottom: 0;
  position: sticky;
  position: -webkit-sticky;
  right: 2%;
}
</style>