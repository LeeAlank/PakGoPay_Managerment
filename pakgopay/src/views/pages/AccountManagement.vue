<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">
    登陆用户管理
  </div>

  <div class="toolbar" style="width: 94%;margin-left: 2%;margin-top: 10px;">
    <el-row style="display: flex;justify-content: space-between;">
      <el-form-item style="display: flex;justify-content: center;color: deepskyblue">
        <template #label>
          <span>用户名称:</span>
        </template>
        <el-input v-model="filterbox.loginName" placeholder="输入用户名称">
          <template #append>
            <el-button @click="search">
              <SvgIcon name="search"/>搜索
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="createUser"><SvgIcon name="add"/>新增</el-button>
      </el-form-item>
    </el-row>
  </div>

  <div class="main-views-form" style="width: 97%;margin-left: 2%;">
    <el-table

      ref="loginUserTable"
      element-loading-text="Loading"
      :data="allUserInfo"
      style="width: 97%;height: 70vh;"
      :key="tablekey"
      border
    >
      <el-table-column
        label="用户ID"
        v-slot="{row}"
        align="center"
      >
        <div>
          {{row.userId}}
        </div>
      </el-table-column>
      <el-table-column
          label="用户名称"
          v-slot="{row}"
          align="center"
      >
        <div>
          {{row.loginName}}
        </div>
      </el-table-column>
      <el-table-column
          label="用户角色"
          v-slot="{row}"
          align="center"
      >
        <div>
          {{row.roleName}}
        </div>
      </el-table-column>
      <el-table-column
          label="用户状态"
          v-slot="{row}"
          align="center"
      >
        <div>
          <el-switch
              :model-value="row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用"
              :active-value = "1"
              :inactive-value="0"
          />
        </div>
      </el-table-column>
      <el-table-column
          width="100"
          label="操作"
          align="center"
          v-slot="{row}"
          fixed="right"
      >
        <el-dropdown trigger="click">
          <SvgIcon name="more" width="30" height="30" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="row.status === 1" @click="stopUser(row)">停用</el-dropdown-item>
              <el-dropdown-item v-if="row.status === 0" @click="startUser(row)">启用</el-dropdown-item>
              <el-dropdown-item @click="editUser(row)">编辑</el-dropdown-item>
              <el-dropdown-item @click="deleteUser(row)">删除</el-dropdown-item>
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
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        style="float:right; margin-right: 5%;"
    >
    </el-pagination>
  </div>
  <div style="display: flex; justify-content: center;width: 60%;">
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      class="dialog"
      center="true"
      width="70%"
      style="height: 600px;align-content: center"
      >
      <el-form :model="createUserInfo" style="margin-top: 50px;width: 100%" :rules="rules" ref="createUserInfo">
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="用户名称:" label-width="150px" size="medium" prop="loginName">
                <el-input auto-complete="new-password" type="text" v-model.trim="createUserInfo.loginName" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="登陆密码:" label-width="150px" size="medium" prop="password">
                <el-input autocomplete="new-password" type="password" v-model.trim="createUserInfo.password" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="确认密码:" label-width="150px" size="medium" prop="confirmPassword">
                <el-input type="password" v-model.trim="createUserInfo.confirmPassword" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item label="用户角色:" label-width="150px" size="medium" prop="roleId">
                <el-select
                  v-model.trim="createUserInfo.roleId"
                  placeholder="请选择用户角色"
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
              <el-form-item label="是否启用:" label-width="150px" size="medium">
                <el-switch
                    v-model="createUserInfo.status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="开启"
                    inactive-text="关闭"
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
              <el-form-item label="谷歌验证码:" label-width="150px" size="medium" prop="googleCode">
                <el-input autocomplete="new-password" type="number" v-model.trim="createUserInfo.googleCode" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
<!--        <el-row style="width: 100%" class="dialog-row">
          <el-col :span="8">
            <div class="el-form-line">
              <el-form-item style="display: flex;justify-content: space-between;border: solid 1px red;">
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button type="primary" @click="submit('createUserInfo')">确 定</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-row>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="submit('createUserInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
        :title="dialogTitle2"
        v-model="dialogVisible2"
        class="dialog"
        center="true"
        width="40%"
        style="height: 250px;align-content: center"
    >
      <el-form style="margin-top: 20px;width: 100%"
               :model="stopUserInfo"
      >
        <el-row style="width: 100%;" class="dialog-row">
          <el-col :span="24">
            <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item label="停用用户名:" label-width="150px" size="medium" prop="googleCode">
                <el-input readonly autocomplete="new-password" type="text" v-model.trim="stopUserInfo.loginName" style="width: 200px;font-weight: bold;"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="width: 100%;" class="dialog-row">
          <el-col :span="24">
            <div class="el-form-line" style="display: flex;justify-content: center;align-items: center;">
              <el-form-item label="谷歌验证码:" label-width="150px" size="medium" prop="googleCode">
                <el-input autocomplete="new-password" type="number" v-model.trim="stopUserInfo.googleCode" style="width: 200px"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog2">取 消</el-button>
        <el-button type="primary" @click="submit2('createUserInfo')">确 定</el-button>
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
  manageLoginUserStatus, deleteLoginUser, loginUserByLoginName
} from "@/api/interface/backendInterface.js";

