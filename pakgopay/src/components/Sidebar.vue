<template>
  <div class="sidebar">
<!--    <ul>
      <li v-for="item in menuItems" :key="item.path">
&lt;!&ndash;        <router-link :to="item.path">{{ item.title }}</router-link>&ndash;&gt;
        <Menu v-if="item.children && item.children.length > 0" :menuItems="item.children" />
      </li>
    </ul>-->
    <!-- 侧边栏内容 -->
    <ul>
      <li v-for="item in menuItems" :key="item.menuId">
          {{ item.menuName }}
        <ul v-if="item.children">
          <li v-for="child in item.children" :key="child.menuId">
            {{ child.menuName }}
          </li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>菜单项 1</li>
      <li>菜单项 2</li>
      <li>菜单项 3</li>
    </ul>
  </div>
</template>

<script>
import {menu} from "@/api/interface/backendInterface.js";
export default {
  name: 'Sidebar',
  data() {
    return {
      menuItems: []
    }
  },
  created() {
    this.queryMenus()
  },
  methods: {
    async queryMenus() {
      try {
        const response = await menu();
        this.menuItems = JSON.parse(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #f4f4f4;
  height: 100vh; /* 100% of the viewport height */
  width: 200px; /* Adjust as needed */
  position: fixed; /* Or absolute based on your layout needs */
  left: 0;
  top: 0;
}
.sidebar ul {
  list-style-type: none;
  padding: 0;
}
.sidebar li {
  padding: 15px;
  border-bottom: 1px solid #ddd;
}
</style>
