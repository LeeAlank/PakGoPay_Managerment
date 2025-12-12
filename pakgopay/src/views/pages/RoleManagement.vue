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
         <el-input placeholder="输入角色名称">
           <template #append>
             <el-button>
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
             prop="roleFlag"
             label="角色标识"
             v-slot="{row}"
             align="center"
         >
           <div>
             {{row.roleFlag}}
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
         <el-form-item label="标识:" label-width="150px" size="medium" prop="roleFlag">
           <el-input type="text" v-model="roleInfo.roleFlag" style="width: 200px"></el-input>
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
 </div>
</template>

<script>
import {menu} from "@/api/interface/backendInterface.js";
import { ref } from "vue";

const treeRef = ref();
export default {
  name: "RoleManagement",
  data() {
    return {
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      pageSizes: [5, 10, 15, 20],
      dialogVisible: false,
      dialogTitle: '',
      roleInfoFormData: [],
      roleInfoTableData: [],
      addRoleInfoData:[],
      roleInfo:{
        roleId: '',
        roleFlag: '',
        menuList: [],
        roleName: '',
        googleCode: '',
      },
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      menuData: [
        {
          menuId: '1',
          menuName: '数据报表',
          children: [
            {
              menuId: '1-001',
              menuName: '商户报表'
            },
            {
              menuId: '1-002',
              menuName: '渠道报表'
            },
            {
              menuId: '1-003',
              menuName: '代理报表'
            }
          ]
        },
        {
          menuId: '2',
          menuName: '商户管理'
        }
      ],
      addRoleRule: {
        roleName: [
          { required: true, message: "you need to input roleName", trigger: "blur" }
        ],
        roleFlag: [
            { required: true, message: "you need to input roleFlag", trigger: "blur" }
        ],
        googleCode: [
            { required: true, message: "you need to input googleCode", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    editRoleInfo(row) {

    },
    deleteRoleInfo(row) {

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
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
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
      let nodes = []
      nodes = treeRef.value.getCheckedNodes(false,false);
      let keys = []
      keys = treeRef.value.getCheckedKeys(false,false);
      /*this.addRoleInfoData.push(keys)*/
      this.addRoleInfoData.push(this.roleInfo)
      this.roleInfo.menuList = keys
      //调用后端接口写入数据即可
      //后端存角色表 角色-菜单表
    }
  },
  mounted() {
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