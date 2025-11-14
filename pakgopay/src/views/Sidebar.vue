<template>
  <div class="sidebar">
    <ul>
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/about">关于</router-link></li>
      <li><router-link to="/contact">联系我们</router-link></li>
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
  width: 200px;
  height: 100vh;
  background-color: green;
  position: fixed;
  top: 0;
  left: 0;
}
.sidebar ul {
  list-style-type: none;
  padding: 0;
}
.sidebar li {
  padding: 10px;
}
.sidebar a {
  text-decoration: none;
  color: #333;
}
.sidebar a.router-link-active {
  font-size: xxx-large /* 高亮当前激活的链接 */
}
</style>