export default {

  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'))
      } else {
        if (this.createUserInfo.confirmPassword !== '' && this.createUserInfo.confirmPassword !== 'undefined') {
          this.$refs.createUserInfo.validateField('confirmPassword');
        }
        callback()
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.createUserInfo.password) {
        callback(new Error("两次输入都密码不一致"))
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
      createUserInfo: {},
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
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        googleCode: [
          { required: true, message: '请输入谷歌验证码', trigger: 'blur' }
        ]
      },

    }
  },
  created() {
    this.loadData()
  },
  methods: {
    createUser() {
      this.dialogVisible = true;
      this.dialogTitle = '创建用户'
    },
    search() {
      if(!this.filterbox.loginName) {
        this.loadData()
        return
      }
      loginUserByLoginName(this.filterbox.loginName).then(response => {
           if(response.status === 200 && response.data.code === 0) {
             this.allUserInfo = [];
             this.allUserInfo.push(JSON.parse(response.data.data))
             try {
               this.allUserInfo.forEach((item) => {
                 item.roleId = this.roleInfoOptions.forEach(roleInfo => {
                   if (item.roleId !== undefined && roleInfo.roleId === item.roleId) {
                     item.roleName = roleInfo.roleName
                   }
                 })
               })
             } catch (e) {
               console.log(e)
             }
             this.totalCount = this.allUserInfo.length
             this.tablekey++
           }
        })
    },
    editUser(row) {
      this.createUserInfo = row;
      this.dialogVisible = true;
      this.dialogTitle = '编辑'
    },
    deleteUser(row) {
      this.dialogVisible2 = true;
      this.dialogTitle2 = '删除用户'
      this.stopUserInfo = row
      this.stopUserInfo.type = 'delete'
    },
    stopUser(row) {
      this.dialogVisible2 = true;
      this.dialogTitle2 = '停用用户'
      this.stopUserInfo = row
      this.stopUserInfo.status = 0
    },
    startUser(row) {
      this.dialogVisible2 = true;
      this.dialogTitle2 = '启用用户'
      this.stopUserInfo = row
      this.stopUserInfo.status = 1
    },
    handleCurrentChange(currentPage) {

    },
    handleSizeChange(pageSize) {

    },
    cancelDialog() {
      this.dialogVisible = false;
      this.dialogTitle = ''
      this.passwordmatch = true
      this.createUserInfo = {}
    },
    cancelDialog2() {
      this.dialogVisible2 = false
      this.dialogTitle2 = ''
      this.stopUserInfo = {}
      this.googleCode = ''
      this.loadData()
    },
    submit2(formName) {
      if (this.stopUserInfo.googleCode ==='defined' || this.stopUserInfo.googleCode === '' || this.stopUserInfo.googleCode === null) {
        this.$notify({
          title:'错误',
          message: 'you need to input google code first!',
          type: 'error',
          position: 'bottom-right',
        })
      }
      if (this.stopUserInfo.type === 'delete') {
        this.$confirm('are you sure deleting this user:'+this.stopUserInfo.loginName+'?', '提示', {
          confirmButtonText: 'yes',
          cancelButtonText: 'No',
          type: 'warning',
        }).then(() => {
          deleteLoginUser(this.stopUserInfo.userId, this.stopUserInfo.googleCode).then(response => {
              if (response.status === 200 && response.data.code === 0) {
                this.dialogVisible2 = false
                this.dialogTitle2 = ""
                this.loadData()
                this.$notify({
                  title:'Success',
                  message: response.data.message,
                  type: 'success',
                  position: 'bottom-right',
                })
              } else if (response.status === 401) {
                this.$notify({
                  title:'Notice',
                  message: "Token is expired! refresh page again",
                  type: 'info',
                  position: 'bottom-right',
                })
              } else {
                this.$notify({
                  title:'Error',
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
              title:'Success',
              message: 'start user success',
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
                title: 'Failed',
                message: 'create new user failed.',
                type: 'error',
                position: 'bottom-right'
              });
            }
            if (response.data.code === 0) {
              this.dialogVisible = false
              this.dialogTitle = ""
              this.loadData()
              this.$notify({
                title: 'Success',
                message: 'create new user successfully.',
                type: 'success',
                position: 'bottom-right'
              });
            }
            if (response.data.code === 1) {
              this.$notify({
                title: 'Failed',
                message: response.data.message,
                type: 'error',
                position: 'bottom-right'
              })
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
      await loginUserList().then(response => {
        if (response.status === 401) {
          refreshAccessToken(localStorage.getItem("refreshToken"));
        } else if (response.status !== 200 && response.status !== 401) {
          this.$notify({
            title: '错误',
            message: 'get role info failed',
            type: 'error',
            position: 'top-right',
          })
        } else if (response.status === 200) {
          if (response.data.code === 0 && response.data.data.length > 0) {
            this.allUserInfoFromDababase = JSON.parse(response.data.data)
          }
        }
      })
      this.allUserInfo = [];
      this.allUserInfo = this.allUserInfoFromDababase
      try {
        this.allUserInfo.forEach((item) => {
          item.roleId = this.roleInfoOptions.forEach(roleInfo => {
            if (item.roleId !== undefined && roleInfo.roleId === item.roleId) {
              item.roleName = roleInfo.roleName
            }
          })
        })
      } catch (e) {
        console.log(e)
      }
      this.totalCount = this.allUserInfo.length
      this.tablekey++
      this.loading = false
    }
  },
  async mounted() {

    await roleList(null).then(response => {
      if (response.status === 401) {
        refreshAccessToken(localStorage.getItem("refreshToken"));
      } else if (response.status !== 200 && response.status !== 401) {
        this.$notify({
          title: '错误',
          message: 'get role info failed',
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