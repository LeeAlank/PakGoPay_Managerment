<template>
  <div class="sidebar">
    <!-- 侧边栏内容 -->
    <ul>
      <li>菜单项 1</li>
      <li>菜单项 2</li>
      <li>菜单项 3</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
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
