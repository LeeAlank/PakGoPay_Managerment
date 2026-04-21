<script setup>

import SvgIcon from "@/components/SvgIcon/index.vue";
</script>

<template>
  <div class="main-title">
    {{ $t('menuManagement.title') }}
  </div>

  <div class="toolbar">

  </div>
  <div clas="main-view-container" style="width: 96%;margin-left: 2%;height: 700px;margin-top: 5%;">
    <el-row style="float: right;margin-right: 1%;">
      <el-button style="color: #ffffff" @click="createMenu"><SvgIcon name="add"/>{{ $t('menuManagement.action.add') }}</el-button>
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
        :label="$t('menuManagement.column.menuId')"
        sortable
        width="180"
        align="center"
        fixed="left"
        :slot="{row}"
      />
      <el-table-column
          prop="menuName"
          :label="$t('menuManagement.column.menuName')"
          width="180"
          align="center"
          :slot="{row}"
          fixed="left"
      />
      <el-table-column
          prop="nameEn"
          :label="$t('menuManagement.column.menuNameEn')"
          width="180"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="menuLevel"
          :label="$t('menuManagement.column.menuLevel')"
          width="100"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="parentId"
          :label="$t('menuManagement.column.parentId')"
          width="100"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="path"
          :label="$t('menuManagement.column.path')"
          width="300"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="url"
          :label="$t('menuManagement.column.url')"
          width="180"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="icon"
          :label="$t('menuManagement.column.icon')"
          width="180"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="showItem"
          :label="$t('menuManagement.column.showChildren')"
          align="center"
          width="180"
          :slot="{row}"
      />
      <el-table-column
          prop="meta"
          :label="$t('menuManagement.column.permission')"
          width="180"
          align="center"
          :slot="{row}"
      />
      <el-table-column
          prop="component"
          :label="$t('menuManagement.column.component')"
          width="300"
          align="center"
          :slot="{row}"
      />
      <el-table-column
        width="100"
        :label="$t('common.operation')"
        align="center"
        :slot="{row}"
        fixed="right"
      >
        <el-dropdown trigger="click">
          <SvgIcon name="more" width="30" height="30" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="editMenu">{{ $t('common.edit') }}</el-dropdown-item>
              <el-dropdown-item @click="deleteMenu">{{ $t('common.operate.delete') }}</el-dropdown-item>
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
        <el-button @click="cancelDialog">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('common.confirm') }}</el-button>
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
      this.dialogTitle = this.$t('menuManagement.dialog.addTitle')
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
