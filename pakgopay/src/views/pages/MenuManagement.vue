<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">
    菜单管理
  </div>

  <div class="toolbar">

  </div>
  <div clas="main-view-container" style="width: 96%;margin-left: 2%;height: 700px;margin-top: 5%;">
    <el-row style="float: right;margin-right: 1%;">
      <el-button style="color: lightskyblue" @click="createMenu"><SvgIcon name="add"/>新增菜单</el-button>
    </el-row>
    <el-table
    :data="menuData"
    row-key="menuId"
    border
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    style="overflow-y: scroll;height:700px"
    >
      <el-table-column
        prop="menuId"
        label="菜单ID"
        sortable
        width="180"
        align="center"
        fixed="left"
        :slot="{row}"
      />
      <el-table-column
          prop="menuName"
          label="菜单名称"
          width="180"
          align="center"
          :slot="{row}"
          fixed="left"
      />
      <el-table-column
          prop="nameEn"
          label="菜单英文名称"
          width="180"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="menuLevel"
          label="菜单层级"
          width="100"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="parentId"
          label="父级菜单ID"
          width="100"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="path"
          label="菜单path"
          width="300"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="url"
          label="菜单URL"
          width="180"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="icon"
          label="菜单图标"
          width="180"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="showItem"
          label="是否展示下级菜单"
          align="center"
          width="180"
          :slot="{row}"
      />
      <el-table-column
          prop="meta"
          label="权限参数"
          width="180"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="component"
          label="菜单组件名称"
          width="300"
          align="center"
          :slot="{row}"
      />
      <el-table-column
        width="100"
        label="操作"
        align="center"
        :slot="{row}"
        fixed="right"
      >
        <el-dropdown trigger="click">
          <SvgIcon name="more" width="30" height="30" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="editMenu">编辑</el-dropdown-item>
              <el-dropdown-item @click="deleteMenu">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-table-column>
    </el-table>
  </div>
  <div>
    <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        class="dialog"
        center="true"
        width="40%"
        style="height: 600px;border:solid 1px lightseagreen;overflow:scroll;position: relative;"
    >

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ref } from 'vue';
import {menu} from "@/api/interface/backendInterface.js";

const treeRef = ref();
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      menuData: [],
      dialogVisible: false,
      dialogTitle: '',
    }
  },
  mounted() {
    this.fetchMenuData()
  },
  methods: {
    fetchMenuData() {
      menu().then(res => {
        this.menuData = JSON.parse(res.data.data)
      })
    },
    editMenu(row) {

    },
    deleteMenu(row) {

    },
    createMenu() {
      this.dialogVisible = true;
      this.dialogTitle = '新增菜单'
    },
    cancelDialog() {
      this.dialogVisible = false;
      this.dialogTitle = ''
    },
    submit() {

    }
  }
}
</script>
<style scoped></style>